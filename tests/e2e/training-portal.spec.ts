import fs from "node:fs";
import path from "node:path";

import { expect, test, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

type EnvMap = Record<string, string>;

function loadEnvFile(): EnvMap {
  const envPath = path.join(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    return {};
  }

  return fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .reduce<EnvMap>((accumulator, line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        return accumulator;
      }

      const delimiterIndex = trimmed.indexOf("=");
      if (delimiterIndex === -1) {
        return accumulator;
      }

      const key = trimmed.slice(0, delimiterIndex).trim();
      const rawValue = trimmed.slice(delimiterIndex + 1).trim();
      const value =
        rawValue.startsWith("\"") && rawValue.endsWith("\"")
          ? rawValue.slice(1, -1)
          : rawValue.startsWith("'") && rawValue.endsWith("'")
            ? rawValue.slice(1, -1)
            : rawValue;

      accumulator[key] = value;
      return accumulator;
    }, {});
}

const repoEnv = loadEnvFile();

function readEnv(name: string) {
  return process.env[name] ?? repoEnv[name] ?? "";
}

const adminEmail = readEnv("ADMIN_EMAIL") || "hello@tacklersconsulting.com";
const adminPassword = readEnv("ADMIN_PASSWORD") || "Hello@123";
const supabaseUrl = readEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabasePublishableKey =
  readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY") ||
  readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
const supabaseServiceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");
const learnerPassword = "LeanPortal!234";

async function provisionLearnerUser() {
  if (!supabaseUrl || !supabaseServiceRoleKey || !supabasePublishableKey) {
    return null;
  }

  const learnerEmail = `e2e-learner-${Date.now()}@tacklersconsulting.com`;
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await supabase.auth.admin.createUser({
    email: learnerEmail,
    email_confirm: true,
    password: learnerPassword,
    user_metadata: {
      full_name: "E2E Learner",
      role_title: "Learner",
    },
  });

  if (error) {
    throw error;
  }

  const client = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const signIn = await client.auth.signInWithPassword({
    email: learnerEmail,
    password: learnerPassword,
  });

  if (signIn.error || !signIn.data.session) {
    throw signIn.error ?? new Error("Unable to create a learner session for the regression test.");
  }

  return {
    email: learnerEmail,
    password: learnerPassword,
    session: {
      accessToken: signIn.data.session.access_token,
      refreshToken: signIn.data.session.refresh_token,
    },
  };
}

async function signInAsAdmin(page: Page) {
  await page.goto("/sign-in/admin");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  const persistResult = await page.evaluate(async (credentials) => {
    const response = await fetch("/api/admin/session", {
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    return {
      ok: response.ok,
      text: await response.text(),
    };
  }, {
    email: adminEmail,
    password: adminPassword,
  });

  expect(persistResult.ok, persistResult.text).toBeTruthy();
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin$/);
}

async function signInAsLearner(
  page: Page,
  credentials: { email: string; password: string; session: { accessToken: string; refreshToken: string } },
) {
  await page.goto("/sign-in");
  const persistResult = await page.evaluate(async (session) => {
    const response = await fetch("/api/auth/session", {
      body: JSON.stringify(session),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    return {
      ok: response.ok,
      text: await response.text(),
    };
  }, {
    accessToken: credentials.session.accessToken,
    refreshToken: credentials.session.refreshToken,
  });

  expect(persistResult.ok, persistResult.text).toBeTruthy();
  await page.goto("/client-hub");
  await expect(page).toHaveURL(/\/client-hub/);
}

test.describe.serial("training portal regression coverage", () => {
  let learnerCredentials: { email: string; password: string; session: { accessToken: string; refreshToken: string } } | null = null;

  test.beforeAll(async () => {
    learnerCredentials = await provisionLearnerUser();
  });

  test("protects learner routes when signed out", async ({ page }) => {
    await page.goto("/client-hub/schedule");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("renders the admin training execution surfaces", async ({ page }) => {
    await signInAsAdmin(page);

    await page.goto("/admin/training");
    await expect(page.getByText("Cohort lifecycle operations")).toBeVisible();
    await expect(page.getByRole("button", { name: /Close out cohort/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Add trainer/i }).first()).toBeVisible();

    await page.goto("/admin/sessions");
    await expect(page.getByText("Attendance capture and reminders")).toBeVisible();
    await expect(page.getByText("Virtual link").first()).toBeVisible();
    await expect(page.getByText("Facilitator notes").first()).toBeVisible();

    await page.goto("/admin/resources");
    await expect(page.getByText("Versioning and retirement")).toBeVisible();
    await expect(page.getByRole("button", { name: /Save resource/i }).first()).toBeVisible();

    await page.goto("/admin/notifications");
    await expect(page.getByText("Reminder operations console")).toBeVisible();
    await expect(page.getByRole("button", { name: /Run reminder automation/i })).toBeVisible();

    await page.goto("/admin/learners");
    await expect(page.getByText("Role assignment and access control")).toBeVisible();
    await expect(page.getByRole("button", { name: /Resend invite|Deactivate access|Reactivate access/i }).first()).toBeVisible();
  });

  test("renders the learner drilldown, timeline, and evidence submission surfaces", async ({ page }) => {
    test.skip(!learnerCredentials, "Requires Supabase service-role access to provision a learner user.");

    await signInAsLearner(page, learnerCredentials as { email: string; password: string; session: { accessToken: string; refreshToken: string } });

    await page.goto("/client-hub/syllabus");
    await expect(page.getByText("Live module drilldown")).toBeVisible();

    await page.goto("/client-hub/resources");
    await expect(page.getByText("Versioned resource library")).toBeVisible();

    await page.goto("/client-hub/progress");
    await expect(page.getByText("Milestone timeline")).toBeVisible();

    await page.goto("/client-hub/assessments");
    await expect(page.getByText("Assessment queue")).toBeVisible();
    await expect(page.getByText("Accepted formats: PDF, Office docs, CSV, TXT, PNG, JPG, and JPEG up to 10 MB.").first()).toBeVisible();

    await page.goto("/client-hub/schedule");
    await expect(page.getByText("Joining details")).toBeVisible();
    await expect(page.getByText("Follow-up actions")).toBeVisible();
  });
});

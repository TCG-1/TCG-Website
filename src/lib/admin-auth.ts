import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

const ADMIN_SESSION_COOKIE = "tcg_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const DEV_ADMIN_EMAIL = "hello@tacklersconsulting.com";
const DEV_ADMIN_NAME = "Tacklers Admin";
const DEV_ADMIN_PASSWORD = "Hello@123";
const DEV_ADMIN_SESSION_SECRET = "local-dev-admin-session-secret";

export type AdminUser = {
  email: string;
  name: string;
};

type AdminConfig =
  | {
      configured: true;
      password: string;
      sessionSecret: string;
      user: AdminUser;
    }
  | {
      configured: false;
      error: string;
    };

function getAdminConfig(): AdminConfig {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? "";
  const name = process.env.ADMIN_NAME?.trim() || DEV_ADMIN_NAME;

  if (email && password && sessionSecret) {
    return {
      configured: true,
      password,
      sessionSecret,
      user: {
        email,
        name,
      },
    };
  }

  if (process.env.NODE_ENV !== "production") {
    return {
      configured: true,
      password: DEV_ADMIN_PASSWORD,
      sessionSecret: DEV_ADMIN_SESSION_SECRET,
      user: {
        email: DEV_ADMIN_EMAIL,
        name: DEV_ADMIN_NAME,
      },
    };
  }

  return {
    configured: false,
    error:
      "Admin auth is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.",
  };
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signSessionPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function createSessionToken(email: string, secret: string) {
  const payload = Buffer.from(
    JSON.stringify({
      email,
      issuedAt: Date.now(),
    }),
  ).toString("base64url");

  return `${payload}.${signSessionPayload(payload, secret)}`;
}

function readSessionEmail(token: string, config: Extract<AdminConfig, { configured: true }>) {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signSessionPayload(payload, config.sessionSecret);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
      issuedAt?: number;
    };

    if (typeof parsed.email !== "string" || typeof parsed.issuedAt !== "number") {
      return null;
    }

    if (Date.now() - parsed.issuedAt > ADMIN_SESSION_MAX_AGE * 1000) {
      return null;
    }

    const normalizedEmail = parsed.email.trim().toLowerCase();
    return safeEqual(normalizedEmail, config.user.email) ? config.user.email : null;
  } catch {
    return null;
  }
}

export function getAdminConfigError() {
  const config = getAdminConfig();
  return config.configured ? null : config.error;
}

export function isAdminEmail(email?: string | null) {
  const config = getAdminConfig();

  if (!config.configured || !email) {
    return false;
  }

  return safeEqual(email.trim().toLowerCase(), config.user.email);
}

export function validateAdminCredentials(email: string, password: string) {
  const config = getAdminConfig();

  if (!config.configured) {
    return {
      message: config.error,
      ok: false as const,
      status: 503,
    };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!safeEqual(normalizedEmail, config.user.email) || !safeEqual(password, config.password)) {
    return {
      message: "Invalid email or password.",
      ok: false as const,
      status: 401,
    };
  }

  return {
    ok: true as const,
    user: config.user,
  };
}

export async function getAdminUser() {
  const config = getAdminConfig();

  if (!config.configured) {
    return {
      configured: false as const,
      error: config.error,
      user: null,
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const sessionEmail = token ? readSessionEmail(token, config) : null;

  if (sessionEmail) {
    return {
      configured: true as const,
      user: config.user,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user: portalUser },
  } = await supabase.auth.getUser();

  if (isAdminEmail(portalUser?.email)) {
    return {
      configured: true as const,
      user: config.user,
    };
  }

  return {
    configured: true as const,
    user: null,
  };
}

export async function createAdminSession() {
  const config = getAdminConfig();

  if (!config.configured) {
    throw new Error(config.error);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(config.user.email, config.sessionSecret), {
    httpOnly: true,
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return config.user;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function requireAdminUser() {
  const auth = await getAdminUser();

  if (!auth.configured) {
    redirect("/sign-in?error=admin-config");
  }

  if (!auth.user) {
    redirect("/sign-in");
  }

  return auth.user;
}

export async function requireAdminApiRequest() {
  const auth = await getAdminUser();

  if (!auth.configured) {
    return Response.json({ error: auth.error }, { status: 503 });
  }

  if (!auth.user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  return null;
}

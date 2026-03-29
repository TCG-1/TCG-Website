import { expect, test, type Page } from "@playwright/test";

const adminEmail = process.env.ADMIN_EMAIL ?? "hello@tacklersconsulting.com";
const adminPassword = process.env.ADMIN_PASSWORD ?? "Hello@123";

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

test.describe.serial("admin newsletter QA", () => {
  test("shows Newsletters tab and posts subject/body payload with clear result summary", async ({ page }) => {
    await signInAsAdmin(page);

    const newslettersLink = page.getByRole("link", { name: /Newsletters/i }).first();
    await expect(newslettersLink).toBeVisible();
    await newslettersLink.click();

    await expect(page).toHaveURL(/\/admin\/newsletters$/);
    await expect(page.getByRole("heading", { name: "Send newsletter to all leads" })).toBeVisible();

    const newsletterBody = "Line one of QA newsletter.\nLine two for formatting check.";
    const newsletterSubject = "QA Subject - Admin Newsletter";
    const bodyTextarea = page.locator("#newsletter-body");
    const subjectInput = page.locator("#newsletter-subject");
    await expect(subjectInput).toBeVisible();
    await expect(subjectInput).toHaveAttribute("placeholder", "Enter newsletter subject (optional)");
    await subjectInput.fill(newsletterSubject);
    await expect(bodyTextarea).toBeVisible();
    await bodyTextarea.fill(newsletterBody);

    let postedPayload: Record<string, unknown> | null = null;
    await page.route("**/api/admin/newsletters", async (route) => {
      postedPayload = route.request().postDataJSON() as Record<string, unknown>;

      await route.fulfill({
        body: JSON.stringify({
          confirmationRecipients: ["hello@tacklersconsulting.com", "audrey@tacklersconsulting.com"],
          confirmationSent: true,
          failed: 1,
          failedRecipients: ["failed@example.com"],
          sent: 2,
          totalLeads: 3,
        }),
        contentType: "application/json",
        status: 200,
      });
    });

    await page.getByRole("button", { name: /Send to all leads/i }).click();

    expect(postedPayload).toEqual({ body: newsletterBody, subject: newsletterSubject });

    await expect(page.getByText("Newsletter completed: 2/3 delivered, 1 failed. Confirmation sent.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Failed recipients" })).toBeVisible();
    await expect(page.getByText("failed@example.com")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Confirmation recipients" })).toBeVisible();
    await expect(page.getByText("hello@tacklersconsulting.com")).toBeVisible();
    await expect(page.getByText("audrey@tacklersconsulting.com")).toBeVisible();
  });

  test("submits to live API and shows returned completion message", async ({ page }) => {
    await signInAsAdmin(page);
    await page.goto("/admin/newsletters");
    await expect(page).toHaveURL(/\/admin\/newsletters$/);

    const newsletterBody = `QA live dispatch check at ${new Date().toISOString()}`;
    const newsletterSubject = "Live QA newsletter subject";
    await page.locator("#newsletter-subject").fill(newsletterSubject);
    await page.locator("#newsletter-body").fill(newsletterBody);

    const [response] = await Promise.all([
      page.waitForResponse((candidate) =>
        candidate.url().includes("/api/admin/newsletters") && candidate.request().method() === "POST",
      ),
      page.getByRole("button", { name: /Send to all leads/i }).click(),
    ]);

    if (response.status() === 503) {
      await expect(
        page.getByText("SMTP is not configured. Newsletter delivery is blocked until SMTP credentials are set."),
      ).toBeVisible();
      return;
    }

    expect(response.ok()).toBeTruthy();

    const payload = (await response.json()) as {
      confirmationRecipients: string[];
      confirmationSent: boolean;
      failed: number;
      failedRecipients: string[];
      sent: number;
      totalLeads: number;
    };

    expect(typeof payload.totalLeads).toBe("number");
    expect(typeof payload.sent).toBe("number");
    expect(typeof payload.failed).toBe("number");
    expect(Array.isArray(payload.failedRecipients)).toBeTruthy();
    expect(payload.confirmationSent).toBeTruthy();
    expect(Array.isArray(payload.confirmationRecipients)).toBeTruthy();

    const expectedMessage =
      payload.failed > 0
        ? `Newsletter completed: ${payload.sent}/${payload.totalLeads} delivered, ${payload.failed} failed. Confirmation sent.`
        : `Newsletter delivered to ${payload.sent} lead${payload.sent === 1 ? "" : "s"}. Confirmation sent.`;

    await expect(page.getByText(expectedMessage)).toBeVisible();
  });
});

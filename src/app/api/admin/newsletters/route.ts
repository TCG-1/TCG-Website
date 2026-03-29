import { renderEmailShell } from "@/lib/branded-email";
import { createNewsletterSubscriptionToken, listUnsubscribedEmails } from "@/lib/newsletter-subscription";
import { createAdminAuditEntry, ensureAdminPortalContext } from "@/lib/portal-data";
import { absoluteUrl } from "@/lib/site-seo";
import { getAdminInboxRecipients, isSmtpConfigured, sendEmail } from "@/lib/smtp";

export const runtime = "nodejs";

const NEWSLETTER_SUBJECT = "Latest update from Tacklers Consulting Group";
const REQUIRED_CONFIRMATION_RECIPIENTS = ["hello@tacklersconsulting.com", "audrey@tacklersconsulting.com"];
const PRIMARY_CTA_URL = "/discovery-call";
const SECONDARY_CTA_URL = "/operational-excellence-consulting-uk";
const SUPPRESSED_LOCAL_PART_PATTERNS = [/^e2e-/i, /^probe-/i, /^qa-/i, /^test-/i, /^test\d*/i];
const SUPPRESSED_DOMAIN_PATTERNS = [/\.example$/i, /^example\./i];

type NewsletterRecipient = {
  email: string;
  full_name: string;
  id: string;
  source: "lead_submissions" | "client_accounts";
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isSuppressedRecipientEmail(email: string) {
  const normalized = normalizeEmail(email);
  const [localPart, domain = ""] = normalized.split("@");

  if (!localPart || !domain) {
    return true;
  }

  if (SUPPRESSED_LOCAL_PART_PATTERNS.some((pattern) => pattern.test(localPart))) {
    return true;
  }

  if (SUPPRESSED_DOMAIN_PATTERNS.some((pattern) => pattern.test(domain))) {
    return true;
  }

  return false;
}

function normalizeLeadName(value: string) {
  return value.trim() || "there";
}

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

function dedupeRecipients(rows: NewsletterRecipient[]) {
  const byEmail = new Map<string, NewsletterRecipient>();

  for (const row of rows) {
    const email = normalizeEmail(row.email);

    if (!email || byEmail.has(email)) {
      continue;
    }

    byEmail.set(email, {
      ...row,
      email,
      full_name: normalizeLeadName(row.full_name),
    });
  }

  return Array.from(byEmail.values());
}

export async function POST(request: Request) {
  try {
    if (!isSmtpConfigured()) {
      return Response.json(
        {
          error: "SMTP is not configured. Newsletter delivery is blocked until SMTP credentials are set.",
        },
        { status: 503 },
      );
    }

    const { account, supabase } = await ensureAdminPortalContext();
    const body = (await request.json()) as Record<string, unknown>;
    const newsletterBody = normalizeText(body.body);
    const newsletterSubject = normalizeText(body.subject) || NEWSLETTER_SUBJECT;

    if (!newsletterBody) {
      return Response.json({ error: "Newsletter body is required." }, { status: 400 });
    }

    const [{ data: leads, error: leadsError }, { data: signups, error: signupsError }] = await Promise.all([
      supabase
        .from("lead_submissions")
        .select("id, full_name, email, updated_at")
        .order("updated_at", { ascending: false }),
      supabase
        .from("client_accounts")
        .select("id, full_name, email, status, updated_at")
        .order("updated_at", { ascending: false }),
    ]);

    if (leadsError) {
      throw new Error(leadsError.message);
    }

    if (signupsError) {
      throw new Error(signupsError.message);
    }

    const leadRecipients: NewsletterRecipient[] = ((leads ?? []) as Array<{ id: string; full_name: string; email: string }>).map(
      (lead) => ({
        email: lead.email,
        full_name: lead.full_name,
        id: lead.id,
        source: "lead_submissions",
      }),
    );
    const signupRecipients: NewsletterRecipient[] = ((signups ?? []) as Array<{ id: string; email: string; full_name: string | null; status: string }> )
      .filter((signup) => !["archived", "revoked", "inactive"].includes((signup.status ?? "").toLowerCase()))
      .map((signup) => ({
        email: signup.email,
        full_name: signup.full_name ?? "there",
        id: signup.id,
        source: "client_accounts",
      }));

    const mergedRecipients = dedupeRecipients([...leadRecipients, ...signupRecipients]).filter(
      (recipient) => recipient.email.includes("@"),
    );
    const unsubscribedEmails = await listUnsubscribedEmails(mergedRecipients.map((recipient) => recipient.email));
    const skippedUnsubscribed = mergedRecipients.filter((recipient) => unsubscribedEmails.has(recipient.email)).length;
    const recipients = mergedRecipients.filter(
      (recipient) => !unsubscribedEmails.has(recipient.email) && !isSuppressedRecipientEmail(recipient.email),
    );
    const skippedSuppressed = mergedRecipients.filter(
      (recipient) => !unsubscribedEmails.has(recipient.email) && isSuppressedRecipientEmail(recipient.email),
    ).length;
    const failedRecipients: string[] = [];

    for (const recipient of recipients) {
      try {
        const token = createNewsletterSubscriptionToken(recipient.email);
        const unsubscribeUrl = absoluteUrl(
          `/newsletter/subscription?token=${encodeURIComponent(token)}&action=unsubscribe`,
        );
        const primaryCtaUrl = absoluteUrl(PRIMARY_CTA_URL);
        const secondaryCtaUrl = absoluteUrl(SECONDARY_CTA_URL);
        const sections = `
          <div style="margin:24px auto 6px;max-width:520px;padding:20px;border:1px solid #e2e8f0;border-radius:18px;background:#f8fafc;text-align:center;">
            <div style="margin:0 auto;">
              <a href="${primaryCtaUrl}" style="display:inline-block;padding:11px 18px;border-radius:999px;background:#8a0917;color:#ffffff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Book Discovery Call</a>
              <a href="${secondaryCtaUrl}" style="display:inline-block;margin-left:10px;padding:11px 18px;border-radius:999px;background:#ffffff;color:#334155;border:1px solid #d1d5db;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Explore Services</a>
            </div>
            <div style="margin-top:14px;">
              <a href="${unsubscribeUrl}" style="display:inline-block;padding:10px 16px;border-radius:999px;background:#f1f5f9;color:#334155;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Unsubscribe</a>
            </div>
            <p style="margin:10px 0 0;font-size:12px;line-height:1.7;color:#64748b;">If you no longer want these newsletter updates, use the unsubscribe button.</p>
          </div>
        `;

        const html = await renderEmailShell({
          greetingPrefix: "Dear",
          intro: newsletterBody,
          sections,
          subject: newsletterSubject,
          userName: recipient.full_name,
        });

        await sendEmail({
          html,
          subject: newsletterSubject,
          text: `Dear ${recipient.full_name},\n\n${newsletterBody}`,
          to: recipient.email,
        });
      } catch {
        failedRecipients.push(recipient.email);
      }
    }

    const sent = recipients.length - failedRecipients.length;
    const confirmationRecipients = Array.from(
      new Set([...getAdminInboxRecipients(), ...REQUIRED_CONFIRMATION_RECIPIENTS]),
    );

    const confirmationHtml = await renderEmailShell({
      intro: `The newsletter dispatch has completed. Subject: ${newsletterSubject}. Total recipients processed: ${recipients.length}. Delivered: ${sent}. Failed: ${failedRecipients.length}.`,
      sections:
        failedRecipients.length > 0
          ? `<p style="margin:12px 0 0;font-size:14px;line-height:1.8;color:#475569;"><strong>Failed recipients:</strong> ${failedRecipients.join(", ")}</p>`
          : "",
      subject: "Newsletter dispatch completed",
    });

    try {
      await sendEmail({
        html: confirmationHtml,
        subject: "Newsletter dispatch completed",
        text:
          failedRecipients.length > 0
            ? `Newsletter dispatch completed. Subject: ${newsletterSubject}. Total: ${recipients.length}, Delivered: ${sent}, Failed: ${failedRecipients.length}. Failed recipients: ${failedRecipients.join(", ")}`
            : `Newsletter dispatch completed. Subject: ${newsletterSubject}. Total: ${recipients.length}, Delivered: ${sent}, Failed: 0.`,
        to: confirmationRecipients,
      });
    } catch (confirmationError) {
      const confirmationErrorMessage =
        confirmationError instanceof Error ? confirmationError.message : "Unknown confirmation email error.";
      return Response.json(
        {
          error: `Lead newsletter dispatch completed (delivered ${sent}/${recipients.length}, failed ${failedRecipients.length}), but confirmation email failed: ${confirmationErrorMessage}`,
          failed: failedRecipients.length,
          failedRecipients,
          sent,
          totalLeads: recipients.length,
        },
        { status: 502 },
      );
    }

    await createAdminAuditEntry({
      actionType: "newsletter_sent",
      entityTable: "lead_submissions",
      payload: {
        failed: failedRecipients.length,
        subject: newsletterSubject,
        sender: account.email,
        sent,
        totalLeads: recipients.length,
      },
      summary: `Newsletter sent to ${sent} of ${recipients.length} recipients.`,
    });

    return Response.json({
      confirmationRecipients,
      confirmationSent: true,
      failed: failedRecipients.length,
      failedRecipients,
      skippedUnsubscribed,
      skippedSuppressed,
      sent,
      totalCandidates: mergedRecipients.length,
      totalLeads: recipients.length,
    });
  } catch (error) {
    return toResponseError(error, "Unable to send newsletter right now.");
  }
}

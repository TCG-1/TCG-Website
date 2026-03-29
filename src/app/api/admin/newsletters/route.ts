import { renderEmailShell } from "@/lib/branded-email";
import { createAdminAuditEntry, ensureAdminPortalContext } from "@/lib/portal-data";
import { getAdminInboxRecipients, isSmtpConfigured, sendEmail } from "@/lib/smtp";

export const runtime = "nodejs";

const NEWSLETTER_SUBJECT = "Latest update from Tacklers Consulting Group";
const REQUIRED_CONFIRMATION_RECIPIENTS = ["hello@tacklersconsulting.com", "audrey@tacklersconsulting.com"];

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

    const recipients = dedupeRecipients([...leadRecipients, ...signupRecipients]).filter((recipient) => recipient.email.includes("@"));
    const failedRecipients: string[] = [];

    for (const recipient of recipients) {
      try {
        const html = await renderEmailShell({
          greetingPrefix: "Dear",
          intro: newsletterBody,
          sections: "",
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
      sent,
      totalLeads: recipients.length,
    });
  } catch (error) {
    return toResponseError(error, "Unable to send newsletter right now.");
  }
}

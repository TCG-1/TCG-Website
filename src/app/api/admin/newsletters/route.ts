import { renderEmailShell } from "@/lib/branded-email";
import { createAdminAuditEntry, ensureAdminPortalContext } from "@/lib/portal-data";
import { getAdminInboxRecipients, isSmtpConfigured, sendEmail } from "@/lib/smtp";

export const runtime = "nodejs";

const NEWSLETTER_SUBJECT = "Latest update from Tacklers Consulting Group";
const REQUIRED_CONFIRMATION_RECIPIENTS = ["hello@tacklersconsulting.com", "audrey@tacklersconsulting.com"];

type LeadRecipient = {
  email: string;
  full_name: string;
  id: string;
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

function dedupeLeadRecipients(rows: LeadRecipient[]) {
  const byEmail = new Map<string, LeadRecipient>();

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

    if (!newsletterBody) {
      return Response.json({ error: "Newsletter body is required." }, { status: 400 });
    }

    const { data: leads, error: leadsError } = await supabase
      .from("lead_submissions")
      .select("id, full_name, email, updated_at")
      .order("updated_at", { ascending: false });

    if (leadsError) {
      throw new Error(leadsError.message);
    }

    const recipients = dedupeLeadRecipients((leads ?? []) as LeadRecipient[]).filter((lead) => lead.email.includes("@"));
    const failedRecipients: string[] = [];

    for (const recipient of recipients) {
      try {
        const html = await renderEmailShell({
          greetingPrefix: "Dear",
          intro: newsletterBody,
          sections: "",
          subject: NEWSLETTER_SUBJECT,
          userName: recipient.full_name,
        });

        await sendEmail({
          html,
          subject: NEWSLETTER_SUBJECT,
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
      intro: `The newsletter dispatch has completed. Total leads processed: ${recipients.length}. Delivered: ${sent}. Failed: ${failedRecipients.length}.`,
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
            ? `Newsletter dispatch completed. Total: ${recipients.length}, Delivered: ${sent}, Failed: ${failedRecipients.length}. Failed recipients: ${failedRecipients.join(", ")}`
            : `Newsletter dispatch completed. Total: ${recipients.length}, Delivered: ${sent}, Failed: 0.`,
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
        sender: account.email,
        sent,
        totalLeads: recipients.length,
      },
      summary: `Newsletter sent to ${sent} of ${recipients.length} lead recipients.`,
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

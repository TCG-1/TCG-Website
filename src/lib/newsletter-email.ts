import { buildDetailList, buildTextSummary, renderEmailShell } from "@/lib/branded-email";
import { createNewsletterSubscriptionToken } from "@/lib/newsletter-subscription";
import { absoluteUrl } from "@/lib/site-seo";
import { getAdminInboxEmail, sendEmail } from "@/lib/smtp";

export async function sendNewsletterSignupConfirmationEmail({
  companyName,
  email,
  fullName,
}: {
  companyName?: string | null;
  email: string;
  fullName: string;
}) {
  const token = createNewsletterSubscriptionToken(email);
  const unsubscribeUrl = absoluteUrl(
    `/newsletter/subscription?token=${encodeURIComponent(token)}&action=unsubscribe`,
  );

  const detailRows = [
    { label: "Subscriber", value: fullName },
    { label: "Email", value: email },
    ...(companyName ? [{ label: "Company", value: companyName }] : []),
  ];

  const subject = "You're subscribed to Tacklers updates";
  const intro =
    "Thank you for subscribing to Tacklers Consulting Group updates. We will send practical insight on operational excellence, Lean transformation, and people-first capability building.";
  const html = await renderEmailShell({
    greetingPrefix: "Hello",
    intro,
    sections: `
      <div style="margin-top:20px;border:1px solid #f1e5e2;border-radius:18px;padding:18px 20px;background:#fffaf1;">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#8e6200;">What to expect</div>
        <p style="margin:12px 0 0;font-size:14px;line-height:1.8;color:#475569;">Expect concise updates focused on operational improvement, practical Lean delivery, and leadership habits that hold.</p>
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
        ${buildDetailList(detailRows)}
      </table>
      <p style="margin:22px 0 0;"><a href="${unsubscribeUrl}" style="display:inline-block;background:#8a0917;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Manage subscription</a></p>
      <p style="margin:12px 0 0;font-size:12px;line-height:1.7;color:#64748b;">You can unsubscribe at any time using the button above.</p>
    `,
    subject,
    userName: fullName,
  });

  await sendEmail({
    html,
    replyTo: getAdminInboxEmail(),
    subject,
    text: `${intro}\n\n${buildTextSummary(detailRows)}\n\nManage subscription: ${unsubscribeUrl}`,
    to: email,
  });
}

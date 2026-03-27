import { buildDetailList, buildTextSummary, type EmailDetailRow, renderEmailShell } from "@/lib/branded-email";
import { getAdminInboxEmail, sendEmail } from "@/lib/smtp";

export async function sendTrainingInviteEmail({
  cohortTitle,
  programmeTitle,
  recipientEmail,
  recipientName,
  roleLabel,
  signInUrl,
}: {
  cohortTitle: string;
  programmeTitle: string;
  recipientEmail: string;
  recipientName: string;
  roleLabel: string;
  signInUrl: string;
}) {
  const detailRows: EmailDetailRow[] = [
    { label: "Programme", value: programmeTitle },
    { label: "Cohort", value: cohortTitle },
    { label: "Role", value: roleLabel },
    { label: "Portal", value: signInUrl },
  ];

  const html = await renderEmailShell({
    intro: `${recipientName}, you have been invited to the Tacklers Lean training workspace.`,
    sections: `
      <div style="margin-top:20px;border:1px solid #f1e5e2;border-radius:18px;padding:18px 20px;background:#fffaf1;">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#8e6200;">Next step</div>
        <p style="margin:12px 0 0;font-size:14px;line-height:1.8;color:#475569;">Open the portal link, sign in using this email address, and complete the short onboarding checklist to activate your dashboard.</p>
        <p style="margin:16px 0 0;"><a href="${signInUrl}" style="display:inline-block;background:#8a0917;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;font-size:13px;font-weight:700;">Open training portal</a></p>
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
        ${buildDetailList(detailRows)}
      </table>
    `,
    subject: `You have been invited to ${cohortTitle}`,
    userName: recipientName,
  });

  await sendEmail({
    html,
    replyTo: getAdminInboxEmail(),
    subject: `Training invite: ${cohortTitle}`,
    text: `You have been invited to the Tacklers training portal.\n\n${buildTextSummary(detailRows)}`,
    to: recipientEmail,
  });
}

export async function sendTrainingCertificateEmail({
  certificateNumber,
  cohortTitle,
  downloadUrl,
  learnerName,
  recipientEmail,
}: {
  certificateNumber: string;
  cohortTitle: string;
  downloadUrl: string | null;
  learnerName: string;
  recipientEmail: string;
}) {
  const detailRows: EmailDetailRow[] = [
    { label: "Certificate", value: certificateNumber },
    { label: "Cohort", value: cohortTitle },
    { label: "Download", value: downloadUrl ?? "Available in the client portal" },
  ];

  const html = await renderEmailShell({
    intro: `${learnerName}, your Lean training certificate has now been awarded.`,
    sections: `
      <div style="margin-top:20px;border:1px solid #f1e5e2;border-radius:18px;padding:18px 20px;background:#fffaf1;">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#8e6200;">Certificate awarded</div>
        <p style="margin:12px 0 0;font-size:14px;line-height:1.8;color:#475569;">Your certificate is now stored in the Tacklers portal and can be downloaded from your progress page.</p>
        ${downloadUrl ? `<p style="margin:16px 0 0;"><a href="${downloadUrl}" style="display:inline-block;background:#8a0917;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;font-size:13px;font-weight:700;">Download certificate</a></p>` : ""}
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
        ${buildDetailList(detailRows)}
      </table>
    `,
    subject: `Certificate awarded: ${certificateNumber}`,
    userName: learnerName,
  });

  await sendEmail({
    html,
    replyTo: getAdminInboxEmail(),
    subject: `Certificate awarded: ${certificateNumber}`,
    text: `Your Lean training certificate has been awarded.\n\n${buildTextSummary(detailRows)}`,
    to: recipientEmail,
  });
}

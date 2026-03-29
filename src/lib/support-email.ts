import { buildDetailList, buildTextSummary, type EmailDetailRow, renderEmailShell } from "@/lib/branded-email";
import { getAdminInboxEmail, getAdminInboxRecipients, sendEmail } from "@/lib/smtp";

function toTitle(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export async function sendSupportTicketCreatedEmails({
  category,
  clientName,
  messageBody,
  priority,
  requesterEmail,
  requesterName,
  subject,
  ticketNumber,
}: {
  category: string;
  clientName: string;
  messageBody: string;
  priority: string;
  requesterEmail: string;
  requesterName: string;
  subject: string;
  ticketNumber: string;
}) {
  const detailRows: EmailDetailRow[] = [
    { label: "Ticket", value: ticketNumber },
    { label: "Client", value: clientName },
    { label: "Requester", value: requesterName },
    { label: "Email", value: requesterEmail },
    { label: "Category", value: toTitle(category) },
    { label: "Priority", value: toTitle(priority) },
    { label: "Subject", value: subject },
    { label: "Message", value: messageBody },
  ];

  const adminSubject = `New support ticket: ${subject}`;
  const adminHtml = await renderEmailShell({
    intro: `${requesterName} created a new support ticket for ${clientName}.`,
    sections: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
        ${buildDetailList(detailRows)}
      </table>
    `,
    subject: adminSubject,
  });
  const requesterHtml = await renderEmailShell({
    intro: `Thank you for contacting Tacklers support. We have created ticket ${ticketNumber} and our team will review it shortly.`,
    sections: `
      <div style="margin-top:20px;border:1px solid #f1e5e2;border-radius:18px;padding:18px 20px;background:#fffaf1;">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#8e6200;">What happens next</div>
        <p style="margin:12px 0 0;font-size:14px;line-height:1.8;color:#475569;">We will review the request, route it to the right person, and reply using the same portal thread and email channel when needed.</p>
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
        ${buildDetailList(detailRows)}
      </table>
    `,
    subject: `Support request received: ${ticketNumber}`,
    userName: requesterName,
  });

  await Promise.allSettled([
    sendEmail({
      html: adminHtml,
      replyTo: requesterEmail,
      subject: adminSubject,
      text: `New support ticket received.\n\n${buildTextSummary(detailRows)}`,
      to: getAdminInboxRecipients(),
    }),
    sendEmail({
      html: requesterHtml,
      replyTo: getAdminInboxEmail(),
      subject: `Support request received: ${ticketNumber}`,
      text: `We have received your support request.\n\n${buildTextSummary(detailRows)}`,
      to: requesterEmail,
    }),
  ]);
}

export async function sendSupportClientReplyEmail({
  clientName,
  messageBody,
  requesterEmail,
  requesterName,
  subject,
  ticketNumber,
}: {
  clientName: string;
  messageBody: string;
  requesterEmail: string;
  requesterName: string;
  subject: string;
  ticketNumber: string;
}) {
  const detailRows: EmailDetailRow[] = [
    { label: "Ticket", value: ticketNumber },
    { label: "Client", value: clientName },
    { label: "Requester", value: requesterName },
    { label: "Email", value: requesterEmail },
    { label: "Subject", value: subject },
    { label: "Reply", value: messageBody },
  ];

  const adminSubject = `Client reply: ${subject}`;
  const adminHtml = await renderEmailShell({
    intro: `${requesterName} replied to support ticket ${ticketNumber}.`,
    sections: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
        ${buildDetailList(detailRows)}
      </table>
    `,
    subject: adminSubject,
  });

  await sendEmail({
    html: adminHtml,
    replyTo: requesterEmail,
    subject: adminSubject,
    text: `Client replied to support ticket ${ticketNumber}.\n\n${buildTextSummary(detailRows)}`,
    to: getAdminInboxRecipients(),
  });
}

export async function sendSupportAdminReplyEmail({
  adminName,
  messageBody,
  status,
  subject,
  ticketNumber,
  to,
}: {
  adminName: string;
  messageBody: string;
  status: string;
  subject: string;
  ticketNumber: string;
  to: string;
}) {
  const detailRows: EmailDetailRow[] = [
    { label: "Ticket", value: ticketNumber },
    { label: "Subject", value: subject },
    { label: "Updated by", value: adminName },
    { label: "Current status", value: toTitle(status) },
    { label: "Message", value: messageBody },
  ];

  const replyHtml = await renderEmailShell({
    intro: `There is an update on support ticket ${ticketNumber}.`,
    sections: `
      <div style="margin-top:20px;border:1px solid #f1e5e2;border-radius:18px;padding:18px 20px;background:#fffaf1;">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#8e6200;">Support update</div>
        <p style="margin:12px 0 0;font-size:14px;line-height:1.8;color:#475569;">Our team has replied in the portal and by email so you can keep moving without needing to check multiple places.</p>
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
        ${buildDetailList(detailRows)}
      </table>
    `,
    subject: `Support update: ${subject}`,
  });

  await sendEmail({
    html: replyHtml,
    replyTo: getAdminInboxEmail(),
    subject: `Support update: ${subject}`,
    text: `There is an update on support ticket ${ticketNumber}.\n\n${buildTextSummary(detailRows)}`,
    to,
  });
}

export type EmailDetailRow = {
  label: string;
  value: string;
};

const BRAND_LOGO_URL = "https://tacklersconsulting.vercel.app/media/TCG%20Logo.png";
const LINKEDIN_URL = "https://www.linkedin.com/company/tacklers-consulting-group/";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildTextSummary(details: EmailDetailRow[]) {
  return details.map((item) => `${item.label}: ${item.value}`).join("\n");
}

export function buildDetailList(details: EmailDetailRow[]) {
  return details
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f1e5e2;font-size:13px;font-weight:700;color:#8a0917;vertical-align:top;">${escapeHtml(item.label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f1e5e2;font-size:14px;line-height:1.6;color:#334155;vertical-align:top;">${escapeHtml(item.value)}</td>
        </tr>`,
    )
    .join("");
}

export async function renderEmailShell({
  greetingPrefix,
  intro,
  sections,
  subject,
  userName,
}: {
  greetingPrefix?: string;
  intro: string;
  sections: string;
  subject: string;
  userName?: string;
}) {
  const logoMarkup = `
    <div style="text-align:center;">
      <img src="${BRAND_LOGO_URL}" alt="Tacklers Consulting Group" width="150" height="72" style="display:block;height:auto;max-width:150px;margin:0 auto;border:0;outline:none;text-decoration:none;" />
      <div style="margin-top:10px;font-size:18px;font-weight:700;letter-spacing:0.01em;color:#ffffff;text-align:center;">Tacklers Consulting Group</div>
    </div>
  `;

  const greetingWord = escapeHtml((greetingPrefix ?? "Hello").trim() || "Hello");
  const greetingName = userName?.trim() ? escapeHtml(userName.trim()) : "";
  const greeting = greetingName
    ? `<p style="margin:24px 0 0;font-size:16px;font-weight:600;line-height:1.5;color:#1e293b;">${greetingWord} ${greetingName},</p>`
    : "";
  const introMarkup = escapeHtml(intro).replace(/\n/g, "<br />");
  
  const socialLinks = `
    <div style="margin-top:16px;text-align:center;">
      <a href="${LINKEDIN_URL}" style="display:inline-block;margin:0 8px;text-decoration:none;" title="LinkedIn" target="_blank" rel="noreferrer noopener">
        <span style="display:inline-block;min-width:30px;padding:6px 10px;border-radius:999px;background:#0a66c2;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;line-height:1;">in</span>
        <span style="display:block;margin-top:6px;font-size:11px;font-weight:700;color:#475569;letter-spacing:0.08em;text-transform:uppercase;">LinkedIn</span>
      </a>
    </div>
  `;

  return `
    <div style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 60px rgba(15,23,42,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg,#690711 0%,#8a0917 58%,#b31223 100%);padding:28px 32px;text-align:center;">
                  ${logoMarkup}
                  <div style="margin-top:18px;font-size:11px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:#fdd835;text-align:center;">Operational Excellence Consulting</div>
                  <div style="margin-top:10px;font-size:30px;font-weight:300;line-height:1.1;color:#ffffff;text-align:center;">${escapeHtml(subject)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 32px 20px;">
                  ${greeting}
                  <p style="margin:${greeting ? '12px 0 18px' : '0 0 18px'};font-size:15px;line-height:1.8;color:#475569;">${introMarkup}</p>
                  ${sections}
                </td>
              </tr>
              <tr>
                <td style="padding:24px 32px;background:#fff8df;border-top:1px solid #f5e59e;text-align:center;">
                  <div style="font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#7d5d00;">Tacklers Consulting Group</div>
                  <p style="margin:10px 0 0;font-size:13px;line-height:1.7;color:#5b6472;">hello@tacklersconsulting.com • +44 7932 105847 • On-site at client locations across the UK</p>
                  ${socialLinks}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>`;
}

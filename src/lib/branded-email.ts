import { readFile } from "node:fs/promises";
import path from "node:path";

export type EmailDetailRow = {
  label: string;
  value: string;
};

let logoDataUriPromise: Promise<string | null> | null = null;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function getLogoDataUri() {
  if (!logoDataUriPromise) {
    logoDataUriPromise = readFile(path.join(process.cwd(), "public", "media", "TCG Logo.png"))
      .then((buffer) => `data:image/png;base64,${buffer.toString("base64")}`)
      .catch(() => null);
  }

  return logoDataUriPromise;
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
  intro,
  sections,
  subject,
  userName,
}: {
  intro: string;
  sections: string;
  subject: string;
  userName?: string;
}) {
  const logoDataUri = await getLogoDataUri();
  const logoMarkup = logoDataUri
    ? `<img src="${logoDataUri}" alt="Tacklers Consulting Group" width="150" style="display:block;height:auto;max-width:150px;margin:0 auto;" />`
    : `<div style="font-size:22px;font-weight:800;letter-spacing:0.02em;color:#ffffff;text-align:center;">Tacklers Consulting Group</div>`;

  const greeting = userName ? `<p style="margin:24px 0 0;font-size:16px;font-weight:600;line-height:1.5;color:#1e293b;">Hello ${escapeHtml(userName.split(" ")[0])},</p>` : "";
  
  const socialLinks = `
    <div style="margin-top:16px;text-align:center;">
      <a href="https://www.linkedin.com/company/tacklers-consulting-group/" style="display:inline-block;margin:0 8px;text-decoration:none;" title="LinkedIn">
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230a66c2' width='24' height='24'%3E%3Cpath d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.077-.145.231-.29.46-.404 1.023-.612 2.104-.62 2.485-.604 2.658 0 3.148 1.745 3.148 4.018v6.881zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/%3E%3C/svg%3E" alt="LinkedIn" style="width:24px;height:24px;" />
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
                  <p style="margin:${greeting ? '12px 0 18px' : '0 0 18px'};font-size:15px;line-height:1.8;color:#475569;">${escapeHtml(intro)}</p>
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

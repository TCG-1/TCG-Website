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
}: {
  intro: string;
  sections: string;
  subject: string;
}) {
  const logoDataUri = await getLogoDataUri();
  const logoMarkup = logoDataUri
    ? `<img src="${logoDataUri}" alt="Tacklers Consulting Group" width="150" style="display:block;height:auto;max-width:150px;" />`
    : `<div style="font-size:22px;font-weight:800;letter-spacing:0.02em;color:#ffffff;">Tacklers Consulting Group</div>`;

  return `
    <div style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 60px rgba(15,23,42,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg,#690711 0%,#8a0917 58%,#b31223 100%);padding:28px 32px;">
                  ${logoMarkup}
                  <div style="margin-top:18px;font-size:11px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:#fdd835;">Operational Excellence Consulting</div>
                  <div style="margin-top:10px;font-size:30px;font-weight:300;line-height:1.1;color:#ffffff;">${escapeHtml(subject)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 32px 20px;">
                  <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#475569;">${escapeHtml(intro)}</p>
                  ${sections}
                </td>
              </tr>
              <tr>
                <td style="padding:24px 32px;background:#fff8df;border-top:1px solid #f5e59e;">
                  <div style="font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#7d5d00;">Tacklers Consulting Group</div>
                  <p style="margin:10px 0 0;font-size:13px;line-height:1.7;color:#5b6472;">hello@tacklersconsulting.com • +44 7932 105847 • On-site at client locations across the UK</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>`;
}

import { renderEmailShell } from "@/lib/branded-email";

/**
 * Generates branded confirmation email HTML for Supabase auth confirmation/verification emails
 */
export async function generateAuthConfirmationEmail({
  confirmLink,
  userEmail,
  userName,
}: {
  confirmLink: string;
  userEmail: string;
  userName?: string;
}): Promise<string> {
  const html = await renderEmailShell({
    intro: "Welcome to Tacklers Consulting Group. Please confirm your email address to activate your account.",
    sections: `
      <div style="margin-top:20px;border:1px solid #f1e5e2;border-radius:18px;padding:18px 20px;background:#fffaf1;">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#8e6200;">Verify your email</div>
        <p style="margin:12px 0 0;font-size:14px;line-height:1.8;color:#475569;">Click the button below to confirm your email address and complete your signup.</p>
        <p style="margin:16px 0 0;"><a href="${confirmLink}" style="display:inline-block;background:#8a0917;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:13px;font-weight:700;letter-spacing:0.1em;">Confirm Email Address</a></p>
        <p style="margin:12px 0 0;font-size:12px;line-height:1.6;color:#64748b;">If you didn't create this account, you can ignore this email. The link will expire in 24 hours.</p>
      </div>
      <div style="margin-top:20px;padding:16px;background:#f1f5f9;border-radius:12px;border-left:4px solid #8a0917;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:#475569;"><strong style="color:#8a0917;">Or copy this link:</strong> <br/><span style="word-break:break-all;font-family:monospace;font-size:11px;color:#64748b;">${confirmLink}</span></p>
      </div>
    `,
    subject: "Confirm your email address",
    userName: userName || userEmail.split("@")[0],
  });

  return html;
}

/**
 * Generates branded signup welcome email HTML
 */
export async function generateAuthSignupEmail({
  userEmail,
  userName,
}: {
  userEmail: string;
  userName?: string;
}): Promise<string> {
  const html = await renderEmailShell({
    intro: "Thank you for signing up with Tacklers Consulting Group. Your account has been successfully created.",
    sections: `
      <div style="margin-top:20px;border:1px solid #f1e5e2;border-radius:18px;padding:18px 20px;background:#fffaf1;">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#8e6200;">What's next?</div>
        <p style="margin:12px 0 0;font-size:14px;line-height:1.8;color:#475569;">Your account is now active. You can access your personal dashboard and explore the resources available to you.</p>
        <p style="margin:16px 0 0;"><a href="https://tacklersconsulting.com" style="display:inline-block;background:#8a0917;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:13px;font-weight:700;letter-spacing:0.1em;">Go to Your Account</a></p>
      </div>
      <div style="margin-top:20px;padding:16px;background:#f1f5f9;border-radius:12px;">
        <div style="font-size:12px;font-weight:700;color:#475569;margin-bottom:8px;">Account details:</div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:12px;line-height:1.8;color:#64748b;">
          <tr>
            <td style="padding:4px 0;"><strong>Email:</strong></td>
            <td style="padding:4px 0;text-align:right;">${userEmail}</td>
          </tr>
        </table>
      </div>
    `,
    subject: "Welcome to Tacklers Consulting Group",
    userName: userName || userEmail.split("@")[0],
  });

  return html;
}

/**
 * Generates branded password reset email HTML
 */
export async function generateAuthResetPasswordEmail({
  resetLink,
  userEmail,
  userName,
}: {
  resetLink: string;
  userEmail: string;
  userName?: string;
}): Promise<string> {
  const html = await renderEmailShell({
    intro: "We received a request to reset the password associated with your account.",
    sections: `
      <div style="margin-top:20px;border:1px solid #f1e5e2;border-radius:18px;padding:18px 20px;background:#fffaf1;">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#8e6200;">Reset your password</div>
        <p style="margin:12px 0 0;font-size:14px;line-height:1.8;color:#475569;">Click the button below to set a new password for your account. This link will expire in 24 hours.</p>
        <p style="margin:16px 0 0;"><a href="${resetLink}" style="display:inline-block;background:#8a0917;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:13px;font-weight:700;letter-spacing:0.1em;">Reset Password</a></p>
        <p style="margin:12px 0 0;font-size:12px;line-height:1.6;color:#64748b;">If you didn't request a password reset, please ignore this email or contact support if you have concerns about your account security.</p>
      </div>
      <div style="margin-top:20px;padding:16px;background:#f1f5f9;border-radius:12px;border-left:4px solid #8a0917;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:#475569;"><strong style="color:#8a0917;">Or copy this link:</strong> <br/><span style="word-break:break-all;font-family:monospace;font-size:11px;color:#64748b;">${resetLink}</span></p>
      </div>
    `,
    subject: "Reset your password",
    userName: userName || userEmail.split("@")[0],
  });

  return html;
}

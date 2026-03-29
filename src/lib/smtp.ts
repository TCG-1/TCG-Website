import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export type EmailAttachment = {
  content: Buffer | string;
  contentType?: string | null;
  filename: string;
};

type EmailPayload = {
  attachments?: EmailAttachment[];
  html: string;
  replyTo?: string;
  subject: string;
  text: string;
  to: string | string[];
};

type SmtpConfig = {
  adminEmail: string;
  adminRecipients: string[];
  fromEmail: string;
  fromName: string;
  host: string;
  password: string;
  port: number;
  secure: boolean;
  user: string;
};

let cachedTransporter: Transporter | null = null;

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (!value) {
    return fallback;
  }

  return !["0", "false", "no", "off"].includes(value.trim().toLowerCase());
}

function parsePort(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : 465;
}

function normalizeEmailAddress(value: string | undefined | null) {
  const trimmed = value?.trim().toLowerCase();
  return trimmed ? trimmed : null;
}

function parseAdminRecipients(...values: Array<string | undefined | null>) {
  const recipients = values
    .flatMap((value) => (value ?? "").split(","))
    .map((value) => normalizeEmailAddress(value))
    .filter((value): value is string => Boolean(value));

  return Array.from(new Set(recipients));
}

function getSmtpConfig(): SmtpConfig {
  const user =
    normalizeEmailAddress(process.env.SMTP_USER) ||
    normalizeEmailAddress(process.env.SMTP_FROM_EMAIL) ||
    normalizeEmailAddress(process.env.ADMIN_EMAIL) ||
    "hello@tacklersconsulting.com";
  const fromEmail = normalizeEmailAddress(process.env.SMTP_FROM_EMAIL) || user;
  const adminRecipients = parseAdminRecipients(
    process.env.SMTP_ADMIN_EMAIL,
    process.env.ADMIN_EMAIL,
    user,
    "audrey@tacklersconsulting.com",
  );
  const adminEmail = adminRecipients[0] ?? user;
  const port = parsePort(process.env.SMTP_PORT);

  return {
    adminEmail,
    adminRecipients,
    fromEmail,
    fromName: process.env.SMTP_FROM_NAME?.trim() || "Tacklers Consulting Group",
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    password: process.env.SMTP_PASSWORD ?? process.env.SMTP_APP_PASSWORD ?? "",
    port,
    secure: parseBoolean(process.env.SMTP_SECURE, port === 465),
    user,
  };
}

function hasSmtpConfig() {
  const config = getSmtpConfig();
  return Boolean(config.host && config.user && config.password);
}

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const config = getSmtpConfig();
  cachedTransporter = nodemailer.createTransport({
    auth: {
      pass: config.password,
      user: config.user,
    },
    host: config.host,
    port: config.port,
    secure: config.secure,
  });

  return cachedTransporter;
}

export function getAdminInboxEmail() {
  return getSmtpConfig().adminEmail;
}

export function getAdminInboxRecipients() {
  return getSmtpConfig().adminRecipients;
}

export function getDefaultFromHeader() {
  const config = getSmtpConfig();
  return `${config.fromName} <${config.fromEmail}>`;
}

export async function sendEmail({ attachments, html, replyTo, subject, text, to }: EmailPayload) {
  if (!hasSmtpConfig()) {
    console.warn("Skipping email delivery because SMTP configuration is missing.");
    return;
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    attachments: attachments?.map((attachment) => ({
      content: attachment.content,
      contentType: attachment.contentType ?? undefined,
      filename: attachment.filename,
    })),
    from: getDefaultFromHeader(),
    html,
    replyTo,
    subject,
    text,
    to: Array.isArray(to) ? to.join(", ") : to,
  });
}

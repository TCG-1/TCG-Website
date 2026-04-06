import { buildDetailList, renderEmailShell, type EmailDetailRow } from "@/lib/branded-email";
import { getAdminInboxRecipients, isSmtpConfigured, sendEmail } from "@/lib/smtp";
import { siteConfig } from "@/lib/site-seo";

type SeoCheckStatus = "ok" | "warn" | "fail";

type SeoEndpointCheck = {
  contentType: string;
  durationMs: number;
  issues: string[];
  path: string;
  status: SeoCheckStatus;
  statusCode: number;
  url: string;
};

type SeoHealthReport = {
  baseUrl: string;
  checks: SeoEndpointCheck[];
  emailError?: string;
  emailSent: boolean;
  ok: boolean;
  summary: {
    checked: number;
    failed: number;
    warnings: number;
  };
  timestamp: string;
};

const DEFAULT_PATHS = [
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/blog",
  "/operational-excellence-consulting-uk",
  "/lean-training-uk",
  "/contact",
  "/discovery-call",
] as const;

function normalizeEmailAddress(value: string | undefined | null) {
  const trimmed = value?.trim().toLowerCase();
  return trimmed ? trimmed : null;
}

export function getSeoReportRecipients() {
  const configuredRecipients = (process.env.SEO_MONITOR_EMAIL_TO ?? "")
    .split(",")
    .map((value) => normalizeEmailAddress(value))
    .filter((value): value is string => Boolean(value));

  if (configuredRecipients.length > 0) {
    return Array.from(new Set(configuredRecipients));
  }

  return Array.from(new Set(["krishgauli@gmail.com", ...getAdminInboxRecipients()]));
}

function normalizePath(path: string) {
  const trimmed = path.trim();
  if (!trimmed) {
    return "/";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    const parsed = new URL(trimmed);
    return parsed.pathname || "/";
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function getBaseUrl() {
  const baseUrl = process.env.SEO_MONITOR_BASE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim() || siteConfig.url;
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function getPaths() {
  const configured = process.env.SEO_MONITOR_PATHS
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (configured?.length) {
    return Array.from(new Set(configured.map((path) => normalizePath(path))));
  }

  return Array.from(new Set(DEFAULT_PATHS));
}

function detectStatus(statusCode: number, issues: string[]): SeoCheckStatus {
  if (statusCode >= 400 || issues.length > 0) {
    return statusCode >= 400 ? "fail" : "warn";
  }

  return "ok";
}

function hasMetaDescription(html: string) {
  return /<meta\s+[^>]*name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/i.test(html);
}

function hasCanonical(html: string) {
  return /<link\s+[^>]*rel=["']canonical["'][^>]*href=["'][^"']+["'][^>]*>/i.test(html);
}

async function runCheck(baseUrl: string, path: string): Promise<SeoEndpointCheck> {
  const url = `${baseUrl}${path}`;
  const startedAt = Date.now();
  const response = await fetch(url, {
    headers: {
      "user-agent": "TacklersSEOHealthBot/1.0",
    },
    redirect: "follow",
  });

  const durationMs = Date.now() - startedAt;
  const contentType = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() || "unknown";
  const body = await response.text();
  const issues: string[] = [];

  if (!response.ok) {
    issues.push(`HTTP ${response.status}`);
  }

  if (path === "/robots.txt") {
    if (!body.toLowerCase().includes("sitemap:")) {
      issues.push("Missing sitemap reference in robots.txt");
    }
  }

  if (path === "/sitemap.xml") {
    const normalized = body.toLowerCase();
    if (!normalized.includes("<urlset") && !normalized.includes("<sitemapindex")) {
      issues.push("Sitemap XML root node not detected");
    }
  }

  if (contentType.includes("text/html")) {
    if (!/<title[^>]*>[^<]+<\/title>/i.test(body)) {
      issues.push("Missing <title>");
    }

    if (!hasMetaDescription(body)) {
      issues.push("Missing meta description");
    }

    if (!hasCanonical(body)) {
      issues.push("Missing canonical link tag");
    }

    if (path === "/" && !body.includes("application/ld+json")) {
      issues.push("Homepage is missing JSON-LD structured data");
    }
  }

  return {
    contentType,
    durationMs,
    issues,
    path,
    status: detectStatus(response.status, issues),
    statusCode: response.status,
    url,
  };
}

function buildEmailRows(report: SeoHealthReport): EmailDetailRow[] {
  const failedPaths = report.checks.filter((check) => check.status === "fail").map((check) => check.path);
  const warningPaths = report.checks.filter((check) => check.status === "warn").map((check) => check.path);

  return [
    { label: "Run timestamp", value: report.timestamp },
    { label: "Base URL", value: report.baseUrl },
    { label: "Endpoints checked", value: `${report.summary.checked}` },
    { label: "Failures", value: `${report.summary.failed}${failedPaths.length ? ` (${failedPaths.join(", ")})` : ""}` },
    {
      label: "Warnings",
      value: `${report.summary.warnings}${warningPaths.length ? ` (${warningPaths.join(", ")})` : ""}`,
    },
  ];
}

async function maybeSendEmail(report: SeoHealthReport) {
  if (!isSmtpConfigured()) {
    return { emailError: "SMTP is not configured. Skipped email delivery.", emailSent: false };
  }

  const rows = buildEmailRows(report);
  const issueRows = report.checks
    .filter((check) => check.issues.length > 0)
    .map((check) => ({
      label: `${check.path} (${check.statusCode})`,
      value: check.issues.join("; "),
    }));

  const sections = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
      ${buildDetailList(rows)}
    </table>
    ${
      issueRows.length
        ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:16px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">${buildDetailList(issueRows)}</table>`
        : ""
    }
  `;

  const subject = report.ok ? "Weekly SEO health check: PASS" : "Weekly SEO health check: ACTION REQUIRED";
  const html = await renderEmailShell({
    intro: "Your scheduled SEO health check has completed.",
    sections,
    subject,
  });

  await sendEmail({
    html,
    subject,
    text: rows.map((row) => `${row.label}: ${row.value}`).join("\n"),
    to: getSeoReportRecipients(),
  });

  return { emailSent: true };
}

export async function runScheduledSeoHealthCheck(): Promise<SeoHealthReport> {
  const baseUrl = getBaseUrl();
  const paths = getPaths();
  const checks = await Promise.all(paths.map((path) => runCheck(baseUrl, path)));
  const failed = checks.filter((check) => check.status === "fail").length;
  const warnings = checks.filter((check) => check.status === "warn").length;

  const report: SeoHealthReport = {
    baseUrl,
    checks,
    emailSent: false,
    ok: failed === 0,
    summary: {
      checked: checks.length,
      failed,
      warnings,
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const emailResult = await maybeSendEmail(report);
    return {
      ...report,
      ...emailResult,
    };
  } catch (error) {
    return {
      ...report,
      emailError: error instanceof Error ? error.message : "Unable to send SEO report email.",
      emailSent: false,
    };
  }
}

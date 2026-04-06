import { buildDetailList, renderEmailShell, type EmailDetailRow } from "@/lib/branded-email";
import { getPublishedBlogEntries } from "@/lib/blog-content";
import { getSeoReportRecipients } from "@/lib/seo-health";
import { isSmtpConfigured, sendEmail } from "@/lib/smtp";
import { publicSitePages, siteConfig } from "@/lib/site-seo";

type PageSnapshot = {
  fetchError?: string;
  h1Count: number;
  internalLinkCount: number;
  metaDescription: boolean;
  path: string;
  title: boolean;
  url: string;
  wordCount: number;
};

export type SeoOpportunityReport = {
  baseUrl: string;
  emailError?: string;
  emailSent: boolean;
  opportunities: string[];
  pagesReviewed: number;
  snapshots: PageSnapshot[];
  timestamp: string;
};

function getBaseUrl() {
  const baseUrl = process.env.SEO_MONITOR_BASE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim() || siteConfig.url;
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function getPathsToReview() {
  const configured = process.env.SEO_OPPORTUNITY_PATHS
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (configured?.length) {
    return Array.from(new Set(configured.map((path) => (path.startsWith("/") ? path : `/${path}`))));
  }

  const defaults = publicSitePages
    .filter((item) => item.priority >= 0.7)
    .map((item) => item.path)
    .filter((path) => !["/cookie-policy", "/privacy-policy", "/terms-and-conditions"].includes(path));

  return Array.from(new Set(defaults));
}

function stripHtml(value: string) {
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}

function countMatches(value: string, pattern: RegExp) {
  const matches = value.match(pattern);
  return matches?.length ?? 0;
}

async function snapshotPage(baseUrl: string, path: string): Promise<PageSnapshot> {
  const url = `${baseUrl}${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "TacklersSEOOpportunityBot/1.0",
      },
      redirect: "follow",
    });

    const html = await response.text();
    const plainText = stripHtml(html)
      .replace(/\s+/g, " ")
      .trim();

    return {
      h1Count: countMatches(html, /<h1\b[^>]*>/gi),
      internalLinkCount: countMatches(html, /href=["']\/(?!\/|#|api|admin|auth|client-hub)[^"']*["']/gi),
      metaDescription: /<meta\s+[^>]*name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/i.test(html),
      path,
      title: /<title[^>]*>[^<]+<\/title>/i.test(html),
      url,
      wordCount: plainText ? plainText.split(" ").length : 0,
    };
  } catch (error) {
    return {
      fetchError: error instanceof Error ? error.message : "Unknown fetch error",
      h1Count: 0,
      internalLinkCount: 0,
      metaDescription: false,
      path,
      title: false,
      url,
      wordCount: 0,
    };
  }
}

function buildOpportunities(snapshots: PageSnapshot[], blogPosts: Awaited<ReturnType<typeof getPublishedBlogEntries>>) {
  const opportunities: string[] = [];

  const failedPages = snapshots.filter((snapshot) => snapshot.fetchError);
  if (failedPages.length > 0) {
    opportunities.push(
      `Fix crawl failures on ${failedPages.length} page(s): ${failedPages.map((page) => page.path).join(", ")}.`,
    );
  }

  const thinPages = snapshots.filter(
    (snapshot) => !snapshot.fetchError && snapshot.wordCount > 0 && snapshot.wordCount < 300 && snapshot.path !== "/",
  );
  if (thinPages.length > 0) {
    opportunities.push(
      `Expand topical depth on thin pages: ${thinPages.map((page) => `${page.path} (${page.wordCount} words)`).join(", ")}.`,
    );
  }

  const lowLinkPages = snapshots.filter(
    (snapshot) => !snapshot.fetchError && snapshot.internalLinkCount < 3 && !["/", "/blog"].includes(snapshot.path),
  );
  if (lowLinkPages.length > 0) {
    opportunities.push(
      `Improve internal linking to key pages with fewer than 3 internal links: ${lowLinkPages
        .map((page) => `${page.path} (${page.internalLinkCount})`)
        .join(", ")}.`,
    );
  }

  const metaIssues = snapshots.filter((snapshot) => !snapshot.fetchError && (!snapshot.title || !snapshot.metaDescription));
  if (metaIssues.length > 0) {
    opportunities.push(
      `Fix metadata gaps (${metaIssues.length} page(s)) by ensuring each page has one title and a meta description.`,
    );
  }

  const today = Date.now();
  const ninetyDaysAgo = today - 1000 * 60 * 60 * 24 * 90;
  const recentPostCount = blogPosts.filter((post) => {
    if (!post.publishedAt) {
      return false;
    }

    const publishedAtMs = new Date(post.publishedAt).getTime();
    return Number.isFinite(publishedAtMs) && publishedAtMs >= ninetyDaysAgo;
  }).length;

  if (recentPostCount < 3) {
    opportunities.push(
      `Increase publishing cadence: only ${recentPostCount} post(s) in the last 90 days. Target at least 3-4 high-intent posts monthly.`,
    );
  }

  const postsMissingSeoFields = blogPosts.filter((post) => !post.seoDescription || !post.seoTitle);
  if (postsMissingSeoFields.length > 0) {
    opportunities.push(
      `Complete missing SEO fields on ${postsMissingSeoFields.length} blog post(s) (seo_title and seo_description).`,
    );
  }

  if (opportunities.length === 0) {
    opportunities.push("No critical opportunities detected this month. Continue current cadence and monitor rankings weekly.");
  }

  return opportunities;
}

function buildEmailRows(report: SeoOpportunityReport): EmailDetailRow[] {
  return [
    { label: "Run timestamp", value: report.timestamp },
    { label: "Base URL", value: report.baseUrl },
    { label: "Pages reviewed", value: `${report.pagesReviewed}` },
    { label: "Opportunities found", value: `${report.opportunities.length}` },
  ];
}

async function maybeSendEmail(report: SeoOpportunityReport) {
  if (!isSmtpConfigured()) {
    return { emailError: "SMTP is not configured. Skipped email delivery.", emailSent: false };
  }

  const rows = buildEmailRows(report);
  const opportunityRows: EmailDetailRow[] = report.opportunities.map((opportunity, index) => ({
    label: `Opportunity ${index + 1}`,
    value: opportunity,
  }));

  const sections = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
      ${buildDetailList(rows)}
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:16px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
      ${buildDetailList(opportunityRows)}
    </table>
  `;

  const html = await renderEmailShell({
    intro: "Your monthly SEO opportunities report is ready.",
    sections,
    subject: "Monthly SEO opportunities report",
  });

  await sendEmail({
    html,
    subject: "Monthly SEO opportunities report",
    text: [...rows, ...opportunityRows].map((row) => `${row.label}: ${row.value}`).join("\n"),
    to: getSeoReportRecipients(),
  });

  return { emailSent: true };
}

export async function runScheduledSeoOpportunityReport(): Promise<SeoOpportunityReport> {
  const baseUrl = getBaseUrl();
  const paths = getPathsToReview();
  const [snapshots, blogPosts] = await Promise.all([
    Promise.all(paths.map((path) => snapshotPage(baseUrl, path))),
    getPublishedBlogEntries(),
  ]);

  const report: SeoOpportunityReport = {
    baseUrl,
    emailSent: false,
    opportunities: buildOpportunities(snapshots, blogPosts),
    pagesReviewed: snapshots.length,
    snapshots,
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
      emailError: error instanceof Error ? error.message : "Unable to send SEO opportunities email.",
      emailSent: false,
    };
  }
}

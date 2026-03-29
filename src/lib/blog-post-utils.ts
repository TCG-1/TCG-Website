import { parseBlogImagePayload, serializeRichTextToSections, type BlogRenderBlock } from "@/lib/blog-rich-text";
import { slugifyText } from "@/lib/portal-data";

export const BLOG_FALLBACK_COVER = "/media/photo-1517976487492-5750f3195933-200958be.jpg";

function normalizeText(value: string | null | undefined) {
  return (value ?? "").trim();
}

function replaceLinks(value: string) {
  return value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
}

function stripMarkdown(value: string) {
  return replaceLinks(value)
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/::\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function clampAtWordBoundary(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const sliced = value.slice(0, maxLength + 1);
  const boundary = sliced.lastIndexOf(" ");
  return `${sliced.slice(0, boundary > 60 ? boundary : maxLength).trim()}…`;
}

export function findFirstBodyImage(body: string) {
  for (const section of serializeRichTextToSections(body)) {
    if (section.section_type !== "image") {
      continue;
    }

    const image = parseBlogImagePayload(section.body);
    if (image?.src) {
      return image.src.trim();
    }
  }

  return "";
}

export function buildExcerptFromBody(body: string, title: string) {
  const plainText = stripMarkdown(body);

  if (plainText) {
    return clampAtWordBoundary(plainText, 158);
  }

  return title ? `${title} — insights from Tacklers Consulting Group.` : "Draft excerpt in progress.";
}

export function buildCanonicalPath(slug: string, canonicalUrl?: string | null) {
  return normalizeText(canonicalUrl) || `/blog/${slug}`;
}

export function buildDerivedBlogFields({
  body,
  canonicalUrl,
  category,
  coverUrl,
  excerpt,
  ogImageUrl,
  seoDescription,
  seoTitle,
  slug,
  title,
}: {
  body: string;
  canonicalUrl?: string | null;
  category?: string | null;
  coverUrl?: string | null;
  excerpt?: string | null;
  ogImageUrl?: string | null;
  seoDescription?: string | null;
  seoTitle?: string | null;
  slug?: string | null;
  title: string;
}) {
  const normalizedTitle = normalizeText(title);
  const slugBase = slugifyText(normalizeText(slug) || normalizedTitle) || "blog-post";
  const derivedExcerpt = normalizeText(excerpt) || buildExcerptFromBody(body, normalizedTitle);
  const derivedCategory = normalizeText(category) || "Lean Insights";
  const leadImage = findFirstBodyImage(body);
  const derivedCoverUrl = normalizeText(coverUrl) || leadImage || BLOG_FALLBACK_COVER;
  const derivedOgImageUrl = normalizeText(ogImageUrl) || derivedCoverUrl;
  const derivedSeoTitle = normalizeText(seoTitle) || normalizedTitle;
  const derivedSeoDescription = normalizeText(seoDescription) || derivedExcerpt;
  const derivedCanonicalUrl = buildCanonicalPath(slugBase, canonicalUrl);

  return {
    canonicalUrl: derivedCanonicalUrl,
    category: derivedCategory,
    coverUrl: derivedCoverUrl,
    excerpt: derivedExcerpt,
    ogImageUrl: derivedOgImageUrl,
    seoDescription: derivedSeoDescription,
    seoTitle: derivedSeoTitle,
    slugBase,
    title: normalizedTitle,
  };
}

function normalizeAssetUrl(value: string) {
  return normalizeText(value).replace(/\/$/, "").toLowerCase();
}

export function dedupeCoverImageBlocks(blocks: BlogRenderBlock[], coverUrl?: string | null) {
  const normalizedCoverUrl = normalizeAssetUrl(coverUrl ?? "");

  if (!normalizedCoverUrl) {
    return blocks;
  }

  let hasRemovedLeadImage = false;

  return blocks.filter((block) => {
    if (block.type !== "image" || !block.image?.src || hasRemovedLeadImage) {
      return true;
    }

    if (normalizeAssetUrl(block.image.src) === normalizedCoverUrl) {
      hasRemovedLeadImage = true;
      return false;
    }

    return true;
  });
}

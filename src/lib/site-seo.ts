import type { Metadata } from "next";

const DEFAULT_SITE_URL = "https://tacklersconsulting.com";
const DEFAULT_OG_IMAGE = "/media/aida-public-AB6AXuCyOjIab072l46SaGHablYPEZAu48OXAu95HSTBh0PG-adf322ea.jpg";

function normalizeSiteUrl(value: string | undefined) {
  if (!value) {
    return DEFAULT_SITE_URL;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return DEFAULT_SITE_URL;
  }

  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

export const siteConfig = {
  defaultDescription:
    "Tacklers Consulting Group helps UK organisations reduce waste, improve productivity, and build operational excellence capability that holds.",
  defaultOgImage: DEFAULT_OG_IMAGE,
  email: "hello@tacklersconsulting.com",
  locale: "en_GB",
  name: "Tacklers Consulting Group",
  phone: "+44 7932 105847",
  title: "Tacklers Consulting Group",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL),
} as const;

export type PageMetadataOptions = {
  description: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  noIndex?: boolean;
  path: string;
  publishedTime?: string | null;
  title: string;
  type?: "article" | "website";
  updatedTime?: string | null;
};

function normalizePath(path: string) {
  if (!path || path === "/") {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = normalizePath(path);
  return normalizedPath === "/" ? siteConfig.url : `${siteConfig.url}${normalizedPath}`;
}

function buildOpenGraphImage(image?: string, alt?: string) {
  const imagePath = image ?? siteConfig.defaultOgImage;
  const resolvedAlt = alt ?? siteConfig.title;
  return [
    {
      alt: resolvedAlt,
      height: 630,
      url: absoluteUrl(imagePath),
      width: 1200,
    },
  ];
}

export function createPageMetadata({
  description,
  image,
  imageAlt,
  keywords,
  noIndex = false,
  path,
  publishedTime,
  title,
  type = "website",
  updatedTime,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const openGraphImages = buildOpenGraphImage(image, imageAlt ?? title);

  return {
    alternates: {
      canonical,
    },
    description,
    keywords,
    openGraph: {
      description,
      images: openGraphImages,
      locale: siteConfig.locale,
      publishedTime: type === "article" ? (publishedTime ?? undefined) : undefined,
      siteName: siteConfig.name,
      title,
      type,
      url: canonical,
    },
    robots: noIndex
      ? {
          follow: false,
          index: false,
        }
      : undefined,
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: openGraphImages.map((item) => item.url),
      title,
    },
  };
}

export const rootMetadata: Metadata = {
  applicationName: siteConfig.name,
  category: "Business consulting",
  creator: siteConfig.name,
  description: siteConfig.defaultDescription,
  keywords: [
    "lean transformation",
    "operational excellence consulting",
    "lean training uk",
    "gemba consulting",
    "process improvement uk",
    "continuous improvement consulting",
  ],
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    description: siteConfig.defaultDescription,
    images: buildOpenGraphImage(),
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    type: "website",
    url: siteConfig.url,
  },
  referrer: "origin-when-cross-origin",
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: siteConfig.title,
  twitter: {
    card: "summary_large_image",
    description: siteConfig.defaultDescription,
    images: buildOpenGraphImage().map((item) => item.url),
    title: siteConfig.title,
  },
};

export const publicSitePages = [
  { changeFrequency: "weekly" as const, path: "/", priority: 1 },
  { changeFrequency: "monthly" as const, path: "/about", priority: 0.8 },
  { changeFrequency: "weekly" as const, path: "/operational-excellence-consulting-uk", priority: 0.9 },
  { changeFrequency: "weekly" as const, path: "/lean-training-uk", priority: 0.9 },
  { changeFrequency: "weekly" as const, path: "/blog", priority: 0.8 },
  { changeFrequency: "monthly" as const, path: "/contact", priority: 0.8 },
  { changeFrequency: "monthly" as const, path: "/support", priority: 0.6 },
  { changeFrequency: "weekly" as const, path: "/careers", priority: 0.6 },
  { changeFrequency: "monthly" as const, path: "/discovery-call", priority: 0.7 },
  { changeFrequency: "monthly" as const, path: "/book-lean-training", priority: 0.7 },
  { changeFrequency: "monthly" as const, path: "/on-site-assessment", priority: 0.7 },
  { changeFrequency: "yearly" as const, path: "/cookie-policy", priority: 0.3 },
  { changeFrequency: "yearly" as const, path: "/privacy-policy", priority: 0.3 },
  { changeFrequency: "yearly" as const, path: "/terms-and-conditions", priority: 0.3 },
] as const;

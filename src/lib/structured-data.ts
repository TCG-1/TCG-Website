import type { FaqItem } from "@/lib/site-data";

import { absoluteUrl, siteConfig } from "@/lib/site-seo";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type ArticleStructuredData = {
  canonicalPath?: string | null;
  coverImage?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  description: string;
  slug: string;
  title: string;
};

type ServiceStructuredData = {
  description: string;
  name: string;
  path: string;
};

type WebPageStructuredData = {
  description: string;
  path: string;
  title: string;
};

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@id": `${siteConfig.url}/#organization`,
    "@type": "Organization",
    areaServed: "GB",
    contactPoint: [
      {
        "@type": "ContactPoint",
        availableLanguage: ["en-GB"],
        contactType: "customer support",
        email: siteConfig.email,
        telephone: siteConfig.phone,
      },
    ],
    description: siteConfig.defaultDescription,
    email: siteConfig.email,
    logo: absoluteUrl("/icon.png"),
    name: siteConfig.name,
    telephone: siteConfig.phone,
    url: siteConfig.url,
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@id": `${siteConfig.url}/#localbusiness`,
    "@type": "ProfessionalService",
    areaServed: [
      {
        "@type": "Country",
        name: "United Kingdom",
      },
    ],
    description: siteConfig.defaultDescription,
    email: siteConfig.email,
    image: [absoluteUrl(siteConfig.defaultOgImage)],
    name: siteConfig.name,
    priceRange: "££",
    sameAs: ["https://www.linkedin.com/company/tacklers-consulting-group/"],
    telephone: siteConfig.phone,
    url: siteConfig.url,
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@id": `${siteConfig.url}/#website`,
    "@type": "WebSite",
    description: siteConfig.defaultDescription,
    inLanguage: "en-GB",
    name: siteConfig.name,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    url: siteConfig.url,
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: absoluteUrl(item.path),
      name: item.name,
      position: index + 1,
    })),
  };
}

export function buildWebPageJsonLd({ description, path, title }: WebPageStructuredData) {
  const pageUrl = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@id": `${pageUrl}#webpage`,
    "@type": "WebPage",
    description,
    inLanguage: "en-GB",
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    name: title,
    url: pageUrl,
  };
}

export function buildServiceJsonLd({ description, name, path }: ServiceStructuredData) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    areaServed: "GB",
    description,
    name,
    provider: {
      "@id": `${siteConfig.url}/#organization`,
    },
    serviceType: name,
    url: absoluteUrl(path),
  };
}

export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
      name: item.question,
    })),
  };
}

export function buildArticleJsonLd({
  canonicalPath,
  coverImage,
  dateModified,
  datePublished,
  description,
  slug,
  title,
}: ArticleStructuredData) {
  const path = canonicalPath || `/blog/${slug}`;
  const articleUrl = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
      "@id": `${siteConfig.url}/#organization`,
    },
    dateModified: dateModified ?? datePublished ?? undefined,
    datePublished: datePublished ?? undefined,
    description,
    headline: title,
    image: coverImage ? [absoluteUrl(coverImage)] : [absoluteUrl(siteConfig.defaultOgImage)],
    mainEntityOfPage: articleUrl,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    url: articleUrl,
  };
}

export function buildBlogIndexJsonLd(posts: Array<{ slug: string; title: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
    name: "Lean Insights & Success Stories",
    url: absoluteUrl("/blog"),
  };
}

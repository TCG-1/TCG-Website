import type { FaqItem } from "@/lib/site-data";

import { absoluteUrl, siteConfig } from "@/lib/site-seo";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type ArticleStructuredData = {
  authorName?: string | null;
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
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
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
    foundingDate: "2020",
    knowsAbout: [
      "Lean Transformation",
      "Operational Excellence",
      "Continuous Improvement",
      "Value Stream Mapping",
      "Executive Leadership Coaching",
      "Gemba Consulting",
    ],
    logo: absoluteUrl("/icon.png"),
    name: siteConfig.name,
    sameAs: ["https://www.linkedin.com/company/tacklers-consulting-group/"],
    slogan: "People-First Lean Transformation",
    telephone: siteConfig.phone,
    url: siteConfig.url,
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@id": `${siteConfig.url}/#localbusiness`,
    "@type": "ProfessionalService",
    "@additionalType": "https://schema.org/ConsultingService",
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
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    parentOrganization: {
      "@id": `${siteConfig.url}/#organization`,
    },
    priceRange: "££",
    sameAs: ["https://www.linkedin.com/company/tacklers-consulting-group/"],
    serviceType: [
      "Lean Transformation Consulting",
      "Operational Excellence Consulting",
      "Executive Leadership Coaching",
      "Lean Training and Mentoring",
    ],
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
    potentialAction: {
      "@type": "SearchAction",
      query: "required",
      "query-input": "required name=search_term_string",
      target: `${siteConfig.url}/blog?q={search_term_string}`,
    },
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
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    description,
    name,
    provider: {
      "@id": `${siteConfig.url}/#organization`,
    },
    providerMobility: "dynamic",
    serviceOutput: "Operational improvement and capability building",
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
  authorName,
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
    author: authorName
      ? {
          "@type": "Person",
          name: authorName,
        }
      : {
          "@id": `${siteConfig.url}/#organization`,
        },
    dateModified: dateModified ?? datePublished ?? undefined,
    datePublished: datePublished ?? undefined,
    description,
    headline: title,
    image: coverImage ? [absoluteUrl(coverImage)] : [absoluteUrl(siteConfig.defaultOgImage)],
    inLanguage: "en-GB",
    isPartOf: {
      "@id": `${siteConfig.url}/blog#webpage`,
    },
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

import type { MetadataRoute } from "next";

import { getPublishedBlogEntries } from "@/lib/blog-content";
import { getAllCaseStudySlugs } from "@/lib/case-studies-data";
import { absoluteUrl, publicSitePages } from "@/lib/site-seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getPublishedBlogEntries();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = publicSitePages.map((page) => ({
    changeFrequency: page.changeFrequency,
    lastModified: now,
    priority: page.priority,
    url: absoluteUrl(page.path),
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    changeFrequency: "monthly",
    lastModified: post.updatedAt ? new Date(post.updatedAt) : post.publishedAt ? new Date(post.publishedAt) : now,
    priority: 0.7,
    url: absoluteUrl(post.canonicalPath || `/blog/${post.slug}`),
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = getAllCaseStudySlugs().map(
    (slug) => ({
      changeFrequency: "monthly" as const,
      lastModified: now,
      priority: 0.7,
      url: absoluteUrl(`/case-studies/${slug}`),
    }),
  );

  return [...staticEntries, ...blogEntries, ...caseStudyEntries];
}

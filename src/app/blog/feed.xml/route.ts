import { getPublishedBlogEntries } from "@/lib/blog-content";
import { absoluteUrl, siteConfig } from "@/lib/site-seo";

export const revalidate = 300;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedBlogEntries();

  const items = posts
    .map((post) => {
      const link = absoluteUrl(post.canonicalPath || `/blog/${post.slug}`);
      const publishedAt = post.publishedAt ?? post.updatedAt ?? new Date().toISOString();
      const updatedAt = post.updatedAt ?? post.publishedAt ?? publishedAt;
      const description = post.seoDescription ?? post.excerpt;

      return `<item>
  <title>${escapeXml(post.seoTitle ?? post.title)}</title>
  <link>${escapeXml(link)}</link>
  <guid>${escapeXml(link)}</guid>
  <pubDate>${new Date(publishedAt).toUTCString()}</pubDate>
  <description>${escapeXml(description)}</description>
  <content:encoded><![CDATA[${post.content.join("\n\n")}]]></content:encoded>
  <atom:updated>${new Date(updatedAt).toISOString()}</atom:updated>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(siteConfig.name)} Blog</title>
  <link>${escapeXml(absoluteUrl("/blog"))}</link>
  <description>${escapeXml(siteConfig.defaultDescription)}</description>
  <language>en-gb</language>
  <atom:link href="${escapeXml(absoluteUrl("/blog/feed.xml"))}" rel="self" type="application/rss+xml" />
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

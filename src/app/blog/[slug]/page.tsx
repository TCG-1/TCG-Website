import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogRichContent } from "@/components/blog/blog-rich-content";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/sections";
import { getPublishedBlogEntries, getPublishedBlogEntryBySlug } from "@/lib/blog-content";
import { createPageMetadata } from "@/lib/site-seo";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const blogPosts = await getPublishedBlogEntries();
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogEntryBySlug(slug);

  if (!post) {
    return createPageMetadata({
      description: "The requested blog article could not be found.",
      image: "/media/photo-1515169067868-5387ec356754-6a0fcd5a.jpg",
      noIndex: true,
      path: `/blog/${slug}`,
      title: "Post not found",
    });
  }

  return createPageMetadata({
    description: post.seoDescription ?? post.excerpt,
    image: post.ogImageUrl ?? post.cover,
    noIndex: post.noIndex,
    path: post.canonicalPath || `/blog/${post.slug}`,
    publishedTime: post.publishedAt,
    title: post.seoTitle ?? `${post.title} | Tacklers Consulting Group`,
    type: "article",
    updatedTime: post.updatedAt,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedBlogEntryBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: post.seoDescription ?? post.excerpt,
            path: post.canonicalPath || `/blog/${post.slug}`,
            title: post.seoTitle ?? post.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: post.canonicalPath || `/blog/${post.slug}` },
          ]),
          buildArticleJsonLd({
            canonicalPath: post.canonicalPath,
            coverImage: post.ogImageUrl ?? post.cover,
            dateModified: post.updatedAt,
            datePublished: post.publishedAt,
            description: post.seoDescription ?? post.excerpt,
            slug: post.slug,
            title: post.seoTitle ?? post.title,
          }),
        ]}
      />
      <section className="relative isolate -mt-[100px] overflow-hidden py-20 sm:-mt-[110px] sm:py-24 lg:-mt-[120px] lg:py-28">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="hero-soft-gradient absolute inset-0" />
        <Container>
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center pt-14 text-center sm:pt-16 lg:pt-20">
            <Link href="/blog" className="eyebrow">
              ← Back to blog
            </Link>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8a0917]">
              <span>{post.category}</span>
              <span className="h-1 w-1 rounded-full bg-[#8a0917]" />
              <span>{post.date}</span>
            </div>
            <h1 className="display-title mt-5 text-slate-950">
              {post.title}
            </h1>
            <p className="body-copy mt-6 max-w-3xl text-slate-800">
              {post.excerpt}
            </p>
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <Image src={post.cover} alt={post.title} width={1600} height={900} className="h-[420px] w-full object-cover" />
            </div>
            <div className="mt-12">
              <BlogRichContent blocks={post.sections} />
            </div>
          </div>
        </Container>
      </section>
    </article>
  );
}

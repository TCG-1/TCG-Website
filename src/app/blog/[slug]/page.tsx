import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AuthorBio } from "@/components/blog/author-bio";
import { BlogRichContent } from "@/components/blog/blog-rich-content";
import { ShareButtons } from "@/components/blog/share-buttons";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/sections";
import { getPublishedBlogEntries, getPublishedBlogEntryBySlug } from "@/lib/blog-content";
import { dedupeCoverImageBlocks } from "@/lib/blog-post-utils";
import { createPageMetadata } from "@/lib/site-seo";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

export const revalidate = 300;

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

  const keywords = post.keywords
    ? post.keywords
        .split(",")
        .map((item: string) => item.trim())
        .filter(Boolean)
    : undefined;

  return createPageMetadata({
    description: post.seoDescription ?? post.excerpt,
    image: post.ogImageUrl ?? post.cover,
    keywords,
    noIndex: post.noIndex,
    path: post.canonicalPath || `/blog/${post.slug}`,
    publishedTime: post.publishedAt,
    title: post.seoTitle ?? `${post.title} | Tacklers`,
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
  const allPosts = await getPublishedBlogEntries();

  if (!post) {
    notFound();
  }

  const relatedPosts = allPosts.filter((entry) => entry.slug !== post.slug).slice(0, 4);
  const articleBlocks = dedupeCoverImageBlocks(post.sections, post.cover);

  const articleHeadings = articleBlocks.filter((block) => block.type === "heading");

  const headingLinks = articleHeadings.map((block, index) => ({
    id:
      block.body
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || `section-${index + 1}`,
    label: block.body,
  }));

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
            authorName: post.authorName,
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
      <section className="relative isolate -mt-25 overflow-hidden py-20 sm:-mt-27.5 sm:py-24 lg:-mt-30 lg:py-28">
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
              {post.authorName ? (
                <>
                  <span className="h-1 w-1 rounded-full bg-[#8a0917]" />
                  <span>{post.authorName}</span>
                </>
              ) : null}
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
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12">
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-32 space-y-8">
                {headingLinks.length ? (
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[#795900]">
                      Navigation
                    </h2>
                    <nav className="mt-6 flex flex-col gap-4 text-sm font-medium text-slate-600">
                      {headingLinks.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className="group flex items-center gap-2 transition-colors hover:text-[#8a0917]"
                        >
                          <span className="h-1 w-1 rounded-full bg-[#FDD835] opacity-0 transition-opacity group-hover:opacity-100" />
                          <span>{item.label}</span>
                        </a>
                      ))}
                    </nav>
                  </div>
                ) : null}

                <div className="border-t border-[#8a0917]/10 pt-8">
                  <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[#795900]">
                    Share insight
                  </h2>
                  <div className="mt-5">
                    <ShareButtons
                      url={`https://www.tacklersconsulting.com/blog/${post.slug}`}
                      title={post.title}
                      variant="sidebar"
                    />
                  </div>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-9">
              <div className="rounded-4xl border border-[#8a0917]/10 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:px-10 sm:py-10">
                <div className="mb-10 border-l-4 border-[#FDD835] pl-6">
                  <p className="text-xl font-light italic leading-9 text-slate-600 sm:text-2xl">
                    {post.excerpt}
                  </p>
                </div>

                <BlogRichContent blocks={articleBlocks} />

                {post.authorName ? (
                  <div className="mt-12">
                    <AuthorBio name={post.authorName} />
                  </div>
                ) : null}

                <div className="mt-12 rounded-3xl border border-[#8a0917]/10 bg-slate-50 p-6 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#795900]">Next steps</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                    Turn insight into practical operational gains
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
                    If this topic matches your current priorities, explore our service pathways or book a focused discovery call.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/operational-excellence-consulting-uk" className="button-secondary">
                      Operational excellence services
                    </Link>
                    <Link href="/lean-training-uk" className="button-secondary">
                      Lean mentoring programmes
                    </Link>
                    <Link href="/discovery-call" className="button-primary">
                      Book a discovery call
                    </Link>
                  </div>
                </div>

                <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-[#8a0917]/10 pt-10">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                    Category: <span className="text-[#8a0917]">{post.category}</span>
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600">Share this insight</span>
                    <ShareButtons
                      url={`https://www.tacklersconsulting.com/blog/${post.slug}`}
                      title={post.title}
                      variant="inline"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {relatedPosts.length ? (
        <section className="section-gap bg-slate-50">
          <Container>
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="eyebrow text-[#795900]">Further reading</p>
                  <h2 className="font-sans text-[clamp(2rem,4vw,3rem)] font-light tracking-[-0.03em] text-[#8a0917]">
                    Explore our insights
                  </h2>
                </div>
                <Link href="/blog" className="button-secondary w-fit">
                  View all articles
                </Link>
              </div>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,340px))] justify-center gap-8">
                {relatedPosts.map((entry) => (
                  <article
                    key={entry.slug}
                    className="group w-full overflow-hidden rounded-2xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.12)]"
                  >
                    <div className="h-48 overflow-hidden">
                      <Image
                        src={entry.cover}
                        alt={entry.title}
                        width={720}
                        height={480}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#795900]">
                        {entry.category}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold leading-tight text-slate-950 transition group-hover:text-[#8a0917]">
                        <Link href={`/blog/${entry.slug}`}>{entry.title}</Link>
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{entry.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </section>
      ) : null}
    </article>
  );
}

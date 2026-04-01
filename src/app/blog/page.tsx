import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { JsonLd } from "@/components/seo/json-ld";
import { Container, PageHero } from "@/components/sections";
import { getPublishedBlogEntries } from "@/lib/blog-content";
import { createPageMetadata } from "@/lib/site-seo";
import { buildBlogIndexJsonLd, buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

const blogIndexSeo = {
  description:
    "Read practical articles on Lean transformation, operational excellence, leadership routines, and continuous improvement from Tacklers Consulting Group.",
  image: "/media/photo-1515169067868-5387ec356754-6a0fcd5a.jpg",
  title: "Lean Transformation & Operational Excellence Blog | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: blogIndexSeo.description,
  image: blogIndexSeo.image,
  keywords: [
    "lean transformation blog",
    "operational excellence articles",
    "continuous improvement insights",
    "gemba consulting blog",
    "lean manufacturing uk blog",
  ],
  path: "/blog",
  title: blogIndexSeo.title,
});

export const revalidate = 300;

export default async function BlogIndexPage() {
  const blogPosts = await getPublishedBlogEntries();

  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: blogIndexSeo.description,
            path: "/blog",
            title: blogIndexSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          buildBlogIndexJsonLd(blogPosts.map((post) => ({ slug: post.slug, title: post.title }))),
        ]}
      />
      <PageHero
        eyebrow="Our blogs"
        title="Lean Insights & Success Stories"
        body="Practical perspectives on operational excellence, industry-specific Lean strategy, and building sustainable internal capability."
        primary={{ label: "Book a discovery call", href: "/discovery-call" }}
        secondary={{ label: "Request an on-site assessment", href: "/on-site-assessment" }}
        image={blogIndexSeo.image}
      />

      <section className="section-gap">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="service-card group relative overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#8a0917] via-[#b41626] to-[#FDD835] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                <div className="relative overflow-hidden">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    width={1200}
                    height={720}
                    className="h-72 w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute left-6 top-6 inline-flex items-center rounded-full bg-white/92 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#8a0917] shadow-sm backdrop-blur-sm">
                    {post.category}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <span>{post.date}</span>
                    {post.authorName ? (
                      <>
                        <span className="h-1 w-1 rounded-full bg-[#8a0917]" />
                        <span>{post.authorName}</span>
                      </>
                    ) : null}
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 transition duration-300 group-hover:text-[#8a0917]">
                    <Link href={`/blog/${post.slug}`} className="transition">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-slate-600">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#8a0917] transition-all duration-300 group-hover:gap-3"
                  >
                    Read article
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

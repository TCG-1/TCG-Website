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
    "Read Tacklers Consulting Group articles on Lean transformation, operational excellence, leadership routines, and practical improvement work.",
  image: "/media/photo-1515169067868-5387ec356754-6a0fcd5a.jpg",
  title: "Lean Transformation Blog | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: blogIndexSeo.description,
  image: blogIndexSeo.image,
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
                className="group relative overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-2 hover:border-[#8a0917]/15 hover:shadow-[0_30px_100px_rgba(15,23,42,0.12)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8a0917] via-[#b41626] to-[#FDD835] opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="overflow-hidden">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    width={1200}
                    height={720}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8a0917]">
                    <span>{post.category}</span>
                    <span className="h-1 w-1 rounded-full bg-[#8a0917]" />
                    <span>{post.date}</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 transition duration-300 group-hover:text-[#8a0917]">
                    <Link href={`/blog/${post.slug}`} className="transition">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-slate-600">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#8a0917] transition duration-300 group-hover:gap-3"
                  >
                    Learn more
                    <span aria-hidden="true">→</span>
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

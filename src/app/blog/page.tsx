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
  title: "Lean & Operational Excellence Blog | Tacklers",
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

      <section className="pb-6">
        <Container>
          <div className="mx-auto max-w-4xl rounded-3xl border border-black/5 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">What you will learn from this Lean blog</h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              This blog is built for operations leaders, plant managers, and transformation sponsors who need practical guidance they can apply quickly.
              We focus on real delivery experience across UK organisations: reducing waste at process level, stabilising flow, improving daily management,
              and building leadership routines that make performance gains stick. Each article translates Lean principles into practical steps that work
              in live environments, not just in workshop slides.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-700">
              You will find frameworks for diagnosing bottlenecks, designing improvement roadmaps, coaching team capability, and embedding continuous
              improvement behaviours. We also cover common failure patterns in operational excellence programmes, including change fatigue, unclear
              ownership, weak follow-through, and over-complex implementation plans. Our goal is to help you prioritise the few actions that create
              measurable business results and build long-term internal capability.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-700">
              If you want support beyond articles, explore our <Link href="/operational-excellence-consulting-uk" className="font-semibold text-[#8a0917] underline-offset-4 hover:underline">operational excellence consulting services</Link>,
              <Link href="/lean-training-uk" className="ml-1 font-semibold text-[#8a0917] underline-offset-4 hover:underline">Lean training programmes</Link>,
              or <Link href="/discovery-call" className="font-semibold text-[#8a0917] underline-offset-4 hover:underline">book a discovery call</Link> to discuss your current priorities.
            </p>
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="service-card group relative overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-linear-to-r from-[#8a0917] via-[#b41626] to-[#FDD835] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                <div className="relative overflow-hidden">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    width={1200}
                    height={720}
                    className="h-56 w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/92 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#8a0917] shadow-sm backdrop-blur-sm">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <span>{post.date}</span>
                    {post.authorName ? (
                      <>
                        <span className="h-1 w-1 rounded-full bg-[#8a0917]" />
                        <span>{post.authorName}</span>
                      </>
                    ) : null}
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-slate-950 transition duration-300 group-hover:text-[#8a0917]">
                    <Link href={`/blog/${post.slug}`} className="transition">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#8a0917] transition-all duration-300 group-hover:gap-3"
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

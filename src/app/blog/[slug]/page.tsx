import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/sections";
import { getPublishedBlogEntries, getPublishedBlogEntryBySlug } from "@/lib/blog-content";

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
    return { title: "Post not found" };
  }

  return {
    title: `${post.title} | Tacklers Blog`,
    description: post.excerpt,
  };
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
            <h1 className="display-title mt-5 text-[#8a0917]">
              {post.title}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-800">
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
          <div className="prose prose-lg mt-12 max-w-none prose-headings:text-slate-950 prose-p:text-slate-700">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        </Container>
      </section>
    </article>
  );
}

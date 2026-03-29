import { normalizeBlogRenderBlocks } from "@/lib/blog-rich-text";
import { readBlogBody } from "@/lib/portal-data";
import { ensureBlogSeedData } from "@/lib/portal-seed";
import { blogPosts as staticBlogPosts } from "@/lib/site-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type PublishedBlogEntry = {
  canonicalPath?: string | null;
  category: string;
  content: string[];
  cover: string;
  date: string;
  excerpt: string;
  noIndex: boolean;
  ogImageUrl: string | null;
  publishedAt: string | null;
  sections: ReturnType<typeof normalizeBlogRenderBlocks>;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string;
  title: string;
  updatedAt: string | null;
};

const FALLBACK_COVER = "/media/photo-1517976487492-5750f3195933-200958be.jpg";

function createFallbackEntries(): PublishedBlogEntry[] {
  return staticBlogPosts.map((post) => ({
    canonicalPath: post.canonicalPath ?? null,
    category: post.category,
    content: post.content,
    cover: post.cover,
    date: post.date,
    excerpt: post.excerpt,
    noIndex: post.noIndex ?? false,
    ogImageUrl: post.ogImageUrl ?? null,
    publishedAt: post.publishedAt ?? null,
    sections: post.content.map((item) => ({
      body: item,
      image: null,
      items: [],
      type: "paragraph" as const,
    })),
    seoDescription: post.seoDescription ?? post.excerpt,
    seoTitle: post.seoTitle ?? null,
    slug: post.slug,
    title: post.title,
    updatedAt: post.updatedAt ?? post.publishedAt ?? null,
  }));
}

export async function getPublishedBlogEntries(): Promise<PublishedBlogEntry[]> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return createFallbackEntries();
  }

  try {
    await ensureBlogSeedData(supabase);

    const [{ data: posts, error: postsError }, { data: sections, error: sectionsError }] = await Promise.all([
      supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false }),
      supabase
        .from("blog_post_sections")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

    if (postsError) {
      throw new Error(postsError.message);
    }

    if (sectionsError) {
      throw new Error(sectionsError.message);
    }

    const sectionsByPostId = new Map<string, typeof sections>();

    (sections ?? []).forEach((section) => {
      const existing = sectionsByPostId.get(section.post_id) ?? [];
      existing.push(section);
      sectionsByPostId.set(section.post_id, existing);
    });

    if (!posts?.length) {
      return createFallbackEntries();
    }

    return posts.map((post) => {
      const sectionRows = sectionsByPostId.get(post.id) ?? [];
      const body = readBlogBody(sectionRows);
      const paragraphs = body
        .split(/\n{2,}/)
        .map((item) => item.trim())
        .filter(Boolean);

      return {
        canonicalPath: post.canonical_url ?? null,
        category: post.category ?? "Lean Insights",
        content: paragraphs.length ? paragraphs : [post.excerpt],
        cover: post.cover_url ?? FALLBACK_COVER,
        date: post.published_at
          ? new Date(post.published_at).toLocaleDateString("en-GB", { dateStyle: "medium" })
          : "Draft",
        excerpt: post.excerpt,
        noIndex: post.noindex ?? false,
        ogImageUrl: post.og_image_url ?? post.cover_url ?? null,
        publishedAt: post.published_at ?? null,
        sections: normalizeBlogRenderBlocks(sectionRows),
        seoDescription: post.seo_description ?? post.excerpt,
        seoTitle: post.seo_title ?? null,
        slug: post.slug,
        title: post.title,
        updatedAt: post.updated_at ?? null,
      };
    });
  } catch {
    return createFallbackEntries();
  }
}

export async function getPublishedBlogEntryBySlug(slug: string) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    const fallbackPosts = createFallbackEntries();
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  }

  try {
    await ensureBlogSeedData(supabase);

    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();

    if (postError) {
      throw new Error(postError.message);
    }

    if (!post) {
      return null;
    }

    const { data: sections, error: sectionsError } = await supabase
      .from("blog_post_sections")
      .select("*")
      .eq("post_id", post.id)
      .order("sort_order", { ascending: true });

    if (sectionsError) {
      throw new Error(sectionsError.message);
    }

    const body = readBlogBody(sections ?? []);
    const paragraphs = body
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean);

    return {
      canonicalPath: post.canonical_url ?? null,
      category: post.category ?? "Lean Insights",
      content: paragraphs.length ? paragraphs : [post.excerpt],
      cover: post.cover_url ?? FALLBACK_COVER,
      date: post.published_at
        ? new Date(post.published_at).toLocaleDateString("en-GB", { dateStyle: "medium" })
        : "Draft",
      excerpt: post.excerpt,
      noIndex: post.noindex ?? false,
      ogImageUrl: post.og_image_url ?? post.cover_url ?? null,
      publishedAt: post.published_at ?? null,
      sections: normalizeBlogRenderBlocks(sections ?? []),
      seoDescription: post.seo_description ?? post.excerpt,
      seoTitle: post.seo_title ?? null,
      slug: post.slug,
      title: post.title,
      updatedAt: post.updated_at ?? null,
    };
  } catch {
    const fallbackPosts = createFallbackEntries();
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  }
}

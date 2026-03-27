import { readBlogBody } from "@/lib/portal-data";
import { ensureBlogSeedData } from "@/lib/portal-seed";
import { blogPosts as staticBlogPosts } from "@/lib/site-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type PublishedBlogEntry = {
  category: string;
  content: string[];
  cover: string;
  date: string;
  excerpt: string;
  slug: string;
  title: string;
};

const FALLBACK_COVER = "/media/photo-1517976487492-5750f3195933-200958be.jpg";

export async function getPublishedBlogEntries(): Promise<PublishedBlogEntry[]> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return staticBlogPosts;
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
      return staticBlogPosts;
    }

    return posts.map((post) => {
      const paragraphs = readBlogBody(sectionsByPostId.get(post.id) ?? [])
        .split(/\n{2,}/)
        .map((item) => item.trim())
        .filter(Boolean);

      return {
        category: post.category ?? "Lean Insights",
        content: paragraphs.length ? paragraphs : [post.excerpt],
        cover: post.cover_url ?? FALLBACK_COVER,
        date: post.published_at
          ? new Date(post.published_at).toLocaleDateString("en-GB", { dateStyle: "medium" })
          : "Draft",
        excerpt: post.excerpt,
        slug: post.slug,
        title: post.title,
      };
    });
  } catch {
    return staticBlogPosts;
  }
}

export async function getPublishedBlogEntryBySlug(slug: string) {
  const posts = await getPublishedBlogEntries();
  return posts.find((post) => post.slug === slug) ?? null;
}

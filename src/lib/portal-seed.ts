import type { SupabaseClient } from "@supabase/supabase-js";

import { blogPosts } from "@/lib/site-data";

/**
 * Incremental seed — fetches all existing slugs and inserts any
 * entries from the static `blogPosts` array that don't yet exist
 * in the database.  This means newly-added seed posts are picked
 * up automatically even when the table already contains data.
 */
export async function ensureBlogSeedData(supabase: SupabaseClient) {
  /* ── 1. Fetch every slug already present in the table ─────── */
  const { data: existingRows, error: existingError } = await supabase
    .from("blog_posts")
    .select("slug");

  if (existingError) {
    throw new Error(existingError.message);
  }

  const existingSlugs = new Set((existingRows ?? []).map((row) => row.slug));

  /* ── 2. Determine which seed posts are missing ────────────── */
  const missingPosts = blogPosts.filter((post) => !existingSlugs.has(post.slug));

  if (!missingPosts.length) {
    return; // everything is already seeded
  }

  /* ── 3. Insert the missing posts ──────────────────────────── */
  const { data: insertedPosts, error: insertPostsError } = await supabase
    .from("blog_posts")
    .insert(
      missingPosts.map((post) => ({
        author_name: post.author ?? null,
        category: post.category,
        canonical_url: post.canonicalPath ?? null,
        cover_url: post.cover,
        excerpt: post.excerpt,
        noindex: post.noIndex ?? false,
        og_image_url: post.ogImageUrl ?? post.cover,
        published_at: new Date(post.date).toISOString(),
        seo_description: post.seoDescription ?? post.excerpt,
        seo_title: post.seoTitle ?? post.title,
        slug: post.slug,
        status: "published",
        title: post.title,
      })),
    )
    .select("id, slug");

  if (insertPostsError || !insertedPosts) {
    throw new Error(insertPostsError?.message ?? "Unable to seed blog posts.");
  }

  /* ── 4. Insert sections for the newly-seeded posts ────────── */
  const postIdBySlug = new Map(insertedPosts.map((item) => [item.slug, item.id]));
  const sectionRows = missingPosts.flatMap((post) =>
    post.content.map((section, index) => ({
      body: section,
      post_id: postIdBySlug.get(post.slug),
      section_type: "paragraph",
      sort_order: index,
    })),
  );

  const validSectionRows = sectionRows.filter((row) => row.post_id);

  if (!validSectionRows.length) {
    return;
  }

  const { error: insertSectionsError } = await supabase
    .from("blog_post_sections")
    .insert(validSectionRows);

  if (insertSectionsError) {
    throw new Error(insertSectionsError.message);
  }
}

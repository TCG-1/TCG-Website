import type { SupabaseClient } from "@supabase/supabase-js";

import { blogPosts } from "@/lib/site-data";

export async function ensureBlogSeedData(supabase: SupabaseClient) {
  const { count, error } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(error.message);
  }

  if ((count ?? 0) > 0) {
    return;
  }

  const { data: insertedPosts, error: insertPostsError } = await supabase
    .from("blog_posts")
    .insert(
      blogPosts.map((post) => ({
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

  const postIdBySlug = new Map(insertedPosts.map((item) => [item.slug, item.id]));
  const sectionRows = blogPosts.flatMap((post) =>
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

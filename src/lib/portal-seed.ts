import type { SupabaseClient } from "@supabase/supabase-js";

import { adminLeadRows } from "@/lib/admin-data";
import { blogPosts } from "@/lib/site-data";

function mapLeadStatus(status: string) {
  switch (status.trim().toLowerCase()) {
    case "qualified":
      return "qualified";
    case "follow-up":
      return "follow_up";
    case "closed":
      return "closed";
    default:
      return "new";
  }
}

export async function ensureLeadSeedData(supabase: SupabaseClient) {
  const { count, error } = await supabase
    .from("lead_submissions")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(error.message);
  }

  if ((count ?? 0) > 0) {
    return;
  }

  const { error: insertError } = await supabase.from("lead_submissions").insert(
    adminLeadRows.map((lead) => ({
      company_name: lead.company,
      email: lead.email,
      full_name: lead.name,
      source: lead.source.toLowerCase().replace(/\s+/g, "-"),
      status: mapLeadStatus(lead.status),
    })),
  );

  if (insertError) {
    throw new Error(insertError.message);
  }
}

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

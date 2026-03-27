import {
  createAdminAuditEntry,
  ensureAdminPortalContext,
  readBlogBody,
  serializeBlogSections,
  slugifyText,
} from "@/lib/portal-data";
import { ensureBlogSeedData } from "@/lib/portal-seed";

export const runtime = "nodejs";

const BLOG_STATUSES = new Set(["draft", "published", "archived"]);

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value: unknown) {
  const normalized = normalizeText(value);
  return normalized || null;
}

function normalizeBoolean(value: unknown) {
  return value === true || value === "true";
}

async function resolveUniqueSlug(
  supabase: Awaited<ReturnType<typeof ensureAdminPortalContext>>["supabase"],
  requestedSlug: string,
) {
  const baseSlug = slugifyText(requestedSlug) || "blog-post";
  let candidate = baseSlug;
  let iteration = 2;

  while (true) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", candidate)
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.length) {
      return candidate;
    }

    candidate = `${baseSlug}-${iteration}`;
    iteration += 1;
  }
}

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function GET() {
  try {
    const { supabase } = await ensureAdminPortalContext();
    await ensureBlogSeedData(supabase);

    const [{ data: posts, error: postsError }, { data: sections }] = await Promise.all([
      supabase.from("blog_posts").select("*").order("updated_at", { ascending: false }),
      supabase.from("blog_post_sections").select("*").order("sort_order", { ascending: true }),
    ]);

    if (postsError) {
      throw new Error(postsError.message);
    }

    const sectionsByPostId = new Map<string, typeof sections>();

    (sections ?? []).forEach((section) => {
      const existing = sectionsByPostId.get(section.post_id) ?? [];
      existing.push(section);
      sectionsByPostId.set(section.post_id, existing);
    });

    return Response.json({
      posts: (posts ?? []).map((post) => ({
        ...post,
        body: readBlogBody(sectionsByPostId.get(post.id) ?? []),
      })),
      stats: {
        draft: posts?.filter((post) => post.status === "draft").length ?? 0,
        published: posts?.filter((post) => post.status === "published").length ?? 0,
        total: posts?.length ?? 0,
      },
    });
  } catch (error) {
    return toResponseError(error, "Unable to load blog posts right now.");
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await ensureAdminPortalContext();
    const body = (await request.json()) as Record<string, unknown>;
    const rawTitle = normalizeText(body.title);
    const postBody = normalizeText(body.body);
    const category = normalizeOptionalText(body.category);
    const canonicalUrl = normalizeOptionalText(body.canonicalUrl);
    const coverUrl = normalizeOptionalText(body.coverUrl);
    const noIndex = normalizeBoolean(body.noIndex);
    const ogImageUrl = normalizeOptionalText(body.ogImageUrl);
    const status = normalizeText(body.status).toLowerCase() || "draft";
    const title = rawTitle || (status === "draft" ? "Untitled draft" : "");
    const requestedSlug = normalizeText(body.slug) || title;
    const excerpt = normalizeText(body.excerpt) || (status === "draft" ? "Draft excerpt in progress." : "");
    const seoDescription = normalizeOptionalText(body.seoDescription) ?? excerpt;
    const seoTitle = normalizeOptionalText(body.seoTitle);

    if (!BLOG_STATUSES.has(status)) {
      return Response.json({ error: "Invalid blog status." }, { status: 400 });
    }

    if (!title || !excerpt || (!postBody && status !== "draft")) {
      return Response.json({ error: "Title, excerpt, and body are required." }, { status: 400 });
    }

    const slug = await resolveUniqueSlug(supabase, requestedSlug);

    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .insert([
        {
          canonical_url: canonicalUrl,
          category,
          cover_url: coverUrl,
          excerpt,
          noindex: noIndex,
          og_image_url: ogImageUrl,
          published_at: status === "published" ? new Date().toISOString() : null,
          seo_description: seoDescription,
          seo_title: seoTitle,
          slug,
          status,
          title,
        },
      ])
      .select("*")
      .single();

    if (postError || !post) {
      throw new Error(postError?.message ?? "Unable to create the blog post.");
    }

    const sectionRows = serializeBlogSections(postBody).map((section) => ({
      ...section,
      post_id: post.id,
    }));

    const { error: sectionsError } = sectionRows.length
      ? await supabase.from("blog_post_sections").insert(sectionRows)
      : { error: null };

    if (sectionsError) {
      throw new Error(sectionsError.message);
    }

    await createAdminAuditEntry({
      actionType: "blog_post_created",
      entityId: post.id,
      entityTable: "blog_posts",
      payload: {
        canonicalUrl,
        noIndex,
        seoTitle,
        slug,
        status,
        title,
      },
      summary: `Created blog post ${title}.`,
    });

    return Response.json({ post: { ...post, body: postBody } }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to create the blog post right now.");
  }
}

import {
  createAdminAuditEntry,
  createBlogSlug,
  ensureAdminPortalContext,
  readBlogBody,
  serializeBlogSections,
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
    const title = normalizeText(body.title);
    const excerpt = normalizeText(body.excerpt);
    const postBody = normalizeText(body.body);
    const category = normalizeOptionalText(body.category);
    const coverUrl = normalizeOptionalText(body.coverUrl);
    const status = normalizeText(body.status).toLowerCase() || "draft";

    if (!title || !excerpt || !postBody) {
      return Response.json({ error: "Title, excerpt, and body are required." }, { status: 400 });
    }

    if (!BLOG_STATUSES.has(status)) {
      return Response.json({ error: "Invalid blog status." }, { status: 400 });
    }

    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .insert([
        {
          category,
          cover_url: coverUrl,
          excerpt,
          published_at: status === "published" ? new Date().toISOString() : null,
          slug: createBlogSlug(title),
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

    const { error: sectionsError } = await supabase.from("blog_post_sections").insert(sectionRows);

    if (sectionsError) {
      throw new Error(sectionsError.message);
    }

    await createAdminAuditEntry({
      actionType: "blog_post_created",
      entityId: post.id,
      entityTable: "blog_posts",
      payload: {
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

import {
  createAdminAuditEntry,
  ensureAdminPortalContext,
  readBlogBody,
  serializeBlogSections,
} from "@/lib/portal-data";

export const runtime = "nodejs";

const BLOG_STATUSES = new Set(["draft", "published", "archived"]);

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { supabase } = await ensureAdminPortalContext();
    const { id } = await context.params;
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
      .update({
        category,
        cover_url: coverUrl,
        excerpt,
        published_at: status === "published" ? new Date().toISOString() : null,
        status,
        title,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (postError || !post) {
      throw new Error(postError?.message ?? "Unable to update the blog post.");
    }

    await supabase.from("blog_post_sections").delete().eq("post_id", id);

    const sectionRows = serializeBlogSections(postBody).map((section) => ({
      ...section,
      post_id: id,
    }));

    const { error: sectionsError } = await supabase.from("blog_post_sections").insert(sectionRows);

    if (sectionsError) {
      throw new Error(sectionsError.message);
    }

    await createAdminAuditEntry({
      actionType: "blog_post_updated",
      entityId: post.id,
      entityTable: "blog_posts",
      payload: {
        status,
        title,
      },
      summary: `Updated blog post ${title}.`,
    });

    return Response.json({ post: { ...post, body: postBody } });
  } catch (error) {
    return toResponseError(error, "Unable to update the blog post right now.");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { supabase } = await ensureAdminPortalContext();
    const { id } = await context.params;

    const { data: existingPost } = await supabase
      .from("blog_posts")
      .select("id, title")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    await createAdminAuditEntry({
      actionType: "blog_post_deleted",
      entityId: id,
      entityTable: "blog_posts",
      payload: {
        title: existingPost?.title ?? null,
      },
      summary: `Deleted blog post ${existingPost?.title ?? id}.`,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return toResponseError(error, "Unable to delete the blog post right now.");
  }
}

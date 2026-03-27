import {
  createAdminAuditEntry,
  ensureAdminPortalContext,
  serializeBlogSections,
  slugifyText,
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

function normalizeBoolean(value: unknown) {
  return value === true || value === "true";
}

async function resolveUniqueSlug(
  supabase: Awaited<ReturnType<typeof ensureAdminPortalContext>>["supabase"],
  requestedSlug: string,
  postId: string,
) {
  const baseSlug = slugifyText(requestedSlug) || "blog-post";
  let candidate = baseSlug;
  let iteration = 2;

  while (true) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", candidate)
      .neq("id", postId)
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

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { supabase } = await ensureAdminPortalContext();
    const { id } = await context.params;
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

    const slug = await resolveUniqueSlug(supabase, requestedSlug, id);

    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .update({
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

    const { error: sectionsError } = sectionRows.length
      ? await supabase.from("blog_post_sections").insert(sectionRows)
      : { error: null };

    if (sectionsError) {
      throw new Error(sectionsError.message);
    }

    await createAdminAuditEntry({
      actionType: "blog_post_updated",
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

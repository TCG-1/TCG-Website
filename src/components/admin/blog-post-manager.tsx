"use client";

import { useEffect, useMemo, useState } from "react";

import { TiptapBlogEditor } from "@/components/admin/tiptap-blog-editor";
import { BlogRichContent } from "@/components/blog/blog-rich-content";
import { requestJson, useLiveApi } from "@/components/portal/use-live-api";
import { dedupeCoverImageBlocks } from "@/lib/blog-post-utils";
import {
  normalizeBlogRenderBlocks,
  serializeRichTextToSections,
} from "@/lib/blog-rich-text";
import { absoluteUrl } from "@/lib/site-seo";

type BlogPost = {
  author_name: string | null;
  body: string;
  canonical_url: string | null;
  category: string | null;
  cover_url: string | null;
  excerpt: string;
  id: string;
  keywords: string | null;
  noindex: boolean;
  og_image_url: string | null;
  published_at: string | null;
  seo_description: string | null;
  seo_title: string | null;
  slug: string;
  status: string;
  title: string;
  updated_at: string;
};

type BlogFormState = {
  canonicalUrl: string;
  category: string;
  coverUrl: string;
  excerpt: string;
  keywords: string;
  noIndex: boolean;
  ogImageUrl: string;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  status: string;
  title: string;
};

type AdminBlogPayload = {
  posts: BlogPost[];
  stats: {
    draft: number;
    published: number;
    total: number;
  };
};

type Notice = { message: string; tone: "error" | "success" } | null;

type ModalState = {
  baselineStatus: string;
  mode: "create" | "edit";
  postId: string | null;
} | null;

const EMPTY_PAYLOAD: AdminBlogPayload = {
  posts: [],
  stats: {
    draft: 0,
    published: 0,
    total: 0,
  },
};

const EMPTY_FORM: BlogFormState = {
  canonicalUrl: "",
  category: "",
  coverUrl: "",
  excerpt: "",
  keywords: "",
  noIndex: false,
  ogImageUrl: "",
  seoDescription: "",
  seoTitle: "",
  slug: "",
  status: "draft",
  title: "",
};

function slugifyDraft(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return "Not published";
  }

  return new Date(value).toLocaleDateString("en-GB", {
    dateStyle: "medium",
  });
}

function toFormState(post: BlogPost): BlogFormState {
  return {
    canonicalUrl: post.canonical_url ?? "",
    category: post.category ?? "",
    coverUrl: post.cover_url ?? "",
    excerpt: post.excerpt,
    keywords: post.keywords ?? "",
    noIndex: post.noindex ?? false,
    ogImageUrl: post.og_image_url ?? "",
    seoDescription: post.seo_description ?? "",
    seoTitle: post.seo_title ?? "",
    slug: post.slug,
    status: post.status,
    title: post.title,
  };
}

function buildSeoPreview(form: BlogFormState) {
  const resolvedSlug = slugifyDraft(form.slug || form.title) || "new-post";
  const canonicalPath = form.canonicalUrl.trim() || `/blog/${resolvedSlug}`;
  const previewTitle = form.seoTitle.trim() || form.title.trim() || "Untitled post";
  const previewDescription =
    form.seoDescription.trim() || form.excerpt.trim() || "Add a meta description to shape search snippets.";

  return {
    canonicalPath,
    previewDescription,
    previewTitle,
  };
}

function countTone(value: number, idealMin: number, idealMax: number) {
  if (value === 0) {
    return "text-slate-400";
  }

  if (value >= idealMin && value <= idealMax) {
    return "text-emerald-600";
  }

  return "text-amber-600";
}

function recalcStats(posts: BlogPost[]) {
  return {
    draft: posts.filter((post) => post.status === "draft").length,
    published: posts.filter((post) => post.status === "published").length,
    total: posts.length,
  };
}

function upsertPost(payload: AdminBlogPayload, post: BlogPost) {
  const existingIndex = payload.posts.findIndex((item) => item.id === post.id);
  const nextPosts = payload.posts.slice();

  if (existingIndex >= 0) {
    nextPosts[existingIndex] = post;
  } else {
    nextPosts.unshift(post);
  }

  nextPosts.sort((left, right) => right.updated_at.localeCompare(left.updated_at));

  return {
    posts: nextPosts,
    stats: recalcStats(nextPosts),
  };
}

function removePost(payload: AdminBlogPayload, id: string) {
  const nextPosts = payload.posts.filter((post) => post.id !== id);
  return {
    posts: nextPosts,
    stats: recalcStats(nextPosts),
  };
}

function SeoPreviewCard({ form, hasBody }: { form: BlogFormState; hasBody: boolean }) {
  const seoPreview = buildSeoPreview(form);
  const titleLength = seoPreview.previewTitle.length;
  const descriptionLength = seoPreview.previewDescription.length;
  const keywordCount = form.keywords
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean).length;

  const checks = [
    {
      label: "SEO title length",
      ok: titleLength >= 30 && titleLength <= 60,
      hint: "Target 30–60 characters",
    },
    {
      label: "Meta description length",
      ok: descriptionLength >= 120 && descriptionLength <= 160,
      hint: "Target 120–160 characters",
    },
    {
      label: "Canonical path",
      ok: seoPreview.canonicalPath.startsWith("/") || /^https?:\/\//i.test(seoPreview.canonicalPath),
      hint: "Use /blog/slug or absolute URL",
    },
    {
      label: "Keywords",
      ok: keywordCount > 0,
      hint: "Add comma-separated keywords",
    },
    {
      label: "OG image",
      ok: form.ogImageUrl.trim().length > 0 || form.coverUrl.trim().length > 0,
      hint: "Set OG image or cover image",
    },
    {
      label: "Content blocks",
      ok: hasBody,
      hint: "Add article content before publish",
    },
  ];

  const passingChecks = checks.filter((item) => item.ok).length;

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">SEO blueprint</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">Search preview</h3>
        </div>
        <div className="grid gap-1 text-right text-xs">
          <span className={countTone(titleLength, 30, 60)}>Title: {titleLength} chars</span>
          <span className={countTone(descriptionLength, 120, 160)}>Description: {descriptionLength} chars</span>
        </div>
      </div>
      <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-lg font-medium leading-7 text-[#1a0dab]">{seoPreview.previewTitle}</p>
        <p className="mt-1 break-all text-sm text-emerald-700">{absoluteUrl(seoPreview.canonicalPath)}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{seoPreview.previewDescription}</p>
      </div>
      <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-white px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Validation checks ({passingChecks}/{checks.length})
        </p>
        <ul className="mt-3 grid gap-2 text-sm">
          {checks.map((check) => (
            <li key={check.label} className="flex items-start justify-between gap-3">
              <span className={check.ok ? "text-emerald-700" : "text-amber-700"}>
                {check.ok ? "✓" : "!"} {check.label}
              </span>
              {!check.ok ? <span className="text-xs text-slate-500">{check.hint}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BlogEditorModal({
  body,
  form,
  isDeleting,
  isSaving,
  mode,
  onBodyChange,
  onClose,
  onDelete,
  onFormChange,
  onSave,
  open,
}: {
  body: string;
  form: BlogFormState;
  isDeleting: boolean;
  isSaving: boolean;
  mode: "create" | "edit";
  onBodyChange: (next: string) => void;
  onClose: () => void;
  onDelete?: () => void;
  onFormChange: (patch: Partial<BlogFormState>) => void;
  onSave: (status?: string) => void;
  open: boolean;
}) {
  const previewBlocks = useMemo(
    () =>
      dedupeCoverImageBlocks(
        normalizeBlogRenderBlocks(serializeRichTextToSections(body)),
        form.coverUrl,
      ),
    [form.coverUrl, body],
  );
  const tableOfContents = previewBlocks.filter((block) => block.type === "heading");

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-120 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[94vh] w-full max-w-355 flex-col overflow-hidden rounded-4xl border border-white/60 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.24)]"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/5 bg-[linear-gradient(135deg,#690711_0%,#8a0917_62%,#b31223_100%)] px-6 py-5 text-white sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#FDD835]">Rich text blog editor</p>
            <h2 className="mt-2 text-3xl font-light tracking-[-0.04em]">
              {mode === "create" ? "Write a new article" : "Edit article"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/80">
              Format text with the toolbar above the editor. Bold, headings, links, images, quotes, and lists are all reflected in real time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={onClose} className="button-light">
              Close
            </button>
            <button type="button" onClick={() => onSave()} className="button-light" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save as draft"}
            </button>
            <button
              type="button"
              onClick={() => onSave("published")}
              className="button-primary"
              disabled={isSaving || !form.title.trim() || !body.trim()}
              title={!form.title.trim() ? "Add a title to publish" : !body.trim() ? "Add content to publish" : ""}
            >
              {isSaving ? "Publishing..." : "Publish post"}
            </button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-0 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="min-h-0 overflow-y-auto border-r border-black/5 px-6 py-6 sm:px-8">
            <div className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Title
                  <input
                    className="input"
                    value={form.title}
                    onChange={(event) => onFormChange({ title: event.target.value })}
                    placeholder="Lean transformation in aerospace MAIT"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Slug
                  <input
                    className="input"
                    value={form.slug}
                    onChange={(event) => onFormChange({ slug: event.target.value })}
                    placeholder="clean-seo-slug"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Category
                  <input
                    className="input"
                    value={form.category}
                    onChange={(event) => onFormChange({ category: event.target.value })}
                    placeholder="Operational Excellence"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Status
                  <select
                    className="input"
                    value={form.status}
                    onChange={(event) => onFormChange({ status: event.target.value })}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  Cover image URL
                  <input
                    className="input"
                    value={form.coverUrl}
                    onChange={(event) => onFormChange({ coverUrl: event.target.value })}
                    placeholder="/media/example.jpg"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  Excerpt
                  <textarea
                    rows={3}
                    className="input min-h-24 resize-y"
                    value={form.excerpt}
                    onChange={(event) => onFormChange({ excerpt: event.target.value })}
                    placeholder="Short framing paragraph for blog cards and search previews."
                  />
                </label>
              </div>

              <TiptapBlogEditor
                initialMarkdown={body}
                onChange={onBodyChange}
                placeholder="Start writing your article here — use the toolbar for headings, bold, links, images, quotes, and lists..."
              />
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto bg-slate-50 px-6 py-6 sm:px-8">
            <div className="grid gap-6">
              <SeoPreviewCard form={form} hasBody={body.trim().length > 0} />

              <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Generated table of contents</p>
                {tableOfContents.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {tableOfContents.map((block, index) => (
                      <li key={`${block.body}-${index}`} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#FDD835]" />
                        <span>{block.body}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    Add headings in the editor and the live table of contents will generate automatically.
                  </p>
                )}
              </div>

              <details className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)]" open>
                <summary className="cursor-pointer text-base font-semibold text-slate-950">SEO and sharing fields</summary>
                <div className="mt-5 grid gap-4">
                  <input className="input" value={form.seoTitle} onChange={(event) => onFormChange({ seoTitle: event.target.value })} placeholder="SEO title" />
                  <textarea rows={3} className="input min-h-24 resize-y" value={form.seoDescription} onChange={(event) => onFormChange({ seoDescription: event.target.value })} placeholder="Meta description" />
                  <input className="input" value={form.keywords} onChange={(event) => onFormChange({ keywords: event.target.value })} placeholder="Keywords (comma-separated)" />
                  <input className="input" value={form.canonicalUrl} onChange={(event) => onFormChange({ canonicalUrl: event.target.value })} placeholder="/blog/example-post" />
                  <input className="input" value={form.ogImageUrl} onChange={(event) => onFormChange({ ogImageUrl: event.target.value })} placeholder="/media/social-share.jpg" />
                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input type="checkbox" checked={form.noIndex} onChange={(event) => onFormChange({ noIndex: event.target.checked })} />
                    Keep this post out of search indexes
                  </label>
                </div>
              </details>

              <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Live article preview</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">{form.title || "Untitled post"}</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                    {form.status}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{form.excerpt || "Add an excerpt to frame the article."}</p>
                <div className="mt-6">
                  {previewBlocks.length ? (
                    <BlogRichContent blocks={previewBlocks} />
                  ) : (
                    <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-500">
                      Start writing in the editor to preview your article here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/5 bg-white px-6 py-4 sm:px-8">
          <div className="flex flex-wrap gap-3" style={{ marginLeft: "auto" }}>
            {mode === "edit" && onDelete ? (
              <button type="button" onClick={onDelete} className="rounded-full border border-red-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-50" disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete post"}
              </button>
            ) : null}
            <button type="button" onClick={onClose} className="button-secondary">
              Close
            </button>
            <button type="button" onClick={() => onSave()} className="button-secondary" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save as draft"}
            </button>
            <button
              type="button"
              onClick={() => onSave("published")}
              className="button-primary"
              disabled={isSaving || !form.title.trim() || !body.trim()}
              title={!form.title.trim() ? "Add a title to publish" : !body.trim() ? "Add content to publish" : ""}
            >
              {isSaving ? "Publishing..." : "Publish post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogPostManager() {
  const { data, error, isLoading, refresh, setData } = useLiveApi<AdminBlogPayload>(
    "/api/admin/blog",
    EMPTY_PAYLOAD,
  );
  const [notice, setNotice] = useState<Notice>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<BlogFormState>(EMPTY_FORM);
  const [body, setBody] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  function openCreateModal() {
    const nextModal: ModalState = { baselineStatus: "draft", mode: "create", postId: null };
    setModal(nextModal);
    setForm(EMPTY_FORM);
    setBody("");
  }

  function openEditModal(post: BlogPost) {
    const nextModal: ModalState = { baselineStatus: post.status, mode: "edit", postId: post.id };
    setModal(nextModal);
    setForm(toFormState(post));
    setBody(post.body);
  }

  function closeModal() {
    setModal(null);
    setForm(EMPTY_FORM);
    setBody("");
    setIsSaving(false);
    setIsDeleting(false);
  }

  async function savePost(publishStatus?: string) {
    if (!modal) {
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...form,
        body,
        status: publishStatus ?? form.status,
      };

      if (modal.mode === "create") {
        const response = await requestJson<{ post: BlogPost }>("/api/admin/blog", {
          body: JSON.stringify(payload),
          method: "POST",
        });
        setData((current) => upsertPost(current, response.post));
      } else {
        const postId = modal.postId;
        if (!postId) {
          return;
        }
        const response = await requestJson<{ post: BlogPost }>(`/api/admin/blog/${postId}`, {
          body: JSON.stringify(payload),
          method: "PATCH",
        });
        setData((current) => upsertPost(current, response.post));
      }

      setNotice({
        message: (publishStatus ?? form.status) === "published" ? "Blog post published successfully." : "Blog post saved as draft.",
        tone: "success",
      });
      closeModal();
    } catch (saveError) {
      setNotice({
        message: saveError instanceof Error ? saveError.message : "Unable to save the blog post.",
        tone: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function deletePost() {
    if (!modal?.postId || modal.mode !== "edit") {
      return;
    }

    if (!window.confirm("Delete this blog post? This cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await requestJson(`/api/admin/blog/${modal.postId}`, {
        method: "DELETE",
      });
      setData((current) => removePost(current, modal.postId as string));
      setNotice({ message: "Blog post deleted.", tone: "success" });
      closeModal();
    } catch (deleteError) {
      setNotice({
        message: deleteError instanceof Error ? deleteError.message : "Unable to delete the blog post.",
        tone: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <p className="eyebrow">Blog management</p>
        <h1 className="section-title">Manage blog posts</h1>
        <p className="body-copy mt-4 max-w-3xl">
          Write inside the popup editor with structured blocks, top-menu formatting, auto-generated table of contents, image sections, and hyperlink support. Save drafts or publish posts directly.
        </p>
      </section>

      {notice ? (
        <div className={`rounded-2xl px-5 py-4 text-sm ${notice.tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {notice.message}
        </div>
      ) : null}

      {error ? <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Total posts</p>
          <p className="mt-4 text-3xl font-bold text-slate-950">{data.stats.total}</p>
        </article>
        <article className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Published</p>
          <p className="mt-4 text-3xl font-bold text-slate-950">{data.stats.published}</p>
        </article>
        <article className="rounded-3xl bg-[#8a0917] p-6 text-white shadow-[0_16px_45px_rgba(138,9,23,0.2)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Drafts</p>
          <p className="mt-4 text-3xl font-bold">{data.stats.draft}</p>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-black/5 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 bg-slate-50 px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Content desk</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">Posts and drafts</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => void refresh()} className="button-secondary">
              {isLoading ? "Loading..." : "Refresh"}
            </button>
            <button type="button" onClick={openCreateModal} className="button-primary">
              New article
            </button>
          </div>
        </div>

        <div className="divide-y divide-black/5">
          {data.posts.length ? (
            data.posts.map((post) => (
              <article key={post.id} className="grid gap-4 px-6 py-5 lg:grid-cols-[1.3fr_0.8fr_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="truncate text-lg font-semibold text-slate-950">{post.title}</h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">{post.status}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                </div>
                <div className="grid gap-1 text-sm text-slate-500">
                  <span>{post.slug}</span>
                  <span>{post.category ?? "General"}</span>
                  <span>{formatTimestamp(post.published_at)}</span>
                </div>
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  {post.status === "published" ? (
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="button-secondary">
                      View live
                    </a>
                  ) : null}
                  <button type="button" onClick={() => openEditModal(post)} className="button-primary">
                    Edit
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="px-6 py-10 text-sm text-slate-500">No posts yet. Create your first article to start building the blog library.</div>
          )}
        </div>
      </section>

      <BlogEditorModal
        body={body}
        form={form}
        isDeleting={isDeleting}
        isSaving={isSaving}
        mode={modal?.mode ?? "create"}
        onBodyChange={setBody}
        onClose={closeModal}
        onDelete={modal?.mode === "edit" ? deletePost : undefined}
        onFormChange={(patch) => {
          setForm((current) => ({ ...current, ...patch }));
        }}
        onSave={(status?: string) => {
          void savePost(status);
        }}
        open={Boolean(modal)}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

import { BlogRichContent } from "@/components/blog/blog-rich-content";
import { requestJson, useLiveApi } from "@/components/portal/use-live-api";
import { normalizeBlogRenderBlocks, serializeRichTextToSections } from "@/lib/blog-rich-text";
import { absoluteUrl } from "@/lib/site-seo";

type BlogPost = {
  body: string;
  canonical_url: string | null;
  category: string | null;
  cover_url: string | null;
  excerpt: string;
  id: string;
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
  body: string;
  canonicalUrl: string;
  category: string;
  coverUrl: string;
  excerpt: string;
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

const EMPTY_PAYLOAD: AdminBlogPayload = {
  posts: [],
  stats: {
    draft: 0,
    published: 0,
    total: 0,
  },
};

const EMPTY_FORM: BlogFormState = {
  body: "",
  canonicalUrl: "",
  category: "",
  coverUrl: "",
  excerpt: "",
  noIndex: false,
  ogImageUrl: "",
  seoDescription: "",
  seoTitle: "",
  slug: "",
  status: "draft",
  title: "",
};

const textareaClassName =
  "min-h-[220px] rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-800 outline-none transition focus:border-[#8a0917]/35 focus:bg-white";

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
    body: post.body,
    canonicalUrl: post.canonical_url ?? "",
    category: post.category ?? "",
    coverUrl: post.cover_url ?? "",
    excerpt: post.excerpt,
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
    resolvedSlug,
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

function insertAtSelection(
  textarea: HTMLTextAreaElement | null,
  insertion: string,
  value: string,
  onChange: (nextValue: string) => void,
) {
  if (!textarea) {
    onChange(`${value}${value ? "\n\n" : ""}${insertion}`);
    return;
  }

  const selectionStart = textarea.selectionStart;
  const selectionEnd = textarea.selectionEnd;
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);
  const needsLeadingBreak = before.length > 0 && !before.endsWith("\n\n");
  const needsTrailingBreak = after.length > 0 && !after.startsWith("\n\n");
  const nextValue = `${before}${needsLeadingBreak ? "\n\n" : ""}${insertion}${needsTrailingBreak ? "\n\n" : ""}${after}`;

  onChange(nextValue);

  requestAnimationFrame(() => {
    const caretPosition = before.length + (needsLeadingBreak ? 2 : 0) + insertion.length;
    textarea.focus();
    textarea.setSelectionRange(caretPosition, caretPosition);
  });
}

function RichTextToolbar({
  onInsert,
}: {
  onInsert: (snippet: string) => void;
}) {
  const actions = [
    { label: "Heading", value: "## Section heading" },
    { label: "Quote", value: "> Pull quote or key insight" },
    { label: "Bullets", value: "- First point\n- Second point\n- Third point" },
    { label: "Paragraph", value: "Write a clear paragraph that explains the idea in plain language." },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={() => {
            onInsert(action.value);
          }}
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600 transition hover:border-[#8a0917]/30 hover:text-[#8a0917]"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

function RichTextField({
  helper,
  label,
  onChange,
  textareaRef,
  value,
}: {
  helper: string;
  label: string;
  onChange: (nextValue: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
}) {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</label>
        <RichTextToolbar
          onInsert={(snippet) => {
            insertAtSelection(textareaRef.current, snippet, value, onChange);
          }}
        />
      </div>
      <textarea
        ref={textareaRef}
        rows={12}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className={textareaClassName}
      />
      <p className="text-sm text-slate-500">{helper}</p>
    </div>
  );
}

function SeoPreviewCard({ form }: { form: BlogFormState }) {
  const seoPreview = buildSeoPreview(form);
  const titleLength = seoPreview.previewTitle.length;
  const descriptionLength = seoPreview.previewDescription.length;

  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">SEO blueprint</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">Search preview</h3>
        </div>
        <div className="grid gap-1 text-right text-xs">
          <span className={countTone(titleLength, 30, 60)}>Title: {titleLength} chars</span>
          <span className={countTone(descriptionLength, 120, 160)}>
            Description: {descriptionLength} chars
          </span>
        </div>
      </div>
      <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-lg font-medium leading-7 text-[#1a0dab]">{seoPreview.previewTitle}</p>
        <p className="mt-1 break-all text-sm text-emerald-700">{absoluteUrl(seoPreview.canonicalPath)}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{seoPreview.previewDescription}</p>
      </div>
      <div className="mt-5 grid gap-2 rounded-[1.25rem] bg-[#f8f4ef] p-4 text-sm text-slate-600">
        <p>Use clean slugs, a focused title, and a description that explains the value of the article in one clear snippet.</p>
        <p>If you enable `noindex`, the post stays available on-site but is marked to stay out of search indexes.</p>
      </div>
    </div>
  );
}

export default function AdminBlogPage() {
  const { data, error, isLoading, refresh } = useLiveApi<AdminBlogPayload>("/api/admin/blog", EMPTY_PAYLOAD);
  const [notice, setNotice] = useState<Notice>(null);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [createForm, setCreateForm] = useState<BlogFormState>(EMPTY_FORM);
  const [editorForm, setEditorForm] = useState<BlogFormState>(EMPTY_FORM);
  const createTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (data.posts.length && !data.posts.some((post) => post.id === selectedPostId)) {
      setSelectedPostId(data.posts[0]?.id ?? "");
    }
  }, [data.posts, selectedPostId]);

  const selectedPost = data.posts.find((post) => post.id === selectedPostId) ?? null;

  useEffect(() => {
    if (!selectedPost) {
      return;
    }

    setEditorForm(toFormState(selectedPost));
  }, [selectedPost]);

  async function createPost() {
    try {
      await requestJson("/api/admin/blog", {
        body: JSON.stringify(createForm),
        method: "POST",
      });
      setNotice({ message: "Blog post created.", tone: "success" });
      setCreateForm(EMPTY_FORM);
      await refresh();
    } catch (createError) {
      setNotice({
        message: createError instanceof Error ? createError.message : "Unable to create post.",
        tone: "error",
      });
    }
  }

  async function savePost() {
    if (!selectedPost) {
      return;
    }

    try {
      await requestJson(`/api/admin/blog/${selectedPost.id}`, {
        body: JSON.stringify(editorForm),
        method: "PATCH",
      });
      setNotice({ message: "Blog post updated.", tone: "success" });
      await refresh();
    } catch (saveError) {
      setNotice({
        message: saveError instanceof Error ? saveError.message : "Unable to update post.",
        tone: "error",
      });
    }
  }

  async function deletePost() {
    if (!selectedPost) {
      return;
    }

    try {
      await requestJson(`/api/admin/blog/${selectedPost.id}`, {
        method: "DELETE",
      });
      setNotice({ message: "Blog post deleted.", tone: "success" });
      setSelectedPostId("");
      await refresh();
    } catch (deleteError) {
      setNotice({
        message: deleteError instanceof Error ? deleteError.message : "Unable to delete post.",
        tone: "error",
      });
    }
  }

  const editorPreviewBlocks = normalizeBlogRenderBlocks(serializeRichTextToSections(editorForm.body));
  const createPreviewBlocks = normalizeBlogRenderBlocks(serializeRichTextToSections(createForm.body));

  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <p className="eyebrow">Blog management</p>
        <h1 className="section-title">Manage blog posts</h1>
        <p className="body-copy mt-4 max-w-3xl">
          The editor now supports structured content blocks, clean slugs, canonical control, social images,
          and search snippet editing so every post ships with an SEO-ready blueprint.
        </p>
      </section>

      {notice ? (
        <div
          className={`rounded-2xl px-5 py-4 text-sm ${
            notice.tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Total posts</p>
          <p className="mt-4 text-3xl font-bold text-slate-950">{data.stats.total}</p>
        </article>
        <article className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Published</p>
          <p className="mt-4 text-3xl font-bold text-slate-950">{data.stats.published}</p>
        </article>
        <article className="rounded-[1.5rem] bg-[#8a0917] p-6 text-white shadow-[0_16px_45px_rgba(138,9,23,0.2)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Drafts</p>
          <p className="mt-4 text-3xl font-bold">{data.stats.draft}</p>
        </article>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="space-y-6">
          <article className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-4 border-b border-black/5 bg-slate-50 px-6 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Post list</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  void refresh();
                }}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600 transition hover:border-[#8a0917]/30 hover:text-[#8a0917]"
              >
                {isLoading ? "Loading..." : "Refresh"}
              </button>
            </div>
            <div className="divide-y divide-black/5">
              {data.posts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => {
                    setSelectedPostId(post.id);
                  }}
                  className={`grid w-full gap-3 px-6 py-5 text-left ${
                    post.id === selectedPostId ? "bg-[#fff8f7]" : "bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-950">{post.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{post.excerpt}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                      {post.status}
                    </span>
                  </div>
                  <div className="grid gap-1 text-xs text-slate-500">
                    <span>{post.slug}</span>
                    <span>{post.category ?? "General"} • {formatTimestamp(post.published_at)}</span>
                  </div>
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-black/5 bg-[#ece7df] p-8 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Create post</h2>
            <div className="mt-6 grid gap-4">
              <input
                value={createForm.title}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, title: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Title"
              />
              <input
                value={createForm.slug}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, slug: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="clean-seo-slug"
              />
              <input
                value={createForm.category}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, category: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Category"
              />
              <input
                value={createForm.coverUrl}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, coverUrl: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="/media/example.jpg"
              />
              <textarea
                rows={3}
                value={createForm.excerpt}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, excerpt: event.target.value }));
                }}
                className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Excerpt"
              />
              <RichTextField
                helper="Use blank lines to separate blocks. Toolbar buttons insert heading, quote, bullet-list, and paragraph structures."
                label="Rich content body"
                onChange={(nextValue) => {
                  setCreateForm((current) => ({ ...current, body: nextValue }));
                }}
                textareaRef={createTextareaRef}
                value={createForm.body}
              />
              <details className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">SEO settings</summary>
                <div className="mt-4 grid gap-4">
                  <input
                    value={createForm.seoTitle}
                    onChange={(event) => {
                      setCreateForm((current) => ({ ...current, seoTitle: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                    placeholder="SEO title"
                  />
                  <textarea
                    rows={3}
                    value={createForm.seoDescription}
                    onChange={(event) => {
                      setCreateForm((current) => ({ ...current, seoDescription: event.target.value }));
                    }}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                    placeholder="Meta description"
                  />
                  <input
                    value={createForm.canonicalUrl}
                    onChange={(event) => {
                      setCreateForm((current) => ({ ...current, canonicalUrl: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                    placeholder="/blog/example-post"
                  />
                  <input
                    value={createForm.ogImageUrl}
                    onChange={(event) => {
                      setCreateForm((current) => ({ ...current, ogImageUrl: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                    placeholder="/media/social-share.jpg"
                  />
                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={createForm.noIndex}
                      onChange={(event) => {
                        setCreateForm((current) => ({ ...current, noIndex: event.target.checked }));
                      }}
                    />
                    Keep this post out of search indexes
                  </label>
                </div>
              </details>
              <select
                value={createForm.status}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, status: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  void createPost();
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#690711]"
              >
                Create post
              </button>
            </div>
            {createPreviewBlocks.length ? (
              <div className="mt-8 rounded-[1.5rem] border border-dashed border-[#8a0917]/20 bg-white/65 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Draft preview</p>
                <div className="mt-4">
                  <BlogRichContent blocks={createPreviewBlocks} />
                </div>
              </div>
            ) : null}
          </article>
        </section>

        <section className="grid gap-6">
          <article className="rounded-[1.5rem] border border-black/5 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Post editor</h2>
            {selectedPost ? (
              <div className="mt-6 grid gap-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={editorForm.title}
                    onChange={(event) => {
                      setEditorForm((current) => ({ ...current, title: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                    placeholder="Title"
                  />
                  <input
                    value={editorForm.slug}
                    onChange={(event) => {
                      setEditorForm((current) => ({ ...current, slug: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                    placeholder="clean-seo-slug"
                  />
                  <input
                    value={editorForm.category}
                    onChange={(event) => {
                      setEditorForm((current) => ({ ...current, category: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                    placeholder="Category"
                  />
                  <select
                    value={editorForm.status}
                    onChange={(event) => {
                      setEditorForm((current) => ({ ...current, status: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                  <input
                    value={editorForm.coverUrl}
                    onChange={(event) => {
                      setEditorForm((current) => ({ ...current, coverUrl: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none md:col-span-2"
                    placeholder="/media/example.jpg"
                  />
                  <textarea
                    rows={3}
                    value={editorForm.excerpt}
                    onChange={(event) => {
                      setEditorForm((current) => ({ ...current, excerpt: event.target.value }));
                    }}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none md:col-span-2"
                    placeholder="Excerpt"
                  />
                </div>

                <RichTextField
                  helper="Use headings, quotes, and bullet lists to shape the article into structured, scannable content."
                  label="Rich content body"
                  onChange={(nextValue) => {
                    setEditorForm((current) => ({ ...current, body: nextValue }));
                  }}
                  textareaRef={editorTextareaRef}
                  value={editorForm.body}
                />

                <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="grid gap-4 rounded-[1.5rem] border border-black/5 bg-[#f8f4ef] p-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">SEO fields</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950">Metadata and sharing</h3>
                    </div>
                    <input
                      value={editorForm.seoTitle}
                      onChange={(event) => {
                        setEditorForm((current) => ({ ...current, seoTitle: event.target.value }));
                      }}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                      placeholder="SEO title"
                    />
                    <textarea
                      rows={3}
                      value={editorForm.seoDescription}
                      onChange={(event) => {
                        setEditorForm((current) => ({ ...current, seoDescription: event.target.value }));
                      }}
                      className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                      placeholder="Meta description"
                    />
                    <input
                      value={editorForm.canonicalUrl}
                      onChange={(event) => {
                        setEditorForm((current) => ({ ...current, canonicalUrl: event.target.value }));
                      }}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                      placeholder="/blog/example-post"
                    />
                    <input
                      value={editorForm.ogImageUrl}
                      onChange={(event) => {
                        setEditorForm((current) => ({ ...current, ogImageUrl: event.target.value }));
                      }}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                      placeholder="/media/social-share.jpg"
                    />
                    <label className="flex items-center gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={editorForm.noIndex}
                        onChange={(event) => {
                          setEditorForm((current) => ({ ...current, noIndex: event.target.checked }));
                        }}
                      />
                      Keep this post out of search indexes
                    </label>
                  </div>

                  <SeoPreviewCard form={editorForm} />
                </div>

                <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Live article preview</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950">
                        {editorForm.title || "Untitled post"}
                      </h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                      {editorForm.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{editorForm.excerpt || "Add an excerpt to frame the article."}</p>
                  <div className="mt-6">
                    {editorPreviewBlocks.length ? (
                      <BlogRichContent blocks={editorPreviewBlocks} />
                    ) : (
                      <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-500">
                        Start writing to preview headings, pull quotes, bullet lists, and paragraphs.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      void savePost();
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-black"
                  >
                    Save post
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void deletePost();
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-red-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-50"
                  >
                    Delete post
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-sm text-slate-500">
                Select a post from the list to edit content, search metadata, and preview structure.
              </div>
            )}
          </article>
        </section>
      </div>
    </div>
  );
}

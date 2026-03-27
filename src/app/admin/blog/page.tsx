"use client";

import { useEffect, useState } from "react";

import { requestJson, useLiveApi } from "@/components/portal/use-live-api";

type BlogPost = {
  body: string;
  category: string | null;
  cover_url: string | null;
  excerpt: string;
  id: string;
  published_at: string | null;
  slug: string;
  status: string;
  title: string;
  updated_at: string;
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

function formatTimestamp(value: string | null) {
  if (!value) {
    return "Not published";
  }

  return new Date(value).toLocaleDateString("en-GB", {
    dateStyle: "medium",
  });
}

export default function AdminBlogPage() {
  const { data, error, isLoading, refresh } = useLiveApi<AdminBlogPayload>("/api/admin/blog", EMPTY_PAYLOAD);
  const [notice, setNotice] = useState<Notice>(null);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [createForm, setCreateForm] = useState({
    body: "",
    category: "",
    coverUrl: "",
    excerpt: "",
    status: "draft",
    title: "",
  });
  const [editorForm, setEditorForm] = useState({
    body: "",
    category: "",
    coverUrl: "",
    excerpt: "",
    status: "draft",
    title: "",
  });

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

    setEditorForm({
      body: selectedPost.body,
      category: selectedPost.category ?? "",
      coverUrl: selectedPost.cover_url ?? "",
      excerpt: selectedPost.excerpt,
      status: selectedPost.status,
      title: selectedPost.title,
    });
  }, [selectedPost?.body, selectedPost?.category, selectedPost?.cover_url, selectedPost?.excerpt, selectedPost?.id, selectedPost?.status, selectedPost?.title]);

  async function createPost() {
    try {
      await requestJson("/api/admin/blog", {
        body: JSON.stringify(createForm),
        method: "POST",
      });
      setNotice({ message: "Blog post created.", tone: "success" });
      setCreateForm({
        body: "",
        category: "",
        coverUrl: "",
        excerpt: "",
        status: "draft",
        title: "",
      });
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

  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <p className="eyebrow">Blog management</p>
        <h1 className="section-title">Manage blog posts</h1>
        <p className="body-copy mt-4 max-w-3xl">
          Blog posts are now stored in `blog_posts` and `blog_post_sections`, with a live editor for
          draft and publish workflows.
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

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
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
                  className={`grid w-full grid-cols-[1.3fr_0.8fr_0.8fr] gap-4 px-6 py-5 text-left ${
                    post.id === selectedPostId ? "bg-[#fff8f7]" : "bg-white"
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-950">{post.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{post.excerpt}</p>
                  </div>
                  <div className="text-sm text-slate-700">{post.category ?? "General"}</div>
                  <div className="text-sm text-slate-700">{formatTimestamp(post.published_at)}</div>
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
              <textarea
                rows={6}
                value={createForm.body}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, body: event.target.value }));
                }}
                className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Use blank lines between paragraphs."
              />
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
          </article>
        </section>

        <section className="rounded-[1.5rem] border border-black/5 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Post editor</h2>
          {selectedPost ? (
            <div className="mt-6 grid gap-4">
              <input
                value={editorForm.title}
                onChange={(event) => {
                  setEditorForm((current) => ({ ...current, title: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
              <input
                value={editorForm.category}
                onChange={(event) => {
                  setEditorForm((current) => ({ ...current, category: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
              <input
                value={editorForm.coverUrl}
                onChange={(event) => {
                  setEditorForm((current) => ({ ...current, coverUrl: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
              <textarea
                rows={3}
                value={editorForm.excerpt}
                onChange={(event) => {
                  setEditorForm((current) => ({ ...current, excerpt: event.target.value }));
                }}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
              <textarea
                rows={12}
                value={editorForm.body}
                onChange={(event) => {
                  setEditorForm((current) => ({ ...current, body: event.target.value }));
                }}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
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
              Select a post from the list to edit it.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

import { blogPosts } from "@/lib/site-data";

export default function AdminBlogPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Blog management</p>
        <h2 className="section-title">Manage blog posts</h2>
        <p className="body-copy mt-4 max-w-3xl">
          Review current posts, titles, categories, and excerpts. This is the first imported admin
          surface aligned to the Focus Health pattern.
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white">
        <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr] gap-4 border-b border-black/5 bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          <div>Post</div>
          <div>Category</div>
          <div>Date</div>
        </div>
        <div className="divide-y divide-black/5">
          {blogPosts.map((post) => (
            <div key={post.slug} className="grid grid-cols-[1.3fr_0.8fr_0.8fr] gap-4 px-6 py-5">
              <div>
                <p className="font-bold text-slate-950">{post.title}</p>
                <p className="mt-1 text-sm text-slate-600">{post.excerpt}</p>
              </div>
              <div className="text-sm text-slate-700">{post.category}</div>
              <div className="text-sm text-slate-700">{post.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

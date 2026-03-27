import Link from "next/link";

import { blogPosts } from "@/lib/site-data";
import { adminLeadRows } from "@/lib/admin-data";

export default function AdminDashboardPage() {
  const cards = [
    { label: "Published blogs", value: String(blogPosts.length) },
    { label: "Tracked leads", value: String(adminLeadRows.length) },
    { label: "Client hub", value: "Editable" },
    { label: "Hiring stack", value: "Supabase" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Dashboard</p>
        <h2 className="section-title">Admin overview</h2>
        <p className="body-copy mt-4 max-w-3xl">
          This admin area now covers blog management, lead tracking, careers job posts, application
          review, the client dashboard, and authenticated access.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[1.25rem] border border-black/5 bg-slate-50 p-6">
            <div className="text-4xl font-extrabold text-[#8a0917]">{card.value}</div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[#8a0917]">Recent blog content</h3>
              <p className="mt-2 text-slate-700">Manage article titles, categories, and publishing workflow.</p>
            </div>
            <Link href="/admin/blog" className="button-secondary">
              Open blog
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            {blogPosts.slice(0, 3).map((post) => (
              <div key={post.slug} className="rounded-2xl border border-black/5 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a0917]">{post.category}</p>
                <h4 className="mt-2 text-lg font-bold text-slate-950">{post.title}</h4>
                <p className="mt-1 text-sm text-slate-600">{post.date}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[#8a0917]">Lead submissions</h3>
              <p className="mt-2 text-slate-700">Review inbound leads from discovery calls and assessments.</p>
            </div>
            <Link href="/admin/leads" className="button-secondary">
              Open leads
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            {adminLeadRows.slice(0, 3).map((lead) => (
              <div key={lead.id} className="rounded-2xl border border-black/5 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-950">{lead.name}</h4>
                    <p className="text-sm text-slate-600">{lead.company}</p>
                  </div>
                  <span className="rounded-full bg-[#FDD835] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-950">
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[#8a0917]">Client hub manager</h3>
              <p className="mt-2 text-slate-700">
                Update every dashboard section shown to clients, including welcome copy, KPIs,
                roadmap stages, resources, mentoring sessions, and footer links.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/client-hub" className="button-secondary">
                View hub
              </Link>
              <Link href="/admin/client-hub" className="button-secondary">
                Manage hub
              </Link>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a0917]">Client experience</p>
              <p className="mt-2 text-sm text-slate-600">
                Serve a polished portal view without the public site header and footer.
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a0917]">Editable content</p>
              <p className="mt-2 text-sm text-slate-600">
                Save dashboard content to Supabase so admins can control the live client hub from one place.
              </p>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[#8a0917]">Hiring workflow</h3>
              <p className="mt-2 text-slate-700">
                Create job positions, publish roles, and review incoming candidate applications with
                CV attachments.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/jobs" className="button-secondary">
                Open jobs
              </Link>
              <Link href="/admin/applications" className="button-secondary">
                Open applications
              </Link>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a0917]">Job manager</p>
              <p className="mt-2 text-sm text-slate-600">Create draft roles, open live vacancies, and close posts when hiring is complete.</p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a0917]">Application manager</p>
              <p className="mt-2 text-sm text-slate-600">Track candidate status, add review notes, and download resume attachments from one place.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

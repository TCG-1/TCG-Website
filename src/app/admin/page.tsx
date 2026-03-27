import Link from "next/link";

import { adminLeadRows } from "@/lib/admin-data";
import { blogPosts } from "@/lib/site-data";

function statusClasses(status: string) {
  switch (status) {
    case "Qualified":
      return "bg-emerald-100 text-emerald-700";
    case "Follow-up":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-[#FDD835]/35 text-slate-900";
  }
}

export default function AdminDashboardPage() {
  const qualifiedLeadCount = adminLeadRows.filter((lead) => lead.status === "Qualified").length;
  const followUpCount = adminLeadRows.filter((lead) => lead.status === "Follow-up").length;

  const stats = [
    {
      label: "Tracked organisations",
      value: String(adminLeadRows.length),
      detail: `${qualifiedLeadCount} qualified for next steps`,
    },
    {
      label: "Published blogs",
      value: String(blogPosts.length),
      detail: "Knowledge library live",
    },
    {
      label: "Pending follow-ups",
      value: String(followUpCount + 1),
      detail: "Lead and hiring review queue",
    },
    {
      label: "Client hub status",
      value: "Live",
      detail: "Supabase-backed and editable",
      accent: true,
    },
  ];

  const workspaceLinks = [
    { label: "Dashboard", href: "/admin", active: true },
    { label: "Blog", href: "/admin/blog" },
    { label: "Leads", href: "/admin/leads" },
    { label: "Client Hub", href: "/admin/client-hub" },
    { label: "Jobs", href: "/admin/jobs" },
    { label: "Applications", href: "/admin/applications" },
  ];

  const oversightRows = [
    {
      task: "Lead qualification review",
      context: adminLeadRows[0]?.company ?? "Lead queue",
      schedule: "Discovery call pipeline",
      owner: "Leads",
      href: "/admin/leads",
      status: "Queued",
    },
    {
      task: "Client hub content refresh",
      context: "Client portal",
      schedule: "Welcome copy and KPI review",
      owner: "Client Hub",
      href: "/admin/client-hub",
      status: "Live",
    },
    {
      task: "Role and application review",
      context: "Hiring workflow",
      schedule: "Jobs and CV triage",
      owner: "Applications",
      href: "/admin/applications",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-12">
      <section className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a0917]">Administrative Portal</p>
        <h1 className="mt-4 font-[var(--font-inter)] text-[clamp(2.8rem,6vw,4.5rem)] font-light leading-[1.02] tracking-[-0.05em] text-slate-950">
          Admin Portal:
          <br />
          <span className="font-semibold text-[#8a0917]">Client Management</span>
        </h1>
        <div className="mt-6 h-1 w-24 bg-[#8a0917]" />
        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-600">
          Bespoke oversight of active partnerships, live content, lead flow, careers operations, and
          the client dashboard experience. Every existing admin tab remains available inside this new
          portal layout.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className={`rounded-[1.75rem] border p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 ${
              stat.accent
                ? "border-[#8a0917] bg-[#8a0917] text-white"
                : "border-black/5 bg-white text-slate-950"
            }`}
          >
            <p
              className={`text-[11px] font-bold uppercase tracking-[0.24em] ${
                stat.accent ? "text-white/70" : "text-slate-500"
              }`}
            >
              {stat.label}
            </p>
            <div className="mt-5 flex items-end gap-3">
              <span className="text-4xl font-bold tracking-tight">{stat.value}</span>
              <span className={`pb-1 text-xs font-bold uppercase tracking-[0.16em] ${stat.accent ? "text-white/80" : "text-[#8a0917]"}`}>
                {stat.detail}
              </span>
            </div>
          </article>
        ))}
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.15fr]">
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#FDD835]" />
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Pipeline Overview</h2>
          </div>

          <div className="space-y-4">
            {adminLeadRows.map((lead) => (
              <article
                key={lead.id}
                className={`group rounded-[1.5rem] border bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)] ${
                  lead.status === "Qualified" ? "border-[#8a0917]/20" : "border-black/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950">{lead.company}</h3>
                    <p className="mt-1 text-sm text-slate-500">{lead.name}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${statusClasses(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Source</p>
                    <p className="mt-2 text-sm font-semibold text-[#8a0917]">{lead.source}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Lead ID</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{lead.id}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">{lead.email}</p>
                  <Link
                    href="/admin/leads"
                    className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#8a0917] transition group-hover:gap-3"
                  >
                    Open leads
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-black/5 bg-[#ece7df] p-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-10">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Editor: Admin Control Center</h2>
            <p className="mt-2 text-sm text-slate-500">
              Live workspace summary for content, pipeline oversight, client portal editing, and hiring
              operations.
            </p>
          </div>

          <div className="mt-10 space-y-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8a0917]">Metrics Snapshot</p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Tracked organisations</span>
                  <input
                    readOnly
                    value={String(adminLeadRows.length)}
                    className="border-0 border-b border-slate-300 bg-transparent px-0 py-2 text-3xl font-semibold text-slate-950 outline-none"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Published blogs</span>
                  <input
                    readOnly
                    value={String(blogPosts.length)}
                    className="border-0 border-b border-slate-300 bg-transparent px-0 py-2 text-3xl font-semibold text-slate-950 outline-none"
                  />
                </label>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8a0917]">Workspace Routing</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {workspaceLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full border px-5 py-2 text-sm font-bold transition ${
                      item.active
                        ? "border-[#8a0917] bg-[#8a0917] text-white"
                        : "border-slate-300 text-slate-600 hover:border-[#8a0917]/35 hover:text-[#8a0917]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/admin/client-hub"
                className="rounded-[1.25rem] border border-black/5 bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">Client hub</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Manage live portal content</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Edit welcome copy, KPI cards, roadmap stages, resources, and client-facing dashboard
                  content from one place.
                </p>
              </Link>

              <Link
                href="/admin/applications"
                className="rounded-[1.25rem] border border-black/5 bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">Hiring workflow</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Review candidates and attachments</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Move applications through the pipeline, open resumes, and keep roles aligned with live
                  hiring priorities.
                </p>
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/client-hub"
                className="inline-flex w-full items-center justify-center gap-3 rounded-[1.25rem] bg-slate-950 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-black"
              >
                Open priority workspace
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#FDD835]" />
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Workflow Oversight</h2>
          </div>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#8a0917]"
          >
            Open main queue
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
          <div className="hidden grid-cols-[1.2fr_0.9fr_1fr_0.8fr_0.7fr_0.4fr] gap-4 border-b border-black/5 bg-slate-50 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 lg:grid">
            <div>Task</div>
            <div>Context</div>
            <div>Schedule / Queue</div>
            <div>Owner</div>
            <div>Status</div>
            <div />
          </div>

          <div className="divide-y divide-black/5">
            {oversightRows.map((row) => (
              <div key={row.task} className="px-6 py-5">
                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr_1fr_0.8fr_0.7fr_0.4fr] lg:items-center">
                  <div>
                    <p className="font-semibold text-slate-950">{row.task}</p>
                    <p className="mt-1 text-sm text-slate-500 lg:hidden">{row.context}</p>
                  </div>
                  <div className="hidden text-sm text-slate-700 lg:block">{row.context}</div>
                  <div className="text-sm text-slate-700">{row.schedule}</div>
                  <div className="text-sm text-slate-700">{row.owner}</div>
                  <div>
                    <span className="rounded-full bg-[#FDD835]/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-900">
                      {row.status}
                    </span>
                  </div>
                  <div className="text-left lg:text-right">
                    <Link href={row.href} className="text-sm font-semibold text-[#8a0917] transition hover:text-[#690711]">
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-3 border-t border-black/5 pt-6 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div>
          System Status: <span className="text-emerald-600">Admin services operational</span>
        </div>
        <div>© 2026 Tacklers Consulting Group. Internal use only.</div>
      </footer>
    </div>
  );
}

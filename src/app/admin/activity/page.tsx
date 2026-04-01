"use client";

import { useLiveApi } from "@/components/portal/use-live-api";

type ActivityItem = {
  created_at: string;
  description: string | null;
  event_type: string;
  id: string;
  title: string;
};

type AuditItem = {
  action_type: string;
  created_at: string;
  id: string;
  summary: string;
};

type AdminActivityPayload = {
  activityFeed: ActivityItem[];
  auditLog: AuditItem[];
  stats: {
    activityCount: number;
    auditCount: number;
  };
};

const EMPTY_PAYLOAD: AdminActivityPayload = {
  activityFeed: [],
  auditLog: [],
  stats: {
    activityCount: 0,
    auditCount: 0,
  },
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminActivityPage() {
  const { data, error, isLoading, refresh } = useLiveApi<AdminActivityPayload>(
    "/api/admin/activity",
    EMPTY_PAYLOAD,
  );

  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a0917]">Operational pulse</p>
        <h1 className="mt-4 text-[clamp(2.2rem,4vw,3rem)] font-light leading-[1.05] tracking-[-0.05em] text-slate-950">
          Activity timeline
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Durable portal activity and audit history, now driven from the live activity and admin audit
          tables.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2">
        <article className="rounded-[1.75rem] border border-black/5 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Activity feed events</p>
          <p className="mt-5 text-4xl font-bold tracking-tight text-slate-950">{data.stats.activityCount}</p>
        </article>
        <article className="rounded-[1.75rem] bg-[#8a0917] p-7 text-white shadow-[0_20px_60px_rgba(138,9,23,0.24)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">Audit log entries</p>
          <p className="mt-5 text-4xl font-bold tracking-tight">{data.stats.auditCount}</p>
        </article>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Recent events</h2>
              <p className="mt-2 text-sm text-slate-500">Shared activity across admin and client actions.</p>
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
          <div className="mt-8 space-y-5">
            {data.activityFeed.map((event, index) => (
              <article key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-4 w-4 rounded-full bg-[#8a0917]" />
                  {index < data.activityFeed.length - 1 ? <div className="mt-2 h-full w-px bg-slate-200" /> : null}
                </div>
                <div className="flex-1 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950">{event.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{event.description ?? event.event_type}</p>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {formatTimestamp(event.created_at)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[1.75rem] border border-black/5 bg-[#ece7df] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Audit checkpoints</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <p>Blog publishes, lead triage changes, support updates, and document changes are all written into the audit layer.</p>
              <p>Client replies and workspace activity now flow into the shared activity timeline as well.</p>
              <p>Use this page as the operational pulse for portal changes that matter.</p>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Audit log</h2>
            <div className="mt-6 space-y-4">
              {data.auditLog.map((item) => (
                <div key={item.id} className="rounded-[1.25rem] border border-slate-100 p-5">
                  <p className="text-sm font-semibold text-slate-950">{item.summary}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.action_type.replace(/_/g, " ")}</p>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {formatTimestamp(item.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

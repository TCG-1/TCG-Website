"use client";

import { requestJson, useLiveApi } from "@/components/portal/use-live-api";
import { DashboardIcon } from "@/components/client-hub/dashboard-icon";

type DocumentCollection = {
  description: string | null;
  id: string;
  title: string;
  visibility: string;
};

type DocumentRecord = {
  document_type: string;
  file_name: string;
  id: string;
  public_url: string | null;
  title: string;
  updated_at: string;
  version_label: string | null;
  visibility: string;
};

type ClientDocumentsPayload = {
  collections: DocumentCollection[];
  documents: DocumentRecord[];
  stats: {
    collections: number;
    documents: number;
    latestVersionCount: number;
  };
};

const EMPTY_PAYLOAD: ClientDocumentsPayload = {
  collections: [],
  documents: [],
  stats: {
    collections: 0,
    documents: 0,
    latestVersionCount: 0,
  },
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ClientHubDocumentsPage() {
  const { data, error, isLoading, refresh } = useLiveApi<ClientDocumentsPayload>(
    "/api/client/documents",
    EMPTY_PAYLOAD,
  );

  return (
    <div className="space-y-10 px-6 py-8 lg:px-10 lg:py-12">
      <section className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8e6200]">Shared workspace</p>
        <h1 className="mt-3 text-4xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)] sm:text-5xl">
          Documents
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Live shared files published to your workspace by the Tacklers team, grouped into collections and
          ready to open from one place.
        </p>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[1.75rem] bg-white p-7 shadow-[0_18px_50px_rgba(31,29,29,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Collections</p>
          <p className="mt-4 text-4xl font-bold text-[#2b2929]">{data.stats.collections}</p>
          <p className="mt-2 text-sm text-slate-500">Published file hubs for your workspace.</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-7 shadow-[0_18px_50px_rgba(31,29,29,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Documents</p>
          <p className="mt-4 text-4xl font-bold text-[#2b2929]">{data.stats.documents}</p>
          <p className="mt-2 text-sm text-slate-500">Shared assets now driven directly from the database.</p>
        </article>
        <article className="rounded-[1.75rem] bg-[linear-gradient(135deg,#62000b_0%,#8a0917_100%)] p-7 text-white shadow-[0_20px_60px_rgba(98,0,11,0.25)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">Latest versions</p>
          <p className="mt-4 text-3xl font-bold [font-family:var(--font-client-headline)]">{data.stats.latestVersionCount}</p>
          <p className="mt-2 text-sm text-white/80">Current documents ready for sponsor review.</p>
        </article>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {data.collections.map((collection) => (
          <article
            key={collection.id}
            className="rounded-[1.75rem] bg-white p-7 shadow-[0_18px_50px_rgba(31,29,29,0.05)]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">{collection.visibility}</p>
            <h2 className="mt-4 text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              {collection.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {collection.description ?? "A live collection published into your shared workspace."}
            </p>
          </article>
        ))}
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.95fr]">
        <section className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#f0e7e3] pb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
                Published files
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                The latest live files available to your sponsor team.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                void refresh();
              }}
              className="rounded-full border border-[#e5d2cd] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 transition hover:border-[#8a0917]/30 hover:text-[#8a0917]"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="mt-8 space-y-4">
            {data.documents.length ? (
              data.documents.map((document) => (
                <article key={document.id} className="rounded-[1.5rem] border border-[#ede2dd] bg-[#faf7f5] p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#7d0b16] shadow-sm">
                        <DashboardIcon name="document" className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#2b2929]">{document.title}</h3>
                        <p className="mt-2 text-sm text-slate-500">
                          {document.document_type} • {document.file_name}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                      {document.visibility}
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    <span>{formatTimestamp(document.updated_at)}</span>
                    {document.public_url ? (
                      <a
                        href={document.public_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-[#8e6200] transition hover:gap-3"
                      >
                        Open file
                        <DashboardIcon name="arrow" className="h-4 w-4" />
                      </a>
                    ) : (
                      <span>No link yet</span>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-[#ede2dd] bg-[#faf7f5] px-6 py-10 text-sm text-slate-500">
                No workspace documents yet. New files will appear here as soon as they are published.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] bg-[#ece7e3] p-8">
            <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              Access model
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <p>Collections and documents on this page are now driven directly from the admin document manager.</p>
              <p>When the Tacklers team updates a file or publishes a new shared resource, it appears here after the live refresh cycle.</p>
              <p>Use support if a file is missing, access is incorrect, or you need a fresh version created.</p>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
            <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              Need another file?
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Request workshop packs, updated trackers, or sponsor decks from the support tab and we will route it into the shared workspace.
            </p>
            <button
              type="button"
              onClick={() => {
                void requestJson("/api/client/notifications", { method: "GET" });
                window.location.href = "/client-hub/support";
              }}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8e6200] transition hover:gap-3"
            >
              Open support request
              <DashboardIcon name="arrow" className="h-4 w-4" />
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

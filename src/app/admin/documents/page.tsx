"use client";

import { useEffect, useState } from "react";

import { requestJson, useLiveApi } from "@/components/portal/use-live-api";

type ClientReference = {
  id: string;
  name: string;
};

type DocumentCollection = {
  client_id: string | null;
  description: string | null;
  id: string;
  title: string;
  updated_at: string;
  visibility: string;
};

type DocumentRecord = {
  client_id: string | null;
  collection_id: string | null;
  document_type: string;
  file_name: string;
  file_path: string | null;
  id: string;
  is_latest: boolean;
  public_url: string | null;
  title: string;
  updated_at: string;
  version_label: string | null;
  visibility: string;
};

type AdminDocumentsPayload = {
  clients: ClientReference[];
  collections: DocumentCollection[];
  documents: DocumentRecord[];
  stats: {
    collections: number;
    documents: number;
    shared: number;
  };
};

type Notice = { message: string; tone: "error" | "success" } | null;

const EMPTY_PAYLOAD: AdminDocumentsPayload = {
  clients: [],
  collections: [],
  documents: [],
  stats: {
    collections: 0,
    documents: 0,
    shared: 0,
  },
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminDocumentsPage() {
  const { data, error, isLoading, refresh } = useLiveApi<AdminDocumentsPayload>(
    "/api/admin/documents",
    EMPTY_PAYLOAD,
  );
  const [notice, setNotice] = useState<Notice>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [collectionForm, setCollectionForm] = useState({
    clientId: "",
    description: "",
    title: "",
    visibility: "client",
  });
  const [documentForm, setDocumentForm] = useState({
    clientId: "",
    collectionId: "",
    documentType: "report",
    fileName: "",
    publicUrl: "",
    title: "",
    versionLabel: "v1",
    visibility: "shared",
  });
  const [documentEditor, setDocumentEditor] = useState({
    clientId: "",
    collectionId: "",
    documentType: "report",
    fileName: "",
    publicUrl: "",
    title: "",
    versionLabel: "",
    visibility: "shared",
  });

  useEffect(() => {
    if (data.documents.length && !data.documents.some((document) => document.id === selectedDocumentId)) {
      setSelectedDocumentId(data.documents[0]?.id ?? "");
    }
  }, [data.documents, selectedDocumentId]);

  const selectedDocument = data.documents.find((document) => document.id === selectedDocumentId) ?? null;

  useEffect(() => {
    if (!selectedDocument) {
      return;
    }

    setDocumentEditor({
      clientId: selectedDocument.client_id ?? "",
      collectionId: selectedDocument.collection_id ?? "",
      documentType: selectedDocument.document_type,
      fileName: selectedDocument.file_name,
      publicUrl: selectedDocument.public_url ?? "",
      title: selectedDocument.title,
      versionLabel: selectedDocument.version_label ?? "",
      visibility: selectedDocument.visibility,
    });
  }, [selectedDocument?.client_id, selectedDocument?.collection_id, selectedDocument?.document_type, selectedDocument?.file_name, selectedDocument?.id, selectedDocument?.public_url, selectedDocument?.title, selectedDocument?.version_label, selectedDocument?.visibility]);

  async function createCollection() {
    try {
      await requestJson("/api/admin/documents", {
        body: JSON.stringify({
          ...collectionForm,
          kind: "collection",
        }),
        method: "POST",
      });
      setNotice({ message: "Collection created.", tone: "success" });
      setCollectionForm({
        clientId: "",
        description: "",
        title: "",
        visibility: "client",
      });
      await refresh();
    } catch (createError) {
      setNotice({
        message: createError instanceof Error ? createError.message : "Unable to create collection.",
        tone: "error",
      });
    }
  }

  async function createDocument() {
    try {
      await requestJson("/api/admin/documents", {
        body: JSON.stringify({
          ...documentForm,
          kind: "document",
        }),
        method: "POST",
      });
      setNotice({ message: "Document published.", tone: "success" });
      setDocumentForm({
        clientId: "",
        collectionId: "",
        documentType: "report",
        fileName: "",
        publicUrl: "",
        title: "",
        versionLabel: "v1",
        visibility: "shared",
      });
      await refresh();
    } catch (createError) {
      setNotice({
        message: createError instanceof Error ? createError.message : "Unable to publish document.",
        tone: "error",
      });
    }
  }

  async function updateDocument() {
    if (!selectedDocument) {
      return;
    }

    try {
      await requestJson(`/api/admin/documents/${selectedDocument.id}`, {
        body: JSON.stringify(documentEditor),
        method: "PATCH",
      });
      setNotice({ message: "Document updated.", tone: "success" });
      await refresh();
    } catch (updateError) {
      setNotice({
        message: updateError instanceof Error ? updateError.message : "Unable to update document.",
        tone: "error",
      });
    }
  }

  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a0917]">Document operations</p>
        <h1 className="mt-4 text-[clamp(2.6rem,5vw,4rem)] font-light leading-[1.02] tracking-[-0.05em] text-slate-950">
          Documents & collections
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Publish shared documents into the client workspace, manage visibility rules, and keep collections
          organized from the admin portal.
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
        <article className="rounded-[1.75rem] border border-black/5 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Collections</p>
          <p className="mt-5 text-4xl font-bold tracking-tight text-slate-950">{data.stats.collections}</p>
          <p className="mt-2 text-sm text-slate-500">Reusable hubs for decks, training, and reports.</p>
        </article>
        <article className="rounded-[1.75rem] border border-black/5 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Documents</p>
          <p className="mt-5 text-4xl font-bold tracking-tight text-slate-950">{data.stats.documents}</p>
          <p className="mt-2 text-sm text-slate-500">Published records tracked directly in Supabase.</p>
        </article>
        <article className="rounded-[1.75rem] bg-[#8a0917] p-7 text-white shadow-[0_20px_60px_rgba(138,9,23,0.24)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">Shared</p>
          <p className="mt-5 text-4xl font-bold tracking-tight">{data.stats.shared}</p>
          <p className="mt-2 text-sm text-white/80">Files immediately visible to client workspaces.</p>
        </article>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <article className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Managed assets</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Every published document row is now a real database record.
                </p>
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
            <div className="mt-8 space-y-4">
              {data.documents.map((document) => (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => {
                    setSelectedDocumentId(document.id);
                  }}
                  className={`w-full rounded-[1.5rem] border p-6 text-left transition ${
                    document.id === selectedDocumentId
                      ? "border-[#8a0917]/20 bg-[#fff8f7]"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-slate-950">{document.title}</h3>
                      <p className="mt-2 text-sm text-slate-500">
                        {document.document_type} • {document.file_name}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                      {document.visibility}
                    </span>
                  </div>
                  <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Updated {formatTimestamp(document.updated_at)}
                  </p>
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-black/5 bg-[#ece7df] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Create collection</h2>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Title</span>
                <input
                  value={collectionForm.title}
                  onChange={(event) => {
                    setCollectionForm((current) => ({ ...current, title: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Client</span>
                  <select
                    value={collectionForm.clientId}
                    onChange={(event) => {
                      setCollectionForm((current) => ({ ...current, clientId: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  >
                    <option value="">General</option>
                    {data.clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Visibility</span>
                  <select
                    value={collectionForm.visibility}
                    onChange={(event) => {
                      setCollectionForm((current) => ({ ...current, visibility: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  >
                    <option value="client">Client</option>
                    <option value="shared">Shared</option>
                    <option value="admin_only">Admin only</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Description</span>
                <textarea
                  rows={3}
                  value={collectionForm.description}
                  onChange={(event) => {
                    setCollectionForm((current) => ({ ...current, description: event.target.value }));
                  }}
                  className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  void createCollection();
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#690711]"
              >
                Create collection
              </button>
            </div>
          </article>
        </section>

        <section className="space-y-6">
          <article className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Publish document</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-600">Title</span>
                <input
                  value={documentForm.title}
                  onChange={(event) => {
                    setDocumentForm((current) => ({ ...current, title: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Client</span>
                <select
                  value={documentForm.clientId}
                  onChange={(event) => {
                    setDocumentForm((current) => ({ ...current, clientId: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                >
                  <option value="">General</option>
                  {data.clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Collection</span>
                <select
                  value={documentForm.collectionId}
                  onChange={(event) => {
                    setDocumentForm((current) => ({ ...current, collectionId: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                >
                  <option value="">No collection</option>
                  {data.collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Document type</span>
                <select
                  value={documentForm.documentType}
                  onChange={(event) => {
                    setDocumentForm((current) => ({ ...current, documentType: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                >
                  <option value="report">Report</option>
                  <option value="training">Training</option>
                  <option value="assessment">Assessment</option>
                  <option value="proposal">Proposal</option>
                  <option value="policy">Policy</option>
                  <option value="general">General</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Visibility</span>
                <select
                  value={documentForm.visibility}
                  onChange={(event) => {
                    setDocumentForm((current) => ({ ...current, visibility: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                >
                  <option value="shared">Shared</option>
                  <option value="client">Client</option>
                  <option value="admin_only">Admin only</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">File name</span>
                <input
                  value={documentForm.fileName}
                  onChange={(event) => {
                    setDocumentForm((current) => ({ ...current, fileName: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Version</span>
                <input
                  value={documentForm.versionLabel}
                  onChange={(event) => {
                    setDocumentForm((current) => ({ ...current, versionLabel: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-600">Public URL</span>
                <input
                  value={documentForm.publicUrl}
                  onChange={(event) => {
                    setDocumentForm((current) => ({ ...current, publicUrl: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  placeholder="https://..."
                />
              </label>
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    void createDocument();
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-black"
                >
                  Publish document
                </button>
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Edit selected document</h2>
            {selectedDocument ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-600">Title</span>
                  <input
                    value={documentEditor.title}
                    onChange={(event) => {
                      setDocumentEditor((current) => ({ ...current, title: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Client</span>
                  <select
                    value={documentEditor.clientId}
                    onChange={(event) => {
                      setDocumentEditor((current) => ({ ...current, clientId: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  >
                    <option value="">General</option>
                    {data.clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Collection</span>
                  <select
                    value={documentEditor.collectionId}
                    onChange={(event) => {
                      setDocumentEditor((current) => ({ ...current, collectionId: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  >
                    <option value="">No collection</option>
                    {data.collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Visibility</span>
                  <select
                    value={documentEditor.visibility}
                    onChange={(event) => {
                      setDocumentEditor((current) => ({ ...current, visibility: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  >
                    <option value="shared">Shared</option>
                    <option value="client">Client</option>
                    <option value="admin_only">Admin only</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Document type</span>
                  <select
                    value={documentEditor.documentType}
                    onChange={(event) => {
                      setDocumentEditor((current) => ({ ...current, documentType: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  >
                    <option value="report">Report</option>
                    <option value="training">Training</option>
                    <option value="assessment">Assessment</option>
                    <option value="proposal">Proposal</option>
                    <option value="policy">Policy</option>
                    <option value="general">General</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">File name</span>
                  <input
                    value={documentEditor.fileName}
                    onChange={(event) => {
                      setDocumentEditor((current) => ({ ...current, fileName: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Version</span>
                  <input
                    value={documentEditor.versionLabel}
                    onChange={(event) => {
                      setDocumentEditor((current) => ({ ...current, versionLabel: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-600">Public URL</span>
                  <input
                    value={documentEditor.publicUrl}
                    onChange={(event) => {
                      setDocumentEditor((current) => ({ ...current, publicUrl: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </label>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => {
                      void updateDocument();
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#8a0917] transition hover:bg-[#fff4f1]"
                  >
                    Save document
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-sm text-slate-500">
                Select a document to edit metadata, visibility, or shared URL.
              </div>
            )}
          </article>
        </section>
      </div>
    </div>
  );
}

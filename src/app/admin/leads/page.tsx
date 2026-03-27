"use client";

import { useEffect, useState } from "react";

import { requestJson, useLiveApi } from "@/components/portal/use-live-api";

type Lead = {
  client_id: string | null;
  company_name: string | null;
  created_at: string;
  email: string;
  enquiry_type: string | null;
  full_name: string;
  id: string;
  internal_notes: string | null;
  message: string | null;
  source: string;
  status: string;
};

type ClientReference = {
  id: string;
  name: string;
};

type AdminLeadsPayload = {
  clients: ClientReference[];
  leads: Lead[];
  stats: {
    followUp: number;
    qualified: number;
    total: number;
  };
};

type Notice = { message: string; tone: "error" | "success" } | null;

const EMPTY_PAYLOAD: AdminLeadsPayload = {
  clients: [],
  leads: [],
  stats: {
    followUp: 0,
    qualified: 0,
    total: 0,
  },
};

function statusClasses(status: string) {
  switch (status) {
    case "qualified":
      return "bg-emerald-100 text-emerald-700";
    case "contacted":
    case "follow_up":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-[#FDD835]/35 text-slate-900";
  }
}

function statusLabel(status: string) {
  return status === "follow_up" ? "contacted" : status.replace("_", " ");
}

function formatTimestamp(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    dateStyle: "medium",
  });
}

export default function AdminLeadsPage() {
  const { data, error, isLoading, refresh } = useLiveApi<AdminLeadsPayload>("/api/admin/leads", EMPTY_PAYLOAD);
  const [notice, setNotice] = useState<Notice>(null);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [createForm, setCreateForm] = useState({
    companyName: "",
    email: "",
    enquiryType: "",
    fullName: "",
    message: "",
    phone: "",
    source: "manual-entry",
    status: "new",
  });
  const [editorForm, setEditorForm] = useState({
    clientId: "",
    enquiryType: "",
    internalNotes: "",
    status: "new",
  });

  useEffect(() => {
    if (data.leads.length && !data.leads.some((lead) => lead.id === selectedLeadId)) {
      setSelectedLeadId(data.leads[0]?.id ?? "");
    }
  }, [data.leads, selectedLeadId]);

  const selectedLead = data.leads.find((lead) => lead.id === selectedLeadId) ?? null;

  useEffect(() => {
    if (!selectedLead) {
      return;
    }

    setEditorForm({
      clientId: selectedLead.client_id ?? "",
      enquiryType: selectedLead.enquiry_type ?? "",
      internalNotes: selectedLead.internal_notes ?? "",
      status: selectedLead.status === "follow_up" ? "contacted" : selectedLead.status,
    });
  }, [selectedLead?.client_id, selectedLead?.enquiry_type, selectedLead?.id, selectedLead?.internal_notes, selectedLead?.status]);

  async function createLead() {
    try {
      await requestJson("/api/admin/leads", {
        body: JSON.stringify(createForm),
        method: "POST",
      });
      setNotice({ message: "Lead created.", tone: "success" });
      setCreateForm({
        companyName: "",
        email: "",
        enquiryType: "",
        fullName: "",
        message: "",
        phone: "",
        source: "manual-entry",
        status: "new",
      });
      await refresh();
    } catch (createError) {
      setNotice({
        message: createError instanceof Error ? createError.message : "Unable to create lead.",
        tone: "error",
      });
    }
  }

  async function saveLead() {
    if (!selectedLead) {
      return;
    }

    try {
      await requestJson(`/api/admin/leads/${selectedLead.id}`, {
        body: JSON.stringify(editorForm),
        method: "PATCH",
      });
      setNotice({ message: "Lead updated.", tone: "success" });
      await refresh();
    } catch (saveError) {
      setNotice({
        message: saveError instanceof Error ? saveError.message : "Unable to update lead.",
        tone: "error",
      });
    }
  }

  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <p className="eyebrow">Lead management</p>
        <h1 className="section-title">Lead submissions</h1>
        <p className="body-copy mt-4 max-w-3xl">
          Discovery calls, contact enquiries, booking requests, and application-led submissions now live
          in the `lead_submissions` table for ongoing qualification and follow-up.
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
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Total leads</p>
          <p className="mt-4 text-3xl font-bold text-slate-950">{data.stats.total}</p>
        </article>
        <article className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Qualified</p>
          <p className="mt-4 text-3xl font-bold text-slate-950">{data.stats.qualified}</p>
        </article>
        <article className="rounded-[1.5rem] bg-[#8a0917] p-6 text-white shadow-[0_16px_45px_rgba(138,9,23,0.2)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Contacted</p>
          <p className="mt-4 text-3xl font-bold">{data.stats.followUp}</p>
        </article>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <article className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-4 border-b border-black/5 bg-slate-50 px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Lead queue</p>
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
              {data.leads.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => {
                    setSelectedLeadId(lead.id);
                  }}
                  className={`grid w-full grid-cols-[1fr_1fr_0.8fr_0.7fr] gap-4 px-6 py-5 text-left text-sm text-slate-700 ${
                    lead.id === selectedLeadId ? "bg-[#fff8f7]" : "bg-white"
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-950">{lead.full_name}</p>
                    <p className="text-slate-600">{lead.email}</p>
                  </div>
                  <div>{lead.company_name ?? "No company"}</div>
                  <div>{lead.source}</div>
                  <div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${statusClasses(lead.status)}`}>
                      {statusLabel(lead.status)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-black/5 bg-[#ece7df] p-8 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Create lead</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                value={createForm.fullName}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, fullName: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Full name"
              />
              <input
                value={createForm.companyName}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, companyName: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Company"
              />
              <input
                value={createForm.email}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, email: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Email"
              />
              <input
                value={createForm.phone}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, phone: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Phone"
              />
              <input
                value={createForm.source}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, source: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Source"
              />
              <select
                value={createForm.status}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, status: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="new">New</option>
                <option value="qualified">Qualified</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
              <input
                value={createForm.enquiryType}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, enquiryType: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none md:col-span-2"
                placeholder="Enquiry type"
              />
              <textarea
                rows={4}
                value={createForm.message}
                onChange={(event) => {
                  setCreateForm((current) => ({ ...current, message: event.target.value }));
                }}
                className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none md:col-span-2"
                placeholder="Lead context"
              />
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    void createLead();
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#690711]"
                >
                  Create lead
                </button>
              </div>
            </div>
          </article>
        </section>

        <section className="rounded-[1.5rem] border border-black/5 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Lead editor</h2>
          {selectedLead ? (
            <div className="mt-6 space-y-6">
              <div className="rounded-[1.5rem] bg-slate-50 p-6">
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">{selectedLead.full_name}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {selectedLead.company_name ?? "No company"} • {selectedLead.email}
                </p>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {selectedLead.message ?? "No message provided."}
                </p>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Created {formatTimestamp(selectedLead.created_at)}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Status</span>
                  <select
                    value={editorForm.status}
                    onChange={(event) => {
                      setEditorForm((current) => ({ ...current, status: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  >
                    <option value="new">New</option>
                    <option value="qualified">Qualified</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Link to client</span>
                  <select
                    value={editorForm.clientId}
                    onChange={(event) => {
                      setEditorForm((current) => ({ ...current, clientId: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  >
                    <option value="">Not linked</option>
                    {data.clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-600">Enquiry type</span>
                  <input
                    value={editorForm.enquiryType}
                    onChange={(event) => {
                      setEditorForm((current) => ({ ...current, enquiryType: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-600">Internal notes</span>
                  <textarea
                    rows={6}
                    value={editorForm.internalNotes}
                    onChange={(event) => {
                      setEditorForm((current) => ({ ...current, internalNotes: event.target.value }));
                    }}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => {
                  void saveLead();
                }}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-black"
              >
                Save lead
              </button>
            </div>
          ) : (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-sm text-slate-500">
              Select a lead to review, qualify, and link into a live client record.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

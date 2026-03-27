"use client";

import { useEffect, useState } from "react";

import { requestJson, useLiveApi } from "@/components/portal/use-live-api";

type SupportTicket = {
  assigned_admin_id: string | null;
  category: string;
  client_id: string | null;
  id: string;
  priority: string;
  requester_client_account_id: string | null;
  status: string;
  subject: string;
  summary: string | null;
  ticket_number: string;
  updated_at: string;
};

type SupportMessage = {
  admin_account_id: string | null;
  author_scope: string;
  client_account_id: string | null;
  created_at: string;
  id: string;
  is_internal: boolean;
  message_body: string;
  ticket_id: string;
};

type SupportReference = {
  email: string;
  full_name: string;
  id: string;
  status: string;
};

type ClientReference = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

type AdminSupportPayload = {
  messages: SupportMessage[];
  references: {
    admins: SupportReference[];
    clientAccounts: Array<SupportReference & { client_id: string | null }>;
    clients: ClientReference[];
  };
  stats: {
    open: number;
    resolved: number;
    total: number;
    urgent: number;
  };
  tickets: SupportTicket[];
};

type Notice = { message: string; tone: "error" | "success" } | null;

const EMPTY_PAYLOAD: AdminSupportPayload = {
  messages: [],
  references: {
    admins: [],
    clientAccounts: [],
    clients: [],
  },
  stats: {
    open: 0,
    resolved: 0,
    total: 0,
    urgent: 0,
  },
  tickets: [],
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusTone(status: string) {
  switch (status) {
    case "open":
      return "bg-amber-100 text-amber-700";
    case "in_progress":
      return "bg-[#fff2c4] text-[#8e6200]";
    case "resolved":
    case "closed":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-200 text-slate-600";
  }
}

function priorityTone(priority: string) {
  switch (priority) {
    case "urgent":
    case "high":
      return "text-[#8a0917]";
    case "normal":
      return "text-amber-700";
    default:
      return "text-slate-500";
  }
}

export default function AdminSupportPage() {
  const { data, error, isLoading, refresh } = useLiveApi<AdminSupportPayload>(
    "/api/admin/support",
    EMPTY_PAYLOAD,
    {
      realtimeTables: [
        { table: "support_tickets" },
        { table: "support_ticket_messages" },
      ],
    },
  );
  const [notice, setNotice] = useState<Notice>(null);
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [newTicketForm, setNewTicketForm] = useState({
    assignedAdminId: "",
    category: "general",
    clientId: "",
    message: "",
    priority: "normal",
    subject: "",
  });
  const [replyForm, setReplyForm] = useState({
    assignedAdminId: "",
    message: "",
    priority: "normal",
    status: "open",
    summary: "",
  });

  useEffect(() => {
    if (data.tickets.length && !data.tickets.some((ticket) => ticket.id === selectedTicketId)) {
      setSelectedTicketId(data.tickets[0]?.id ?? "");
    }
  }, [data.tickets, selectedTicketId]);

  const selectedTicket = data.tickets.find((ticket) => ticket.id === selectedTicketId) ?? null;
  const selectedMessages = selectedTicket
    ? data.messages.filter((message) => message.ticket_id === selectedTicket.id)
    : [];

  useEffect(() => {
    if (!selectedTicket) {
      return;
    }

    setReplyForm({
      assignedAdminId: selectedTicket.assigned_admin_id ?? "",
      message: "",
      priority: selectedTicket.priority,
      status: selectedTicket.status,
      summary: selectedTicket.summary ?? "",
    });
  }, [selectedTicket?.assigned_admin_id, selectedTicket?.id, selectedTicket?.priority, selectedTicket?.status, selectedTicket?.summary]);

  async function createTicket() {
    try {
      await requestJson("/api/admin/support", {
        body: JSON.stringify(newTicketForm),
        method: "POST",
      });
      setNotice({ message: "Support ticket created.", tone: "success" });
      setNewTicketForm({
        assignedAdminId: "",
        category: "general",
        clientId: "",
        message: "",
        priority: "normal",
        subject: "",
      });
      await refresh();
    } catch (createError) {
      setNotice({
        message: createError instanceof Error ? createError.message : "Unable to create ticket.",
        tone: "error",
      });
    }
  }

  async function updateTicket() {
    if (!selectedTicket) {
      return;
    }

    try {
      await requestJson(`/api/admin/support/${selectedTicket.id}`, {
        body: JSON.stringify(replyForm),
        method: "PATCH",
      });
      setNotice({ message: `Updated ${selectedTicket.ticket_number}.`, tone: "success" });
      setReplyForm((current) => ({ ...current, message: "" }));
      await refresh();
    } catch (updateError) {
      setNotice({
        message: updateError instanceof Error ? updateError.message : "Unable to update ticket.",
        tone: "error",
      });
    }
  }

  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a0917]">Support desk</p>
        <h1 className="mt-4 text-[clamp(2.6rem,5vw,4rem)] font-light leading-[1.02] tracking-[-0.05em] text-slate-950">
          Support queue
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Client support is now running against live tickets, messages, and admin routing so replies and
          status changes flow back into the client workspace automatically.
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

      <section className="grid gap-5 md:grid-cols-4">
        <article className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Total tickets</p>
          <p className="mt-4 text-3xl font-bold text-slate-950">{data.stats.total}</p>
        </article>
        <article className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Open</p>
          <p className="mt-4 text-3xl font-bold text-slate-950">{data.stats.open}</p>
        </article>
        <article className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Urgent</p>
          <p className="mt-4 text-3xl font-bold text-slate-950">{data.stats.urgent}</p>
        </article>
        <article className="rounded-[1.5rem] bg-[#8a0917] p-6 text-white shadow-[0_16px_45px_rgba(138,9,23,0.2)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">Resolved</p>
          <p className="mt-4 text-3xl font-bold">{data.stats.resolved}</p>
        </article>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <article className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Ticket triage</h2>
                <p className="mt-2 text-sm text-slate-500">Every client-facing support thread and status change.</p>
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
              {data.tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => {
                    setSelectedTicketId(ticket.id);
                  }}
                  className={`w-full rounded-[1.5rem] border p-6 text-left transition ${
                    ticket.id === selectedTicketId
                      ? "border-[#8a0917]/20 bg-[#fff8f7]"
                      : "border-slate-100 bg-slate-50 hover:border-[#8a0917]/15"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold tracking-tight text-slate-950">{ticket.subject}</h3>
                        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${statusTone(ticket.status)}`}>
                          {ticket.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        {ticket.ticket_number} • {ticket.category.replace("_", " ")}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{ticket.summary ?? "No summary yet."}</p>
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-[0.16em] ${priorityTone(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Updated {formatTimestamp(ticket.updated_at)}
                  </p>
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-black/5 bg-[#ece7df] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Create internal ticket</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-600">Subject</span>
                <input
                  value={newTicketForm.subject}
                  onChange={(event) => {
                    setNewTicketForm((current) => ({ ...current, subject: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  placeholder="Portal access request"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Client</span>
                <select
                  value={newTicketForm.clientId}
                  onChange={(event) => {
                    setNewTicketForm((current) => ({ ...current, clientId: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="">Internal / no client</option>
                  {data.references.clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Assigned admin</span>
                <select
                  value={newTicketForm.assignedAdminId}
                  onChange={(event) => {
                    setNewTicketForm((current) => ({ ...current, assignedAdminId: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="">Unassigned</option>
                  {data.references.admins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.full_name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Category</span>
                <select
                  value={newTicketForm.category}
                  onChange={(event) => {
                    setNewTicketForm((current) => ({ ...current, category: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="general">General</option>
                  <option value="portal_access">Portal access</option>
                  <option value="documents">Documents</option>
                  <option value="training">Training</option>
                  <option value="technical">Technical</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Priority</span>
                <select
                  value={newTicketForm.priority}
                  onChange={(event) => {
                    setNewTicketForm((current) => ({ ...current, priority: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-600">Opening note</span>
                <textarea
                  rows={4}
                  value={newTicketForm.message}
                  onChange={(event) => {
                    setNewTicketForm((current) => ({ ...current, message: event.target.value }));
                  }}
                  className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
              </label>
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    void createTicket();
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#690711]"
                >
                  Create ticket
                </button>
              </div>
            </div>
          </article>
        </section>

        <section className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="border-b border-slate-100 pb-6">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Ticket detail</h2>
            <p className="mt-2 text-sm text-slate-500">
              Open a ticket to reply, reassign, or update delivery status.
            </p>
          </div>

          {selectedTicket ? (
            <div className="mt-8 space-y-8">
              <div className="rounded-[1.5rem] bg-slate-50 p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">{selectedTicket.subject}</h3>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${statusTone(selectedTicket.status)}`}>
                    {selectedTicket.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {selectedTicket.ticket_number} • {selectedTicket.category.replace("_", " ")} • Updated{" "}
                  {formatTimestamp(selectedTicket.updated_at)}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {selectedTicket.summary ?? "No summary captured yet."}
                </p>
              </div>

              <div className="space-y-4">
                {selectedMessages.length ? (
                  selectedMessages.map((message) => (
                    <article key={message.id} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a0917]">
                          {message.author_scope}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          {formatTimestamp(message.created_at)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{message.message_body}</p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-sm text-slate-500">
                    No messages on this ticket yet.
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Status</span>
                  <select
                    value={replyForm.status}
                    onChange={(event) => {
                      setReplyForm((current) => ({ ...current, status: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="waiting">Waiting</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Priority</span>
                  <select
                    value={replyForm.priority}
                    onChange={(event) => {
                      setReplyForm((current) => ({ ...current, priority: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Assigned admin</span>
                  <select
                    value={replyForm.assignedAdminId}
                    onChange={(event) => {
                      setReplyForm((current) => ({ ...current, assignedAdminId: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  >
                    <option value="">Unassigned</option>
                    {data.references.admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.full_name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Summary</span>
                  <input
                    value={replyForm.summary}
                    onChange={(event) => {
                      setReplyForm((current) => ({ ...current, summary: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-600">Reply</span>
                  <textarea
                    rows={4}
                    value={replyForm.message}
                    onChange={(event) => {
                      setReplyForm((current) => ({ ...current, message: event.target.value }));
                    }}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                    placeholder="Write the update the client should receive."
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => {
                  void updateTicket();
                }}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-black"
              >
                Save ticket update
              </button>
            </div>
          ) : (
            <div className="mt-8 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-sm text-slate-500">
              Select a ticket from the queue to open the conversation and update its workflow.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

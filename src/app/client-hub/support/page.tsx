"use client";

import { useEffect, useState } from "react";

import { requestJson, useLiveApi } from "@/components/portal/use-live-api";
import { DashboardIcon } from "@/components/client-hub/dashboard-icon";

type SupportTicket = {
  assigned_admin_id: string | null;
  category: string;
  id: string;
  priority: string;
  status: string;
  subject: string;
  summary: string | null;
  ticket_number: string;
  updated_at: string;
};

type SupportMessage = {
  author_scope: string;
  created_at: string;
  id: string;
  message_body: string;
  ticket_id: string;
};

type SupportAdmin = {
  full_name: string;
  id: string;
};

type ClientSupportPayload = {
  messages: SupportMessage[];
  references: {
    admins: SupportAdmin[];
  };
  stats: {
    open: number;
    total: number;
    waiting: number;
  };
  tickets: SupportTicket[];
};

type Notice = { message: string; tone: "error" | "success" } | null;

const EMPTY_PAYLOAD: ClientSupportPayload = {
  messages: [],
  references: {
    admins: [],
  },
  stats: {
    open: 0,
    total: 0,
    waiting: 0,
  },
  tickets: [],
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ticketTone(status: string) {
  switch (status) {
    case "open":
      return "bg-amber-100 text-amber-700";
    case "waiting":
      return "bg-slate-200 text-slate-600";
    default:
      return "bg-emerald-100 text-emerald-700";
  }
}

export default function ClientHubSupportPage() {
  const { data, error, isLoading, refresh } = useLiveApi<ClientSupportPayload>(
    "/api/client/support",
    EMPTY_PAYLOAD,
  );
  const [notice, setNotice] = useState<Notice>(null);
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [newTicketForm, setNewTicketForm] = useState({
    category: "documents",
    message: "",
    priority: "normal",
    subject: "",
  });
  const [replyForm, setReplyForm] = useState({
    message: "",
    status: "waiting",
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

  async function createTicket() {
    try {
      await requestJson("/api/client/support", {
        body: JSON.stringify(newTicketForm),
        method: "POST",
      });
      setNotice({ message: "Support request submitted.", tone: "success" });
      setNewTicketForm({
        category: "documents",
        message: "",
        priority: "normal",
        subject: "",
      });
      await refresh();
    } catch (createError) {
      setNotice({
        message: createError instanceof Error ? createError.message : "Unable to submit request.",
        tone: "error",
      });
    }
  }

  async function replyToTicket(closeAfterReply = false) {
    if (!selectedTicket) {
      return;
    }

    try {
      await requestJson(`/api/client/support/${selectedTicket.id}`, {
        body: JSON.stringify({
          message: replyForm.message,
          status: closeAfterReply ? "closed" : replyForm.status,
        }),
        method: "PATCH",
      });
      setNotice({ message: `Updated ${selectedTicket.ticket_number}.`, tone: "success" });
      setReplyForm({ message: "", status: "waiting" });
      await refresh();
    } catch (replyError) {
      setNotice({
        message: replyError instanceof Error ? replyError.message : "Unable to update ticket.",
        tone: "error",
      });
    }
  }

  return (
    <div className="space-y-10 px-6 py-8 lg:px-10 lg:py-12">
      <section className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8e6200]">Help centre</p>
        <h1 className="mt-3 text-4xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)] sm:text-5xl">
          Support
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Open requests, follow replies, and close the loop with the Tacklers team from one shared support
          workspace.
        </p>
      </section>

      {notice ? (
        <div
          className={`rounded-[1.5rem] px-5 py-4 text-sm ${
            notice.tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[1.5rem] bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[1.75rem] bg-white p-7 shadow-[0_18px_50px_rgba(31,29,29,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Total tickets</p>
          <p className="mt-4 text-4xl font-bold text-[#2b2929]">{data.stats.total}</p>
          <p className="mt-2 text-sm text-slate-500">All support requests for this workspace.</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-7 shadow-[0_18px_50px_rgba(31,29,29,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Open</p>
          <p className="mt-4 text-4xl font-bold text-[#2b2929]">{data.stats.open}</p>
          <p className="mt-2 text-sm text-slate-500">Requests still active with the programme team.</p>
        </article>
        <article className="rounded-[1.75rem] bg-[linear-gradient(135deg,#62000b_0%,#8a0917_100%)] p-7 text-white shadow-[0_20px_60px_rgba(98,0,11,0.25)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">Waiting</p>
          <p className="mt-4 text-3xl font-bold [font-family:var(--font-client-headline)]">{data.stats.waiting}</p>
          <p className="mt-2 text-sm text-white/80">Requests paused pending your feedback or files.</p>
        </article>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#f0e7e3] pb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
                Current tickets
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Existing requests already being handled by the Tacklers team.
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
            {data.tickets.length ? (
              data.tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => {
                    setSelectedTicketId(ticket.id);
                  }}
                  className={`w-full rounded-[1.5rem] border p-6 text-left transition ${
                    ticket.id === selectedTicketId
                      ? "border-[#c87e75] bg-[#fff9f7]"
                      : "border-[#ede2dd] bg-[#faf7f5]"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-[#2b2929]">{ticket.subject}</h3>
                        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${ticketTone(ticket.status)}`}>
                          {ticket.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        {ticket.ticket_number} • {ticket.category.replace("_", " ")}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {ticket.summary ?? "No summary yet."}
                      </p>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#8e6200]">
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Updated {formatTimestamp(ticket.updated_at)}
                  </p>
                </button>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-[#ede2dd] bg-[#faf7f5] px-6 py-8 text-sm text-slate-500">
                No tickets yet. Start a new request on the right.
              </div>
            )}
          </div>

          {selectedTicket ? (
            <div className="mt-8 border-t border-[#f0e7e3] pt-8">
              <h3 className="text-xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
                Conversation
              </h3>
              <div className="mt-5 space-y-4">
                {selectedMessages.map((message) => (
                  <article key={message.id} className="rounded-[1.5rem] border border-[#ede2dd] p-5">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#faf1ef] text-[#7d0b16]">
                        <DashboardIcon name="message" className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8e6200]">
                            {message.author_scope}
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            {formatTimestamp(message.created_at)}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{message.message_body}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Reply</span>
                  <textarea
                    rows={4}
                    value={replyForm.message}
                    onChange={(event) => {
                      setReplyForm((current) => ({ ...current, message: event.target.value }));
                    }}
                    className="rounded-[1.5rem] border border-[#ddd1cc] bg-[#faf7f5] px-4 py-3 text-sm outline-none transition focus:border-[#c87e75]"
                  />
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      void replyToTicket(false);
                    }}
                    className="inline-flex items-center justify-center rounded-2xl bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#6f0712]"
                  >
                    Send reply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void replyToTicket(true);
                    }}
                    className="inline-flex items-center justify-center rounded-2xl border border-[#c87e75] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8a0917] transition hover:bg-[#fff4f1]"
                  >
                    Reply and close
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] bg-[#ece7e3] p-8">
            <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              New request
            </h2>
            <div className="mt-6 space-y-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Subject</span>
                <input
                  value={newTicketForm.subject}
                  onChange={(event) => {
                    setNewTicketForm((current) => ({ ...current, subject: event.target.value }));
                  }}
                  className="rounded-2xl border border-[#ddd1cc] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c87e75]"
                  placeholder="Request document update"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Category</span>
                  <select
                    value={newTicketForm.category}
                    onChange={(event) => {
                      setNewTicketForm((current) => ({ ...current, category: event.target.value }));
                    }}
                    className="rounded-2xl border border-[#ddd1cc] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c87e75]"
                  >
                    <option value="documents">Documents</option>
                    <option value="training">Training</option>
                    <option value="portal_access">Portal access</option>
                    <option value="general">General</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Priority</span>
                  <select
                    value={newTicketForm.priority}
                    onChange={(event) => {
                      setNewTicketForm((current) => ({ ...current, priority: event.target.value }));
                    }}
                    className="rounded-2xl border border-[#ddd1cc] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c87e75]"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Message</span>
                <textarea
                  rows={5}
                  value={newTicketForm.message}
                  onChange={(event) => {
                    setNewTicketForm((current) => ({ ...current, message: event.target.value }));
                  }}
                  className="rounded-[1.5rem] border border-[#ddd1cc] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c87e75]"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  void createTicket();
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#6f0712]"
              >
                Submit request
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
            <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              Quick guidance
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <p>Use support for missing files, workspace access updates, scheduling changes, and follow-up questions.</p>
              <p>Every reply from the Tacklers team is written back into this workspace and mirrored in your notifications feed.</p>
              <p>When a request is fully handled, you can close it from the conversation area so the queue stays tidy.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

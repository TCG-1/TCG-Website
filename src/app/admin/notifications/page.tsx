"use client";

import { useEffect, useState } from "react";

import { requestJson, useLiveApi } from "@/components/portal/use-live-api";

type RecipientOption = {
  email: string;
  full_name: string;
  id: string;
  status: string;
};

type AdminNotification = {
  body: string;
  created_at: string;
  id: string;
  is_read: boolean;
  link_href: string | null;
  priority: string;
  title: string;
};

type NotificationPreference = {
  description: string;
  email_enabled: boolean;
  id: string;
  in_app_enabled: boolean;
  label: string;
  preference_key: string;
  sms_enabled: boolean;
};

type AdminNotificationsPayload = {
  notifications: AdminNotification[];
  preferences: NotificationPreference[];
  recipients: {
    admins: RecipientOption[];
    clients: RecipientOption[];
  };
  stats: {
    total: number;
    unread: number;
  };
};

type TrainingReminderPayload = {
  lastActivityAt: string | null;
  recent: Array<{
    created_at: string;
    id: string;
    recipient_scope: string;
    reminder_kind: string;
    target_entity_type: string;
  }>;
  stale: boolean;
  stats: {
    kinds: number;
    last24Hours: number;
    total: number;
  };
  summaryByKind: Array<{
    count: number;
    kind: string;
    lastSentAt: string;
  }>;
};

type Notice = { message: string; tone: "error" | "success" } | null;

const EMPTY_PAYLOAD: AdminNotificationsPayload = {
  notifications: [],
  preferences: [],
  recipients: {
    admins: [],
    clients: [],
  },
  stats: {
    total: 0,
    unread: 0,
  },
};

const EMPTY_REMINDER_PAYLOAD: TrainingReminderPayload = {
  lastActivityAt: null,
  recent: [],
  stale: true,
  stats: {
    kinds: 0,
    last24Hours: 0,
    total: 0,
  },
  summaryByKind: [],
};

function priorityTone(priority: string) {
  switch (priority) {
    case "urgent":
    case "high":
      return "bg-[#8a0917] text-white";
    case "normal":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-200 text-slate-600";
  }
}

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminNotificationsPage() {
  const { data, error, isLoading, refresh } = useLiveApi<AdminNotificationsPayload>(
    "/api/admin/notifications",
    EMPTY_PAYLOAD,
    {
      realtimeTables: [{ table: "notifications" }],
    },
  );
  const {
    data: reminderData,
    error: reminderError,
    isLoading: remindersLoading,
    refresh: refreshReminders,
  } = useLiveApi<TrainingReminderPayload>("/api/admin/training/reminders", EMPTY_REMINDER_PAYLOAD, {
    realtimeTables: [{ table: "training_reminder_log" }, { table: "notifications" }],
  });
  const [notice, setNotice] = useState<Notice>(null);
  const [form, setForm] = useState({
    body: "",
    linkHref: "",
    priority: "normal",
    recipientScope: "client",
    targetAccountId: "",
    title: "",
  });

  const recipientOptions =
    form.recipientScope === "admin" ? data.recipients.admins : data.recipients.clients;

  useEffect(() => {
    if (!recipientOptions.length) {
      return;
    }

    if (!recipientOptions.some((item) => item.id === form.targetAccountId)) {
      setForm((current) => ({
        ...current,
        targetAccountId: recipientOptions[0]?.id ?? "",
      }));
    }
  }, [form.targetAccountId, recipientOptions]);

  async function createNotification() {
    try {
      await requestJson("/api/admin/notifications", {
        body: JSON.stringify(form),
        method: "POST",
      });
      setNotice({ message: "Notification sent.", tone: "success" });
      setForm({
        body: "",
        linkHref: "",
        priority: "normal",
        recipientScope: form.recipientScope,
        targetAccountId: recipientOptions[0]?.id ?? "",
        title: "",
      });
      await refresh();
    } catch (createError) {
      setNotice({
        message: createError instanceof Error ? createError.message : "Unable to send notification.",
        tone: "error",
      });
    }
  }

  async function markRead(id: string, isRead: boolean) {
    try {
      await requestJson(`/api/admin/notifications/${id}`, {
        body: JSON.stringify({ isRead }),
        method: "PATCH",
      });
      await refresh();
    } catch (updateError) {
      setNotice({
        message: updateError instanceof Error ? updateError.message : "Unable to update notification.",
        tone: "error",
      });
    }
  }

  async function runReminderAutomation() {
    try {
      const payload = await requestJson<{
        result: {
          assessments: number;
          certificatesAwarded: number;
          certificatesReady: number;
          grading: number;
          sessions: number;
        };
      }>("/api/admin/training/reminders", {
        method: "POST",
      });
      setNotice({
        message: `Reminder automation completed. ${payload.result.sessions} session, ${payload.result.assessments} assessment, ${payload.result.grading} grading, ${payload.result.certificatesReady} certificate-ready, and ${payload.result.certificatesAwarded} certificate-awarded reminders were sent.`,
        tone: "success",
      });
      await Promise.all([refresh(), refreshReminders()]);
    } catch (runError) {
      setNotice({
        message: runError instanceof Error ? runError.message : "Unable to run reminder automation.",
        tone: "error",
      });
    }
  }

  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a0917]">Operations alerts</p>
        <h1 className="mt-4 text-[clamp(2.6rem,5vw,4rem)] font-light leading-[1.02] tracking-[-0.05em] text-slate-950">
          Notification control
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Manage the operational inbox and publish live in-app notifications directly into admin or
          client workspaces.
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
      {reminderError ? (
        <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">{reminderError}</div>
      ) : null}

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[1.75rem] border border-black/5 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Unread alerts</p>
          <p className="mt-5 text-4xl font-bold tracking-tight text-slate-950">{data.stats.unread}</p>
          <p className="mt-2 text-sm text-slate-500">Items waiting for admin action.</p>
        </article>
        <article className="rounded-[1.75rem] border border-black/5 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Delivery routes</p>
          <p className="mt-5 text-4xl font-bold tracking-tight text-slate-950">{data.preferences.length}</p>
          <p className="mt-2 text-sm text-slate-500">Configured notification preference groups.</p>
        </article>
        <article className="rounded-[1.75rem] bg-[#8a0917] p-7 text-white shadow-[0_20px_60px_rgba(138,9,23,0.24)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">Recipient accounts</p>
          <p className="mt-5 text-4xl font-bold tracking-tight">
            {data.recipients.admins.length + data.recipients.clients.length}
          </p>
          <p className="mt-2 text-sm text-white/80">Live admin and client accounts available for alerts.</p>
        </article>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Live alerts</h2>
              <p className="mt-2 text-sm text-slate-500">
                Notifications assigned to your admin account.
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
            {data.notifications.length ? (
              data.notifications.map((notification) => (
                <article key={notification.id} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                          {notification.title}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${priorityTone(notification.priority)}`}
                        >
                          {notification.priority}
                        </span>
                      </div>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{notification.body}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        void markRead(notification.id, !notification.is_read);
                      }}
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                        notification.is_read
                          ? "bg-slate-200 text-slate-600"
                          : "bg-slate-950 text-white"
                      }`}
                    >
                      {notification.is_read ? "Read" : "Mark read"}
                    </button>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    <span>{formatTimestamp(notification.created_at)}</span>
                    {notification.link_href ? (
                      <>
                        <span>•</span>
                        <a
                          href={notification.link_href}
                          className="text-[#8a0917] transition hover:text-[#690711]"
                        >
                          Open link
                        </a>
                      </>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-sm text-slate-500">
                No admin notifications yet. Use the composer to send one.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Reminder operations console</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Monitor reminder cadence, detect stale automation, and trigger an operational run when delivery needs it.
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                  reminderData.stale ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {reminderData.stale ? "Stale" : "Healthy"}
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.2rem] bg-slate-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Total logs</p>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{reminderData.stats.total}</p>
              </div>
              <div className="rounded-[1.2rem] bg-slate-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Last 24 hours</p>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{reminderData.stats.last24Hours}</p>
              </div>
              <div className="rounded-[1.2rem] bg-slate-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Reminder kinds</p>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{reminderData.stats.kinds}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  void runReminderAutomation();
                }}
                className="rounded-full bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#690711]"
              >
                Run reminder automation
              </button>
              <button
                type="button"
                onClick={() => {
                  void refreshReminders();
                }}
                className="rounded-full border border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-600 transition hover:border-[#8a0917]/30 hover:text-[#8a0917]"
              >
                {remindersLoading ? "Loading..." : "Refresh console"}
              </button>
              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Last activity {reminderData.lastActivityAt ? formatTimestamp(reminderData.lastActivityAt) : "not recorded"}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {reminderData.summaryByKind.length ? reminderData.summaryByKind.map((item) => (
                <div key={item.kind} className="rounded-[1.2rem] border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{item.kind.replace(/_/g, " ")}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                        Last sent {formatTimestamp(item.lastSentAt)}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      {item.count}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="rounded-[1.2rem] border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                  No reminder activity has been recorded yet.
                </div>
              )}
            </div>

            <div className="mt-6 rounded-[1.2rem] border border-slate-100 bg-slate-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Recent log entries</p>
              <div className="mt-3 space-y-3">
                {reminderData.recent.length ? reminderData.recent.slice(0, 8).map((item) => (
                  <div key={item.id} className="text-sm leading-6 text-slate-600">
                    <span className="font-semibold text-slate-950">{item.reminder_kind.replace(/_/g, " ")}</span>
                    {" • "}
                    {item.recipient_scope}
                    {" • "}
                    {item.target_entity_type}
                    {" • "}
                    {formatTimestamp(item.created_at)}
                  </div>
                )) : (
                  <p className="text-sm leading-6 text-slate-500">Reminder log entries will appear here after the first run.</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-black/5 bg-[#ece7df] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Send notification</h2>
            <div className="mt-6 space-y-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Audience</span>
                <select
                  value={form.recipientScope}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      recipientScope: event.target.value,
                      targetAccountId: "",
                    }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Recipient</span>
                <select
                  value={form.targetAccountId}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, targetAccountId: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  {recipientOptions.map((recipient) => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.full_name} • {recipient.email}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Title</span>
                <input
                  value={form.title}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, title: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  placeholder="Quarterly review confirmed"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Message</span>
                <textarea
                  rows={4}
                  value={form.body}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, body: event.target.value }));
                  }}
                  className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  placeholder="Share the update the recipient needs to see in the workspace."
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Priority</span>
                  <select
                    value={form.priority}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, priority: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Optional link</span>
                  <input
                    value={form.linkHref}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, linkHref: event.target.value }));
                    }}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    placeholder="/client-hub/support"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => {
                  void createNotification();
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#690711]"
              >
                Send notification
              </button>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Delivery preferences</h2>
            <div className="mt-6 space-y-4">
              {data.preferences.map((setting) => (
                <div key={setting.id} className="rounded-[1.25rem] border border-slate-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{setting.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{setting.description}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                        setting.email_enabled || setting.in_app_enabled
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {setting.email_enabled || setting.in_app_enabled ? "On" : "Off"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

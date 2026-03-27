"use client";

import { requestJson, useLiveApi } from "@/components/portal/use-live-api";
import { DashboardIcon } from "@/components/client-hub/dashboard-icon";

type ClientNotification = {
  body: string;
  created_at: string;
  id: string;
  is_read: boolean;
  link_href: string | null;
  priority: string;
  title: string;
};

type ClientNotificationPreference = {
  description: string;
  email_enabled: boolean;
  id: string;
  in_app_enabled: boolean;
  label: string;
  sms_enabled: boolean;
};

type ClientNotificationsPayload = {
  notifications: ClientNotification[];
  preferences: ClientNotificationPreference[];
  stats: {
    total: number;
    unread: number;
  };
};

const EMPTY_PAYLOAD: ClientNotificationsPayload = {
  notifications: [],
  preferences: [],
  stats: {
    total: 0,
    unread: 0,
  },
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ClientHubNotificationsPage() {
  const { data, error, isLoading, refresh } = useLiveApi<ClientNotificationsPayload>(
    "/api/client/notifications",
    EMPTY_PAYLOAD,
  );

  async function markRead(id: string, isRead: boolean) {
    await requestJson(`/api/client/notifications/${id}`, {
      body: JSON.stringify({ isRead }),
      method: "PATCH",
    });
    await refresh();
  }

  async function markAllRead() {
    await requestJson("/api/client/notifications", {
      method: "PATCH",
    });
    await refresh();
  }

  return (
    <div className="space-y-10 px-6 py-8 lg:px-10 lg:py-12">
      <section className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8e6200]">Workspace alerts</p>
        <h1 className="mt-3 text-4xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)] sm:text-5xl">
          Notifications
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Live schedule updates, support replies, and document publishing alerts sent into your client
          workspace by the Tacklers team.
        </p>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[1.75rem] bg-white p-7 shadow-[0_18px_50px_rgba(31,29,29,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Unread</p>
          <p className="mt-4 text-4xl font-bold text-[#2b2929]">{data.stats.unread}</p>
          <p className="mt-2 text-sm text-slate-500">Fresh items waiting for sponsor review.</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-7 shadow-[0_18px_50px_rgba(31,29,29,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Alert channels</p>
          <p className="mt-4 text-4xl font-bold text-[#2b2929]">{data.preferences.length}</p>
          <p className="mt-2 text-sm text-slate-500">Delivery preferences saved to your workspace account.</p>
        </article>
        <article className="rounded-[1.75rem] bg-[linear-gradient(135deg,#62000b_0%,#8a0917_100%)] p-7 text-white shadow-[0_20px_60px_rgba(98,0,11,0.25)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">Response standard</p>
          <p className="mt-4 text-3xl font-bold [font-family:var(--font-client-headline)]">2 working days</p>
          <p className="mt-2 text-sm text-white/80">We aim to respond within 2 working days to all inquiries.</p>
        </article>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.25fr_0.85fr]">
        <section className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#f0e7e3] pb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
                Latest activity
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Real workspace updates arriving from support, documents, and programme delivery.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  void markAllRead();
                }}
                className="rounded-full border border-[#e5d2cd] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 transition hover:border-[#8a0917]/30 hover:text-[#8a0917]"
              >
                Mark all read
              </button>
              <button
                type="button"
                onClick={() => {
                  void refresh();
                }}
                className="rounded-full bg-[#fff2c4] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d5d00]"
              >
                {isLoading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {data.notifications.length ? (
              data.notifications.map((notification) => (
                <article
                  key={notification.id}
                  className={`rounded-[1.5rem] border p-6 transition ${
                    notification.is_read ? "border-[#ede2dd] bg-[#faf7f5]" : "border-[#d6bab2] bg-[#fff9f7]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#7d0b16] shadow-sm">
                        <DashboardIcon name="bell" className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-[#2b2929]">{notification.title}</h3>
                          <span className="rounded-full bg-[#ece7e3] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                            {notification.priority}
                          </span>
                        </div>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{notification.body}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        void markRead(notification.id, !notification.is_read);
                      }}
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                        notification.is_read ? "bg-slate-200 text-slate-600" : "bg-[#8a0917] text-white"
                      }`}
                    >
                      {notification.is_read ? "Read" : "Mark read"}
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    <span>{formatTimestamp(notification.created_at)}</span>
                    {notification.link_href ? (
                      <>
                        <span>•</span>
                        <a href={notification.link_href} className="text-[#8e6200]">
                          Open
                        </a>
                      </>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-[#e5d2cd] bg-[#faf7f5] px-6 py-10 text-sm text-slate-500">
                No notifications yet. New admin alerts, support replies, and document updates will appear
                here.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] bg-[#ece7e3] p-8">
            <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              Delivery preferences
            </h2>
            <div className="mt-6 space-y-4">
              {data.preferences.map((preference) => (
                <div key={preference.id} className="rounded-[1.5rem] bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#2b2929]">{preference.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{preference.description}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                        preference.email_enabled || preference.in_app_enabled
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {preference.email_enabled || preference.in_app_enabled ? "Enabled" : "Off"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
            <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              What happens next
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <p>New shared documents appear here as soon as the Tacklers team publishes them to your workspace.</p>
              <p>Support replies and ticket changes are mirrored into this feed so you do not need to chase updates by email.</p>
              <p>Keep your settings current if you want more or fewer in-app alerts across the programme.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

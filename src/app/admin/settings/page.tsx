"use client";

import { useEffect, useState } from "react";

import { requestJson, useLiveApi } from "@/components/portal/use-live-api";

type NotificationPreference = {
  email_enabled: boolean;
  id: string;
  in_app_enabled: boolean;
  preference_key: string;
  sms_enabled: boolean;
};

type FeatureFlag = {
  id: string;
  is_enabled: boolean;
  label: string;
};

type Integration = {
  id: string;
  label: string;
  status: string;
};

type AdminSettingsPayload = {
  featureFlags: FeatureFlag[];
  integrations: Integration[];
  notificationPreferences: NotificationPreference[];
  passwordRequests: Array<{
    created_at: string;
    id: string;
    request_status: string;
  }>;
  preferences: {
    dateFormat: string | null;
    locale: string | null;
    theme: string | null;
    timezone: string | null;
  };
  securityEvents: Array<{
    created_at: string;
    event_type: string;
    id: string;
  }>;
};

type Notice = { message: string; tone: "error" | "success" } | null;

const EMPTY_PAYLOAD: AdminSettingsPayload = {
  featureFlags: [],
  integrations: [],
  notificationPreferences: [],
  passwordRequests: [],
  preferences: {
    dateFormat: "dd MMM yyyy",
    locale: "en-GB",
    theme: "light",
    timezone: "Europe/London",
  },
  securityEvents: [],
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminSettingsPage() {
  const { data, error, refresh } = useLiveApi<AdminSettingsPayload>("/api/admin/settings", EMPTY_PAYLOAD);
  const [notice, setNotice] = useState<Notice>(null);
  const [preferencesForm, setPreferencesForm] = useState({
    dateFormat: "dd MMM yyyy",
    locale: "en-GB",
    theme: "light",
    timezone: "Europe/London",
  });
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [passwordForm, setPasswordForm] = useState({
    confirmPassword: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    setPreferencesForm({
      dateFormat: data.preferences.dateFormat ?? "dd MMM yyyy",
      locale: data.preferences.locale ?? "en-GB",
      theme: data.preferences.theme ?? "light",
      timezone: data.preferences.timezone ?? "Europe/London",
    });
    setNotificationPreferences(data.notificationPreferences);
    setFeatureFlags(data.featureFlags);
    setIntegrations(data.integrations);
  }, [data.featureFlags, data.integrations, data.notificationPreferences, data.preferences.dateFormat, data.preferences.locale, data.preferences.theme, data.preferences.timezone]);

  async function saveSettings() {
    try {
      await requestJson("/api/admin/settings", {
        body: JSON.stringify({
          featureFlags: featureFlags.map((item) => ({ id: item.id, isEnabled: item.is_enabled })),
          integrations,
          notificationPreferences: notificationPreferences.map((item) => ({
            emailEnabled: item.email_enabled,
            id: item.id,
            inAppEnabled: item.in_app_enabled,
            smsEnabled: item.sms_enabled,
          })),
          ...preferencesForm,
        }),
        method: "PATCH",
      });
      setNotice({ message: "Settings saved.", tone: "success" });
      await refresh();
    } catch (saveError) {
      setNotice({
        message: saveError instanceof Error ? saveError.message : "Unable to save settings.",
        tone: "error",
      });
    }
  }

  async function requestPasswordChange() {
    try {
      const response = await requestJson<{ message: string }>("/api/admin/settings", {
        body: JSON.stringify(passwordForm),
        method: "POST",
      });
      setNotice({ message: response.message, tone: "success" });
      setPasswordForm({
        confirmPassword: "",
        currentPassword: "",
        newPassword: "",
      });
      await refresh();
    } catch (requestError) {
      setNotice({
        message: requestError instanceof Error ? requestError.message : "Unable to record password request.",
        tone: "error",
      });
    }
  }

  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a0917]">Platform controls</p>
        <h1 className="mt-4 text-[clamp(2.6rem,5vw,4rem)] font-light leading-[1.02] tracking-[-0.05em] text-slate-950">
          Settings
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Notification defaults, automations, and security requests are now stored and managed directly
          from the portal.
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

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <article className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="border-b border-slate-100 pb-6">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Portal preferences</h2>
              <p className="mt-2 text-sm text-slate-500">Core admin defaults for the live portal.</p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Theme</span>
                <select
                  value={preferencesForm.theme}
                  onChange={(event) => {
                    setPreferencesForm((current) => ({ ...current, theme: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Timezone</span>
                <input
                  value={preferencesForm.timezone}
                  onChange={(event) => {
                    setPreferencesForm((current) => ({ ...current, timezone: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Locale</span>
                <input
                  value={preferencesForm.locale}
                  onChange={(event) => {
                    setPreferencesForm((current) => ({ ...current, locale: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Date format</span>
                <input
                  value={preferencesForm.dateFormat}
                  onChange={(event) => {
                    setPreferencesForm((current) => ({ ...current, dateFormat: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </label>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="border-b border-slate-100 pb-6">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Notification defaults</h2>
              <p className="mt-2 text-sm text-slate-500">Every preference row is stored in the database.</p>
            </div>
            <div className="mt-8 space-y-4">
              {notificationPreferences.map((setting) => (
                <div key={setting.id} className="rounded-[1.25rem] border border-slate-100 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-950">{setting.preference_key.replace(/_/g, " ")}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={setting.in_app_enabled}
                        onChange={(event) => {
                          setNotificationPreferences((current) =>
                            current.map((item) =>
                              item.id === setting.id ? { ...item, in_app_enabled: event.target.checked } : item,
                            ),
                          );
                        }}
                      />
                      In-app
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={setting.email_enabled}
                        onChange={(event) => {
                          setNotificationPreferences((current) =>
                            current.map((item) =>
                              item.id === setting.id ? { ...item, email_enabled: event.target.checked } : item,
                            ),
                          );
                        }}
                      />
                      Email
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={setting.sms_enabled}
                        onChange={(event) => {
                          setNotificationPreferences((current) =>
                            current.map((item) =>
                              item.id === setting.id ? { ...item, sms_enabled: event.target.checked } : item,
                            ),
                          );
                        }}
                      />
                      SMS
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="border-b border-slate-100 pb-6">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Automation toggles</h2>
              <p className="mt-2 text-sm text-slate-500">Feature flags and integration settings are now editable.</p>
            </div>
            <div className="mt-8 space-y-4">
              {featureFlags.map((flag) => (
                <div key={flag.id} className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-slate-100 bg-slate-50 px-5 py-4">
                  <span className="text-sm text-slate-600">{flag.label}</span>
                  <input
                    type="checkbox"
                    checked={flag.is_enabled}
                    onChange={(event) => {
                      setFeatureFlags((current) =>
                        current.map((item) =>
                          item.id === flag.id ? { ...item, is_enabled: event.target.checked } : item,
                        ),
                      );
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-slate-100 bg-slate-50 px-5 py-4">
                  <span className="text-sm text-slate-600">{integration.label}</span>
                  <select
                    value={integration.status}
                    onChange={(event) => {
                      setIntegrations((current) =>
                        current.map((item) =>
                          item.id === integration.id ? { ...item, status: event.target.value } : item,
                        ),
                      );
                    }}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-600"
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => {
                  void saveSettings();
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#690711]"
              >
                Save settings
              </button>
            </div>
          </article>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[1.75rem] border border-black/5 bg-[#ece7df] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Request password rotation</h2>
            <div className="mt-6 space-y-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Current password</span>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) => {
                    setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">New password</span>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) => {
                    setPasswordForm((current) => ({ ...current, newPassword: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Confirm password</span>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) => {
                    setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  void requestPasswordChange();
                }}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-black"
              >
                Record request
              </button>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Security timeline</h2>
            <div className="mt-6 space-y-4">
              {data.securityEvents.map((event) => (
                <div key={event.id} className="rounded-[1.25rem] border border-slate-100 p-5">
                  <p className="text-sm font-semibold text-slate-950">{event.event_type.replace(/_/g, " ")}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{formatTimestamp(event.created_at)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Password requests</h2>
            <div className="mt-6 space-y-4">
              {data.passwordRequests.length ? (
                data.passwordRequests.map((request) => (
                  <div key={request.id} className="rounded-[1.25rem] border border-slate-100 p-5">
                    <p className="text-sm font-semibold text-slate-950">{request.request_status}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{formatTimestamp(request.created_at)}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-slate-200 p-5 text-sm text-slate-500">
                  No password rotation requests recorded yet.
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { requestJson, useLiveApi } from "@/components/portal/use-live-api";

type NotificationPreference = {
  email_enabled: boolean;
  id: string;
  in_app_enabled: boolean;
  preference_key: string;
  sms_enabled: boolean;
};

type ClientSettingsPayload = {
  notificationPreferences: NotificationPreference[];
  passwordRequests: Array<{
    created_at: string;
    id: string;
    request_status: string;
  }>;
  preferences: {
    dateFormat: string | null;
    defaultView: string;
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

const EMPTY_PAYLOAD: ClientSettingsPayload = {
  notificationPreferences: [],
  passwordRequests: [],
  preferences: {
    dateFormat: "dd MMM yyyy",
    defaultView: "Programme Overview",
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

export default function ClientHubSettingsPage() {
  const searchParams = useSearchParams();
  const { data, error, refresh } = useLiveApi<ClientSettingsPayload>("/api/client/settings", EMPTY_PAYLOAD);
  const [notice, setNotice] = useState<Notice>(null);
  const [preferencesForm, setPreferencesForm] = useState({
    dateFormat: "dd MMM yyyy",
    defaultView: "Programme Overview",
    locale: "en-GB",
    theme: "light",
    timezone: "Europe/London",
  });
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([]);
  const [passwordForm, setPasswordForm] = useState({
    confirmPassword: "",
    currentPassword: "",
    newPassword: "",
  });
  const [newEmail, setNewEmail] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    confirmPassword: false,
    currentPassword: false,
    newPassword: false,
  });
  const [isEmailChangePending, setIsEmailChangePending] = useState(false);

  useEffect(() => {
    setPreferencesForm({
      dateFormat: data.preferences.dateFormat ?? "dd MMM yyyy",
      defaultView: data.preferences.defaultView,
      locale: data.preferences.locale ?? "en-GB",
      theme: data.preferences.theme ?? "light",
      timezone: data.preferences.timezone ?? "Europe/London",
    });
    setNotificationPreferences(data.notificationPreferences);
  }, [data.notificationPreferences, data.preferences.dateFormat, data.preferences.defaultView, data.preferences.locale, data.preferences.theme, data.preferences.timezone]);

  useEffect(() => {
    if (searchParams.get("notice") === "email-updated") {
      setNotice({ message: "Email updated successfully.", tone: "success" });
    }
  }, [searchParams]);

  async function saveSettings() {
    try {
      await requestJson("/api/client/settings", {
        body: JSON.stringify({
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

  async function requestPasswordReset() {
    try {
      const response = await requestJson<{ message: string }>("/api/client/settings", {
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

  async function requestEmailChange() {
    try {
      setIsEmailChangePending(true);
      const response = await requestJson<{ message: string }>("/api/auth/change-email", {
        body: JSON.stringify({ newEmail }),
        method: "PATCH",
      });
      setNotice({ message: response.message, tone: "success" });
      setNewEmail("");
    } catch (requestError) {
      setNotice({
        message: requestError instanceof Error ? requestError.message : "Unable to start email change.",
        tone: "error",
      });
    } finally {
      setIsEmailChangePending(false);
    }
  }

  return (
    <div className="space-y-10 px-6 py-8 lg:px-10 lg:py-12">
      <section className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8e6200]">Preferences</p>
        <h1 className="mt-3 text-4xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)] sm:text-5xl">
          Settings
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Notification choices, workspace defaults, and password reset requests are now stored directly in
          the client portal data layer.
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

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <article className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
            <div className="border-b border-[#f0e7e3] pb-6">
              <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
                Notification settings
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Choose how you want to receive programme and support updates.
              </p>
            </div>
            <div className="mt-8 space-y-4">
              {notificationPreferences.map((preference) => (
                <div key={preference.id} className="rounded-[1.5rem] border border-[#ede2dd] bg-[#faf7f5] p-5">
                  <p className="text-sm font-bold text-[#2b2929]">{preference.preference_key.replace(/_/g, " ")}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={preference.in_app_enabled}
                        onChange={(event) => {
                          setNotificationPreferences((current) =>
                            current.map((item) =>
                              item.id === preference.id ? { ...item, in_app_enabled: event.target.checked } : item,
                            ),
                          );
                        }}
                      />
                      In-app
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={preference.email_enabled}
                        onChange={(event) => {
                          setNotificationPreferences((current) =>
                            current.map((item) =>
                              item.id === preference.id ? { ...item, email_enabled: event.target.checked } : item,
                            ),
                          );
                        }}
                      />
                      Email
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={preference.sms_enabled}
                        onChange={(event) => {
                          setNotificationPreferences((current) =>
                            current.map((item) =>
                              item.id === preference.id ? { ...item, sms_enabled: event.target.checked } : item,
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

          <article className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
            <div className="border-b border-[#f0e7e3] pb-6">
              <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
                Workspace defaults
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Set the preferred context for your daily portal use.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Theme</span>
                <select
                  value={preferencesForm.theme}
                  onChange={(event) => {
                    setPreferencesForm((current) => ({ ...current, theme: event.target.value }));
                  }}
                  className="rounded-2xl border border-[#ddd1cc] bg-[#faf7f5] px-4 py-3 text-sm outline-none"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Timezone</span>
                <input
                  value={preferencesForm.timezone}
                  onChange={(event) => {
                    setPreferencesForm((current) => ({ ...current, timezone: event.target.value }));
                  }}
                  className="rounded-2xl border border-[#ddd1cc] bg-[#faf7f5] px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Locale</span>
                <input
                  value={preferencesForm.locale}
                  onChange={(event) => {
                    setPreferencesForm((current) => ({ ...current, locale: event.target.value }));
                  }}
                  className="rounded-2xl border border-[#ddd1cc] bg-[#faf7f5] px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Date format</span>
                <input
                  value={preferencesForm.dateFormat}
                  onChange={(event) => {
                    setPreferencesForm((current) => ({ ...current, dateFormat: event.target.value }));
                  }}
                  className="rounded-2xl border border-[#ddd1cc] bg-[#faf7f5] px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Default view</span>
                <input
                  value={preferencesForm.defaultView}
                  onChange={(event) => {
                    setPreferencesForm((current) => ({ ...current, defaultView: event.target.value }));
                  }}
                  className="rounded-2xl border border-[#ddd1cc] bg-[#faf7f5] px-4 py-3 text-sm outline-none"
                />
              </label>
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    void saveSettings();
                  }}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#6f0712]"
                >
                  Save settings
                </button>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
            <div className="border-b border-[#f0e7e3] pb-6">
              <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
                Change email
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Send a confirmation link to your new email address and complete the change securely from your inbox.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">New email address</span>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="rounded-2xl border border-[#ddd1cc] bg-[#faf7f5] px-4 py-3 text-sm outline-none"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  void requestEmailChange();
                }}
                disabled={isEmailChangePending}
                className="inline-flex items-center justify-center rounded-2xl bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#6f0712] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isEmailChangePending ? "Sending..." : "Change email"}
              </button>
            </div>
          </article>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] bg-[#ece7e3] p-8">
            <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              Password reset request
            </h2>
            <div className="mt-6 space-y-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Current password</span>
                <div className="relative">
                  <input
                    type={showPasswords.currentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(event) => {
                      setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }));
                    }}
                    className="rounded-2xl border border-[#ddd1cc] bg-white px-4 py-3 pr-16 text-sm outline-none transition focus:border-[#c87e75]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((current) => ({ ...current, currentPassword: !current.currentPassword }))
                    }
                    className="absolute inset-y-0 right-0 inline-flex items-center px-4 text-xs font-semibold text-slate-500 hover:text-[#8a0917]"
                    aria-label={showPasswords.currentPassword ? "Hide current password" : "Show current password"}
                  >
                    {showPasswords.currentPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">New password</span>
                <div className="relative">
                  <input
                    type={showPasswords.newPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(event) => {
                      setPasswordForm((current) => ({ ...current, newPassword: event.target.value }));
                    }}
                    className="rounded-2xl border border-[#ddd1cc] bg-white px-4 py-3 pr-16 text-sm outline-none transition focus:border-[#c87e75]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((current) => ({ ...current, newPassword: !current.newPassword }))}
                    className="absolute inset-y-0 right-0 inline-flex items-center px-4 text-xs font-semibold text-slate-500 hover:text-[#8a0917]"
                    aria-label={showPasswords.newPassword ? "Hide new password" : "Show new password"}
                  >
                    {showPasswords.newPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Confirm password</span>
                <div className="relative">
                  <input
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(event) => {
                      setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }));
                    }}
                    className="rounded-2xl border border-[#ddd1cc] bg-white px-4 py-3 pr-16 text-sm outline-none transition focus:border-[#c87e75]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((current) => ({ ...current, confirmPassword: !current.confirmPassword }))
                    }
                    className="absolute inset-y-0 right-0 inline-flex items-center px-4 text-xs font-semibold text-slate-500 hover:text-[#8a0917]"
                    aria-label={showPasswords.confirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showPasswords.confirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
              <button
                type="button"
                onClick={() => {
                  void requestPasswordReset();
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#6f0712]"
              >
                Record password request
              </button>
              <p className="text-xs leading-6 text-slate-500">
                Need the actual recovery email now? Use <span className="font-semibold text-slate-700">Forgot password</span> on the sign-in screen.
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
            <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              Security activity
            </h2>
            <div className="mt-6 space-y-4">
              {data.securityEvents.map((event) => (
                <div key={event.id} className="rounded-[1.5rem] border border-[#ede2dd] p-5">
                  <p className="text-sm font-bold text-[#2b2929]">{event.event_type.replace(/_/g, " ")}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{formatTimestamp(event.created_at)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
            <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              Password requests
            </h2>
            <div className="mt-6 space-y-4">
              {data.passwordRequests.length ? (
                data.passwordRequests.map((request) => (
                  <div key={request.id} className="rounded-[1.5rem] border border-[#ede2dd] p-5">
                    <p className="text-sm font-bold text-[#2b2929]">{request.request_status}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{formatTimestamp(request.created_at)}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-[#ede2dd] p-5 text-sm text-slate-500">
                  No password reset requests recorded yet.
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

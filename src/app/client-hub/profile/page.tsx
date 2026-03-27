"use client";

import { useEffect, useState } from "react";

import { requestJson, useLiveApi } from "@/components/portal/use-live-api";

type ClientProfilePayload = {
  account: {
    email: string;
    full_name: string;
    id: string;
    phone: string | null;
    role_title: string | null;
  };
  profile: {
    baseLocation: string;
    clientName: string;
    companyName: string;
    defaultView: string;
    learningGoals: string[];
  };
  securityEvents: Array<{
    created_at: string;
    event_type: string;
    id: string;
  }>;
};

type Notice = { message: string; tone: "error" | "success" } | null;

const EMPTY_PAYLOAD: ClientProfilePayload = {
  account: {
    email: "",
    full_name: "",
    id: "",
    phone: "",
    role_title: "",
  },
  profile: {
    baseLocation: "UK operations",
    clientName: "Client workspace",
    companyName: "Client workspace",
    defaultView: "Programme Overview",
    learningGoals: [],
  },
  securityEvents: [],
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("") || "CW";
}

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ClientHubProfilePage() {
  const { data, error, refresh } = useLiveApi<ClientProfilePayload>("/api/client/profile", EMPTY_PAYLOAD);
  const [notice, setNotice] = useState<Notice>(null);
  const [form, setForm] = useState({
    baseLocation: "",
    companyName: "",
    defaultView: "",
    fullName: "",
    learningGoals: "",
    phone: "",
    roleTitle: "",
  });

  useEffect(() => {
    setForm({
      baseLocation: data.profile.baseLocation,
      companyName: data.profile.companyName,
      defaultView: data.profile.defaultView,
      fullName: data.account.full_name,
      learningGoals: data.profile.learningGoals.join("\n"),
      phone: data.account.phone ?? "",
      roleTitle: data.account.role_title ?? "",
    });
  }, [data.account.full_name, data.account.phone, data.account.role_title, data.profile.baseLocation, data.profile.companyName, data.profile.defaultView, data.profile.learningGoals]);

  async function saveProfile() {
    try {
      await requestJson("/api/client/profile", {
        body: JSON.stringify(form),
        method: "PATCH",
      });
      setNotice({ message: "Profile changes saved.", tone: "success" });
      await refresh();
    } catch (saveError) {
      setNotice({
        message: saveError instanceof Error ? saveError.message : "Unable to save profile.",
        tone: "error",
      });
    }
  }

  return (
    <div className="space-y-10 px-6 py-8 lg:px-10 lg:py-12">
      <section className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8e6200]">Account overview</p>
        <h1 className="mt-3 text-4xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)] sm:text-5xl">
          Profile
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Your workspace profile is now linked to the live portal tables, so updates here change the
          active client account and company context used across the dashboard.
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

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-6">
          <section className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#eaded9] bg-[#8a0917] text-3xl font-bold text-white">
                {getInitials(data.account.full_name)}
              </div>
              <h2 className="mt-5 text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
                {data.account.full_name}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {data.account.role_title ?? "Portal User"} • {data.profile.companyName}
              </p>
            </div>

            <div className="mt-8 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Email</span>
                <span className="font-semibold text-[#2b2929]">{data.account.email}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Phone</span>
                <span className="font-semibold text-[#2b2929]">{data.account.phone ?? "Not set"}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Location</span>
                <span className="font-semibold text-[#2b2929]">{data.profile.baseLocation}</span>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-[#ece7e3] p-8">
            <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              Current learning goals
            </h2>
            <div className="mt-6 space-y-3">
              {data.profile.learningGoals.map((goal) => (
                <div key={goal} className="rounded-[1.5rem] bg-white px-4 py-4 text-sm leading-6 text-slate-600">
                  {goal}
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
          <div className="border-b border-[#f0e7e3] pb-6">
            <h2 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              Edit profile
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Update your contact details, workspace context, and learning goals.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Full name</span>
              <input
                value={form.fullName}
                onChange={(event) => {
                  setForm((current) => ({ ...current, fullName: event.target.value }));
                }}
                className="rounded-2xl border border-[#ddd1cc] bg-[#faf7f5] px-4 py-3 text-sm outline-none transition focus:border-[#c87e75]"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Role</span>
              <input
                value={form.roleTitle}
                onChange={(event) => {
                  setForm((current) => ({ ...current, roleTitle: event.target.value }));
                }}
                className="rounded-2xl border border-[#ddd1cc] bg-[#faf7f5] px-4 py-3 text-sm outline-none transition focus:border-[#c87e75]"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input
                readOnly
                value={data.account.email}
                className="rounded-2xl border border-[#ddd1cc] bg-[#f1ece9] px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Phone</span>
              <input
                value={form.phone}
                onChange={(event) => {
                  setForm((current) => ({ ...current, phone: event.target.value }));
                }}
                className="rounded-2xl border border-[#ddd1cc] bg-[#faf7f5] px-4 py-3 text-sm outline-none transition focus:border-[#c87e75]"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Company</span>
              <input
                value={form.companyName}
                onChange={(event) => {
                  setForm((current) => ({ ...current, companyName: event.target.value }));
                }}
                className="rounded-2xl border border-[#ddd1cc] bg-[#faf7f5] px-4 py-3 text-sm outline-none transition focus:border-[#c87e75]"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Base location</span>
              <input
                value={form.baseLocation}
                onChange={(event) => {
                  setForm((current) => ({ ...current, baseLocation: event.target.value }));
                }}
                className="rounded-2xl border border-[#ddd1cc] bg-[#faf7f5] px-4 py-3 text-sm outline-none transition focus:border-[#c87e75]"
              />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Programme goals</span>
              <textarea
                rows={5}
                value={form.learningGoals}
                onChange={(event) => {
                  setForm((current) => ({ ...current, learningGoals: event.target.value }));
                }}
                className="rounded-[1.5rem] border border-[#ddd1cc] bg-[#faf7f5] px-4 py-3 text-sm outline-none transition focus:border-[#c87e75]"
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => {
                  void saveProfile();
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#6f0712]"
              >
                Save profile changes
              </button>
            </div>
          </div>

          <div className="mt-10 border-t border-[#f0e7e3] pt-8">
            <h3 className="text-xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              Recent security activity
            </h3>
            <div className="mt-5 space-y-3">
              {data.securityEvents.length ? (
                data.securityEvents.map((event) => (
                  <div key={event.id} className="rounded-[1.25rem] border border-[#ede2dd] bg-[#faf7f5] px-4 py-4 text-sm text-slate-600">
                    {event.event_type.replace(/_/g, " ")} • {formatTimestamp(event.created_at)}
                  </div>
                ))
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-[#ede2dd] bg-[#faf7f5] px-4 py-4 text-sm text-slate-500">
                  No security events recorded yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

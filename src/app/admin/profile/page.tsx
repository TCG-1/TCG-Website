"use client";

import { useEffect, useState } from "react";

import { requestJson, useLiveApi } from "@/components/portal/use-live-api";

type AdminProfilePayload = {
  account: {
    email: string;
    full_name: string;
    id: string;
    job_title: string | null;
    phone: string | null;
  };
  profile: {
    bio: string;
    focusAreas: string[];
    locationLabel: string;
  };
  securityEvents: Array<{
    created_at: string;
    event_type: string;
    id: string;
  }>;
  sessions: Array<{
    created_at: string;
    id: string;
    session_status: string;
  }>;
};

type Notice = { message: string; tone: "error" | "success" } | null;

const EMPTY_PAYLOAD: AdminProfilePayload = {
  account: {
    email: "",
    full_name: "",
    id: "",
    job_title: "",
    phone: "",
  },
  profile: {
    bio: "",
    focusAreas: [],
    locationLabel: "UK-wide on-site delivery",
  },
  securityEvents: [],
  sessions: [],
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("") || "AD";
}

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminProfilePage() {
  const { data, error, refresh } = useLiveApi<AdminProfilePayload>("/api/admin/profile", EMPTY_PAYLOAD);
  const [notice, setNotice] = useState<Notice>(null);
  const [form, setForm] = useState({
    bio: "",
    focusAreas: "",
    fullName: "",
    jobTitle: "",
    locationLabel: "",
    phone: "",
  });

  useEffect(() => {
    setForm({
      bio: data.profile.bio,
      focusAreas: data.profile.focusAreas.join("\n"),
      fullName: data.account.full_name,
      jobTitle: data.account.job_title ?? "",
      locationLabel: data.profile.locationLabel,
      phone: data.account.phone ?? "",
    });
  }, [data.account.full_name, data.account.job_title, data.account.phone, data.profile.bio, data.profile.focusAreas, data.profile.locationLabel]);

  async function saveProfile() {
    try {
      await requestJson("/api/admin/profile", {
        body: JSON.stringify(form),
        method: "PATCH",
      });
      setNotice({ message: "Admin profile saved.", tone: "success" });
      await refresh();
    } catch (saveError) {
      setNotice({
        message: saveError instanceof Error ? saveError.message : "Unable to save profile.",
        tone: "error",
      });
    }
  }

  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a0917]">Account details</p>
        <h1 className="mt-4 text-[clamp(2.2rem,4vw,3rem)] font-light leading-[1.05] tracking-[-0.05em] text-slate-950">
          Admin profile
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Keep admin identity, operational ownership, and security context up to date in the live portal.
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

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-6">
          <section className="rounded-[1.75rem] border border-black/5 bg-white p-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#8a0917] text-2xl font-bold text-white">
              {getInitials(data.account.full_name)}
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{data.account.full_name}</h2>
            <p className="mt-2 text-sm text-slate-500">{data.account.job_title ?? "Platform Operations Lead"}</p>
            <div className="mt-8 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Email</span>
                <span className="font-semibold text-slate-950">{data.account.email}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Phone</span>
                <span className="font-semibold text-slate-950">{data.account.phone ?? "Not set"}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Location</span>
                <span className="font-semibold text-slate-950">{data.profile.locationLabel}</span>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-black/5 bg-[#ece7df] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Focus areas</h2>
            <div className="mt-6 space-y-3">
              {data.profile.focusAreas.map((area) => (
                <div key={area} className="rounded-[1.25rem] bg-white px-4 py-4 text-sm text-slate-600">
                  {area}
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="border-b border-slate-100 pb-6">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Edit profile</h2>
            <p className="mt-2 text-sm text-slate-500">
              Update administrative identity and operational ownership details.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-600">Full name</span>
              <input
                value={form.fullName}
                onChange={(event) => {
                  setForm((current) => ({ ...current, fullName: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-600">Role</span>
              <input
                value={form.jobTitle}
                onChange={(event) => {
                  setForm((current) => ({ ...current, jobTitle: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-600">Email</span>
              <input
                readOnly
                value={data.account.email}
                className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-600">Phone</span>
              <input
                value={form.phone}
                onChange={(event) => {
                  setForm((current) => ({ ...current, phone: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-600">Location label</span>
              <input
                value={form.locationLabel}
                onChange={(event) => {
                  setForm((current) => ({ ...current, locationLabel: event.target.value }));
                }}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-600">Bio</span>
              <textarea
                rows={5}
                value={form.bio}
                onChange={(event) => {
                  setForm((current) => ({ ...current, bio: event.target.value }));
                }}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-600">Focus areas</span>
              <textarea
                rows={5}
                value={form.focusAreas}
                onChange={(event) => {
                  setForm((current) => ({ ...current, focusAreas: event.target.value }));
                }}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => {
                  void saveProfile();
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#690711]"
              >
                Save profile
              </button>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-100 pt-8">
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">Recent security activity</h3>
            <div className="mt-5 space-y-3">
              {data.securityEvents.length ? (
                data.securityEvents.map((event) => (
                  <div key={event.id} className="rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                    {event.event_type.replace(/_/g, " ")} • {formatTimestamp(event.created_at)}
                  </div>
                ))
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
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

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

import { createClient } from "@/lib/supabase/client";

type AdminNavItem = {
  href: string;
  label: string;
  subtitle: string;
  icon:
    | "dashboard"
    | "calendar"
    | "blog"
    | "leads"
    | "client-hub"
    | "jobs"
    | "applications"
    | "notifications"
    | "documents"
    | "support"
    | "activity"
    | "profile"
    | "settings";
};

const primaryNavItems: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    subtitle: "Training operations overview and risk control",
    icon: "dashboard",
  },
  {
    href: "/admin/training",
    label: "Programmes",
    subtitle: "Cohorts, pathways, syllabus, and sponsor setup",
    icon: "client-hub",
  },
  {
    href: "/admin/sessions",
    label: "Sessions",
    subtitle: "Upcoming delivery, facilitators, attendance, and readiness",
    icon: "calendar",
  },
  {
    href: "/admin/learners",
    label: "Learners",
    subtitle: "Rosters, engagement, at-risk learners, and coaching actions",
    icon: "leads",
  },
  {
    href: "/admin/assessments",
    label: "Assessments",
    subtitle: "Exam windows, practical tasks, grading, and feedback release",
    icon: "applications",
  },
  {
    href: "/admin/resources",
    label: "Resources",
    subtitle: "Workbooks, facilitator packs, revision guides, and releases",
    icon: "documents",
  },
  {
    href: "/admin/progress",
    label: "Progress",
    subtitle: "Attendance, completion, certification, and training health",
    icon: "activity",
  },
];

const secondaryNavItems: AdminNavItem[] = [
  {
    href: "/admin/blog",
    label: "Blog",
    subtitle: "Website articles, categories, and publishing",
    icon: "blog",
  },
  {
    href: "/admin/leads",
    label: "Leads",
    subtitle: "Discovery calls, assessments, and inbound enquiries",
    icon: "dashboard",
  },
  {
    href: "/admin/client-hub",
    label: "Portal Content",
    subtitle: "Client-facing portal copy, hero content, and dashboard editor",
    icon: "client-hub",
  },
  {
    href: "/admin/jobs",
    label: "Jobs",
    subtitle: "Role creation and vacancy management",
    icon: "jobs",
  },
  {
    href: "/admin/applications",
    label: "Applications",
    subtitle: "Candidate review and attachment workflow",
    icon: "applications",
  },
  {
    href: "/admin/notifications",
    label: "Notifications",
    subtitle: "Alerts, escalations, and delivery preferences",
    icon: "notifications",
  },
  {
    href: "/admin/documents",
    label: "Documents",
    subtitle: "Collections, access, and publication control",
    icon: "documents",
  },
  {
    href: "/admin/support",
    label: "Support",
    subtitle: "Client tickets, triage, and response workflow",
    icon: "support",
  },
  {
    href: "/admin/activity",
    label: "Activity",
    subtitle: "Platform timeline, audits, and operational pulse",
    icon: "activity",
  },
  {
    href: "/admin/profile",
    label: "Profile",
    subtitle: "Admin details, sessions, and responsibilities",
    icon: "profile",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    subtitle: "Security, defaults, and workflow automation",
    icon: "settings",
  },
];

const allNavItems = [...primaryNavItems, ...secondaryNavItems];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminNavIcon({
  icon,
  active,
}: {
  icon: AdminNavItem["icon"];
  active: boolean;
}) {
  const className = active ? "text-[#8a0917]" : "text-slate-400";

  switch (icon) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden="true">
          <path d="M4 5h7v6H4zM13 5h7v4h-7zM13 11h7v8h-7zM4 13h7v6H4z" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M16 3v4M8 3v4M3 10h18" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "blog":
      return (
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden="true">
          <path d="M7 4h7l5 5v11H7z" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M14 4v5h5M10 13h6M10 17h6M10 9h2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "leads":
      return (
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden="true">
          <path
            d="M9 11a3 3 0 100-6 3 3 0 000 6zM17 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M4 19c1.3-3.3 4-4.8 6.3-4.8S15.3 15.7 16.6 19M14.8 18.5c.8-2 2.4-3 4.2-3 1 0 2.1.3 3 .9"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "client-hub":
      return (
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden="true">
          <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M4 10h16M10 10v9" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "jobs":
      return (
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden="true">
          <path
            d="M8 7V5.5A1.5 1.5 0 019.5 4h5A1.5 1.5 0 0116 5.5V7M4 8h16v9.5A1.5 1.5 0 0118.5 19h-13A1.5 1.5 0 014 17.5z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M4 11.5c2.7 1.2 5.4 1.8 8 1.8s5.3-.6 8-1.8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "applications":
      return (
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden="true">
          <path
            d="M6 5h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M7 9l5 4 5-4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "notifications":
      return (
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden="true">
          <path d="M6 9a6 6 0 1 1 12 0v4l2 2H4l2-2z" stroke="currentColor" strokeWidth="1.7" />
          <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "documents":
      return (
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden="true">
          <path d="M7 4h8l4 4v11a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.7" />
          <path d="M15 4v4h4M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "support":
      return (
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden="true">
          <path d="M5 6.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-5 3v-3H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "activity":
      return (
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden="true">
          <path d="M4 13h4l2-5 4 10 2-5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "profile":
      return (
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden="true">
          <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M5 19c1.5-3.6 4.5-5.4 7-5.4s5.5 1.8 7 5.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
        </svg>
      );
  }
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "AD";
}

export function AdminShell({
  children,
  userName,
  userAvatarUrl,
}: {
  children: React.ReactNode;
  userName: string;
  userAvatarUrl: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const hrefs = Array.from(new Set(allNavItems.map((item) => item.href)));

    for (const href of hrefs) {
      router.prefetch(href);
    }
  }, [router]);

  const currentItem = allNavItems.find((item) => isActivePath(pathname, item.href)) ?? allNavItems[0];
  const initials = getInitials(userName);

  function handleLogout() {
    startTransition(async () => {
      await Promise.allSettled([
        fetch("/api/admin/session", { method: "DELETE" }),
        fetch("/api/auth/session", { method: "DELETE" }),
        supabase.auth.signOut(),
      ]);

      router.replace("/sign-in");
      router.refresh();
    });
  }

  return (
    <section className="min-h-screen bg-[#f5f2ee] text-slate-950">
      <aside className="hidden bg-slate-950 px-5 py-8 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-80 lg:flex-col">
        <div className="px-3">
          <h1 className="text-[1.9rem] font-light tracking-[-0.04em] text-white">Tacklers Consulting</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.32em] text-slate-400">
            Administrative Portal
          </p>
        </div>

        <nav className="mt-10 flex-1 overflow-y-auto px-1">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.26em] text-slate-500">
            Core Workspaces
          </p>
          <div className="mt-3 space-y-1">
            {primaryNavItems.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-4 rounded-r-2xl border-l-4 px-4 py-3 transition-all duration-300 ${
                    active
                      ? "border-[#8a0917] bg-[#8a0917]/22 text-white"
                      : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <AdminNavIcon icon={item.icon} active={active} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight">{item.label}</p>
                    <p
                      className={`mt-1 text-xs leading-5 ${
                        active ? "text-white/70" : "text-slate-500 group-hover:text-white/60"
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="mt-8 px-4 text-[10px] font-bold uppercase tracking-[0.26em] text-slate-500">
            Website, Hiring & Platform
          </p>
          <div className="mt-3 space-y-1">
            {secondaryNavItems.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-4 rounded-r-2xl border-l-4 px-4 py-3 transition-all duration-300 ${
                    active
                      ? "border-[#8a0917] bg-[#8a0917]/22 text-white"
                      : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <AdminNavIcon icon={item.icon} active={active} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight">{item.label}</p>
                    <p
                      className={`mt-1 text-xs leading-5 ${
                        active ? "text-white/70" : "text-slate-500 group-hover:text-white/60"
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-[10px] uppercase tracking-[0.26em] text-slate-400">Signed in as</p>
          <div className="mt-4 flex items-center gap-3">
            {userAvatarUrl ? (
              <div className="h-11 w-11 overflow-hidden rounded-full border border-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={userAvatarUrl}
                  alt={`${userName} profile image`}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8a0917] text-sm font-bold text-white">
                {initials}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-white">{userName}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Secure session</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
            >
              View website
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-full bg-[#8a0917] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#690711]"
            >
              {isPending ? "Logging out..." : "Log out"}
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-80">
        <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur-xl">
          <div className="px-4 py-4 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8a0917]">
                      Tacklers Admin
                    </p>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                      {currentItem.label}
                    </h2>
                  </div>
                  <div className="hidden h-10 w-px bg-slate-200 md:block" />
                  <p className="hidden max-w-xl text-sm text-slate-500 md:block">
                    {currentItem.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="relative hidden md:block">
                    <span className="sr-only">Search admin pages</span>
                    <svg
                      viewBox="0 0 24 24"
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.7" />
                      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search admin surfaces..."
                      className="w-64 rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#8a0917]/30 focus:bg-white"
                    />
                  </label>
                  <span className="rounded-full bg-[#8a0917]/8 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a0917]">
                    Secure admin session
                  </span>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
                {allNavItems.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                        active
                          ? "bg-[#8a0917] text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-[#8a0917]/20 hover:text-[#8a0917]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-88px)] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

import { DashboardIcon } from "@/components/client-hub/dashboard-icon";
import type { ClientHubContent, DashboardIconName } from "@/lib/client-hub";
import { createClient } from "@/lib/supabase/client";

type WorkspaceItem = {
  href: string;
  label: string;
  subtitle: string;
  icon: DashboardIconName;
};

const learningItems: WorkspaceItem[] = [
  {
    href: "/client-hub",
    label: "Training Overview",
    subtitle: "What is next, what is due, and where the cohort stands",
    icon: "dashboard",
  },
  {
    href: "/client-hub/schedule",
    label: "Session Calendar",
    subtitle: "Live workshops, coaching, timing, and preparation",
    icon: "calendar",
  },
  {
    href: "/client-hub/syllabus",
    label: "Syllabus",
    subtitle: "Modules, learning outcomes, and pathway coverage",
    icon: "book",
  },
  {
    href: "/client-hub/assessments",
    label: "Exams & Tasks",
    subtitle: "Knowledge checks, practical work, and feedback",
    icon: "check",
  },
  {
    href: "/client-hub/resources",
    label: "Resources",
    subtitle: "Workbooks, templates, revision guides, and packs",
    icon: "document",
  },
  {
    href: "/client-hub/progress",
    label: "Progress",
    subtitle: "Attendance, confidence, completion, and readiness",
    icon: "chart",
  },
];

const workspaceItems: WorkspaceItem[] = [
  {
    href: "/client-hub/notifications",
    label: "Notifications",
    subtitle: "Announcements, reminders, and release alerts",
    icon: "bell",
  },
  {
    href: "/client-hub/documents",
    label: "Documents",
    subtitle: "Shared non-learning files and governance packs",
    icon: "document",
  },
  {
    href: "/client-hub/support",
    label: "Support",
    subtitle: "Questions, ticket updates, and help requests",
    icon: "message",
  },
  {
    href: "/client-hub/profile",
    label: "Profile",
    subtitle: "Sponsor details and team context",
    icon: "user",
  },
  {
    href: "/client-hub/settings",
    label: "Settings",
    subtitle: "Preferences and security",
    icon: "shield",
  },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getDashboardHref(pathname: string, section: string) {
  if (section === "top") {
    return "/client-hub";
  }

  return pathname === "/client-hub" ? `#${section}` : `/client-hub#${section}`;
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return parts || "TC";
}

export function ClientHubShell({
  children,
  content,
  userDisplayName,
  userEmail,
  userAvatarUrl,
}: {
  children: React.ReactNode;
  content: ClientHubContent;
  userDisplayName: string;
  userEmail: string;
  userAvatarUrl: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isLoggingOut, startTransition] = useTransition();

  useEffect(() => {
    const hrefs = Array.from(
      new Set([...learningItems, ...workspaceItems].map((item) => item.href)),
    );

    for (const href of hrefs) {
      router.prefetch(href);
    }
  }, [router]);

  const currentArea =
    [...learningItems, ...workspaceItems].find((item) => isActivePath(pathname, item.href)) ?? learningItems[0];
  const userInitials = getInitials(userDisplayName);

  function handleLogout() {
    startTransition(async () => {
      await Promise.allSettled([
        supabase.auth.signOut(),
        fetch("/api/auth/session", { method: "DELETE" }),
      ]);

      router.replace("/sign-in");
      router.refresh();
    });
  }

  return (
    <div
      id="top"
      className="min-h-screen bg-[#f7f6f3] text-[#1f1d1d] [font-family:var(--font-client-body)]"
    >
      <aside className="border-b border-[#e8ddd9] bg-[#f4f1ee] px-6 py-6 lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen lg:w-80 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-7 lg:py-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#62000b_0%,#8a0917_100%)] text-white">
            <DashboardIcon name="architecture" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#7d0b16] [font-family:var(--font-client-headline)]">
              Tacklers Training Hub
            </p>
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              Lean capability journey
            </p>
          </div>
        </div>

        <div className="mt-10">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
            Learning Journey
          </p>
          <div className="mt-3 space-y-2">
            {learningItems.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-white text-[#7d0b16] shadow-sm ring-1 ring-[#ead7d3]"
                      : "text-slate-500 hover:bg-white hover:text-[#7d0b16]"
                  }`}
                >
                  <DashboardIcon name={item.icon} className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
            Portal Tools
          </p>
          <div className="mt-3 space-y-2">
            {workspaceItems.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    active
                      ? "bg-white text-[#7d0b16] shadow-sm ring-1 ring-[#ead7d3]"
                      : "text-slate-500 hover:bg-white hover:text-[#7d0b16]"
                  }`}
                >
                  <DashboardIcon name={item.icon} className="h-5 w-5" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400 group-hover:text-[#7d0b16]/70">
                      {item.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 border-t border-[#e8ddd9] pt-6">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
            Quick Links
          </p>
          <div className="mt-3 space-y-2">
            {[
              { href: "/client-hub/notifications", label: "Notifications", icon: "bell" as const },
              { href: "/client-hub/support", label: "Support", icon: "message" as const },
              { href: "/client-hub/settings", label: "Settings", icon: "settings" as const },
              { href: "#logout", label: "Logout", icon: "logout" as const },
            ].map((item) =>
              item.icon === "logout" ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-[#7d0b16]"
                >
                  <DashboardIcon name={item.icon} className="h-5 w-5" />
                  <span>{isLoggingOut ? "Logging out..." : item.label}</span>
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-[#7d0b16]"
                >
                  <DashboardIcon name={item.icon} className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ),
            )}
          </div>

          <Link
            href="/client-hub/support"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#62000b_0%,#8a0917_100%)] px-4 py-3 text-xs font-bold uppercase tracking-[0.24em] text-white transition hover:opacity-90"
          >
            Ask for coaching support
          </Link>

          <div className="mt-6 rounded-[1.5rem] border border-[#e6dad5] bg-white/70 p-5">
            <div className="flex items-center gap-3">
              {userAvatarUrl ? (
                <div className="h-12 w-12 overflow-hidden rounded-full border border-[#eaded9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={userAvatarUrl}
                    alt={`${userDisplayName} profile image`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#eaded9] bg-[#8a0917] text-sm font-bold text-white">
                  {userInitials}
                </div>
              )}
              <div>
              <p className="text-sm font-semibold text-[#2b2929]">{userDisplayName}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{userEmail}</p>
            </div>
          </div>
            <Link
              href="/client-hub/profile"
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8e6200] transition hover:gap-3"
            >
              Manage profile
              <DashboardIcon name="arrow" className="h-4 w-4" />
            </Link>

            <div className="mt-5 grid gap-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[#d6cac5] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#7d0b16] transition hover:bg-white"
              >
                Visit website
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center justify-center rounded-full bg-[#8a0917] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#690711] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-80">
        <header className="sticky top-0 z-30 border-b border-[#ede3df] bg-[#faf8f6]/90 px-6 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#8e6200]">
                Lean Training Hub
              </p>
              <div className="mt-1 text-xl font-light tracking-tight text-[#7d0b16] [font-family:var(--font-client-headline)]">
                {currentArea.label}
              </div>
              <p className="mt-1 text-sm text-slate-500">{currentArea.subtitle}</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="relative block">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <DashboardIcon name="search" className="h-4 w-4" />
                </span>
                <input
                  className="w-full rounded-full border border-[#e3d9d4] bg-[#f2eeeb] py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[#c87e75] sm:w-72"
                  placeholder="Search modules, sessions, resources..."
                  type="text"
                />
              </label>

              <div className="flex items-center gap-3">
                <Link
                  href="/client-hub/notifications"
                  className={`relative rounded-full p-2 transition ${
                    isActivePath(pathname, "/client-hub/notifications")
                      ? "bg-white text-[#7d0b16]"
                      : "text-slate-500 hover:bg-white hover:text-[#7d0b16]"
                  }`}
                >
                  <DashboardIcon name="bell" className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d8a400]" />
                </Link>
                <Link
                  href="/client-hub/settings"
                  className={`rounded-full p-2 transition ${
                    isActivePath(pathname, "/client-hub/settings")
                      ? "bg-white text-[#7d0b16]"
                      : "text-slate-500 hover:bg-white hover:text-[#7d0b16]"
                  }`}
                >
                  <DashboardIcon name="settings" className="h-5 w-5" />
                </Link>
                <Link
                  href="/client-hub/profile"
                  className={`h-10 w-10 overflow-hidden rounded-full border transition ${
                    isActivePath(pathname, "/client-hub/profile")
                      ? "border-[#c87e75] ring-2 ring-[#ead7d3]"
                      : "border-[#eaded9]"
                  }`}
                >
                  {userAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={userAvatarUrl}
                      alt={`${userDisplayName} profile image`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-[#8a0917] text-xs font-bold text-white">
                      {userInitials}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {children}

        <footer className="flex flex-col gap-4 border-t border-[#ede3df] px-6 py-8 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>© 2026 Tacklers Consulting Group • Lean training delivery workspace</div>
          <div className="flex flex-wrap gap-5">
            {content.navigation.footerLinks.map((link) => (
              <Link key={`${link.label}-${link.href}`} href={link.href} className="transition hover:text-[#7d0b16]">
                {link.label}
              </Link>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}

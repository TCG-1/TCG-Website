"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import { DashboardIcon } from "@/components/client-hub/dashboard-icon";
import type { ClientHubContent, DashboardIconName } from "@/lib/client-hub";
import { createClient } from "@/lib/supabase/client";

type WorkspaceItem = {
  href: string;
  label: string;
  subtitle: string;
  icon: DashboardIconName;
};

const workspaceItems: WorkspaceItem[] = [
  {
    href: "/client-hub/notifications",
    label: "Notifications",
    subtitle: "Alerts, updates, and reminders",
    icon: "bell",
  },
  {
    href: "/client-hub/documents",
    label: "Documents",
    subtitle: "Shared files and access control",
    icon: "document",
  },
  {
    href: "/client-hub/support",
    label: "Support",
    subtitle: "Help, tickets, and requests",
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

export function ClientHubShell({
  children,
  content,
  userDisplayName,
  userEmail,
}: {
  children: React.ReactNode;
  content: ClientHubContent;
  userDisplayName: string;
  userEmail: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isLoggingOut, startTransition] = useTransition();

  const currentArea =
    workspaceItems.find((item) => isActivePath(pathname, item.href)) ?? {
      href: "/client-hub",
      label: content.meta.sidebarTitle,
      subtitle: content.meta.sidebarSubtitle,
      icon: "dashboard" as const,
    };

  return (
    <div
      id="top"
      className="min-h-screen bg-[#f7f6f3] text-[#1f1d1d] [font-family:var(--font-client-body)]"
    >
      <aside className="border-b border-[#e8ddd9] bg-[#f4f1ee] px-6 py-6 lg:fixed lg:inset-y-0 lg:left-0 lg:w-80 lg:border-b-0 lg:border-r lg:px-7 lg:py-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#62000b_0%,#8a0917_100%)] text-white">
            <DashboardIcon name="architecture" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#7d0b16] [font-family:var(--font-client-headline)]">
              {content.meta.brandName}
            </p>
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              {content.meta.brandSubtitle}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
            Programme Workspace
          </p>
          <div className="mt-3 space-y-2">
            {content.navigation.primary.map((item, index) => {
              const active = pathname === "/client-hub" && index === 0;

              return (
                <Link
                  key={`${item.label}-${item.section}`}
                  href={getDashboardHref(pathname, item.section)}
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
            {content.navigation.secondary.map((item) =>
              item.icon === "logout" ? (
                <button
                  key={`${item.label}-${item.section}`}
                  type="button"
                  onClick={() => {
                    startTransition(async () => {
                      await supabase.auth.signOut();
                      router.replace("/sign-in");
                      router.refresh();
                    });
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-[#7d0b16]"
                >
                  <DashboardIcon name={item.icon} className="h-5 w-5" />
                  <span>{isLoggingOut ? "Logging out..." : item.label}</span>
                </button>
              ) : (
                <Link
                  key={`${item.label}-${item.section}`}
                  href={getDashboardHref(pathname, item.section)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-[#7d0b16]"
                >
                  <DashboardIcon name={item.icon} className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ),
            )}
          </div>

          <Link
            href="/book-a-discovery-call"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#62000b_0%,#8a0917_100%)] px-4 py-3 text-xs font-bold uppercase tracking-[0.24em] text-white transition hover:opacity-90"
          >
            {content.meta.ctaLabel}
          </Link>

          <div className="mt-6 rounded-[1.5rem] border border-[#e6dad5] bg-white/70 p-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-[#eaded9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.profile.avatarUrl}
                  alt={content.profile.avatarAlt}
                  className="h-full w-full object-cover"
                />
              </div>
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
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-80">
        <header className="sticky top-0 z-30 border-b border-[#ede3df] bg-[#faf8f6]/90 px-6 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#8e6200]">
                {content.meta.sidebarTitle}
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
                  placeholder={content.meta.searchPlaceholder}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={content.profile.avatarUrl}
                    alt={content.profile.avatarAlt}
                    className="h-full w-full object-cover"
                  />
                </Link>
              </div>
            </div>
          </div>
        </header>

        {children}

        <footer className="flex flex-col gap-4 border-t border-[#ede3df] px-6 py-8 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>{content.meta.footerCopy}</div>
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

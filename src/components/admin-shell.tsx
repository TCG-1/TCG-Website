"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { clearAdminSession, getAdminSession, getStoredAdminUser } from "@/lib/admin-auth-client";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = getAdminSession();
  const user = getStoredAdminUser();
  const userName = user?.name ?? "Admin";

  useEffect(() => {
    if (!session) {
      router.replace("/sign-in");
    }
  }, [router, session]);

  if (!session) {
    return <div className="section-gap text-center text-slate-600">Loading admin panel…</div>;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/blog", label: "Blog" },
    { href: "/admin/leads", label: "Leads" },
    { href: "/admin/client-hub", label: "Client Hub" },
    { href: "/admin/jobs", label: "Jobs" },
    { href: "/admin/applications", label: "Applications" },
  ];

  return (
    <section className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <aside className="w-full rounded-[1.5rem] bg-[#8a0917] p-6 text-white shadow-xl lg:w-72 lg:shrink-0">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">Admin panel</p>
          <h1 className="mt-3 text-3xl font-bold">Tacklers CMS</h1>
          <p className="mt-2 text-sm text-white/75">Manage content, hiring workflows, lead submissions, and admin access.</p>

          <nav className="mt-8 grid gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                    active ? "bg-white text-[#8a0917]" : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/65">Signed in as</p>
            <p className="mt-2 text-lg font-bold">{userName}</p>
            <button
              type="button"
              onClick={() => {
                clearAdminSession();
                router.push("/sign-in");
              }}
              className="mt-4 inline-flex rounded-full border border-white/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
            >
              Log out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 rounded-[1.5rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}

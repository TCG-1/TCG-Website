"use client";

import dynamic from "next/dynamic";

const AdminShell = dynamic(
  () => import("@/components/admin-shell").then((mod) => mod.AdminShell),
  {
    ssr: false,
    loading: () => <div className="section-gap text-center text-slate-600">Loading admin panel…</div>,
  },
);

export function AdminShellClient({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

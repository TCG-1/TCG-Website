import type { Metadata } from "next";

import { AdminShellClient } from "./admin-shell-client";

export const metadata: Metadata = {
  title: "Admin Panel | Tacklers Consulting Group",
  description: "Tacklers admin area for blog and lead management.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShellClient>{children}</AdminShellClient>;
}

import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";
import { TrainingRealtimeBridge } from "@/components/training-portal/training-realtime-bridge";
import { requireAdminUser } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Panel | Tacklers Consulting Group",
  description: "Tacklers training operations admin for cohorts, sessions, learners, assessments, resources, and portal control.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminUser();

  return (
    <>
      <TrainingRealtimeBridge scope="admin" />
      <AdminShell userName={user.name}>{children}</AdminShell>
    </>
  );
}

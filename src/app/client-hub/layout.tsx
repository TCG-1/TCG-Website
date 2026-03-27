import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";

import { ClientHubShell } from "@/components/client-hub/client-hub-shell";
import { TrainingRealtimeBridge } from "@/components/training-portal/training-realtime-bridge";
import { getClientHubContent } from "@/lib/client-hub";
import { getPortalUserDisplayName, requirePortalUser } from "@/lib/portal-auth";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-client-headline",
  weight: ["300", "500", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-client-body",
  weight: ["400", "600", "700"],
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getClientHubContent();

  return {
    title: content.meta.pageTitle,
    description:
      "Lean training hub for sessions, syllabus, exams, resources, learner progress, and support.",
  };
}

export default async function ClientHubLayout({ children }: { children: React.ReactNode }) {
  const [user, { content }] = await Promise.all([requirePortalUser(), getClientHubContent()]);
  const userDisplayName = getPortalUserDisplayName(user);

  return (
    <div className={`${plusJakartaSans.variable} ${manrope.variable}`}>
      <TrainingRealtimeBridge scope="client" />
      <ClientHubShell
        content={content}
        userDisplayName={userDisplayName}
        userEmail={user.email ?? ""}
      >
        {children}
      </ClientHubShell>
    </div>
  );
}

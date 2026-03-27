import { PortalIntro, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";
import { adminTrainingData } from "@/lib/training-portal";

export default function AdminSessionsPage() {
  return (
    <div className="space-y-10">
      <PortalIntro
        eyebrow="Sessions"
        title="Run delivery with the same discipline as the training itself."
        description="Upcoming workshops need facilitator assignment, materials readiness, attendance expectations, and clear pre-session actions. This page replaces a generic portal view with real session operations."
      />

      <PortalPanel
        title="Upcoming sessions"
        description="Delivery schedule with readiness and assignment signals."
      >
        <PortalList
          items={adminTrainingData.sessions.map((session) => ({
            meta: `${session.time} • ${session.format} • ${session.facilitator}`,
            note: `${session.cohort}. ${session.status}.`,
            status: session.status,
            title: session.title,
          }))}
        />
      </PortalPanel>
    </div>
  );
}

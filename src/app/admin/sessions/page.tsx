import { TrainingSessionForm } from "@/components/training-portal/training-action-forms";
import { PortalIntro, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";
import { getAdminTrainingWorkspace } from "@/lib/training-system";

export default async function AdminSessionsPage() {
  const workspace = await getAdminTrainingWorkspace();

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
        <PortalList items={workspace.sessions} />
      </PortalPanel>

      <PortalPanel
        title="Schedule a session"
        description="Create the live workshop, link it to a module, and publish the preparation checklist that learners will see."
      >
        <TrainingSessionForm cohorts={workspace.references.cohorts} modules={workspace.references.modules} />
      </PortalPanel>
    </div>
  );
}

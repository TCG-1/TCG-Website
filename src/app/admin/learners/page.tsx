import { TrainingLearnerForm } from "@/components/training-portal/training-action-forms";
import { PortalIntro, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";
import { getAdminTrainingWorkspace } from "@/lib/training-system";

export default async function AdminLearnersPage() {
  const workspace = await getAdminTrainingWorkspace();

  return (
    <div className="space-y-10">
      <PortalIntro
        eyebrow="Learners"
        title="See who is on track and who needs intervention."
        description="A training admin view should expose learner readiness, attendance, assessment risk, and coaching actions instead of making teams infer all of that from generic profile and support pages."
      />

      <PortalPanel
        title="Learner health"
        description="Signals that should drive coaching, sponsor escalation, and support actions."
      >
        <PortalList items={workspace.learners} />
      </PortalPanel>

      <PortalPanel
        title="Enrol a learner"
        description="Create or reuse the client account, assign the cohort role, and make the training journey visible in the learner workspace."
      >
        <TrainingLearnerForm cohorts={workspace.references.cohorts} />
      </PortalPanel>
    </div>
  );
}

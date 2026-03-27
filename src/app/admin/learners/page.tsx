import { TrainingLearnerForm } from "@/components/training-portal/training-action-forms";
import { TrainingRoleManager } from "@/components/training-portal/training-execution-panels";
import { PortalIntro, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";
import { getAdminRoleWorkspace, getAdminTrainingWorkspace } from "@/lib/training-system";

export default async function AdminLearnersPage() {
  const [workspace, roleWorkspace] = await Promise.all([
    getAdminTrainingWorkspace(),
    getAdminRoleWorkspace(),
  ]);

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

      <PortalPanel
        title="Role assignment and access control"
        description="Manage trainer, admin owner, client manager, learner, and cohort role assignments from the same operational view."
      >
        <TrainingRoleManager workspace={roleWorkspace} />
      </PortalPanel>
    </div>
  );
}

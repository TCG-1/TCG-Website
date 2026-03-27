import { TrainingCohortForm } from "@/components/training-portal/training-action-forms";
import { PortalIntro, PortalList, PortalPanel, PortalWorkflow } from "@/components/training-portal/portal-primitives";
import { getAdminTrainingWorkspace } from "@/lib/training-system";
import { trainingBlueprint } from "@/lib/training-portal";

export default async function AdminTrainingProgrammesPage() {
  const workspace = await getAdminTrainingWorkspace();

  return (
    <div className="space-y-10">
      <PortalIntro
        eyebrow="Programmes"
        title="Design cohorts and pathways before delivery begins."
        description="This workspace is where sponsors, cohorts, pathways, and syllabus decisions should be managed together so the training journey is coherent from the start."
      />

      <PortalPanel
        title="Programme lifecycle"
        description="Admin work should follow the real delivery sequence."
      >
        <PortalWorkflow items={trainingBlueprint.workflows.admin} />
      </PortalPanel>

      <PortalPanel
        title="Active cohorts"
        description="Each cohort should show sponsor context, next milestone, and readiness status."
      >
        <PortalList items={workspace.cohorts} />
      </PortalPanel>

      <PortalPanel
        title="Create a cohort"
        description="Start a real programme instance for a client, assign the training owner, and anchor the upcoming delivery sequence."
      >
        <TrainingCohortForm
          clients={workspace.references.clients}
          managers={workspace.references.managers}
          programmes={workspace.references.programmes}
          trainers={workspace.references.trainers}
        />
      </PortalPanel>
    </div>
  );
}

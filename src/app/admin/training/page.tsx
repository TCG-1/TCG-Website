import { PortalIntro, PortalList, PortalPanel, PortalWorkflow } from "@/components/training-portal/portal-primitives";
import { adminTrainingData, trainingBlueprint } from "@/lib/training-portal";

export default function AdminTrainingProgrammesPage() {
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
        <PortalList
          items={adminTrainingData.cohorts.map((cohort) => ({
            meta: `${cohort.sponsor} • ${cohort.nextMilestone}`,
            note: cohort.readiness,
            status: cohort.status,
            title: cohort.label,
          }))}
        />
      </PortalPanel>
    </div>
  );
}

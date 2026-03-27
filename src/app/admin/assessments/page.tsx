import { PortalIntro, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";
import { adminTrainingData } from "@/lib/training-portal";

export default function AdminAssessmentsPage() {
  return (
    <div className="space-y-10">
      <PortalIntro
        eyebrow="Assessments"
        title="Control exam release, marking, and feedback without losing the learning thread."
        description="Assessment operations should be a first-class workspace: what is ready to release, what is waiting to be graded, who is below threshold, and what support is needed next."
      />

      <PortalPanel
        title="Assessment operations"
        description="Queues, blockers, and learner support signals."
      >
        <PortalList
          items={adminTrainingData.assessments.map((assessment) => ({
            meta: `${assessment.cohort} • ${assessment.due}`,
            note: assessment.notes,
            status: assessment.status,
            title: assessment.title,
          }))}
        />
      </PortalPanel>
    </div>
  );
}

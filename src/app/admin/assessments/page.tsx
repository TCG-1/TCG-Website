import { TrainingAssessmentForm } from "@/components/training-portal/training-action-forms";
import { TrainingAssessmentManager } from "@/components/training-portal/training-execution-panels";
import { PortalIntro, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";
import { getAdminAssessmentWorkspace, getAdminTrainingWorkspace } from "@/lib/training-system";

export default async function AdminAssessmentsPage() {
  const [workspace, assessmentWorkspace] = await Promise.all([
    getAdminTrainingWorkspace(),
    getAdminAssessmentWorkspace(),
  ]);

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
        <PortalList items={workspace.assessments} />
      </PortalPanel>

      <PortalPanel
        title="Release a new assessment"
        description="Publish the next quiz, practical task, or reflection directly into the training flow with due dates and instructions."
      >
        <TrainingAssessmentForm cohorts={workspace.references.cohorts} modules={workspace.references.modules} />
      </PortalPanel>

      <PortalPanel
        title="Grading queue and outcomes"
        description="Grade submitted evidence, return work for reattempt, and notify learners without leaving the training workflow."
      >
        <TrainingAssessmentManager assessments={assessmentWorkspace.assessments} canManage={assessmentWorkspace.canManage} />
      </PortalPanel>
    </div>
  );
}

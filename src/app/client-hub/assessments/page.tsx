import { LearnerAssessmentSubmitForm } from "@/components/training-portal/training-action-forms";
import { LearnerAssessmentLifecycle } from "@/components/training-portal/training-execution-panels";
import { PortalIntro, PortalPanel } from "@/components/training-portal/portal-primitives";
import { getClientTrainingWorkspace } from "@/lib/training-system";

export default async function ClientHubAssessmentsPage() {
  const workspace = await getClientTrainingWorkspace();

  return (
    <div className="space-y-10 px-6 py-8 lg:px-10 lg:py-12">
      <PortalIntro
        eyebrow="Exams & Tasks"
        title="Know what is due, what has passed, and what still needs evidence."
        description="Assessments should feel like part of the training pathway, not a disconnected compliance step. Learners need dates, criteria, and feedback in one place."
      />

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <PortalPanel
          title="Assessment queue"
          description="Released quizzes, practical work, and re-sit actions."
        >
          <LearnerAssessmentLifecycle assessments={workspace.assessments} roleLabel={workspace.roleLabel} />
        </PortalPanel>

        <PortalPanel
          title="Pass expectations"
          description="The training journey should make expectations explicit instead of hidden in emails or facilitator notes."
        >
          <div className="space-y-3 text-sm leading-6 text-slate-600">
            <div className="rounded-[1.4rem] border border-[#ece1dc] bg-[#faf7f5] p-4">
              Knowledge checks should confirm understanding of the core Lean concepts before the next module builds on them.
            </div>
            <div className="rounded-[1.4rem] border border-[#ece1dc] bg-[#faf7f5] p-4">
              Practical assignments should prove that the learner can apply the method in their own working environment, not just repeat theory.
            </div>
            <div className="rounded-[1.4rem] border border-[#ece1dc] bg-[#faf7f5] p-4">
              Re-sits should be paired with coaching and feedback, so the goal stays capability growth rather than pass-fail administration.
            </div>
          </div>
        </PortalPanel>
      </div>

      {workspace.roleLabel === "Learner" ? (
        <PortalPanel
          title="Submit assessment evidence"
          description="Learners can post their evidence directly into the marking queue without leaving the training workspace."
        >
          {workspace.assessments.some((assessment) => assessment.canSubmit) ? (
            <div className="space-y-6">
              {workspace.assessments.filter((assessment) => assessment.canSubmit).map((assessment) => (
                <div key={assessment.assessmentId} className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950">{assessment.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{assessment.instructions ?? assessment.note}</p>
                  <div className="mt-4">
                    <LearnerAssessmentSubmitForm
                      assessmentId={assessment.assessmentId}
                      existingSubmission={assessment.submissionText}
                      disabled={!assessment.canSubmit}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-slate-600">No live assessments are waiting for a learner submission.</p>
          )}
        </PortalPanel>
      ) : null}
    </div>
  );
}

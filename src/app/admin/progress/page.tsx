import { TrainingCertificationManager } from "@/components/training-portal/training-execution-panels";
import { PortalIntro, PortalKeyline, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";
import { getAdminCertificationWorkspace, getAdminTrainingWorkspace } from "@/lib/training-system";

export default async function AdminProgressPage() {
  const [workspace, certificationWorkspace] = await Promise.all([
    getAdminTrainingWorkspace(),
    getAdminCertificationWorkspace(),
  ]);

  return (
    <div className="space-y-10">
      <PortalIntro
        eyebrow="Progress"
        title="Track whether learning is landing, not just whether sessions happened."
        description="This workspace turns the training journey into measurable signals: attendance, marking speed, certification readiness, and the risk patterns that need intervention."
      />

      <PortalPanel
        title="Training health indicators"
        description="Signals that should drive sponsor conversations and operational follow-up."
      >
        <PortalKeyline items={workspace.progress} />
      </PortalPanel>

      <PortalPanel
        title="At-risk learner view"
        description="Progress only matters if it shows who needs support before the next module or assessment window."
      >
        <PortalList items={workspace.learners} />
      </PortalPanel>

      <PortalPanel
        title="Certification review"
        description="Award or revoke certificates once attendance, assessment performance, and readiness signals meet the delivery standard."
      >
        <TrainingCertificationManager workspace={certificationWorkspace} />
      </PortalPanel>
    </div>
  );
}

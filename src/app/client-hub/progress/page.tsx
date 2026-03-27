import { PortalIntro, PortalKeyline, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";
import { getClientTrainingWorkspace } from "@/lib/training-system";

export default async function ClientHubProgressPage() {
  const workspace = await getClientTrainingWorkspace();

  return (
    <div className="space-y-10 px-6 py-8 lg:px-10 lg:py-12">
      <PortalIntro
        eyebrow="Progress"
        title="Make progress visible enough to coach, adjust, and finish strong."
        description="Progress should combine attendance, confidence, assessment results, and readiness for certification, not just a generic percentage bar."
      />

      <PortalPanel
        title="Progress indicators"
        description="A fuller view of learner progress across the pathway."
      >
        <PortalKeyline items={workspace.progress} />
      </PortalPanel>

      <PortalPanel
        title="Signals shaping readiness"
        description="The strongest learner progress view connects sessions, assessments, and applied work."
      >
        <PortalList items={workspace.signals} />
      </PortalPanel>
    </div>
  );
}

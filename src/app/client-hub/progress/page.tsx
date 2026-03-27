import { PortalIntro, PortalKeyline, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";
import { clientTrainingData } from "@/lib/training-portal";

export default function ClientHubProgressPage() {
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
        <PortalKeyline items={clientTrainingData.progress} />
      </PortalPanel>

      <PortalPanel
        title="Signals shaping readiness"
        description="The strongest learner progress view connects sessions, assessments, and applied work."
      >
        <PortalList
          items={[
            {
              meta: "Attendance signal",
              note: "Attendance stays above target, which keeps practical exercises and peer learning intact.",
              status: "Healthy",
              title: "Session participation",
            },
            {
              meta: "Evidence signal",
              note: "Assignments are being submitted, but the next practical task still needs stronger completion discipline.",
              status: "Watch",
              title: "Applied work",
            },
            {
              meta: "Certification signal",
              note: "Readiness stays on track if the next module and practical evidence are both completed on time.",
              status: "On track",
              title: "Certification pathway",
            },
          ]}
        />
      </PortalPanel>
    </div>
  );
}

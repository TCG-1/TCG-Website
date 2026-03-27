import { PortalIntro, PortalKeyline, PortalPanel } from "@/components/training-portal/portal-primitives";
import { adminTrainingData, trainingBlueprint } from "@/lib/training-portal";

export default function AdminProgressPage() {
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
        <PortalKeyline items={adminTrainingData.progress} />
      </PortalPanel>

      <PortalPanel
        title="Missing scope now surfaced"
        description="The redesign exposes the delivery capabilities the old structure did not solve."
      >
        <div className="space-y-3 text-sm leading-6 text-slate-600">
          {trainingBlueprint.missingScope.map((item) => (
            <div key={item} className="rounded-[1.4rem] border border-[#ece1dc] bg-[#faf7f5] p-4">
              {item}
            </div>
          ))}
        </div>
      </PortalPanel>
    </div>
  );
}

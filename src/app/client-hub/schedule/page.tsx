import { LearnerSessionCalendar } from "@/components/training-portal/training-execution-panels";
import { PortalIntro, PortalPanel } from "@/components/training-portal/portal-primitives";
import { getClientTrainingWorkspace } from "@/lib/training-system";

export default async function ClientHubSchedulePage() {
  const workspace = await getClientTrainingWorkspace();

  return (
    <div className="space-y-10 px-6 py-8 lg:px-10 lg:py-12">
      <PortalIntro
        eyebrow="Session Calendar"
        title="See every live session before it becomes a surprise."
        description="Upcoming workshops, coaching sessions, and practice reviews should be visible with enough detail for learners and sponsors to prepare properly."
      />

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <PortalPanel
          title="Upcoming delivery"
          description="Confirmed sessions, format, timing, and facilitator ownership."
        >
          <LearnerSessionCalendar roleLabel={workspace.roleLabel} sessions={workspace.sessionCalendar} />
        </PortalPanel>

        <PortalPanel
          title="Before the next workshop"
          description="The best learner experience tells people exactly how to show up ready."
        >
          <div className="space-y-3">
            {(workspace.nextSession?.checklist ?? [
              "The next training session has not been published yet.",
              "When it is published, the readiness checklist will appear here.",
            ]).map((item) => (
              <div key={item} className="rounded-[1.4rem] border border-[#ece1dc] bg-[#faf7f5] px-4 py-4 text-sm leading-6 text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </PortalPanel>
      </div>
    </div>
  );
}

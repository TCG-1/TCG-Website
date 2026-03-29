import Link from "next/link";

import { LearnerTrainingOnboarding } from "@/components/training-portal/training-execution-panels";
import {
  PortalIntro,
  PortalKeyline,
  PortalList,
  PortalMetricGrid,
  PortalPanel,
  PortalWorkflow,
} from "@/components/training-portal/portal-primitives";
import type { ClientTrainingWorkspace } from "@/lib/training-system";
import { trainingBlueprint } from "@/lib/training-portal";

export function ClientHubView({ workspace }: { workspace: ClientTrainingWorkspace }) {
  return (
    <div className="space-y-12 px-6 py-8 lg:px-10 lg:py-12">
      <PortalIntro
        eyebrow={workspace.intro.eyebrow}
        title={`Welcome back, ${workspace.viewerName}.`}
        description={workspace.intro.description}
      />

      <PortalMetricGrid items={workspace.metrics} />

      <LearnerTrainingOnboarding onboarding={workspace.onboarding} />

      <div className="space-y-8">
        <PortalPanel
          title={workspace.nextSession?.title ?? "No upcoming session is scheduled yet."}
          description={
            workspace.nextSession
              ? `${workspace.nextSession.time} • ${workspace.nextSession.format} • ${workspace.nextSession.venue}`
              : "As soon as the next live workshop is scheduled, the training detail and preparation checklist will appear here."
          }
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a0917]">
                {workspace.nextSession ? `Facilitated by ${workspace.nextSession.facilitator}` : "Training delivery details will appear here"}
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                {(workspace.nextSession?.checklist ?? [
                  "The next training milestone has not been published yet.",
                  "When it is published, this panel will show the exact prework and readiness checklist.",
                ]).map((item) => (
                  <li key={item} className="rounded-[1.2rem] border border-[#ece1dc] bg-[#faf7f5] px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.5rem] bg-[#faf7f4] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Why this matters</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                The portal should remove uncertainty before training starts. Learners should know the next session, what to bring, what to prepare, and what capability the module is meant to build.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/client-hub/schedule" className="button-primary">
                  Open calendar
                </Link>
                <Link href="/client-hub/syllabus" className="button-secondary">
                  Review module
                </Link>
              </div>
            </div>
          </div>
        </PortalPanel>

        <PortalPanel
          title="Learner journey"
          description="This view follows the real learner journey, so each step is clear, practical, and in the right order."
        >
          <PortalWorkflow items={trainingBlueprint.workflows.client} />
        </PortalPanel>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <PortalPanel
          title="Syllabus in motion"
          description="Every module should show the phase, expected outcomes, and where the learner currently stands."
        >
          <PortalList items={workspace.modules} />
          <div className="mt-6">
            <Link href="/client-hub/syllabus" className="button-secondary">
              Open full syllabus
            </Link>
          </div>
        </PortalPanel>

        <PortalPanel
          title="Assessments and evidence"
          description="Quizzes, practical assignments, and re-sits need visibility so nobody is surprised by what is due."
        >
          <PortalList items={workspace.assessments} />
          <div className="mt-6">
            <Link href="/client-hub/assessments" className="button-secondary">
              Open assessments
            </Link>
          </div>
        </PortalPanel>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <PortalPanel
          title="Learning resources"
          description="Resources should be tied to modules and learner roles, not buried in a generic file list."
        >
          <PortalList items={workspace.resources} />
          <div className="mt-6">
            <Link href="/client-hub/resources" className="button-secondary">
              Open learning resources
            </Link>
          </div>
        </PortalPanel>

        <PortalPanel
          title="Progress and readiness"
          description="Attendance, confidence, completion, and certification need to stay visible for both the learner and sponsor."
        >
          <PortalKeyline items={workspace.progress} />
          <div className="mt-8 rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">What the old portal missed</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {trainingBlueprint.clientGaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          </div>
        </PortalPanel>
      </div>

      <PortalPanel
        title="Support the whole learning experience"
        description="Support stays available, but it now sits beside the training journey instead of replacing it."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Link
            href="/client-hub/schedule"
            className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(31,29,29,0.06)]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">Prepare</p>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-950">Check upcoming sessions</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              See the next workshop, coaching review, and preparation checklist in one place.
            </p>
          </Link>

          <Link
            href="/client-hub/resources"
            className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(31,29,29,0.06)]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">Learn</p>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-950">Open the right materials</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Access workbooks, templates, and revision guides matched to the current module.
            </p>
          </Link>

          <Link
            href="/client-hub/support"
            className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(31,29,29,0.06)]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">Need help?</p>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-950">Raise a training support request</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Ask for access support, assessment help, or follow-up coaching without leaving the workspace.
            </p>
          </Link>
        </div>
      </PortalPanel>
    </div>
  );
}

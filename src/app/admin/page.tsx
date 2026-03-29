import Link from "next/link";

import {
  PortalIntro,
  PortalKeyline,
  PortalList,
  PortalMetricGrid,
  PortalPanel,
  PortalWorkflow,
} from "@/components/training-portal/portal-primitives";
import { getAdminTrainingWorkspace } from "@/lib/training-system";
import { trainingBlueprint } from "@/lib/training-portal";

export default async function AdminDashboardPage() {
  const workspace = await getAdminTrainingWorkspace();

  return (
    <div className="space-y-12">
      <PortalIntro
        eyebrow={workspace.intro.eyebrow}
        title={workspace.intro.title}
        description={workspace.intro.description}
      />

      <PortalMetricGrid items={workspace.metrics} />

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <PortalPanel
          title="Training delivery workflow"
          description="This workspace follows the full delivery lifecycle, from cohort setup to certification readiness."
        >
          <PortalWorkflow items={trainingBlueprint.workflows.admin} />
        </PortalPanel>

        <PortalPanel
          title="What the old structure was missing"
          description="The redesign is anchored to the real operational gaps, not just a new visual layer."
        >
          <div className="space-y-3 text-sm leading-6 text-slate-600">
            {trainingBlueprint.adminGaps.map((gap) => (
              <div key={gap} className="rounded-[1.4rem] border border-[#ece1dc] bg-[#faf7f5] p-4">
                {gap}
              </div>
            ))}
          </div>
        </PortalPanel>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <PortalPanel
          title="Cohort health"
          description="Sponsors, pathways, readiness, and the next milestone for each active cohort."
        >
          <PortalList items={workspace.cohorts} />
          <div className="mt-6">
            <Link href="/admin/training" className="button-secondary">
              Open programmes
            </Link>
          </div>
        </PortalPanel>

        <PortalPanel
          title="Session readiness"
          description="Upcoming delivery with facilitator ownership and setup status."
        >
          <PortalList items={workspace.sessions} />
          <div className="mt-6">
            <Link href="/admin/sessions" className="button-secondary">
              Open sessions
            </Link>
          </div>
        </PortalPanel>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <PortalPanel
          title="Assessment control"
          description="Queues, release blockers, and learner support before pass/fail becomes a problem."
        >
          <PortalList items={workspace.assessments} />
        </PortalPanel>

        <PortalPanel
          title="Progress intelligence"
          description="Attendance, grading SLA, and certification readiness are the signals that keep delivery honest."
        >
          <PortalKeyline items={workspace.progress} />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {workspace.workflowCards.map((item) => (
              <article key={item.label} className="rounded-[1.4rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">{item.label}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </PortalPanel>
      </div>
    </div>
  );
}

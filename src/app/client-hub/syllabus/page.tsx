import { PortalIntro, PortalList, PortalPanel, PortalWorkflow } from "@/components/training-portal/portal-primitives";
import { getClientTrainingWorkspace } from "@/lib/training-system";
import { trainingBlueprint } from "@/lib/training-portal";

export default async function ClientHubSyllabusPage() {
  const workspace = await getClientTrainingWorkspace();

  return (
    <div className="space-y-10 px-6 py-8 lg:px-10 lg:py-12">
      <PortalIntro
        eyebrow="Syllabus"
        title="Follow the full Lean learning pathway module by module."
        description="A proper training hub shows the sequence of modules, the outcomes each one builds, and how they combine into real capability on the floor."
      />

      <PortalPanel
        title="Learning pathway"
        description="Each step of the learner journey should connect to the next one clearly."
      >
        <PortalWorkflow items={trainingBlueprint.workflows.client} />
      </PortalPanel>

      <PortalPanel
        title="Module breakdown"
        description="Current status, expected outcomes, and delivery rhythm for the active syllabus."
      >
        <PortalList items={workspace.modules} />
      </PortalPanel>

      <PortalPanel
        title="Live module drilldown"
        description="Each module now reflects its real outcomes, sessions, assessments, and published resources."
      >
        <div className="space-y-4">
          {workspace.moduleDetails.map((module) => (
            <article key={module.moduleId} className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950">{module.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {module.phaseLabel} • {module.deliveryTypeLabel} • {module.durationLabel}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">
                  {module.statusLabel}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">{module.summary}</p>

              <div className="mt-4 grid gap-4 lg:grid-cols-4">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Outcomes</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {module.outcomes.length ? module.outcomes.map((outcome) => (
                      <li key={outcome}>{outcome}</li>
                    )) : <li>No outcomes published yet.</li>}
                  </ul>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Sessions</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {module.sessions.length ? module.sessions.map((session) => (
                      <li key={`${module.moduleId}-${session.title}-${session.startsAtLabel}`}>
                        <span className="font-semibold text-slate-950">{session.title}</span>
                        <br />
                        {session.startsAtLabel} • {session.statusLabel}
                      </li>
                    )) : <li>No sessions linked yet.</li>}
                  </ul>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Assessments</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {module.assessments.length ? module.assessments.map((assessment) => (
                      <li key={`${module.moduleId}-${assessment.title}-${assessment.dueAtLabel}`}>
                        <span className="font-semibold text-slate-950">{assessment.title}</span>
                        <br />
                        {assessment.dueAtLabel} • {assessment.statusLabel}
                      </li>
                    )) : <li>No assessments linked yet.</li>}
                  </ul>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Resources</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {module.resources.length ? module.resources.map((resource) => (
                      <li key={`${module.moduleId}-${resource.title}-${resource.versionLabel ?? "current"}`}>
                        <span className="font-semibold text-slate-950">{resource.title}</span>
                        <br />
                        {resource.statusLabel}{resource.versionLabel ? ` • ${resource.versionLabel}` : ""}
                      </li>
                    )) : <li>No resources released yet.</li>}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </PortalPanel>
    </div>
  );
}

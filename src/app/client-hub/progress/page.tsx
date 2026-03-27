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
        <div className="mt-6 rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Certification status</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{workspace.certification.statusLabel}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{workspace.certification.note}</p>
          {workspace.certification.certificateNumber ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold text-[#8a0917]">Certificate: {workspace.certification.certificateNumber}</p>
              {workspace.certification.certificateUrl ? (
                <a
                  className="text-sm font-semibold text-[#8a0917] underline-offset-4 transition hover:underline"
                  href={workspace.certification.certificateUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Download certificate
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </PortalPanel>

      <PortalPanel
        title="Signals shaping readiness"
        description="The strongest learner progress view connects sessions, assessments, and applied work."
      >
        <PortalList items={workspace.signals} />
      </PortalPanel>

      <PortalPanel
        title="Milestone timeline"
        description="Track onboarding, delivery, assessments, and certification as one continuous learning journey."
      >
        <div className="space-y-4">
          {workspace.progressTimeline.map((item) => (
            <article key={item.id} className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.meta}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">
                  {item.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{item.note}</p>
            </article>
          ))}
        </div>
      </PortalPanel>
    </div>
  );
}

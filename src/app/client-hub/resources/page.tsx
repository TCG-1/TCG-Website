import { PortalIntro, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";
import { getClientTrainingWorkspace } from "@/lib/training-system";

export default async function ClientHubResourcesPage() {
  const workspace = await getClientTrainingWorkspace();

  return (
    <div className="space-y-10 px-6 py-8 lg:px-10 lg:py-12">
      <PortalIntro
        eyebrow="Resources"
        title="Open the right pack for the right module."
        description="The resource experience should reflect the training journey: what learners need before a session, during delivery, and after the workshop to sustain the change."
      />

      <PortalPanel
        title="Module-linked resources"
        description="Resources grouped by learning context instead of buried in a generic file store."
      >
        <PortalList items={workspace.resources} />
      </PortalPanel>

      <PortalPanel
        title="Versioned resource library"
        description="Open the latest workbook, template, or guide with visibility and status tied to the live training journey."
      >
        <div className="space-y-4">
          {workspace.resourceDetails.map((resource) => (
            <article key={resource.id} className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950">{resource.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{resource.meta}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">
                  {resource.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {resource.summary ?? "Resource summary will appear here when the training team publishes it."}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {resource.versionLabel ? (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {resource.versionLabel}
                  </span>
                ) : null}
                {resource.href ? (
                  <a
                    className="text-sm font-semibold text-[#8a0917] underline-offset-4 transition hover:underline"
                    href={resource.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open resource
                  </a>
                ) : (
                  <span className="text-sm text-slate-500">Download link will be published here.</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </PortalPanel>
    </div>
  );
}

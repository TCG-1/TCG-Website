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
    </div>
  );
}

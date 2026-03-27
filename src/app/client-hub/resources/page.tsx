import { PortalIntro, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";
import { clientTrainingData } from "@/lib/training-portal";

export default function ClientHubResourcesPage() {
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
        <PortalList
          items={clientTrainingData.resources.map((resource) => ({
            meta: `${resource.module} • ${resource.format} • ${resource.audience}`,
            note: "Ready for workshop preparation, live use, or post-session reinforcement.",
            title: resource.title,
          }))}
        />
      </PortalPanel>
    </div>
  );
}

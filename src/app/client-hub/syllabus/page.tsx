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
    </div>
  );
}

import { TrainingResourceForm } from "@/components/training-portal/training-action-forms";
import { PortalIntro, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";
import { getAdminTrainingWorkspace } from "@/lib/training-system";

export default async function AdminResourcesPage() {
  const workspace = await getAdminTrainingWorkspace();

  return (
    <div className="space-y-10">
      <PortalIntro
        eyebrow="Resources"
        title="Publish the right pack to the right learner at the right moment."
        description="Training delivery depends on tightly managed workbooks, facilitator guides, sponsor packs, and revision materials. This is where those releases should be governed."
      />

      <PortalPanel
        title="Resource governance"
        description="Materials grouped by audience and module context."
      >
        <PortalList items={workspace.resources} />
      </PortalPanel>

      <PortalPanel
        title="Syllabus-linked publishing"
        description="Resource release should stay tied to the module plan, not become a detached document operation."
      >
        <PortalList items={workspace.sessions.slice(0, 4)} />
      </PortalPanel>

      <PortalPanel
        title="Release a resource"
        description="Publish the learner pack, manager pack, or facilitator material at the correct point in the delivery pathway."
      >
        <TrainingResourceForm
          cohorts={workspace.references.cohorts}
          modules={workspace.references.modules}
          programmes={workspace.references.programmes}
        />
      </PortalPanel>
    </div>
  );
}

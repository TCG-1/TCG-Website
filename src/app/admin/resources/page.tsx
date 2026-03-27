import { PortalIntro, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";
import { adminTrainingData } from "@/lib/training-portal";

export default function AdminResourcesPage() {
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
        <PortalList
          items={adminTrainingData.resources.map((resource) => ({
            meta: `${resource.module} • ${resource.format} • ${resource.audience}`,
            note: "Version-controlled resource set for the training journey.",
            title: resource.title,
          }))}
        />
      </PortalPanel>

      <PortalPanel
        title="Syllabus-linked publishing"
        description="Resource release should stay tied to the module plan, not become a detached document operation."
      >
        <PortalList
          items={adminTrainingData.syllabus.map((module) => ({
            meta: `${module.phase} • ${module.duration}`,
            note: module.outcomes.join(" • "),
            status: module.status,
            title: module.title,
          }))}
        />
      </PortalPanel>
    </div>
  );
}

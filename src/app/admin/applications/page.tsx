import { ApplicationManager } from "@/components/admin/application-manager";

export default function AdminApplicationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Application management</p>
        <h2 className="section-title">Review job applications</h2>
        <p className="body-copy mt-4 max-w-3xl">
          Track incoming candidates, download attachments, and move each application through your
          review workflow.
        </p>
      </div>

      <ApplicationManager />
    </div>
  );
}

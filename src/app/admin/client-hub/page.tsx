import { ClientHubManager } from "@/components/admin/client-hub-manager";

export default function AdminClientHubPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Client dashboard management</p>
        <h2 className="section-title">Edit the client hub</h2>
        <p className="body-copy mt-4 max-w-3xl">
          Manage the full client dashboard experience, including welcome copy, metrics, programme
          stages, resources, calendar sessions, and footer links.
        </p>
      </div>

      <ClientHubManager />
    </div>
  );
}

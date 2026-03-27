import { JobManager } from "@/components/admin/job-manager";

export default function AdminJobsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Recruitment management</p>
        <h2 className="section-title">Manage job positions</h2>
        <p className="body-copy mt-4 max-w-3xl">
          Create job posts, change their status, and keep the public careers page aligned with live
          hiring needs.
        </p>
      </div>

      <JobManager />
    </div>
  );
}

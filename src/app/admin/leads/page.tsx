import { adminLeadRows } from "@/lib/admin-data";

export default function AdminLeadsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Lead management</p>
        <h2 className="section-title">Lead submissions</h2>
        <p className="body-copy mt-4 max-w-3xl">
          View and triage incoming leads from discovery calls, contact forms, and on-site assessment
          requests.
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white">
        <div className="grid grid-cols-[0.7fr_1fr_1fr_0.8fr_0.7fr] gap-4 border-b border-black/5 bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          <div>ID</div>
          <div>Name</div>
          <div>Company</div>
          <div>Source</div>
          <div>Status</div>
        </div>
        <div className="divide-y divide-black/5">
          {adminLeadRows.map((lead) => (
            <div key={lead.id} className="grid grid-cols-[0.7fr_1fr_1fr_0.8fr_0.7fr] gap-4 px-6 py-5 text-sm text-slate-700">
              <div className="font-bold text-slate-950">{lead.id}</div>
              <div>
                <p className="font-bold text-slate-950">{lead.name}</p>
                <p className="text-slate-600">{lead.email}</p>
              </div>
              <div>{lead.company}</div>
              <div>{lead.source}</div>
              <div>
                <span className="rounded-full bg-[#FDD835] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-950">
                  {lead.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

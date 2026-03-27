"use client";

import { useEffect, useState, useTransition } from "react";

import {
  DEFAULT_EMPLOYMENT_TYPE,
  DEFAULT_JOB_LOCATION,
  JOB_STATUSES,
  type CareerJob,
  type CareerJobPayload,
  formatCareerDate,
} from "@/lib/careers";

type Notice = { type: "success" | "error"; message: string } | null;
type JobFormState = CareerJobPayload;

function createEmptyJobForm(): JobFormState {
  return {
    title: "",
    department: "",
    locationLabel: DEFAULT_JOB_LOCATION,
    employmentType: DEFAULT_EMPLOYMENT_TYPE,
    experienceLevel: "",
    summary: "",
    description: "",
    responsibilities: "",
    requirements: "",
    status: "draft",
  };
}

function toJobForm(job: CareerJob): JobFormState {
  return {
    title: job.title,
    department: job.department ?? "",
    locationLabel: job.location_label ?? DEFAULT_JOB_LOCATION,
    employmentType: job.employment_type ?? DEFAULT_EMPLOYMENT_TYPE,
    experienceLevel: job.experience_level ?? "",
    summary: job.summary,
    description: job.description,
    responsibilities: job.responsibilities ?? "",
    requirements: job.requirements ?? "",
    status: job.status,
  };
}

function JobFields({
  value,
  onChange,
}: {
  value: JobFormState;
  onChange: (field: keyof JobFormState, nextValue: string) => void;
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Job title
          <input
            className="input"
            value={value.title}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="Lean Transformation Consultant"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Department
          <input
            className="input"
            value={value.department}
            onChange={(event) => onChange("department", event.target.value)}
            placeholder="Consulting"
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Status
          <select
            className="input"
            value={value.status}
            onChange={(event) => onChange("status", event.target.value)}
          >
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Employment type
          <input
            className="input"
            value={value.employmentType}
            onChange={(event) => onChange("employmentType", event.target.value)}
            placeholder="Full-time"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Experience level
          <input
            className="input"
            value={value.experienceLevel}
            onChange={(event) => onChange("experienceLevel", event.target.value)}
            placeholder="Mid-Senior"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Location label
        <input
          className="input"
          value={value.locationLabel}
          onChange={(event) => onChange("locationLabel", event.target.value)}
          placeholder={DEFAULT_JOB_LOCATION}
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Summary
        <textarea
          className="input min-h-24 resize-y"
          value={value.summary}
          onChange={(event) => onChange("summary", event.target.value)}
          placeholder="Short headline summary for the public careers page."
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Description
        <textarea
          className="input min-h-32 resize-y"
          value={value.description}
          onChange={(event) => onChange("description", event.target.value)}
          placeholder="Longer role overview."
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Responsibilities
          <textarea
            className="input min-h-36 resize-y"
            value={value.responsibilities}
            onChange={(event) => onChange("responsibilities", event.target.value)}
            placeholder="One responsibility per line."
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Requirements
          <textarea
            className="input min-h-36 resize-y"
            value={value.requirements}
            onChange={(event) => onChange("requirements", event.target.value)}
            placeholder="One requirement per line."
          />
        </label>
      </div>
    </div>
  );
}

export function JobManager() {
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [drafts, setDrafts] = useState<Record<string, JobFormState>>({});
  const [createForm, setCreateForm] = useState<JobFormState>(createEmptyJobForm);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<Notice>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isActive = true;

    async function loadJobs() {
      try {
        const response = await fetch("/api/admin/jobs", { cache: "no-store" });
        const payload = (await response.json()) as { error?: string; jobs?: CareerJob[] };

        if (!isActive) return;

        if (!response.ok) {
          setLoadError(payload.error ?? "Unable to load jobs.");
          return;
        }

        const nextJobs = payload.jobs ?? [];
        setJobs(nextJobs);
        setDrafts(
          Object.fromEntries(nextJobs.map((job) => [job.id, toJobForm(job)])),
        );
      } catch {
        if (!isActive) return;
        setLoadError("Unable to load jobs.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadJobs();

    return () => {
      isActive = false;
    };
  }, []);

  function updateCreateForm(field: keyof JobFormState, nextValue: string) {
    setCreateForm((current) => ({ ...current, [field]: nextValue }));
  }

  function updateDraft(jobId: string, field: keyof JobFormState, nextValue: string) {
    setDrafts((current) => ({
      ...current,
      [jobId]: {
        ...current[jobId],
        [field]: nextValue,
      },
    }));
  }

  return (
    <div className="space-y-8">
      <section className="card">
        <div>
          <p className="eyebrow">Create role</p>
          <h3 className="mt-3 text-2xl font-bold text-[#8a0917]">Add a new job position</h3>
          <p className="mt-3 text-slate-600">
            New roles will appear on the public careers page once their status is set to <strong>open</strong>.
          </p>
        </div>

        <div className="mt-6">
          <JobFields value={createForm} onChange={updateCreateForm} />
        </div>

        {notice ? (
          <div
            className={`mt-5 rounded-2xl px-4 py-3 text-sm font-medium ${
              notice.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-[#fff4f6] text-[#8a0917]"
            }`}
          >
            {notice.message}
          </div>
        ) : null}

        <button
          type="button"
          className="button-primary mt-6 w-fit"
          disabled={isPending}
          onClick={() => {
            setNotice(null);
            startTransition(async () => {
              try {
                const response = await fetch("/api/admin/jobs", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(createForm),
                });
                const payload = (await response.json()) as { error?: string; job?: CareerJob };

                if (!response.ok || !payload.job) {
                  setNotice({
                    type: "error",
                    message: payload.error ?? "Unable to create the job right now.",
                  });
                  return;
                }

                setJobs((current) => [payload.job!, ...current]);
                setDrafts((current) => ({
                  ...current,
                  [payload.job!.id]: toJobForm(payload.job!),
                }));
                setCreateForm(createEmptyJobForm());
                setNotice({ type: "success", message: "Job created successfully." });
              } catch {
                setNotice({ type: "error", message: "Unable to create the job right now." });
              }
            });
          }}
        >
          {isPending ? "Saving…" : "Create job"}
        </button>
      </section>

      <section className="space-y-4">
        <div>
          <p className="eyebrow">Existing roles</p>
          <h3 className="mt-3 text-2xl font-bold text-[#8a0917]">Manage current job positions</h3>
        </div>

        {isLoading ? <div className="card text-slate-600">Loading jobs…</div> : null}
        {loadError ? <div className="card bg-[#fff4f6] text-[#8a0917]">{loadError}</div> : null}
        {!isLoading && !jobs.length ? (
          <div className="card text-slate-600">No jobs created yet. Add your first position above.</div>
        ) : null}

        {jobs.map((job) => {
          const draft = drafts[job.id];

          if (!draft) return null;

          return (
            <details
              key={job.id}
              className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.06)]"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4 px-6 py-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a0917]">
                    {job.status}
                  </p>
                  <h4 className="mt-2 text-xl font-bold text-slate-950">{job.title}</h4>
                  <p className="mt-1 text-sm text-slate-500">
                    {[job.employment_type, job.location_label, job.experience_level]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  Updated {formatCareerDate(job.updated_at)}
                </p>
              </summary>

              <div className="border-t border-black/5 px-6 py-6">
                <JobFields
                  value={draft}
                  onChange={(field, nextValue) => updateDraft(job.id, field, nextValue)}
                />

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="button-primary"
                    disabled={isPending}
                    onClick={() => {
                      setNotice(null);
                      startTransition(async () => {
                        try {
                          const response = await fetch(`/api/admin/jobs/${job.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(draft),
                          });
                          const payload = (await response.json()) as { error?: string; job?: CareerJob };

                          if (!response.ok || !payload.job) {
                            setNotice({
                              type: "error",
                              message: payload.error ?? "Unable to update the job right now.",
                            });
                            return;
                          }

                          setJobs((current) =>
                            current.map((item) => (item.id === payload.job!.id ? payload.job! : item)),
                          );
                          setDrafts((current) => ({
                            ...current,
                            [payload.job!.id]: toJobForm(payload.job!),
                          }));
                          setNotice({ type: "success", message: `Saved ${payload.job!.title}.` });
                        } catch {
                          setNotice({ type: "error", message: "Unable to update the job right now." });
                        }
                      });
                    }}
                  >
                    Save changes
                  </button>

                  <button
                    type="button"
                    className="button-secondary"
                    disabled={isPending}
                    onClick={() => {
                      if (!window.confirm(`Delete ${job.title}? Existing applications will keep their snapshots.`)) {
                        return;
                      }

                      setNotice(null);
                      startTransition(async () => {
                        try {
                          const response = await fetch(`/api/admin/jobs/${job.id}`, {
                            method: "DELETE",
                          });
                          const payload = (await response.json()) as { error?: string };

                          if (!response.ok) {
                            setNotice({
                              type: "error",
                              message: payload.error ?? "Unable to delete the job right now.",
                            });
                            return;
                          }

                          setJobs((current) => current.filter((item) => item.id !== job.id));
                          setDrafts((current) => {
                            const nextDrafts = { ...current };
                            delete nextDrafts[job.id];
                            return nextDrafts;
                          });
                          setNotice({ type: "success", message: `${job.title} deleted.` });
                        } catch {
                          setNotice({ type: "error", message: "Unable to delete the job right now." });
                        }
                      });
                    }}
                  >
                    Delete role
                  </button>
                </div>
              </div>
            </details>
          );
        })}
      </section>
    </div>
  );
}

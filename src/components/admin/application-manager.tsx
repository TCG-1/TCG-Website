"use client";

import { useEffect, useState, useTransition } from "react";

import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type CareerApplication,
  formatCareerDate,
} from "@/lib/careers";

type Notice = { type: "success" | "error"; message: string } | null;

type ApplicationDraft = {
  status: ApplicationStatus;
  reviewNotes: string;
};

export function ApplicationManager() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ApplicationDraft>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isActive = true;

    async function loadApplications() {
      try {
        const response = await fetch("/api/admin/applications", { cache: "no-store" });
        const payload = (await response.json()) as {
          error?: string;
          applications?: CareerApplication[];
        };

        if (!isActive) return;

        if (!response.ok) {
          setLoadError(payload.error ?? "Unable to load applications.");
          return;
        }

        const nextApplications = payload.applications ?? [];
        setApplications(nextApplications);
        setDrafts(
          Object.fromEntries(
            nextApplications.map((application) => [
              application.id,
              {
                status: application.status,
                reviewNotes: application.review_notes ?? "",
              },
            ]),
          ),
        );
      } catch {
        if (!isActive) return;
        setLoadError("Unable to load applications.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadApplications();

    return () => {
      isActive = false;
    };
  }, []);

  function updateDraft(applicationId: string, field: keyof ApplicationDraft, nextValue: string) {
    setDrafts((current) => ({
      ...current,
      [applicationId]: {
        ...current[applicationId],
        [field]: nextValue,
      },
    }));
  }

  return (
    <div className="space-y-6">
      {notice ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm font-medium ${
            notice.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-[#fff4f6] text-[#8a0917]"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      {isLoading ? <div className="card text-slate-600">Loading applications…</div> : null}
      {loadError ? <div className="card bg-[#fff4f6] text-[#8a0917]">{loadError}</div> : null}
      {!isLoading && !applications.length ? (
        <div className="card text-slate-600">No applications have been submitted yet.</div>
      ) : null}

      {applications.map((application) => {
        const draft = drafts[application.id];

        if (!draft) return null;

        return (
          <article
            key={application.id}
            className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,0.06)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a0917]">
                  {application.job_title_snapshot}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">{application.full_name}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Submitted {formatCareerDate(application.created_at)}
                </p>
              </div>

              <a
                href={`/api/admin/applications/${application.id}/resume`}
                className="button-secondary"
              >
                Download resume
              </a>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-black/5 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Contact</p>
                <p className="mt-3 font-semibold text-slate-950">{application.email}</p>
                {application.phone ? <p className="mt-1 text-slate-600">{application.phone}</p> : null}
                {application.location ? <p className="mt-1 text-slate-600">{application.location}</p> : null}
              </div>
              <div className="rounded-2xl border border-black/5 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Links</p>
                {application.linkedin_url ? (
                  <a
                    href={application.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block font-semibold text-[#8a0917]"
                  >
                    LinkedIn profile
                  </a>
                ) : null}
                {application.portfolio_url ? (
                  <a
                    href={application.portfolio_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block font-semibold text-[#8a0917]"
                  >
                    Portfolio / website
                  </a>
                ) : null}
                {!application.linkedin_url && !application.portfolio_url ? (
                  <p className="mt-3 text-slate-600">No external links shared.</p>
                ) : null}
              </div>
            </div>

            {application.cover_note ? (
              <div className="mt-6 rounded-2xl border border-black/5 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Cover note</p>
                <p className="mt-3 whitespace-pre-wrap text-slate-700">{application.cover_note}</p>
              </div>
            ) : null}

            <div className="mt-6 grid gap-5 md:grid-cols-[0.35fr_1fr]">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Status
                <select
                  className="input"
                  value={draft.status}
                  onChange={(event) => updateDraft(application.id, "status", event.target.value)}
                >
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Review notes
                <textarea
                  className="input min-h-28 resize-y"
                  value={draft.reviewNotes}
                  onChange={(event) => updateDraft(application.id, "reviewNotes", event.target.value)}
                  placeholder="Add internal notes, interview feedback, or next steps."
                />
              </label>
            </div>

            <button
              type="button"
              className="button-primary mt-6 w-fit"
              disabled={isPending}
              onClick={() => {
                setNotice(null);
                startTransition(async () => {
                  try {
                    const response = await fetch(`/api/admin/applications/${application.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(draft),
                    });
                    const payload = (await response.json()) as {
                      error?: string;
                      application?: CareerApplication;
                    };

                    if (!response.ok || !payload.application) {
                      setNotice({
                        type: "error",
                        message: payload.error ?? "Unable to update the application right now.",
                      });
                      return;
                    }

                    setApplications((current) =>
                      current.map((item) =>
                        item.id === payload.application!.id ? payload.application! : item,
                      ),
                    );
                    setDrafts((current) => ({
                      ...current,
                      [payload.application!.id]: {
                        status: payload.application!.status,
                        reviewNotes: payload.application!.review_notes ?? "",
                      },
                    }));
                    setNotice({
                      type: "success",
                      message: `Saved ${payload.application!.full_name}'s application.`,
                    });
                  } catch {
                    setNotice({
                      type: "error",
                      message: "Unable to update the application right now.",
                    });
                  }
                });
              }}
            >
              Save review
            </button>
          </article>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { SubmissionSuccessModal } from "@/components/forms/submission-success-modal";
import {
  TALENT_NETWORK_LABEL,
  type CareerJob,
  formatCareerDate,
  splitMultilineText,
} from "@/lib/careers";

type Notice = { message: string; type: "error" } | null;

export function CareersPortal() {
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let isActive = true;

    async function loadJobs() {
      try {
        const response = await fetch("/api/careers/jobs", { cache: "no-store" });
        const payload = (await response.json()) as { error?: string; jobs?: CareerJob[] };

        if (!isActive) return;

        if (!response.ok) {
          setLoadError(payload.error ?? "Unable to load current roles right now.");
          setJobs([]);
          return;
        }

        setJobs(payload.jobs ?? []);
      } catch {
        if (!isActive) return;
        setLoadError("Unable to load current roles right now.");
        setJobs([]);
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

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4">
        <div className="card">
          <p className="eyebrow">Open positions</p>
          <h3 className="mt-3 text-2xl font-bold text-[#8a0917]">Current opportunities</h3>
          <p className="mt-3 text-slate-600">
            Browse active roles below. If nothing is live right now, you can still use the application
            form to join the talent network for future work.
          </p>
        </div>

        {isLoading ? (
          <div className="card text-slate-600">Loading current roles…</div>
        ) : null}

        {!isLoading && jobs.length === 0 ? (
          <div className="card">
            <p className="eyebrow">No live roles</p>
            <h3 className="mt-3 text-2xl font-bold text-slate-950">Nothing open today</h3>
            <p className="mt-3 text-slate-600">
              We are not advertising an active role right now, but we are happy to hear from strong
              candidates. Use the form to join the talent network and attach your CV.
            </p>
          </div>
        ) : null}

        {!isLoading
          ? jobs.map((job) => {
              const responsibilities = splitMultilineText(job.responsibilities).slice(0, 3);
              return (
                <article
                  key={job.id}
                  className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a0917]">
                        {job.department || "Tacklers Consulting Group"}
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-slate-950">{job.title}</h3>
                      <p className="mt-2 text-sm text-slate-500">
                        {[job.employment_type, job.location_label, job.experience_level]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => {
                        setSelectedJobId(job.id);
                        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      Apply now
                    </button>
                  </div>

                  <p className="mt-4 text-slate-700">{job.summary}</p>
                  <p className="mt-4 leading-8 text-slate-600">{job.description}</p>

                  {responsibilities.length ? (
                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        Focus areas
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        {responsibilities.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-[#8a0917]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <p className="mt-5 text-xs uppercase tracking-[0.14em] text-slate-400">
                    Posted {formatCareerDate(job.created_at)}
                  </p>
                </article>
              );
            })
          : null}

        {loadError ? (
          <div className="card border border-[#8a0917]/10 bg-[#fff4f6] text-[#8a0917]">
            {jobs.length ? loadError : "Roles are unavailable right now, but you can still join the talent network below."}
          </div>
        ) : null}
      </div>

        <form
          id="career-application-form"
          ref={formRef}
          className="card grid gap-5 self-start"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const formData = new FormData(form);
            formData.set("jobId", selectedJob?.id ?? "");
            formData.set("jobTitleSnapshot", selectedJob?.title ?? TALENT_NETWORK_LABEL);
            setNotice(null);
            setSuccessMessage("");

            startTransition(async () => {
              try {
                const response = await fetch("/api/careers/applications", {
                  method: "POST",
                  body: formData,
                });
                const payload = (await response.json()) as { error?: string; message?: string };

                if (!response.ok) {
                  setNotice({
                    type: "error",
                    message: payload.error ?? "Unable to submit your application right now.",
                  });
                  return;
                }

                form.reset();
                setSelectedJobId("");
                setSuccessMessage(payload.message ?? "Application received. We will review it shortly.");
              } catch {
                setNotice({
                  type: "error",
                  message: "Unable to submit your application right now.",
                });
              }
            });
          }}
        >
        <div>
          <p className="eyebrow">Apply now</p>
          <h3 className="mt-3 text-2xl font-bold text-[#8a0917]">Application manager</h3>
          <p className="mt-3 text-slate-600">
            Choose a position, attach your CV, and send the details straight into the recruitment
            workspace.
          </p>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Job position
          <select
            className="input"
            value={selectedJobId}
            onChange={(event) => setSelectedJobId(event.target.value)}
          >
            <option value="">{TALENT_NETWORK_LABEL}</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Full name
            <input className="input" name="fullName" type="text" placeholder="Your full name" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Email
            <input className="input" name="email" type="email" placeholder="you@company.com" required />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Phone
            <input className="input" name="phone" type="tel" placeholder="+44 ..." />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Location
            <input className="input" name="location" type="text" placeholder="City / region" />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            LinkedIn URL
            <input className="input" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/..." />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Portfolio URL
            <input className="input" name="portfolioUrl" type="url" placeholder="https://your-portfolio.com" />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Cover note
          <textarea
            className="input min-h-36 resize-y"
            name="coverNote"
            placeholder="Share the role you are targeting, relevant experience, and why you are a fit."
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          CV / resume attachment
          <input
            className="input"
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            required
          />
          <span className="text-xs text-slate-500">Accepted formats: PDF, DOC, DOCX. Max 10 MB.</span>
        </label>

          {notice ? (
            <div className="rounded-2xl bg-[#fff4f6] px-4 py-3 text-sm font-medium text-[#8a0917]">
              {notice.message}
            </div>
          ) : null}

          <button type="submit" className="button-primary w-full justify-center" disabled={isPending}>
            {isPending ? "Submitting…" : "Send application"}
          </button>
        </form>
      </div>

      <SubmissionSuccessModal
        open={Boolean(successMessage)}
        title="Application sent"
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />
    </>
  );
}

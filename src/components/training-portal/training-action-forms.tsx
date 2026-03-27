"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { requestJson } from "@/components/portal/use-live-api";

type ReferenceOption = {
  id: string;
  label: string;
};

function Notice({ message, tone }: { message: string; tone: "error" | "success" }) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 text-sm ${
        tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      }`}
    >
      {message}
    </div>
  );
}

function FormField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

function textInputClassName() {
  return "w-full rounded-2xl border border-[#e7ddd8] bg-[#faf7f5] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#8a0917]/35 focus:bg-white";
}

export function TrainingCohortForm({
  clients,
  managers,
  programmes,
  trainers,
}: {
  clients: ReferenceOption[];
  managers: ReferenceOption[];
  programmes: ReferenceOption[];
  trainers: ReferenceOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);
  const [form, setForm] = useState({
    clientId: clients[0]?.id ?? "",
    managerAccountId: managers[0]?.id ?? "",
    programmeId: programmes[0]?.id ?? "",
    sponsorEmail: "",
    sponsorName: "",
    startsOn: "",
    title: "",
    trainerAdminId: trainers[0]?.id ?? "",
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(null);
        startTransition(async () => {
          try {
            await requestJson("/api/admin/training/cohorts", {
              body: JSON.stringify({
                ...form,
                managerAccountId: form.managerAccountId || null,
                sponsorEmail: form.sponsorEmail || null,
                sponsorName: form.sponsorName || null,
                startsOn: form.startsOn || null,
                trainerAdminId: form.trainerAdminId || null,
              }),
              method: "POST",
            });
            setNotice({ message: "Training cohort created.", tone: "success" });
            setForm((current) => ({
              ...current,
              sponsorEmail: "",
              sponsorName: "",
              startsOn: "",
              title: "",
            }));
            router.refresh();
          } catch (error) {
            setNotice({
              message: error instanceof Error ? error.message : "Unable to create the cohort.",
              tone: "error",
            });
          }
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Cohort title">
          <input
            className={textInputClassName()}
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Lean Fundamentals Cohort"
            required
          />
        </FormField>
        <FormField label="Start date">
          <input
            className={textInputClassName()}
            type="date"
            value={form.startsOn}
            onChange={(event) => setForm((current) => ({ ...current, startsOn: event.target.value }))}
          />
        </FormField>
        <FormField label="Client">
          <select
            className={textInputClassName()}
            value={form.clientId}
            onChange={(event) => setForm((current) => ({ ...current, clientId: event.target.value }))}
            required
          >
            {clients.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Programme">
          <select
            className={textInputClassName()}
            value={form.programmeId}
            onChange={(event) => setForm((current) => ({ ...current, programmeId: event.target.value }))}
            required
          >
            {programmes.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Lead trainer">
          <select
            className={textInputClassName()}
            value={form.trainerAdminId}
            onChange={(event) => setForm((current) => ({ ...current, trainerAdminId: event.target.value }))}
          >
            <option value="">Assign later</option>
            {trainers.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Client manager">
          <select
            className={textInputClassName()}
            value={form.managerAccountId}
            onChange={(event) => setForm((current) => ({ ...current, managerAccountId: event.target.value }))}
          >
            <option value="">Assign later</option>
            {managers.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Sponsor name">
          <input
            className={textInputClassName()}
            value={form.sponsorName}
            onChange={(event) => setForm((current) => ({ ...current, sponsorName: event.target.value }))}
            placeholder="Operational sponsor"
          />
        </FormField>
        <FormField label="Sponsor email">
          <input
            className={textInputClassName()}
            type="email"
            value={form.sponsorEmail}
            onChange={(event) => setForm((current) => ({ ...current, sponsorEmail: event.target.value }))}
            placeholder="sponsor@client.com"
          />
        </FormField>
      </div>

      {notice ? <Notice message={notice.message} tone={notice.tone} /> : null}

      <button className="button-primary" disabled={isPending} type="submit">
        {isPending ? "Creating cohort..." : "Create cohort"}
      </button>
    </form>
  );
}

export function TrainingSessionForm({
  cohorts,
  modules,
}: {
  cohorts: ReferenceOption[];
  modules: ReferenceOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);
  const [form, setForm] = useState({
    cohortId: cohorts[0]?.id ?? "",
    endsAt: "",
    locationLabel: "Client site training room",
    moduleId: modules[0]?.id ?? "",
    preworkText: "",
    readinessStatus: "not_ready",
    startsAt: "",
    title: "",
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(null);
        startTransition(async () => {
          try {
            await requestJson("/api/admin/training/sessions", {
              body: JSON.stringify({
                ...form,
                endsAt: form.endsAt || null,
                moduleId: form.moduleId || null,
                preworkItems: form.preworkText
                  .split(/\r?\n/)
                  .map((item) => item.trim())
                  .filter(Boolean),
                startsAt: form.startsAt || null,
              }),
              method: "POST",
            });
            setNotice({ message: "Training session scheduled.", tone: "success" });
            setForm((current) => ({
              ...current,
              endsAt: "",
              preworkText: "",
              startsAt: "",
              title: "",
            }));
            router.refresh();
          } catch (error) {
            setNotice({
              message: error instanceof Error ? error.message : "Unable to create the session.",
              tone: "error",
            });
          }
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Session title">
          <input
            className={textInputClassName()}
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Module 4 workshop"
            required
          />
        </FormField>
        <FormField label="Cohort">
          <select
            className={textInputClassName()}
            value={form.cohortId}
            onChange={(event) => setForm((current) => ({ ...current, cohortId: event.target.value }))}
            required
          >
            {cohorts.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Linked module">
          <select
            className={textInputClassName()}
            value={form.moduleId}
            onChange={(event) => setForm((current) => ({ ...current, moduleId: event.target.value }))}
          >
            <option value="">Standalone session</option>
            {modules.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Readiness">
          <select
            className={textInputClassName()}
            value={form.readinessStatus}
            onChange={(event) => setForm((current) => ({ ...current, readinessStatus: event.target.value }))}
          >
            <option value="not_ready">Not ready</option>
            <option value="materials_pending">Materials pending</option>
            <option value="ready">Ready</option>
            <option value="at_risk">At risk</option>
          </select>
        </FormField>
        <FormField label="Starts at">
          <input
            className={textInputClassName()}
            type="datetime-local"
            value={form.startsAt}
            onChange={(event) => setForm((current) => ({ ...current, startsAt: event.target.value }))}
          />
        </FormField>
        <FormField label="Ends at">
          <input
            className={textInputClassName()}
            type="datetime-local"
            value={form.endsAt}
            onChange={(event) => setForm((current) => ({ ...current, endsAt: event.target.value }))}
          />
        </FormField>
      </div>

      <FormField label="Location">
        <input
          className={textInputClassName()}
          value={form.locationLabel}
          onChange={(event) => setForm((current) => ({ ...current, locationLabel: event.target.value }))}
          placeholder="Client site training room"
        />
      </FormField>

      <FormField label="Prework checklist">
        <textarea
          className={`${textInputClassName()} min-h-28`}
          value={form.preworkText}
          onChange={(event) => setForm((current) => ({ ...current, preworkText: event.target.value }))}
          placeholder={"One item per line\nReview workbook\nBring one process example"}
        />
      </FormField>

      {notice ? <Notice message={notice.message} tone={notice.tone} /> : null}

      <button className="button-primary" disabled={isPending} type="submit">
        {isPending ? "Scheduling session..." : "Schedule session"}
      </button>
    </form>
  );
}

export function TrainingLearnerForm({ cohorts }: { cohorts: ReferenceOption[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);
  const [form, setForm] = useState({
    cohortId: cohorts[0]?.id ?? "",
    email: "",
    fullName: "",
    roleSlug: "learner",
    roleTitle: "",
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(null);
        startTransition(async () => {
          try {
            await requestJson("/api/admin/training/learners", {
              body: JSON.stringify(form),
              method: "POST",
            });
            setNotice({ message: "Learner enrolled in the cohort.", tone: "success" });
            setForm((current) => ({
              ...current,
              email: "",
              fullName: "",
              roleTitle: "",
            }));
            router.refresh();
          } catch (error) {
            setNotice({
              message: error instanceof Error ? error.message : "Unable to enrol the learner.",
              tone: "error",
            });
          }
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Full name">
          <input
            className={textInputClassName()}
            value={form.fullName}
            onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
            placeholder="Learner name"
            required
          />
        </FormField>
        <FormField label="Email">
          <input
            className={textInputClassName()}
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="learner@client.com"
            required
          />
        </FormField>
        <FormField label="Cohort">
          <select
            className={textInputClassName()}
            value={form.cohortId}
            onChange={(event) => setForm((current) => ({ ...current, cohortId: event.target.value }))}
            required
          >
            {cohorts.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Cohort role">
          <select
            className={textInputClassName()}
            value={form.roleSlug}
            onChange={(event) => setForm((current) => ({ ...current, roleSlug: event.target.value }))}
          >
            <option value="learner">Learner</option>
            <option value="client_manager">Client manager</option>
          </select>
        </FormField>
      </div>

      <FormField label="Role title">
        <input
          className={textInputClassName()}
          value={form.roleTitle}
          onChange={(event) => setForm((current) => ({ ...current, roleTitle: event.target.value }))}
          placeholder="Operational leader"
        />
      </FormField>

      {notice ? <Notice message={notice.message} tone={notice.tone} /> : null}

      <button className="button-primary" disabled={isPending} type="submit">
        {isPending ? "Enrolling learner..." : "Add learner"}
      </button>
    </form>
  );
}

export function TrainingAssessmentForm({
  cohorts,
  modules,
}: {
  cohorts: ReferenceOption[];
  modules: ReferenceOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);
  const [form, setForm] = useState({
    assessmentType: "quiz",
    cohortId: cohorts[0]?.id ?? "",
    dueAt: "",
    instructions: "",
    moduleId: modules[0]?.id ?? "",
    title: "",
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(null);
        startTransition(async () => {
          try {
            await requestJson("/api/admin/training/assessments", {
              body: JSON.stringify({
                ...form,
                dueAt: form.dueAt || null,
                moduleId: form.moduleId || null,
              }),
              method: "POST",
            });
            setNotice({ message: "Assessment published into the training flow.", tone: "success" });
            setForm((current) => ({
              ...current,
              dueAt: "",
              instructions: "",
              title: "",
            }));
            router.refresh();
          } catch (error) {
            setNotice({
              message: error instanceof Error ? error.message : "Unable to create the assessment.",
              tone: "error",
            });
          }
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Assessment title">
          <input
            className={textInputClassName()}
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Module 3 knowledge check"
            required
          />
        </FormField>
        <FormField label="Assessment type">
          <select
            className={textInputClassName()}
            value={form.assessmentType}
            onChange={(event) => setForm((current) => ({ ...current, assessmentType: event.target.value }))}
          >
            <option value="quiz">Quiz</option>
            <option value="practical">Practical</option>
            <option value="exam">Exam</option>
            <option value="reflection">Reflection</option>
          </select>
        </FormField>
        <FormField label="Cohort">
          <select
            className={textInputClassName()}
            value={form.cohortId}
            onChange={(event) => setForm((current) => ({ ...current, cohortId: event.target.value }))}
            required
          >
            {cohorts.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Module">
          <select
            className={textInputClassName()}
            value={form.moduleId}
            onChange={(event) => setForm((current) => ({ ...current, moduleId: event.target.value }))}
          >
            <option value="">Standalone assessment</option>
            {modules.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Due at">
          <input
            className={textInputClassName()}
            type="datetime-local"
            value={form.dueAt}
            onChange={(event) => setForm((current) => ({ ...current, dueAt: event.target.value }))}
          />
        </FormField>
      </div>

      <FormField label="Instructions">
        <textarea
          className={`${textInputClassName()} min-h-28`}
          value={form.instructions}
          onChange={(event) => setForm((current) => ({ ...current, instructions: event.target.value }))}
          placeholder="Explain what good evidence looks like and how the learner will be marked."
        />
      </FormField>

      {notice ? <Notice message={notice.message} tone={notice.tone} /> : null}

      <button className="button-primary" disabled={isPending} type="submit">
        {isPending ? "Publishing assessment..." : "Create assessment"}
      </button>
    </form>
  );
}

export function TrainingResourceForm({
  cohorts,
  modules,
  programmes,
}: {
  cohorts: ReferenceOption[];
  modules: ReferenceOption[];
  programmes: ReferenceOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);
  const [form, setForm] = useState({
    audienceRoleSlug: "all",
    cohortId: cohorts[0]?.id ?? "",
    href: "",
    moduleId: modules[0]?.id ?? "",
    programmeId: programmes[0]?.id ?? "",
    resourceKind: "workbook",
    summary: "",
    title: "",
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(null);
        startTransition(async () => {
          try {
            await requestJson("/api/admin/training/resources", {
              body: JSON.stringify({
                ...form,
                cohortId: form.cohortId || null,
                href: form.href || null,
                moduleId: form.moduleId || null,
                programmeId: form.programmeId || null,
                summary: form.summary || null,
              }),
              method: "POST",
            });
            setNotice({ message: "Training resource released.", tone: "success" });
            setForm((current) => ({
              ...current,
              href: "",
              summary: "",
              title: "",
            }));
            router.refresh();
          } catch (error) {
            setNotice({
              message: error instanceof Error ? error.message : "Unable to create the resource.",
              tone: "error",
            });
          }
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Resource title">
          <input
            className={textInputClassName()}
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Module 4 participant pack"
            required
          />
        </FormField>
        <FormField label="Audience">
          <select
            className={textInputClassName()}
            value={form.audienceRoleSlug}
            onChange={(event) => setForm((current) => ({ ...current, audienceRoleSlug: event.target.value }))}
          >
            <option value="all">All roles</option>
            <option value="learner">Learners</option>
            <option value="client_manager">Client managers</option>
            <option value="trainer">Trainers</option>
          </select>
        </FormField>
        <FormField label="Programme">
          <select
            className={textInputClassName()}
            value={form.programmeId}
            onChange={(event) => setForm((current) => ({ ...current, programmeId: event.target.value }))}
          >
            <option value="">No programme link</option>
            {programmes.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Cohort">
          <select
            className={textInputClassName()}
            value={form.cohortId}
            onChange={(event) => setForm((current) => ({ ...current, cohortId: event.target.value }))}
          >
            <option value="">Programme-wide resource</option>
            {cohorts.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Module">
          <select
            className={textInputClassName()}
            value={form.moduleId}
            onChange={(event) => setForm((current) => ({ ...current, moduleId: event.target.value }))}
          >
            <option value="">No module link</option>
            {modules.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Resource type">
          <select
            className={textInputClassName()}
            value={form.resourceKind}
            onChange={(event) => setForm((current) => ({ ...current, resourceKind: event.target.value }))}
          >
            <option value="prework">Prework</option>
            <option value="workbook">Workbook</option>
            <option value="template">Template</option>
            <option value="revision_guide">Revision guide</option>
            <option value="recording">Recording</option>
            <option value="manager_pack">Manager pack</option>
            <option value="facilitator_pack">Facilitator pack</option>
          </select>
        </FormField>
      </div>

      <FormField label="Link or download URL">
        <input
          className={textInputClassName()}
          value={form.href}
          onChange={(event) => setForm((current) => ({ ...current, href: event.target.value }))}
          placeholder="https://..."
        />
      </FormField>

      <FormField label="Summary">
        <textarea
          className={`${textInputClassName()} min-h-24`}
          value={form.summary}
          onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
          placeholder="What this resource is for and when it should be used."
        />
      </FormField>

      {notice ? <Notice message={notice.message} tone={notice.tone} /> : null}

      <button className="button-primary" disabled={isPending} type="submit">
        {isPending ? "Publishing resource..." : "Release resource"}
      </button>
    </form>
  );
}

export function LearnerAssessmentSubmitForm({
  assessmentId,
  disabled,
  existingSubmission,
}: {
  assessmentId: string;
  disabled?: boolean;
  existingSubmission?: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);
  const [submissionText, setSubmissionText] = useState(existingSubmission ?? "");

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(null);
        startTransition(async () => {
          try {
            await requestJson(`/api/client/training/assessments/${assessmentId}`, {
              body: JSON.stringify({ submissionText }),
              method: "POST",
            });
            setNotice({ message: "Assessment evidence submitted.", tone: "success" });
            router.refresh();
          } catch (error) {
            setNotice({
              message: error instanceof Error ? error.message : "Unable to submit your evidence.",
              tone: "error",
            });
          }
        });
      }}
    >
      <FormField label="Submission or evidence summary">
        <textarea
          className={`${textInputClassName()} min-h-28`}
          value={submissionText}
          onChange={(event) => setSubmissionText(event.target.value)}
          disabled={disabled || isPending}
          placeholder="Describe what you observed, what you changed, and the evidence that supports it."
          required
        />
      </FormField>

      {notice ? <Notice message={notice.message} tone={notice.tone} /> : null}

      <button className="button-primary" disabled={disabled || isPending} type="submit">
        {isPending ? "Submitting..." : "Submit evidence"}
      </button>
    </form>
  );
}

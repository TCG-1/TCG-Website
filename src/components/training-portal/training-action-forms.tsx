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
    facilitatorNotes: "",
    followUpActions: "",
    locationLabel: "Client site training room",
    moduleId: modules[0]?.id ?? "",
    preworkText: "",
    readinessStatus: "not_ready",
    startsAt: "",
    title: "",
    virtualLink: "",
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
                facilitatorNotes: form.facilitatorNotes || null,
                followUpActions: form.followUpActions || null,
                moduleId: form.moduleId || null,
                preworkItems: form.preworkText
                  .split(/\r?\n/)
                  .map((item) => item.trim())
                  .filter(Boolean),
                startsAt: form.startsAt || null,
                virtualLink: form.virtualLink || null,
              }),
              method: "POST",
            });
            setNotice({ message: "Training session scheduled.", tone: "success" });
            setForm((current) => ({
              ...current,
              endsAt: "",
              facilitatorNotes: "",
              followUpActions: "",
              preworkText: "",
              startsAt: "",
              title: "",
              virtualLink: "",
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

      <FormField label="Virtual link">
        <input
          className={textInputClassName()}
          type="url"
          value={form.virtualLink}
          onChange={(event) => setForm((current) => ({ ...current, virtualLink: event.target.value }))}
          placeholder="https://meet.google.com/..."
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

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Facilitator notes">
          <textarea
            className={`${textInputClassName()} min-h-24`}
            value={form.facilitatorNotes}
            onChange={(event) => setForm((current) => ({ ...current, facilitatorNotes: event.target.value }))}
            placeholder="Internal trainer context, setup details, or coaching notes."
          />
        </FormField>
        <FormField label="Follow-up actions">
          <textarea
            className={`${textInputClassName()} min-h-24`}
            value={form.followUpActions}
            onChange={(event) => setForm((current) => ({ ...current, followUpActions: event.target.value }))}
            placeholder="Actions learners should take after the session."
          />
        </FormField>
      </div>

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
            setNotice({ message: "Learner invited and added to the cohort.", tone: "success" });
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
    maxAttempts: "2",
    maxScore: "100",
    moduleId: modules[0]?.id ?? "",
    passScore: "80",
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
                maxAttempts: form.maxAttempts ? Number(form.maxAttempts) : null,
                maxScore: form.maxScore ? Number(form.maxScore) : null,
                moduleId: form.moduleId || null,
                passScore: form.passScore ? Number(form.passScore) : null,
              }),
              method: "POST",
            });
            setNotice({ message: "Assessment published into the training flow.", tone: "success" });
            setForm((current) => ({
              ...current,
              dueAt: "",
              instructions: "",
              maxAttempts: "2",
              maxScore: "100",
              passScore: "80",
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
        <FormField label="Max score">
          <input
            className={textInputClassName()}
            inputMode="decimal"
            value={form.maxScore}
            onChange={(event) => setForm((current) => ({ ...current, maxScore: event.target.value }))}
            placeholder="100"
          />
        </FormField>
        <FormField label="Pass score">
          <input
            className={textInputClassName()}
            inputMode="decimal"
            value={form.passScore}
            onChange={(event) => setForm((current) => ({ ...current, passScore: event.target.value }))}
            placeholder="80"
          />
        </FormField>
        <FormField label="Max attempts">
          <input
            className={textInputClassName()}
            inputMode="numeric"
            value={form.maxAttempts}
            onChange={(event) => setForm((current) => ({ ...current, maxAttempts: event.target.value }))}
            placeholder="2"
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
    status: "released",
    summary: "",
    title: "",
    versionLabel: "v1.0",
    visibleFrom: "",
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
                status: form.status,
                summary: form.summary || null,
                versionLabel: form.versionLabel || null,
                visibleFrom: form.visibleFrom || null,
              }),
              method: "POST",
            });
            setNotice({ message: "Training resource released.", tone: "success" });
            setForm((current) => ({
              ...current,
              href: "",
              summary: "",
              title: "",
              versionLabel: "v1.0",
              visibleFrom: "",
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
        <FormField label="Status">
          <select
            className={textInputClassName()}
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
          >
            <option value="draft">Draft</option>
            <option value="released">Released</option>
            <option value="retired">Retired</option>
          </select>
        </FormField>
        <FormField label="Version label">
          <input
            className={textInputClassName()}
            value={form.versionLabel}
            onChange={(event) => setForm((current) => ({ ...current, versionLabel: event.target.value }))}
            placeholder="v1.0"
          />
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

      <FormField label="Visible from">
        <input
          className={textInputClassName()}
          type="datetime-local"
          value={form.visibleFrom}
          onChange={(event) => setForm((current) => ({ ...current, visibleFrom: event.target.value }))}
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
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(null);
        startTransition(async () => {
          try {
            const formData = new FormData();
            formData.set("submissionText", submissionText);
            if (evidenceFile) {
              formData.set("evidenceFile", evidenceFile);
            }

            const response = await fetch(`/api/client/training/assessments/${assessmentId}`, {
              body: formData,
              method: "POST",
            });
            const payload = (await response.json().catch(() => ({}))) as { error?: string };

            if (!response.ok) {
              throw new Error(payload.error ?? "Unable to submit your evidence.");
            }

            setNotice({ message: "Assessment evidence submitted.", tone: "success" });
            setEvidenceFile(null);
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

      <FormField label="Evidence file">
        <input
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg"
          className={textInputClassName()}
          disabled={disabled || isPending}
          onChange={(event) => setEvidenceFile(event.target.files?.[0] ?? null)}
          type="file"
        />
      </FormField>
      <p className="text-xs leading-6 text-slate-500">
        Accepted formats: PDF, Office docs, CSV, TXT, PNG, JPG, and JPEG up to 10 MB.
      </p>

      {notice ? <Notice message={notice.message} tone={notice.tone} /> : null}

      <button className="button-primary" disabled={disabled || isPending} type="submit">
        {isPending ? "Submitting..." : "Submit evidence"}
      </button>
    </form>
  );
}

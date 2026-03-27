"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { requestJson } from "@/components/portal/use-live-api";
import type {
  AdminAssessmentOperation,
  AdminCohortOperation,
  AdminCertificationWorkspace,
  AdminResourceWorkspace,
  AdminRoleWorkspace,
  AdminSessionOperation,
  ClientTrainingWorkspace,
  TrainingRoleSlug,
} from "@/lib/training-system";

function textInputClassName() {
  return "w-full rounded-2xl border border-[#e7ddd8] bg-[#faf7f5] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#8a0917]/35 focus:bg-white";
}

function Notice({ message, tone }: { message: string; tone: "error" | "success" }) {
  return (
    <div className={`rounded-2xl px-4 py-3 text-sm ${tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
      {message}
    </div>
  );
}

function StatusBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#f2e9e5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">
      {children}
    </span>
  );
}

function formatFileSizeLabel(value?: number | null) {
  if (!value) {
    return "Size unavailable";
  }

  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (value >= 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${value} B`;
}

function CohortCard({
  canManage,
  cohort,
  managers,
  trainers,
}: {
  canManage: boolean;
  cohort: AdminCohortOperation;
  managers: Array<{ id: string; label: string }>;
  trainers: Array<{ id: string; label: string }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);
  const [cohortForm, setCohortForm] = useState({
    deliveryMode: cohort.deliveryMode,
    endsOn: cohort.endsOn ?? "",
    managerAccountId: cohort.managerAccountId ?? "",
    notes: cohort.notes ?? "",
    sponsorEmail: cohort.sponsorEmail ?? "",
    sponsorName: cohort.sponsorName ?? "",
    startsOn: cohort.startsOn ?? "",
    status: cohort.status,
    title: cohort.title,
    trainerAdminId: cohort.trainerAdminId ?? "",
  });
  const [trainerAssignment, setTrainerAssignment] = useState({
    roleLabel: "Trainer",
    trainerAdminId: "",
  });

  return (
    <article className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">{cohort.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {cohort.clientName} • {cohort.programmeTitle} • {cohort.code}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge>{cohort.statusLabel}</StatusBadge>
            <StatusBadge>{cohort.deliveryModeLabel}</StatusBadge>
            <StatusBadge>{cohort.learnerCount} learners</StatusBadge>
            <StatusBadge>{cohort.upcomingSessionCount} upcoming sessions</StatusBadge>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Starts {cohort.startsOnLabel} • Ends {cohort.endsOnLabel}
            {cohort.managerName ? ` • Manager ${cohort.managerName}` : ""}
            {cohort.trainerName ? ` • Trainer ${cohort.trainerName}` : ""}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {cohort.trainers.length ? cohort.trainers.map((trainer) => (
              <span
                key={`${cohort.cohortId}-${trainer.adminAccountId}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700"
              >
                <span>{trainer.name}</span>
                <span className="text-slate-400">•</span>
                <span>{trainer.roleLabel}</span>
                {trainer.isPrimary ? <span className="text-[#8a0917]">Lead</span> : null}
                {canManage ? (
                  <button
                    className="text-[#8a0917] transition hover:text-[#690711]"
                    disabled={isPending}
                    onClick={() => {
                      setNotice(null);
                      startTransition(async () => {
                        try {
                          await requestJson(`/api/admin/training/cohorts/${cohort.cohortId}/trainers`, {
                            body: JSON.stringify({
                              trainerAdminId: trainer.adminAccountId,
                            }),
                            method: "DELETE",
                          });
                          setNotice({ message: `${trainer.name} removed from this cohort.`, tone: "success" });
                          router.refresh();
                        } catch (error) {
                          setNotice({
                            message: error instanceof Error ? error.message : "Unable to remove the trainer assignment.",
                            tone: "error",
                          });
                        }
                      });
                    }}
                    type="button"
                  >
                    Remove
                  </button>
                ) : null}
              </span>
            )) : (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                No secondary trainers assigned
              </span>
            )}
          </div>
        </div>
      </div>

      {canManage ? (
        <div className="mt-6 grid gap-4 rounded-[1.25rem] bg-white p-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Cohort title</span>
            <input
              className={textInputClassName()}
              disabled={isPending}
              value={cohortForm.title}
              onChange={(event) => setCohortForm((current) => ({ ...current, title: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Delivery mode</span>
            <select
              className={textInputClassName()}
              disabled={isPending}
              value={cohortForm.deliveryMode}
              onChange={(event) => setCohortForm((current) => ({ ...current, deliveryMode: event.target.value }))}
            >
              <option value="onsite">On-site</option>
              <option value="virtual">Virtual</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Starts on</span>
            <input
              className={textInputClassName()}
              disabled={isPending}
              type="date"
              value={cohortForm.startsOn}
              onChange={(event) => setCohortForm((current) => ({ ...current, startsOn: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Ends on</span>
            <input
              className={textInputClassName()}
              disabled={isPending}
              type="date"
              value={cohortForm.endsOn}
              onChange={(event) => setCohortForm((current) => ({ ...current, endsOn: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Lead trainer</span>
            <select
              className={textInputClassName()}
              disabled={isPending}
              value={cohortForm.trainerAdminId}
              onChange={(event) => setCohortForm((current) => ({ ...current, trainerAdminId: event.target.value }))}
            >
              <option value="">Assign later</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Client manager</span>
            <select
              className={textInputClassName()}
              disabled={isPending}
              value={cohortForm.managerAccountId}
              onChange={(event) => setCohortForm((current) => ({ ...current, managerAccountId: event.target.value }))}
            >
              <option value="">Assign later</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Sponsor name</span>
            <input
              className={textInputClassName()}
              disabled={isPending}
              value={cohortForm.sponsorName}
              onChange={(event) => setCohortForm((current) => ({ ...current, sponsorName: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Sponsor email</span>
            <input
              className={textInputClassName()}
              disabled={isPending}
              type="email"
              value={cohortForm.sponsorEmail}
              onChange={(event) => setCohortForm((current) => ({ ...current, sponsorEmail: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Status</span>
            <select
              className={textInputClassName()}
              disabled={isPending}
              value={cohortForm.status}
              onChange={(event) => setCohortForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span>Delivery notes</span>
            <textarea
              className={`${textInputClassName()} min-h-24`}
              disabled={isPending}
              value={cohortForm.notes}
              onChange={(event) => setCohortForm((current) => ({ ...current, notes: event.target.value }))}
            />
          </label>
          <div className="grid gap-4 rounded-[1.2rem] border border-[#ece1dc] bg-[#faf7f5] p-4 md:col-span-2 md:grid-cols-[1fr_0.8fr_auto]">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>Secondary trainer</span>
              <select
                className={textInputClassName()}
                disabled={isPending}
                value={trainerAssignment.trainerAdminId}
                onChange={(event) =>
                  setTrainerAssignment((current) => ({ ...current, trainerAdminId: event.target.value }))
                }
              >
                <option value="">Choose trainer</option>
                {trainers
                  .filter((trainer) => !cohort.trainers.some((assigned) => assigned.adminAccountId === trainer.id))
                  .map((trainer) => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.label}
                    </option>
                  ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>Assignment label</span>
              <input
                className={textInputClassName()}
                disabled={isPending}
                value={trainerAssignment.roleLabel}
                onChange={(event) => setTrainerAssignment((current) => ({ ...current, roleLabel: event.target.value }))}
                placeholder="Trainer"
              />
            </label>
            <button
              className="button-secondary self-end"
              disabled={isPending || !trainerAssignment.trainerAdminId}
              onClick={() => {
                setNotice(null);
                startTransition(async () => {
                  try {
                    await requestJson(`/api/admin/training/cohorts/${cohort.cohortId}/trainers`, {
                      body: JSON.stringify({
                        roleLabel: trainerAssignment.roleLabel || "Trainer",
                        trainerAdminId: trainerAssignment.trainerAdminId,
                      }),
                      method: "POST",
                    });
                    setNotice({ message: "Secondary trainer assigned.", tone: "success" });
                    setTrainerAssignment({ roleLabel: "Trainer", trainerAdminId: "" });
                    router.refresh();
                  } catch (error) {
                    setNotice({
                      message: error instanceof Error ? error.message : "Unable to add the trainer assignment.",
                      tone: "error",
                    });
                  }
                });
              }}
              type="button"
            >
              Add trainer
            </button>
          </div>
        </div>
      ) : null}

      {canManage ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="button-secondary"
            disabled={isPending}
            onClick={() => {
              setNotice(null);
              startTransition(async () => {
                try {
                  await requestJson(`/api/admin/training/cohorts/${cohort.cohortId}`, {
                    body: JSON.stringify({
                      action: "save",
                      deliveryMode: cohortForm.deliveryMode,
                      endsOn: cohortForm.endsOn || null,
                      managerAccountId: cohortForm.managerAccountId || null,
                      notes: cohortForm.notes || null,
                      sponsorEmail: cohortForm.sponsorEmail || null,
                      sponsorName: cohortForm.sponsorName || null,
                      startsOn: cohortForm.startsOn || null,
                      status: cohortForm.status,
                      title: cohortForm.title,
                      trainerAdminId: cohortForm.trainerAdminId || null,
                    }),
                    method: "PATCH",
                  });
                  setNotice({ message: "Cohort details updated.", tone: "success" });
                  router.refresh();
                } catch (error) {
                  setNotice({
                    message: error instanceof Error ? error.message : "Unable to save cohort changes.",
                    tone: "error",
                  });
                }
              });
            }}
            type="button"
          >
            Save cohort
          </button>
          <button
            className="button-secondary"
            disabled={isPending}
            onClick={() => {
              setNotice(null);
              startTransition(async () => {
                try {
                  await requestJson(`/api/admin/training/cohorts/${cohort.cohortId}`, {
                    body: JSON.stringify({
                      action: "reschedule",
                      deliveryMode: cohortForm.deliveryMode,
                      endsOn: cohortForm.endsOn || null,
                      managerAccountId: cohortForm.managerAccountId || null,
                      notes: cohortForm.notes || null,
                      sponsorEmail: cohortForm.sponsorEmail || null,
                      sponsorName: cohortForm.sponsorName || null,
                      startsOn: cohortForm.startsOn || null,
                      title: cohortForm.title,
                      trainerAdminId: cohortForm.trainerAdminId || null,
                    }),
                    method: "PATCH",
                  });
                  setNotice({ message: "Cohort rescheduled and portal users notified.", tone: "success" });
                  router.refresh();
                } catch (error) {
                  setNotice({
                    message: error instanceof Error ? error.message : "Unable to reschedule the cohort.",
                    tone: "error",
                  });
                }
              });
            }}
            type="button"
          >
            Reschedule cohort
          </button>
          <button
            className="button-secondary"
            disabled={isPending}
            onClick={() => {
              setNotice(null);
              startTransition(async () => {
                try {
                  await requestJson(`/api/admin/training/cohorts/${cohort.cohortId}`, {
                    body: JSON.stringify({ action: "cancel" }),
                    method: "PATCH",
                  });
                  setNotice({ message: "Cohort cancelled and linked sessions closed.", tone: "success" });
                  router.refresh();
                } catch (error) {
                  setNotice({
                    message: error instanceof Error ? error.message : "Unable to cancel the cohort.",
                    tone: "error",
                  });
                }
              });
            }}
            type="button"
          >
            Cancel cohort
          </button>
          <button
            className="button-secondary"
            disabled={isPending}
            onClick={() => {
              setNotice(null);
              startTransition(async () => {
                try {
                  await requestJson(`/api/admin/training/cohorts/${cohort.cohortId}`, {
                    body: JSON.stringify({
                      action: "closeout",
                      endsOn: cohortForm.endsOn || null,
                    }),
                    method: "PATCH",
                  });
                  setNotice({ message: "Cohort closed out and certification review finalised.", tone: "success" });
                  router.refresh();
                } catch (error) {
                  setNotice({
                    message: error instanceof Error ? error.message : "Unable to close out the cohort.",
                    tone: "error",
                  });
                }
              });
            }}
            type="button"
          >
            Close out cohort
          </button>
          <button
            className="button-secondary"
            disabled={isPending}
            onClick={() => {
              setNotice(null);
              startTransition(async () => {
                try {
                  await requestJson(`/api/admin/training/cohorts/${cohort.cohortId}`, {
                    body: JSON.stringify({ action: "archive" }),
                    method: "PATCH",
                  });
                  setNotice({ message: "Cohort archived and live delivery items retired.", tone: "success" });
                  router.refresh();
                } catch (error) {
                  setNotice({
                    message: error instanceof Error ? error.message : "Unable to archive the cohort.",
                    tone: "error",
                  });
                }
              });
            }}
            type="button"
          >
            Archive cohort
          </button>
        </div>
      ) : null}

      {notice ? <div className="mt-4"><Notice message={notice.message} tone={notice.tone} /></div> : null}
    </article>
  );
}

export function TrainingCohortManager({
  canManage,
  cohorts,
  managers,
  trainers,
}: {
  canManage: boolean;
  cohorts: AdminCohortOperation[];
  managers: Array<{ id: string; label: string }>;
  trainers: Array<{ id: string; label: string }>;
}) {
  if (!cohorts.length) {
    return <p className="text-sm leading-6 text-slate-600">No cohorts have been created yet, so there is nothing to manage.</p>;
  }

  return (
    <div className="space-y-4">
      {cohorts.map((cohort) => (
        <CohortCard
          key={cohort.cohortId}
          canManage={canManage}
          cohort={cohort}
          managers={managers}
          trainers={trainers}
        />
      ))}
    </div>
  );
}

function AttendanceCard({
  canManage,
  session,
}: {
  canManage: boolean;
  session: AdminSessionOperation;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);
  const [markComplete, setMarkComplete] = useState(session.statusLabel === "Completed");
  const [sessionForm, setSessionForm] = useState({
    endsAt: session.endsAt ? session.endsAt.slice(0, 16) : "",
    facilitatorNotes: session.facilitatorNotes ?? "",
    followUpActions: session.followUpActions ?? "",
    locationLabel: session.locationLabel ?? "",
    readinessStatus: session.readinessStatus,
    startsAt: session.startsAt ? session.startsAt.slice(0, 16) : "",
    status: session.status,
    summary: session.summary ?? "",
    title: session.title,
    virtualLink: session.virtualLink ?? "",
  });
  const [preworkState, setPreworkState] = useState(
    Object.fromEntries(
      session.prework.flatMap((item) =>
        item.learnerStates.map((state) => [
          `${item.itemId}:${state.membershipId}`,
          { note: state.note ?? "", status: state.status },
        ]),
      ),
    ) as Record<string, { note: string; status: "approved" | "done" | "todo" }>,
  );
  const [roster, setRoster] = useState(
    session.roster.map((item) => ({
      ...item,
      attendanceNote: item.attendanceNote ?? "",
    })),
  );

  return (
    <article className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">{session.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {session.cohortTitle} • {session.startsAtLabel} • {session.deliveryModeLabel}
            {session.moduleTitle ? ` • ${session.moduleTitle}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge>{session.statusLabel}</StatusBadge>
            <StatusBadge>{session.readinessLabel}</StatusBadge>
            <StatusBadge>{session.attendanceCounts.attended} attended</StatusBadge>
            <StatusBadge>{session.attendanceCounts.missed} missed</StatusBadge>
          </div>
        </div>

        {canManage ? (
          <button
            className="button-secondary"
            disabled={isPending}
            onClick={() => {
              setNotice(null);
              startTransition(async () => {
                try {
                  const payload = await requestJson<{ reminded: number }>(`/api/admin/training/sessions/${session.sessionId}/reminders`, {
                    method: "POST",
                  });
                  setNotice({ message: `Reminder sent to ${payload.reminded} cohort member${payload.reminded === 1 ? "" : "s"}.`, tone: "success" });
                  router.refresh();
                } catch (error) {
                  setNotice({
                    message: error instanceof Error ? error.message : "Unable to send session reminders.",
                    tone: "error",
                  });
                }
              });
            }}
            type="button"
          >
            Send reminder
          </button>
        ) : null}
      </div>

      {canManage ? (
        <div className="mt-6 grid gap-4 rounded-[1.25rem] bg-white p-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Session title</span>
            <input
              className={textInputClassName()}
              disabled={isPending}
              value={sessionForm.title}
              onChange={(event) => setSessionForm((current) => ({ ...current, title: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Location</span>
            <input
              className={textInputClassName()}
              disabled={isPending}
              value={sessionForm.locationLabel}
              onChange={(event) => setSessionForm((current) => ({ ...current, locationLabel: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Starts at</span>
            <input
              className={textInputClassName()}
              disabled={isPending}
              type="datetime-local"
              value={sessionForm.startsAt}
              onChange={(event) => setSessionForm((current) => ({ ...current, startsAt: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Ends at</span>
            <input
              className={textInputClassName()}
              disabled={isPending}
              type="datetime-local"
              value={sessionForm.endsAt}
              onChange={(event) => setSessionForm((current) => ({ ...current, endsAt: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Readiness</span>
            <select
              className={textInputClassName()}
              disabled={isPending}
              value={sessionForm.readinessStatus}
              onChange={(event) => setSessionForm((current) => ({ ...current, readinessStatus: event.target.value }))}
            >
              <option value="not_ready">Not ready</option>
              <option value="materials_pending">Materials pending</option>
              <option value="ready">Ready</option>
              <option value="at_risk">At risk</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Status</span>
            <select
              className={textInputClassName()}
              disabled={isPending}
              value={sessionForm.status}
              onChange={(event) => setSessionForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span>Virtual link</span>
            <input
              className={textInputClassName()}
              disabled={isPending}
              placeholder="https://meet.google.com/..."
              type="url"
              value={sessionForm.virtualLink}
              onChange={(event) => setSessionForm((current) => ({ ...current, virtualLink: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span>Session summary</span>
            <textarea
              className={`${textInputClassName()} min-h-24`}
              disabled={isPending}
              value={sessionForm.summary}
              onChange={(event) => setSessionForm((current) => ({ ...current, summary: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Facilitator notes</span>
            <textarea
              className={`${textInputClassName()} min-h-24`}
              disabled={isPending}
              value={sessionForm.facilitatorNotes}
              onChange={(event) => setSessionForm((current) => ({ ...current, facilitatorNotes: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Follow-up actions</span>
            <textarea
              className={`${textInputClassName()} min-h-24`}
              disabled={isPending}
              value={sessionForm.followUpActions}
              onChange={(event) => setSessionForm((current) => ({ ...current, followUpActions: event.target.value }))}
            />
          </label>
        </div>
      ) : null}

      {(session.virtualLink || session.facilitatorNotes || session.followUpActions) ? (
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.25rem] bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Virtual link</p>
            <div className="mt-2 text-sm leading-6 text-slate-700">
              {session.virtualLink ? (
                <a
                  className="text-[#8a0917] underline-offset-4 transition hover:underline"
                  href={session.virtualLink}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open session link
                </a>
              ) : (
                "No virtual link published for this session."
              )}
            </div>
          </div>
          <div className="rounded-[1.25rem] bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Facilitator notes</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {session.facilitatorNotes ?? "No facilitator notes added yet."}
            </p>
          </div>
          <div className="rounded-[1.25rem] bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Follow-up actions</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {session.followUpActions ?? "No follow-up actions recorded yet."}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {roster.map((entry, index) => (
          <div key={entry.membershipId} className="grid gap-3 rounded-[1.25rem] bg-white p-4 md:grid-cols-[1.2fr_0.8fr_1fr]">
            <div>
              <p className="text-sm font-semibold text-slate-950">{entry.learnerName}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{entry.roleSlug.replace("_", " ")}</p>
              <p className="mt-2 text-sm text-slate-600">{entry.learnerEmail}</p>
            </div>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>Attendance</span>
              <select
                className={textInputClassName()}
                disabled={!canManage || isPending}
                value={entry.attendanceStatus}
                onChange={(event) => {
                  const nextValue = event.target.value as AdminSessionOperation["roster"][number]["attendanceStatus"];
                  setRoster((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? { ...item, attendanceStatus: nextValue } : item)),
                  );
                }}
              >
                <option value="expected">Expected</option>
                <option value="attended">Attended</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
                <option value="missed">Missed</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>Trainer note</span>
              <input
                className={textInputClassName()}
                disabled={!canManage || isPending}
                value={entry.attendanceNote}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setRoster((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? { ...item, attendanceNote: nextValue } : item)),
                  );
                }}
                placeholder="Optional follow-up note"
              />
            </label>
          </div>
        ))}
      </div>

      {session.prework.length ? (
        <div className="mt-6 space-y-4">
          {session.prework.map((item) => (
            <div key={item.itemId} className="rounded-[1.25rem] bg-white p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.description ?? "Prework item linked to this session."}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge>{item.statusCounts.todo} todo</StatusBadge>
                  <StatusBadge>{item.statusCounts.done} done</StatusBadge>
                  <StatusBadge>{item.statusCounts.approved} approved</StatusBadge>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {item.learnerStates.map((state) => {
                  const stateKey = `${item.itemId}:${state.membershipId}`;
                  const currentState = preworkState[stateKey] ?? { note: "", status: state.status };

                  return (
                    <div key={stateKey} className="grid gap-3 rounded-2xl border border-[#ece1dc] bg-[#faf7f5] p-4 md:grid-cols-[1fr_0.8fr_1fr_auto]">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{state.learnerName}</p>
                      </div>
                      <label className="grid gap-2 text-sm font-medium text-slate-700">
                        <span>Prework status</span>
                        <select
                          className={textInputClassName()}
                          disabled={!canManage || isPending}
                          value={currentState.status}
                          onChange={(event) =>
                            setPreworkState((current) => ({
                              ...current,
                              [stateKey]: {
                                ...(current[stateKey] ?? { note: "" }),
                                status: event.target.value as "approved" | "done" | "todo",
                              },
                            }))
                          }
                        >
                          <option value="todo">Todo</option>
                          <option value="done">Done</option>
                          <option value="approved">Approved</option>
                        </select>
                      </label>
                      <label className="grid gap-2 text-sm font-medium text-slate-700">
                        <span>Note</span>
                        <input
                          className={textInputClassName()}
                          disabled={!canManage || isPending}
                          value={currentState.note}
                          onChange={(event) =>
                            setPreworkState((current) => ({
                              ...current,
                              [stateKey]: {
                                ...(current[stateKey] ?? { status: state.status }),
                                note: event.target.value,
                              },
                            }))
                          }
                        />
                      </label>
                      {canManage ? (
                        <button
                          className="button-secondary self-end"
                          disabled={isPending}
                          onClick={() => {
                            setNotice(null);
                            startTransition(async () => {
                              try {
                                await requestJson(`/api/admin/training/prework/${item.itemId}`, {
                                  body: JSON.stringify({
                                    membershipId: state.membershipId,
                                    note: currentState.note || null,
                                    status: currentState.status,
                                  }),
                                  method: "PATCH",
                                });
                                setNotice({ message: `Prework updated for ${state.learnerName}.`, tone: "success" });
                                router.refresh();
                              } catch (error) {
                                setNotice({
                                  message: error instanceof Error ? error.message : "Unable to update prework.",
                                  tone: "error",
                                });
                              }
                            });
                          }}
                          type="button"
                        >
                          Save prework
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {canManage ? (
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              checked={markComplete}
              className="h-4 w-4 rounded border-slate-300 text-[#8a0917] focus:ring-[#8a0917]"
              disabled={isPending}
              onChange={(event) => setMarkComplete(event.target.checked)}
              type="checkbox"
            />
            Mark session complete after saving attendance
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              className="button-secondary"
              disabled={isPending}
              onClick={() => {
                setNotice(null);
                startTransition(async () => {
                  try {
                    await requestJson(`/api/admin/training/sessions/${session.sessionId}`, {
                      body: JSON.stringify({
                        action: "save",
                        endsAt: sessionForm.endsAt || null,
                        facilitatorNotes: sessionForm.facilitatorNotes || null,
                        followUpActions: sessionForm.followUpActions || null,
                        locationLabel: sessionForm.locationLabel || null,
                        readinessStatus: sessionForm.readinessStatus,
                        startsAt: sessionForm.startsAt || null,
                        status: sessionForm.status,
                        summary: sessionForm.summary || null,
                        title: sessionForm.title,
                        virtualLink: sessionForm.virtualLink || null,
                      }),
                      method: "PATCH",
                    });
                    setNotice({ message: "Session details updated.", tone: "success" });
                    router.refresh();
                  } catch (error) {
                    setNotice({
                      message: error instanceof Error ? error.message : "Unable to save session changes.",
                      tone: "error",
                    });
                  }
                });
              }}
              type="button"
            >
              Save session
            </button>
            <button
              className="button-secondary"
              disabled={isPending}
              onClick={() => {
                setNotice(null);
                startTransition(async () => {
                  try {
                    await requestJson(`/api/admin/training/sessions/${session.sessionId}`, {
                      body: JSON.stringify({
                        action: "reschedule",
                        endsAt: sessionForm.endsAt || null,
                        facilitatorNotes: sessionForm.facilitatorNotes || null,
                        followUpActions: sessionForm.followUpActions || null,
                        locationLabel: sessionForm.locationLabel || null,
                        readinessStatus: sessionForm.readinessStatus,
                        startsAt: sessionForm.startsAt || null,
                        summary: sessionForm.summary || null,
                        title: sessionForm.title,
                        virtualLink: sessionForm.virtualLink || null,
                      }),
                      method: "PATCH",
                    });
                    setNotice({ message: "Session rescheduled and learners notified.", tone: "success" });
                    router.refresh();
                  } catch (error) {
                    setNotice({
                      message: error instanceof Error ? error.message : "Unable to reschedule the session.",
                      tone: "error",
                    });
                  }
                });
              }}
              type="button"
            >
              Reschedule
            </button>
            <button
              className="button-secondary"
              disabled={isPending}
              onClick={() => {
                setNotice(null);
                startTransition(async () => {
                  try {
                    await requestJson(`/api/admin/training/sessions/${session.sessionId}`, {
                      body: JSON.stringify({ action: "cancel" }),
                      method: "PATCH",
                    });
                    setNotice({ message: "Session cancelled and learners notified.", tone: "success" });
                    router.refresh();
                  } catch (error) {
                    setNotice({
                      message: error instanceof Error ? error.message : "Unable to cancel the session.",
                      tone: "error",
                    });
                  }
                });
              }}
              type="button"
            >
              Cancel session
            </button>
            <button
              className="button-primary"
              disabled={isPending}
              onClick={() => {
                setNotice(null);
                startTransition(async () => {
                  try {
                    await requestJson(`/api/admin/training/sessions/${session.sessionId}/attendance`, {
                      body: JSON.stringify({
                        markSessionComplete: markComplete,
                        records: roster.map((item) => ({
                          attendanceStatus: item.attendanceStatus,
                          membershipId: item.membershipId,
                          note: item.attendanceNote || null,
                        })),
                      }),
                      method: "PATCH",
                    });
                    setNotice({ message: "Attendance saved and the client portal will refresh automatically.", tone: "success" });
                    router.refresh();
                  } catch (error) {
                    setNotice({
                      message: error instanceof Error ? error.message : "Unable to save attendance.",
                      tone: "error",
                    });
                  }
                });
              }}
              type="button"
            >
              {isPending ? "Saving..." : "Save attendance"}
            </button>
          </div>
        </div>
      ) : null}

      {notice ? <div className="mt-4"><Notice message={notice.message} tone={notice.tone} /></div> : null}
    </article>
  );
}

export function TrainingAttendanceManager({
  canManage,
  sessions,
}: {
  canManage: boolean;
  sessions: AdminSessionOperation[];
}) {
  if (!sessions.length) {
    return <p className="text-sm leading-6 text-slate-600">No sessions have been scheduled yet, so there is nothing to capture attendance against.</p>;
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <AttendanceCard key={session.sessionId} canManage={canManage} session={session} />
      ))}
    </div>
  );
}

function AssessmentCard({
  assessment,
  canManage,
}: {
  assessment: AdminAssessmentOperation;
  canManage: boolean;
}) {
  const router = useRouter();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [gradingState, setGradingState] = useState<Record<string, { decision: "auto" | "returned"; feedback: string; score: string }>>(
    Object.fromEntries(
      assessment.submissions.map((submission) => [
        submission.submissionId,
        {
          decision: submission.status === "returned" ? "returned" : "auto",
          feedback: submission.feedback ?? "",
          score: submission.score?.toString() ?? "",
        },
      ]),
    ),
  );

  return (
    <article className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">{assessment.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {assessment.cohortTitle} • Due {assessment.dueAtLabel}
            {assessment.moduleTitle ? ` • ${assessment.moduleTitle}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge>{assessment.statusLabel}</StatusBadge>
            <StatusBadge>{assessment.openLearnerCount} outstanding</StatusBadge>
            <StatusBadge>{assessment.submissions.filter((item) => item.status === "submitted").length} waiting to grade</StatusBadge>
          </div>
        </div>

        {canManage ? (
          <button
            className="button-secondary"
            disabled={isPending || assessment.reminderTargetCount === 0}
            onClick={() => {
              setNotice(null);
              startTransition(async () => {
                try {
                  const payload = await requestJson<{ reminded: number }>(`/api/admin/training/assessments/${assessment.assessmentId}/reminders`, {
                    method: "POST",
                  });
                  setNotice({ message: `Reminder sent to ${payload.reminded} learner${payload.reminded === 1 ? "" : "s"}.`, tone: "success" });
                  router.refresh();
                } catch (error) {
                  setNotice({
                    message: error instanceof Error ? error.message : "Unable to send assessment reminders.",
                    tone: "error",
                  });
                }
              });
            }}
            type="button"
          >
            Send reminder
          </button>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        {assessment.submissions.length ? assessment.submissions.map((submission) => (
          <div key={submission.submissionId} className="rounded-[1.25rem] bg-white p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">{submission.learnerName}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                  {submission.learnerEmail} • {submission.roleSlug.replace("_", " ")}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {submission.resultLabel} • Attempt {submission.attemptCount} • {submission.submittedAtLabel}
                  {submission.scoreLabel ? ` • ${submission.scoreLabel}` : ""}
                </p>
                {submission.submissionText ? (
                  <p className="mt-3 rounded-2xl border border-[#ece1dc] bg-[#faf7f5] px-4 py-3 text-sm leading-6 text-slate-600">
                    {submission.submissionText}
                  </p>
                ) : null}
                {submission.evidenceFileName ? (
                  <div className="mt-3 rounded-2xl border border-[#ece1dc] bg-[#faf7f5] px-4 py-3 text-sm leading-6 text-slate-600">
                    <p className="font-semibold text-slate-900">Evidence file</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span>{submission.evidenceFileName}</span>
                      {submission.evidenceMimeType ? (
                        <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-500">
                          {submission.evidenceMimeType}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-500">
                        {formatFileSizeLabel(submission.evidenceFileSizeBytes)}
                      </span>
                      {submission.evidenceUrl ? (
                        <a
                          className="text-[#8a0917] underline-offset-4 transition hover:underline"
                          href={submission.evidenceUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Open evidence
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {submission.history.length ? (
                  <div className="mt-3 rounded-2xl border border-[#ece1dc] bg-[#faf7f5] px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Grading history</p>
                    <div className="mt-3 space-y-2">
                      {submission.history.map((event) => (
                        <div key={`${submission.submissionId}-${event.createdAtLabel}-${event.summary}`} className="text-sm leading-6 text-slate-600">
                          <span className="font-semibold text-slate-900">{event.eventType}</span>
                          {" • "}
                          {event.createdAtLabel}
                          {" • "}
                          {event.summary}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <StatusBadge>{submission.resultLabel}</StatusBadge>
            </div>

            {canManage ? (
              <div className="mt-4 grid gap-4 md:grid-cols-[0.7fr_0.7fr_1fr_auto]">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Decision</span>
                  <select
                    className={textInputClassName()}
                    disabled={isPending}
                    value={gradingState[submission.submissionId]?.decision ?? "auto"}
                    onChange={(event) => {
                      const decision = event.target.value as "auto" | "returned";
                      setGradingState((current) => ({
                        ...current,
                        [submission.submissionId]: {
                          ...(current[submission.submissionId] ?? { feedback: "", score: "" }),
                          decision,
                        },
                      }));
                    }}
                  >
                    <option value="auto">Use pass threshold</option>
                    <option value="returned">Return for rework</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Score</span>
                  <input
                    className={textInputClassName()}
                    disabled={isPending}
                    inputMode="decimal"
                    placeholder={assessment.maxScore ? `out of ${assessment.maxScore}` : "Score"}
                    value={gradingState[submission.submissionId]?.score ?? ""}
                    onChange={(event) => {
                      const score = event.target.value;
                      setGradingState((current) => ({
                        ...current,
                        [submission.submissionId]: {
                          ...(current[submission.submissionId] ?? { decision: "auto", feedback: "" }),
                          score,
                        },
                      }));
                    }}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Feedback</span>
                  <input
                    className={textInputClassName()}
                    disabled={isPending}
                    placeholder="Actionable feedback for the learner"
                    value={gradingState[submission.submissionId]?.feedback ?? ""}
                    onChange={(event) => {
                      const feedback = event.target.value;
                      setGradingState((current) => ({
                        ...current,
                        [submission.submissionId]: {
                          ...(current[submission.submissionId] ?? { decision: "auto", score: "" }),
                          feedback,
                        },
                      }));
                    }}
                  />
                </label>
                <button
                  className="button-primary self-end"
                  disabled={isPending}
                  onClick={() => {
                    setNotice(null);
                    startTransition(async () => {
                      try {
                        const state = gradingState[submission.submissionId] ?? { decision: "auto", feedback: "", score: "" };
                        await requestJson(`/api/admin/training/assessments/submissions/${submission.submissionId}`, {
                          body: JSON.stringify({
                            decision: state.decision,
                            feedback: state.feedback || null,
                            score: state.score ? Number(state.score) : null,
                          }),
                          method: "PATCH",
                        });
                        setNotice({ message: `Grading decision saved for ${submission.learnerName}.`, tone: "success" });
                        router.refresh();
                      } catch (error) {
                        setNotice({
                          message: error instanceof Error ? error.message : "Unable to save the grading decision.",
                          tone: "error",
                        });
                      }
                    });
                  }}
                  type="button"
                >
                  Save grade
                </button>
              </div>
            ) : null}

            {canManage ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className="button-secondary"
                  disabled={isPending}
                  onClick={() => {
                    setNotice(null);
                    startTransition(async () => {
                      try {
                        await requestJson(`/api/admin/training/assessments/submissions/${submission.submissionId}`, {
                          body: JSON.stringify({
                            feedback: gradingState[submission.submissionId]?.feedback || null,
                            reopen: true,
                          }),
                          method: "PATCH",
                        });
                        setNotice({ message: `${submission.learnerName} can submit another attempt now.`, tone: "success" });
                        router.refresh();
                      } catch (error) {
                        setNotice({
                          message: error instanceof Error ? error.message : "Unable to reopen the submission.",
                          tone: "error",
                        });
                      }
                    });
                  }}
                  type="button"
                >
                  Reopen
                </button>
                <button
                  className="button-secondary"
                  disabled={isPending}
                  onClick={() => {
                    setNotice(null);
                    startTransition(async () => {
                      try {
                        await requestJson(`/api/admin/training/assessments/submissions/${submission.submissionId}`, {
                          body: JSON.stringify({
                            feedback: gradingState[submission.submissionId]?.feedback || null,
                            overrideStatus: "passed",
                            score: gradingState[submission.submissionId]?.score ? Number(gradingState[submission.submissionId].score) : submission.score,
                          }),
                          method: "PATCH",
                        });
                        setNotice({ message: `Override pass saved for ${submission.learnerName}.`, tone: "success" });
                        router.refresh();
                      } catch (error) {
                        setNotice({
                          message: error instanceof Error ? error.message : "Unable to override the submission.",
                          tone: "error",
                        });
                      }
                    });
                  }}
                  type="button"
                >
                  Override pass
                </button>
                <button
                  className="button-secondary"
                  disabled={isPending}
                  onClick={() => {
                    setNotice(null);
                    startTransition(async () => {
                      try {
                        await requestJson(`/api/admin/training/assessments/submissions/${submission.submissionId}`, {
                          body: JSON.stringify({
                            feedback: gradingState[submission.submissionId]?.feedback || null,
                            overrideStatus: "failed",
                            score: gradingState[submission.submissionId]?.score ? Number(gradingState[submission.submissionId].score) : submission.score,
                          }),
                          method: "PATCH",
                        });
                        setNotice({ message: `Override fail saved for ${submission.learnerName}.`, tone: "success" });
                        router.refresh();
                      } catch (error) {
                        setNotice({
                          message: error instanceof Error ? error.message : "Unable to override the submission.",
                          tone: "error",
                        });
                      }
                    });
                  }}
                  type="button"
                >
                  Override fail
                </button>
              </div>
            ) : null}
          </div>
        )) : (
          <p className="text-sm leading-6 text-slate-600">No submissions have been received yet for this assessment.</p>
        )}
      </div>

      {notice ? <div className="mt-4"><Notice message={notice.message} tone={notice.tone} /></div> : null}
    </article>
  );
}

export function TrainingAssessmentManager({
  assessments,
  canManage,
}: {
  assessments: AdminAssessmentOperation[];
  canManage: boolean;
}) {
  if (!assessments.length) {
    return <p className="text-sm leading-6 text-slate-600">No assessments are live yet, so the grading queue is empty.</p>;
  }

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <AssessmentCard key={assessment.assessmentId} assessment={assessment} canManage={canManage} />
      ))}
    </div>
  );
}

function RolePill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{children}</span>;
}

export function TrainingRoleManager({ workspace }: { workspace: AdminRoleWorkspace }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);
  const [selectedRoleByAccount, setSelectedRoleByAccount] = useState<Record<string, string>>({});
  const [selectedMembershipRole, setSelectedMembershipRole] = useState<Record<string, "client_manager" | "learner">>({});

  const definitionsByScope = {
    admin: workspace.definitions.filter((item) => item.scope === "admin"),
    client: workspace.definitions.filter((item) => item.scope === "client"),
  };

  async function mutateRole(input: { accountId: string; roleSlug: TrainingRoleSlug; scope: "admin" | "client" }, method: "DELETE" | "POST") {
    await requestJson("/api/admin/training/roles", {
      body: JSON.stringify(input),
      method,
    });
  }

  return (
    <div className="space-y-6">
      {notice ? <Notice message={notice.message} tone={notice.tone} /> : null}

      <div className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
        <h3 className="text-lg font-semibold tracking-tight text-slate-950">Role definitions in play</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {workspace.definitions.map((definition) => (
            <div key={`${definition.scope}-${definition.slug}`} className="rounded-[1.2rem] bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a0917]">{definition.scope}</p>
              <p className="mt-2 text-base font-semibold text-slate-950">{definition.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{definition.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">Admin access</h3>
          <div className="mt-4 space-y-4">
            {workspace.adminAccounts.map((account) => (
              <div key={account.accountId} className="rounded-[1.2rem] bg-white p-4">
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{account.fullName}</p>
                    <p className="mt-1 text-sm text-slate-600">{account.email}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{account.jobTitle ?? account.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {account.roles.length ? account.roles.map((role) => (
                      <button
                        key={role}
                        className="rounded-full bg-[#f2e9e5] px-3 py-1 text-xs font-semibold text-[#8a0917]"
                        disabled={!workspace.canManage || isPending}
                        onClick={() => {
                          startTransition(async () => {
                            try {
                              await mutateRole({ accountId: account.accountId, roleSlug: role as TrainingRoleSlug, scope: "admin" }, "DELETE");
                              setNotice({ message: `${role} removed from ${account.fullName}.`, tone: "success" });
                              router.refresh();
                            } catch (error) {
                              setNotice({ message: error instanceof Error ? error.message : "Unable to remove the role.", tone: "error" });
                            }
                          });
                        }}
                        type="button"
                      >
                        {role} ×
                      </button>
                    )) : <RolePill>No roles assigned</RolePill>}
                  </div>
                  {workspace.canManage ? (
                    <div className="flex gap-3">
                      <select
                        className={textInputClassName()}
                        disabled={isPending}
                        value={selectedRoleByAccount[account.accountId] ?? definitionsByScope.admin[0]?.slug ?? ""}
                        onChange={(event) => setSelectedRoleByAccount((current) => ({ ...current, [account.accountId]: event.target.value }))}
                      >
                        {definitionsByScope.admin.map((definition) => (
                          <option key={definition.slug} value={definition.slug}>{definition.label}</option>
                        ))}
                      </select>
                      <button
                        className="button-secondary"
                        disabled={isPending}
                        onClick={() => {
                          startTransition(async () => {
                            try {
                              await mutateRole({
                                accountId: account.accountId,
                                roleSlug: (selectedRoleByAccount[account.accountId] ?? definitionsByScope.admin[0]?.slug ?? "trainer") as TrainingRoleSlug,
                                scope: "admin",
                              }, "POST");
                              setNotice({ message: `Role added to ${account.fullName}.`, tone: "success" });
                              router.refresh();
                            } catch (error) {
                              setNotice({ message: error instanceof Error ? error.message : "Unable to assign the role.", tone: "error" });
                            }
                          });
                        }}
                        type="button"
                      >
                        Add role
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">Client and learner access</h3>
          <div className="mt-4 space-y-4">
            {workspace.clientAccounts.map((account) => (
              <div key={account.accountId} className="rounded-[1.2rem] bg-white p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{account.fullName}</p>
                  <p className="mt-1 text-sm text-slate-600">{account.email}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{account.roleTitle ?? account.status}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {account.invitedAtLabel ? `Invited ${account.invitedAtLabel}` : "Invite not sent yet"}
                    {account.activatedAtLabel ? ` • Activated ${account.activatedAtLabel}` : ""}
                    {account.onboardingStatus === "pending" ? " • Onboarding pending" : account.onboardingStatus === "active" ? " • Onboarding complete" : " • Awaiting activation"}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {account.roles.length ? account.roles.map((role) => (
                    <button
                      key={role}
                      className="rounded-full bg-[#f2e9e5] px-3 py-1 text-xs font-semibold text-[#8a0917]"
                      disabled={!workspace.canManage || isPending}
                      onClick={() => {
                        startTransition(async () => {
                          try {
                            await mutateRole({ accountId: account.accountId, roleSlug: role as TrainingRoleSlug, scope: "client" }, "DELETE");
                            setNotice({ message: `${role} removed from ${account.fullName}.`, tone: "success" });
                            router.refresh();
                          } catch (error) {
                            setNotice({ message: error instanceof Error ? error.message : "Unable to remove the role.", tone: "error" });
                          }
                        });
                      }}
                      type="button"
                    >
                      {role} ×
                    </button>
                  )) : <RolePill>No portal role assigned</RolePill>}
                </div>
                {workspace.canManage ? (
                  <div className="mt-3 flex gap-3">
                    <select
                      className={textInputClassName()}
                      disabled={isPending}
                      value={selectedRoleByAccount[account.accountId] ?? definitionsByScope.client[0]?.slug ?? ""}
                      onChange={(event) => setSelectedRoleByAccount((current) => ({ ...current, [account.accountId]: event.target.value }))}
                    >
                      {definitionsByScope.client.map((definition) => (
                        <option key={definition.slug} value={definition.slug}>{definition.label}</option>
                      ))}
                    </select>
                    <button
                      className="button-secondary"
                      disabled={isPending}
                      onClick={() => {
                        startTransition(async () => {
                          try {
                            await mutateRole({
                              accountId: account.accountId,
                              roleSlug: (selectedRoleByAccount[account.accountId] ?? definitionsByScope.client[0]?.slug ?? "learner") as TrainingRoleSlug,
                              scope: "client",
                            }, "POST");
                            setNotice({ message: `Role added to ${account.fullName}.`, tone: "success" });
                            router.refresh();
                          } catch (error) {
                            setNotice({ message: error instanceof Error ? error.message : "Unable to assign the role.", tone: "error" });
                          }
                        });
                      }}
                      type="button"
                    >
                      Add role
                    </button>
                  </div>
                ) : null}
                {workspace.canManage ? (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {account.status === "invited" ? (
                      <>
                        <button
                          className="button-secondary"
                          disabled={isPending}
                          onClick={() => {
                            startTransition(async () => {
                              try {
                                await requestJson(`/api/admin/training/learners/${account.accountId}`, {
                                  body: JSON.stringify({ action: "resend_invite" }),
                                  method: "PATCH",
                                });
                                setNotice({ message: `Invite re-sent to ${account.fullName}.`, tone: "success" });
                                router.refresh();
                              } catch (error) {
                                setNotice({ message: error instanceof Error ? error.message : "Unable to resend the invite.", tone: "error" });
                              }
                            });
                          }}
                          type="button"
                        >
                          Resend invite
                        </button>
                        <button
                          className="button-secondary"
                          disabled={isPending}
                          onClick={() => {
                            startTransition(async () => {
                              try {
                                await requestJson(`/api/admin/training/learners/${account.accountId}`, {
                                  body: JSON.stringify({ action: "revoke_invite" }),
                                  method: "PATCH",
                                });
                                setNotice({ message: `Invite revoked for ${account.fullName}.`, tone: "success" });
                                router.refresh();
                              } catch (error) {
                                setNotice({ message: error instanceof Error ? error.message : "Unable to revoke the invite.", tone: "error" });
                              }
                            });
                          }}
                          type="button"
                        >
                          Revoke invite
                        </button>
                      </>
                    ) : null}
                    {account.status === "active" ? (
                      <button
                        className="button-secondary"
                        disabled={isPending}
                        onClick={() => {
                          startTransition(async () => {
                            try {
                              await requestJson(`/api/admin/training/learners/${account.accountId}`, {
                                body: JSON.stringify({ action: "deactivate" }),
                                method: "PATCH",
                              });
                              setNotice({ message: `${account.fullName} has been deactivated.`, tone: "success" });
                              router.refresh();
                            } catch (error) {
                              setNotice({ message: error instanceof Error ? error.message : "Unable to deactivate the account.", tone: "error" });
                            }
                          });
                        }}
                        type="button"
                      >
                        Deactivate access
                      </button>
                    ) : null}
                    {["inactive", "revoked"].includes(account.status) ? (
                      <button
                        className="button-secondary"
                        disabled={isPending}
                        onClick={() => {
                          startTransition(async () => {
                            try {
                              await requestJson(`/api/admin/training/learners/${account.accountId}`, {
                                body: JSON.stringify({ action: "reactivate" }),
                                method: "PATCH",
                              });
                              setNotice({ message: `${account.fullName} has been reactivated.`, tone: "success" });
                              router.refresh();
                            } catch (error) {
                              setNotice({ message: error instanceof Error ? error.message : "Unable to reactivate the account.", tone: "error" });
                            }
                          });
                        }}
                        type="button"
                      >
                        Reactivate access
                      </button>
                    ) : null}
                  </div>
                ) : null}

                {account.memberships.length ? (
                  <div className="mt-4 space-y-3">
                    {account.memberships.map((membership) => (
                      <div key={membership.membershipId} className="rounded-2xl border border-[#ece1dc] bg-[#faf7f5] p-3">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{membership.cohortTitle}</p>
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                              {membership.roleSlug.replace("_", " ")} • {membership.certificationStatus.replace("_", " ")}
                            </p>
                          </div>
                          {workspace.canManage ? (
                            <div className="flex gap-3">
                              <select
                                className={textInputClassName()}
                                disabled={isPending}
                                value={selectedMembershipRole[membership.membershipId] ?? membership.roleSlug}
                                onChange={(event) =>
                                  setSelectedMembershipRole((current) => ({
                                    ...current,
                                    [membership.membershipId]: event.target.value as "client_manager" | "learner",
                                  }))
                                }
                              >
                                <option value="learner">Learner</option>
                                <option value="client_manager">Client manager</option>
                              </select>
                              <button
                                className="button-secondary"
                                disabled={isPending}
                                onClick={() => {
                                  startTransition(async () => {
                                    try {
                                      await requestJson(`/api/admin/training/memberships/${membership.membershipId}/role`, {
                                        body: JSON.stringify({
                                          roleSlug: selectedMembershipRole[membership.membershipId] ?? membership.roleSlug,
                                        }),
                                        method: "PATCH",
                                      });
                                      setNotice({ message: `Cohort role updated for ${account.fullName}.`, tone: "success" });
                                      router.refresh();
                                    } catch (error) {
                                      setNotice({ message: error instanceof Error ? error.message : "Unable to update the cohort role.", tone: "error" });
                                    }
                                  });
                                }}
                                type="button"
                              >
                                Update
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrainingResourceManager({
  references,
  workspace,
}: {
  references: {
    cohorts: Array<{ id: string; label: string }>;
    modules: Array<{ id: string; label: string }>;
    programmes: Array<{ id: string; label: string }>;
  };
  workspace: AdminResourceWorkspace;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);
  const [resourceForms, setResourceForms] = useState(
    Object.fromEntries(
      workspace.resources.map((resource) => [
        resource.resourceId,
        {
          audienceRoleSlug:
            resource.audienceLabel === "Learners"
              ? "learner"
              : resource.audienceLabel === "Client managers"
                ? "client_manager"
                : resource.audienceLabel === "Trainers"
                  ? "trainer"
                  : "all",
          cohortId:
            references.cohorts.find((option) => option.label === resource.cohortTitle)?.id ?? "",
          href: resource.href ?? "",
          moduleId:
            references.modules.find((option) => option.label === resource.moduleTitle)?.id ?? "",
          programmeId:
            references.programmes.find((option) => option.label === resource.programmeTitle)?.id ?? "",
          resourceKind: resource.resourceKind,
          status: resource.status,
          summary: resource.summary ?? "",
          title: resource.title,
          versionLabel: resource.versionLabel ?? "",
          visibleFrom: resource.visibleFrom ? resource.visibleFrom.slice(0, 16) : "",
        },
      ]),
    ) as Record<
      string,
      {
        audienceRoleSlug: "all" | "client_manager" | "learner" | "trainer";
        cohortId: string;
        href: string;
        moduleId: string;
        programmeId: string;
        resourceKind: string;
        status: string;
        summary: string;
        title: string;
        versionLabel: string;
        visibleFrom: string;
      }
    >,
  );

  if (!workspace.resources.length) {
    return <p className="text-sm leading-6 text-slate-600">No training resources have been released yet.</p>;
  }

  return (
    <div className="space-y-4">
      {notice ? <Notice message={notice.message} tone={notice.tone} /> : null}
      {workspace.resources.map((resource) => {
        const form = resourceForms[resource.resourceId];

        return (
          <article key={resource.resourceId} className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-950">{resource.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {resource.programmeTitle ?? "Programme-wide"}
                  {resource.cohortTitle ? ` • ${resource.cohortTitle}` : ""}
                  {resource.moduleTitle ? ` • ${resource.moduleTitle}` : ""}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge>{resource.resourceKindLabel}</StatusBadge>
                  <StatusBadge>{resource.statusLabel}</StatusBadge>
                  <StatusBadge>{resource.audienceLabel}</StatusBadge>
                  <StatusBadge>{resource.versionLabel ?? "Version pending"}</StatusBadge>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Visible from {resource.visibleFromLabel}
              </p>
            </div>

            {workspace.canManage ? (
              <div className="mt-6 grid gap-4 rounded-[1.25rem] bg-white p-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Resource title</span>
                  <input
                    className={textInputClassName()}
                    disabled={isPending}
                    value={form.title}
                    onChange={(event) =>
                      setResourceForms((current) => ({
                        ...current,
                        [resource.resourceId]: { ...current[resource.resourceId], title: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Version label</span>
                  <input
                    className={textInputClassName()}
                    disabled={isPending}
                    value={form.versionLabel}
                    onChange={(event) =>
                      setResourceForms((current) => ({
                        ...current,
                        [resource.resourceId]: { ...current[resource.resourceId], versionLabel: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Status</span>
                  <select
                    className={textInputClassName()}
                    disabled={isPending}
                    value={form.status}
                    onChange={(event) =>
                      setResourceForms((current) => ({
                        ...current,
                        [resource.resourceId]: { ...current[resource.resourceId], status: event.target.value },
                      }))
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="released">Released</option>
                    <option value="retired">Retired</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Audience</span>
                  <select
                    className={textInputClassName()}
                    disabled={isPending}
                    value={form.audienceRoleSlug}
                    onChange={(event) =>
                      setResourceForms((current) => ({
                        ...current,
                        [resource.resourceId]: {
                          ...current[resource.resourceId],
                          audienceRoleSlug: event.target.value as "all" | "client_manager" | "learner" | "trainer",
                        },
                      }))
                    }
                  >
                    <option value="all">All roles</option>
                    <option value="learner">Learners</option>
                    <option value="client_manager">Client managers</option>
                    <option value="trainer">Trainers</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Programme</span>
                  <select
                    className={textInputClassName()}
                    disabled={isPending}
                    value={form.programmeId}
                    onChange={(event) =>
                      setResourceForms((current) => ({
                        ...current,
                        [resource.resourceId]: { ...current[resource.resourceId], programmeId: event.target.value },
                      }))
                    }
                  >
                    <option value="">No programme link</option>
                    {references.programmes.map((programme) => (
                      <option key={programme.id} value={programme.id}>
                        {programme.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Cohort</span>
                  <select
                    className={textInputClassName()}
                    disabled={isPending}
                    value={form.cohortId}
                    onChange={(event) =>
                      setResourceForms((current) => ({
                        ...current,
                        [resource.resourceId]: { ...current[resource.resourceId], cohortId: event.target.value },
                      }))
                    }
                  >
                    <option value="">Programme-wide</option>
                    {references.cohorts.map((cohort) => (
                      <option key={cohort.id} value={cohort.id}>
                        {cohort.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Module</span>
                  <select
                    className={textInputClassName()}
                    disabled={isPending}
                    value={form.moduleId}
                    onChange={(event) =>
                      setResourceForms((current) => ({
                        ...current,
                        [resource.resourceId]: { ...current[resource.resourceId], moduleId: event.target.value },
                      }))
                    }
                  >
                    <option value="">No module link</option>
                    {references.modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Resource kind</span>
                  <select
                    className={textInputClassName()}
                    disabled={isPending}
                    value={form.resourceKind}
                    onChange={(event) =>
                      setResourceForms((current) => ({
                        ...current,
                        [resource.resourceId]: { ...current[resource.resourceId], resourceKind: event.target.value },
                      }))
                    }
                  >
                    <option value="prework">Prework</option>
                    <option value="workbook">Workbook</option>
                    <option value="template">Template</option>
                    <option value="revision_guide">Revision guide</option>
                    <option value="recording">Recording</option>
                    <option value="manager_pack">Manager pack</option>
                    <option value="facilitator_pack">Facilitator pack</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Visible from</span>
                  <input
                    className={textInputClassName()}
                    disabled={isPending}
                    type="datetime-local"
                    value={form.visibleFrom}
                    onChange={(event) =>
                      setResourceForms((current) => ({
                        ...current,
                        [resource.resourceId]: { ...current[resource.resourceId], visibleFrom: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  <span>Resource link</span>
                  <input
                    className={textInputClassName()}
                    disabled={isPending}
                    placeholder="https://..."
                    value={form.href}
                    onChange={(event) =>
                      setResourceForms((current) => ({
                        ...current,
                        [resource.resourceId]: { ...current[resource.resourceId], href: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  <span>Summary</span>
                  <textarea
                    className={`${textInputClassName()} min-h-24`}
                    disabled={isPending}
                    value={form.summary}
                    onChange={(event) =>
                      setResourceForms((current) => ({
                        ...current,
                        [resource.resourceId]: { ...current[resource.resourceId], summary: event.target.value },
                      }))
                    }
                  />
                </label>
              </div>
            ) : null}

            {workspace.canManage ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="button-primary"
                  disabled={isPending}
                  onClick={() => {
                    setNotice(null);
                    startTransition(async () => {
                      try {
                        await requestJson(`/api/admin/training/resources/${resource.resourceId}`, {
                          body: JSON.stringify({
                            audienceRoleSlug: form.audienceRoleSlug,
                            cohortId: form.cohortId || null,
                            href: form.href || null,
                            moduleId: form.moduleId || null,
                            programmeId: form.programmeId || null,
                            resourceKind: form.resourceKind,
                            status: form.status,
                            summary: form.summary || null,
                            title: form.title,
                            versionLabel: form.versionLabel || null,
                            visibleFrom: form.visibleFrom || null,
                          }),
                          method: "PATCH",
                        });
                        setNotice({ message: `${form.title} updated.`, tone: "success" });
                        router.refresh();
                      } catch (error) {
                        setNotice({
                          message: error instanceof Error ? error.message : "Unable to update the resource.",
                          tone: "error",
                        });
                      }
                    });
                  }}
                  type="button"
                >
                  Save resource
                </button>
                <button
                  className="button-secondary"
                  disabled={isPending || form.status === "retired"}
                  onClick={() => {
                    setNotice(null);
                    startTransition(async () => {
                      try {
                        await requestJson(`/api/admin/training/resources/${resource.resourceId}`, {
                          body: JSON.stringify({ status: "retired" }),
                          method: "PATCH",
                        });
                        setNotice({ message: `${resource.title} retired from the learner portal.`, tone: "success" });
                        router.refresh();
                      } catch (error) {
                        setNotice({
                          message: error instanceof Error ? error.message : "Unable to retire the resource.",
                          tone: "error",
                        });
                      }
                    });
                  }}
                  type="button"
                >
                  Retire resource
                </button>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export function TrainingCertificationManager({ workspace }: { workspace: AdminCertificationWorkspace }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);
  const [notesByMembership, setNotesByMembership] = useState<Record<string, string>>({});
  const [revokeReasonByMembership, setRevokeReasonByMembership] = useState<Record<string, string>>({});

  return (
    <div className="space-y-4">
      {notice ? <Notice message={notice.message} tone={notice.tone} /> : null}
      {workspace.items.map((item) => (
        <article key={item.membershipId} className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">{item.learnerName}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.learnerEmail} • {item.cohortTitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge>{item.certificationStatus.replace(/_/g, " ")}</StatusBadge>
                <StatusBadge>{Math.round(item.attendancePercentage)}% attendance</StatusBadge>
                <StatusBadge>{Math.round(item.averageScore)}% score</StatusBadge>
                <StatusBadge>{Math.round(item.completionPercentage)}% completion</StatusBadge>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{item.note}</p>
              {item.certificateUrl ? (
                <a
                  className="mt-3 inline-flex text-sm font-semibold text-[#8a0917] underline-offset-4 transition hover:underline"
                  href={item.certificateUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Download certificate
                </a>
              ) : null}
            </div>

            {workspace.canManage ? (
              <div className="w-full max-w-md space-y-3">
                <input
                  className={textInputClassName()}
                  disabled={isPending}
                  placeholder="Certification note"
                  value={notesByMembership[item.membershipId] ?? ""}
                  onChange={(event) => setNotesByMembership((current) => ({ ...current, [item.membershipId]: event.target.value }))}
                />
                {item.certificateId ? (
                  <>
                    <input
                      className={textInputClassName()}
                      disabled={isPending}
                      placeholder="Reason for revocation"
                      value={revokeReasonByMembership[item.membershipId] ?? ""}
                      onChange={(event) =>
                        setRevokeReasonByMembership((current) => ({ ...current, [item.membershipId]: event.target.value }))
                      }
                    />
                    <button
                      className="button-secondary w-full"
                      disabled={isPending || !(revokeReasonByMembership[item.membershipId] ?? "").trim()}
                      onClick={() => {
                        startTransition(async () => {
                          try {
                            await requestJson("/api/admin/training/certificates", {
                              body: JSON.stringify({
                                membershipId: item.membershipId,
                                reason: revokeReasonByMembership[item.membershipId],
                              }),
                              method: "PATCH",
                            });
                            setNotice({ message: `Certificate revoked for ${item.learnerName}.`, tone: "success" });
                            router.refresh();
                          } catch (error) {
                            setNotice({ message: error instanceof Error ? error.message : "Unable to revoke the certificate.", tone: "error" });
                          }
                        });
                      }}
                      type="button"
                    >
                      Revoke certificate
                    </button>
                  </>
                ) : (
                  <button
                    className="button-primary w-full"
                    disabled={isPending || item.certificationStatus !== "ready_for_review"}
                    onClick={() => {
                      startTransition(async () => {
                        try {
                          await requestJson("/api/admin/training/certificates", {
                            body: JSON.stringify({
                              membershipId: item.membershipId,
                              note: notesByMembership[item.membershipId] || null,
                            }),
                            method: "POST",
                          });
                          setNotice({ message: `Certificate awarded to ${item.learnerName}.`, tone: "success" });
                          router.refresh();
                        } catch (error) {
                          setNotice({ message: error instanceof Error ? error.message : "Unable to award the certificate.", tone: "error" });
                        }
                      });
                    }}
                    type="button"
                  >
                    Award certificate
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function LearnerAssessmentLifecycle({
  assessments,
  roleLabel,
}: {
  assessments: ClientTrainingWorkspace["assessments"];
  roleLabel: string;
}) {
  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <article key={assessment.assessmentId} className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">{assessment.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{assessment.meta}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge>{assessment.status}</StatusBadge>
                <StatusBadge>{assessment.dueAtLabel}</StatusBadge>
                {assessment.scoreLabel ? <StatusBadge>{assessment.scoreLabel}</StatusBadge> : null}
              </div>
            </div>
            <StatusBadge>{assessment.nextAction}</StatusBadge>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600">{assessment.note}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Attempts</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {assessment.attemptCount} used • {assessment.attemptsRemaining} remaining
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Pass expectation</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{assessment.certificateImpact}</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Lifecycle state</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{assessment.statusDetail}</p>
            </div>
          </div>

          {assessment.feedback ? (
            <div className="mt-4 rounded-2xl border border-[#ece1dc] bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">Trainer feedback</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{assessment.feedback}</p>
            </div>
          ) : null}

          {assessment.evidenceFileName ? (
            <div className="mt-4 rounded-2xl border border-[#ece1dc] bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">Uploaded evidence</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm leading-6 text-slate-700">
                <span>{assessment.evidenceFileName}</span>
                {assessment.evidenceMimeType ? (
                  <span className="rounded-full bg-[#faf7f5] px-2 py-1 text-[11px] font-semibold text-slate-500">
                    {assessment.evidenceMimeType}
                  </span>
                ) : null}
                <span className="rounded-full bg-[#faf7f5] px-2 py-1 text-[11px] font-semibold text-slate-500">
                  {formatFileSizeLabel(assessment.evidenceFileSizeBytes)}
                </span>
                {assessment.evidenceUrl ? (
                  <a
                    className="text-[#8a0917] underline-offset-4 transition hover:underline"
                    href={assessment.evidenceUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open file
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          {assessment.history.length ? (
            <div className="mt-4 rounded-2xl border border-[#ece1dc] bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">Assessment history</p>
              <div className="mt-3 space-y-2">
                {assessment.history.map((event) => (
                  <div key={`${assessment.assessmentId}-${event.createdAtLabel}-${event.summary}`} className="text-sm leading-6 text-slate-700">
                    <span className="font-semibold text-slate-950">{event.eventType}</span>
                    {" • "}
                    {event.createdAtLabel}
                    {" • "}
                    {event.summary}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {roleLabel === "Learner" && assessment.canSubmit ? (
            <div className="mt-4 rounded-2xl border border-[#ece1dc] bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">
                {assessment.retakeAvailable ? "Retake submission" : "Submission open"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{assessment.instructions ?? "Submit clear evidence showing what changed and what result it created."}</p>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function LearnerTrainingOnboarding({
  onboarding,
}: {
  onboarding: ClientTrainingWorkspace["onboarding"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);

  if (onboarding.completed) {
    return (
      <div className="rounded-[1.5rem] border border-[#ece1dc] bg-white p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">{onboarding.statusLabel}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {onboarding.nextStep}
          {onboarding.completedAtLabel ? ` Completed ${onboarding.completedAtLabel}.` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-[#ece1dc] bg-white p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a0917]">{onboarding.statusLabel}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {onboarding.nextStep}
        {onboarding.invitedAtLabel ? ` Invite sent ${onboarding.invitedAtLabel}.` : ""}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          className="button-primary"
          disabled={isPending}
          onClick={() => {
            setNotice(null);
            startTransition(async () => {
              try {
                await requestJson("/api/client/training/onboarding", {
                  body: JSON.stringify({
                    learningGoals: [
                      "Prepare for sessions with real examples",
                      "Track assessment outcomes inside the portal",
                      "Keep Lean capability visible after training",
                    ],
                  }),
                  method: "POST",
                });
                setNotice({ message: "Onboarding completed. Your training workspace is now fully active.", tone: "success" });
                router.refresh();
              } catch (error) {
                setNotice({
                  message: error instanceof Error ? error.message : "Unable to complete onboarding.",
                  tone: "error",
                });
              }
            });
          }}
          type="button"
        >
          {isPending ? "Saving..." : "Complete onboarding"}
        </button>
      </div>
      {notice ? <div className="mt-4"><Notice message={notice.message} tone={notice.tone} /></div> : null}
    </div>
  );
}

export function LearnerSessionCalendar({
  roleLabel,
  sessions,
}: {
  roleLabel: string;
  sessions: ClientTrainingWorkspace["sessionCalendar"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);

  return (
    <div className="space-y-4">
      {notice ? <Notice message={notice.message} tone={notice.tone} /> : null}
      {sessions.map((session) => (
        <article key={session.sessionId} className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">{session.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {session.cohortTitle} • {session.startsAtLabel} • {session.deliveryModeLabel}
                {session.moduleTitle ? ` • ${session.moduleTitle}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge>{session.statusLabel}</StatusBadge>
                <StatusBadge>{session.readinessLabel}</StatusBadge>
                {session.attendanceLabel ? <StatusBadge>{session.attendanceLabel}</StatusBadge> : null}
              </div>
            </div>
          </div>

          {session.summary ? <p className="mt-4 text-sm leading-6 text-slate-600">{session.summary}</p> : null}

          {(session.virtualLink || session.facilitatorNotes || session.followUpActions) ? (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Joining details</p>
                <div className="mt-2 text-sm leading-6 text-slate-700">
                  {session.virtualLink ? (
                    <a
                      className="text-[#8a0917] underline-offset-4 transition hover:underline"
                      href={session.virtualLink}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open virtual session
                    </a>
                  ) : (
                    "This session is running on-site."
                  )}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Facilitator notes</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {session.facilitatorNotes ?? "No additional facilitator notes have been published yet."}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Follow-up actions</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {session.followUpActions ?? "No follow-up actions have been posted yet."}
                </p>
              </div>
            </div>
          ) : null}

          {session.prework.length ? (
            <div className="mt-4 space-y-3">
              {session.prework.map((item) => (
                <div key={item.itemId} className="grid gap-3 rounded-2xl bg-white p-4 md:grid-cols-[1fr_0.8fr_auto]">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                    {item.note ? <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p> : null}
                  </div>
                  <div className="self-center">
                    <StatusBadge>{item.status.replace("_", " ")}</StatusBadge>
                  </div>
                  {roleLabel === "Learner" ? (
                    <button
                      className="button-secondary self-end"
                      disabled={isPending || item.status === "approved"}
                      onClick={() => {
                        setNotice(null);
                        startTransition(async () => {
                          try {
                            await requestJson(`/api/client/training/prework/${item.itemId}`, {
                              body: JSON.stringify({ status: "done" }),
                              method: "PATCH",
                            });
                            setNotice({ message: `Prework updated for ${session.title}.`, tone: "success" });
                            router.refresh();
                          } catch (error) {
                            setNotice({
                              message: error instanceof Error ? error.message : "Unable to update prework.",
                              tone: "error",
                            });
                          }
                        });
                      }}
                      type="button"
                    >
                      {item.status === "done" ? "Marked done" : "Mark done"}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
              No prework has been published for this session yet.
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

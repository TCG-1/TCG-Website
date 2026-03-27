import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";

import { createAdminAuditEntry, createClientActivityEntry, ensureAdminPortalContext, ensureClientPortalContext } from "@/lib/portal-data";
import type { AdminAccountRecord, ClientAccountRecord, ClientRecord } from "@/lib/portal-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendTrainingCertificateEmail, sendTrainingInviteEmail } from "@/lib/training-email";

export type TrainingRoleSlug = "admin_owner" | "trainer" | "client_manager" | "learner";
export type TrainingTone = "good" | "warning" | "risk" | "neutral";

export type TrainingMetric = {
  detail: string;
  label: string;
  tone?: TrainingTone;
  value: string;
};

export type TrainingWorkflowCard = {
  detail: string;
  label: string;
};

export type TrainingPageListItem = {
  id: string;
  meta: string;
  note: string;
  status?: string;
  title: string;
};

type RoleDefinitionRow = {
  description: string | null;
  id: string;
  label: string;
  slug: TrainingRoleSlug;
  scope: "admin" | "client";
};

type TrainingProgrammeRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  certificate_title: string | null;
  delivery_format: string;
  duration_weeks: number | null;
  status: string;
};

type TrainingModuleRow = {
  id: string;
  programme_id: string;
  slug: string;
  title: string;
  phase: string;
  summary: string;
  duration_label: string;
  delivery_type: string;
  required_for_completion: boolean;
  sort_order: number;
};

type TrainingModuleOutcomeRow = {
  id: string;
  module_id: string;
  outcome_text: string;
  sort_order: number;
};

type TrainingCohortRow = {
  id: string;
  client_id: string;
  programme_id: string;
  title: string;
  code: string;
  sponsor_name: string | null;
  sponsor_email: string | null;
  primary_client_manager_id: string | null;
  primary_trainer_admin_id: string | null;
  status: string;
  delivery_mode: string;
  timezone: string;
  starts_on: string | null;
  ends_on: string | null;
  target_pass_rate: number;
  notes: string | null;
};

type TrainingCohortTrainerRow = {
  id: string;
  cohort_id: string;
  admin_account_id: string;
  role_label: string;
  sort_order: number;
};

type TrainingMembershipRow = {
  id: string;
  cohort_id: string;
  client_account_id: string;
  role_slug: "client_manager" | "learner";
  enrollment_status: string;
  attendance_target: number;
  assessment_target: number;
  confidence_baseline: number | null;
  confidence_current: number | null;
  certification_status: string;
  joined_at: string;
  completed_at: string | null;
  last_seen_at: string | null;
};

type TrainingSessionRow = {
  id: string;
  cohort_id: string;
  module_id: string | null;
  title: string;
  summary: string | null;
  session_type: string;
  status: string;
  delivery_mode: string;
  starts_at: string | null;
  ends_at: string | null;
  location_label: string | null;
  virtual_link: string | null;
  readiness_status: string;
  facilitator_notes: string | null;
  follow_up_actions: string | null;
};

type TrainingPreworkItemRow = {
  id: string;
  session_id: string;
  title: string;
  description: string | null;
  is_required: boolean;
  sort_order: number;
};

type TrainingPreworkStatusRow = {
  id: string;
  prework_item_id: string;
  membership_id: string;
  status: string;
  notes: string | null;
  completed_at: string | null;
};

type TrainingAttendanceRow = {
  id: string;
  session_id: string;
  membership_id: string;
  attendance_status: string;
  check_in_at: string | null;
  check_out_at: string | null;
  notes: string | null;
};

type TrainingAssessmentRow = {
  id: string;
  cohort_id: string;
  module_id: string | null;
  title: string;
  summary: string | null;
  instructions: string | null;
  assessment_type: string;
  status: string;
  grading_mode: string;
  release_at: string | null;
  due_at: string | null;
  max_score: number | null;
  pass_score: number | null;
  max_attempts: number;
};

type TrainingSubmissionRow = {
  id: string;
  assessment_id: string;
  membership_id: string;
  status: string;
  submission_text: string | null;
  evidence_link: string | null;
  evidence_file_name?: string | null;
  evidence_file_path?: string | null;
  evidence_file_size_bytes?: number | null;
  evidence_file_mime_type?: string | null;
  attempt_count: number;
  score: number | null;
  feedback: string | null;
  submitted_at: string | null;
  graded_at: string | null;
  graded_by_admin_id: string | null;
};

type TrainingSubmissionEventRow = {
  id: string;
  submission_id: string;
  assessment_id: string;
  membership_id: string;
  event_type: string;
  actor_scope: "admin" | "client" | "system";
  admin_account_id: string | null;
  client_account_id: string | null;
  summary: string;
  payload: Record<string, unknown>;
  created_at: string;
};

type TrainingResourceRow = {
  id: string;
  cohort_id: string | null;
  programme_id: string | null;
  module_id: string | null;
  document_id: string | null;
  title: string;
  summary: string | null;
  resource_kind: string;
  audience_role_slug: "trainer" | "client_manager" | "learner" | "all";
  status: string;
  delivery_channel: string;
  href: string | null;
  version_label: string | null;
  estimated_minutes: number | null;
  sort_order: number;
  visible_from: string | null;
};

type TrainingProgressSnapshotRow = {
  id: string;
  membership_id: string;
  completion_percentage: number;
  attendance_percentage: number;
  average_score: number;
  overdue_assessments_count: number;
  overdue_prework_count: number;
  readiness_status: "green" | "amber" | "red" | "completed";
  last_calculated_at: string;
  notes: string | null;
};

type TrainingRoleAssignmentRow = {
  id: string;
  admin_account_id?: string | null;
  client_account_id?: string | null;
  role_id: string;
};

type TrainingCertificateRow = {
  artifact_file_name?: string | null;
  artifact_file_path?: string | null;
  artifact_mime_type?: string | null;
  id: string;
  membership_id: string;
  cohort_id: string;
  programme_id: string;
  certificate_number: string;
  status: "awarded" | "revoked";
  awarded_at: string;
  awarded_by_admin_id: string | null;
  notes: string | null;
  revoked_at: string | null;
  revoked_reason: string | null;
};

type TrainingDataSet = {
  adminAccounts: AdminAccountRecord[];
  adminRoleAssignments: TrainingRoleAssignmentRow[];
  assessments: TrainingAssessmentRow[];
  attendance: TrainingAttendanceRow[];
  certificates: TrainingCertificateRow[];
  clientAccounts: ClientAccountRecord[];
  clients: ClientRecord[];
  clientRoleAssignments: TrainingRoleAssignmentRow[];
  cohortTrainers: TrainingCohortTrainerRow[];
  cohorts: TrainingCohortRow[];
  memberships: TrainingMembershipRow[];
  modules: TrainingModuleRow[];
  outcomes: TrainingModuleOutcomeRow[];
  preworkItems: TrainingPreworkItemRow[];
  preworkStatus: TrainingPreworkStatusRow[];
  programmes: TrainingProgrammeRow[];
  progressSnapshots: TrainingProgressSnapshotRow[];
  resources: TrainingResourceRow[];
  roleDefinitions: RoleDefinitionRow[];
  sessions: TrainingSessionRow[];
  submissionEvents: TrainingSubmissionEventRow[];
  submissions: TrainingSubmissionRow[];
};

const TRAINING_EVIDENCE_BUCKET = process.env.SUPABASE_TRAINING_EVIDENCE_BUCKET ?? "training-evidence";
const TRAINING_CERTIFICATE_BUCKET = process.env.SUPABASE_TRAINING_CERTIFICATE_BUCKET ?? "training-certificates";
const MAX_EVIDENCE_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EVIDENCE_EXTENSIONS = new Set([".csv", ".doc", ".docx", ".jpeg", ".jpg", ".pdf", ".png", ".ppt", ".pptx", ".txt", ".webp", ".xls", ".xlsx"]);
const ALLOWED_EVIDENCE_MIME_TYPES = new Set([
  "application/msword",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/csv",
  "text/plain",
]);

type SupabaseAdminClient = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

export type AdminTrainingWorkspace = {
  assessments: TrainingPageListItem[];
  cohorts: TrainingPageListItem[];
  intro: {
    description: string;
    eyebrow: string;
    title: string;
  };
  learners: TrainingPageListItem[];
  metrics: TrainingMetric[];
  progress: Array<{ label: string; note: string; value: string }>;
  references: {
    clients: Array<{ id: string; label: string }>;
    cohorts: Array<{ id: string; label: string }>;
    managers: Array<{ id: string; label: string }>;
    modules: Array<{ id: string; label: string }>;
    programmes: Array<{ id: string; label: string }>;
    trainers: Array<{ id: string; label: string }>;
  };
  resources: TrainingPageListItem[];
  sessions: TrainingPageListItem[];
  workflowCards: TrainingWorkflowCard[];
};

export type AdminCohortOperation = {
  clientName: string;
  cohortId: string;
  code: string;
  deliveryMode: string;
  deliveryModeLabel: string;
  endsOn: string | null;
  endsOnLabel: string;
  learnerCount: number;
  managerAccountId: string | null;
  managerName: string | null;
  notes: string | null;
  programmeTitle: string;
  sponsorEmail: string | null;
  sponsorName: string | null;
  startsOn: string | null;
  startsOnLabel: string;
  status: string;
  statusLabel: string;
  title: string;
  trainers: Array<{
    adminAccountId: string;
    isPrimary: boolean;
    name: string;
    roleLabel: string;
  }>;
  trainerAdminId: string | null;
  trainerName: string | null;
  upcomingSessionCount: number;
};

export type AdminSessionOperation = {
  attendanceCounts: Record<"attended" | "excused" | "expected" | "late" | "missed", number>;
  cohortId: string;
  cohortTitle: string;
  deliveryModeLabel: string;
  endsAt: string | null;
  endsAtLabel: string;
  locationLabel: string | null;
  moduleTitle: string | null;
  facilitatorNotes: string | null;
  followUpActions: string | null;
  prework: Array<{
    description: string | null;
    itemId: string;
    learnerStates: Array<{
      learnerName: string;
      membershipId: string;
      note: string | null;
      status: "approved" | "done" | "todo";
    }>;
    requiredCount: number;
    statusCounts: Record<"approved" | "done" | "todo", number>;
    title: string;
  }>;
  readinessStatus: string;
  readinessLabel: string;
  roster: Array<{
    attendanceNote: string | null;
    attendanceStatus: "attended" | "excused" | "expected" | "late" | "missed";
    learnerEmail: string;
    learnerName: string;
    membershipId: string;
    roleSlug: "client_manager" | "learner";
  }>;
  sessionId: string;
  startsAt: string | null;
  startsAtLabel: string;
  status: string;
  statusLabel: string;
  summary: string | null;
  title: string;
  virtualLink: string | null;
};

export type AdminAssessmentSubmission = {
  attemptCount: number;
  attemptsRemaining: number;
  evidenceFileName: string | null;
  evidenceFileSizeBytes: number | null;
  evidenceMimeType: string | null;
  evidenceUrl: string | null;
  feedback: string | null;
  history: Array<{
    createdAtLabel: string;
    eventType: string;
    summary: string;
  }>;
  learnerEmail: string;
  learnerName: string;
  membershipId: string;
  resultLabel: string;
  roleSlug: "client_manager" | "learner";
  score: number | null;
  scoreLabel: string | null;
  status: "failed" | "in_progress" | "not_started" | "passed" | "returned" | "submitted";
  submissionId: string;
  submissionText: string | null;
  submittedAtLabel: string;
};

export type AdminAssessmentOperation = {
  assessmentId: string;
  cohortId: string;
  cohortTitle: string;
  dueAtLabel: string;
  maxAttempts: number;
  maxScore: number | null;
  moduleTitle: string | null;
  openLearnerCount: number;
  passScore: number | null;
  reminderTargetCount: number;
  status: string;
  statusLabel: string;
  submissions: AdminAssessmentSubmission[];
  title: string;
};

export type AdminRoleWorkspace = {
  adminAccounts: Array<{
    accountId: string;
    email: string;
    fullName: string;
    jobTitle: string | null;
    roles: string[];
    status: string;
  }>;
  canManage: boolean;
  clientAccounts: Array<{
    accountId: string;
    activatedAtLabel: string | null;
    email: string;
    fullName: string;
    invitedAtLabel: string | null;
    memberships: Array<{
      certificationStatus: string;
      cohortTitle: string;
      membershipId: string;
      roleSlug: "client_manager" | "learner";
    }>;
    onboardingStatus: "active" | "invited" | "pending";
    roleTitle: string | null;
    roles: string[];
    status: string;
  }>;
  definitions: Array<{
    description: string;
    label: string;
    scope: "admin" | "client";
    slug: TrainingRoleSlug;
  }>;
};

export type AdminCertificationWorkspace = {
  canManage: boolean;
  items: Array<{
    attendancePercentage: number;
    averageScore: number;
    certificateId: string | null;
    certificateNumber: string | null;
    certificateUrl: string | null;
    certificationStatus: string;
    cohortTitle: string;
    completionPercentage: number;
    learnerEmail: string;
    learnerName: string;
    membershipId: string;
    note: string;
  }>;
};

export type AdminResourceWorkspace = {
  canManage: boolean;
  resources: Array<{
    audienceLabel: string;
    cohortTitle: string | null;
    href: string | null;
    moduleTitle: string | null;
    programmeTitle: string | null;
    resourceId: string;
    resourceKind: string;
    resourceKindLabel: string;
    status: string;
    statusLabel: string;
    summary: string | null;
    title: string;
    versionLabel: string | null;
    visibleFrom: string | null;
    visibleFromLabel: string;
  }>;
};

export type ClientTrainingWorkspace = {
  assessments: Array<
    TrainingPageListItem & {
      assessmentId: string;
      attemptCount: number;
      attemptsRemaining: number;
      canSubmit: boolean;
      certificateImpact: string;
      dueAtLabel: string;
      evidenceFileName: string | null;
      evidenceFileSizeBytes: number | null;
      evidenceMimeType: string | null;
      evidenceUrl: string | null;
      feedback: string | null;
      history: Array<{
        createdAtLabel: string;
        eventType: string;
        summary: string;
      }>;
      instructions: string | null;
      nextAction: string;
      passScore: number | null;
      retakeAvailable: boolean;
      scoreLabel: string | null;
      statusDetail: string;
      submissionText: string | null;
    }
  >;
  certification: {
    certificateUrl: string | null;
    certificateNumber: string | null;
    note: string;
    statusLabel: string;
  };
  intro: {
    description: string;
    eyebrow: string;
    title: string;
  };
  metrics: TrainingMetric[];
  modules: TrainingPageListItem[];
  moduleDetails: Array<{
    assessments: Array<{
      dueAtLabel: string;
      statusLabel: string;
      title: string;
    }>;
    deliveryTypeLabel: string;
    durationLabel: string;
    moduleId: string;
    outcomes: string[];
    phaseLabel: string;
    resources: Array<{
      statusLabel: string;
      title: string;
      versionLabel: string | null;
    }>;
    sessions: Array<{
      startsAtLabel: string;
      statusLabel: string;
      title: string;
    }>;
    statusLabel: string;
    summary: string;
    title: string;
  }>;
  nextSession: {
    checklist: string[];
    facilitator: string;
    format: string;
    time: string;
    title: string;
    venue: string;
  } | null;
  onboarding: {
    activatedAtLabel: string | null;
    completed: boolean;
    completedAtLabel: string | null;
    invitedAtLabel: string | null;
    nextStep: string;
    statusLabel: string;
  };
  progress: Array<{ label: string; note: string; value: string }>;
  progressTimeline: Array<{
    id: string;
    meta: string;
    note: string;
    status: string;
    title: string;
  }>;
  resources: TrainingPageListItem[];
  resourceDetails: Array<{
    href: string | null;
    id: string;
    meta: string;
    status: string;
    summary: string | null;
    title: string;
    versionLabel: string | null;
  }>;
  roleLabel: string;
  sessionCalendar: Array<{
    attendanceLabel: string | null;
    cohortTitle: string;
    deliveryModeLabel: string;
    endsAtLabel: string;
    facilitatorNotes: string | null;
    followUpActions: string | null;
    locationLabel: string | null;
    moduleTitle: string | null;
    prework: Array<{
      itemId: string;
      note: string | null;
      status: "approved" | "done" | "todo";
      title: string;
    }>;
    readinessLabel: string;
    sessionId: string;
    startsAtLabel: string;
    statusLabel: string;
    summary: string | null;
    title: string;
    virtualLink: string | null;
  }>;
  sessions: TrainingPageListItem[];
  signals: TrainingPageListItem[];
  viewerName: string;
};

export type CreateTrainingCohortInput = {
  clientId: string;
  managerAccountId?: string | null;
  notes?: string | null;
  programmeId: string;
  sponsorEmail?: string | null;
  sponsorName?: string | null;
  startsOn?: string | null;
  title: string;
  trainerAdminId?: string | null;
};

export type CreateTrainingSessionInput = {
  cohortId: string;
  deliveryMode?: string;
  endsAt?: string | null;
  facilitatorNotes?: string | null;
  followUpActions?: string | null;
  locationLabel?: string | null;
  moduleId?: string | null;
  preworkItems?: string[];
  readinessStatus?: string;
  sessionType?: string;
  startsAt?: string | null;
  summary?: string | null;
  title: string;
  virtualLink?: string | null;
};

export type CreateTrainingLearnerInput = {
  cohortId: string;
  email: string;
  fullName: string;
  roleSlug?: "client_manager" | "learner";
  roleTitle?: string | null;
};

export type CreateTrainingAssessmentInput = {
  assessmentType?: string;
  cohortId: string;
  dueAt?: string | null;
  instructions?: string | null;
  maxAttempts?: number | null;
  maxScore?: number | null;
  moduleId?: string | null;
  passScore?: number | null;
  title: string;
};

export type CreateTrainingResourceInput = {
  audienceRoleSlug?: "trainer" | "client_manager" | "learner" | "all";
  cohortId?: string | null;
  href?: string | null;
  moduleId?: string | null;
  programmeId?: string | null;
  resourceKind?: string;
  status?: string;
  summary?: string | null;
  title: string;
  versionLabel?: string | null;
  visibleFrom?: string | null;
};

function getSupabaseAdminClientOrThrow() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase is not configured for training data.");
  }

  return supabase;
}

function toTitleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function slugifyText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function createTrainingCohortCode(
  seed: string,
  options?: {
    middle?: string;
    uniqueSeed?: string | null;
  },
) {
  const prefix = slugifyText(seed).replace(/-/g, "").toUpperCase().slice(0, 8) || "COHORT";
  const uniqueSource = (options?.uniqueSeed ?? randomUUID()).replace(/[^a-z0-9]/gi, "").toUpperCase();
  const uniqueSuffix = uniqueSource.slice(-4) || randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  const middle = options?.middle?.trim().replace(/[^A-Z0-9]/gi, "").toUpperCase();

  return middle
    ? `${prefix}-${middle}-${new Date().getFullYear()}-${uniqueSuffix}`
    : `${prefix}-${new Date().getFullYear()}-${uniqueSuffix}`;
}

function formatDateLabel(value?: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) {
    return "TBC";
  }

  return new Intl.DateTimeFormat("en-GB", options ?? { dateStyle: "medium" }).format(new Date(value));
}

function formatDateTimeLabel(value?: string | null) {
  if (!value) {
    return "Schedule to be confirmed";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function formatAssessmentScore(score?: number | null, maxScore?: number | null) {
  if (typeof score !== "number") {
    return null;
  }

  if (typeof maxScore === "number" && maxScore > 0) {
    return `${score}/${maxScore}`;
  }

  return `${score}`;
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
}

function sanitizeStorageFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "file";
}

function validateEvidenceFile(file: File) {
  if (file.size > MAX_EVIDENCE_FILE_BYTES) {
    throw new Error("Evidence files must be smaller than 10 MB.");
  }

  const lowerName = file.name.toLowerCase();
  const extension = lowerName.includes(".") ? lowerName.slice(lowerName.lastIndexOf(".")) : "";
  const mimeType = file.type || "application/octet-stream";

  if (!ALLOWED_EVIDENCE_EXTENSIONS.has(extension) || !ALLOWED_EVIDENCE_MIME_TYPES.has(mimeType)) {
    throw new Error("Unsupported evidence file type. Use PDF, Office, CSV, text, or image formats only.");
  }

  return {
    extension,
    mimeType,
  };
}

async function createSignedStorageUrl(
  supabase: SupabaseAdminClient,
  bucket: string,
  path: string | null | undefined,
  expiresIn = 60 * 60,
) {
  if (!path) {
    return null;
  }

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}

async function recordTrainingSubmissionEvent(
  supabase: SupabaseAdminClient,
  input: {
    actorScope: "admin" | "client" | "system";
    adminAccountId?: string | null;
    assessmentId: string;
    clientAccountId?: string | null;
    eventType:
      | "assessment_closed"
      | "assessment_reopened"
      | "attempt_override"
      | "evidence_uploaded"
      | "graded_failed"
      | "graded_passed"
      | "override_failed"
      | "override_passed"
      | "returned"
      | "submitted";
    membershipId: string;
    payload?: Record<string, unknown>;
    submissionId: string;
    summary: string;
  },
) {
  await selectOrThrow(
    supabase.from("training_assessment_submission_events").insert([
      {
        admin_account_id: input.adminAccountId ?? null,
        assessment_id: input.assessmentId,
        actor_scope: input.actorScope,
        client_account_id: input.clientAccountId ?? null,
        event_type: input.eventType,
        membership_id: input.membershipId,
        payload: input.payload ?? {},
        submission_id: input.submissionId,
        summary: input.summary,
      },
    ]),
  );
}

async function recordTrainingReminder(
  supabase: SupabaseAdminClient,
  input: {
    recipientAccountId: string;
    recipientScope: "admin" | "client";
    reminderKind: "assessment_due" | "certificate_awarded" | "certificate_ready" | "grading_queue" | "session_upcoming";
    targetEntityId: string;
    targetEntityType:
      | "training_assessment_submissions"
      | "training_assessments"
      | "training_certificates"
      | "training_cohort_memberships"
      | "training_sessions";
    windowKey: string;
  },
) {
  const { error } = await supabase.from("training_reminder_log").insert([
    {
      recipient_account_id: input.recipientAccountId,
      recipient_scope: input.recipientScope,
      reminder_kind: input.reminderKind,
      reminder_window_key: input.windowKey,
      target_entity_id: input.targetEntityId,
      target_entity_type: input.targetEntityType,
    },
  ]);

  if (error && !error.message.toLowerCase().includes("duplicate")) {
    throw new Error(error.message);
  }

  return !error;
}

function buildCertificateHtml({
  certificateNumber,
  cohortTitle,
  learnerName,
  programmeTitle,
}: {
  certificateNumber: string;
  cohortTitle: string;
  learnerName: string;
  programmeTitle: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${certificateNumber}</title>
    <style>
      body { font-family: Georgia, 'Times New Roman', serif; margin: 0; background: #f6f2ef; color: #1f1d1d; }
      .wrap { max-width: 920px; margin: 32px auto; background: #fffdfb; border: 12px solid #8a0917; padding: 56px 64px; box-shadow: 0 24px 80px rgba(31,29,29,0.12); }
      .eyebrow { letter-spacing: 0.35em; text-transform: uppercase; font-size: 12px; color: #8e6200; font-weight: 700; }
      h1 { font-size: 56px; line-height: 1.02; margin: 20px 0 12px; color: #690711; font-weight: 500; }
      h2 { font-size: 18px; letter-spacing: 0.2em; text-transform: uppercase; color: #5b6472; margin: 0; }
      p { font-size: 18px; line-height: 1.8; margin: 16px 0; }
      .name { font-size: 42px; line-height: 1.1; color: #2b2929; margin-top: 28px; }
      .number { margin-top: 36px; padding-top: 24px; border-top: 1px solid #eaded9; font-size: 14px; letter-spacing: 0.18em; text-transform: uppercase; color: #5b6472; }
    </style>
  </head>
  <body>
    <main class="wrap">
      <div class="eyebrow">Tacklers Consulting Group</div>
      <h1>Lean Training Certificate</h1>
      <h2>Operational excellence, built to hold.</h2>
      <p>This certificate confirms that</p>
      <div class="name">${learnerName}</div>
      <p>has successfully completed the <strong>${programmeTitle}</strong> pathway delivered through the <strong>${cohortTitle}</strong> cohort.</p>
      <p>The learner has completed the required sessions, evidence reviews, and capability milestones expected for certificate award.</p>
      <div class="number">Certificate number: ${certificateNumber}</div>
    </main>
  </body>
</html>`;
}

function countBy<T>(items: T[], predicate: (item: T) => boolean) {
  return items.reduce((total, item) => total + (predicate(item) ? 1 : 0), 0);
}

function toneFromReadiness(status: string): TrainingTone {
  const normalized = status.toLowerCase();

  if (normalized.includes("red") || normalized.includes("risk") || normalized.includes("missed") || normalized.includes("failed")) {
    return "risk";
  }

  if (normalized.includes("amber") || normalized.includes("queue") || normalized.includes("draft") || normalized.includes("review")) {
    return "warning";
  }

  if (normalized.includes("green") || normalized.includes("completed") || normalized.includes("ready") || normalized.includes("passed")) {
    return "good";
  }

  return "neutral";
}

function normalizeClientRole(account: ClientAccountRecord) {
  const title = `${account.role_title ?? ""} ${account.full_name}`.toLowerCase();
  return /(manager|sponsor|lead|head)/.test(title) ? "client_manager" : "learner";
}

async function selectOrThrow<T>(promise: PromiseLike<{ data: T | null; error: { message: string } | null }>) {
  const { data, error } = await promise;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function listRoleDefinitions(supabase: SupabaseAdminClient) {
  return ((await selectOrThrow(
    supabase.from("role_definitions").select("id, slug, scope, label, description"),
  )) ?? []) as RoleDefinitionRow[];
}

async function ensureAdminRoles(supabase: SupabaseAdminClient, account: AdminAccountRecord) {
  const definitions = await listRoleDefinitions(supabase);
  const preferredRole: TrainingRoleSlug = account.email.toLowerCase() === "hello@tacklersconsulting.com" ? "admin_owner" : "trainer";
  const definition = definitions.find((item) => item.slug === preferredRole);

  if (!definition) {
    throw new Error(`Missing role definition for ${preferredRole}.`);
  }

  const existingAssignments = ((await selectOrThrow(
    supabase.from("admin_account_roles").select("id, role_id").eq("admin_account_id", account.id),
  )) ?? []) as Array<{ id: string; role_id: string }>;

  if (!existingAssignments.some((item) => item.role_id === definition.id)) {
    await selectOrThrow(
      supabase.from("admin_account_roles").insert([
        {
          admin_account_id: account.id,
          role_id: definition.id,
        },
      ]).select("id"),
    );
  }

  const roleAssignments = ((await selectOrThrow(
    supabase.from("admin_account_roles").select("role_id").eq("admin_account_id", account.id),
  )) ?? []) as Array<{ role_id: string }>;

  return definitions
    .filter((item) => roleAssignments.some((assignment) => assignment.role_id === item.id))
    .map((item) => item.slug);
}

async function ensureClientRoles(supabase: SupabaseAdminClient, account: ClientAccountRecord) {
  const definitions = await listRoleDefinitions(supabase);
  const preferredRole = normalizeClientRole(account);
  const definition = definitions.find((item) => item.slug === preferredRole);

  if (!definition) {
    throw new Error(`Missing role definition for ${preferredRole}.`);
  }

  const existingAssignments = ((await selectOrThrow(
    supabase.from("client_account_roles").select("id, role_id").eq("client_account_id", account.id),
  )) ?? []) as Array<{ id: string; role_id: string }>;

  if (!existingAssignments.some((item) => item.role_id === definition.id)) {
    await selectOrThrow(
      supabase.from("client_account_roles").insert([
        {
          client_account_id: account.id,
          role_id: definition.id,
        },
      ]).select("id"),
    );
  }

  const roleAssignments = ((await selectOrThrow(
    supabase.from("client_account_roles").select("role_id").eq("client_account_id", account.id),
  )) ?? []) as Array<{ role_id: string }>;

  return definitions
    .filter((item) => roleAssignments.some((assignment) => assignment.role_id === item.id))
    .map((item) => item.slug);
}

async function ensureBaseTrainingAdminAccount(supabase: SupabaseAdminClient) {
  const existingAdmin = ((await selectOrThrow(
    supabase.from("admin_accounts").select("*").order("created_at", { ascending: true }).limit(1).maybeSingle(),
  )) ?? null) as AdminAccountRecord | null;

  if (existingAdmin) {
    return existingAdmin;
  }

  const { data, error } = await supabase
    .from("admin_accounts")
    .insert([
      {
        email: process.env.ADMIN_EMAIL?.trim().toLowerCase() || "hello@tacklersconsulting.com",
        full_name: process.env.ADMIN_NAME?.trim() || "Tacklers Admin",
        job_title: "Training operations lead",
        status: "active",
      },
    ])
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to create the base training admin account.");
  }

  return data as AdminAccountRecord;
}

async function ensureTrainingSeedDataForClient({
  account,
  client,
  primaryAdmin,
  roleSlugs,
  supabase,
}: {
  account: ClientAccountRecord;
  client: ClientRecord;
  primaryAdmin: AdminAccountRecord | null;
  roleSlugs: string[];
  supabase: SupabaseAdminClient;
}) {
  async function ensureTrainingMembership({
    account,
    cohort,
    roleSlugs,
    supabase,
  }: {
    account: ClientAccountRecord;
    cohort: TrainingCohortRow;
    roleSlugs: string[];
    supabase: SupabaseAdminClient;
  }) {
    const existingMembership = ((await selectOrThrow(
      supabase
        .from("training_cohort_memberships")
        .select("*")
        .eq("cohort_id", cohort.id)
        .eq("client_account_id", account.id)
        .limit(1)
        .maybeSingle(),
    )) ?? null) as TrainingMembershipRow | null;

    if (!existingMembership) {
      await supabase.from("training_cohort_memberships").insert([
        {
          client_account_id: account.id,
          cohort_id: cohort.id,
          confidence_baseline: 42,
          confidence_current: roleSlugs.includes("client_manager") ? 70 : 58,
          enrollment_status: "active",
          role_slug: roleSlugs.includes("client_manager") ? "client_manager" : "learner",
        },
      ]);
      return;
    }

    if (account.activated_at && existingMembership.enrollment_status === "invited") {
      await selectOrThrow(
        supabase
          .from("training_cohort_memberships")
          .update({ enrollment_status: "active" })
          .eq("id", existingMembership.id),
      );
    }
  }

  const programme = ((await selectOrThrow(
    supabase
      .from("training_programmes")
      .select("*")
      .eq("slug", "lean-fundamentals-practitioner")
      .limit(1)
      .maybeSingle(),
  )) ?? null) as TrainingProgrammeRow | null;

  if (!programme) {
    throw new Error("Training programme templates are not available.");
  }

  const existingCohorts = ((await selectOrThrow(
    supabase
      .from("training_cohorts")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true }),
  )) ?? []) as TrainingCohortRow[];

  let cohort = existingCohorts[0] ?? null;

  if (!cohort) {
    const cohortTitle = `${client.name} Lean Fundamentals Cohort`;
    const cohortCode = createTrainingCohortCode(client.slug || client.name, {
      middle: "LF",
      uniqueSeed: client.id,
    });
    const now = new Date();
    const startsOn = new Date(now);
    const endsOn = new Date(now);
    endsOn.setDate(endsOn.getDate() + 42);

    const { data, error } = await supabase
      .from("training_cohorts")
      .insert([
        {
          client_id: client.id,
          code: cohortCode,
          delivery_mode: "onsite",
          ends_on: endsOn.toISOString().slice(0, 10),
          notes: "Seeded training cohort to anchor live sessions, assessments, and resources.",
          primary_client_manager_id: roleSlugs.includes("client_manager") ? account.id : null,
          primary_trainer_admin_id: primaryAdmin?.id ?? null,
          programme_id: programme.id,
          sponsor_email: client.account_owner_email ?? account.email,
          sponsor_name: client.account_owner_name ?? account.full_name,
          starts_on: startsOn.toISOString().slice(0, 10),
          status: "active",
          title: cohortTitle,
        },
      ])
      .select("*")
      .single();

    if (error || !data) {
      const cohortInsertConflict = error?.code === "23505" || /duplicate key value/i.test(error?.message ?? "");

      if (cohortInsertConflict) {
        const retryCohort = ((await selectOrThrow(
          supabase
            .from("training_cohorts")
            .select("*")
            .eq("client_id", client.id)
            .order("created_at", { ascending: true })
            .limit(1)
            .maybeSingle(),
        )) ?? null) as TrainingCohortRow | null;

        if (retryCohort) {
          cohort = retryCohort;
        } else {
          throw new Error(error?.message ?? "Unable to create the client training cohort.");
        }
      } else {
        throw new Error(error?.message ?? "Unable to create the client training cohort.");
      }
    }

    if (cohort) {
      return ensureTrainingMembership({
        account,
        cohort,
        roleSlugs,
        supabase,
      });
    }

    cohort = data as TrainingCohortRow;

    if (primaryAdmin?.id) {
      await supabase.from("training_cohort_trainers").upsert(
        [
          {
            admin_account_id: primaryAdmin.id,
            cohort_id: cohort.id,
            role_label: "Lead trainer",
          },
        ],
        { onConflict: "cohort_id,admin_account_id" },
      );
    }

    const modules = ((await selectOrThrow(
      supabase
        .from("training_programme_modules")
        .select("*")
        .eq("programme_id", programme.id)
        .order("sort_order", { ascending: true }),
    )) ?? []) as TrainingModuleRow[];

    const baseStart = new Date();
    baseStart.setHours(9, 0, 0, 0);

    for (const [index, module] of modules.entries()) {
      const sessionStart = new Date(baseStart);
      sessionStart.setDate(baseStart.getDate() + index * 7);
      const sessionEnd = new Date(sessionStart);
      sessionEnd.setHours(sessionStart.getHours() + (index === 1 ? 6 : 3));

      const { data: insertedSession, error: sessionError } = await supabase
        .from("training_sessions")
        .insert([
          {
            cohort_id: cohort.id,
            created_by_admin_id: primaryAdmin?.id ?? null,
            delivery_mode: "onsite",
            location_label: "Client site training room",
            module_id: module.id,
            readiness_status: index === 0 ? "ready" : "materials_pending",
            starts_at: sessionStart.toISOString(),
            ends_at: sessionEnd.toISOString(),
            status: index === 0 ? "scheduled" : "draft",
            summary: module.summary,
            title: module.title,
          },
        ])
        .select("*")
        .single();

      if (sessionError || !insertedSession) {
        throw new Error(sessionError?.message ?? "Unable to seed the training session.");
      }

      const preworkItems = [
        `Review the ${module.title} workbook and mark one example from your own area.`,
        `Prepare one real process problem or opportunity to discuss during ${module.title}.`,
      ];

      await supabase.from("training_session_prework_items").insert(
        preworkItems.map((item, itemIndex) => ({
          description: "Seeded preparation step for the training journey.",
          is_required: true,
          session_id: insertedSession.id,
          sort_order: itemIndex,
          title: item,
        })),
      );

      await supabase.from("training_resources").insert([
        {
          audience_role_slug: "learner",
          cohort_id: cohort.id,
          created_by_admin_id: primaryAdmin?.id ?? null,
          delivery_channel: "link",
          href: "/client-hub/resources",
          module_id: module.id,
          programme_id: programme.id,
          resource_kind: index === 0 ? "prework" : "workbook",
          sort_order: index,
          status: "released",
          summary: `Live resource pack for ${module.title}.`,
          title: `${module.title} Participant Pack`,
          version_label: "v1.0",
        },
      ]);

      if (index < 3) {
        const dueAt = new Date(sessionEnd);
        dueAt.setDate(dueAt.getDate() + 2);

        await supabase.from("training_assessments").insert([
          {
            assessment_type: index === 1 ? "practical" : "quiz",
            cohort_id: cohort.id,
            created_by_admin_id: primaryAdmin?.id ?? null,
            due_at: dueAt.toISOString(),
            grading_mode: "manual",
            instructions: `Submit the evidence that proves ${module.title} is landing in the real process.`,
            max_attempts: 2,
            max_score: 100,
            module_id: module.id,
            pass_score: 80,
            release_at: sessionEnd.toISOString(),
            status: "open",
            summary: `Assessment linked to ${module.title}.`,
            title: `${module.title} Knowledge Check`,
          },
        ]);
      }
    }
  }

  const seededSession = ((await selectOrThrow(
    supabase
      .from("training_sessions")
      .select("id, facilitator_notes, follow_up_actions, virtual_link")
      .eq("cohort_id", cohort.id)
      .order("starts_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  )) ?? null) as Pick<TrainingSessionRow, "id" | "facilitator_notes" | "follow_up_actions" | "virtual_link"> | null;

  if (seededSession && (!seededSession.facilitator_notes || !seededSession.follow_up_actions)) {
    await selectOrThrow(
      supabase
        .from("training_sessions")
        .update({
          facilitator_notes:
            seededSession.facilitator_notes ??
            "Bring one live process example so the session can connect Lean principles to your real operating environment.",
          follow_up_actions:
            seededSession.follow_up_actions ??
            "Capture one waste observation after the workshop and share the improvement opportunity with your sponsor or line lead.",
          virtual_link: seededSession.virtual_link ?? null,
        })
        .eq("id", seededSession.id),
    );
  }

  await ensureTrainingMembership({
    account,
    cohort,
    roleSlugs,
    supabase,
  });
}

async function ensureAdminTrainingContext() {
  const context = await ensureAdminPortalContext();
  const supabase = getSupabaseAdminClientOrThrow();
  const roleSlugs = await ensureAdminRoles(supabase, context.account);

  return {
    ...context,
    roleSlugs,
    supabase,
  };
}

async function ensureClientTrainingContext() {
  const context = await ensureClientPortalContext();
  const supabase = getSupabaseAdminClientOrThrow();
  const roleSlugs = await ensureClientRoles(supabase, context.account);
  const primaryAdmin = await ensureBaseTrainingAdminAccount(supabase).catch(() => null);

  await ensureTrainingSeedDataForClient({
    account: context.account,
    client: context.client,
    primaryAdmin,
    roleSlugs,
    supabase,
  });

  return {
    ...context,
    primaryRole: (roleSlugs.includes("client_manager") ? "client_manager" : "learner") as "client_manager" | "learner",
    roleSlugs,
    supabase,
  };
}

async function loadTrainingTables(supabase: SupabaseAdminClient) {
  const [
    programmes,
    modules,
    outcomes,
    cohorts,
    cohortTrainers,
    memberships,
    sessions,
    preworkItems,
    preworkStatus,
    attendance,
    assessments,
    submissions,
    resources,
    progressSnapshots,
    clients,
    adminAccounts,
    clientAccounts,
    roleDefinitions,
    adminRoleAssignments,
    clientRoleAssignments,
    certificates,
    submissionEvents,
  ] = await Promise.all([
    selectOrThrow(supabase.from("training_programmes").select("*").order("title", { ascending: true })),
    selectOrThrow(supabase.from("training_programme_modules").select("*").order("sort_order", { ascending: true })),
    selectOrThrow(supabase.from("training_module_outcomes").select("*").order("sort_order", { ascending: true })),
    selectOrThrow(supabase.from("training_cohorts").select("*").order("starts_on", { ascending: true })),
    selectOrThrow(supabase.from("training_cohort_trainers").select("*").order("sort_order", { ascending: true })),
    selectOrThrow(supabase.from("training_cohort_memberships").select("*").order("joined_at", { ascending: true })),
    selectOrThrow(supabase.from("training_sessions").select("*").order("starts_at", { ascending: true })),
    selectOrThrow(supabase.from("training_session_prework_items").select("*").order("sort_order", { ascending: true })),
    selectOrThrow(supabase.from("training_session_prework_status").select("*")),
    selectOrThrow(supabase.from("training_session_attendance").select("*")),
    selectOrThrow(supabase.from("training_assessments").select("*").order("due_at", { ascending: true })),
    selectOrThrow(supabase.from("training_assessment_submissions").select("*")),
    selectOrThrow(supabase.from("training_resources").select("*").order("sort_order", { ascending: true })),
    selectOrThrow(supabase.from("training_progress_snapshots").select("*")),
    selectOrThrow(supabase.from("clients").select("id, name, slug, industry, status, location_label")),
    selectOrThrow(supabase.from("admin_accounts").select("*")),
    selectOrThrow(supabase.from("client_accounts").select("*")),
    selectOrThrow(supabase.from("role_definitions").select("id, slug, scope, label, description")),
    selectOrThrow(supabase.from("admin_account_roles").select("id, admin_account_id, role_id")),
    selectOrThrow(supabase.from("client_account_roles").select("id, client_account_id, role_id")),
    selectOrThrow(supabase.from("training_certificates").select("*")),
    selectOrThrow(supabase.from("training_assessment_submission_events").select("*").order("created_at", { ascending: true })),
  ]);

  return {
    adminAccounts: (adminAccounts ?? []) as AdminAccountRecord[],
    adminRoleAssignments: (adminRoleAssignments ?? []) as TrainingRoleAssignmentRow[],
    assessments: (assessments ?? []) as TrainingAssessmentRow[],
    attendance: (attendance ?? []) as TrainingAttendanceRow[],
    certificates: (certificates ?? []) as TrainingCertificateRow[],
    clientAccounts: (clientAccounts ?? []) as ClientAccountRecord[],
    clients: (clients ?? []) as ClientRecord[],
    clientRoleAssignments: (clientRoleAssignments ?? []) as TrainingRoleAssignmentRow[],
    cohortTrainers: (cohortTrainers ?? []) as TrainingCohortTrainerRow[],
    cohorts: (cohorts ?? []) as TrainingCohortRow[],
    memberships: (memberships ?? []) as TrainingMembershipRow[],
    modules: (modules ?? []) as TrainingModuleRow[],
    outcomes: (outcomes ?? []) as TrainingModuleOutcomeRow[],
    preworkItems: (preworkItems ?? []) as TrainingPreworkItemRow[],
    preworkStatus: (preworkStatus ?? []) as TrainingPreworkStatusRow[],
    programmes: (programmes ?? []) as TrainingProgrammeRow[],
    progressSnapshots: (progressSnapshots ?? []) as TrainingProgressSnapshotRow[],
    resources: (resources ?? []) as TrainingResourceRow[],
    roleDefinitions: (roleDefinitions ?? []) as RoleDefinitionRow[],
    sessions: (sessions ?? []) as TrainingSessionRow[],
    submissionEvents: (submissionEvents ?? []) as TrainingSubmissionEventRow[],
    submissions: (submissions ?? []) as TrainingSubmissionRow[],
  } satisfies TrainingDataSet;
}

function filterTrainingDataForAdmin(
  data: TrainingDataSet,
  account: AdminAccountRecord,
  roleSlugs: string[],
): TrainingDataSet {
  if (roleSlugs.includes("admin_owner")) {
    return data;
  }

  const assignedCohortIds = new Set(
    data.cohortTrainers
      .filter((item) => item.admin_account_id === account.id)
      .map((item) => item.cohort_id),
  );
  const visibleCohorts = data.cohorts.filter((cohort) => assignedCohortIds.has(cohort.id));
  const visibleCohortIds = new Set(visibleCohorts.map((item) => item.id));
  const visibleSessions = data.sessions.filter((session) => visibleCohortIds.has(session.cohort_id));
  const visibleSessionIds = new Set(visibleSessions.map((item) => item.id));
  const visibleMemberships = data.memberships.filter((membership) => visibleCohortIds.has(membership.cohort_id));
  const visibleMembershipIds = new Set(visibleMemberships.map((item) => item.id));
  const visibleAssessments = data.assessments.filter((assessment) => visibleCohortIds.has(assessment.cohort_id));
  const visibleAssessmentIds = new Set(visibleAssessments.map((item) => item.id));
  const visibleProgrammeIds = new Set(visibleCohorts.map((item) => item.programme_id));
  const visibleClientIds = new Set(visibleCohorts.map((item) => item.client_id));
  const visibleClientAccountIds = new Set(visibleMemberships.map((item) => item.client_account_id));

  return {
    ...data,
    adminRoleAssignments: data.adminRoleAssignments.filter((assignment) => assignment.admin_account_id === account.id),
    assessments: visibleAssessments,
    attendance: data.attendance.filter(
      (attendance) => visibleSessionIds.has(attendance.session_id) && visibleMembershipIds.has(attendance.membership_id),
    ),
    certificates: data.certificates.filter((certificate) => visibleMembershipIds.has(certificate.membership_id)),
    clientAccounts: data.clientAccounts.filter((item) => visibleClientAccountIds.has(item.id)),
    clientRoleAssignments: data.clientRoleAssignments.filter((assignment) => visibleClientAccountIds.has(assignment.client_account_id ?? "")),
    clients: data.clients.filter((client) => visibleClientIds.has(client.id)),
    cohortTrainers: data.cohortTrainers.filter((item) => visibleCohortIds.has(item.cohort_id)),
    cohorts: visibleCohorts,
    memberships: visibleMemberships,
    preworkItems: data.preworkItems.filter((item) => visibleSessionIds.has(item.session_id)),
    preworkStatus: data.preworkStatus.filter((item) => visibleMembershipIds.has(item.membership_id)),
    programmes: data.programmes.filter((programme) => visibleProgrammeIds.has(programme.id)),
    progressSnapshots: data.progressSnapshots.filter((item) => visibleMembershipIds.has(item.membership_id)),
    resources: data.resources.filter((resource) => {
      if (resource.cohort_id && visibleCohortIds.has(resource.cohort_id)) {
        return true;
      }

      if (!resource.cohort_id && resource.programme_id && visibleProgrammeIds.has(resource.programme_id)) {
        return resource.audience_role_slug === "all" || resource.audience_role_slug === "trainer";
      }

      return false;
    }),
    sessions: visibleSessions,
    submissionEvents: data.submissionEvents.filter(
      (event) => visibleAssessmentIds.has(event.assessment_id) && visibleMembershipIds.has(event.membership_id),
    ),
    submissions: data.submissions.filter(
      (submission) => visibleAssessmentIds.has(submission.assessment_id) && visibleMembershipIds.has(submission.membership_id),
    ),
  };
}

async function getAdminVisibleTrainingData() {
  const context = await ensureAdminTrainingContext();
  const data = filterTrainingDataForAdmin(await loadTrainingTables(context.supabase), context.account, context.roleSlugs);

  return {
    ...context,
    data,
  };
}

async function getTrainingCohortForAdmin(
  supabase: SupabaseAdminClient,
  account: AdminAccountRecord,
  roleSlugs: string[],
  cohortId: string,
) {
  const cohort = ((await selectOrThrow(
    supabase.from("training_cohorts").select("*").eq("id", cohortId).limit(1).maybeSingle(),
  )) ?? null) as TrainingCohortRow | null;

  if (!cohort) {
    throw new Error("Training cohort not found.");
  }

  if (roleSlugs.includes("admin_owner")) {
    return cohort;
  }

  const assignment = ((await selectOrThrow(
    supabase
      .from("training_cohort_trainers")
      .select("id")
      .eq("cohort_id", cohort.id)
      .eq("admin_account_id", account.id)
      .limit(1)
      .maybeSingle(),
  )) ?? null) as { id: string } | null;

  if (!assignment) {
    throw new Error("You only have access to cohorts assigned to you.");
  }

  return cohort;
}

async function getClientAccountForAdmin(
  supabase: SupabaseAdminClient,
  account: AdminAccountRecord,
  roleSlugs: string[],
  clientAccountId: string,
) {
  const clientAccount = ((await selectOrThrow(
    supabase.from("client_accounts").select("*").eq("id", clientAccountId).limit(1).maybeSingle(),
  )) ?? null) as ClientAccountRecord | null;

  if (!clientAccount) {
    throw new Error("Client account not found.");
  }

  if (roleSlugs.includes("admin_owner")) {
    return clientAccount;
  }

  const memberships = ((await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .select("*")
      .eq("client_account_id", clientAccount.id),
  )) ?? []) as TrainingMembershipRow[];

  if (!memberships.length) {
    throw new Error("You only have access to client accounts inside your assigned cohorts.");
  }

  for (const membership of memberships) {
    const assignment = ((await selectOrThrow(
      supabase
        .from("training_cohort_trainers")
        .select("id")
        .eq("cohort_id", membership.cohort_id)
        .eq("admin_account_id", account.id)
        .limit(1)
        .maybeSingle(),
    )) ?? null) as { id: string } | null;

    if (assignment) {
      return clientAccount;
    }
  }

  throw new Error("You only have access to client accounts inside your assigned cohorts.");
}

async function assertAdminOwner() {
  const context = await ensureAdminTrainingContext();

  if (!context.roleSlugs.includes("admin_owner")) {
    throw new Error("Only admin owners can manage training roles and certification governance.");
  }

  return context;
}

function getRoleSlugsForAccount({
  accountId,
  assignments,
  definitions,
  scope,
}: {
  accountId: string;
  assignments: TrainingRoleAssignmentRow[];
  definitions: RoleDefinitionRow[];
  scope: "admin" | "client";
}) {
  return definitions
    .filter((definition) => definition.scope === scope)
    .filter((definition) =>
      assignments.some(
        (assignment) =>
          assignment.role_id === definition.id &&
          (scope === "admin" ? assignment.admin_account_id === accountId : assignment.client_account_id === accountId),
      ),
    )
    .map((definition) => definition.slug);
}

async function refreshMembershipCertification(supabase: SupabaseAdminClient, membershipId: string) {
  await selectOrThrow(
    supabase.rpc("refresh_training_membership_certification", {
      target_membership_id: membershipId,
    }),
  );
}

async function refreshCohortCertification(supabase: SupabaseAdminClient, cohortId: string) {
  await selectOrThrow(
    supabase.rpc("refresh_training_certification_for_cohort", {
      target_cohort_id: cohortId,
    }),
  );
}

async function insertClientNotifications(
  supabase: SupabaseAdminClient,
  items: Array<{
    body: string;
    clientAccountId: string;
    linkHref?: string | null;
    priority?: "high" | "low" | "normal" | "urgent";
    title: string;
  }>,
) {
  const payload = items
    .filter((item) => item.clientAccountId)
    .map((item) => ({
      body: item.body,
      client_account_id: item.clientAccountId,
      delivery_channel: "in_app",
      link_href: item.linkHref ?? null,
      priority: item.priority ?? "normal",
      recipient_scope: "client",
      title: item.title,
    }));

  if (!payload.length) {
    return;
  }

  await selectOrThrow(supabase.from("notifications").insert(payload));
}

async function insertAdminNotifications(
  supabase: SupabaseAdminClient,
  items: Array<{
    adminAccountId: string;
    body: string;
    linkHref?: string | null;
    priority?: "high" | "low" | "normal" | "urgent";
    title: string;
  }>,
) {
  const payload = items
    .filter((item) => item.adminAccountId)
    .map((item) => ({
      admin_account_id: item.adminAccountId,
      body: item.body,
      delivery_channel: "in_app",
      link_href: item.linkHref ?? null,
      priority: item.priority ?? "normal",
      recipient_scope: "admin",
      title: item.title,
    }));

  if (!payload.length) {
    return;
  }

  await selectOrThrow(supabase.from("notifications").insert(payload));
}

function buildCertificateNumber(cohortCode: string, learnerName: string) {
  const suffix = learnerName
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 6)
    .padEnd(6, "X");

  return `${cohortCode}-${suffix}-${new Date().getFullYear()}`;
}

function mapAudienceLabel(audience: TrainingResourceRow["audience_role_slug"]) {
  switch (audience) {
    case "client_manager":
      return "Client managers";
    case "learner":
      return "Learners";
    case "trainer":
      return "Trainers";
    default:
      return "All roles";
  }
}

function buildTrainerLabelForCohort(
  cohortId: string,
  cohortTrainers: TrainingCohortTrainerRow[],
  adminAccounts: AdminAccountRecord[],
  fallbackTrainerId?: string | null,
) {
  const assigned = cohortTrainers
    .filter((item) => item.cohort_id === cohortId)
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((item) => adminAccounts.find((account) => account.id === item.admin_account_id)?.full_name)
    .filter((value): value is string => Boolean(value));

  if (assigned.length) {
    return assigned.join(", ");
  }

  const fallback = fallbackTrainerId
    ? adminAccounts.find((account) => account.id === fallbackTrainerId)?.full_name
    : null;

  return fallback ?? "Trainer to be assigned";
}

function buildModuleStatus({
  assessments,
  cohortId,
  memberships,
  module,
  progressSnapshots,
  sessions,
  submissions,
}: {
  assessments: TrainingAssessmentRow[];
  cohortId: string;
  memberships: TrainingMembershipRow[];
  module: TrainingModuleRow;
  progressSnapshots: TrainingProgressSnapshotRow[];
  sessions: TrainingSessionRow[];
  submissions: TrainingSubmissionRow[];
}) {
  const moduleSessions = sessions.filter((session) => session.cohort_id === cohortId && session.module_id === module.id);
  const moduleAssessments = assessments.filter((assessment) => assessment.cohort_id === cohortId && assessment.module_id === module.id);
  const moduleMembershipIds = new Set(memberships.filter((membership) => membership.cohort_id === cohortId).map((membership) => membership.id));
  const moduleSubmissions = submissions.filter(
    (submission) => moduleMembershipIds.has(submission.membership_id) && moduleAssessments.some((assessment) => assessment.id === submission.assessment_id),
  );
  const completedSessions = countBy(moduleSessions, (session) => session.status === "completed");
  const passedSubmissions = countBy(moduleSubmissions, (submission) => ["passed", "submitted", "returned"].includes(submission.status));
  const redSignals = countBy(
    progressSnapshots.filter((snapshot) => moduleMembershipIds.has(snapshot.membership_id)),
    (snapshot) => snapshot.readiness_status === "red",
  );

  if (redSignals > 0) {
    return "Needs intervention";
  }

  if (moduleAssessments.length && passedSubmissions >= moduleAssessments.length) {
    return "Completed";
  }

  if (completedSessions > 0) {
    return "In progress";
  }

  if (moduleSessions.some((session) => session.status === "scheduled")) {
    return "Scheduled";
  }

  return "Draft";
}

export async function getAdminTrainingWorkspace(): Promise<AdminTrainingWorkspace> {
  const { account, data, roleSlugs } = await getAdminVisibleTrainingData();

  const upcomingSessions = data.sessions.filter(
    (session) => session.starts_at && new Date(session.starts_at).getTime() >= Date.now() && session.status !== "cancelled",
  );
  const submittedAssessments = data.submissions.filter((submission) => submission.status === "submitted");
  const atRiskSnapshots = data.progressSnapshots.filter((snapshot) => snapshot.readiness_status === "red");
  const clientManagers = data.clientAccounts.filter((item) => normalizeClientRole(item) === "client_manager");
  const trainers = data.adminAccounts.filter((item) => item.status === "active");

  const cohorts = data.cohorts.map((cohort) => {
    const client = data.clients.find((item) => item.id === cohort.client_id);
    const nextSession = data.sessions
      .filter((session) => session.cohort_id === cohort.id && session.starts_at && session.status !== "cancelled")
      .sort((left, right) => (left.starts_at ?? "").localeCompare(right.starts_at ?? ""))[0];
    const cohortSnapshots = data.progressSnapshots.filter((snapshot) =>
      data.memberships.some((membership) => membership.id === snapshot.membership_id && membership.cohort_id === cohort.id),
    );
    const riskyLearners = countBy(cohortSnapshots, (snapshot) => snapshot.readiness_status === "red");
    const notReadySessions = countBy(
      data.sessions.filter((session) => session.cohort_id === cohort.id),
      (session) => ["not_ready", "materials_pending", "at_risk"].includes(session.readiness_status),
    );

    return {
      id: cohort.id,
      meta: `${client?.name ?? "Client"} • ${nextSession ? formatDateLabel(nextSession.starts_at) : "No live session scheduled"}`,
      note:
        riskyLearners > 0
          ? `${riskyLearners} learner${riskyLearners === 1 ? "" : "s"} need intervention before the next milestone.`
          : notReadySessions > 0
            ? `${notReadySessions} session${notReadySessions === 1 ? "" : "s"} still need materials or readiness work.`
            : "Delivery is on track and the cohort is moving through the next training milestone.",
      status: toTitleCase(cohort.status),
      title: cohort.title,
    };
  });

  const sessions = upcomingSessions.map((session) => {
    const cohort = data.cohorts.find((item) => item.id === session.cohort_id);
    return {
      id: session.id,
      meta: `${formatDateTimeLabel(session.starts_at)} • ${toTitleCase(session.delivery_mode)} • ${buildTrainerLabelForCohort(session.cohort_id, data.cohortTrainers, data.adminAccounts, cohort?.primary_trainer_admin_id)}`,
      note: `${cohort?.title ?? "Training cohort"}. ${toTitleCase(session.readiness_status.replace(/_/g, " "))}.`,
      status: toTitleCase(session.readiness_status.replace(/_/g, " ")),
      title: session.title,
    };
  });

  const learners = data.memberships.map((membership) => {
    const accountRecord = data.clientAccounts.find((item) => item.id === membership.client_account_id);
    const cohort = data.cohorts.find((item) => item.id === membership.cohort_id);
    const snapshot = data.progressSnapshots.find((item) => item.membership_id === membership.id);
    const overdue = snapshot ? snapshot.overdue_assessments_count + snapshot.overdue_prework_count : 0;
    return {
      id: membership.id,
      meta: `${cohort?.title ?? "Training cohort"} • Attendance ${formatPercent(snapshot?.attendance_percentage ?? 0)}`,
      note:
        overdue > 0
          ? `${overdue} overdue item${overdue === 1 ? "" : "s"} plus ${formatPercent(snapshot?.completion_percentage ?? 0)} completion.`
          : `${formatPercent(snapshot?.average_score ?? 0)} assessment average and ${formatPercent(snapshot?.completion_percentage ?? 0)} pathway completion.`,
      status: snapshot ? toTitleCase(snapshot.readiness_status) : toTitleCase(membership.enrollment_status),
      title: accountRecord?.full_name ?? "Learner",
    };
  });

  const assessments = data.assessments.map((assessment) => {
    const cohort = data.cohorts.find((item) => item.id === assessment.cohort_id);
    const relatedSubmissions = data.submissions.filter((submission) => submission.assessment_id === assessment.id);
    const inQueue = countBy(relatedSubmissions, (submission) => submission.status === "submitted");
    const failed = countBy(relatedSubmissions, (submission) => submission.status === "failed");
    return {
      id: assessment.id,
      meta: `${cohort?.title ?? "Training cohort"} • Due ${formatDateLabel(assessment.due_at)}`,
      note:
        inQueue > 0
          ? `${inQueue} submission${inQueue === 1 ? "" : "s"} waiting to be graded.`
          : failed > 0
            ? `${failed} learner${failed === 1 ? "" : "s"} below threshold and needs support.`
            : "Assessment window is live and aligned to the current module.",
      status: inQueue > 0 ? "Marking queue" : toTitleCase(assessment.status),
      title: assessment.title,
    };
  });

  const resources = data.resources.map((resource) => {
    const module = resource.module_id ? data.modules.find((item) => item.id === resource.module_id) : null;
    const cohort = resource.cohort_id ? data.cohorts.find((item) => item.id === resource.cohort_id) : null;
    return {
      id: resource.id,
      meta: `${module?.title ?? cohort?.title ?? "Programme-wide"} • ${toTitleCase(resource.resource_kind.replace(/_/g, " "))} • ${mapAudienceLabel(resource.audience_role_slug)}`,
      note: resource.summary ?? "Training resource ready for release into the delivery journey.",
      status: toTitleCase(resource.status),
      title: resource.title,
    };
  });

  const overallAttendance =
    data.progressSnapshots.length > 0
      ? data.progressSnapshots.reduce((total, item) => total + item.attendance_percentage, 0) / data.progressSnapshots.length
      : 0;
  const overallCompletion =
    data.progressSnapshots.length > 0
      ? data.progressSnapshots.reduce((total, item) => total + item.completion_percentage, 0) / data.progressSnapshots.length
      : 0;
  const certificationReady = countBy(
    data.memberships,
    (membership) => membership.certification_status === "ready_for_review" || membership.certification_status === "awarded",
  );

  return {
    assessments,
    cohorts,
    intro: {
      description:
        "The admin workspace now runs the actual Lean training operation: programme setup, session delivery, learner readiness, assessment control, resource release, and progress risk.",
      eyebrow: `Training Operations • ${roleSlugs.includes("admin_owner") ? "Admin owner" : "Trainer access"}`,
      title: "Run Lean training as a delivery system with live operational visibility.",
    },
    learners,
    metrics: [
      {
        detail: "Across active client cohorts and sponsor groups.",
        label: "Active cohorts",
        tone: "good",
        value: `${countBy(data.cohorts, (cohort) => ["scheduled", "active"].includes(cohort.status))}`,
      },
      {
        detail: "Workshops, coaching reviews, and live assessment windows in the next two weeks.",
        label: "Sessions in next 14 days",
        tone: "warning",
        value: `${countBy(upcomingSessions, (session) => {
          if (!session.starts_at) {
            return false;
          }

          const timeUntil = new Date(session.starts_at).getTime() - Date.now();
          return timeUntil <= 14 * 24 * 60 * 60 * 1000;
        })}`,
      },
      {
        detail: "Submitted evidence currently waiting for grading or feedback release.",
        label: "Assessments to grade",
        tone: submittedAssessments.length ? "risk" : "good",
        value: `${submittedAssessments.length}`,
      },
      {
        detail: "Learners with red readiness signals from attendance, overdue work, or assessment performance.",
        label: "Learners at risk",
        tone: atRiskSnapshots.length ? "risk" : "good",
        value: `${atRiskSnapshots.length}`,
      },
    ],
    progress: [
      {
        label: "Attendance across live cohorts",
        note: "Average attendance pulled from the current progress snapshots.",
        value: formatPercent(overallAttendance),
      },
      {
        label: "Average pathway completion",
        note: "Combination of live sessions attended and assessment evidence submitted.",
        value: formatPercent(overallCompletion),
      },
      {
        label: "Certification-ready learners",
        note: "Learners ready for review or already awarded.",
        value: `${certificationReady}`,
      },
    ],
    references: {
      clients: data.clients.map((item) => ({ id: item.id, label: item.name })),
      cohorts: data.cohorts.map((item) => ({ id: item.id, label: item.title })),
      managers: clientManagers.map((item) => ({ id: item.id, label: item.full_name })),
      modules: data.modules.map((item) => ({ id: item.id, label: item.title })),
      programmes: data.programmes.map((item) => ({ id: item.id, label: item.title })),
      trainers: trainers.map((item) => ({ id: item.id, label: item.full_name })),
    },
    resources,
    sessions,
    workflowCards: [
      {
        detail: `Admin account in focus: ${account.full_name}. Data is now coming from real cohorts, sessions, assessments, and progress snapshots.`,
        label: "Live training data",
      },
      {
        detail: "Every update to training sessions, learner rosters, assessments, and resources writes back into Supabase and can be subscribed to in realtime.",
        label: "Realtime-ready",
      },
      {
        detail: "Client managers and learners are separated through role assignments, membership scope, and progress snapshots instead of one generic portal role.",
        label: "Role-aware access",
      },
      {
        detail: "The training pages now map to real delivery workflow objects, not generic dashboard cards.",
        label: "Workflow-backed UI",
      },
    ],
  };
}

export async function getAdminCohortWorkspace(): Promise<{
  canManage: boolean;
  cohorts: AdminCohortOperation[];
  references: {
    managers: Array<{ id: string; label: string }>;
    trainers: Array<{ id: string; label: string }>;
  };
}> {
  const { data, roleSlugs } = await getAdminVisibleTrainingData();
  const clientManagers = data.clientAccounts.filter((item) => normalizeClientRole(item) === "client_manager");
  const trainers = data.adminAccounts.filter((item) => item.status === "active");

  return {
    canManage: roleSlugs.includes("admin_owner") || roleSlugs.includes("trainer"),
    cohorts: data.cohorts.map((cohort) => {
      const client = data.clients.find((item) => item.id === cohort.client_id);
      const programme = data.programmes.find((item) => item.id === cohort.programme_id);
      const manager = cohort.primary_client_manager_id
        ? data.clientAccounts.find((item) => item.id === cohort.primary_client_manager_id)
        : null;
      const trainer = cohort.primary_trainer_admin_id
        ? data.adminAccounts.find((item) => item.id === cohort.primary_trainer_admin_id)
        : null;
      const assignedTrainers = data.cohortTrainers
        .filter((item) => item.cohort_id === cohort.id)
        .sort((left, right) => left.sort_order - right.sort_order)
        .map((item) => {
          const trainerAccount = data.adminAccounts.find((account) => account.id === item.admin_account_id);
          return {
            adminAccountId: item.admin_account_id,
            isPrimary: item.admin_account_id === cohort.primary_trainer_admin_id,
            name: trainerAccount?.full_name ?? "Assigned trainer",
            roleLabel: item.role_label,
          };
        });

      return {
        clientName: client?.name ?? "Client",
        cohortId: cohort.id,
        code: cohort.code,
        deliveryMode: cohort.delivery_mode,
        deliveryModeLabel: toTitleCase(cohort.delivery_mode),
        endsOn: cohort.ends_on,
        endsOnLabel: formatDateLabel(cohort.ends_on),
        learnerCount: countBy(
          data.memberships,
          (membership) => membership.cohort_id === cohort.id && membership.role_slug === "learner",
        ),
        managerAccountId: cohort.primary_client_manager_id,
        managerName: manager?.full_name ?? null,
        notes: cohort.notes,
        programmeTitle: programme?.title ?? "Training programme",
        sponsorEmail: cohort.sponsor_email,
        sponsorName: cohort.sponsor_name,
        startsOn: cohort.starts_on,
        startsOnLabel: formatDateLabel(cohort.starts_on),
        status: cohort.status,
        statusLabel: toTitleCase(cohort.status),
        title: cohort.title,
        trainers: assignedTrainers,
        trainerAdminId: cohort.primary_trainer_admin_id,
        trainerName: trainer?.full_name ?? null,
        upcomingSessionCount: countBy(data.sessions, (session) => {
          if (session.cohort_id !== cohort.id || !session.starts_at || session.status === "cancelled") {
            return false;
          }

          return new Date(session.starts_at).getTime() >= Date.now();
        }),
      };
    }),
    references: {
      managers: clientManagers.map((item) => ({ id: item.id, label: item.full_name })),
      trainers: trainers.map((item) => ({ id: item.id, label: item.full_name })),
    },
  };
}

export async function getAdminSessionWorkspace(): Promise<{
  canManage: boolean;
  sessions: AdminSessionOperation[];
}> {
  const { data, roleSlugs } = await getAdminVisibleTrainingData();
  const sessions = data.sessions
    .sort((left, right) => (left.starts_at ?? "").localeCompare(right.starts_at ?? ""))
    .map((session) => {
      const cohort = data.cohorts.find((item) => item.id === session.cohort_id);
      const module = session.module_id ? data.modules.find((item) => item.id === session.module_id) : null;
      const roster = data.memberships
        .filter((membership) => membership.cohort_id === session.cohort_id)
        .map((membership) => {
          const accountRecord = data.clientAccounts.find((item) => item.id === membership.client_account_id);
          const attendance = data.attendance.find(
            (item) => item.session_id === session.id && item.membership_id === membership.id,
          );
          return {
            attendanceNote: attendance?.notes ?? null,
            attendanceStatus: (attendance?.attendance_status ?? "expected") as AdminSessionOperation["roster"][number]["attendanceStatus"],
            learnerEmail: accountRecord?.email ?? "",
            learnerName: accountRecord?.full_name ?? "Learner",
            membershipId: membership.id,
            roleSlug: membership.role_slug,
          };
        })
        .sort((left, right) => left.learnerName.localeCompare(right.learnerName));

      const attendanceCounts = roster.reduce<AdminSessionOperation["attendanceCounts"]>(
        (totals, item) => {
          totals[item.attendanceStatus] += 1;
          return totals;
        },
        {
          attended: 0,
          excused: 0,
          expected: 0,
          late: 0,
          missed: 0,
        },
      );

      const prework = data.preworkItems
        .filter((item) => item.session_id === session.id)
        .sort((left, right) => left.sort_order - right.sort_order)
        .map((item) => {
          const learnerStates = roster.map((entry) => {
            const state = data.preworkStatus.find(
              (candidate) => candidate.prework_item_id === item.id && candidate.membership_id === entry.membershipId,
            );

            return {
              learnerName: entry.learnerName,
              membershipId: entry.membershipId,
              note: state?.notes ?? null,
              status: (state?.status ?? "todo") as "approved" | "done" | "todo",
            };
          });

          const statusCounts = learnerStates.reduce<Record<"approved" | "done" | "todo", number>>(
            (totals, state) => {
              totals[state.status] += 1;
              return totals;
            },
            { approved: 0, done: 0, todo: 0 },
          );

          return {
            description: item.description,
            itemId: item.id,
            learnerStates,
            requiredCount: countBy(learnerStates, (state) => state.status !== "todo"),
            statusCounts,
            title: item.title,
          };
        });

      return {
        attendanceCounts,
        cohortId: session.cohort_id,
        cohortTitle: cohort?.title ?? "Training cohort",
        deliveryModeLabel: toTitleCase(session.delivery_mode),
        endsAt: session.ends_at,
        endsAtLabel: formatDateTimeLabel(session.ends_at),
        facilitatorNotes: session.facilitator_notes,
        followUpActions: session.follow_up_actions,
        locationLabel: session.location_label,
        moduleTitle: module?.title ?? null,
        prework,
        readinessStatus: session.readiness_status,
        readinessLabel: toTitleCase(session.readiness_status.replace(/_/g, " ")),
        roster,
        sessionId: session.id,
        startsAt: session.starts_at,
        startsAtLabel: formatDateTimeLabel(session.starts_at),
        status: session.status,
        statusLabel: toTitleCase(session.status.replace(/_/g, " ")),
        summary: session.summary,
        title: session.title,
        virtualLink: session.virtual_link,
      };
    });

  return {
    canManage: roleSlugs.includes("admin_owner") || roleSlugs.includes("trainer"),
    sessions,
  };
}

export async function getAdminAssessmentWorkspace(): Promise<{
  assessments: AdminAssessmentOperation[];
  canManage: boolean;
}> {
  const { data, roleSlugs } = await getAdminVisibleTrainingData();
  const supabase = getSupabaseAdminClientOrThrow();
  const assessments = await Promise.all(
    data.assessments
      .filter((assessment) => assessment.status !== "archived")
      .sort((left, right) => (left.due_at ?? "").localeCompare(right.due_at ?? ""))
      .map(async (assessment) => {
      const cohort = data.cohorts.find((item) => item.id === assessment.cohort_id);
      const module = assessment.module_id ? data.modules.find((item) => item.id === assessment.module_id) : null;
      const cohortMemberships = data.memberships.filter((membership) => membership.cohort_id === assessment.cohort_id);
      const learnerMemberships = cohortMemberships.filter((membership) => membership.role_slug === "learner");
      const submissions = data.submissions
        .filter((submission) => submission.assessment_id === assessment.id)
        .map(async (submission) => {
          const membership = cohortMemberships.find((item) => item.id === submission.membership_id);
          const accountRecord = membership
            ? data.clientAccounts.find((item) => item.id === membership.client_account_id)
            : null;
          const attemptsRemaining = Math.max((assessment.max_attempts ?? 1) - submission.attempt_count, 0);
          const evidenceUrl = await createSignedStorageUrl(
            supabase,
            TRAINING_EVIDENCE_BUCKET,
            submission.evidence_file_path,
          );
          return {
            attemptCount: submission.attempt_count,
            attemptsRemaining,
            evidenceFileName: submission.evidence_file_name ?? null,
            evidenceFileSizeBytes: submission.evidence_file_size_bytes ?? null,
            evidenceMimeType: submission.evidence_file_mime_type ?? null,
            evidenceUrl,
            feedback: submission.feedback,
            history: data.submissionEvents
              .filter((event) => event.submission_id === submission.id)
              .map((event) => ({
                createdAtLabel: formatDateTimeLabel(event.created_at),
                eventType: toTitleCase(event.event_type.replace(/_/g, " ")),
                summary: event.summary,
              })),
            learnerEmail: accountRecord?.email ?? "",
            learnerName: accountRecord?.full_name ?? "Learner",
            membershipId: submission.membership_id,
            resultLabel: toTitleCase(submission.status.replace(/_/g, " ")),
            roleSlug: membership?.role_slug ?? "learner",
            score: submission.score,
            scoreLabel: formatAssessmentScore(submission.score, assessment.max_score),
            status: submission.status as AdminAssessmentSubmission["status"],
            submissionId: submission.id,
            submissionText: submission.submission_text,
            submittedAtLabel: formatDateTimeLabel(submission.submitted_at),
          };
        });
      const resolvedSubmissions = (await Promise.all(submissions))
        .sort((left, right) => left.learnerName.localeCompare(right.learnerName));

      const openLearnerCount = countBy(learnerMemberships, (membership) => {
        const submission = data.submissions.find(
          (candidate) => candidate.assessment_id === assessment.id && candidate.membership_id === membership.id,
        );

        if (!submission) {
          return true;
        }

        const attemptsRemaining = Math.max((assessment.max_attempts ?? 1) - submission.attempt_count, 0);
        return !["passed", "submitted"].includes(submission.status) && attemptsRemaining > 0;
      });

      return {
        assessmentId: assessment.id,
        cohortId: assessment.cohort_id,
        cohortTitle: cohort?.title ?? "Training cohort",
        dueAtLabel: formatDateTimeLabel(assessment.due_at),
        maxAttempts: assessment.max_attempts,
        maxScore: assessment.max_score,
        moduleTitle: module?.title ?? null,
        openLearnerCount,
        passScore: assessment.pass_score,
        reminderTargetCount: openLearnerCount,
        status: assessment.status,
        statusLabel: toTitleCase(assessment.status.replace(/_/g, " ")),
        submissions: resolvedSubmissions,
        title: assessment.title,
      };
    }),
  );

  return {
    assessments,
    canManage: roleSlugs.includes("admin_owner") || roleSlugs.includes("trainer"),
  };
}

export async function getAdminRoleWorkspace(): Promise<AdminRoleWorkspace> {
  const { data, roleSlugs } = await getAdminVisibleTrainingData();
  const canManage = roleSlugs.includes("admin_owner");

  return {
    adminAccounts: data.adminAccounts
      .map((account) => ({
        accountId: account.id,
        email: account.email,
        fullName: account.full_name,
        jobTitle: account.job_title,
        roles: getRoleSlugsForAccount({
          accountId: account.id,
          assignments: data.adminRoleAssignments,
          definitions: data.roleDefinitions,
          scope: "admin",
        }),
        status: account.status,
      }))
      .sort((left, right) => left.fullName.localeCompare(right.fullName)),
    canManage,
    clientAccounts: data.clientAccounts
      .map((account) => ({
        accountId: account.id,
        activatedAtLabel: account.activated_at ? formatDateTimeLabel(account.activated_at) : null,
        email: account.email,
        fullName: account.full_name,
        invitedAtLabel: account.invited_at ? formatDateTimeLabel(account.invited_at) : null,
        memberships: data.memberships
          .filter((membership) => membership.client_account_id === account.id)
          .map((membership) => ({
            certificationStatus: membership.certification_status,
            cohortTitle: data.cohorts.find((cohort) => cohort.id === membership.cohort_id)?.title ?? "Training cohort",
            membershipId: membership.id,
            roleSlug: membership.role_slug,
          }))
          .sort((left, right) => left.cohortTitle.localeCompare(right.cohortTitle)),
        onboardingStatus: (
          account.status === "invited"
            ? "invited"
            : account.onboarding_completed_at
              ? "active"
              : "pending"
        ) as "active" | "invited" | "pending",
        roleTitle: account.role_title,
        roles: getRoleSlugsForAccount({
          accountId: account.id,
          assignments: data.clientRoleAssignments,
          definitions: data.roleDefinitions,
          scope: "client",
        }),
        status: account.status,
      }))
      .sort((left, right) => left.fullName.localeCompare(right.fullName)),
    definitions: data.roleDefinitions.map((definition) => ({
      description: definition.description ?? "",
      label: definition.label,
      scope: definition.scope,
      slug: definition.slug,
    })),
  };
}

export async function getAdminCertificationWorkspace(): Promise<AdminCertificationWorkspace> {
  const { data, roleSlugs, supabase } = await getAdminVisibleTrainingData();
  const items = await Promise.all(
    data.memberships.map(async (membership) => {
      const snapshot = data.progressSnapshots.find((item) => item.membership_id === membership.id);
      const accountRecord = data.clientAccounts.find((item) => item.id === membership.client_account_id);
      const cohort = data.cohorts.find((item) => item.id === membership.cohort_id);
      const certificate = data.certificates.find((item) => item.membership_id === membership.id && item.status === "awarded");
      const outstanding = [
        snapshot && snapshot.attendance_percentage < membership.attendance_target
          ? `Attendance below target (${formatPercent(snapshot.attendance_percentage)} / ${formatPercent(membership.attendance_target)})`
          : null,
        snapshot && snapshot.average_score < membership.assessment_target
          ? `Assessment average below target (${formatPercent(snapshot.average_score)} / ${formatPercent(membership.assessment_target)})`
          : null,
        snapshot && snapshot.overdue_assessments_count > 0
          ? `${snapshot.overdue_assessments_count} overdue assessment${snapshot.overdue_assessments_count === 1 ? "" : "s"}`
          : null,
        snapshot && snapshot.overdue_prework_count > 0
          ? `${snapshot.overdue_prework_count} overdue prework item${snapshot.overdue_prework_count === 1 ? "" : "s"}`
          : null,
      ].filter((value): value is string => Boolean(value));
      const certificateUrl = certificate
        ? await createSignedStorageUrl(supabase, TRAINING_CERTIFICATE_BUCKET, certificate.artifact_file_path)
        : null;

      return {
        attendancePercentage: snapshot?.attendance_percentage ?? 0,
        averageScore: snapshot?.average_score ?? 0,
        certificateId: certificate?.id ?? null,
        certificateNumber: certificate?.certificate_number ?? null,
        certificateUrl,
        certificationStatus: membership.certification_status,
        cohortTitle: cohort?.title ?? "Training cohort",
        completionPercentage: snapshot?.completion_percentage ?? 0,
        learnerEmail: accountRecord?.email ?? "",
        learnerName: accountRecord?.full_name ?? "Learner",
        membershipId: membership.id,
        note:
          certificate?.status === "awarded"
            ? `Certificate ${certificate.certificate_number} awarded on ${formatDateLabel(certificate.awarded_at)}.`
            : outstanding.length
              ? outstanding.join(" • ")
              : "Ready for certification review.",
      };
    }),
  );
  const sortedItems = items
    .sort((left, right) => left.learnerName.localeCompare(right.learnerName));

  return {
    canManage: roleSlugs.includes("admin_owner"),
    items: sortedItems,
  };
}

export async function getAdminResourceWorkspace(): Promise<AdminResourceWorkspace> {
  const { data, roleSlugs } = await getAdminVisibleTrainingData();

  return {
    canManage: roleSlugs.includes("admin_owner") || roleSlugs.includes("trainer"),
    resources: data.resources
      .map((resource) => {
        const cohort = resource.cohort_id ? data.cohorts.find((item) => item.id === resource.cohort_id) : null;
        const module = resource.module_id ? data.modules.find((item) => item.id === resource.module_id) : null;
        const programme = resource.programme_id ? data.programmes.find((item) => item.id === resource.programme_id) : null;

        return {
          audienceLabel: mapAudienceLabel(resource.audience_role_slug),
          cohortTitle: cohort?.title ?? null,
          href: resource.href,
          moduleTitle: module?.title ?? null,
          programmeTitle: programme?.title ?? null,
          resourceId: resource.id,
          resourceKind: resource.resource_kind,
          resourceKindLabel: toTitleCase(resource.resource_kind.replace(/_/g, " ")),
          status: resource.status,
          statusLabel: toTitleCase(resource.status.replace(/_/g, " ")),
          summary: resource.summary,
          title: resource.title,
          versionLabel: resource.version_label ?? null,
          visibleFrom: resource.visible_from ?? null,
          visibleFromLabel: formatDateTimeLabel(resource.visible_from),
        };
      })
      .sort((left, right) => left.title.localeCompare(right.title)),
  };
}

export async function getClientTrainingWorkspace(): Promise<ClientTrainingWorkspace> {
  const { account, client, primaryRole, roleSlugs, supabase, user } = await ensureClientTrainingContext();
  const data = await loadTrainingTables(supabase);

  const accessibleMemberships = primaryRole === "client_manager"
    ? data.memberships.filter((membership) => {
        const cohort = data.cohorts.find((item) => item.id === membership.cohort_id);
        return cohort?.client_id === client.id;
      })
    : data.memberships.filter((membership) => membership.client_account_id === account.id);
  const accessibleMembershipIds = new Set(accessibleMemberships.map((membership) => membership.id));
  const accessibleCohortIds = new Set(accessibleMemberships.map((membership) => membership.cohort_id));
  const accessibleCohorts = data.cohorts.filter((cohort) => accessibleCohortIds.has(cohort.id));
  const primaryCohort = accessibleCohorts[0] ?? null;
  const primaryProgramme = primaryCohort
    ? data.programmes.find((programme) => programme.id === primaryCohort.programme_id) ?? null
    : null;
  const visibleSessions = data.sessions.filter((session) => accessibleCohortIds.has(session.cohort_id));
  const visibleAssessments = data.assessments.filter(
    (assessment) => accessibleCohortIds.has(assessment.cohort_id) && assessment.status !== "archived",
  );
  const visibleResources = data.resources.filter((resource) => {
    const roleAllowed =
      resource.audience_role_slug === "all" ||
      roleSlugs.includes(resource.audience_role_slug as TrainingRoleSlug) ||
      (resource.audience_role_slug === "learner" && primaryRole === "learner") ||
      (resource.audience_role_slug === "client_manager" && primaryRole === "client_manager");
    const cohortAllowed = resource.cohort_id ? accessibleCohortIds.has(resource.cohort_id) : true;
    const programmeAllowed = resource.programme_id ? resource.programme_id === primaryProgramme?.id : true;
    return roleAllowed && cohortAllowed && programmeAllowed && resource.status !== "retired";
  });
  const visibleSnapshots = data.progressSnapshots.filter((snapshot) => accessibleMembershipIds.has(snapshot.membership_id));
  const visibleSubmissions = data.submissions.filter((submission) => accessibleMembershipIds.has(submission.membership_id));
  const visibleCertificates = data.certificates.filter((certificate) => accessibleMembershipIds.has(certificate.membership_id));
  const upcomingSession = visibleSessions
    .filter((session) => session.starts_at && new Date(session.starts_at).getTime() >= Date.now() && session.status !== "cancelled")
    .sort((left, right) => (left.starts_at ?? "").localeCompare(right.starts_at ?? ""))[0] ?? null;

  const nextSessionChecklist = upcomingSession
    ? data.preworkItems
        .filter((item) => item.session_id === upcomingSession.id)
        .sort((left, right) => left.sort_order - right.sort_order)
        .map((item) => item.title)
    : [];

  const modules = primaryProgramme
    ? data.modules.filter((module) => module.programme_id === primaryProgramme.id)
    : [];

  const moduleItems = modules.map((module) => ({
    id: module.id,
    meta: `${module.phase} • ${module.duration_label}`,
    note: data.outcomes
      .filter((outcome) => outcome.module_id === module.id)
      .map((outcome) => outcome.outcome_text)
      .join(" • "),
    status: primaryCohort
      ? buildModuleStatus({
          assessments: visibleAssessments,
          cohortId: primaryCohort.id,
          memberships: accessibleMemberships,
          module,
          progressSnapshots: visibleSnapshots,
          sessions: visibleSessions,
          submissions: visibleSubmissions,
        })
      : "Draft",
    title: module.title,
  }));

  const moduleDetails = modules.map((module) => {
    const moduleSessions = visibleSessions
      .filter((session) => session.module_id === module.id)
      .sort((left, right) => (left.starts_at ?? "").localeCompare(right.starts_at ?? ""));
    const moduleAssessments = visibleAssessments
      .filter((assessment) => assessment.module_id === module.id)
      .sort((left, right) => (left.due_at ?? "").localeCompare(right.due_at ?? ""));
    const moduleResources = visibleResources
      .filter((resource) => resource.module_id === module.id)
      .sort((left, right) => left.title.localeCompare(right.title));

    return {
      assessments: moduleAssessments.map((assessment) => ({
        dueAtLabel: formatDateTimeLabel(assessment.due_at),
        statusLabel: toTitleCase(assessment.status.replace(/_/g, " ")),
        title: assessment.title,
      })),
      deliveryTypeLabel: toTitleCase(module.delivery_type.replace(/_/g, " ")),
      durationLabel: module.duration_label,
      moduleId: module.id,
      outcomes: data.outcomes
        .filter((outcome) => outcome.module_id === module.id)
        .sort((left, right) => left.sort_order - right.sort_order)
        .map((outcome) => outcome.outcome_text),
      phaseLabel: module.phase,
      resources: moduleResources.map((resource) => ({
        statusLabel: toTitleCase(resource.status.replace(/_/g, " ")),
        title: resource.title,
        versionLabel: resource.version_label ?? null,
      })),
      sessions: moduleSessions.map((session) => ({
        startsAtLabel: formatDateTimeLabel(session.starts_at),
        statusLabel: toTitleCase(session.status.replace(/_/g, " ")),
        title: session.title,
      })),
      statusLabel: moduleItems.find((item) => item.id === module.id)?.status ?? "Draft",
      summary: module.summary,
      title: module.title,
    };
  });

  const assessmentItems = await Promise.all(visibleAssessments.map(async (assessment) => {
    const submission =
      primaryRole === "client_manager"
        ? visibleSubmissions.find((item) => item.assessment_id === assessment.id)
        : visibleSubmissions.find(
            (item) =>
              item.assessment_id === assessment.id &&
              accessibleMemberships.some((membership) => membership.id === item.membership_id && membership.client_account_id === account.id),
          );
    const openCount = countBy(
      accessibleMemberships,
      (membership) => {
        const candidate = visibleSubmissions.find(
          (submission) => submission.assessment_id === assessment.id && submission.membership_id === membership.id,
        );

        if (!candidate) {
          return true;
        }

        const candidateAttemptsRemaining = Math.max(assessment.max_attempts - candidate.attempt_count, 0);
        return (
          ["not_started", "in_progress", "returned"].includes(candidate.status) ||
          (candidate.status === "failed" && candidateAttemptsRemaining > 0)
        );
      },
    );
    const attemptsRemaining = submission ? Math.max(assessment.max_attempts - submission.attempt_count, 0) : assessment.max_attempts;
    const retakeAvailable = Boolean(submission && ["returned", "failed"].includes(submission.status) && attemptsRemaining > 0);
    const evidenceUrl = await createSignedStorageUrl(supabase, TRAINING_EVIDENCE_BUCKET, submission?.evidence_file_path);
    const canSubmit = primaryRole === "learner"
      && assessment.status === "open"
      && (
        !submission ||
        submission.status === "returned" ||
        (submission.status === "failed" && attemptsRemaining > 0) ||
        submission.status === "in_progress"
      );

    return {
      assessmentId: assessment.id,
      attemptCount: submission?.attempt_count ?? 0,
      attemptsRemaining,
      canSubmit,
      certificateImpact:
        typeof assessment.pass_score === "number"
          ? `Pass mark ${assessment.pass_score}${assessment.max_score ? ` / ${assessment.max_score}` : ""}.`
          : "Successful completion keeps certification progress moving.",
      dueAtLabel: formatDateTimeLabel(assessment.due_at),
      evidenceFileName: submission?.evidence_file_name ?? null,
      evidenceFileSizeBytes: submission?.evidence_file_size_bytes ?? null,
      evidenceMimeType: submission?.evidence_file_mime_type ?? null,
      evidenceUrl,
      feedback: submission?.feedback ?? null,
      history: data.submissionEvents
        .filter((event) => submission && event.submission_id === submission.id)
        .map((event) => ({
          createdAtLabel: formatDateTimeLabel(event.created_at),
          eventType: toTitleCase(event.event_type.replace(/_/g, " ")),
          summary: event.summary,
        })),
      id: assessment.id,
      instructions: assessment.instructions,
      meta:
        primaryRole === "client_manager"
          ? `${primaryCohort?.title ?? "Training cohort"} • ${openCount} outstanding submission${openCount === 1 ? "" : "s"}`
          : `${primaryCohort?.title ?? "Training cohort"} • Due ${formatDateLabel(assessment.due_at)}`,
      note:
        submission?.status === "failed"
          ? "Below threshold. Review feedback and resubmit with stronger evidence if a retake is still available."
          : assessment.summary ?? "Assessment linked to the live module.",
      nextAction:
        submission?.status === "passed"
          ? "Completed"
          : retakeAvailable
            ? `Retake available. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} remaining.`
            : canSubmit
              ? "Submission ready"
              : submission?.status === "submitted"
                ? "Waiting for grading"
                : "Monitor due date",
      passScore: assessment.pass_score,
      retakeAvailable,
      scoreLabel: formatAssessmentScore(submission?.score, assessment.max_score),
      statusDetail:
        submission?.status === "passed"
          ? "Passed and counted toward certification."
          : submission?.status === "returned"
            ? `Returned for rework. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} remaining.`
            : submission?.status === "failed"
              ? attemptsRemaining > 0
                ? `Below threshold. ${attemptsRemaining} retake attempt${attemptsRemaining === 1 ? "" : "s"} remaining.`
                : "Final attempt used. Await trainer support or admin intervention."
              : submission?.status === "submitted"
                ? "Submitted and waiting for trainer grading."
                : `Assessment is ${assessment.status}.`,
      status: submission
        ? toTitleCase(submission.status.replace(/_/g, " "))
        : primaryRole === "client_manager"
          ? openCount > 0
            ? "Action required"
            : toTitleCase(assessment.status)
          : toTitleCase(assessment.status),
      submissionText: submission?.submission_text ?? null,
      title: assessment.title,
    };
  }));

  const sessionCalendar = visibleSessions.map((session) => {
    const membership =
      primaryRole === "learner"
        ? accessibleMemberships.find((item) => item.client_account_id === account.id && item.cohort_id === session.cohort_id)
        : null;
    const attendance = membership
      ? data.attendance.find((item) => item.session_id === session.id && item.membership_id === membership.id)
      : null;
    const cohort = data.cohorts.find((item) => item.id === session.cohort_id);
    const prework = membership
      ? data.preworkItems
          .filter((item) => item.session_id === session.id)
          .sort((left, right) => left.sort_order - right.sort_order)
          .map((item) => {
            const state = data.preworkStatus.find(
              (candidate) => candidate.prework_item_id === item.id && candidate.membership_id === membership.id,
            );

            return {
              itemId: item.id,
              note: state?.notes ?? null,
              status: (state?.status ?? "todo") as "approved" | "done" | "todo",
              title: item.title,
            };
          })
      : [];

    return {
      attendanceLabel:
        primaryRole === "learner" && attendance
          ? `Attendance marked as ${toTitleCase(attendance.attendance_status)}${attendance.notes ? `. ${attendance.notes}` : ""}`
          : null,
      cohortTitle: cohort?.title ?? "Training cohort",
      deliveryModeLabel: toTitleCase(session.delivery_mode),
      endsAtLabel: formatDateTimeLabel(session.ends_at),
      facilitatorNotes: session.facilitator_notes,
      followUpActions: session.follow_up_actions,
      locationLabel: session.location_label,
      moduleTitle: session.module_id ? data.modules.find((item) => item.id === session.module_id)?.title ?? null : null,
      prework,
      readinessLabel: toTitleCase(session.readiness_status.replace(/_/g, " ")),
      sessionId: session.id,
      startsAtLabel: formatDateTimeLabel(session.starts_at),
      statusLabel: toTitleCase(session.status.replace(/_/g, " ")),
      summary: session.summary,
      title: session.title,
      virtualLink: session.virtual_link,
    };
  });

  const sessionItems = sessionCalendar.map((session) => ({
    id: session.sessionId,
    meta: `${session.startsAtLabel} • ${session.deliveryModeLabel} • ${buildTrainerLabelForCohort(
      visibleSessions.find((item) => item.id === session.sessionId)?.cohort_id ?? primaryCohort?.id ?? "",
      data.cohortTrainers,
      data.adminAccounts,
      primaryCohort?.primary_trainer_admin_id,
    )}`,
    note: session.attendanceLabel ?? session.summary ?? "Session delivery record inside the active training journey.",
    status: primaryRole === "learner" && session.attendanceLabel ? "Attendance updated" : session.readinessLabel,
    title: session.title,
  }));

  const resourceItems = visibleResources.map((resource) => {
    const module = resource.module_id ? data.modules.find((item) => item.id === resource.module_id) : null;
    return {
      id: resource.id,
      meta: `${module?.title ?? "Programme-wide"} • ${toTitleCase(resource.resource_kind.replace(/_/g, " "))} • ${mapAudienceLabel(resource.audience_role_slug)}${resource.version_label ? ` • ${resource.version_label}` : ""}`,
      note: resource.summary ?? "Training resource ready to support the next learning step.",
      status: toTitleCase(resource.status),
      title: resource.title,
    };
  });

  const resourceDetails = visibleResources.map((resource) => {
    const module = resource.module_id ? data.modules.find((item) => item.id === resource.module_id) : null;
    return {
      href: resource.href,
      id: resource.id,
      meta: `${module?.title ?? "Programme-wide"} • ${toTitleCase(resource.resource_kind.replace(/_/g, " "))} • ${mapAudienceLabel(resource.audience_role_slug)}`,
      status: toTitleCase(resource.status.replace(/_/g, " ")),
      summary: resource.summary,
      title: resource.title,
      versionLabel: resource.version_label ?? null,
    };
  });

  const averageSnapshotCompletion =
    visibleSnapshots.length > 0
      ? visibleSnapshots.reduce((total, snapshot) => total + snapshot.completion_percentage, 0) / visibleSnapshots.length
      : 0;
  const averageSnapshotAttendance =
    visibleSnapshots.length > 0
      ? visibleSnapshots.reduce((total, snapshot) => total + snapshot.attendance_percentage, 0) / visibleSnapshots.length
      : 0;
  const averageScore =
    visibleSnapshots.length > 0
      ? visibleSnapshots.reduce((total, snapshot) => total + snapshot.average_score, 0) / visibleSnapshots.length
      : 0;
  const modulesCompleted = countBy(moduleItems, (module) => module.status === "Completed");
  const awardedCertificate = visibleCertificates.find((certificate) => certificate.status === "awarded") ?? null;
  const primaryCertificationStatus = accessibleMemberships[0]?.certification_status ?? "not_started";
  const certificateUrl = await createSignedStorageUrl(supabase, TRAINING_CERTIFICATE_BUCKET, awardedCertificate?.artifact_file_path);
  const progressTimeline = [
    {
      id: "onboarding",
      meta: account.onboarding_completed_at
        ? `Completed ${formatDateTimeLabel(account.onboarding_completed_at)}`
        : account.activated_at
          ? `Activated ${formatDateTimeLabel(account.activated_at)}`
          : "Awaiting activation",
      note: account.onboarding_completed_at
        ? "Your training workspace has been activated and onboarding is complete."
        : "Complete onboarding so the full learning journey is unlocked.",
      status: account.onboarding_completed_at ? "Completed" : "Pending",
      title: "Portal onboarding",
    },
    ...sessionCalendar.map((session) => ({
      id: `session-${session.sessionId}`,
      meta: session.startsAtLabel,
      note: session.attendanceLabel ?? session.summary ?? "Session milestone in the training plan.",
      status: session.statusLabel,
      title: session.title,
    })),
    ...assessmentItems.map((assessment) => ({
      id: `assessment-${assessment.assessmentId}`,
      meta: assessment.dueAtLabel,
      note: assessment.statusDetail,
      status: assessment.status,
      title: assessment.title,
    })),
    {
      id: "certificate",
      meta: awardedCertificate
        ? `Awarded ${formatDateLabel(awardedCertificate.awarded_at)}`
        : primaryCertificationStatus === "ready_for_review"
          ? "Ready for review"
          : "In progress",
      note:
        awardedCertificate
          ? `Certificate ${awardedCertificate.certificate_number} is ready to download.`
          : "Certification updates automatically from attendance, assessment, and completion signals.",
      status: toTitleCase(primaryCertificationStatus.replace(/_/g, " ")),
      title: "Certification",
    },
  ];

  return {
    assessments: assessmentItems,
    certification: {
      certificateUrl,
      certificateNumber: awardedCertificate?.certificate_number ?? null,
      note:
        awardedCertificate
          ? `Certificate ${awardedCertificate.certificate_number} was awarded on ${formatDateLabel(awardedCertificate.awarded_at)}.`
          : primaryCertificationStatus === "ready_for_review"
            ? "Your attendance and assessment results are now ready for final certificate review."
            : primaryCertificationStatus === "not_awarded"
              ? "Certification is currently blocked. Review assessment feedback and contact the training team."
              : "Certification will update automatically as attendance and assessments are completed.",
      statusLabel: toTitleCase(primaryCertificationStatus.replace(/_/g, " ")),
    },
    intro: {
      description:
        primaryRole === "client_manager"
          ? "This workspace now follows the team training journey end to end: sessions, learner readiness, syllabus progression, submissions, and progress signals you can actually act on."
          : "This workspace now follows your real Lean learning journey: upcoming sessions, prework, syllabus progression, assessments, resources, and progress that stays visible.",
      eyebrow: primaryRole === "client_manager" ? "Client Manager View" : "Learner View",
      title:
        primaryRole === "client_manager"
          ? "See the training programme the way a sponsor and delivery manager actually need to."
          : "Everything you need to prepare, learn, apply, and progress.",
    },
    metrics: [
      {
        detail: "Live workshops, coaching, and review sessions ahead in the training calendar.",
        label: "Upcoming sessions",
        tone: upcomingSession ? "good" : "warning",
        value: `${countBy(
          visibleSessions,
          (session) => Boolean(session.starts_at) && new Date(session.starts_at as string).getTime() >= Date.now(),
        )}`,
      },
      {
        detail: "Module completion across the visible pathway.",
        label: "Modules completed",
        tone: averageSnapshotCompletion >= 70 ? "good" : "warning",
        value: formatPercent(modules.length ? (modulesCompleted / modules.length) * 100 : averageSnapshotCompletion),
      },
      {
        detail: primaryRole === "client_manager" ? "Average across visible learner assessment snapshots." : "Average across your assessment snapshots.",
        label: "Assessment average",
        tone: averageScore >= 80 ? "good" : averageScore >= 65 ? "warning" : "risk",
        value: formatPercent(averageScore),
      },
      {
        detail: "Attendance signal across the memberships visible to this workspace.",
        label: "Attendance",
        tone: averageSnapshotAttendance >= 90 ? "good" : averageSnapshotAttendance >= 75 ? "warning" : "risk",
        value: formatPercent(averageSnapshotAttendance),
      },
    ],
    moduleDetails,
    modules: moduleItems,
    nextSession: upcomingSession
      ? {
          checklist: nextSessionChecklist,
          facilitator: buildTrainerLabelForCohort(upcomingSession.cohort_id, data.cohortTrainers, data.adminAccounts, primaryCohort?.primary_trainer_admin_id),
          format: toTitleCase(upcomingSession.delivery_mode),
          time: formatDateTimeLabel(upcomingSession.starts_at),
          title: upcomingSession.title,
          venue: upcomingSession.location_label || "Venue to be confirmed",
        }
      : null,
    onboarding: {
      activatedAtLabel: account.activated_at ? formatDateTimeLabel(account.activated_at) : null,
      completed: Boolean(account.onboarding_completed_at),
      completedAtLabel: account.onboarding_completed_at ? formatDateTimeLabel(account.onboarding_completed_at) : null,
      invitedAtLabel: account.invited_at ? formatDateTimeLabel(account.invited_at) : null,
      nextStep: account.onboarding_completed_at
        ? "Your account is active and the training dashboard is fully unlocked."
        : "Complete onboarding to confirm your profile, timezone, and learning goals before the next session.",
      statusLabel: account.onboarding_completed_at ? "Onboarding complete" : "Onboarding required",
    },
    progress: [
      {
        label: primaryRole === "client_manager" ? "Team completion" : "Pathway completion",
        note: "Combined view of attended sessions and submitted evidence.",
        value: formatPercent(averageSnapshotCompletion),
      },
      {
        label: primaryRole === "client_manager" ? "Average team attendance" : "Attendance signal",
        note: "Pulled directly from the progress snapshots in Supabase.",
        value: formatPercent(averageSnapshotAttendance),
      },
      {
        label: primaryRole === "client_manager" ? "Team assessment average" : "Assessment performance",
        note: primaryRole === "client_manager" ? "Shows where sponsor intervention may be needed." : "Shows whether the next module is safe to build on.",
        value: formatPercent(averageScore),
      },
    ],
    progressTimeline,
    resources: resourceItems,
    resourceDetails,
    roleLabel: primaryRole === "client_manager" ? "Client Manager" : "Learner",
    sessionCalendar,
    sessions: sessionItems,
    signals: visibleSnapshots.map((snapshot) => {
      const membership = accessibleMemberships.find((item) => item.id === snapshot.membership_id);
      const memberAccount = membership ? data.clientAccounts.find((item) => item.id === membership.client_account_id) : null;
      return {
        id: snapshot.id,
        meta: `${memberAccount?.full_name ?? "Learner"} • Attendance ${formatPercent(snapshot.attendance_percentage)}`,
        note: snapshot.notes ?? "Live progress snapshot from the current training journey.",
        status: toTitleCase(snapshot.readiness_status),
        title:
          primaryRole === "client_manager"
            ? `${memberAccount?.full_name ?? "Learner"} readiness`
            : "Your readiness snapshot",
      };
    }),
    viewerName:
      typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
        ? user.user_metadata.full_name.trim()
        : account.full_name,
  };
}

export async function updateTrainingSession(input: {
  action?: "cancel" | "reschedule" | "save";
  deliveryMode?: string | null;
  endsAt?: string | null;
  facilitatorNotes?: string | null;
  followUpActions?: string | null;
  locationLabel?: string | null;
  moduleId?: string | null;
  preworkItems?: string[];
  readinessStatus?: string | null;
  sessionId: string;
  startsAt?: string | null;
  status?: string | null;
  summary?: string | null;
  title?: string | null;
  virtualLink?: string | null;
}) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const session = ((await selectOrThrow(
    supabase.from("training_sessions").select("*").eq("id", input.sessionId).limit(1).maybeSingle(),
  )) ?? null) as TrainingSessionRow | null;

  if (!session) {
    throw new Error("Training session not found.");
  }

  await getTrainingCohortForAdmin(supabase, account, roleSlugs, session.cohort_id);

  const updates: Record<string, unknown> = {
    updated_by_admin_id: account.id,
  };
  const normalizedTitle = input.title?.trim();
  const normalizedSummary = input.summary?.trim() || null;

  if (normalizedTitle) updates.title = normalizedTitle;
  if (input.summary !== undefined) updates.summary = normalizedSummary;
  if (input.startsAt !== undefined) updates.starts_at = input.startsAt || null;
  if (input.endsAt !== undefined) updates.ends_at = input.endsAt || null;
  if (input.facilitatorNotes !== undefined) updates.facilitator_notes = input.facilitatorNotes?.trim() || null;
  if (input.followUpActions !== undefined) updates.follow_up_actions = input.followUpActions?.trim() || null;
  if (input.locationLabel !== undefined) updates.location_label = input.locationLabel?.trim() || null;
  if (input.moduleId !== undefined) updates.module_id = input.moduleId || null;
  if (input.readinessStatus !== undefined) updates.readiness_status = input.readinessStatus || session.readiness_status;
  if (input.deliveryMode !== undefined) updates.delivery_mode = input.deliveryMode || session.delivery_mode;
  if (input.status !== undefined) updates.status = input.status || session.status;
  if (input.virtualLink !== undefined) updates.virtual_link = input.virtualLink?.trim() || null;

  if (input.action === "cancel") {
    updates.status = "cancelled";
    updates.readiness_status = "at_risk";
  } else if (input.action === "reschedule") {
    updates.status = "scheduled";
  }

  const { data: updatedSession, error } = await supabase
    .from("training_sessions")
    .update(updates)
    .eq("id", session.id)
    .select("*")
    .single();

  if (error || !updatedSession) {
    throw new Error(error?.message ?? "Unable to update the training session.");
  }

  if (Array.isArray(input.preworkItems)) {
    await selectOrThrow(
      supabase.from("training_session_prework_items").delete().eq("session_id", session.id),
    );

    const cleanedItems = input.preworkItems.map((item) => item.trim()).filter(Boolean);
    if (cleanedItems.length) {
      await selectOrThrow(
        supabase.from("training_session_prework_items").insert(
          cleanedItems.map((item, index) => ({
            description: "Updated from the session operations workspace.",
            session_id: session.id,
            sort_order: index,
            title: item,
          })),
        ),
      );
    }
  }

  const memberships = ((await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .select("*")
      .eq("cohort_id", updatedSession.cohort_id)
      .in("enrollment_status", ["active", "invited"]),
  )) ?? []) as TrainingMembershipRow[];

  let notificationTitle = "Training session updated";
  let notificationBody = `${updatedSession.title} has been updated. Review the latest timing, location, and prework details in your schedule.`;
  if (input.action === "cancel") {
    notificationTitle = "Training session cancelled";
    notificationBody = `${updatedSession.title} has been cancelled. A replacement or rescheduled session will be shared in the portal.`;
  } else if (input.action === "reschedule") {
    notificationTitle = "Training session rescheduled";
    notificationBody = `${updatedSession.title} has moved to ${formatDateTimeLabel(updatedSession.starts_at)}. Review the updated schedule and prework details.`;
  }

  await insertClientNotifications(
    supabase,
    memberships.map((membership) => ({
      body: notificationBody,
      clientAccountId: membership.client_account_id,
      linkHref: "/client-hub/schedule",
      priority: input.action === "cancel" ? "high" : "normal",
      title: notificationTitle,
    })),
  );

  await createAdminAuditEntry({
    actionType:
      input.action === "cancel"
        ? "training_session_cancelled"
        : input.action === "reschedule"
          ? "training_session_rescheduled"
          : "training_session_updated",
    entityId: session.id,
    entityTable: "training_sessions",
    payload: {
      action: input.action ?? "save",
      sessionId: session.id,
      startsAt: updatedSession.starts_at,
      status: updatedSession.status,
      title: updatedSession.title,
    },
    summary: `${notificationTitle}: ${updatedSession.title}.`,
  });

  return updatedSession as TrainingSessionRow;
}

export async function updateTrainingCohort(input: {
  action?: "archive" | "cancel" | "closeout" | "reschedule" | "save";
  cohortId: string;
  deliveryMode?: string | null;
  endsOn?: string | null;
  managerAccountId?: string | null;
  notes?: string | null;
  sponsorEmail?: string | null;
  sponsorName?: string | null;
  startsOn?: string | null;
  status?: string | null;
  title?: string | null;
  trainerAdminId?: string | null;
}) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const cohort = await getTrainingCohortForAdmin(supabase, account, roleSlugs, input.cohortId);

  const updates: Record<string, unknown> = {
    updated_by_admin_id: account.id,
  };

  if (input.title?.trim()) {
    updates.title = input.title.trim();
  }
  if (input.notes !== undefined) {
    updates.notes = input.notes?.trim() || null;
  }
  if (input.sponsorName !== undefined) {
    updates.sponsor_name = input.sponsorName?.trim() || null;
  }
  if (input.sponsorEmail !== undefined) {
    updates.sponsor_email = input.sponsorEmail?.trim() || null;
  }
  if (input.startsOn !== undefined) {
    updates.starts_on = input.startsOn || null;
  }
  if (input.endsOn !== undefined) {
    updates.ends_on = input.endsOn || null;
  }
  if (input.managerAccountId !== undefined) {
    updates.primary_client_manager_id = input.managerAccountId || null;
  }
  if (input.trainerAdminId !== undefined) {
    updates.primary_trainer_admin_id = input.trainerAdminId || null;
  }
  if (input.deliveryMode !== undefined) {
    updates.delivery_mode = input.deliveryMode || cohort.delivery_mode;
  }
  if (input.status !== undefined) {
    updates.status = input.status || cohort.status;
  }

  if (input.action === "cancel") {
    updates.status = "cancelled";
  } else if (input.action === "reschedule") {
    updates.status = "scheduled";
  } else if (input.action === "closeout") {
    updates.ends_on = input.endsOn || cohort.ends_on || new Date().toISOString().slice(0, 10);
    updates.status = "completed";
  } else if (input.action === "archive") {
    updates.status = "archived";
  }

  const { data: updatedCohort, error } = await supabase
    .from("training_cohorts")
    .update(updates)
    .eq("id", cohort.id)
    .select("*")
    .single();

  if (error || !updatedCohort) {
    throw new Error(error?.message ?? "Unable to update the training cohort.");
  }

  if (input.trainerAdminId !== undefined && input.trainerAdminId) {
    await selectOrThrow(
      supabase.from("training_cohort_trainers").upsert(
        [
          {
            admin_account_id: input.trainerAdminId,
            cohort_id: cohort.id,
            role_label: "Lead trainer",
            sort_order: 0,
          },
        ],
        { onConflict: "cohort_id,admin_account_id" },
      ),
    );
  }

  if (input.managerAccountId !== undefined && input.managerAccountId) {
    const existingMembership = ((await selectOrThrow(
      supabase
        .from("training_cohort_memberships")
        .select("*")
        .eq("cohort_id", cohort.id)
        .eq("client_account_id", input.managerAccountId)
        .maybeSingle(),
    )) ?? null) as TrainingMembershipRow | null;

    if (existingMembership) {
      await selectOrThrow(
        supabase
          .from("training_cohort_memberships")
          .update({
            enrollment_status:
              existingMembership.enrollment_status === "invited" ? "invited" : "active",
            role_slug: "client_manager",
          })
          .eq("id", existingMembership.id),
      );
    } else {
      await selectOrThrow(
        supabase.from("training_cohort_memberships").insert([
          {
            client_account_id: input.managerAccountId,
            cohort_id: cohort.id,
            confidence_baseline: 60,
            confidence_current: 60,
            enrollment_status: "active",
            role_slug: "client_manager",
          },
        ]),
      );
    }
  }

  if (input.action === "cancel") {
    await selectOrThrow(
      supabase
        .from("training_sessions")
        .update({
          readiness_status: "at_risk",
          status: "cancelled",
          updated_by_admin_id: account.id,
        })
        .eq("cohort_id", cohort.id)
        .in("status", ["draft", "scheduled"]),
    );
  } else if (input.action === "closeout") {
    await selectOrThrow(
      supabase
        .from("training_sessions")
        .update({
          updated_by_admin_id: account.id,
        })
        .eq("cohort_id", cohort.id)
        .in("status", ["completed", "cancelled", "draft", "scheduled"]),
    );
    await selectOrThrow(
      supabase
        .from("training_assessments")
        .update({
          status: "archived",
          updated_by_admin_id: account.id,
        })
        .eq("cohort_id", cohort.id)
        .neq("status", "archived"),
    );
    await selectOrThrow(
      supabase
        .from("training_cohort_memberships")
        .update({
          completed_at: new Date().toISOString(),
        })
        .eq("cohort_id", cohort.id)
        .is("completed_at", null),
    );
  } else if (input.action === "archive") {
    await selectOrThrow(
      supabase
        .from("training_assessments")
        .update({
          status: "archived",
          updated_by_admin_id: account.id,
        })
        .eq("cohort_id", cohort.id),
    );
    await selectOrThrow(
      supabase
        .from("training_resources")
        .update({
          status: "retired",
          updated_by_admin_id: account.id,
        })
        .eq("cohort_id", cohort.id)
        .neq("status", "retired"),
    );
  }

  const memberships = ((await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .select("*")
      .eq("cohort_id", cohort.id)
      .in("enrollment_status", ["active", "invited"]),
  )) ?? []) as TrainingMembershipRow[];

  let notificationTitle = "Training cohort updated";
  let notificationBody = `${updatedCohort.title} has been updated. Review the cohort window, ownership, and delivery notes in your portal.`;

  if (input.action === "cancel") {
    notificationTitle = "Training cohort cancelled";
    notificationBody = `${updatedCohort.title} has been cancelled. Linked sessions have been closed and the training team will share next steps.`;
  } else if (input.action === "reschedule") {
    notificationTitle = "Training cohort rescheduled";
    notificationBody = `${updatedCohort.title} has been rescheduled. Review the updated cohort dates and upcoming sessions in your portal.`;
  } else if (input.action === "closeout") {
    notificationTitle = "Training cohort closed out";
    notificationBody = `${updatedCohort.title} has been closed out. Assessments are locked and certification status is now finalising in the portal.`;
  } else if (input.action === "archive") {
    notificationTitle = "Training cohort archived";
    notificationBody = `${updatedCohort.title} has been archived. Historical progress remains available, but active delivery items are no longer live.`;
  }

  await insertClientNotifications(
    supabase,
    memberships.map((membership) => ({
      body: notificationBody,
      clientAccountId: membership.client_account_id,
      linkHref: "/client-hub",
      priority: input.action === "cancel" ? "high" : input.action === "archive" ? "low" : "normal",
      title: notificationTitle,
    })),
  );

  await createAdminAuditEntry({
    actionType:
      input.action === "archive"
        ? "training_cohort_archived"
        : input.action === "cancel"
        ? "training_cohort_cancelled"
        : input.action === "closeout"
          ? "training_cohort_closed_out"
        : input.action === "reschedule"
          ? "training_cohort_rescheduled"
          : "training_cohort_updated",
    entityId: cohort.id,
    entityTable: "training_cohorts",
    payload: {
      action: input.action ?? "save",
      cohortId: cohort.id,
      endsOn: updatedCohort.ends_on,
      startsOn: updatedCohort.starts_on,
      status: updatedCohort.status,
      title: updatedCohort.title,
    },
    summary: `${notificationTitle}: ${updatedCohort.title}.`,
  });

  return updatedCohort as TrainingCohortRow;
}

export async function updateTrainingCohortTrainerAssignment(input: {
  action: "add" | "remove";
  cohortId: string;
  roleLabel?: string | null;
  trainerAdminId: string;
}) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const cohort = await getTrainingCohortForAdmin(supabase, account, roleSlugs, input.cohortId);

  if (input.action === "add") {
    await selectOrThrow(
      supabase.from("training_cohort_trainers").upsert(
        [
          {
            admin_account_id: input.trainerAdminId,
            cohort_id: cohort.id,
            role_label: input.roleLabel?.trim() || "Trainer",
            sort_order: 1,
          },
        ],
        { onConflict: "cohort_id,admin_account_id" },
      ),
    );

    if (!cohort.primary_trainer_admin_id) {
      await selectOrThrow(
        supabase
          .from("training_cohorts")
          .update({
            primary_trainer_admin_id: input.trainerAdminId,
            updated_by_admin_id: account.id,
          })
          .eq("id", cohort.id),
      );
    }
  } else {
    await selectOrThrow(
      supabase
        .from("training_cohort_trainers")
        .delete()
        .eq("cohort_id", cohort.id)
        .eq("admin_account_id", input.trainerAdminId),
    );

    if (cohort.primary_trainer_admin_id === input.trainerAdminId) {
      const remaining = ((await selectOrThrow(
        supabase
          .from("training_cohort_trainers")
          .select("*")
          .eq("cohort_id", cohort.id)
          .order("sort_order", { ascending: true })
          .limit(1)
          .maybeSingle(),
      )) ?? null) as TrainingCohortTrainerRow | null;

      await selectOrThrow(
        supabase
          .from("training_cohorts")
          .update({
            primary_trainer_admin_id: remaining?.admin_account_id ?? null,
            updated_by_admin_id: account.id,
          })
          .eq("id", cohort.id),
      );
    }
  }

  await createAdminAuditEntry({
    actionType: input.action === "add" ? "training_cohort_trainer_added" : "training_cohort_trainer_removed",
    entityId: cohort.id,
    entityTable: "training_cohort_trainers",
    payload: {
      action: input.action,
      cohortId: cohort.id,
      trainerAdminId: input.trainerAdminId,
    },
    summary: `${input.action === "add" ? "Added" : "Removed"} trainer assignment for ${cohort.title}.`,
  });

  return { updated: true };
}

export async function updateTrainingPreworkStatus(input: {
  note?: string | null;
  preworkItemId: string;
  status: "approved" | "done" | "todo";
}) {
  const { account, client, primaryRole, supabase } = await ensureClientTrainingContext();
  const preworkItem = ((await selectOrThrow(
    supabase.from("training_session_prework_items").select("*").eq("id", input.preworkItemId).limit(1).maybeSingle(),
  )) ?? null) as TrainingPreworkItemRow | null;

  if (!preworkItem) {
    throw new Error("Prework item not found.");
  }

  const session = ((await selectOrThrow(
    supabase.from("training_sessions").select("*").eq("id", preworkItem.session_id).limit(1).maybeSingle(),
  )) ?? null) as TrainingSessionRow | null;

  if (!session) {
    throw new Error("Training session not found.");
  }

  const membership = ((await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .select("*")
      .eq("cohort_id", session.cohort_id)
      .eq("client_account_id", account.id)
      .limit(1)
      .maybeSingle(),
  )) ?? null) as TrainingMembershipRow | null;

  if (!membership) {
    throw new Error("You are not enrolled in this cohort.");
  }

  if (primaryRole !== "learner" && membership.role_slug !== "learner") {
    throw new Error("Only learners can update prework from this page.");
  }

  const nextStatus = input.status === "approved" ? "done" : input.status;
  const completedAt = nextStatus === "done" ? new Date().toISOString() : null;
  const { data: statusRow, error } = await supabase
    .from("training_session_prework_status")
    .upsert(
      [
        {
          completed_at: completedAt,
          membership_id: membership.id,
          notes: input.note?.trim() || null,
          prework_item_id: preworkItem.id,
          status: nextStatus,
        },
      ],
      { onConflict: "prework_item_id,membership_id" },
    )
    .select("*")
    .single();

  if (error || !statusRow) {
    throw new Error(error?.message ?? "Unable to update the prework item.");
  }

  const managerMemberships = ((await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .select("*")
      .eq("cohort_id", session.cohort_id)
      .eq("role_slug", "client_manager"),
  )) ?? []) as TrainingMembershipRow[];

  await insertClientNotifications(
    supabase,
    managerMemberships.map((managerMembership) => ({
      body: `${account.full_name} marked "${preworkItem.title}" as complete for ${session.title}.`,
      clientAccountId: managerMembership.client_account_id,
      linkHref: "/client-hub/schedule",
      priority: "normal",
      title: "Learner prework updated",
    })),
  );

  await createClientActivityEntry({
    clientAccountId: account.id,
    clientId: client.id,
    description: `Updated prework item ${preworkItem.title} to ${nextStatus}.`,
    entityId: statusRow.id,
    entityTable: "training_session_prework_status",
    eventType: "training_prework_updated",
    title: preworkItem.title,
  });

  await refreshMembershipCertification(supabase, membership.id);

  return statusRow as TrainingPreworkStatusRow;
}

export async function reviewTrainingPreworkStatus(input: {
  membershipId: string;
  note?: string | null;
  preworkItemId: string;
  status: "approved" | "done" | "todo";
}) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const preworkItem = ((await selectOrThrow(
    supabase.from("training_session_prework_items").select("*").eq("id", input.preworkItemId).limit(1).maybeSingle(),
  )) ?? null) as TrainingPreworkItemRow | null;

  if (!preworkItem) {
    throw new Error("Prework item not found.");
  }

  const session = ((await selectOrThrow(
    supabase.from("training_sessions").select("*").eq("id", preworkItem.session_id).limit(1).maybeSingle(),
  )) ?? null) as TrainingSessionRow | null;

  if (!session) {
    throw new Error("Training session not found.");
  }

  await getTrainingCohortForAdmin(supabase, account, roleSlugs, session.cohort_id);

  const { data: statusRow, error } = await supabase
    .from("training_session_prework_status")
    .upsert(
      [
        {
          completed_at: input.status === "todo" ? null : new Date().toISOString(),
          membership_id: input.membershipId,
          notes: input.note?.trim() || null,
          prework_item_id: input.preworkItemId,
          status: input.status,
        },
      ],
      { onConflict: "prework_item_id,membership_id" },
    )
    .select("*")
    .single();

  if (error || !statusRow) {
    throw new Error(error?.message ?? "Unable to review the prework item.");
  }

  const membership = ((await selectOrThrow(
    supabase.from("training_cohort_memberships").select("*").eq("id", input.membershipId).limit(1).maybeSingle(),
  )) ?? null) as TrainingMembershipRow | null;

  if (membership) {
    await insertClientNotifications(supabase, [
      {
        body:
          input.status === "approved"
            ? `"${preworkItem.title}" was approved by the training team.`
            : `"${preworkItem.title}" was updated to ${input.status}. Review the note in your schedule.`,
        clientAccountId: membership.client_account_id,
        linkHref: "/client-hub/schedule",
        priority: "normal",
        title: "Prework status updated",
      },
    ]);
    await refreshMembershipCertification(supabase, membership.id);
  }

  return statusRow as TrainingPreworkStatusRow;
}

export async function completeTrainingOnboarding(input: {
  baseLocation?: string | null;
  defaultView?: string | null;
  learningGoals?: string[];
  timezone?: string | null;
}) {
  const { account, client, preferences, supabase } = await ensureClientPortalContext();
  const learningGoals = (input.learningGoals ?? []).map((item) => item.trim()).filter(Boolean);
  const completedAt = new Date().toISOString();

  const { error: accountError } = await supabase
    .from("client_accounts")
    .update({
      onboarding_completed_at: completedAt,
      status: "active",
    })
    .eq("id", account.id);

  if (accountError) {
    throw new Error(accountError.message);
  }

  const { error: preferenceError } = await supabase
    .from("account_preferences")
    .update({
      preferences: {
        ...preferences.preferences,
        baseLocation: input.baseLocation?.trim() || preferences.preferences.baseLocation,
        defaultView: input.defaultView?.trim() || preferences.preferences.defaultView,
        learningGoals: learningGoals.length ? learningGoals : preferences.preferences.learningGoals,
      },
      timezone: input.timezone?.trim() || preferences.timezone,
    })
    .eq("id", preferences.id);

  if (preferenceError) {
    throw new Error(preferenceError.message);
  }

  await createClientActivityEntry({
    clientAccountId: account.id,
    clientId: client.id,
    description: "Completed learner onboarding.",
    entityId: account.id,
    entityTable: "client_accounts",
    eventType: "training_onboarding_completed",
    title: account.full_name,
  });

  return { completedAt };
}

export async function updateTrainingAttendance(input: {
  markSessionComplete?: boolean;
  records: Array<{
    attendanceStatus: "attended" | "excused" | "expected" | "late" | "missed";
    membershipId: string;
    note?: string | null;
  }>;
  sessionId: string;
}) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const session = ((await selectOrThrow(
    supabase.from("training_sessions").select("*").eq("id", input.sessionId).limit(1).maybeSingle(),
  )) ?? null) as TrainingSessionRow | null;

  if (!session) {
    throw new Error("Training session not found.");
  }

  await getTrainingCohortForAdmin(supabase, account, roleSlugs, session.cohort_id);

  const cohortMemberships = ((await selectOrThrow(
    supabase.from("training_cohort_memberships").select("*").eq("cohort_id", session.cohort_id),
  )) ?? []) as TrainingMembershipRow[];
  const validMembershipIds = new Set(cohortMemberships.map((membership) => membership.id));
  const normalizedRecords = input.records.filter((record) => validMembershipIds.has(record.membershipId));

  if (!normalizedRecords.length) {
    throw new Error("No valid attendance records were provided.");
  }

  await selectOrThrow(
    supabase.from("training_session_attendance").upsert(
      normalizedRecords.map((record) => ({
        attendance_status: record.attendanceStatus,
        membership_id: record.membershipId,
        notes: record.note?.trim() || null,
        session_id: session.id,
      })),
      { onConflict: "session_id,membership_id" },
    ),
  );

  if (input.markSessionComplete) {
    await selectOrThrow(
      supabase
        .from("training_sessions")
        .update({
          readiness_status: "completed",
          status: "completed",
          updated_by_admin_id: account.id,
        })
        .eq("id", session.id),
    );
  }

  const cohortClientAccountIds = cohortMemberships.map((membership) => membership.client_account_id);
  const cohortAccounts = ((await selectOrThrow(
    supabase.from("client_accounts").select("*").in("id", cohortClientAccountIds),
  )) ?? []) as ClientAccountRecord[];
  const attendanceNotifications = normalizedRecords
    .map((record) => {
      const membership = cohortMemberships.find((item) => item.id === record.membershipId);
      const learner = membership
        ? cohortAccounts.find((item) => item.id === membership.client_account_id)
        : null;

      if (!learner || record.attendanceStatus === "expected") {
        return null;
      }

      return {
        body:
          record.attendanceStatus === "missed"
            ? `Attendance for ${session.title} was marked as missed. Please review the follow-up plan with your trainer.`
            : `Attendance for ${session.title} was updated to ${record.attendanceStatus}.`,
        clientAccountId: learner.id,
        linkHref: "/client-hub/schedule",
        priority: record.attendanceStatus === "missed" ? "high" : "normal",
        title: "Session attendance updated",
      } as Parameters<typeof insertClientNotifications>[1][number];
    })
    .filter((item): item is Parameters<typeof insertClientNotifications>[1][number] => Boolean(item));

  await insertClientNotifications(supabase, attendanceNotifications);
  await refreshCohortCertification(supabase, session.cohort_id);

  await createAdminAuditEntry({
    actionType: "training_attendance_captured",
    entityId: session.id,
    entityTable: "training_session_attendance",
    payload: {
      markSessionComplete: Boolean(input.markSessionComplete),
      recordCount: normalizedRecords.length,
      sessionId: session.id,
    },
    summary: `Captured attendance for ${session.title}.`,
  });

  return { updated: normalizedRecords.length };
}

export async function sendTrainingSessionReminder(sessionId: string) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const session = ((await selectOrThrow(
    supabase.from("training_sessions").select("*").eq("id", sessionId).limit(1).maybeSingle(),
  )) ?? null) as TrainingSessionRow | null;

  if (!session) {
    throw new Error("Training session not found.");
  }

  await getTrainingCohortForAdmin(supabase, account, roleSlugs, session.cohort_id);

  const memberships = ((await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .select("*")
      .eq("cohort_id", session.cohort_id)
      .in("enrollment_status", ["active", "invited"]),
  )) ?? []) as TrainingMembershipRow[];

  await insertClientNotifications(
    supabase,
    memberships.map((membership) => ({
      body: `${session.title} is scheduled for ${formatDateTimeLabel(session.starts_at)}. Review the preparation checklist and arrive ready to apply the method.`,
      clientAccountId: membership.client_account_id,
      linkHref: "/client-hub/schedule",
      priority: "normal",
      title: "Upcoming Lean training session",
    })),
  );

  await createAdminAuditEntry({
    actionType: "training_session_reminder_sent",
    entityId: session.id,
    entityTable: "training_sessions",
    payload: { membershipCount: memberships.length, sessionId: session.id },
    summary: `Sent session reminders for ${session.title}.`,
  });

  return { reminded: memberships.length };
}

export async function gradeTrainingAssessmentSubmission(input: {
  decision?: "auto" | "returned";
  feedback?: string | null;
  overrideStatus?: "failed" | "passed" | null;
  reopen?: boolean;
  score?: number | null;
  submissionId: string;
}) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const submission = ((await selectOrThrow(
    supabase.from("training_assessment_submissions").select("*").eq("id", input.submissionId).limit(1).maybeSingle(),
  )) ?? null) as TrainingSubmissionRow | null;

  if (!submission) {
    throw new Error("Assessment submission not found.");
  }

  const assessment = ((await selectOrThrow(
    supabase.from("training_assessments").select("*").eq("id", submission.assessment_id).limit(1).maybeSingle(),
  )) ?? null) as TrainingAssessmentRow | null;

  if (!assessment) {
    throw new Error("The assessment tied to this submission no longer exists.");
  }

  await getTrainingCohortForAdmin(supabase, account, roleSlugs, assessment.cohort_id);

  const membership = ((await selectOrThrow(
    supabase.from("training_cohort_memberships").select("*").eq("id", submission.membership_id).limit(1).maybeSingle(),
  )) ?? null) as TrainingMembershipRow | null;
  const learner = membership
    ? (((await selectOrThrow(
      supabase.from("client_accounts").select("*").eq("id", membership.client_account_id).limit(1).maybeSingle(),
    )) ?? null) as ClientAccountRecord | null)
    : null;

  if (!membership || !learner) {
    throw new Error("The learner for this submission could not be found.");
  }

  if (typeof input.score === "number" && typeof assessment.max_score === "number" && input.score > assessment.max_score) {
    throw new Error(`Score must be ${assessment.max_score} or below.`);
  }

  const attemptsRemaining = Math.max(assessment.max_attempts - submission.attempt_count, 0);
  let nextStatus: TrainingSubmissionRow["status"] = submission.status;
  let eventType: Parameters<typeof recordTrainingSubmissionEvent>[1]["eventType"] = "returned";
  let summary = "";
  const nextAttemptCount = input.reopen && attemptsRemaining <= 0
    ? Math.max(assessment.max_attempts - 1, 0)
    : submission.attempt_count;

  if (input.reopen) {
    nextStatus = "returned";
    eventType = "assessment_reopened";
    summary = `${assessment.title} was reopened for another learner attempt.`;
  } else if (input.overrideStatus) {
    nextStatus = input.overrideStatus;
    eventType = input.overrideStatus === "passed" ? "override_passed" : "override_failed";
    summary = `${assessment.title} was overridden to ${input.overrideStatus}.`;
  } else if (input.decision === "returned") {
    if (attemptsRemaining <= 0) {
      throw new Error("No retake attempts remain for this submission.");
    }
    nextStatus = "returned";
    eventType = "returned";
    summary = `${assessment.title} was returned for another attempt.`;
  } else if (typeof input.score === "number" && typeof assessment.pass_score === "number" && input.score >= assessment.pass_score) {
    nextStatus = "passed";
    eventType = "graded_passed";
    summary = `${assessment.title} was graded as passed.`;
  } else {
    nextStatus = attemptsRemaining > 0 ? "returned" : "failed";
    eventType = nextStatus === "failed" ? "graded_failed" : "returned";
    summary =
      nextStatus === "failed"
        ? `${assessment.title} was graded below threshold with no retake remaining.`
        : `${assessment.title} was reviewed and returned for rework.`;
  }

  const { data: updatedSubmission, error } = await supabase
    .from("training_assessment_submissions")
    .update({
      attempt_count: nextAttemptCount,
      feedback: input.feedback?.trim() || null,
      graded_at: new Date().toISOString(),
      graded_by_admin_id: account.id,
      score: typeof input.score === "number" ? input.score : submission.score,
      status: nextStatus,
    })
    .eq("id", submission.id)
    .select("*")
    .single();

  if (error || !updatedSubmission) {
    throw new Error(error?.message ?? "Unable to grade the assessment submission.");
  }

  await selectOrThrow(
    supabase
      .from("training_assessments")
      .update({
        status: "graded",
        updated_by_admin_id: account.id,
      })
      .eq("id", assessment.id),
  );

  await recordTrainingSubmissionEvent(supabase, {
    actorScope: "admin",
    adminAccountId: account.id,
    assessmentId: assessment.id,
    clientAccountId: learner.id,
    eventType,
    membershipId: membership.id,
    payload: {
      feedback: input.feedback?.trim() || null,
      score: typeof input.score === "number" ? input.score : submission.score,
      status: nextStatus,
    },
    submissionId: submission.id,
    summary,
  });

  await refreshMembershipCertification(supabase, membership.id);

  await insertClientNotifications(supabase, [
    {
      body:
        input.reopen
          ? `${assessment.title} has been reopened for another submission.${input.feedback?.trim() ? ` Feedback: ${input.feedback.trim()}` : ""}`
          :
        nextStatus === "passed"
          ? `${assessment.title} has been graded as passed.${input.feedback?.trim() ? ` Feedback: ${input.feedback.trim()}` : ""}`
          : nextStatus === "returned"
            ? `${assessment.title} was reviewed and returned for another attempt.${input.feedback?.trim() ? ` Feedback: ${input.feedback.trim()}` : ""}`
            : `${assessment.title} was graded below threshold.${input.feedback?.trim() ? ` Feedback: ${input.feedback.trim()}` : ""}`,
      clientAccountId: learner.id,
      linkHref: "/client-hub/assessments",
      priority: nextStatus === "passed" ? "normal" : "high",
      title:
        input.reopen
          ? "Assessment reopened"
          : nextStatus === "passed"
            ? "Assessment passed"
            : nextStatus === "returned"
              ? "Assessment returned"
              : "Assessment failed",
    },
  ]);

  if (nextStatus !== "passed") {
    const managerMemberships = ((await selectOrThrow(
      supabase
        .from("training_cohort_memberships")
        .select("*")
        .eq("cohort_id", assessment.cohort_id)
        .eq("role_slug", "client_manager"),
    )) ?? []) as TrainingMembershipRow[];

    await insertClientNotifications(
      supabase,
      managerMemberships.map((managerMembership) => ({
        body: `${learner.full_name} needs support on ${assessment.title}. Review the feedback and coordinate the next attempt.`,
        clientAccountId: managerMembership.client_account_id,
        linkHref: "/client-hub/assessments",
        priority: "high",
        title: "Learner needs assessment support",
      })),
    );
  }

  await createAdminAuditEntry({
    actionType: "training_assessment_graded",
    entityId: submission.id,
    entityTable: "training_assessment_submissions",
      payload: {
        assessmentId: assessment.id,
        learnerEmail: learner.email,
        overrideStatus: input.overrideStatus ?? null,
        reopened: Boolean(input.reopen),
        score: typeof input.score === "number" ? input.score : submission.score,
        status: nextStatus,
        submissionId: submission.id,
      },
    summary: `${summary} ${learner.full_name}.`,
  });

  return updatedSubmission as TrainingSubmissionRow;
}

export async function sendTrainingAssessmentReminder(assessmentId: string) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const assessment = ((await selectOrThrow(
    supabase.from("training_assessments").select("*").eq("id", assessmentId).limit(1).maybeSingle(),
  )) ?? null) as TrainingAssessmentRow | null;

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  await getTrainingCohortForAdmin(supabase, account, roleSlugs, assessment.cohort_id);

  const memberships = ((await selectOrThrow(
    supabase.from("training_cohort_memberships").select("*").eq("cohort_id", assessment.cohort_id),
  )) ?? []) as TrainingMembershipRow[];
  const submissions = ((await selectOrThrow(
    supabase.from("training_assessment_submissions").select("*").eq("assessment_id", assessment.id),
  )) ?? []) as TrainingSubmissionRow[];

  const reminderTargets = memberships.filter((membership) => {
    if (membership.role_slug !== "learner") {
      return false;
    }

    const submission = submissions.find((item) => item.membership_id === membership.id);

    if (!submission) {
      return true;
    }

    const attemptsRemaining = Math.max(assessment.max_attempts - submission.attempt_count, 0);
    return ["not_started", "in_progress", "returned"].includes(submission.status) || (submission.status === "failed" && attemptsRemaining > 0);
  });

  await insertClientNotifications(
    supabase,
    reminderTargets.map((membership) => ({
      body: `${assessment.title} still needs your evidence.${assessment.due_at ? ` Due ${formatDateTimeLabel(assessment.due_at)}.` : ""}`,
      clientAccountId: membership.client_account_id,
      linkHref: "/client-hub/assessments",
      priority: "high",
      title: "Assessment reminder",
    })),
  );

  await createAdminAuditEntry({
    actionType: "training_assessment_reminder_sent",
    entityId: assessment.id,
    entityTable: "training_assessments",
    payload: { assessmentId: assessment.id, targetCount: reminderTargets.length },
    summary: `Sent assessment reminders for ${assessment.title}.`,
  });

  return { reminded: reminderTargets.length };
}

export async function assignTrainingPortalRole(input: {
  accountId: string;
  roleSlug: TrainingRoleSlug;
  scope: "admin" | "client";
}) {
  const { supabase } = await assertAdminOwner();
  const definition = ((await selectOrThrow(
    supabase
      .from("role_definitions")
      .select("id, slug, scope, label, description")
      .eq("slug", input.roleSlug)
      .eq("scope", input.scope)
      .limit(1)
      .maybeSingle(),
  )) ?? null) as RoleDefinitionRow | null;

  if (!definition) {
    throw new Error("Role definition not found.");
  }

  if (input.scope === "admin") {
    await selectOrThrow(
      supabase.from("admin_account_roles").upsert(
        [
          {
            admin_account_id: input.accountId,
            role_id: definition.id,
          },
        ],
        { onConflict: "admin_account_id,role_id" },
      ),
    );
  } else {
    await selectOrThrow(
      supabase.from("client_account_roles").upsert(
        [
          {
            client_account_id: input.accountId,
            role_id: definition.id,
          },
        ],
        { onConflict: "client_account_id,role_id" },
      ),
    );
  }

  await createAdminAuditEntry({
    actionType: "training_role_assigned",
    entityId: input.accountId,
    entityTable: input.scope === "admin" ? "admin_account_roles" : "client_account_roles",
    payload: { roleSlug: input.roleSlug, scope: input.scope },
    summary: `Assigned ${definition.label} role.`,
  });

  return definition;
}

export async function removeTrainingPortalRole(input: {
  accountId: string;
  roleSlug: TrainingRoleSlug;
  scope: "admin" | "client";
}) {
  const { supabase } = await assertAdminOwner();
  const definition = ((await selectOrThrow(
    supabase
      .from("role_definitions")
      .select("id, slug, scope, label, description")
      .eq("slug", input.roleSlug)
      .eq("scope", input.scope)
      .limit(1)
      .maybeSingle(),
  )) ?? null) as RoleDefinitionRow | null;

  if (!definition) {
    throw new Error("Role definition not found.");
  }

  if (input.scope === "admin") {
    const targetAccount = ((await selectOrThrow(
      supabase.from("admin_accounts").select("*").eq("id", input.accountId).limit(1).maybeSingle(),
    )) ?? null) as AdminAccountRecord | null;

    if (definition.slug === "admin_owner" && targetAccount?.email.toLowerCase() === "hello@tacklersconsulting.com") {
      throw new Error("The primary Tacklers admin owner cannot lose admin-owner access.");
    }

    await selectOrThrow(
      supabase.from("admin_account_roles").delete().eq("admin_account_id", input.accountId).eq("role_id", definition.id),
    );
  } else {
    await selectOrThrow(
      supabase.from("client_account_roles").delete().eq("client_account_id", input.accountId).eq("role_id", definition.id),
    );
  }

  await createAdminAuditEntry({
    actionType: "training_role_removed",
    entityId: input.accountId,
    entityTable: input.scope === "admin" ? "admin_account_roles" : "client_account_roles",
    payload: { roleSlug: input.roleSlug, scope: input.scope },
    summary: `Removed ${definition.label} role.`,
  });

  return { removed: true };
}

export async function updateTrainingMembershipRole(input: {
  membershipId: string;
  roleSlug: "client_manager" | "learner";
}) {
  const { supabase } = await assertAdminOwner();
  const membership = ((await selectOrThrow(
    supabase.from("training_cohort_memberships").select("*").eq("id", input.membershipId).limit(1).maybeSingle(),
  )) ?? null) as TrainingMembershipRow | null;

  if (!membership) {
    throw new Error("Training membership not found.");
  }

  const { data: updatedMembership, error } = await supabase
    .from("training_cohort_memberships")
    .update({
      role_slug: input.roleSlug,
    })
    .eq("id", membership.id)
    .select("*")
    .single();

  if (error || !updatedMembership) {
    throw new Error(error?.message ?? "Unable to update the cohort role.");
  }

  await createAdminAuditEntry({
    actionType: "training_membership_role_updated",
    entityId: membership.id,
    entityTable: "training_cohort_memberships",
    payload: { membershipId: membership.id, roleSlug: input.roleSlug },
    summary: `Updated training membership role to ${input.roleSlug}.`,
  });

  await insertClientNotifications(supabase, [
    {
      body: `Your cohort role was updated to ${input.roleSlug === "client_manager" ? "client manager" : "learner"}.`,
      clientAccountId: membership.client_account_id,
      linkHref: "/client-hub",
      priority: "normal",
      title: "Training role updated",
    },
  ]);

  return updatedMembership as TrainingMembershipRow;
}

export async function awardTrainingCertificate(input: {
  membershipId: string;
  note?: string | null;
}) {
  const { account, supabase } = await assertAdminOwner();
  await refreshMembershipCertification(supabase, input.membershipId);

  const membership = ((await selectOrThrow(
    supabase.from("training_cohort_memberships").select("*").eq("id", input.membershipId).limit(1).maybeSingle(),
  )) ?? null) as TrainingMembershipRow | null;

  if (!membership) {
    throw new Error("Training membership not found.");
  }

  if (!["ready_for_review", "awarded"].includes(membership.certification_status)) {
    throw new Error("This learner is not yet ready for certificate award.");
  }

  const cohort = ((await selectOrThrow(
    supabase.from("training_cohorts").select("*").eq("id", membership.cohort_id).limit(1).maybeSingle(),
  )) ?? null) as TrainingCohortRow | null;
  const learner = ((await selectOrThrow(
    supabase.from("client_accounts").select("*").eq("id", membership.client_account_id).limit(1).maybeSingle(),
  )) ?? null) as ClientAccountRecord | null;

  if (!cohort || !learner) {
    throw new Error("Certification context is incomplete.");
  }

  const programme = ((await selectOrThrow(
    supabase.from("training_programmes").select("*").eq("id", cohort.programme_id).limit(1).maybeSingle(),
  )) ?? null) as TrainingProgrammeRow | null;
  const certificateNumber = buildCertificateNumber(cohort.code, learner.full_name);
  const artifactFileName = `${sanitizeStorageFileName(`${learner.full_name}-${certificateNumber}`)}.html`;
  const artifactPath = `${cohort.code}/${artifactFileName}`;
  const certificateHtml = buildCertificateHtml({
    certificateNumber,
    cohortTitle: cohort.title,
    learnerName: learner.full_name,
    programmeTitle: programme?.certificate_title ?? programme?.title ?? "Lean training programme",
  });

  const { error: uploadError } = await supabase.storage
    .from(TRAINING_CERTIFICATE_BUCKET)
    .upload(artifactPath, Buffer.from(certificateHtml, "utf8"), {
      contentType: "text/html",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: certificate, error } = await supabase
    .from("training_certificates")
    .upsert(
      [
        {
          artifact_file_name: artifactFileName,
          artifact_file_path: artifactPath,
          artifact_mime_type: "text/html",
          awarded_at: new Date().toISOString(),
          awarded_by_admin_id: account.id,
          certificate_number: certificateNumber,
          cohort_id: cohort.id,
          membership_id: membership.id,
          notes: input.note?.trim() || null,
          programme_id: cohort.programme_id,
          revoked_at: null,
          revoked_reason: null,
          status: "awarded",
        },
      ],
      { onConflict: "membership_id" },
    )
    .select("*")
    .single();

  if (error || !certificate) {
    throw new Error(error?.message ?? "Unable to award the certificate.");
  }

  await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .update({
        certification_status: "awarded",
        completed_at: new Date().toISOString(),
      })
      .eq("id", membership.id),
  );

  await insertClientNotifications(supabase, [
    {
      body: `Congratulations. Your Lean training certificate ${certificate.certificate_number} has been awarded.`,
      clientAccountId: learner.id,
      linkHref: "/client-hub/progress",
      priority: "high",
      title: "Certificate awarded",
    },
  ]);

  const managerMemberships = ((await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .select("*")
      .eq("cohort_id", cohort.id)
      .eq("role_slug", "client_manager"),
  )) ?? []) as TrainingMembershipRow[];

  await insertClientNotifications(
    supabase,
    managerMemberships.map((managerMembership) => ({
      body: `${learner.full_name} has been awarded their Lean training certificate.`,
      clientAccountId: managerMembership.client_account_id,
      linkHref: "/client-hub/progress",
      priority: "normal",
      title: "Learner certified",
    })),
  );

  await createAdminAuditEntry({
    actionType: "training_certificate_awarded",
    entityId: certificate.id,
    entityTable: "training_certificates",
    payload: { certificateNumber: certificate.certificate_number, membershipId: membership.id },
    summary: `Awarded certificate ${certificate.certificate_number} to ${learner.full_name}.`,
  });

  const downloadUrl = await createSignedStorageUrl(supabase, TRAINING_CERTIFICATE_BUCKET, artifactPath);
  await sendTrainingCertificateEmail({
    certificateNumber,
    cohortTitle: cohort.title,
    downloadUrl,
    learnerName: learner.full_name,
    recipientEmail: learner.email,
  });

  return certificate as TrainingCertificateRow;
}

export async function revokeTrainingCertificate(input: {
  membershipId: string;
  reason: string;
}) {
  const { supabase } = await assertAdminOwner();
  const membership = ((await selectOrThrow(
    supabase.from("training_cohort_memberships").select("*").eq("id", input.membershipId).limit(1).maybeSingle(),
  )) ?? null) as TrainingMembershipRow | null;
  const certificate = ((await selectOrThrow(
    supabase.from("training_certificates").select("*").eq("membership_id", input.membershipId).limit(1).maybeSingle(),
  )) ?? null) as TrainingCertificateRow | null;

  if (!membership || !certificate) {
    throw new Error("Certificate record not found.");
  }

  const learner = ((await selectOrThrow(
    supabase.from("client_accounts").select("*").eq("id", membership.client_account_id).limit(1).maybeSingle(),
  )) ?? null) as ClientAccountRecord | null;

  await selectOrThrow(
    supabase
      .from("training_certificates")
      .update({
        revoked_at: new Date().toISOString(),
        revoked_reason: input.reason.trim(),
        status: "revoked",
      })
      .eq("id", certificate.id),
  );

  await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .update({
        certification_status: "not_awarded",
      })
      .eq("id", membership.id),
  );

  if (learner) {
    await insertClientNotifications(supabase, [
      {
        body: `Your certificate ${certificate.certificate_number} was revoked. Reason: ${input.reason.trim()}`,
        clientAccountId: learner.id,
        linkHref: "/client-hub/progress",
        priority: "high",
        title: "Certificate revoked",
      },
    ]);
  }

  await createAdminAuditEntry({
    actionType: "training_certificate_revoked",
    entityId: certificate.id,
    entityTable: "training_certificates",
    payload: { membershipId: membership.id, reason: input.reason.trim() },
    summary: `Revoked certificate ${certificate.certificate_number}.`,
  });

  return { revoked: true };
}

export async function runScheduledTrainingReminders() {
  const supabase = getSupabaseAdminClientOrThrow();
  const data = await loadTrainingTables(supabase);
  const now = Date.now();
  const in24Hours = now + 1000 * 60 * 60 * 24;
  const in48Hours = now + 1000 * 60 * 60 * 48;
  const adminRecipients = data.adminAccounts.filter((account) =>
    getRoleSlugsForAccount({
      accountId: account.id,
      assignments: data.adminRoleAssignments,
      definitions: data.roleDefinitions,
      scope: "admin",
    }).some((role) => role === "admin_owner" || role === "trainer"),
  );

  let sessions = 0;
  let assessments = 0;
  let grading = 0;
  let certificatesReady = 0;
  let certificatesAwarded = 0;

  for (const session of data.sessions) {
    const startsAtMs = session.starts_at ? new Date(session.starts_at).getTime() : null;
    if (!startsAtMs || startsAtMs < now || startsAtMs > in24Hours || session.status === "cancelled") {
      continue;
    }

    const memberships = data.memberships.filter((membership) =>
      membership.cohort_id === session.cohort_id && ["active", "invited"].includes(membership.enrollment_status),
    );

    for (const membership of memberships) {
      const created = await recordTrainingReminder(supabase, {
        recipientAccountId: membership.client_account_id,
        recipientScope: "client",
        reminderKind: "session_upcoming",
        targetEntityId: session.id,
        targetEntityType: "training_sessions",
        windowKey: new Date(startsAtMs).toISOString().slice(0, 13),
      });

      if (!created) {
        continue;
      }

      sessions += 1;
      await insertClientNotifications(supabase, [
        {
          body: `${session.title} is coming up within the next 24 hours. Review your prework and arrive ready to apply the method.`,
          clientAccountId: membership.client_account_id,
          linkHref: "/client-hub/schedule",
          priority: "high",
          title: "Upcoming session reminder",
        },
      ]);
    }
  }

  for (const assessment of data.assessments) {
    const dueAtMs = assessment.due_at ? new Date(assessment.due_at).getTime() : null;
    if (!dueAtMs || dueAtMs < now || dueAtMs > in48Hours || assessment.status === "archived") {
      continue;
    }

    const cohortMemberships = data.memberships.filter((membership) => membership.cohort_id === assessment.cohort_id && membership.role_slug === "learner");
    for (const membership of cohortMemberships) {
      const submission = data.submissions.find(
        (candidate) => candidate.assessment_id === assessment.id && candidate.membership_id === membership.id,
      );
      const attemptsRemaining = Math.max(assessment.max_attempts - (submission?.attempt_count ?? 0), 0);
      const needsReminder =
        !submission ||
        ["not_started", "in_progress", "returned"].includes(submission.status) ||
        (submission.status === "failed" && attemptsRemaining > 0);

      if (!needsReminder) {
        continue;
      }

      const created = await recordTrainingReminder(supabase, {
        recipientAccountId: membership.client_account_id,
        recipientScope: "client",
        reminderKind: "assessment_due",
        targetEntityId: assessment.id,
        targetEntityType: "training_assessments",
        windowKey: new Date(dueAtMs).toISOString().slice(0, 13),
      });

      if (!created) {
        continue;
      }

      assessments += 1;
      await insertClientNotifications(supabase, [
        {
          body: `${assessment.title} is due soon. Submit your evidence before ${formatDateTimeLabel(assessment.due_at)}.`,
          clientAccountId: membership.client_account_id,
          linkHref: "/client-hub/assessments",
          priority: "high",
          title: "Assessment due reminder",
        },
      ]);
    }
  }

  for (const submission of data.submissions.filter((item) => item.status === "submitted")) {
    const submittedAtMs = submission.submitted_at ? new Date(submission.submitted_at).getTime() : null;
    if (!submittedAtMs || submittedAtMs > now - 1000 * 60 * 30) {
      continue;
    }

    for (const admin of adminRecipients) {
      const created = await recordTrainingReminder(supabase, {
        recipientAccountId: admin.id,
        recipientScope: "admin",
        reminderKind: "grading_queue",
        targetEntityId: submission.id,
        targetEntityType: "training_assessment_submissions",
        windowKey: new Date(submittedAtMs).toISOString().slice(0, 13),
      });

      if (!created) {
        continue;
      }

      grading += 1;
      await insertAdminNotifications(supabase, [
        {
          adminAccountId: admin.id,
          body: "A learner submission is still waiting in the grading queue.",
          linkHref: "/admin/assessments",
          priority: "high",
          title: "Grading queue reminder",
        },
      ]);
    }
  }

  for (const membership of data.memberships.filter((item) => item.certification_status === "ready_for_review")) {
    for (const admin of adminRecipients) {
      const created = await recordTrainingReminder(supabase, {
        recipientAccountId: admin.id,
        recipientScope: "admin",
        reminderKind: "certificate_ready",
        targetEntityId: membership.id,
        targetEntityType: "training_cohort_memberships",
        windowKey: new Date().toISOString().slice(0, 10),
      });

      if (!created) {
        continue;
      }

      certificatesReady += 1;
      await insertAdminNotifications(supabase, [
        {
          adminAccountId: admin.id,
          body: "A learner is ready for certificate review. Check the progress workspace to award or hold the certificate.",
          linkHref: "/admin/progress",
          priority: "normal",
          title: "Certificate review ready",
        },
      ]);
    }
  }

  for (const certificate of data.certificates.filter((item) => item.status === "awarded")) {
    const awardedAtMs = new Date(certificate.awarded_at).getTime();
    if (awardedAtMs < now - 1000 * 60 * 60 * 24) {
      continue;
    }

    const membership = data.memberships.find((item) => item.id === certificate.membership_id);
    if (!membership) {
      continue;
    }

    const created = await recordTrainingReminder(supabase, {
      recipientAccountId: membership.client_account_id,
      recipientScope: "client",
      reminderKind: "certificate_awarded",
      targetEntityId: certificate.id,
      targetEntityType: "training_certificates",
      windowKey: new Date(awardedAtMs).toISOString().slice(0, 10),
    });

    if (!created) {
      continue;
    }

    certificatesAwarded += 1;
    await insertClientNotifications(supabase, [
      {
        body: `Your certificate ${certificate.certificate_number} is ready to review and download from the progress page.`,
        clientAccountId: membership.client_account_id,
        linkHref: "/client-hub/progress",
        priority: "normal",
        title: "Certificate reminder",
      },
    ]);
  }

  return {
    assessments,
    certificatesAwarded,
    certificatesReady,
    grading,
    sessions,
  };
}

export async function createTrainingCohort(input: CreateTrainingCohortInput) {
  const { account, supabase } = await assertAdminOwner();
  const title = input.title.trim();

  if (!title) {
    throw new Error("Cohort title is required.");
  }

  const code = createTrainingCohortCode(title, {
    uniqueSeed: `${input.clientId}-${Date.now()}-${randomUUID()}`,
  });
  const { data: cohort, error } = await supabase
    .from("training_cohorts")
    .insert([
      {
        client_id: input.clientId,
        code,
        created_by_admin_id: account.id,
        delivery_mode: "onsite",
        notes: input.notes?.trim() || null,
        primary_client_manager_id: input.managerAccountId || null,
        primary_trainer_admin_id: input.trainerAdminId || null,
        programme_id: input.programmeId,
        sponsor_email: input.sponsorEmail?.trim() || null,
        sponsor_name: input.sponsorName?.trim() || null,
        starts_on: input.startsOn || null,
        status: "scheduled",
        title,
        updated_by_admin_id: account.id,
      },
    ])
    .select("*")
    .single();

  if (error || !cohort) {
    throw new Error(error?.message ?? "Unable to create the training cohort.");
  }

  if (input.trainerAdminId) {
    await supabase.from("training_cohort_trainers").upsert(
      [
        {
          admin_account_id: input.trainerAdminId,
          cohort_id: cohort.id,
          role_label: "Lead trainer",
        },
      ],
      { onConflict: "cohort_id,admin_account_id" },
    );
  }

  if (input.managerAccountId) {
    const membershipRecord = ((await selectOrThrow(
      supabase
        .from("training_cohort_memberships")
        .select("*")
        .eq("cohort_id", cohort.id)
        .eq("client_account_id", input.managerAccountId)
        .maybeSingle(),
    )) ?? null) as TrainingMembershipRow | null;

    if (!membershipRecord) {
      await supabase.from("training_cohort_memberships").insert([
        {
          client_account_id: input.managerAccountId,
          cohort_id: cohort.id,
          confidence_baseline: 60,
          confidence_current: 60,
          role_slug: "client_manager",
        },
      ]);
    }
  }

  await createAdminAuditEntry({
    actionType: "training_cohort_created",
    entityId: cohort.id,
    entityTable: "training_cohorts",
    payload: {
      clientId: input.clientId,
      programmeId: input.programmeId,
      title,
    },
    summary: `Created training cohort ${title}.`,
  });

  return cohort;
}

export async function createTrainingSession(input: CreateTrainingSessionInput) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const title = input.title.trim();

  if (!title) {
    throw new Error("Session title is required.");
  }

  const cohort = await getTrainingCohortForAdmin(supabase, account, roleSlugs, input.cohortId);

  const { data: session, error } = await supabase
    .from("training_sessions")
    .insert([
      {
        cohort_id: cohort.id,
        created_by_admin_id: account.id,
        delivery_mode: input.deliveryMode || "onsite",
        ends_at: input.endsAt || null,
        facilitator_notes: input.facilitatorNotes?.trim() || null,
        follow_up_actions: input.followUpActions?.trim() || null,
        location_label: input.locationLabel?.trim() || "Client site training room",
        module_id: input.moduleId || null,
        readiness_status: input.readinessStatus || "not_ready",
        session_type: input.sessionType || "workshop",
        starts_at: input.startsAt || null,
        summary: input.summary?.trim() || null,
        title,
        updated_by_admin_id: account.id,
        virtual_link: input.virtualLink?.trim() || null,
      },
    ])
    .select("*")
    .single();

  if (error || !session) {
    throw new Error(error?.message ?? "Unable to create the training session.");
  }

  const preworkItems = (input.preworkItems ?? []).map((item) => item.trim()).filter(Boolean);

  if (preworkItems.length) {
    await supabase.from("training_session_prework_items").insert(
      preworkItems.map((item, index) => ({
        description: "Added from the session readiness form.",
        session_id: session.id,
        sort_order: index,
        title: item,
      })),
    );
  }

  const memberships = ((await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .select("*")
      .eq("cohort_id", cohort.id)
      .in("enrollment_status", ["active", "invited"]),
  )) ?? []) as TrainingMembershipRow[];

  await insertClientNotifications(
    supabase,
    memberships.map((membership) => ({
      body: `${title} has been scheduled for ${formatDateTimeLabel(session.starts_at)}.${preworkItems.length ? " Review the prework checklist before the session." : ""}`,
      clientAccountId: membership.client_account_id,
      linkHref: "/client-hub/schedule",
      priority: "normal",
      title: "New Lean training session scheduled",
    })),
  );

  await createAdminAuditEntry({
    actionType: "training_session_created",
    entityId: session.id,
    entityTable: "training_sessions",
    payload: {
      cohortId: cohort.id,
      moduleId: input.moduleId ?? null,
      title,
    },
    summary: `Created training session ${title}.`,
  });

  return session;
}

export async function createTrainingLearner(input: CreateTrainingLearnerInput) {
  const { account, supabase } = await assertAdminOwner();
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();

  if (!fullName || !email) {
    throw new Error("Learner name and email are required.");
  }

  const cohort = ((await selectOrThrow(
    supabase.from("training_cohorts").select("*").eq("id", input.cohortId).limit(1).maybeSingle(),
  )) ?? null) as TrainingCohortRow | null;

  if (!cohort) {
    throw new Error("Choose a valid cohort.");
  }

  const { data: upsertedAccount, error: accountError } = await supabase
    .from("client_accounts")
    .upsert(
      [
        {
          client_id: cohort.client_id,
          email,
          full_name: fullName,
          invited_at: new Date().toISOString(),
          role_title: input.roleTitle?.trim() || (input.roleSlug === "client_manager" ? "Client Manager" : "Learner"),
          status: "invited",
        },
      ],
      { onConflict: "email" },
    )
    .select("*")
    .single();

  if (accountError || !upsertedAccount) {
    throw new Error(accountError?.message ?? "Unable to create the learner account.");
  }

  const clientAccount = upsertedAccount as ClientAccountRecord;
  if (clientAccount.activated_at) {
    await selectOrThrow(
      supabase
        .from("client_accounts")
        .update({ status: "active" })
        .eq("id", clientAccount.id),
    );
  }
  const roles = await ensureClientRoles(supabase, clientAccount);
  const roleToApply = input.roleSlug || (roles.includes("client_manager") ? "client_manager" : "learner");

  const { data: membership, error: membershipError } = await supabase
    .from("training_cohort_memberships")
    .upsert(
      [
        {
          client_account_id: clientAccount.id,
          cohort_id: cohort.id,
          confidence_baseline: 50,
          confidence_current: 50,
          enrollment_status: clientAccount.activated_at ? "active" : "invited",
          role_slug: roleToApply,
        },
      ],
      { onConflict: "cohort_id,client_account_id" },
    )
    .select("*")
    .single();

  if (membershipError || !membership) {
    throw new Error(membershipError?.message ?? "Unable to enrol the learner.");
  }

  await createAdminAuditEntry({
    actionType: "training_membership_created",
    entityId: membership.id,
    entityTable: "training_cohort_memberships",
    payload: {
      cohortId: cohort.id,
      email,
      roleSlug: roleToApply,
    },
    summary: `Added ${fullName} to ${cohort.title}.`,
  });

  await supabase.from("notifications").insert([
    {
      body: clientAccount.activated_at
        ? `You have been added to ${cohort.title}. Your training workspace will now show sessions, resources, and assessments for this cohort.`
        : `You have been invited to ${cohort.title}. Complete sign-in and onboarding to activate your training workspace.`,
      client_account_id: clientAccount.id,
      delivery_channel: "in_app",
      priority: "normal",
      recipient_scope: "client",
      title: clientAccount.activated_at ? "You were added to a training cohort" : "Training invite sent",
    },
  ]);

  const programme = ((await selectOrThrow(
    supabase.from("training_programmes").select("*").eq("id", cohort.programme_id).limit(1).maybeSingle(),
  )) ?? null) as TrainingProgrammeRow | null;

  await sendTrainingInviteEmail({
    cohortTitle: cohort.title,
    programmeTitle: programme?.title ?? "Lean training programme",
    recipientEmail: email,
    recipientName: fullName,
    roleLabel: roleToApply === "client_manager" ? "Client manager" : "Learner",
    signInUrl: `${getSiteUrl()}/sign-in`,
  });

  return membership;
}

export async function resendTrainingLearnerInvite(clientAccountId: string) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const clientAccount = await getClientAccountForAdmin(supabase, account, roleSlugs, clientAccountId);
  const memberships = ((await selectOrThrow(
    supabase.from("training_cohort_memberships").select("*").eq("client_account_id", clientAccount.id),
  )) ?? []) as TrainingMembershipRow[];

  if (!memberships.length) {
    throw new Error("This client account is not enrolled in any training cohort.");
  }

  const primaryMembership = memberships[0];
  const cohort = ((await selectOrThrow(
    supabase.from("training_cohorts").select("*").eq("id", primaryMembership.cohort_id).limit(1).maybeSingle(),
  )) ?? null) as TrainingCohortRow | null;

  if (!cohort) {
    throw new Error("The linked training cohort could not be found.");
  }

  const programme = ((await selectOrThrow(
    supabase.from("training_programmes").select("*").eq("id", cohort.programme_id).limit(1).maybeSingle(),
  )) ?? null) as TrainingProgrammeRow | null;

  await selectOrThrow(
    supabase
      .from("client_accounts")
      .update({
        invited_at: new Date().toISOString(),
        status: clientAccount.activated_at ? "active" : "invited",
      })
      .eq("id", clientAccount.id),
  );

  await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .update({
        enrollment_status: clientAccount.activated_at ? "active" : "invited",
      })
      .eq("client_account_id", clientAccount.id),
  );

  await insertClientNotifications(supabase, [
    {
      body: clientAccount.activated_at
        ? `Your training access for ${cohort.title} has been refreshed. Review the latest sessions, resources, and assessments in the portal.`
        : `Your training invite for ${cohort.title} has been re-sent. Sign in to activate your learning workspace.`,
      clientAccountId: clientAccount.id,
      linkHref: "/client-hub",
      priority: "normal",
      title: clientAccount.activated_at ? "Training access refreshed" : "Training invite re-sent",
    },
  ]);

  await sendTrainingInviteEmail({
    cohortTitle: cohort.title,
    programmeTitle: programme?.title ?? "Lean training programme",
    recipientEmail: clientAccount.email,
    recipientName: clientAccount.full_name,
    roleLabel: clientAccount.role_title ?? "Learner",
    signInUrl: `${getSiteUrl()}/sign-in`,
  });

  await createAdminAuditEntry({
    actionType: "training_invite_resent",
    entityId: clientAccount.id,
    entityTable: "client_accounts",
    payload: { clientAccountId: clientAccount.id },
    summary: `Re-sent training invite to ${clientAccount.full_name}.`,
  });

  return { resent: true };
}

export async function revokeTrainingLearnerInvite(clientAccountId: string) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const clientAccount = await getClientAccountForAdmin(supabase, account, roleSlugs, clientAccountId);

  if (clientAccount.activated_at) {
    throw new Error("Activated learners should be deactivated, not invite-revoked.");
  }

  await selectOrThrow(
    supabase
      .from("client_accounts")
      .update({
        status: "revoked",
      })
      .eq("id", clientAccount.id),
  );

  await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .update({
        enrollment_status: "revoked",
      })
      .eq("client_account_id", clientAccount.id)
      .eq("enrollment_status", "invited"),
  );

  await createAdminAuditEntry({
    actionType: "training_invite_revoked",
    entityId: clientAccount.id,
    entityTable: "client_accounts",
    payload: { clientAccountId: clientAccount.id },
    summary: `Revoked training invite for ${clientAccount.full_name}.`,
  });

  return { revoked: true };
}

export async function setTrainingLearnerAccountState(input: {
  clientAccountId: string;
  nextState: "active" | "inactive";
}) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const clientAccount = await getClientAccountForAdmin(supabase, account, roleSlugs, input.clientAccountId);

  await selectOrThrow(
    supabase
      .from("client_accounts")
      .update({
        status: input.nextState,
      })
      .eq("id", clientAccount.id),
  );

  await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .update({
        enrollment_status: input.nextState === "active" ? (clientAccount.activated_at ? "active" : "invited") : "inactive",
      })
      .eq("client_account_id", clientAccount.id)
      .in("enrollment_status", ["active", "inactive", "invited", "revoked"]),
  );

  if (input.nextState === "active") {
    await insertClientNotifications(supabase, [
      {
        body: "Your training portal access has been reactivated. Review your current sessions, resources, and assessments.",
        clientAccountId: clientAccount.id,
        linkHref: "/client-hub",
        priority: "normal",
        title: "Training access restored",
      },
    ]);
  }

  await createAdminAuditEntry({
    actionType: input.nextState === "active" ? "training_learner_reactivated" : "training_learner_deactivated",
    entityId: clientAccount.id,
    entityTable: "client_accounts",
    payload: { clientAccountId: clientAccount.id, nextState: input.nextState },
    summary: `${input.nextState === "active" ? "Reactivated" : "Deactivated"} training access for ${clientAccount.full_name}.`,
  });

  return { updated: true };
}

export async function createTrainingAssessment(input: CreateTrainingAssessmentInput) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const title = input.title.trim();

  if (!title) {
    throw new Error("Assessment title is required.");
  }

  const cohort = await getTrainingCohortForAdmin(supabase, account, roleSlugs, input.cohortId);

  const { data: assessment, error } = await supabase
    .from("training_assessments")
    .insert([
      {
        assessment_type: input.assessmentType || "quiz",
        cohort_id: cohort.id,
        created_by_admin_id: account.id,
        due_at: input.dueAt || null,
        grading_mode: "manual",
        instructions: input.instructions?.trim() || null,
        max_attempts: input.maxAttempts ?? 2,
        max_score: input.maxScore ?? 100,
        module_id: input.moduleId || null,
        pass_score: input.passScore ?? 80,
        release_at: new Date().toISOString(),
        status: "open",
        title,
        updated_by_admin_id: account.id,
      },
    ])
    .select("*")
    .single();

  if (error || !assessment) {
    throw new Error(error?.message ?? "Unable to create the assessment.");
  }

  const memberships = ((await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .select("*")
      .eq("cohort_id", cohort.id)
      .in("enrollment_status", ["active", "invited"]),
  )) ?? []) as TrainingMembershipRow[];

  await insertClientNotifications(
    supabase,
    memberships.map((membership) => ({
      body: `${title} is now open.${assessment.due_at ? ` Submit your evidence by ${formatDateTimeLabel(assessment.due_at)}.` : ""}`,
      clientAccountId: membership.client_account_id,
      linkHref: "/client-hub/assessments",
      priority: "high",
      title: "New assessment released",
    })),
  );

  await createAdminAuditEntry({
    actionType: "training_assessment_created",
    entityId: assessment.id,
    entityTable: "training_assessments",
    payload: {
      cohortId: cohort.id,
      moduleId: input.moduleId ?? null,
      title,
    },
    summary: `Created training assessment ${title}.`,
  });

  return assessment;
}

export async function createTrainingResource(input: CreateTrainingResourceInput) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const title = input.title.trim();

  if (!title) {
    throw new Error("Resource title is required.");
  }

  if (input.cohortId) {
    await getTrainingCohortForAdmin(supabase, account, roleSlugs, input.cohortId);
  } else if (!roleSlugs.includes("admin_owner")) {
    throw new Error("Trainers can only release resources against cohorts assigned to them.");
  }

  const { data: resource, error } = await supabase
    .from("training_resources")
    .insert([
      {
        audience_role_slug: input.audienceRoleSlug || "all",
        cohort_id: input.cohortId || null,
        created_by_admin_id: account.id,
        delivery_channel: input.href?.trim() ? "link" : "document",
        href: input.href?.trim() || null,
        module_id: input.moduleId || null,
        programme_id: input.programmeId || null,
        resource_kind: input.resourceKind || "workbook",
        status: input.status || "released",
        summary: input.summary?.trim() || null,
        title,
        updated_by_admin_id: account.id,
        version_label: input.versionLabel?.trim() || "v1.0",
        visible_from: input.visibleFrom || null,
      },
    ])
    .select("*")
    .single();

  if (error || !resource) {
    throw new Error(error?.message ?? "Unable to create the training resource.");
  }

  await createAdminAuditEntry({
    actionType: "training_resource_created",
    entityId: resource.id,
    entityTable: "training_resources",
    payload: {
      cohortId: input.cohortId ?? null,
      moduleId: input.moduleId ?? null,
      title,
    },
    summary: `Created training resource ${title}.`,
  });

  return resource;
}

export async function updateTrainingResource(input: {
  audienceRoleSlug?: "trainer" | "client_manager" | "learner" | "all";
  cohortId?: string | null;
  href?: string | null;
  moduleId?: string | null;
  programmeId?: string | null;
  resourceId: string;
  resourceKind?: string | null;
  status?: string | null;
  summary?: string | null;
  title?: string | null;
  versionLabel?: string | null;
  visibleFrom?: string | null;
}) {
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const resource = ((await selectOrThrow(
    supabase.from("training_resources").select("*").eq("id", input.resourceId).limit(1).maybeSingle(),
  )) ?? null) as TrainingResourceRow | null;

  if (!resource) {
    throw new Error("Training resource not found.");
  }

  if (resource.cohort_id) {
    await getTrainingCohortForAdmin(supabase, account, roleSlugs, resource.cohort_id);
  } else if (!roleSlugs.includes("admin_owner")) {
    throw new Error("Only admin owners can change programme-wide resources.");
  }

  const updates: Record<string, unknown> = {
    updated_by_admin_id: account.id,
  };

  if (input.title?.trim()) updates.title = input.title.trim();
  if (input.summary !== undefined) updates.summary = input.summary?.trim() || null;
  if (input.href !== undefined) {
    updates.href = input.href?.trim() || null;
    updates.delivery_channel = input.href?.trim() ? "link" : "document";
  }
  if (input.moduleId !== undefined) updates.module_id = input.moduleId || null;
  if (input.programmeId !== undefined) updates.programme_id = input.programmeId || null;
  if (input.cohortId !== undefined) updates.cohort_id = input.cohortId || null;
  if (input.resourceKind !== undefined) updates.resource_kind = input.resourceKind || resource.resource_kind;
  if (input.audienceRoleSlug !== undefined) updates.audience_role_slug = input.audienceRoleSlug;
  if (input.status !== undefined) updates.status = input.status || resource.status;
  if (input.versionLabel !== undefined) updates.version_label = input.versionLabel?.trim() || null;
  if (input.visibleFrom !== undefined) updates.visible_from = input.visibleFrom || null;

  const { data: updated, error } = await supabase
    .from("training_resources")
    .update(updates)
    .eq("id", resource.id)
    .select("*")
    .single();

  if (error || !updated) {
    throw new Error(error?.message ?? "Unable to update the training resource.");
  }

  await createAdminAuditEntry({
    actionType:
      updated.status === "retired"
        ? "training_resource_retired"
        : "training_resource_updated",
    entityId: resource.id,
    entityTable: "training_resources",
    payload: {
      resourceId: resource.id,
      status: updated.status,
      versionLabel: updated.version_label,
    },
    summary: `${updated.status === "retired" ? "Retired" : "Updated"} training resource ${updated.title}.`,
  });

  return updated as TrainingResourceRow;
}

export async function submitTrainingAssessment(
  assessmentIdOrInput:
    | string
    | {
        assessmentId: string;
        evidenceFile?: File | null;
        submissionText: string;
      },
  submissionTextArg?: string,
) {
  const { account, client, primaryRole, supabase } = await ensureClientTrainingContext();
  const assessmentId = typeof assessmentIdOrInput === "string" ? assessmentIdOrInput : assessmentIdOrInput.assessmentId;
  const submissionText =
    typeof assessmentIdOrInput === "string"
      ? submissionTextArg ?? ""
      : assessmentIdOrInput.submissionText;
  const evidenceFile = typeof assessmentIdOrInput === "string" ? null : assessmentIdOrInput.evidenceFile ?? null;

  if (primaryRole !== "learner") {
    throw new Error("Only learners can submit assessment evidence from this page.");
  }

  const assessment = ((await selectOrThrow(
    supabase.from("training_assessments").select("*").eq("id", assessmentId).limit(1).maybeSingle(),
  )) ?? null) as TrainingAssessmentRow | null;

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  if (assessment.status !== "open") {
    throw new Error("This assessment is not currently open for submission.");
  }

  const membership = ((await selectOrThrow(
    supabase
      .from("training_cohort_memberships")
      .select("*")
      .eq("cohort_id", assessment.cohort_id)
      .eq("client_account_id", account.id)
      .limit(1)
      .maybeSingle(),
  )) ?? null) as TrainingMembershipRow | null;

  if (!membership) {
    throw new Error("You are not enrolled in the assessment cohort.");
  }

  const existing = ((await selectOrThrow(
    supabase
      .from("training_assessment_submissions")
      .select("*")
      .eq("assessment_id", assessment.id)
      .eq("membership_id", membership.id)
      .limit(1)
      .maybeSingle(),
  )) ?? null) as TrainingSubmissionRow | null;

  if (existing?.status === "passed") {
    throw new Error("This assessment has already been passed.");
  }

  const attemptsRemaining = assessment.max_attempts - (existing?.attempt_count ?? 0);

  if (existing && !["returned", "failed", "in_progress", "not_started"].includes(existing.status) && existing.status !== "submitted") {
    throw new Error("This assessment cannot accept another submission right now.");
  }

  if (existing?.status === "submitted") {
    throw new Error("This assessment is already waiting for grading.");
  }

  if (attemptsRemaining <= 0) {
    throw new Error("No retake attempts remain for this assessment.");
  }

  let evidencePath = existing?.evidence_file_path ?? null;
  let evidenceFileName = existing?.evidence_file_name ?? null;
  let evidenceFileSizeBytes = existing?.evidence_file_size_bytes ?? null;
  let evidenceMimeType = existing?.evidence_file_mime_type ?? null;

  if (evidenceFile?.size) {
    const validatedEvidence = validateEvidenceFile(evidenceFile);

    const safeName = sanitizeStorageFileName(evidenceFile.name || "evidence");
    evidencePath = `${assessment.id}/${membership.id}/${crypto.randomUUID()}-${safeName}`;
    evidenceFileName = evidenceFile.name || safeName;
    evidenceFileSizeBytes = evidenceFile.size;
    evidenceMimeType = validatedEvidence.mimeType;

    if (existing?.evidence_file_path) {
      await supabase.storage.from(TRAINING_EVIDENCE_BUCKET).remove([existing.evidence_file_path]);
    }

    const uploadBuffer = await evidenceFile.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(TRAINING_EVIDENCE_BUCKET)
      .upload(evidencePath, uploadBuffer, {
        cacheControl: "3600",
        contentType: evidenceMimeType,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }
  }

  const { data: submission, error } = await supabase
    .from("training_assessment_submissions")
    .upsert(
      [
        {
          assessment_id: assessment.id,
          attempt_count: (existing?.attempt_count ?? 0) + 1,
          evidence_file_mime_type: evidenceMimeType,
          evidence_file_name: evidenceFileName,
          evidence_file_path: evidencePath,
          evidence_file_size_bytes: evidenceFileSizeBytes,
          feedback: null,
          graded_at: null,
          graded_by_admin_id: null,
          membership_id: membership.id,
          score: null,
          status: "submitted",
          submission_text: submissionText.trim(),
          submitted_at: new Date().toISOString(),
        },
      ],
      { onConflict: "assessment_id,membership_id" },
    )
    .select("*")
    .single();

  if (error || !submission) {
    throw new Error(error?.message ?? "Unable to submit your assessment right now.");
  }

  await createClientActivityEntry({
    clientAccountId: account.id,
    clientId: client.id,
    description: `Submitted assessment evidence for ${assessment.title}.`,
    entityId: submission.id,
    entityTable: "training_assessment_submissions",
    eventType: "training_assessment_submitted",
    title: assessment.title,
  });

  const adminAccounts = ((await selectOrThrow(
    supabase.from("admin_accounts").select("id").eq("status", "active").limit(3),
  )) ?? []) as Array<{ id: string }>;

  if (adminAccounts.length) {
    await insertAdminNotifications(
      supabase,
      adminAccounts.map((adminRecord) => ({
        adminAccountId: adminRecord.id,
        body: `${account.full_name} submitted evidence for ${assessment.title}. Review and grade it from the assessment queue.`,
        linkHref: "/admin/assessments",
        priority: "high",
        title: "New assessment submission",
      })),
    );
  }

  await recordTrainingSubmissionEvent(supabase, {
    actorScope: "client",
    assessmentId: assessment.id,
    clientAccountId: account.id,
    eventType: "submitted",
    membershipId: membership.id,
    payload: {
      attemptCount: submission.attempt_count,
      hasEvidence: Boolean(evidencePath),
    },
    submissionId: submission.id,
    summary: `${account.full_name} submitted evidence for ${assessment.title}.`,
  });

  if (evidencePath) {
    await recordTrainingSubmissionEvent(supabase, {
      actorScope: "client",
      assessmentId: assessment.id,
      clientAccountId: account.id,
      eventType: "evidence_uploaded",
      membershipId: membership.id,
      payload: {
        fileName: evidenceFileName,
        mimeType: evidenceMimeType,
        sizeBytes: evidenceFileSizeBytes,
      },
      submissionId: submission.id,
      summary: `${account.full_name} uploaded supporting evidence for ${assessment.title}.`,
    });
  }

  await refreshMembershipCertification(supabase, membership.id);

  return submission;
}

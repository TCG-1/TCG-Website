import { createAdminAuditEntry, createClientActivityEntry, ensureAdminPortalContext, ensureClientPortalContext } from "@/lib/portal-data";
import type { AdminAccountRecord, ClientAccountRecord, ClientRecord } from "@/lib/portal-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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
  id: string;
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
  attempt_count: number;
  score: number | null;
  feedback: string | null;
  submitted_at: string | null;
  graded_at: string | null;
  graded_by_admin_id: string | null;
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

export type ClientTrainingWorkspace = {
  assessments: Array<
    TrainingPageListItem & {
      assessmentId: string;
      canSubmit: boolean;
      feedback: string | null;
      instructions: string | null;
      scoreLabel: string | null;
      submissionText: string | null;
    }
  >;
  intro: {
    description: string;
    eyebrow: string;
    title: string;
  };
  metrics: TrainingMetric[];
  modules: TrainingPageListItem[];
  nextSession: {
    checklist: string[];
    facilitator: string;
    format: string;
    time: string;
    title: string;
    venue: string;
  } | null;
  progress: Array<{ label: string; note: string; value: string }>;
  resources: TrainingPageListItem[];
  roleLabel: string;
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
  locationLabel?: string | null;
  moduleId?: string | null;
  preworkItems?: string[];
  readinessStatus?: string;
  sessionType?: string;
  startsAt?: string | null;
  summary?: string | null;
  title: string;
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
  summary?: string | null;
  title: string;
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
    supabase.from("role_definitions").select("id, slug, scope"),
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
    const cohortCode = `${slugifyText(client.slug || client.name).toUpperCase().slice(0, 6)}-LF-${new Date().getFullYear()}`;
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
      throw new Error(error?.message ?? "Unable to create the client training cohort.");
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
  }
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
  ]);

  return {
    adminAccounts: (adminAccounts ?? []) as AdminAccountRecord[],
    assessments: (assessments ?? []) as TrainingAssessmentRow[],
    attendance: (attendance ?? []) as TrainingAttendanceRow[],
    clientAccounts: (clientAccounts ?? []) as ClientAccountRecord[],
    clients: (clients ?? []) as ClientRecord[],
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
    sessions: (sessions ?? []) as TrainingSessionRow[],
    submissions: (submissions ?? []) as TrainingSubmissionRow[],
  };
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
  const { account, roleSlugs, supabase } = await ensureAdminTrainingContext();
  const data = await loadTrainingTables(supabase);

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
  const visibleAssessments = data.assessments.filter((assessment) => accessibleCohortIds.has(assessment.cohort_id));
  const visibleResources = data.resources.filter((resource) => {
    const roleAllowed =
      resource.audience_role_slug === "all" ||
      roleSlugs.includes(resource.audience_role_slug as TrainingRoleSlug) ||
      (resource.audience_role_slug === "learner" && primaryRole === "learner") ||
      (resource.audience_role_slug === "client_manager" && primaryRole === "client_manager");
    const cohortAllowed = resource.cohort_id ? accessibleCohortIds.has(resource.cohort_id) : true;
    const programmeAllowed = resource.programme_id ? resource.programme_id === primaryProgramme?.id : true;
    return roleAllowed && cohortAllowed && programmeAllowed;
  });
  const visibleSnapshots = data.progressSnapshots.filter((snapshot) => accessibleMembershipIds.has(snapshot.membership_id));
  const visibleSubmissions = data.submissions.filter((submission) => accessibleMembershipIds.has(submission.membership_id));
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

  const assessmentItems = visibleAssessments.map((assessment) => {
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
      (membership) =>
        !visibleSubmissions.some(
          (candidate) => candidate.assessment_id === assessment.id && candidate.membership_id === membership.id && ["submitted", "passed", "failed", "returned"].includes(candidate.status),
        ),
    );

    return {
      assessmentId: assessment.id,
      canSubmit: primaryRole === "learner",
      feedback: submission?.feedback ?? null,
      id: assessment.id,
      instructions: assessment.instructions,
      meta:
        primaryRole === "client_manager"
          ? `${primaryCohort?.title ?? "Training cohort"} • ${openCount} outstanding submission${openCount === 1 ? "" : "s"}`
          : `${primaryCohort?.title ?? "Training cohort"} • Due ${formatDateLabel(assessment.due_at)}`,
      note:
        submission?.status === "failed"
          ? "Below threshold. Review feedback and resubmit with stronger evidence."
          : assessment.summary ?? "Assessment linked to the live module.",
      scoreLabel: formatAssessmentScore(submission?.score, assessment.max_score),
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
  });

  const sessionItems = visibleSessions.map((session) => ({
    id: session.id,
    meta: `${formatDateTimeLabel(session.starts_at)} • ${toTitleCase(session.delivery_mode)} • ${buildTrainerLabelForCohort(session.cohort_id, data.cohortTrainers, data.adminAccounts, primaryCohort?.primary_trainer_admin_id)}`,
    note: session.summary ?? "Session delivery record inside the active training journey.",
    status: toTitleCase(session.readiness_status.replace(/_/g, " ")),
    title: session.title,
  }));

  const resourceItems = visibleResources.map((resource) => {
    const module = resource.module_id ? data.modules.find((item) => item.id === resource.module_id) : null;
    return {
      id: resource.id,
      meta: `${module?.title ?? "Programme-wide"} • ${toTitleCase(resource.resource_kind.replace(/_/g, " "))} • ${mapAudienceLabel(resource.audience_role_slug)}`,
      note: resource.summary ?? "Training resource ready to support the next learning step.",
      status: toTitleCase(resource.status),
      title: resource.title,
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

  return {
    assessments: assessmentItems,
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
    resources: resourceItems,
    roleLabel: primaryRole === "client_manager" ? "Client Manager" : "Learner",
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

export async function createTrainingCohort(input: CreateTrainingCohortInput) {
  const { account, supabase } = await ensureAdminTrainingContext();
  const title = input.title.trim();

  if (!title) {
    throw new Error("Cohort title is required.");
  }

  const code = `${slugifyText(title).toUpperCase().slice(0, 8)}-${new Date().getFullYear()}`;
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
  const { account, supabase } = await ensureAdminTrainingContext();
  const title = input.title.trim();

  if (!title) {
    throw new Error("Session title is required.");
  }

  const { data: session, error } = await supabase
    .from("training_sessions")
    .insert([
      {
        cohort_id: input.cohortId,
        created_by_admin_id: account.id,
        delivery_mode: input.deliveryMode || "onsite",
        ends_at: input.endsAt || null,
        location_label: input.locationLabel?.trim() || "Client site training room",
        module_id: input.moduleId || null,
        readiness_status: input.readinessStatus || "not_ready",
        session_type: input.sessionType || "workshop",
        starts_at: input.startsAt || null,
        summary: input.summary?.trim() || null,
        title,
        updated_by_admin_id: account.id,
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

  await createAdminAuditEntry({
    actionType: "training_session_created",
    entityId: session.id,
    entityTable: "training_sessions",
    payload: {
      cohortId: input.cohortId,
      moduleId: input.moduleId ?? null,
      title,
    },
    summary: `Created training session ${title}.`,
  });

  return session;
}

export async function createTrainingLearner(input: CreateTrainingLearnerInput) {
  const { account, supabase } = await ensureAdminTrainingContext();
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
          role_title: input.roleTitle?.trim() || (input.roleSlug === "client_manager" ? "Client Manager" : "Learner"),
          status: "active",
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
          enrollment_status: "active",
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
      body: `You have been added to ${cohort.title}. Your training workspace will now show sessions, resources, and assessments for this cohort.`,
      client_account_id: clientAccount.id,
      delivery_channel: "in_app",
      priority: "normal",
      recipient_scope: "client",
      title: "You were added to a training cohort",
    },
  ]);

  return membership;
}

export async function createTrainingAssessment(input: CreateTrainingAssessmentInput) {
  const { account, supabase } = await ensureAdminTrainingContext();
  const title = input.title.trim();

  if (!title) {
    throw new Error("Assessment title is required.");
  }

  const { data: assessment, error } = await supabase
    .from("training_assessments")
    .insert([
      {
        assessment_type: input.assessmentType || "quiz",
        cohort_id: input.cohortId,
        created_by_admin_id: account.id,
        due_at: input.dueAt || null,
        grading_mode: "manual",
        instructions: input.instructions?.trim() || null,
        max_attempts: 2,
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

  await createAdminAuditEntry({
    actionType: "training_assessment_created",
    entityId: assessment.id,
    entityTable: "training_assessments",
    payload: {
      cohortId: input.cohortId,
      moduleId: input.moduleId ?? null,
      title,
    },
    summary: `Created training assessment ${title}.`,
  });

  return assessment;
}

export async function createTrainingResource(input: CreateTrainingResourceInput) {
  const { account, supabase } = await ensureAdminTrainingContext();
  const title = input.title.trim();

  if (!title) {
    throw new Error("Resource title is required.");
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
        status: "released",
        summary: input.summary?.trim() || null,
        title,
        updated_by_admin_id: account.id,
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

export async function submitTrainingAssessment(assessmentId: string, submissionText: string) {
  const { account, client, primaryRole, supabase } = await ensureClientTrainingContext();

  if (primaryRole !== "learner") {
    throw new Error("Only learners can submit assessment evidence from this page.");
  }

  const assessment = ((await selectOrThrow(
    supabase.from("training_assessments").select("*").eq("id", assessmentId).limit(1).maybeSingle(),
  )) ?? null) as TrainingAssessmentRow | null;

  if (!assessment) {
    throw new Error("Assessment not found.");
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

  const { data: submission, error } = await supabase
    .from("training_assessment_submissions")
    .upsert(
      [
        {
          assessment_id: assessment.id,
          attempt_count: (existing?.attempt_count ?? 0) + 1,
          membership_id: membership.id,
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
    await supabase.from("notifications").insert(
      adminAccounts.map((adminRecord) => ({
        admin_account_id: adminRecord.id,
        body: `${account.full_name} submitted evidence for ${assessment.title}. Review and grade it from the assessment queue.`,
        delivery_channel: "in_app",
        priority: "high",
        recipient_scope: "admin",
        title: "New assessment submission",
      })),
    );
  }

  return submission;
}

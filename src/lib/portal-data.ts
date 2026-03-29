import type { User } from "@supabase/supabase-js";

import {
  serializeRichTextToSections,
  serializeSectionsToRichText,
} from "@/lib/blog-rich-text";
import { getAdminUser } from "@/lib/admin-auth";
import { getPortalUser, getPortalUserDisplayName } from "@/lib/portal-auth";
import { createSupabaseAdminClient, getSupabaseConfigError } from "@/lib/supabase/admin";

type AccountScope = "admin" | "client";

export type AdminAccountRecord = {
  id: string;
  auth_user_id: string | null;
  email: string;
  full_name: string;
  job_title: string | null;
  avatar_url: string | null;
  phone: string | null;
  status: string;
  last_signed_in_at: string | null;
};

export type ClientAccountRecord = {
  activated_at?: string | null;
  id: string;
  invited_at?: string | null;
  client_id: string | null;
  auth_user_id: string | null;
  email: string;
  full_name: string;
  onboarding_completed_at?: string | null;
  role_title: string | null;
  avatar_url: string | null;
  phone: string | null;
  status: string;
  last_signed_in_at: string | null;
};

export type ClientRecord = {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  status: string;
  location_label: string;
  account_owner_email?: string | null;
  account_owner_name?: string | null;
  overview?: string | null;
};

export type AccountPreferenceRecord = {
  id: string;
  theme: string | null;
  timezone: string | null;
  locale: string | null;
  date_format: string | null;
  preferences: Record<string, unknown>;
};

export type NotificationPreferenceRecord = {
  id: string;
  preference_key: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
  sms_enabled: boolean;
};

export type PortalNotificationRecord = {
  id: string;
  title: string;
  body: string;
  link_href: string | null;
  delivery_channel: string;
  priority: string;
  is_read: boolean;
  created_at: string;
  recipient_scope: string;
  admin_account_id: string | null;
  client_account_id: string | null;
};

export type SupportTicketRecord = {
  id: string;
  ticket_number: string;
  client_id: string | null;
  requester_admin_id: string | null;
  requester_client_account_id: string | null;
  assigned_admin_id: string | null;
  subject: string;
  category: string;
  priority: string;
  status: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
};

export type SupportTicketMessageRecord = {
  id: string;
  ticket_id: string;
  author_scope: string;
  admin_account_id: string | null;
  client_account_id: string | null;
  message_body: string;
  is_internal: boolean;
  created_at: string;
};

export type DocumentCollectionRecord = {
  id: string;
  client_id: string | null;
  slug: string;
  title: string;
  description: string | null;
  visibility: string;
  created_at: string;
  updated_at: string;
};

export type DocumentRecord = {
  id: string;
  collection_id: string | null;
  client_id: string | null;
  uploaded_by_admin_id: string | null;
  uploaded_by_client_account_id: string | null;
  title: string;
  file_name: string;
  file_path: string | null;
  public_url: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  document_type: string;
  visibility: string;
  version_label: string | null;
  is_latest: boolean;
  created_at: string;
  updated_at: string;
};

export type DocumentAccessRuleRecord = {
  id: string;
  document_id: string;
  access_scope: string;
  role_id: string | null;
  admin_account_id: string | null;
  client_account_id: string | null;
  client_id: string | null;
  can_view: boolean;
  can_download: boolean;
};

export type LeadSubmissionRecord = {
  id: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  source: string;
  status: string;
  enquiry_type: string | null;
  message: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  cover_url: string | null;
  canonical_url: string | null;
  noindex: boolean;
  og_image_url: string | null;
  seo_description: string | null;
  seo_title: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPostSectionRecord = {
  id: string;
  post_id: string;
  section_type: string;
  body: string;
  sort_order: number;
};

export type AdminAuditRecord = {
  id: string;
  actor_name: string | null;
  actor_email: string | null;
  action_type: string;
  entity_table: string;
  entity_id: string | null;
  summary: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export const ADMIN_NOTIFICATION_PRESET_FIELDS = [
  {
    description: "Send real-time notifications for security, hiring, and client workspace issues.",
    key: "critical_alerts",
    label: "Critical alerts",
  },
  {
    description: "Email a daily summary of leads, support tickets, and portal changes.",
    key: "daily_digest",
    label: "Daily operations digest",
  },
  {
    description: "Prompt admins to review KPI and roadmap changes before scheduled sessions.",
    key: "content_reminders",
    label: "Client content reminders",
  },
] as const;

export const CLIENT_NOTIFICATION_PRESET_FIELDS = [
  {
    description: "Show live programme updates in the portal.",
    key: "in_app_notifications",
    label: "In-app notifications",
  },
  {
    description: "Receive important schedule and document updates.",
    key: "email_alerts",
    label: "Email alerts",
  },
  {
    description: "Send a weekly digest of activity and milestones.",
    key: "weekly_summary",
    label: "Weekly summary",
  },
] as const;

export const DEFAULT_ADMIN_PREFERENCES = {
  bio:
    "Responsible for admin operations, portal content governance, client workspace quality, and security workflows across the Tacklers platform.",
  focusAreas: [
    "Client portal operations",
    "Content governance and QA",
    "Hiring and applications workflow",
    "Security and access management",
  ],
};

export const DEFAULT_CLIENT_PREFERENCES = {
  baseLocation: "UK operations",
  companyName: "Client workspace",
  defaultView: "Programme Overview",
  learningGoals: [
    "Improve visibility of value-stream performance",
    "Strengthen daily management routines",
    "Build confidence across front-line leaders",
  ],
};

function getSupabaseAdminClientOrThrow() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error(getSupabaseConfigError());
  }

  return supabase;
}

function normalizeText(value: string) {
  return value.trim();
}

function normalizeOptionalText(value: string) {
  const normalized = normalizeText(value);
  return normalized ? normalized : null;
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function asPreferenceObject(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function createTicketNumber() {
  return `SUP-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function createUniqueSlug(baseValue: string, fallback: string) {
  const base = slugifyText(baseValue) || fallback;
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}

export function slugifyText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function serializeBlogSections(body: string) {
  return serializeRichTextToSections(body);
}

export function readBlogBody(sections: BlogPostSectionRecord[]) {
  return serializeSectionsToRichText(sections);
}

export async function ensureAdminPortalContext() {
  const auth = await getAdminUser();

  if (!auth.user) {
    throw new Error("Unauthorized.");
  }

  const portalUser = await getPortalUser();
  const supabase = getSupabaseAdminClientOrThrow();
  const { data: upsertedAccount, error: accountError } = await supabase
    .from("admin_accounts")
    .upsert(
      {
        auth_user_id: portalUser?.id ?? null,
        email: auth.user.email,
        full_name: auth.user.name,
        status: "active",
        last_signed_in_at: new Date().toISOString(),
      },
      {
        onConflict: "email",
      },
    )
    .select("*")
    .single();

  if (accountError || !upsertedAccount) {
    throw new Error(accountError?.message ?? "Unable to load admin account.");
  }

  const account = upsertedAccount as AdminAccountRecord;
  const preferences = await ensureAccountPreferences("admin", account.id, DEFAULT_ADMIN_PREFERENCES);
  const notificationPreferences = await ensureNotificationPreferences("admin", account.id);

  return {
    account,
    notificationPreferences,
    preferences,
    supabase,
    user: auth.user,
  };
}

export async function ensureClientPortalContext() {
  const user = await getPortalUser();

  if (!user?.email) {
    throw new Error("Unauthorized.");
  }

  const supabase = getSupabaseAdminClientOrThrow();
  const fullName = getPortalUserDisplayName(user);
  const roleTitle =
    typeof user.user_metadata?.role_title === "string" && user.user_metadata.role_title.trim()
      ? user.user_metadata.role_title.trim()
      : "Portal User";
  const avatarUrl =
    typeof user.user_metadata?.avatar_url === "string" && user.user_metadata.avatar_url.trim()
      ? user.user_metadata.avatar_url.trim()
      : null;

  let existingAccount: ClientAccountRecord | null = null;

  const { data: existingByAuthUser, error: existingByAuthUserError } = await supabase
    .from("client_accounts")
    .select("*")
    .eq("auth_user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existingByAuthUserError) {
    throw new Error(existingByAuthUserError.message);
  }

  if (existingByAuthUser) {
    existingAccount = existingByAuthUser as ClientAccountRecord;
  } else {
    const { data: existingAccountData, error: existingAccountError } = await supabase
      .from("client_accounts")
      .select("*")
      .eq("email", user.email)
      .limit(1)
      .maybeSingle();

    if (existingAccountError) {
      throw new Error(existingAccountError.message);
    }

    existingAccount = (existingAccountData ?? null) as ClientAccountRecord | null;
  }

  if (existingAccount && ["archived", "inactive", "revoked"].includes(existingAccount.status)) {
    throw new Error("This client portal account is not currently active. Contact Tacklers support for access.");
  }

  const accountPayload = {
    avatar_url: avatarUrl,
    auth_user_id: user.id,
    email: user.email,
    full_name: fullName,
    last_signed_in_at: new Date().toISOString(),
    role_title: roleTitle,
    status: existingAccount?.status ?? "active",
  };

  const accountQuery = existingAccount
    ? supabase.from("client_accounts").update(accountPayload).eq("id", existingAccount.id)
    : supabase.from("client_accounts").insert(accountPayload);

  const { data: upsertedAccount, error: accountError } = await accountQuery.select("*").single();

  if (accountError || !upsertedAccount) {
    throw new Error(accountError?.message ?? "Unable to load client account.");
  }

  let account = upsertedAccount as ClientAccountRecord;

  if (account.status !== "active" || !account.activated_at) {
    const { data: activatedAccount, error: activationError } = await supabase
      .from("client_accounts")
      .update({
        activated_at: account.activated_at ?? new Date().toISOString(),
        status: "active",
      })
      .eq("id", account.id)
      .select("*")
      .single();

    if (activationError || !activatedAccount) {
      throw new Error(activationError?.message ?? "Unable to activate client account.");
    }

    account = activatedAccount as ClientAccountRecord;
  }

  const client = await ensureClientWorkspaceForAccount({
    account,
    supabase,
    user,
  });
  const preferences = await ensureAccountPreferences("client", account.id, DEFAULT_CLIENT_PREFERENCES);
  const notificationPreferences = await ensureNotificationPreferences("client", account.id);

  return {
    account: {
      ...account,
      client_id: client.id,
    },
    client,
    notificationPreferences,
    preferences,
    supabase,
    user,
  };
}

export async function ensureAccountPreferences(
  scope: AccountScope,
  accountId: string,
  defaults: Record<string, unknown>,
) {
  const supabase = getSupabaseAdminClientOrThrow();
  const idColumn = scope === "admin" ? "admin_account_id" : "client_account_id";
  const { data: existing, error } = await supabase
    .from("account_preferences")
    .select("*")
    .eq("account_scope", scope)
    .eq(idColumn, accountId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (existing) {
    const mergedPreferences = {
      ...defaults,
      ...asPreferenceObject(existing.preferences),
    };

    if (JSON.stringify(mergedPreferences) !== JSON.stringify(existing.preferences ?? {})) {
      const { data: updated, error: updateError } = await supabase
        .from("account_preferences")
        .update({ preferences: mergedPreferences })
        .eq("id", existing.id)
        .select("*")
        .single();

      if (updateError || !updated) {
        throw new Error(updateError?.message ?? "Unable to update account preferences.");
      }

      return {
        ...(updated as Omit<AccountPreferenceRecord, "preferences">),
        preferences: asPreferenceObject(updated.preferences),
      } as AccountPreferenceRecord;
    }

    return {
      ...(existing as Omit<AccountPreferenceRecord, "preferences">),
      preferences: asPreferenceObject(existing.preferences),
    } as AccountPreferenceRecord;
  }

  const payload =
    scope === "admin"
      ? {
          account_scope: "admin",
          admin_account_id: accountId,
          preferences: defaults,
        }
      : {
          account_scope: "client",
          client_account_id: accountId,
          preferences: defaults,
        };

  const { data: inserted, error: insertError } = await supabase
    .from("account_preferences")
    .insert([payload])
    .select("*")
    .single();

  if (insertError || !inserted) {
    throw new Error(insertError?.message ?? "Unable to create account preferences.");
  }

  return {
    ...(inserted as Omit<AccountPreferenceRecord, "preferences">),
    preferences: asPreferenceObject(inserted.preferences),
  } as AccountPreferenceRecord;
}

async function ensureClientWorkspaceForAccount({
  account,
  supabase,
  user,
}: {
  account: ClientAccountRecord;
  supabase: ReturnType<typeof getSupabaseAdminClientOrThrow>;
  user: User;
}) {
  if (account.client_id) {
    const { data: existingClient, error } = await supabase
      .from("clients")
      .select("id, name, slug, industry, status, location_label")
      .eq("id", account.client_id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (existingClient) {
      return existingClient as ClientRecord;
    }
  }

  const companyName =
    typeof user.user_metadata?.company_name === "string" && user.user_metadata.company_name.trim()
      ? user.user_metadata.company_name.trim()
      : null;
  const workspaceName = companyName || `${getPortalUserDisplayName(user)} Workspace`;

  const { data: firstClient, error: firstClientError } = await supabase
    .from("clients")
    .select("id, name, slug, industry, status, location_label")
    .in("status", ["active", "prospect"])
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstClientError) {
    throw new Error(firstClientError.message);
  }

  let client = firstClient as ClientRecord | null;

  if (!client) {
    const { data: insertedClient, error: insertClientError } = await supabase
      .from("clients")
      .insert([
        {
          account_owner_email: user.email ?? account.email,
          account_owner_name: getPortalUserDisplayName(user),
          industry: "Operational Excellence",
          location_label: "On-site at client locations across the UK",
          name: workspaceName,
          overview:
            "Workspace automatically provisioned for a client portal account so notifications, documents, and support requests remain linked.",
          slug: createUniqueSlug(workspaceName, "client-workspace"),
          status: "active",
        },
      ])
      .select("id, name, slug, industry, status, location_label")
      .single();

    if (insertClientError || !insertedClient) {
      throw new Error(insertClientError?.message ?? "Unable to create client workspace.");
    }

    client = insertedClient as ClientRecord;
  }

  const { error: updateAccountError } = await supabase
    .from("client_accounts")
    .update({
      client_id: client.id,
      status: account.status === "invited" ? "active" : account.status,
    })
    .eq("id", account.id);

  if (updateAccountError) {
    throw new Error(updateAccountError.message);
  }

  return client;
}

export async function ensureNotificationPreferences(scope: AccountScope, accountId: string) {
  const supabase = getSupabaseAdminClientOrThrow();
  const idColumn = scope === "admin" ? "admin_account_id" : "client_account_id";
  const defaults =
    scope === "admin"
      ? ADMIN_NOTIFICATION_PRESET_FIELDS.map((item, index) => ({
          email_enabled: index !== 2,
          in_app_enabled: true,
          preference_key: item.key,
          sms_enabled: false,
        }))
      : CLIENT_NOTIFICATION_PRESET_FIELDS.map((item, index) => ({
          email_enabled: index !== 2,
          in_app_enabled: true,
          preference_key: item.key,
          sms_enabled: false,
        }));

  const { data: existing, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("account_scope", scope)
    .eq(idColumn, accountId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (existing ?? []) as NotificationPreferenceRecord[];
  const existingKeys = new Set(rows.map((item) => item.preference_key));
  const missingRows = defaults.filter((item) => !existingKeys.has(item.preference_key));

  if (missingRows.length) {
    const payload = missingRows.map((item) =>
      scope === "admin"
        ? {
            account_scope: "admin",
            admin_account_id: accountId,
            ...item,
          }
        : {
            account_scope: "client",
            client_account_id: accountId,
            ...item,
          },
    );

    const { error: insertError } = await supabase.from("notification_preferences").insert(payload);

    if (insertError) {
      throw new Error(insertError.message);
    }

    const { data: insertedRows, error: reloadError } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("account_scope", scope)
      .eq(idColumn, accountId)
      .order("created_at", { ascending: true });

    if (reloadError) {
      throw new Error(reloadError.message);
    }

    return (insertedRows ?? []) as NotificationPreferenceRecord[];
  }

  return rows;
}

export async function createAdminAuditEntry({
  actionType,
  entityId,
  entityTable,
  payload = {},
  summary,
}: {
  actionType: string;
  entityId?: string | null;
  entityTable: string;
  payload?: Record<string, unknown>;
  summary: string;
}) {
  const { account, supabase } = await ensureAdminPortalContext();
  await supabase.from("admin_audit_log").insert([
    {
      action_type: actionType,
      actor_email: account.email,
      actor_name: account.full_name,
      entity_id: entityId ?? null,
      entity_table: entityTable,
      payload,
      summary,
    },
  ]);

  await supabase.from("activity_feed_events").insert([
    {
      actor_scope: "admin",
      admin_account_id: account.id,
      description: summary,
      entity_id: entityId ?? null,
      entity_table: entityTable,
      event_type: actionType,
      title: summary,
    },
  ]);
}

export async function createClientActivityEntry({
  clientAccountId,
  clientId,
  description,
  entityId,
  entityTable,
  eventType,
  title,
}: {
  clientAccountId: string;
  clientId?: string | null;
  description?: string | null;
  entityId?: string | null;
  entityTable?: string | null;
  eventType: string;
  title: string;
}) {
  const supabase = getSupabaseAdminClientOrThrow();

  await supabase.from("activity_feed_events").insert([
    {
      actor_scope: "client",
      client_account_id: clientAccountId,
      client_id: clientId ?? null,
      description: description ?? null,
      entity_id: entityId ?? null,
      entity_table: entityTable ?? null,
      event_type: eventType,
      title,
    },
  ]);
}

export function getAdminFocusAreas(preferences: AccountPreferenceRecord) {
  const value = preferences.preferences.focusAreas;
  return normalizeStringArray(value).length
    ? normalizeStringArray(value)
    : DEFAULT_ADMIN_PREFERENCES.focusAreas;
}

export function getAdminBio(preferences: AccountPreferenceRecord) {
  const bio = preferences.preferences.bio;
  return typeof bio === "string" && bio.trim() ? bio.trim() : DEFAULT_ADMIN_PREFERENCES.bio;
}

export function getClientBaseLocation(preferences: AccountPreferenceRecord) {
  const value = preferences.preferences.baseLocation;
  return typeof value === "string" && value.trim()
    ? value.trim()
    : DEFAULT_CLIENT_PREFERENCES.baseLocation;
}

export function getClientCompanyName(preferences: AccountPreferenceRecord) {
  const value = preferences.preferences.companyName;
  return typeof value === "string" && value.trim()
    ? value.trim()
    : DEFAULT_CLIENT_PREFERENCES.companyName;
}

export function getClientLearningGoals(preferences: AccountPreferenceRecord) {
  const values = normalizeStringArray(preferences.preferences.learningGoals);
  return values.length ? values : DEFAULT_CLIENT_PREFERENCES.learningGoals;
}

export function getClientDefaultView(preferences: AccountPreferenceRecord) {
  const value = preferences.preferences.defaultView;
  return typeof value === "string" && value.trim()
    ? value.trim()
    : DEFAULT_CLIENT_PREFERENCES.defaultView;
}

export function buildNotificationPreferenceMap(rows: NotificationPreferenceRecord[]) {
  return Object.fromEntries(rows.map((row) => [row.preference_key, row]));
}

export function getReadableNotificationLabel(
  scope: AccountScope,
  key: string,
) {
  const source =
    scope === "admin" ? ADMIN_NOTIFICATION_PRESET_FIELDS : CLIENT_NOTIFICATION_PRESET_FIELDS;
  return source.find((item) => item.key === key)?.label ?? key;
}

export function getReadableNotificationDescription(
  scope: AccountScope,
  key: string,
) {
  const source =
    scope === "admin" ? ADMIN_NOTIFICATION_PRESET_FIELDS : CLIENT_NOTIFICATION_PRESET_FIELDS;
  return source.find((item) => item.key === key)?.description ?? "";
}

export function createBlogSlug(title: string) {
  const base = slugifyText(title) || "blog-post";
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}

export function buildTicketSummary(subject: string, message: string) {
  const normalizedSubject = normalizeText(subject);
  const normalizedMessage = normalizeText(message);
  return normalizeText(`${normalizedSubject} ${normalizedMessage}`.slice(0, 180));
}

export function toSupportTicketNumber() {
  return createTicketNumber();
}

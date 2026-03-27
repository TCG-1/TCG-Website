import {
  createAdminAuditEntry,
  ensureAdminPortalContext,
} from "@/lib/portal-data";

export const runtime = "nodejs";

const DEFAULT_FEATURE_FLAGS = [
  {
    description: "Automatically surface discovery, support, and portal triage work inside the admin dashboard.",
    is_enabled: true,
    label: "Lead triage workflow",
    slug: "lead-triage-workflow",
  },
  {
    description: "Keep careers intake and application routing active across the hiring workflow.",
    is_enabled: true,
    label: "Application intake routing",
    slug: "application-intake-routing",
  },
  {
    description: "Require content review before major client workspace updates are considered complete.",
    is_enabled: false,
    label: "Client hub publishing guardrails",
    slug: "client-hub-publishing-guardrails",
  },
] as const;

const DEFAULT_INTEGRATIONS = [
  {
    config: { provider: "google-calendar" },
    label: "Google Calendar scheduling",
    provider_slug: "google-calendar",
    status: "enabled",
  },
  {
    config: { provider: "supabase-storage" },
    label: "Supabase storage",
    provider_slug: "supabase-storage",
    status: "enabled",
  },
  {
    config: { provider: "client-portal-auth" },
    label: "Client portal authentication",
    provider_slug: "client-portal-auth",
    status: "enabled",
  },
] as const;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

async function ensureSettingsDefaults(supabase: Awaited<ReturnType<typeof ensureAdminPortalContext>>["supabase"]) {
  const [{ data: featureFlags }, { data: integrations }] = await Promise.all([
    supabase.from("feature_flags").select("id, slug"),
    supabase.from("integration_settings").select("id, provider_slug"),
  ]);

  const featureFlagSlugs = new Set((featureFlags ?? []).map((item) => item.slug));
  const integrationSlugs = new Set((integrations ?? []).map((item) => item.provider_slug));

  const missingFlags = DEFAULT_FEATURE_FLAGS.filter((item) => !featureFlagSlugs.has(item.slug));
  const missingIntegrations = DEFAULT_INTEGRATIONS.filter(
    (item) => !integrationSlugs.has(item.provider_slug),
  );

  if (missingFlags.length) {
    await supabase.from("feature_flags").insert(
      missingFlags.map((item) => ({
        audience_scope: "admin",
        description: item.description,
        is_enabled: item.is_enabled,
        label: item.label,
        slug: item.slug,
      })),
    );
  }

  if (missingIntegrations.length) {
    await supabase.from("integration_settings").insert(
      missingIntegrations.map((item) => ({
        config: item.config,
        label: item.label,
        provider_slug: item.provider_slug,
        status: item.status,
      })),
    );
  }
}

export async function GET() {
  try {
    const { account, notificationPreferences, preferences, supabase } = await ensureAdminPortalContext();
    await ensureSettingsDefaults(supabase);

    const [{ data: securityEvents }, { data: passwordRequests }, { data: featureFlags }, { data: integrations }] =
      await Promise.all([
        supabase
          .from("account_security_events")
          .select("*")
          .eq("account_scope", "admin")
          .eq("admin_account_id", account.id)
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("password_change_requests")
          .select("*")
          .eq("account_scope", "admin")
          .eq("admin_account_id", account.id)
          .order("created_at", { ascending: false })
          .limit(6),
        supabase.from("feature_flags").select("*").eq("audience_scope", "admin").order("label", { ascending: true }),
        supabase.from("integration_settings").select("*").order("label", { ascending: true }),
      ]);

    return Response.json({
      featureFlags: featureFlags ?? [],
      integrations: integrations ?? [],
      notificationPreferences,
      passwordRequests: passwordRequests ?? [],
      preferences: {
        dateFormat: preferences.date_format,
        locale: preferences.locale,
        theme: preferences.theme,
        timezone: preferences.timezone,
      },
      securityEvents: securityEvents ?? [],
    });
  } catch (error) {
    return toResponseError(error, "Unable to load settings right now.");
  }
}

export async function PATCH(request: Request) {
  try {
    const { account, notificationPreferences, preferences, supabase } = await ensureAdminPortalContext();
    const body = (await request.json()) as {
      dateFormat?: string;
      featureFlags?: Array<{ id: string; isEnabled: boolean }>;
      integrations?: Array<{ id: string; status: string }>;
      locale?: string;
      notificationPreferences?: Array<{
        emailEnabled: boolean;
        id: string;
        inAppEnabled: boolean;
        smsEnabled: boolean;
      }>;
      theme?: string;
      timezone?: string;
    };

    const accountPreferenceUpdates: Record<string, unknown> = {};

    if (body.theme) accountPreferenceUpdates.theme = normalizeText(body.theme);
    if (body.timezone) accountPreferenceUpdates.timezone = normalizeText(body.timezone);
    if (body.locale) accountPreferenceUpdates.locale = normalizeText(body.locale);
    if (body.dateFormat) accountPreferenceUpdates.date_format = normalizeText(body.dateFormat);

    if (Object.keys(accountPreferenceUpdates).length) {
      const { error: preferencesError } = await supabase
        .from("account_preferences")
        .update(accountPreferenceUpdates)
        .eq("id", preferences.id);

      if (preferencesError) {
        throw new Error(preferencesError.message);
      }
    }

    if (body.notificationPreferences?.length) {
      await Promise.all(
        body.notificationPreferences
          .filter((item) => notificationPreferences.some((preference) => preference.id === item.id))
          .map((item) =>
            supabase
              .from("notification_preferences")
              .update({
                email_enabled: Boolean(item.emailEnabled),
                in_app_enabled: Boolean(item.inAppEnabled),
                sms_enabled: Boolean(item.smsEnabled),
              })
              .eq("id", item.id),
          ),
      );
    }

    if (body.featureFlags?.length) {
      await Promise.all(
        body.featureFlags.map((flag) =>
          supabase.from("feature_flags").update({ is_enabled: Boolean(flag.isEnabled) }).eq("id", flag.id),
        ),
      );
    }

    if (body.integrations?.length) {
      await Promise.all(
        body.integrations.map((integration) =>
          supabase
            .from("integration_settings")
            .update({ status: normalizeText(integration.status) || "disabled" })
            .eq("id", integration.id),
        ),
      );
    }

    await createAdminAuditEntry({
      actionType: "admin_settings_updated",
      entityId: account.id,
      entityTable: "account_preferences",
      payload: {
        integrationCount: body.integrations?.length ?? 0,
        notificationPreferenceCount: body.notificationPreferences?.length ?? 0,
      },
      summary: "Updated admin settings and notification defaults.",
    });

    return Response.json({ ok: true });
  } catch (error) {
    return toResponseError(error, "Unable to save settings right now.");
  }
}

export async function POST(request: Request) {
  try {
    const { account, supabase } = await ensureAdminPortalContext();
    const body = (await request.json()) as {
      confirmPassword?: string;
      currentPassword?: string;
      newPassword?: string;
    };
    const newPassword = normalizeText(body.newPassword);
    const confirmPassword = normalizeText(body.confirmPassword);

    if (!newPassword || newPassword.length < 10) {
      return Response.json({ error: "Use a stronger password request with at least 10 characters." }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return Response.json({ error: "New password and confirmation must match." }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

    const { error: requestError } = await supabase.from("password_change_requests").insert([
      {
        account_scope: "admin",
        admin_account_id: account.id,
        expires_at: expiresAt,
        request_status: "pending",
        requested_by: "admin_portal",
      },
    ]);

    if (requestError) {
      throw new Error(requestError.message);
    }

    await supabase.from("account_security_events").insert([
      {
        account_scope: "admin",
        admin_account_id: account.id,
        event_type: "password_reset_requested",
        metadata: {
          requested_from: "admin_settings",
        },
      },
    ]);

    await createAdminAuditEntry({
      actionType: "admin_password_change_requested",
      entityId: account.id,
      entityTable: "password_change_requests",
      summary: "Recorded an admin password change request.",
    });

    return Response.json({
      message:
        "Password change request recorded. Because admin credentials are environment-backed today, complete the final credential rotation in your deployment settings.",
    });
  } catch (error) {
    return toResponseError(error, "Unable to record the password request right now.");
  }
}

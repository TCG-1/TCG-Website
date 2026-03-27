import {
  createAdminAuditEntry,
  ensureAdminPortalContext,
  getAdminBio,
  getAdminFocusAreas,
} from "@/lib/portal-data";

export const runtime = "nodejs";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value: unknown) {
  const normalized = normalizeText(value);
  return normalized || null;
}

function normalizeStringList(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function GET() {
  try {
    const { account, preferences, supabase } = await ensureAdminPortalContext();
    const [{ data: securityEvents }, { data: sessions }] = await Promise.all([
      supabase
        .from("account_security_events")
        .select("*")
        .eq("account_scope", "admin")
        .eq("admin_account_id", account.id)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("account_sessions")
        .select("*")
        .eq("account_scope", "admin")
        .eq("admin_account_id", account.id)
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    const rawLocation = preferences.preferences.locationLabel;
    const locationLabel =
      typeof rawLocation === "string" && rawLocation.trim()
        ? rawLocation.trim()
        : "UK-wide on-site delivery";

    return Response.json({
      account,
      profile: {
        bio: getAdminBio(preferences),
        focusAreas: getAdminFocusAreas(preferences),
        locationLabel,
      },
      securityEvents: securityEvents ?? [],
      sessions: sessions ?? [],
    });
  } catch (error) {
    return toResponseError(error, "Unable to load the admin profile right now.");
  }
}

export async function PATCH(request: Request) {
  try {
    const { account, preferences, supabase } = await ensureAdminPortalContext();
    const body = (await request.json()) as Record<string, unknown>;
    const fullName = normalizeText(body.fullName);
    const jobTitle = normalizeOptionalText(body.jobTitle);
    const phone = normalizeOptionalText(body.phone);
    const avatarUrl = normalizeOptionalText(body.avatarUrl);
    const bio = normalizeOptionalText(body.bio) ?? getAdminBio(preferences);
    const locationLabel = normalizeOptionalText(body.locationLabel) ?? "UK-wide on-site delivery";
    const focusAreas = normalizeStringList(body.focusAreas);

    const { data: updatedAccount, error: accountError } = await supabase
      .from("admin_accounts")
      .update({
        avatar_url: avatarUrl,
        full_name: fullName || account.full_name,
        job_title: jobTitle,
        phone,
      })
      .eq("id", account.id)
      .select("*")
      .single();

    if (accountError || !updatedAccount) {
      throw new Error(accountError?.message ?? "Unable to update the admin account.");
    }

    const mergedPreferences = {
      ...preferences.preferences,
      bio,
      focusAreas,
      locationLabel,
    };

    const { error: preferencesError } = await supabase
      .from("account_preferences")
      .update({
        preferences: mergedPreferences,
      })
      .eq("id", preferences.id);

    if (preferencesError) {
      throw new Error(preferencesError.message);
    }

    await createAdminAuditEntry({
      actionType: "admin_profile_updated",
      entityId: account.id,
      entityTable: "admin_accounts",
      payload: {
        focusAreas,
        fullName: fullName || account.full_name,
        jobTitle,
      },
      summary: "Updated admin profile details.",
    });

    return Response.json({
      account: updatedAccount,
      profile: {
        bio,
        focusAreas,
        locationLabel,
      },
    });
  } catch (error) {
    return toResponseError(error, "Unable to save the admin profile right now.");
  }
}

import {
  createClientActivityEntry,
  ensureClientPortalContext,
  getClientBaseLocation,
  getClientCompanyName,
  getClientDefaultView,
  getClientLearningGoals,
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
    const { account, client, preferences, supabase } = await ensureClientPortalContext();
    const { data: securityEvents } = await supabase
      .from("account_security_events")
      .select("*")
      .eq("account_scope", "client")
      .eq("client_account_id", account.id)
      .order("created_at", { ascending: false })
      .limit(6);

    return Response.json({
      account,
      profile: {
        baseLocation: getClientBaseLocation(preferences),
        clientName: client.name,
        companyName: getClientCompanyName(preferences),
        defaultView: getClientDefaultView(preferences),
        learningGoals: getClientLearningGoals(preferences),
      },
      securityEvents: securityEvents ?? [],
      workspace: client,
    });
  } catch (error) {
    return toResponseError(error, "Unable to load your profile right now.");
  }
}

export async function PATCH(request: Request) {
  try {
    const { account, client, preferences, supabase } = await ensureClientPortalContext();
    const body = (await request.json()) as Record<string, unknown>;
    const fullName = normalizeText(body.fullName);
    const roleTitle = normalizeOptionalText(body.roleTitle);
    const phone = normalizeOptionalText(body.phone);
    const avatarUrl = normalizeOptionalText(body.avatarUrl);
    const companyName = normalizeOptionalText(body.companyName) ?? getClientCompanyName(preferences);
    const baseLocation = normalizeOptionalText(body.baseLocation) ?? getClientBaseLocation(preferences);
    const learningGoals = normalizeStringList(body.learningGoals);
    const defaultView = normalizeOptionalText(body.defaultView) ?? getClientDefaultView(preferences);

    const { data: updatedAccount, error: accountError } = await supabase
      .from("client_accounts")
      .update({
        avatar_url: avatarUrl,
        full_name: fullName || account.full_name,
        phone,
        role_title: roleTitle,
      })
      .eq("id", account.id)
      .select("*")
      .single();

    if (accountError || !updatedAccount) {
      throw new Error(accountError?.message ?? "Unable to update your account.");
    }

    const mergedPreferences = {
      ...preferences.preferences,
      baseLocation,
      companyName,
      defaultView,
      learningGoals,
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

    if (account.client_id) {
      const { error: clientError } = await supabase
        .from("clients")
        .update({
          location_label: baseLocation,
          name: companyName,
        })
        .eq("id", account.client_id);

      if (clientError) {
        throw new Error(clientError.message);
      }
    }

    await createClientActivityEntry({
      clientAccountId: account.id,
      clientId: client.id,
      description: "Updated profile and workspace context.",
      entityId: account.id,
      entityTable: "client_accounts",
      eventType: "client_profile_updated",
      title: fullName || account.full_name,
    });

    return Response.json({
      account: updatedAccount,
      profile: {
        baseLocation,
        companyName,
        defaultView,
        learningGoals,
      },
    });
  } catch (error) {
    return toResponseError(error, "Unable to save your profile right now.");
  }
}

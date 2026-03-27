import { createClientActivityEntry, ensureClientPortalContext } from "@/lib/portal-data";

export const runtime = "nodejs";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function GET() {
  try {
    const { account, client, notificationPreferences, preferences, supabase } =
      await ensureClientPortalContext();
    const [{ data: securityEvents }, { data: passwordRequests }] = await Promise.all([
      supabase
        .from("account_security_events")
        .select("*")
        .eq("account_scope", "client")
        .eq("client_account_id", account.id)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("password_change_requests")
        .select("*")
        .eq("account_scope", "client")
        .eq("client_account_id", account.id)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    return Response.json({
      notificationPreferences,
      passwordRequests: passwordRequests ?? [],
      preferences: {
        dateFormat: preferences.date_format,
        defaultView:
          typeof preferences.preferences.defaultView === "string"
            ? preferences.preferences.defaultView
            : "Programme Overview",
        locale: preferences.locale,
        theme: preferences.theme,
        timezone: preferences.timezone,
      },
      securityEvents: securityEvents ?? [],
      workspace: {
        accountId: account.id,
        clientId: client.id,
      },
    });
  } catch (error) {
    return toResponseError(error, "Unable to load your settings right now.");
  }
}

export async function PATCH(request: Request) {
  try {
    const { account, client, notificationPreferences, preferences, supabase } =
      await ensureClientPortalContext();
    const body = (await request.json()) as {
      dateFormat?: string;
      defaultView?: string;
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

    if (body.defaultView) {
      accountPreferenceUpdates.preferences = {
        ...preferences.preferences,
        defaultView: normalizeText(body.defaultView),
      };
    }

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

    await createClientActivityEntry({
      clientAccountId: account.id,
      clientId: client.id,
      description: "Updated client portal settings.",
      entityId: preferences.id,
      entityTable: "account_preferences",
      eventType: "client_settings_updated",
      title: "Settings updated",
    });

    return Response.json({ ok: true });
  } catch (error) {
    return toResponseError(error, "Unable to save your settings right now.");
  }
}

export async function POST(request: Request) {
  try {
    const { account, client, supabase } = await ensureClientPortalContext();
    const body = (await request.json()) as {
      confirmPassword?: string;
      currentPassword?: string;
      newPassword?: string;
    };
    const newPassword = normalizeText(body.newPassword);
    const confirmPassword = normalizeText(body.confirmPassword);

    if (!newPassword || newPassword.length < 10) {
      return Response.json({ error: "Use a stronger password with at least 10 characters." }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return Response.json({ error: "New password and confirmation must match." }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

    const { error: requestError } = await supabase.from("password_change_requests").insert([
      {
        account_scope: "client",
        client_account_id: account.id,
        expires_at: expiresAt,
        request_status: "pending",
        requested_by: "client_portal",
      },
    ]);

    if (requestError) {
      throw new Error(requestError.message);
    }

    await supabase.from("account_security_events").insert([
      {
        account_scope: "client",
        client_account_id: account.id,
        event_type: "password_reset_requested",
        metadata: {
          requested_from: "client_settings",
        },
      },
    ]);

    await createClientActivityEntry({
      clientAccountId: account.id,
      clientId: client.id,
      description: "Requested a password reset.",
      entityId: account.id,
      entityTable: "password_change_requests",
      eventType: "client_password_reset_requested",
      title: "Password reset requested",
    });

    return Response.json({
      message:
        "Password reset request recorded. Complete the final password update from the secure link or reset workflow tied to your Supabase Auth configuration.",
    });
  } catch (error) {
    return toResponseError(error, "Unable to record your password request right now.");
  }
}

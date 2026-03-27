import {
  ensureClientPortalContext,
  getReadableNotificationDescription,
  getReadableNotificationLabel,
} from "@/lib/portal-data";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function GET() {
  try {
    const { account, notificationPreferences, supabase } = await ensureClientPortalContext();
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("recipient_scope", "client")
      .eq("client_account_id", account.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(error.message);
    }

    return Response.json({
      notifications: notifications ?? [],
      preferences: notificationPreferences.map((item) => ({
        ...item,
        description: getReadableNotificationDescription("client", item.preference_key),
        label: getReadableNotificationLabel("client", item.preference_key),
      })),
      stats: {
        total: notifications?.length ?? 0,
        unread: notifications?.filter((item) => !item.is_read).length ?? 0,
      },
    });
  } catch (error) {
    return toResponseError(error, "Unable to load your notifications right now.");
  }
}

export async function PATCH() {
  try {
    const { account, supabase } = await ensureClientPortalContext();

    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq("recipient_scope", "client")
      .eq("client_account_id", account.id)
      .eq("is_read", false);

    if (error) {
      throw new Error(error.message);
    }

    return Response.json({ ok: true });
  } catch (error) {
    return toResponseError(error, "Unable to update your notifications right now.");
  }
}

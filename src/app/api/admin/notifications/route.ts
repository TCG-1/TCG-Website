import {
  createAdminAuditEntry,
  ensureAdminPortalContext,
  getReadableNotificationDescription,
  getReadableNotificationLabel,
} from "@/lib/portal-data";

export const runtime = "nodejs";

const PRIORITIES = new Set(["low", "normal", "high", "urgent"]);

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value: unknown) {
  const normalized = normalizeText(value);
  return normalized || null;
}

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function GET() {
  try {
    const { account, notificationPreferences, supabase } = await ensureAdminPortalContext();

    const [{ data: notifications, error: notificationsError }, { data: admins }, { data: clients }] =
      await Promise.all([
        supabase
          .from("notifications")
          .select("*")
          .eq("recipient_scope", "admin")
          .eq("admin_account_id", account.id)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("admin_accounts")
          .select("id, full_name, email, status")
          .order("full_name", { ascending: true }),
        supabase
          .from("client_accounts")
          .select("id, full_name, email, status, client_id")
          .order("full_name", { ascending: true }),
      ]);

    if (notificationsError) {
      throw new Error(notificationsError.message);
    }

    return Response.json({
      notifications: notifications ?? [],
      preferences: notificationPreferences.map((item) => ({
        ...item,
        description: getReadableNotificationDescription("admin", item.preference_key),
        label: getReadableNotificationLabel("admin", item.preference_key),
      })),
      recipients: {
        admins: (admins ?? []).filter((item) => item.status !== "archived"),
        clients: (clients ?? []).filter((item) => item.status !== "archived"),
      },
      stats: {
        total: notifications?.length ?? 0,
        unread: notifications?.filter((item) => !item.is_read).length ?? 0,
      },
    });
  } catch (error) {
    return toResponseError(error, "Unable to load notifications right now.");
  }
}

export async function POST(request: Request) {
  try {
    const { account, supabase } = await ensureAdminPortalContext();
    const body = (await request.json()) as Record<string, unknown>;

    const recipientScope = normalizeText(body.recipientScope).toLowerCase();
    const targetAccountId = normalizeText(body.targetAccountId);
    const title = normalizeText(body.title);
    const messageBody = normalizeText(body.body);
    const linkHref = normalizeOptionalText(body.linkHref);
    const priority = normalizeText(body.priority).toLowerCase() || "normal";

    if (!title || !messageBody) {
      return Response.json({ error: "Title and message are required." }, { status: 400 });
    }

    if (recipientScope !== "admin" && recipientScope !== "client") {
      return Response.json({ error: "Choose whether this alert is for an admin or client." }, { status: 400 });
    }

    if (!targetAccountId) {
      return Response.json({ error: "Choose a recipient account." }, { status: 400 });
    }

    if (!PRIORITIES.has(priority)) {
      return Response.json({ error: "Invalid priority value." }, { status: 400 });
    }

    const payload =
      recipientScope === "admin"
        ? {
            admin_account_id: targetAccountId,
            body: messageBody,
            delivery_channel: "in_app",
            link_href: linkHref,
            metadata: {
              sender_admin_id: account.id,
              sender_name: account.full_name,
            },
            priority,
            recipient_scope: "admin",
            sent_at: new Date().toISOString(),
            title,
          }
        : {
            body: messageBody,
            client_account_id: targetAccountId,
            delivery_channel: "in_app",
            link_href: linkHref,
            metadata: {
              sender_admin_id: account.id,
              sender_name: account.full_name,
            },
            priority,
            recipient_scope: "client",
            sent_at: new Date().toISOString(),
            title,
          };

    const { data: inserted, error } = await supabase
      .from("notifications")
      .insert([payload])
      .select("*")
      .single();

    if (error || !inserted) {
      throw new Error(error?.message ?? "Unable to create notification.");
    }

    await createAdminAuditEntry({
      actionType: "notification_created",
      entityId: inserted.id,
      entityTable: "notifications",
      payload: {
        priority,
        recipientScope,
        targetAccountId,
        title,
      },
      summary: `Created a ${priority} ${recipientScope} notification: ${title}.`,
    });

    return Response.json({ notification: inserted }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to create the notification right now.");
  }
}

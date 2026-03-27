import { ensureAdminPortalContext } from "@/lib/portal-data";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { account, supabase } = await ensureAdminPortalContext();
    const { id } = await context.params;
    const body = (await request.json()) as { isRead?: boolean };

    const { data, error } = await supabase
      .from("notifications")
      .update({
        is_read: Boolean(body.isRead),
        read_at: body.isRead ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .eq("recipient_scope", "admin")
      .eq("admin_account_id", account.id)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Unable to update the notification.");
    }

    return Response.json({ notification: data });
  } catch (error) {
    return toResponseError(error, "Unable to update the notification right now.");
  }
}

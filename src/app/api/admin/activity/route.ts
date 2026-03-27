import { ensureAdminPortalContext } from "@/lib/portal-data";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function GET() {
  try {
    const { supabase } = await ensureAdminPortalContext();
    const [{ data: activityFeed, error: activityError }, { data: auditLog }, { data: clients }] =
      await Promise.all([
        supabase.from("activity_feed_events").select("*").order("created_at", { ascending: false }).limit(40),
        supabase.from("admin_audit_log").select("*").order("created_at", { ascending: false }).limit(40),
        supabase.from("clients").select("id, name").order("name", { ascending: true }),
      ]);

    if (activityError) {
      throw new Error(activityError.message);
    }

    return Response.json({
      activityFeed: activityFeed ?? [],
      auditLog: auditLog ?? [],
      clients: clients ?? [],
      stats: {
        activityCount: activityFeed?.length ?? 0,
        auditCount: auditLog?.length ?? 0,
      },
    });
  } catch (error) {
    return toResponseError(error, "Unable to load the activity timeline right now.");
  }
}

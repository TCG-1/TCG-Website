import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { runScheduledTrainingReminders } from "@/lib/training-system";
import { ensureAdminPortalContext, createAdminAuditEntry } from "@/lib/portal-data";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function GET() {
  try {
    await ensureAdminPortalContext();
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      throw new Error("Supabase is not configured for training reminders.");
    }

    const { data, error } = await supabase
      .from("training_reminder_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(120);

    if (error) {
      throw new Error(error.message);
    }

    const rows = data ?? [];
    const lastActivityAt = rows[0]?.created_at ?? null;
    const stale =
      lastActivityAt
        ? Date.now() - new Date(lastActivityAt).getTime() > 1000 * 60 * 60 * 4
        : true;

    const byKind = Array.from(
      rows.reduce((map, row) => {
        const current = map.get(row.reminder_kind) ?? { count: 0, lastSentAt: row.created_at };
        current.count += 1;
        if (new Date(row.created_at).getTime() > new Date(current.lastSentAt).getTime()) {
          current.lastSentAt = row.created_at;
        }
        map.set(row.reminder_kind, current);
        return map;
      }, new Map<string, { count: number; lastSentAt: string }>()),
    ) as Array<[string, { count: number; lastSentAt: string }]>;

    const summaryByKind = byKind
      .map(([kind, value]) => ({
        kind,
        count: value.count,
        lastSentAt: value.lastSentAt,
      }))
      .sort((left, right) => right.count - left.count);

    return Response.json({
      lastActivityAt,
      recent: rows.slice(0, 20),
      stale,
      stats: {
        kinds: summaryByKind.length,
        last24Hours: rows.filter((row) => Date.now() - new Date(row.created_at).getTime() <= 1000 * 60 * 60 * 24).length,
        total: rows.length,
      },
      summaryByKind,
    });
  } catch (error) {
    return toResponseError(error, "Unable to load the reminder console right now.");
  }
}

export async function POST() {
  try {
    await ensureAdminPortalContext();
    const result = await runScheduledTrainingReminders();
    await createAdminAuditEntry({
      actionType: "training_reminder_run_triggered",
      entityTable: "training_reminder_log",
      payload: result,
      summary: "Manually triggered the training reminder automation run.",
    });
    return Response.json({ result });
  } catch (error) {
    return toResponseError(error, "Unable to run the reminder automation right now.");
  }
}

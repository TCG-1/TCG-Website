import { createSupabaseAdminClient, getSupabaseConfigError } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return Response.json({ error: getSupabaseConfigError(), jobs: [] }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("careers_jobs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message, jobs: [] }, { status: 500 });
  }

  return Response.json({ jobs: data ?? [] });
}

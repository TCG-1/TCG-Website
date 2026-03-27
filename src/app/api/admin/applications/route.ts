import { requireAdminApiRequest } from "@/lib/admin-auth";
import { createSupabaseAdminClient, getSupabaseConfigError } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  const authError = await requireAdminApiRequest();

  if (authError) {
    return authError;
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return Response.json({ error: getSupabaseConfigError(), applications: [] }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("career_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message, applications: [] }, { status: 500 });
  }

  return Response.json({ applications: data ?? [] });
}

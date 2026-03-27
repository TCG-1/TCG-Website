import { isApplicationStatus, normalizeOptionalText, normalizeText } from "@/lib/careers";
import { createSupabaseAdminClient, getSupabaseConfigError } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return Response.json({ error: getSupabaseConfigError() }, { status: 503 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as Record<string, string>;
  const status = normalizeText(body.status ?? "");

  if (!isApplicationStatus(status)) {
    return Response.json({ error: "Invalid application status." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("career_applications")
    .update({
      status,
      review_notes: normalizeOptionalText(body.reviewNotes ?? ""),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ application: data });
}

import {
  DEFAULT_EMPLOYMENT_TYPE,
  DEFAULT_JOB_LOCATION,
  isJobStatus,
  normalizeMultilineText,
  normalizeOptionalText,
  normalizeText,
} from "@/lib/careers";
import { requireAdminApiRequest } from "@/lib/admin-auth";
import { createSupabaseAdminClient, getSupabaseConfigError } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const authError = await requireAdminApiRequest();

  if (authError) {
    return authError;
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return Response.json({ error: getSupabaseConfigError() }, { status: 503 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as Record<string, string>;
  const title = normalizeText(body.title ?? "");
  const summary = normalizeText(body.summary ?? "");
  const description = normalizeText(body.description ?? "");
  const status = normalizeText(body.status ?? "draft");

  if (!title || !summary || !description) {
    return Response.json({ error: "Title, summary, and description are required." }, { status: 400 });
  }

  if (!isJobStatus(status)) {
    return Response.json({ error: "Invalid job status." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("careers_jobs")
    .update({
      title,
      department: normalizeOptionalText(body.department ?? ""),
      location_label: normalizeOptionalText(body.locationLabel ?? "") ?? DEFAULT_JOB_LOCATION,
      employment_type: normalizeOptionalText(body.employmentType ?? "") ?? DEFAULT_EMPLOYMENT_TYPE,
      experience_level: normalizeOptionalText(body.experienceLevel ?? ""),
      summary,
      description,
      responsibilities: normalizeOptionalText(normalizeMultilineText(body.responsibilities ?? "")),
      requirements: normalizeOptionalText(normalizeMultilineText(body.requirements ?? "")),
      status,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ job: data });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireAdminApiRequest();

  if (authError) {
    return authError;
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return Response.json({ error: getSupabaseConfigError() }, { status: 503 });
  }

  const { id } = await context.params;
  const { error } = await supabase.from("careers_jobs").delete().eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}

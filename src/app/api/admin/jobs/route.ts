import {
  DEFAULT_EMPLOYMENT_TYPE,
  DEFAULT_JOB_LOCATION,
  buildUniqueCareerSlug,
  isJobStatus,
  normalizeMultilineText,
  normalizeOptionalText,
  normalizeText,
} from "@/lib/careers";
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
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message, jobs: [] }, { status: 500 });
  }

  return Response.json({ jobs: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return Response.json({ error: getSupabaseConfigError() }, { status: 503 });
  }

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
    .insert([
      {
        title,
        slug: buildUniqueCareerSlug(title),
        department: normalizeOptionalText(body.department ?? ""),
        location_label: normalizeOptionalText(body.locationLabel ?? "") ?? DEFAULT_JOB_LOCATION,
        employment_type: normalizeOptionalText(body.employmentType ?? "") ?? DEFAULT_EMPLOYMENT_TYPE,
        experience_level: normalizeOptionalText(body.experienceLevel ?? ""),
        summary,
        description,
        responsibilities: normalizeOptionalText(normalizeMultilineText(body.responsibilities ?? "")),
        requirements: normalizeOptionalText(normalizeMultilineText(body.requirements ?? "")),
        status,
      },
    ])
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ job: data }, { status: 201 });
}

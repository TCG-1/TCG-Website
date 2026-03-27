import { careersBucket, createSupabaseAdminClient, getSupabaseConfigError } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return Response.json({ error: getSupabaseConfigError() }, { status: 503 });
  }

  const { id } = await context.params;
  const { data: application, error: applicationError } = await supabase
    .from("career_applications")
    .select("resume_filename, resume_path, resume_content_type")
    .eq("id", id)
    .single();

  if (applicationError || !application?.resume_path) {
    return Response.json({ error: "Resume not found." }, { status: 404 });
  }

  const { data: file, error: downloadError } = await supabase.storage
    .from(careersBucket)
    .download(application.resume_path);

  if (downloadError || !file) {
    return Response.json({ error: "Unable to download resume." }, { status: 500 });
  }

  return new Response(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${application.resume_filename}"`,
      "Content-Type": application.resume_content_type || "application/octet-stream",
    },
  });
}

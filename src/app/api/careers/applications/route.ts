import {
  ACCEPTED_RESUME_MIME_TYPES,
  MAX_RESUME_FILE_SIZE,
  TALENT_NETWORK_LABEL,
  getResumeExtension,
  normalizeOptionalText,
  normalizeText,
  sanitizeFileName,
} from "@/lib/careers";
import { handleCareerApplicationLead } from "@/lib/inbound-submissions";
import { careersBucket, createSupabaseAdminClient, getSupabaseConfigError } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return Response.json({ error: getSupabaseConfigError() }, { status: 503 });
    }

    const formData = await request.formData();
    const fullName = normalizeText(String(formData.get("fullName") ?? ""));
    const email = normalizeText(String(formData.get("email") ?? ""));
    const phone = String(formData.get("phone") ?? "");
    const location = String(formData.get("location") ?? "");
    const linkedinUrl = String(formData.get("linkedinUrl") ?? "");
    const portfolioUrl = String(formData.get("portfolioUrl") ?? "");
    const coverNote = String(formData.get("coverNote") ?? "");
    const requestedJobId = normalizeText(String(formData.get("jobId") ?? ""));
    const requestedJobTitle = normalizeText(String(formData.get("jobTitleSnapshot") ?? ""));
    const resume = formData.get("resume");

    if (!fullName || !email) {
      return Response.json({ error: "Full name and email are required." }, { status: 400 });
    }

    if (!(resume instanceof File) || !resume.size) {
      return Response.json({ error: "Please attach your CV or resume." }, { status: 400 });
    }

    if (resume.size > MAX_RESUME_FILE_SIZE) {
      return Response.json({ error: "Please upload a file smaller than 10 MB." }, { status: 400 });
    }

    const resumeExtension = getResumeExtension(resume.name);
    if (!resumeExtension && !ACCEPTED_RESUME_MIME_TYPES.includes(resume.type)) {
      return Response.json({ error: "Please upload a PDF, DOC, or DOCX file." }, { status: 400 });
    }

    const jobId: string | null = requestedJobId || null;
    let jobTitleSnapshot = requestedJobTitle || TALENT_NETWORK_LABEL;

    if (jobId) {
      const { data: job, error: jobError } = await supabase
        .from("careers_jobs")
        .select("id, title, status")
        .eq("id", jobId)
        .single();

      if (jobError || !job || job.status !== "open") {
        return Response.json({ error: "That job is no longer open for applications." }, { status: 400 });
      }

      jobTitleSnapshot = job.title;
    }

    const normalizedFileName = sanitizeFileName(resume.name) || `resume${resumeExtension ?? ""}`;
    const filePath = `${jobId ?? "talent-network"}/${crypto.randomUUID()}-${normalizedFileName}`;
    const uploadBuffer = await resume.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(careersBucket)
      .upload(filePath, uploadBuffer, {
        cacheControl: "3600",
        contentType: resume.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      return Response.json({ error: uploadError.message }, { status: 500 });
    }

    const { error: insertError } = await supabase.from("career_applications").insert([
      {
        job_id: jobId,
        job_title_snapshot: jobTitleSnapshot,
        full_name: fullName,
        email,
        phone: normalizeOptionalText(phone),
        location: normalizeOptionalText(location),
        linkedin_url: normalizeOptionalText(linkedinUrl),
        portfolio_url: normalizeOptionalText(portfolioUrl),
        cover_note: normalizeOptionalText(coverNote),
        resume_filename: resume.name,
        resume_path: filePath,
        resume_content_type: normalizeOptionalText(resume.type),
      },
    ]);

    if (insertError) {
      await supabase.storage.from(careersBucket).remove([filePath]);
      return Response.json({ error: insertError.message }, { status: 500 });
    }

    await Promise.allSettled([
      handleCareerApplicationLead({
        coverNote,
        email,
        fullName,
        jobTitle: jobTitleSnapshot,
        linkedinUrl,
        location,
        phone,
        portfolioUrl,
        resumeFilename: resume.name,
      }),
    ]);

    return Response.json(
      {
        ok: true,
        message: "Application received. We will review it and get back to you.",
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unable to submit your application right now.",
      },
      { status: 500 },
    );
  }
}

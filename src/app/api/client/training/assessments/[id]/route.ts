import { submitTrainingAssessment } from "@/lib/training-system";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const contentType = request.headers.get("content-type") ?? "";
    let submissionText = "";
    let evidenceFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      submissionText = String(formData.get("submissionText") ?? "").trim();
      const evidenceCandidate = formData.get("evidenceFile");
      evidenceFile = evidenceCandidate instanceof File && evidenceCandidate.size ? evidenceCandidate : null;
    } else {
      const body = (await request.json()) as { submissionText?: string };
      submissionText = body.submissionText?.trim() ?? "";
    }

    if (!submissionText) {
      return Response.json({ error: "Submission text is required." }, { status: 400 });
    }

    const submission = await submitTrainingAssessment({
      assessmentId: id,
      evidenceFile,
      submissionText,
    });

    return Response.json({ submission }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to submit the assessment right now.");
  }
}

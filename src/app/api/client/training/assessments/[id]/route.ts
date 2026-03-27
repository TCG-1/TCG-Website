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
    const body = (await request.json()) as { submissionText?: string };
    const submissionText = body.submissionText?.trim() ?? "";

    if (!submissionText) {
      return Response.json({ error: "Submission text is required." }, { status: 400 });
    }

    const submission = await submitTrainingAssessment(id, submissionText);

    return Response.json({ submission }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to submit the assessment right now.");
  }
}

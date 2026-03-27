import { gradeTrainingAssessmentSubmission } from "@/lib/training-system";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      decision?: "auto" | "returned";
      feedback?: string | null;
      overrideStatus?: "failed" | "passed" | null;
      reopen?: boolean;
      score?: number | null;
    };

    const submission = await gradeTrainingAssessmentSubmission({
      decision: body.decision === "returned" ? "returned" : "auto",
      feedback: body.feedback ?? null,
      overrideStatus:
        body.overrideStatus === "passed" || body.overrideStatus === "failed"
          ? body.overrideStatus
          : null,
      reopen: Boolean(body.reopen),
      score: typeof body.score === "number" ? body.score : null,
      submissionId: id,
    });

    return Response.json({ submission });
  } catch (error) {
    return toResponseError(error, "Unable to save the grading decision right now.");
  }
}

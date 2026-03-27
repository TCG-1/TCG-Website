import { createTrainingAssessment } from "@/lib/training-system";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      assessmentType?: string;
      cohortId?: string;
      dueAt?: string | null;
      instructions?: string | null;
      maxAttempts?: number | null;
      maxScore?: number | null;
      moduleId?: string | null;
      passScore?: number | null;
      title?: string;
    };

    if (!body.cohortId || !body.title) {
      return Response.json({ error: "Cohort and title are required." }, { status: 400 });
    }

    const assessment = await createTrainingAssessment({
      assessmentType: body.assessmentType,
      cohortId: body.cohortId,
      dueAt: body.dueAt ?? null,
      instructions: body.instructions ?? null,
      maxAttempts: typeof body.maxAttempts === "number" ? body.maxAttempts : null,
      maxScore: typeof body.maxScore === "number" ? body.maxScore : null,
      moduleId: body.moduleId ?? null,
      passScore: typeof body.passScore === "number" ? body.passScore : null,
      title: body.title,
    });

    return Response.json({ assessment }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to create the assessment right now.");
  }
}

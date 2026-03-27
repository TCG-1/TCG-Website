import { createTrainingLearner } from "@/lib/training-system";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      cohortId?: string;
      email?: string;
      fullName?: string;
      roleSlug?: "client_manager" | "learner";
      roleTitle?: string | null;
    };

    if (!body.cohortId || !body.email || !body.fullName) {
      return Response.json({ error: "Cohort, learner name, and learner email are required." }, { status: 400 });
    }

    const membership = await createTrainingLearner({
      cohortId: body.cohortId,
      email: body.email,
      fullName: body.fullName,
      roleSlug: body.roleSlug,
      roleTitle: body.roleTitle ?? null,
    });

    return Response.json({ membership }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to enrol the learner right now.");
  }
}

import { createTrainingSession } from "@/lib/training-system";

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
      endsAt?: string | null;
      locationLabel?: string | null;
      moduleId?: string | null;
      preworkItems?: string[];
      readinessStatus?: string;
      startsAt?: string | null;
      title?: string;
    };

    if (!body.cohortId || !body.title) {
      return Response.json({ error: "Cohort and title are required." }, { status: 400 });
    }

    const session = await createTrainingSession({
      cohortId: body.cohortId,
      endsAt: body.endsAt ?? null,
      locationLabel: body.locationLabel ?? null,
      moduleId: body.moduleId ?? null,
      preworkItems: Array.isArray(body.preworkItems) ? body.preworkItems : [],
      readinessStatus: body.readinessStatus,
      startsAt: body.startsAt ?? null,
      title: body.title,
    });

    return Response.json({ session }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to schedule the training session right now.");
  }
}

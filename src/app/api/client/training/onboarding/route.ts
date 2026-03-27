import { completeTrainingOnboarding } from "@/lib/training-system";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      baseLocation?: string | null;
      defaultView?: string | null;
      learningGoals?: string[];
      timezone?: string | null;
    };

    const result = await completeTrainingOnboarding({
      baseLocation: body.baseLocation ?? null,
      defaultView: body.defaultView ?? null,
      learningGoals: Array.isArray(body.learningGoals) ? body.learningGoals : [],
      timezone: body.timezone ?? null,
    });

    return Response.json(result);
  } catch (error) {
    return toResponseError(error, "Unable to complete onboarding right now.");
  }
}

import { sendTrainingAssessmentReminder } from "@/lib/training-system";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const result = await sendTrainingAssessmentReminder(id);
    return Response.json(result);
  } catch (error) {
    return toResponseError(error, "Unable to send assessment reminders right now.");
  }
}

import { updateTrainingSession } from "@/lib/training-system";

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
      action?: "cancel" | "reschedule" | "save";
      deliveryMode?: string | null;
      endsAt?: string | null;
      facilitatorNotes?: string | null;
      followUpActions?: string | null;
      locationLabel?: string | null;
      moduleId?: string | null;
      preworkItems?: string[];
      readinessStatus?: string | null;
      startsAt?: string | null;
      status?: string | null;
      summary?: string | null;
      title?: string | null;
      virtualLink?: string | null;
    };

    const session = await updateTrainingSession({
      action: body.action,
      deliveryMode: body.deliveryMode ?? null,
      endsAt: body.endsAt ?? null,
      facilitatorNotes: body.facilitatorNotes ?? null,
      followUpActions: body.followUpActions ?? null,
      locationLabel: body.locationLabel ?? null,
      moduleId: body.moduleId ?? null,
      preworkItems: Array.isArray(body.preworkItems) ? body.preworkItems : undefined,
      readinessStatus: body.readinessStatus ?? null,
      sessionId: id,
      startsAt: body.startsAt ?? null,
      status: body.status ?? null,
      summary: body.summary ?? null,
      title: body.title ?? null,
      virtualLink: body.virtualLink ?? null,
    });

    return Response.json({ session });
  } catch (error) {
    return toResponseError(error, "Unable to update the session right now.");
  }
}

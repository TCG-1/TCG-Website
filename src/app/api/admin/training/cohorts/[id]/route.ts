import { updateTrainingCohort } from "@/lib/training-system";

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
      endsOn?: string | null;
      managerAccountId?: string | null;
      notes?: string | null;
      sponsorEmail?: string | null;
      sponsorName?: string | null;
      startsOn?: string | null;
      status?: string | null;
      title?: string | null;
      trainerAdminId?: string | null;
    };

    const cohort = await updateTrainingCohort({
      action: body.action,
      cohortId: id,
      deliveryMode: body.deliveryMode ?? null,
      endsOn: body.endsOn ?? null,
      managerAccountId: body.managerAccountId ?? null,
      notes: body.notes ?? null,
      sponsorEmail: body.sponsorEmail ?? null,
      sponsorName: body.sponsorName ?? null,
      startsOn: body.startsOn ?? null,
      status: body.status ?? null,
      title: body.title ?? null,
      trainerAdminId: body.trainerAdminId ?? null,
    });

    return Response.json({ cohort });
  } catch (error) {
    return toResponseError(error, "Unable to update the training cohort right now.");
  }
}

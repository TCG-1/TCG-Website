import { updateTrainingCohortTrainerAssignment } from "@/lib/training-system";

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
    const body = (await request.json()) as {
      roleLabel?: string | null;
      trainerAdminId?: string;
    };

    if (!body.trainerAdminId) {
      return Response.json({ error: "Choose a trainer account." }, { status: 400 });
    }

    const result = await updateTrainingCohortTrainerAssignment({
      action: "add",
      cohortId: id,
      roleLabel: body.roleLabel ?? null,
      trainerAdminId: body.trainerAdminId,
    });

    return Response.json(result);
  } catch (error) {
    return toResponseError(error, "Unable to add the cohort trainer right now.");
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      trainerAdminId?: string;
    };

    if (!body.trainerAdminId) {
      return Response.json({ error: "Choose a trainer account." }, { status: 400 });
    }

    const result = await updateTrainingCohortTrainerAssignment({
      action: "remove",
      cohortId: id,
      trainerAdminId: body.trainerAdminId,
    });

    return Response.json(result);
  } catch (error) {
    return toResponseError(error, "Unable to remove the cohort trainer right now.");
  }
}

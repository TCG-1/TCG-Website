import { updateTrainingMembershipRole } from "@/lib/training-system";

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
    const body = (await request.json()) as { roleSlug?: "client_manager" | "learner" };

    if (!body.roleSlug) {
      return Response.json({ error: "Role is required." }, { status: 400 });
    }

    const membership = await updateTrainingMembershipRole({
      membershipId: id,
      roleSlug: body.roleSlug,
    });

    return Response.json({ membership });
  } catch (error) {
    return toResponseError(error, "Unable to update the cohort role right now.");
  }
}

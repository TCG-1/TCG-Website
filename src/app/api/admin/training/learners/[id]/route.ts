import {
  resendTrainingLearnerInvite,
  revokeTrainingLearnerInvite,
  setTrainingLearnerAccountState,
} from "@/lib/training-system";

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
      action?: "deactivate" | "reactivate" | "resend_invite" | "revoke_invite";
    };

    switch (body.action) {
      case "resend_invite":
        return Response.json(await resendTrainingLearnerInvite(id));
      case "revoke_invite":
        return Response.json(await revokeTrainingLearnerInvite(id));
      case "deactivate":
        return Response.json(await setTrainingLearnerAccountState({ clientAccountId: id, nextState: "inactive" }));
      case "reactivate":
        return Response.json(await setTrainingLearnerAccountState({ clientAccountId: id, nextState: "active" }));
      default:
        return Response.json({ error: "Unknown learner account action." }, { status: 400 });
    }
  } catch (error) {
    return toResponseError(error, "Unable to update learner access right now.");
  }
}

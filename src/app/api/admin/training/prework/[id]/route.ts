import { reviewTrainingPreworkStatus } from "@/lib/training-system";

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
      membershipId?: string;
      note?: string | null;
      status?: "approved" | "done" | "todo";
    };

    if (!body.membershipId) {
      return Response.json({ error: "Membership is required." }, { status: 400 });
    }

    const result = await reviewTrainingPreworkStatus({
      membershipId: body.membershipId,
      note: body.note ?? null,
      preworkItemId: id,
      status: body.status === "approved" || body.status === "done" || body.status === "todo" ? body.status : "approved",
    });

    return Response.json({ status: result });
  } catch (error) {
    return toResponseError(error, "Unable to review prework right now.");
  }
}

import { updateTrainingPreworkStatus } from "@/lib/training-system";

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
      note?: string | null;
      status?: "approved" | "done" | "todo";
    };

    const status = body.status === "done" || body.status === "todo" ? body.status : "done";
    const result = await updateTrainingPreworkStatus({
      note: body.note ?? null,
      preworkItemId: id,
      status,
    });

    return Response.json({ status: result });
  } catch (error) {
    return toResponseError(error, "Unable to update prework right now.");
  }
}

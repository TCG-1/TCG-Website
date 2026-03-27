import { updateTrainingResource } from "@/lib/training-system";

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
      audienceRoleSlug?: "trainer" | "client_manager" | "learner" | "all";
      cohortId?: string | null;
      href?: string | null;
      moduleId?: string | null;
      programmeId?: string | null;
      resourceKind?: string | null;
      status?: string | null;
      summary?: string | null;
      title?: string | null;
      versionLabel?: string | null;
      visibleFrom?: string | null;
    };

    const resource = await updateTrainingResource({
      audienceRoleSlug: body.audienceRoleSlug,
      cohortId: body.cohortId ?? undefined,
      href: body.href ?? undefined,
      moduleId: body.moduleId ?? undefined,
      programmeId: body.programmeId ?? undefined,
      resourceId: id,
      resourceKind: body.resourceKind ?? undefined,
      status: body.status ?? undefined,
      summary: body.summary ?? undefined,
      title: body.title ?? undefined,
      versionLabel: body.versionLabel ?? undefined,
      visibleFrom: body.visibleFrom ?? undefined,
    });

    return Response.json({ resource });
  } catch (error) {
    return toResponseError(error, "Unable to update the training resource right now.");
  }
}

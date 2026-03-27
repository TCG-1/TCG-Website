import { createTrainingResource } from "@/lib/training-system";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      audienceRoleSlug?: "trainer" | "client_manager" | "learner" | "all";
      cohortId?: string | null;
      href?: string | null;
      moduleId?: string | null;
      programmeId?: string | null;
      resourceKind?: string;
      status?: string;
      summary?: string | null;
      title?: string;
      versionLabel?: string | null;
      visibleFrom?: string | null;
    };

    if (!body.title) {
      return Response.json({ error: "Title is required." }, { status: 400 });
    }

    const resource = await createTrainingResource({
      audienceRoleSlug: body.audienceRoleSlug,
      cohortId: body.cohortId ?? null,
      href: body.href ?? null,
      moduleId: body.moduleId ?? null,
      programmeId: body.programmeId ?? null,
      resourceKind: body.resourceKind,
      status: body.status,
      summary: body.summary ?? null,
      title: body.title,
      versionLabel: body.versionLabel ?? null,
      visibleFrom: body.visibleFrom ?? null,
    });

    return Response.json({ resource }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to create the training resource right now.");
  }
}

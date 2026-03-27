import { createTrainingCohort } from "@/lib/training-system";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      clientId?: string;
      managerAccountId?: string | null;
      programmeId?: string;
      sponsorEmail?: string | null;
      sponsorName?: string | null;
      startsOn?: string | null;
      title?: string;
      trainerAdminId?: string | null;
    };

    if (!body.clientId || !body.programmeId || !body.title) {
      return Response.json({ error: "Client, programme, and title are required." }, { status: 400 });
    }

    const cohort = await createTrainingCohort({
      clientId: body.clientId,
      managerAccountId: body.managerAccountId ?? null,
      programmeId: body.programmeId,
      sponsorEmail: body.sponsorEmail ?? null,
      sponsorName: body.sponsorName ?? null,
      startsOn: body.startsOn ?? null,
      title: body.title,
      trainerAdminId: body.trainerAdminId ?? null,
    });

    return Response.json({ cohort }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to create the training cohort right now.");
  }
}

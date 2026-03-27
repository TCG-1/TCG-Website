import { awardTrainingCertificate, revokeTrainingCertificate } from "@/lib/training-system";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { membershipId?: string; note?: string | null };

    if (!body.membershipId) {
      return Response.json({ error: "Membership is required." }, { status: 400 });
    }

    const certificate = await awardTrainingCertificate({
      membershipId: body.membershipId,
      note: body.note ?? null,
    });

    return Response.json({ certificate }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to award the certificate right now.");
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { membershipId?: string; reason?: string };

    if (!body.membershipId || !body.reason?.trim()) {
      return Response.json({ error: "Membership and revocation reason are required." }, { status: 400 });
    }

    const result = await revokeTrainingCertificate({
      membershipId: body.membershipId,
      reason: body.reason,
    });

    return Response.json(result);
  } catch (error) {
    return toResponseError(error, "Unable to revoke the certificate right now.");
  }
}

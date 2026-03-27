import { updateTrainingAttendance } from "@/lib/training-system";

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
      markSessionComplete?: boolean;
      records?: Array<{
        attendanceStatus?: "attended" | "excused" | "expected" | "late" | "missed";
        membershipId?: string;
        note?: string | null;
      }>;
    };

    const validRecords = (body.records ?? []).filter(
      (record): record is { attendanceStatus: "attended" | "excused" | "expected" | "late" | "missed"; membershipId: string; note?: string | null } =>
        Boolean(record.membershipId && record.attendanceStatus),
    );

    if (!validRecords.length) {
      return Response.json({ error: "At least one attendance record is required." }, { status: 400 });
    }

    const result = await updateTrainingAttendance({
      markSessionComplete: Boolean(body.markSessionComplete),
      records: validRecords.map((record) => ({
        attendanceStatus: record.attendanceStatus,
        membershipId: record.membershipId,
        note: record.note ?? null,
      })),
      sessionId: id,
    });

    return Response.json(result);
  } catch (error) {
    return toResponseError(error, "Unable to update attendance right now.");
  }
}

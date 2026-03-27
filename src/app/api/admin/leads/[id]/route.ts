import { createAdminAuditEntry, ensureAdminPortalContext } from "@/lib/portal-data";

export const runtime = "nodejs";

const LEAD_STATUSES = new Set(["new", "qualified", "follow_up", "contacted", "closed"]);

type RouteContext = {
  params: Promise<{ id: string }>;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value: unknown) {
  const normalized = normalizeText(value);
  return normalized || null;
}

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { supabase } = await ensureAdminPortalContext();
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const requestedStatus = normalizeOptionalText(body.status)?.toLowerCase() ?? null;
    const status = requestedStatus === "contacted" ? "follow_up" : requestedStatus;
    const internalNotes = normalizeOptionalText(body.internalNotes);
    const enquiryType = normalizeOptionalText(body.enquiryType);
    const clientId = normalizeOptionalText(body.clientId);

    if (status && !LEAD_STATUSES.has(status)) {
      return Response.json({ error: "Invalid lead status." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

    if (body.status !== undefined) updates.status = status;
    if (body.internalNotes !== undefined) updates.internal_notes = internalNotes;
    if (body.enquiryType !== undefined) updates.enquiry_type = enquiryType;
    if (body.clientId !== undefined) updates.client_id = clientId;

    const { data: lead, error } = await supabase
      .from("lead_submissions")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !lead) {
      throw new Error(error?.message ?? "Unable to update the lead.");
    }

    await createAdminAuditEntry({
      actionType: "lead_updated",
      entityId: lead.id,
      entityTable: "lead_submissions",
      payload: {
        clientId,
        status: lead.status,
      },
      summary: `Updated lead ${lead.full_name}.`,
    });

    return Response.json({ lead });
  } catch (error) {
    return toResponseError(error, "Unable to update the lead right now.");
  }
}

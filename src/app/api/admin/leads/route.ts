import { createAdminAuditEntry, ensureAdminPortalContext } from "@/lib/portal-data";
import { ensureLeadSeedData } from "@/lib/portal-seed";

export const runtime = "nodejs";

const LEAD_STATUSES = new Set(["new", "qualified", "follow_up", "contacted", "closed"]);

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

export async function GET() {
  try {
    const { supabase } = await ensureAdminPortalContext();
    await ensureLeadSeedData(supabase);

    const [{ data: leads, error }, { data: clients }] = await Promise.all([
      supabase.from("lead_submissions").select("*").order("updated_at", { ascending: false }),
      supabase.from("clients").select("id, name").order("name", { ascending: true }),
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return Response.json({
      clients: clients ?? [],
      leads: leads ?? [],
      stats: {
        followUp:
          leads?.filter((lead) => lead.status === "follow_up" || lead.status === "contacted").length ?? 0,
        qualified: leads?.filter((lead) => lead.status === "qualified").length ?? 0,
        total: leads?.length ?? 0,
      },
    });
  } catch (error) {
    return toResponseError(error, "Unable to load leads right now.");
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await ensureAdminPortalContext();
    const body = (await request.json()) as Record<string, unknown>;
    const fullName = normalizeText(body.fullName);
    const companyName = normalizeOptionalText(body.companyName);
    const email = normalizeText(body.email);
    const phone = normalizeOptionalText(body.phone);
    const source = normalizeOptionalText(body.source) ?? "manual-entry";
    const requestedStatus = normalizeText(body.status).toLowerCase() || "new";
    const status = requestedStatus === "contacted" ? "follow_up" : requestedStatus;
    const enquiryType = normalizeOptionalText(body.enquiryType);
    const message = normalizeOptionalText(body.message);

    if (!fullName || !email) {
      return Response.json({ error: "Lead name and email are required." }, { status: 400 });
    }

    if (!LEAD_STATUSES.has(status)) {
      return Response.json({ error: "Invalid lead status." }, { status: 400 });
    }

    const { data: lead, error } = await supabase
      .from("lead_submissions")
      .insert([
        {
          company_name: companyName,
          email,
          enquiry_type: enquiryType,
          full_name: fullName,
          message,
          phone,
          source,
          status,
        },
      ])
      .select("*")
      .single();

    if (error || !lead) {
      throw new Error(error?.message ?? "Unable to create the lead.");
    }

    await createAdminAuditEntry({
      actionType: "lead_created",
      entityId: lead.id,
      entityTable: "lead_submissions",
      payload: {
        fullName,
        source,
        status,
      },
      summary: `Created lead for ${fullName}.`,
    });

    return Response.json({ lead }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to create the lead right now.");
  }
}

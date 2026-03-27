import {
  buildTicketSummary,
  createAdminAuditEntry,
  ensureAdminPortalContext,
  toSupportTicketNumber,
} from "@/lib/portal-data";

export const runtime = "nodejs";

const TICKET_CATEGORIES = new Set([
  "general",
  "technical",
  "training",
  "portal_access",
  "reporting",
  "billing",
  "documents",
]);
const TICKET_PRIORITIES = new Set(["low", "normal", "high", "urgent"]);

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
    const [{ data: tickets, error: ticketsError }, { data: messages }, { data: admins }, { data: clients }, { data: clientAccounts }] =
      await Promise.all([
        supabase.from("support_tickets").select("*").order("updated_at", { ascending: false }),
        supabase.from("support_ticket_messages").select("*").order("created_at", { ascending: true }),
        supabase
          .from("admin_accounts")
          .select("id, full_name, email, status")
          .order("full_name", { ascending: true }),
        supabase
          .from("clients")
          .select("id, name, slug, status")
          .order("name", { ascending: true }),
        supabase
          .from("client_accounts")
          .select("id, client_id, full_name, email, status")
          .order("full_name", { ascending: true }),
      ]);

    if (ticketsError) {
      throw new Error(ticketsError.message);
    }

    return Response.json({
      messages: messages ?? [],
      references: {
        admins: admins ?? [],
        clientAccounts: clientAccounts ?? [],
        clients: clients ?? [],
      },
      stats: {
        open: tickets?.filter((ticket) => ticket.status === "open").length ?? 0,
        resolved: tickets?.filter((ticket) => ticket.status === "resolved").length ?? 0,
        total: tickets?.length ?? 0,
        urgent: tickets?.filter((ticket) => ticket.priority === "urgent").length ?? 0,
      },
      tickets: tickets ?? [],
    });
  } catch (error) {
    return toResponseError(error, "Unable to load the support queue right now.");
  }
}

export async function POST(request: Request) {
  try {
    const { account, supabase } = await ensureAdminPortalContext();
    const body = (await request.json()) as Record<string, unknown>;

    const subject = normalizeText(body.subject);
    const category = normalizeText(body.category).toLowerCase() || "general";
    const priority = normalizeText(body.priority).toLowerCase() || "normal";
    const clientId = normalizeOptionalText(body.clientId);
    const assignedAdminId = normalizeOptionalText(body.assignedAdminId);
    const messageBody = normalizeOptionalText(body.message);
    const summary = normalizeOptionalText(body.summary) ?? (messageBody ? buildTicketSummary(subject, messageBody) : null);

    if (!subject) {
      return Response.json({ error: "Subject is required." }, { status: 400 });
    }

    if (!TICKET_CATEGORIES.has(category)) {
      return Response.json({ error: "Invalid support category." }, { status: 400 });
    }

    if (!TICKET_PRIORITIES.has(priority)) {
      return Response.json({ error: "Invalid support priority." }, { status: 400 });
    }

    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .insert([
        {
          assigned_admin_id: assignedAdminId,
          category,
          client_id: clientId,
          priority,
          requester_admin_id: account.id,
          status: "open",
          subject,
          summary,
          ticket_number: toSupportTicketNumber(),
        },
      ])
      .select("*")
      .single();

    if (ticketError || !ticket) {
      throw new Error(ticketError?.message ?? "Unable to create the support ticket.");
    }

    if (messageBody) {
      const { error: messageError } = await supabase.from("support_ticket_messages").insert([
        {
          admin_account_id: account.id,
          author_scope: "admin",
          is_internal: false,
          message_body: messageBody,
          ticket_id: ticket.id,
        },
      ]);

      if (messageError) {
        throw new Error(messageError.message);
      }
    }

    await createAdminAuditEntry({
      actionType: "support_ticket_created",
      entityId: ticket.id,
      entityTable: "support_tickets",
      payload: {
        category,
        clientId,
        priority,
        subject,
      },
      summary: `Created support ticket ${ticket.ticket_number} for ${subject}.`,
    });

    return Response.json({ ticket }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to create the support ticket right now.");
  }
}

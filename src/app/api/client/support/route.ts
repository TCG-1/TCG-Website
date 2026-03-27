import {
  buildTicketSummary,
  createClientActivityEntry,
  ensureClientPortalContext,
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
    const { account, client, supabase } = await ensureClientPortalContext();
    const { data: tickets, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("client_id", client.id)
      .order("updated_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const ticketIds = (tickets ?? []).map((ticket) => ticket.id);
    const [{ data: messages }, { data: admins }] = await Promise.all([
      ticketIds.length
        ? supabase
            .from("support_ticket_messages")
            .select("*")
            .in("ticket_id", ticketIds)
            .order("created_at", { ascending: true })
        : Promise.resolve({ data: [], error: null }),
      supabase
        .from("admin_accounts")
        .select("id, full_name, email, status")
        .order("full_name", { ascending: true }),
    ]);

    return Response.json({
      messages: messages ?? [],
      references: {
        admins: admins ?? [],
      },
      stats: {
        open: tickets?.filter((ticket) => ticket.status === "open").length ?? 0,
        total: tickets?.length ?? 0,
        waiting: tickets?.filter((ticket) => ticket.status === "waiting").length ?? 0,
      },
      tickets: tickets ?? [],
      workspace: {
        accountId: account.id,
        clientId: client.id,
        clientName: client.name,
      },
    });
  } catch (error) {
    return toResponseError(error, "Unable to load support right now.");
  }
}

export async function POST(request: Request) {
  try {
    const { account, client, supabase } = await ensureClientPortalContext();
    const body = (await request.json()) as Record<string, unknown>;
    const subject = normalizeText(body.subject);
    const messageBody = normalizeText(body.message);
    const category = normalizeText(body.category).toLowerCase() || "general";
    const priority = normalizeText(body.priority).toLowerCase() || "normal";

    if (!subject || !messageBody) {
      return Response.json({ error: "Subject and message are required." }, { status: 400 });
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
          category,
          client_id: client.id,
          priority,
          requester_client_account_id: account.id,
          status: "open",
          subject,
          summary: buildTicketSummary(subject, messageBody),
          ticket_number: toSupportTicketNumber(),
        },
      ])
      .select("*")
      .single();

    if (ticketError || !ticket) {
      throw new Error(ticketError?.message ?? "Unable to create the support ticket.");
    }

    const { error: messageError } = await supabase.from("support_ticket_messages").insert([
      {
        author_scope: "client",
        client_account_id: account.id,
        is_internal: false,
        message_body: messageBody,
        ticket_id: ticket.id,
      },
    ]);

    if (messageError) {
      throw new Error(messageError.message);
    }

    const { data: adminAccounts } = await supabase
      .from("admin_accounts")
      .select("id")
      .in("status", ["active", "invited"]);

    if (adminAccounts?.length) {
      await supabase.from("notifications").insert(
        adminAccounts.map((adminRow) => ({
          admin_account_id: adminRow.id,
          body: `${client.name}: ${messageBody}`,
          delivery_channel: "in_app",
          metadata: {
            client_account_id: account.id,
            client_id: client.id,
            ticket_id: ticket.id,
            ticket_number: ticket.ticket_number,
          },
          priority: priority === "urgent" ? "urgent" : "high",
          recipient_scope: "admin",
          sent_at: new Date().toISOString(),
          title: `New support ticket: ${subject}`,
        })),
      );
    }

    await createClientActivityEntry({
      clientAccountId: account.id,
      clientId: client.id,
      description: `Created support ticket ${ticket.ticket_number}.`,
      entityId: ticket.id,
      entityTable: "support_tickets",
      eventType: "support_ticket_created",
      title: subject,
    });

    return Response.json({ ticket }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to create your support request right now.");
  }
}

import {
  createClientActivityEntry,
  ensureClientPortalContext,
} from "@/lib/portal-data";

export const runtime = "nodejs";

const CLIENT_STATUSES = new Set(["waiting", "closed"]);

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
    const { account, client, supabase } = await ensureClientPortalContext();
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const messageBody = normalizeOptionalText(body.message);
    const status = normalizeOptionalText(body.status)?.toLowerCase() ?? null;

    const { data: existingTicket, error: existingTicketError } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("id", id)
      .eq("client_id", client.id)
      .single();

    if (existingTicketError || !existingTicket) {
      throw new Error(existingTicketError?.message ?? "Unable to load the support request.");
    }

    let ticket = existingTicket;

    if (status) {
      if (!CLIENT_STATUSES.has(status)) {
        return Response.json({ error: "Invalid support status." }, { status: 400 });
      }

      const { data: updatedTicket, error: updateError } = await supabase
        .from("support_tickets")
        .update({ status })
        .eq("id", id)
        .select("*")
        .single();

      if (updateError || !updatedTicket) {
        throw new Error(updateError?.message ?? "Unable to update the support request.");
      }

      ticket = updatedTicket;
    }

    if (messageBody) {
      const { error: messageError } = await supabase.from("support_ticket_messages").insert([
        {
          author_scope: "client",
          client_account_id: account.id,
          is_internal: false,
          message_body: messageBody,
          ticket_id: id,
        },
      ]);

      if (messageError) {
        throw new Error(messageError.message);
      }

      const notifyAdminIds = new Set<string>();

      if (ticket.assigned_admin_id) {
        notifyAdminIds.add(ticket.assigned_admin_id);
      } else {
        const { data: adminAccounts } = await supabase
          .from("admin_accounts")
          .select("id")
          .in("status", ["active", "invited"]);

        (adminAccounts ?? []).forEach((item) => notifyAdminIds.add(item.id));
      }

      if (notifyAdminIds.size) {
        await supabase.from("notifications").insert(
          Array.from(notifyAdminIds).map((adminId) => ({
            admin_account_id: adminId,
            body: `${client.name}: ${messageBody}`,
            delivery_channel: "in_app",
            metadata: {
              client_account_id: account.id,
              client_id: client.id,
              ticket_id: ticket.id,
              ticket_number: ticket.ticket_number,
            },
            priority: "high",
            recipient_scope: "admin",
            sent_at: new Date().toISOString(),
            title: `Client reply: ${ticket.subject}`,
          })),
        );
      }
    }

    await createClientActivityEntry({
      clientAccountId: account.id,
      clientId: client.id,
      description: messageBody ? `Added a reply to ${ticket.ticket_number}.` : `Updated ${ticket.ticket_number}.`,
      entityId: ticket.id,
      entityTable: "support_tickets",
      eventType: "support_ticket_updated",
      title: ticket.subject,
    });

    return Response.json({ ticket });
  } catch (error) {
    return toResponseError(error, "Unable to update the support request right now.");
  }
}

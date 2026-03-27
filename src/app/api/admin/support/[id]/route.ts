import {
  createAdminAuditEntry,
  ensureAdminPortalContext,
} from "@/lib/portal-data";
import { sendSupportAdminReplyEmail } from "@/lib/support-email";

export const runtime = "nodejs";

const TICKET_STATUSES = new Set(["open", "in_progress", "waiting", "resolved", "closed"]);
const TICKET_PRIORITIES = new Set(["low", "normal", "high", "urgent"]);

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
    const { account, supabase } = await ensureAdminPortalContext();
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const messageBody = normalizeOptionalText(body.message);
    const assignedAdminId = normalizeOptionalText(body.assignedAdminId);
    const summary = normalizeOptionalText(body.summary);
    const status = normalizeOptionalText(body.status)?.toLowerCase() ?? null;
    const priority = normalizeOptionalText(body.priority)?.toLowerCase() ?? null;

    const updates: Record<string, unknown> = {};

    if (status) {
      if (!TICKET_STATUSES.has(status)) {
        return Response.json({ error: "Invalid support status." }, { status: 400 });
      }

      updates.status = status;
    }

    if (priority) {
      if (!TICKET_PRIORITIES.has(priority)) {
        return Response.json({ error: "Invalid support priority." }, { status: 400 });
      }

      updates.priority = priority;
    }

    if (body.assignedAdminId !== undefined) {
      updates.assigned_admin_id = assignedAdminId;
    }

    if (body.summary !== undefined) {
      updates.summary = summary;
    }

    const { data: existingTicket, error: existingTicketError } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (existingTicketError || !existingTicket) {
      throw new Error(existingTicketError?.message ?? "Unable to load the support ticket.");
    }

    let ticket = existingTicket;

    if (Object.keys(updates).length) {
      const { data: updatedTicket, error: updateError } = await supabase
        .from("support_tickets")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

      if (updateError || !updatedTicket) {
        throw new Error(updateError?.message ?? "Unable to update the support ticket.");
      }

      ticket = updatedTicket;
    }

    if (messageBody) {
      const { error: messageError } = await supabase.from("support_ticket_messages").insert([
        {
          admin_account_id: account.id,
          author_scope: "admin",
          is_internal: false,
          message_body: messageBody,
          ticket_id: id,
        },
      ]);

      if (messageError) {
        throw new Error(messageError.message);
      }

      if (ticket.requester_client_account_id) {
        const { data: requester } = await supabase
          .from("client_accounts")
          .select("email")
          .eq("id", ticket.requester_client_account_id)
          .maybeSingle();

        if (requester?.email) {
          await sendSupportAdminReplyEmail({
            adminName: account.full_name,
            messageBody,
            status: ticket.status,
            subject: ticket.subject,
            ticketNumber: ticket.ticket_number,
            to: requester.email,
          });
        }
      }

      if (ticket.requester_client_account_id) {
        await supabase.from("notifications").insert([
          {
            body: messageBody,
            client_account_id: ticket.requester_client_account_id,
            delivery_channel: "in_app",
            metadata: {
              sender_admin_id: account.id,
              sender_name: account.full_name,
              ticket_id: ticket.id,
              ticket_number: ticket.ticket_number,
            },
            priority: ticket.priority === "urgent" ? "high" : "normal",
            recipient_scope: "client",
            sent_at: new Date().toISOString(),
            title: `Support update: ${ticket.subject}`,
          },
        ]);
      }
    }

    await createAdminAuditEntry({
      actionType: "support_ticket_updated",
      entityId: ticket.id,
      entityTable: "support_tickets",
      payload: {
        assignedAdminId,
        hasMessage: Boolean(messageBody),
        priority: priority ?? ticket.priority,
        status: status ?? ticket.status,
      },
      summary: `Updated support ticket ${ticket.ticket_number}.`,
    });

    return Response.json({ ticket });
  } catch (error) {
    return toResponseError(error, "Unable to update the support ticket right now.");
  }
}

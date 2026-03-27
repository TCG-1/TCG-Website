import { createAdminAuditEntry, ensureAdminPortalContext } from "@/lib/portal-data";

export const runtime = "nodejs";

const DOCUMENT_TYPES = new Set([
  "general",
  "report",
  "training",
  "assessment",
  "proposal",
  "invoice",
  "resume",
  "policy",
]);
const VISIBILITIES = new Set(["admin_only", "client", "shared"]);

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

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

async function notifyClientWorkspace({
  clientId,
  message,
  supabase,
  title,
}: {
  clientId: string;
  message: string;
  supabase: Awaited<ReturnType<typeof ensureAdminPortalContext>>["supabase"];
  title: string;
}) {
  const { data: recipients } = await supabase
    .from("client_accounts")
    .select("id")
    .eq("client_id", clientId)
    .in("status", ["active", "invited"]);

  if (!recipients?.length) {
    return;
  }

  await supabase.from("notifications").insert(
    recipients.map((item) => ({
      body: message,
      client_account_id: item.id,
      delivery_channel: "in_app",
      priority: "normal",
      recipient_scope: "client",
      sent_at: new Date().toISOString(),
      title,
    })),
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { supabase } = await ensureAdminPortalContext();
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const title = normalizeText(body.title);
    const fileName = normalizeText(body.fileName);
    const clientId = normalizeOptionalText(body.clientId);
    const collectionId = normalizeOptionalText(body.collectionId);
    const documentType = normalizeOptionalText(body.documentType)?.toLowerCase() ?? null;
    const visibility = normalizeOptionalText(body.visibility)?.toLowerCase() ?? null;
    const publicUrl = normalizeOptionalText(body.publicUrl);
    const versionLabel = normalizeOptionalText(body.versionLabel);
    const mimeType = normalizeOptionalText(body.mimeType);
    const fileSizeBytes = normalizeNumber(body.fileSizeBytes);

    if (documentType && !DOCUMENT_TYPES.has(documentType)) {
      return Response.json({ error: "Invalid document type." }, { status: 400 });
    }

    if (visibility && !VISIBILITIES.has(visibility)) {
      return Response.json({ error: "Invalid document visibility." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) updates.title = title;
    if (body.fileName !== undefined) updates.file_name = fileName;
    if (body.clientId !== undefined) updates.client_id = clientId;
    if (body.collectionId !== undefined) updates.collection_id = collectionId;
    if (body.documentType !== undefined) updates.document_type = documentType;
    if (body.visibility !== undefined) updates.visibility = visibility;
    if (body.publicUrl !== undefined) {
      updates.file_path = publicUrl;
      updates.public_url = publicUrl;
    }
    if (body.versionLabel !== undefined) updates.version_label = versionLabel;
    if (body.mimeType !== undefined) updates.mime_type = mimeType;
    if (body.fileSizeBytes !== undefined) updates.file_size_bytes = fileSizeBytes;

    const { data: document, error } = await supabase
      .from("documents")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !document) {
      throw new Error(error?.message ?? "Unable to update the document.");
    }

    await supabase.from("document_access_rules").delete().eq("document_id", id);

    if (document.client_id && document.visibility !== "admin_only") {
      await supabase.from("document_access_rules").insert([
        {
          access_scope: "client",
          can_download: true,
          can_view: true,
          client_id: document.client_id,
          document_id: document.id,
        },
      ]);

      await notifyClientWorkspace({
        clientId: document.client_id,
        message: `${document.title} has been updated in your workspace.`,
        supabase,
        title: "Document updated",
      });
    }

    await createAdminAuditEntry({
      actionType: "document_updated",
      entityId: document.id,
      entityTable: "documents",
      payload: {
        clientId: document.client_id,
        title: document.title,
        visibility: document.visibility,
      },
      summary: `Updated document ${document.title}.`,
    });

    return Response.json({ document });
  } catch (error) {
    return toResponseError(error, "Unable to update the document right now.");
  }
}

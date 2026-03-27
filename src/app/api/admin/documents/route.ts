import { createAdminAuditEntry, ensureAdminPortalContext, slugifyText } from "@/lib/portal-data";

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

function createCollectionSlug(title: string) {
  const base = slugifyText(title) || "collection";
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
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

export async function GET() {
  try {
    const { supabase } = await ensureAdminPortalContext();
    const [{ data: collections, error: collectionsError }, { data: documents }, { data: clients }] =
      await Promise.all([
        supabase.from("document_collections").select("*").order("updated_at", { ascending: false }),
        supabase.from("documents").select("*").order("updated_at", { ascending: false }),
        supabase.from("clients").select("id, name, slug, status").order("name", { ascending: true }),
      ]);

    if (collectionsError) {
      throw new Error(collectionsError.message);
    }

    return Response.json({
      clients: clients ?? [],
      collections: collections ?? [],
      documents: documents ?? [],
      stats: {
        collections: collections?.length ?? 0,
        documents: documents?.length ?? 0,
        shared: documents?.filter((item) => item.visibility === "shared").length ?? 0,
      },
    });
  } catch (error) {
    return toResponseError(error, "Unable to load documents right now.");
  }
}

export async function POST(request: Request) {
  try {
    const { account, supabase } = await ensureAdminPortalContext();
    const body = (await request.json()) as Record<string, unknown>;
    const kind = normalizeText(body.kind).toLowerCase();

    if (kind === "collection") {
      const title = normalizeText(body.title);
      const description = normalizeOptionalText(body.description);
      const visibility = normalizeText(body.visibility).toLowerCase() || "client";
      const clientId = normalizeOptionalText(body.clientId);

      if (!title) {
        return Response.json({ error: "Collection title is required." }, { status: 400 });
      }

      if (!VISIBILITIES.has(visibility)) {
        return Response.json({ error: "Invalid collection visibility." }, { status: 400 });
      }

      const { data: collection, error } = await supabase
        .from("document_collections")
        .insert([
          {
            client_id: clientId,
            description,
            slug: createCollectionSlug(title),
            title,
            visibility,
          },
        ])
        .select("*")
        .single();

      if (error || !collection) {
        throw new Error(error?.message ?? "Unable to create the collection.");
      }

      await createAdminAuditEntry({
        actionType: "document_collection_created",
        entityId: collection.id,
        entityTable: "document_collections",
        payload: {
          clientId,
          title,
          visibility,
        },
        summary: `Created document collection ${title}.`,
      });

      return Response.json({ collection }, { status: 201 });
    }

    if (kind !== "document") {
      return Response.json({ error: "Choose whether you are creating a collection or document." }, { status: 400 });
    }

    const title = normalizeText(body.title);
    const fileName = normalizeText(body.fileName) || `${slugifyText(title) || "document"}.pdf`;
    const clientId = normalizeOptionalText(body.clientId);
    const collectionId = normalizeOptionalText(body.collectionId);
    const documentType = normalizeText(body.documentType).toLowerCase() || "general";
    const visibility = normalizeText(body.visibility).toLowerCase() || "client";
    const publicUrl = normalizeOptionalText(body.publicUrl);
    const versionLabel = normalizeOptionalText(body.versionLabel);
    const mimeType = normalizeOptionalText(body.mimeType);
    const fileSizeBytes = normalizeNumber(body.fileSizeBytes);

    if (!title) {
      return Response.json({ error: "Document title is required." }, { status: 400 });
    }

    if (!DOCUMENT_TYPES.has(documentType)) {
      return Response.json({ error: "Invalid document type." }, { status: 400 });
    }

    if (!VISIBILITIES.has(visibility)) {
      return Response.json({ error: "Invalid document visibility." }, { status: 400 });
    }

    const { data: document, error } = await supabase
      .from("documents")
      .insert([
        {
          client_id: clientId,
          collection_id: collectionId,
          document_type: documentType,
          file_name: fileName,
          file_path: publicUrl,
          file_size_bytes: fileSizeBytes,
          is_latest: true,
          mime_type: mimeType,
          public_url: publicUrl,
          title,
          uploaded_by_admin_id: account.id,
          version_label: versionLabel,
          visibility,
        },
      ])
      .select("*")
      .single();

    if (error || !document) {
      throw new Error(error?.message ?? "Unable to create the document.");
    }

    if (clientId && visibility !== "admin_only") {
      await supabase.from("document_access_rules").insert([
        {
          access_scope: "client",
          can_download: true,
          can_view: true,
          client_id: clientId,
          document_id: document.id,
        },
      ]);

      await notifyClientWorkspace({
        clientId,
        message: `${title} has been added to your shared workspace.`,
        supabase,
        title: "New document available",
      });
    }

    await createAdminAuditEntry({
      actionType: "document_created",
      entityId: document.id,
      entityTable: "documents",
      payload: {
        clientId,
        documentType,
        title,
        visibility,
      },
      summary: `Published document ${title}.`,
    });

    return Response.json({ document }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to create the document right now.");
  }
}

import { ensureClientPortalContext } from "@/lib/portal-data";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

export async function GET() {
  try {
    const { account, client, supabase } = await ensureClientPortalContext();
    const [{ data: collections, error }, { data: documents }] = await Promise.all([
      supabase
        .from("document_collections")
        .select("*")
        .eq("client_id", client.id)
        .in("visibility", ["client", "shared"])
        .order("updated_at", { ascending: false }),
      supabase
        .from("documents")
        .select("*")
        .eq("client_id", client.id)
        .in("visibility", ["client", "shared"])
        .order("updated_at", { ascending: false }),
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return Response.json({
      collections: collections ?? [],
      documents: documents ?? [],
      stats: {
        collections: collections?.length ?? 0,
        documents: documents?.length ?? 0,
        latestVersionCount: documents?.filter((item) => item.is_latest).length ?? 0,
      },
      workspace: {
        accountId: account.id,
        clientId: client.id,
        clientName: client.name,
      },
    });
  } catch (error) {
    return toResponseError(error, "Unable to load documents right now.");
  }
}

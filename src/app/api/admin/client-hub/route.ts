import { requireAdminApiRequest } from "@/lib/admin-auth";
import { getClientHubContent, saveClientHubContent } from "@/lib/client-hub";
import { getSupabaseConfigError, isSupabaseConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  const authError = await requireAdminApiRequest();

  if (authError) {
    return authError;
  }

  const result = await getClientHubContent();

  return Response.json({
    configured: result.configured,
    content: result.content,
    error: result.error ?? (!result.configured ? getSupabaseConfigError() : undefined),
  });
}

export async function PATCH(request: Request) {
  const authError = await requireAdminApiRequest();

  if (authError) {
    return authError;
  }

  if (!isSupabaseConfigured()) {
    return Response.json({ error: getSupabaseConfigError() }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { content?: unknown };
    const content = await saveClientHubContent(body.content ?? body);
    return Response.json({ content });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to save the client hub content." },
      { status: 500 },
    );
  }
}

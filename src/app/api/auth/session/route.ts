import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };

    if (!body.accessToken || !body.refreshToken) {
      return Response.json({ error: "Access and refresh tokens are required." }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.setSession({
      access_token: body.accessToken,
      refresh_token: body.refreshToken,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to persist the portal session." },
      { status: 500 },
    );
  }
}

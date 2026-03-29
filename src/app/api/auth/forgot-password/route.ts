import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; redirectTo?: string };
    const email = normalizeEmail(body.email);

    if (!email || !email.includes("@")) {
      return Response.json({ error: "Enter a valid email address first." }, { status: 400 });
    }

    const requestUrl = new URL(request.url);
    const defaultRedirect = `${requestUrl.origin}/auth/callback?next=/reset-password`;
    const redirectTo =
      typeof body.redirectTo === "string" && body.redirectTo.startsWith("http")
        ? body.redirectTo
        : defaultRedirect;

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({
      message: "Password reset link sent. Check your inbox to continue.",
      ok: true,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to start password reset." },
      { status: 500 },
    );
  }
}

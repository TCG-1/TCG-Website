import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { newEmail?: string; redirectTo?: string };
    const newEmail = normalizeEmail(body.newEmail);

    if (!newEmail || !newEmail.includes("@")) {
      return Response.json({ error: "Enter a valid new email address." }, { status: 400 });
    }

    const requestUrl = new URL(request.url);
    const defaultRedirect = `${requestUrl.origin}/auth/callback?next=/client-hub/settings`;
    const redirectTo =
      typeof body.redirectTo === "string" && body.redirectTo.startsWith("http")
        ? body.redirectTo
        : defaultRedirect;

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      return Response.json({ error: "Your session expired. Sign in again and retry." }, { status: 401 });
    }

    if (user.email.toLowerCase() === newEmail) {
      return Response.json({ error: "That email is already on your account." }, { status: 400 });
    }

    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      {
        emailRedirectTo: redirectTo,
      },
    );

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({
      message: "Confirmation email sent. Open the link in your inbox to complete the email change.",
      ok: true,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to start email change." },
      { status: 500 },
    );
  }
}

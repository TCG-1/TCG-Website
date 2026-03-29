import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { confirmPassword?: string; newPassword?: string };
    const newPassword = normalizeText(body.newPassword);
    const confirmPassword = normalizeText(body.confirmPassword);

    if (!newPassword || newPassword.length < 10) {
      return Response.json({ error: "Use a stronger password with at least 10 characters." }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return Response.json({ error: "New password and confirmation must match." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return Response.json({ error: "Your reset session is no longer valid. Request a new reset link." }, { status: 401 });
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({
      message: "Password updated successfully. You can now sign in with your new password.",
      ok: true,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to update your password." },
      { status: 500 },
    );
  }
}

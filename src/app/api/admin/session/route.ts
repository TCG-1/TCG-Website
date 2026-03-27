import { clearAdminSession, createAdminSession, validateAdminCredentials } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const result = validateAdminCredentials(body.email ?? "", body.password ?? "");

    if (!result.ok) {
      return Response.json({ error: result.message }, { status: result.status });
    }

    const user = await createAdminSession();
    return Response.json({
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch {
    return Response.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}

export async function DELETE() {
  await clearAdminSession();
  return Response.json({ ok: true });
}

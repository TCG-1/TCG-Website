import {
  clearAdminSession,
  createAdminSession,
  getAdminUser,
  validateAdminCredentials,
} from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const result = validateAdminCredentials(body.email ?? "", body.password ?? "");

    if (!result.ok) {
      return Response.json({ error: result.message }, { status: result.status });
    }

    const user = await createAdminSession();

    const supabase = createSupabaseAdminClient();

    if (supabase) {
      const { data: account } = await supabase
        .from("admin_accounts")
        .upsert(
          {
            email: user.email,
            full_name: user.name,
            last_signed_in_at: new Date().toISOString(),
            status: "active",
          },
          {
            onConflict: "email",
          },
        )
        .select("id")
        .single();

      if (account) {
        await supabase.from("account_security_events").insert([
          {
            account_scope: "admin",
            admin_account_id: account.id,
            event_type: "login_success",
            metadata: {
              source: "admin_session_api",
            },
          },
        ]);
      }
    }

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
  const auth = await getAdminUser();
  const supabase = createSupabaseAdminClient();

  if (auth.configured && auth.user && supabase) {
    const { data: account } = await supabase
      .from("admin_accounts")
      .select("id")
      .eq("email", auth.user.email)
      .maybeSingle();

    if (account) {
      await supabase.from("account_security_events").insert([
        {
          account_scope: "admin",
          admin_account_id: account.id,
          event_type: "logout",
          metadata: {
            source: "admin_session_api",
          },
        },
      ]);
    }
  }

  await clearAdminSession();

  const portalSupabase = await createClient();
  await portalSupabase.auth.signOut();

  return Response.json({ ok: true });
}

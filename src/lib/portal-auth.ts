import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { isAdminEmail } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
export { getPortalUserDisplayName } from "@/lib/portal-user";

export async function getPortalUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requirePortalUser() {
  const user = await getPortalUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (isAdminEmail(user.email)) {
    redirect("/admin");
  }

  const supabase = createSupabaseAdminClient();
  if (supabase && user.email) {
    const { data: account, error } = await supabase
      .from("client_accounts")
      .select("status")
      .eq("email", user.email)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (account && ["archived", "inactive", "revoked"].includes(account.status)) {
      redirect("/sign-in?error=account-inactive");
    }
  }

  return user;
}

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

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

  return user;
}

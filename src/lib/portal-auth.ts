import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export function getPortalUserDisplayName(user: User) {
  const metadataName =
    typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : typeof user.user_metadata?.name === "string" && user.user_metadata.name.trim()
        ? user.user_metadata.name.trim()
        : "";

  if (metadataName) {
    return metadataName;
  }

  if (user.email) {
    const [localPart] = user.email.split("@");
    return localPart
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  return "Client";
}

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

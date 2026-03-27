import type { User } from "@supabase/supabase-js";

type PortalUserLike = Pick<User, "email" | "user_metadata">;

export function getPortalUserDisplayName(user: PortalUserLike) {
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

export function getPortalUserInitials(user: PortalUserLike) {
  const name = getPortalUserDisplayName(user);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "TC";
}

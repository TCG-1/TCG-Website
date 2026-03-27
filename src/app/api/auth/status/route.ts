import { getAdminUser } from "@/lib/admin-auth";
import { getPortalUser } from "@/lib/portal-auth";
import { getPortalUserDisplayName, getPortalUserInitials } from "@/lib/portal-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getInitialsFromIdentity(name: string, email?: string | null) {
  const source = name.trim() || email?.trim() || "Tacklers";

  return (
    source
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "TC"
  );
}

export async function GET() {
  const [portalUser, adminAuth] = await Promise.all([getPortalUser(), getAdminUser()]);

  return Response.json(
    {
      adminUser: adminAuth.user
        ? {
            email: adminAuth.user.email,
            initials: getInitialsFromIdentity(adminAuth.user.name, adminAuth.user.email),
            name: adminAuth.user.name,
          }
        : null,
      portalUser: portalUser
        ? {
            email: portalUser.email ?? "",
            initials: getPortalUserInitials(portalUser),
            name: getPortalUserDisplayName(portalUser),
          }
        : null,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}

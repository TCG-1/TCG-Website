import { ClientHubView } from "@/components/client-hub/client-hub-view";
import { getClientHubContent } from "@/lib/client-hub";
import { getPortalUserDisplayName, requirePortalUser } from "@/lib/portal-auth";

export default async function ClientHubPage() {
  const [user, { content }] = await Promise.all([requirePortalUser(), getClientHubContent()]);

  return (
    <ClientHubView
      content={{
        ...content,
        meta: {
          ...content.meta,
          greetingName: getPortalUserDisplayName(user),
        },
      }}
    />
  );
}

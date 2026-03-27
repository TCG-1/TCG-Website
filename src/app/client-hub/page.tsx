import { ClientHubView } from "@/components/client-hub/client-hub-view";
import { getClientTrainingWorkspace } from "@/lib/training-system";

export default async function ClientHubPage() {
  const workspace = await getClientTrainingWorkspace();

  return <ClientHubView workspace={workspace} />;
}

import { Manrope, Plus_Jakarta_Sans } from "next/font/google";

import { ClientHubView } from "@/components/client-hub/client-hub-view";
import { getClientHubContent } from "@/lib/client-hub";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-client-headline",
  weight: ["300", "500", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-client-body",
  weight: ["400", "600", "700"],
});

export async function generateMetadata() {
  const { content } = await getClientHubContent();

  return {
    title: content.meta.pageTitle,
    description:
      "Client dashboard for programmes, mentoring schedules, knowledge resources, and transformation progress.",
  };
}

export default async function ClientHubPage() {
  const { content } = await getClientHubContent();

  return (
    <div className={`${plusJakartaSans.variable} ${manrope.variable}`}>
      <ClientHubView content={content} />
    </div>
  );
}

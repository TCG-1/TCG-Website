import type { Metadata } from "next";

import { NewsletterSubscriptionClient } from "@/components/newsletter-subscription-client";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = createPageMetadata({
  description: "Manage your Tacklers Consulting Group newsletter subscription preferences.",
  noIndex: true,
  path: "/newsletter/subscription",
  title: "Newsletter Preferences | Tacklers",
});

type SubscriptionPageProps = {
  searchParams: Promise<{
    action?: string | string[];
    token?: string | string[];
  }>;
};

function readParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function NewsletterSubscriptionPage({ searchParams }: SubscriptionPageProps) {
  const params = await searchParams;
  const token = readParam(params.token).trim();
  const actionParam = readParam(params.action).trim();
  const initialAction = actionParam === "subscribe" ? "subscribe" : "unsubscribe";

  return <NewsletterSubscriptionClient token={token} initialAction={initialAction} />;
}

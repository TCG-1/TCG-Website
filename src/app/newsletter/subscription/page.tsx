import { NewsletterSubscriptionClient } from "@/components/newsletter-subscription-client";

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

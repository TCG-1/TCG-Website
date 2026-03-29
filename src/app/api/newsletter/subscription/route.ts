import { readNewsletterSubscriptionToken, updateNewsletterSubscription } from "@/lib/newsletter-subscription";

export const runtime = "nodejs";

function normalizeAction(value: string | null) {
  if (value === "subscribe" || value === "unsubscribe") {
    return value;
  }

  return null;
}

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

async function handleRequest(request: Request) {
  const url = new URL(request.url);
  const token = (url.searchParams.get("token") ?? "").trim();
  const action = normalizeAction(url.searchParams.get("action"));

  if (!token) {
    return badRequest("Subscription token is missing.");
  }

  if (!action) {
    return badRequest("Subscription action is invalid.");
  }

  const email = readNewsletterSubscriptionToken(token);

  if (!email) {
    return badRequest("Subscription token is invalid.");
  }

  const result = await updateNewsletterSubscription({
    action,
    email,
    source: `newsletter-link:${action}`,
  });

  return Response.json({
    action,
    email: result.email,
    isSubscribed: result.isSubscribed,
    resubscribedAt: result.resubscribedAt,
    unsubscribedAt: result.unsubscribedAt,
  });
}

export async function GET(request: Request) {
  try {
    return await handleRequest(request);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unable to update newsletter subscription.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    return await handleRequest(request);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unable to update newsletter subscription.",
      },
      { status: 500 },
    );
  }
}

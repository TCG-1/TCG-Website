import { createHmac, timingSafeEqual } from "node:crypto";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function getSubscriptionSecret() {
  const secret =
    process.env.NEWSLETTER_SUBSCRIPTION_SECRET?.trim() ||
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    (process.env.NODE_ENV !== "production" ? "local-dev-newsletter-subscription-secret" : "");

  if (!secret) {
    throw new Error("Newsletter subscription secret is missing.");
  }

  return secret;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(payload: string) {
  return createHmac("sha256", getSubscriptionSecret()).update(payload).digest("base64url");
}

export function createNewsletterSubscriptionToken(email: string) {
  const payload = Buffer.from(
    JSON.stringify({
      email: normalizeEmail(email),
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function readNewsletterSubscriptionToken(token: string) {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = sign(payload);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
    };

    if (typeof parsed.email !== "string") {
      return null;
    }

    const email = normalizeEmail(parsed.email);
    return email.includes("@") ? email : null;
  } catch {
    return null;
  }
}

export async function updateNewsletterSubscription({
  action,
  email,
  source,
}: {
  action: "subscribe" | "unsubscribe";
  email: string;
  source: string;
}) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const normalizedEmail = normalizeEmail(email);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("newsletter_subscriptions")
    .upsert(
      {
        email: normalizedEmail,
        is_subscribed: action === "subscribe",
        resubscribed_at: action === "subscribe" ? now : null,
        source,
        unsubscribed_at: action === "unsubscribe" ? now : null,
      },
      {
        onConflict: "email",
      },
    )
    .select("email, is_subscribed, unsubscribed_at, resubscribed_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to update newsletter subscription status.");
  }

  return {
    email: data.email as string,
    isSubscribed: Boolean(data.is_subscribed),
    resubscribedAt: (data.resubscribed_at as string | null) ?? null,
    unsubscribedAt: (data.unsubscribed_at as string | null) ?? null,
  };
}

export async function listUnsubscribedEmails(emails: string[]) {
  if (!emails.length) {
    return new Set<string>();
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const normalizedEmails = Array.from(new Set(emails.map((email) => normalizeEmail(email))));

  const { data, error } = await supabase
    .from("newsletter_subscriptions")
    .select("email")
    .eq("is_subscribed", false)
    .in("email", normalizedEmails);

  if (error) {
    throw new Error(error.message);
  }

  return new Set((data ?? []).map((row) => normalizeEmail(String(row.email ?? ""))));
}

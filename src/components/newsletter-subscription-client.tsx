"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { requestJson } from "@/components/portal/use-live-api";

type SubscriptionResponse = {
  action: "subscribe" | "unsubscribe";
  email: string;
  isSubscribed: boolean;
};

export function NewsletterSubscriptionClient({
  initialAction,
  token,
}: {
  initialAction: "subscribe" | "unsubscribe";
  token: string;
}) {
  const [action, setAction] = useState<"subscribe" | "unsubscribe">(initialAction);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [result, setResult] = useState<SubscriptionResponse | null>(null);
  const hasAutoApplied = useRef(false);

  const applySubscription = useCallback(async (nextAction: "subscribe" | "unsubscribe") => {
    if (!token) {
      setNotice("Subscription link is missing a token.");
      return;
    }

    setIsLoading(true);
    setNotice(null);

    try {
      const payload = await requestJson<SubscriptionResponse>(
        `/api/newsletter/subscription?token=${encodeURIComponent(token)}&action=${nextAction}`,
        {
          method: "POST",
        },
      );
      setResult(payload);
      setAction(nextAction);
      setNotice(
        payload.isSubscribed
          ? "You are subscribed again and will receive future newsletters."
          : "You have been unsubscribed and will no longer receive newsletters.",
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to update newsletter subscription.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token || hasAutoApplied.current) {
      return;
    }

    hasAutoApplied.current = true;
    void applySubscription(initialAction);
  }, [applySubscription, initialAction, token]);

  return (
    <main className="min-h-screen bg-[#f7f6f3] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8a0917]">Newsletter preferences</p>
        <h1 className="mt-3 text-3xl font-light tracking-[-0.04em] text-slate-950">Manage subscription</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Use this page to unsubscribe from future newsletter emails or subscribe again later.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              void applySubscription("unsubscribe");
            }}
            disabled={isLoading}
            className="rounded-full bg-[#8a0917] px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#6f0711] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && action === "unsubscribe" ? "Updating..." : "Unsubscribe"}
          </button>
          <button
            type="button"
            onClick={() => {
              void applySubscription("subscribe");
            }}
            disabled={isLoading}
            className="rounded-full border border-slate-200 px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-700 transition hover:border-[#8a0917]/30 hover:text-[#8a0917] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && action === "subscribe" ? "Updating..." : "Subscribe again"}
          </button>
        </div>

        {notice ? (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">{notice}</div>
        ) : null}

        {result ? (
          <div className="mt-4 text-sm text-slate-600">
            Status for <span className="font-semibold text-slate-900">{result.email}</span>: {result.isSubscribed ? "Subscribed" : "Unsubscribed"}
          </div>
        ) : null}

        <div className="mt-8 text-sm text-slate-500">
          Need help? <Link href="/contact" className="font-semibold text-[#8a0917]">Contact the team</Link>
        </div>
      </section>
    </main>
  );
}

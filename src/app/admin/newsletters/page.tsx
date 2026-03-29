"use client";

import { useState } from "react";

import { requestJson } from "@/components/portal/use-live-api";

type NewsletterResponse = {
  confirmationRecipients: string[];
  confirmationSent: boolean;
  failed: number;
  failedRecipients: string[];
  sent: number;
  totalLeads: number;
};

type Notice =
  | {
      message: string;
      tone: "error" | "success";
    }
  | null;

export default function AdminNewslettersPage() {
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [result, setResult] = useState<NewsletterResponse | null>(null);

  async function sendNewsletter() {
    const trimmedBody = body.trim();

    if (!trimmedBody) {
      setNotice({ message: "Please write the newsletter body before sending.", tone: "error" });
      return;
    }

    setIsSending(true);
    setNotice(null);
    setResult(null);

    try {
      const payload = await requestJson<NewsletterResponse>("/api/admin/newsletters", {
        body: JSON.stringify({ body: trimmedBody }),
        method: "POST",
      });

      setResult(payload);
      setNotice({
        message:
          payload.failed > 0
            ? `Newsletter completed: ${payload.sent}/${payload.totalLeads} delivered, ${payload.failed} failed. Confirmation sent.`
            : `Newsletter delivered to ${payload.sent} lead${payload.sent === 1 ? "" : "s"}. Confirmation sent.`,
        tone: "success",
      });
      setBody("");
    } catch (sendError) {
      setNotice({
        message: sendError instanceof Error ? sendError.message : "Unable to send newsletter right now.",
        tone: "error",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="max-w-4xl space-y-4">
        <p className="eyebrow">Newsletter dispatch</p>
        <h1 className="section-title">Send newsletter to all leads</h1>
        <p className="body-copy max-w-3xl">
          Write only the newsletter body. Each email automatically uses the existing branded email header and footer,
          plus a personalized greeting formatted as Dear [username].
        </p>
      </section>

      {notice ? (
        <div
          className={`rounded-2xl px-5 py-4 text-sm ${
            notice.tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      <section className="rounded-[1.5rem] border border-black/5 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
        <label htmlFor="newsletter-body" className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Newsletter body
        </label>
        <textarea
          id="newsletter-body"
          value={body}
          onChange={(event) => {
            setBody(event.target.value);
          }}
          placeholder="Write your newsletter content here..."
          className="mt-3 min-h-56 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none"
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              void sendNewsletter();
            }}
            disabled={isSending}
            className="rounded-full bg-[#8a0917] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#6f0711] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? "Sending one by one..." : "Send to all leads"}
          </button>
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">A completion email is sent to hello and Audrey.</p>
        </div>
      </section>

      {result?.failedRecipients.length ? (
        <section className="rounded-[1.5rem] border border-red-100 bg-red-50/70 p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-red-700">Failed recipients</h2>
          <ul className="mt-3 space-y-1 text-sm text-red-700">
            {result.failedRecipients.map((email) => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {result?.confirmationSent ? (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Confirmation recipients</h2>
          <ul className="mt-3 space-y-1 text-sm text-emerald-700">
            {result.confirmationRecipients.map((email) => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

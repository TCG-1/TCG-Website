"use client";

import { useState } from "react";

import { SubmissionSuccessModal } from "@/components/forms/submission-success-modal";
import { requestJson } from "@/components/portal/use-live-api";

type NewsletterSignupResponse = {
  email: string;
  emailSent: boolean;
  leadId: string | null;
  message: string;
};

type FormState = {
  companyName: string;
  email: string;
  fullName: string;
  website: string;
};

const INITIAL_FORM: FormState = {
  companyName: "",
  email: "",
  fullName: "",
  website: "",
};

type Notice = { message: string; tone: "error" | "success" } | null;

export function NewsletterSignupSection({ sourcePage }: { sourcePage: string }) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [successTitle, setSuccessTitle] = useState("Subscription confirmed");

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const payload = await requestJson<NewsletterSignupResponse>("/api/newsletter/subscribe", {
        body: JSON.stringify({
          companyName: form.companyName,
          email: form.email,
          fullName: form.fullName,
          sourcePage,
          website: form.website,
        }),
        method: "POST",
      });

      setSuccessTitle(payload.emailSent ? "Subscription confirmed" : "Subscription recorded");
      setSuccessMessage(payload.message);
      setForm(INITIAL_FORM);
      setNotice({
        message: payload.emailSent
          ? "Subscription confirmed. A welcome email is on its way."
          : "Subscription recorded. We could not send the confirmation email just yet.",
        tone: "success",
      });
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : "Unable to subscribe right now.",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="border-t border-black/5 bg-[linear-gradient(180deg,#fffaf6_0%,#fff3f4_100%)] py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-[#8a0917]/10 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
              <div className="max-w-3xl text-left">
                <p className="eyebrow">Newsletter</p>
                <h2 className="section-title mt-3">Subscribe to Tacklers insight</h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Receive concise updates on operational excellence, Lean transformation, and practical leadership habits that improve flow and sustain results.
                </p>
                <ul className="mt-5 space-y-3 text-sm text-slate-600">
                  {[
                    "Practical, executive-level insight",
                    "People-first transformation thinking",
                    "No noise, no fluff, unsubscribe anytime",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[#8a0917]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <form className="grid gap-4 border-t border-[#8a0917]/10 pt-8" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={form.website}
                  onChange={(event) => updateField("website", event.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Full name
                    <input
                      className="input"
                      type="text"
                      value={form.fullName}
                      onChange={(event) => updateField("fullName", event.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Work email
                    <input
                      className="input"
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="you@company.com"
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Company
                    <input
                      className="input"
                      type="text"
                      value={form.companyName}
                      onChange={(event) => updateField("companyName", event.target.value)}
                      placeholder="Organisation name (optional)"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button-primary min-w-[220px] justify-center disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>

                {notice ? (
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm ${
                      notice.tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {notice.message}
                  </div>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </section>

      <SubmissionSuccessModal
        open={Boolean(successMessage)}
        title={successTitle}
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />
    </>
  );
}

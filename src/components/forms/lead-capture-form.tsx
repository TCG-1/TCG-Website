"use client";

import { useMemo, useState } from "react";

import { SubmissionSuccessModal } from "@/components/forms/submission-success-modal";
import { requestJson } from "@/components/portal/use-live-api";

type FormVariant = "discovery_call" | "lean_training" | "on_site_assessment" | "general_contact";

type LeadCaptureFormProps = {
  className?: string;
  ctaLabel?: string;
  id?: string;
  intro?: string;
  title: string;
  variant: FormVariant;
};

type Notice = { message: string; tone: "error" | "success" } | null;

type FormState = {
  audienceType: string;
  biggestChallenge: string;
  companyName: string;
  deliveryPreference: string;
  email: string;
  fullName: string;
  headcountRange: string;
  message: string;
  operationType: string;
  phone: string;
  preferredContactMethod: string;
  preferredTimeline: string;
  roleTitle: string;
  serviceInterest: string;
  siteLocation: string;
  teamSize: string;
  trainingGoal: string;
  urgency: string;
  website: string;
};

const INITIAL_STATE: FormState = {
  audienceType: "",
  biggestChallenge: "",
  companyName: "",
  deliveryPreference: "",
  email: "",
  fullName: "",
  headcountRange: "",
  message: "",
  operationType: "",
  phone: "",
  preferredContactMethod: "email",
  preferredTimeline: "",
  roleTitle: "",
  serviceInterest: "",
  siteLocation: "",
  teamSize: "",
  trainingGoal: "",
  urgency: "",
  website: "",
};

function getVariantCopy(variant: FormVariant) {
  switch (variant) {
    case "discovery_call":
      return {
        intro: "Tell us where work is getting stuck and what you need from a first conversation.",
        ctaLabel: "Request discovery call",
      };
    case "lean_training":
      return {
        intro: "Share who the training is for, what capability is missing, and how you want it delivered.",
        ctaLabel: "Request training conversation",
      };
    case "on_site_assessment":
      return {
        intro: "Give us enough operational context to scope the site visit properly before we contact you.",
        ctaLabel: "Request assessment",
      };
    default:
      return {
        intro: "Share a few useful details and we will come back with the right next step.",
        ctaLabel: "Submit enquiry",
      };
  }
}

export function LeadCaptureForm({ className = "", ctaLabel, id, intro, title, variant }: LeadCaptureFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [notice, setNotice] = useState<Notice>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const copy = useMemo(() => getVariantCopy(variant), [variant]);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const detailFields =
        variant === "discovery_call"
          ? {
              biggestChallenge: form.biggestChallenge,
              preferredTimeline: form.preferredTimeline,
              teamSize: form.teamSize,
            }
          : variant === "lean_training"
            ? {
                audienceType: form.audienceType,
                deliveryPreference: form.deliveryPreference,
                preferredTimeline: form.preferredTimeline,
                teamSize: form.teamSize,
                trainingGoal: form.trainingGoal,
              }
            : variant === "on_site_assessment"
              ? {
                  headcountRange: form.headcountRange,
                  operationType: form.operationType,
                  siteLocation: form.siteLocation,
                  urgency: form.urgency,
                }
              : {
                  serviceInterest: form.serviceInterest,
                };

      const payload = await requestJson<{ message: string }>("/api/forms/lead", {
        body: JSON.stringify({
          companyName: form.companyName,
          detailFields,
          email: form.email,
          fullName: form.fullName,
          kind: variant,
          message: form.message,
          phone: form.phone,
          preferredContactMethod: form.preferredContactMethod,
          roleTitle: form.roleTitle,
          website: form.website,
        }),
        method: "POST",
      });

      setSuccessMessage(payload.message);
      setForm(INITIAL_STATE);
    } catch (submitError) {
      setNotice({
        message: submitError instanceof Error ? submitError.message : "Unable to send your request right now.",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form id={id} className={`card grid gap-5 ${className}`.trim()} onSubmit={handleSubmit}>
        <div>
          <h3 className="text-2xl font-bold text-[#8a0917]">{title}</h3>
          <p className="mt-2 text-slate-700">{intro ?? copy.intro}</p>
        </div>

      <input
        type="text"
        value={form.website}
        onChange={(event) => updateField("website", event.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-5 md:grid-cols-2">
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

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Company
          <input
            className="input"
            type="text"
            value={form.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
            placeholder="Organisation name"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Role
          <input
            className="input"
            type="text"
            value={form.roleTitle}
            onChange={(event) => updateField("roleTitle", event.target.value)}
            placeholder="Your role title"
            required
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Phone number
          <input
            className="input"
            type="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+44 ..."
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Preferred contact method
          <select
            className="input"
            value={form.preferredContactMethod}
            onChange={(event) => updateField("preferredContactMethod", event.target.value)}
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </label>
      </div>

      {variant === "discovery_call" ? (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Biggest challenge
              <input
                className="input"
                type="text"
                value={form.biggestChallenge}
                onChange={(event) => updateField("biggestChallenge", event.target.value)}
                placeholder="Bottlenecks, quality issues, delivery pressure..."
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Team size involved
              <select
                className="input"
                value={form.teamSize}
                onChange={(event) => updateField("teamSize", event.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="1-10">1-10 people</option>
                <option value="11-50">11-50 people</option>
                <option value="51-200">51-200 people</option>
                <option value="200+">200+ people</option>
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Preferred timeline
            <select
              className="input"
              value={form.preferredTimeline}
              onChange={(event) => updateField("preferredTimeline", event.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="As soon as possible">As soon as possible</option>
              <option value="Within 30 days">Within 30 days</option>
              <option value="This quarter">This quarter</option>
              <option value="Exploring options">Exploring options</option>
            </select>
          </label>
        </>
      ) : null}

      {variant === "lean_training" ? (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Audience
              <select
                className="input"
                value={form.audienceType}
                onChange={(event) => updateField("audienceType", event.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="Front-line team">Front-line team</option>
                <option value="Team leaders and managers">Team leaders and managers</option>
                <option value="Cross-functional leadership">Cross-functional leadership</option>
                <option value="Executive team">Executive team</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Team size
              <select
                className="input"
                value={form.teamSize}
                onChange={(event) => updateField("teamSize", event.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="1-12">1-12 attendees</option>
                <option value="13-30">13-30 attendees</option>
                <option value="31-75">31-75 attendees</option>
                <option value="75+">75+ attendees</option>
              </select>
            </label>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Delivery preference
              <select
                className="input"
                value={form.deliveryPreference}
                onChange={(event) => updateField("deliveryPreference", event.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="On-site">On-site</option>
                <option value="Virtual">Virtual</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Preferred timeline
              <select
                className="input"
                value={form.preferredTimeline}
                onChange={(event) => updateField("preferredTimeline", event.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="This month">This month</option>
                <option value="Next 60 days">Next 60 days</option>
                <option value="This quarter">This quarter</option>
                <option value="Planning for later">Planning for later</option>
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Main training outcome
            <input
              className="input"
              type="text"
              value={form.trainingGoal}
              onChange={(event) => updateField("trainingGoal", event.target.value)}
              placeholder="What should people be able to do afterwards?"
              required
            />
          </label>
        </>
      ) : null}

      {variant === "on_site_assessment" ? (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Site location
              <input
                className="input"
                type="text"
                value={form.siteLocation}
                onChange={(event) => updateField("siteLocation", event.target.value)}
                placeholder="City or operational site"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Operation type
              <input
                className="input"
                type="text"
                value={form.operationType}
                onChange={(event) => updateField("operationType", event.target.value)}
                placeholder="Manufacturing, healthcare, logistics..."
                required
              />
            </label>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Headcount range
              <select
                className="input"
                value={form.headcountRange}
                onChange={(event) => updateField("headcountRange", event.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="Under 50">Under 50</option>
                <option value="50-150">50-150</option>
                <option value="151-500">151-500</option>
                <option value="500+">500+</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Urgency
              <select
                className="input"
                value={form.urgency}
                onChange={(event) => updateField("urgency", event.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="Immediate">Immediate</option>
                <option value="Within 30 days">Within 30 days</option>
                <option value="This quarter">This quarter</option>
                <option value="Future planning">Future planning</option>
              </select>
            </label>
          </div>
        </>
      ) : null}

      {variant === "general_contact" ? (
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Service interest
          <select
            className="input"
            value={form.serviceInterest}
            onChange={(event) => updateField("serviceInterest", event.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Discovery call">Discovery call</option>
            <option value="Lean training">Lean training</option>
            <option value="On-site assessment">On-site assessment</option>
            <option value="Operational excellence support">Operational excellence support</option>
            <option value="General enquiry">General enquiry</option>
          </select>
        </label>
      ) : null}

      <label className="grid gap-2 text-sm font-medium text-slate-700">
        {variant === "general_contact" ? "Your message" : "Useful context"}
        <textarea
          className="input min-h-36 resize-y"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder={
            variant === "general_contact"
              ? "Tell us what you are trying to improve, what matters now, and what kind of help you are looking for."
              : "Share enough context for us to qualify the request properly before we contact you."
          }
          required
        />
      </label>

        {notice ? (
          <div className="rounded-2xl bg-[#fff4f6] px-4 py-3 text-sm font-medium text-[#8a0917]">
            {notice.message}
          </div>
        ) : null}

        <button type="submit" className="button-primary w-full justify-center" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : ctaLabel ?? copy.ctaLabel}
        </button>
      </form>

      <SubmissionSuccessModal
        open={Boolean(successMessage)}
        title="Thanks, we have it"
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />
    </>
  );
}

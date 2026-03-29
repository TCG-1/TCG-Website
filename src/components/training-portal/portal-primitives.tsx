import type { ReactNode } from "react";

import type { TrainingTone } from "@/lib/training-portal";

function toneClassName(tone?: TrainingTone) {
  switch (tone) {
    case "good":
      return "bg-emerald-50 text-emerald-700";
    case "warning":
      return "bg-amber-100 text-amber-700";
    case "risk":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function PortalIntro({
  description,
  eyebrow,
  title,
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="max-w-4xl">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a0917]">{eyebrow}</p>
      <h1 className="mt-4 text-[clamp(2.6rem,6vw,4.6rem)] font-light leading-[1.02] tracking-[-0.05em] text-slate-950">
        {title}
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
    </section>
  );
}

export function PortalMetricGrid({
  items,
}: {
  items: Array<{ detail: string; label: string; tone?: TrainingTone; value: string }>;
}) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-[1.75rem] border border-black/5 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${toneClassName(item.tone)}`}>
              {item.tone ?? "live"}
            </span>
          </div>
          <p className="mt-5 text-4xl font-bold tracking-tight text-slate-950">{item.value}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
        </article>
      ))}
    </section>
  );
}

export function PortalPanel({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="rounded-[1.75rem] border border-[#e6dbd6] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf9_100%)] p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-[1.45rem] font-semibold leading-tight tracking-[-0.02em] text-slate-950">{title}</h2>
        {description ? <p className="max-w-3xl text-[0.97rem] leading-7 text-slate-600">{description}</p> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function PortalWorkflow({
  items,
}: {
  items: Array<{ description: string; label: string }>;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {items.map((item, index) => (
        <article
          key={item.label}
          className="rounded-[1.5rem] border border-[#eadfda] bg-[#faf7f4] p-5"
        >
          <div className="inline-flex rounded-full bg-[#8a0917] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
            Step {index + 1}
          </div>
          <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">{item.label}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
        </article>
      ))}
    </div>
  );
}

export function PortalList({
  items,
}: {
  items: Array<{ meta: string; note: string; status?: string; title: string }>;
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={`${item.title}-${item.meta}`}
          className="rounded-[1.4rem] border border-[#ece1dc] bg-[#faf7f5] p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">{item.title}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8a0917]">{item.meta}</p>
            </div>
            {item.status ? (
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${toneClassName(
                item.status.toLowerCase().includes("risk") || item.status.toLowerCase().includes("gap")
                  ? "risk"
                  : item.status.toLowerCase().includes("ready") ||
                      item.status.toLowerCase().includes("published") ||
                      item.status.toLowerCase().includes("passed")
                    ? "good"
                    : item.status.toLowerCase().includes("review") ||
                        item.status.toLowerCase().includes("queue") ||
                        item.status.toLowerCase().includes("required")
                      ? "warning"
                      : "neutral",
              )}`}>
                {item.status}
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>
        </article>
      ))}
    </div>
  );
}

export function PortalKeyline({
  items,
}: {
  items: Array<{ label: string; note: string; value: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-[1.5rem] border border-[#ece1dc] bg-[#faf7f5] p-5"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
          <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{item.value}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>
        </article>
      ))}
    </div>
  );
}

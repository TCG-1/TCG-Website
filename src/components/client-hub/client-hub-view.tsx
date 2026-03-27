import Link from "next/link";

import { DashboardIcon } from "@/components/client-hub/dashboard-icon";
import type { ClientHubContent, ClientHubTone } from "@/lib/client-hub";

function toneClassName(tone?: ClientHubTone) {
  if (tone === "success") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (tone === "accent") {
    return "bg-amber-100/80 text-amber-700";
  }

  return "bg-slate-100 text-slate-500";
}

export function ClientHubView({ content }: { content: ClientHubContent }) {
  const activeStageIndex = content.programme.stages.findIndex((stage) => stage.state === "active");
  const fallbackProgressIndex =
    content.programme.stages.filter((stage) => stage.state === "complete").length - 1;
  const progressIndex = activeStageIndex >= 0 ? activeStageIndex : Math.max(fallbackProgressIndex, 0);
  const progressWidth =
    content.programme.stages.length > 1
      ? `${(progressIndex / (content.programme.stages.length - 1)) * 100}%`
      : "0%";

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-12">
      <section id="programme-overview" className="mb-16">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#8e6200]">
          {content.meta.greetingLabel}
        </p>
        <h1 className="mt-3 text-4xl font-light leading-tight text-transparent [background:linear-gradient(135deg,#62000b_0%,#8a0917_100%)] bg-clip-text [font-family:var(--font-client-headline)] sm:text-5xl lg:text-6xl">
          Welcome back, {content.meta.greetingName}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{content.meta.greetingBody}</p>
      </section>

      <section id="progress-tracking" className="mb-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {content.metrics.map((metric) => (
          <div
            key={`${metric.label}-${metric.value}`}
            className="rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(31,29,29,0.08)]"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="rounded-2xl bg-[#fff4f4] p-3 text-[#7d0b16]">
                <DashboardIcon name={metric.icon} className="h-5 w-5" />
              </div>
              {metric.badgeText ? (
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${toneClassName(metric.badgeTone)}`}
                >
                  {metric.badgeText}
                </span>
              ) : null}
            </div>
            <p className="text-3xl font-extrabold text-[#2b2929] [font-family:var(--font-client-headline)]">
              {metric.value}
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              {metric.label}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-8">
          <section className="overflow-hidden rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(31,29,29,0.05)] sm:p-10">
            <div className="absolute" />
            <div className="flex flex-col gap-6 border-b border-[#f0e7e3] pb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
                  {content.programme.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500">{content.programme.subtitle}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-5xl font-light text-[#7d0b16] [font-family:var(--font-client-headline)]">
                  {content.programme.completionPercentage}%
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  {content.programme.completionLabel}
                </p>
              </div>
            </div>

            <div className="relative mt-10">
              <div className="absolute left-0 right-0 top-4 h-px bg-[#eee2dc]" />
              <div
                className="absolute left-0 top-4 h-px bg-[linear-gradient(135deg,#62000b_0%,#8a0917_100%)]"
                style={{ width: progressWidth }}
              />
              <div className="relative flex justify-between gap-4">
                {content.programme.stages.map((stage) => {
                  const isComplete = stage.state === "complete";
                  const isActive = stage.state === "active";

                  return (
                    <div key={stage.label} className="flex flex-col items-center">
                      <div
                        className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                          isComplete || isActive
                            ? "bg-[linear-gradient(135deg,#62000b_0%,#8a0917_100%)] text-white"
                            : "bg-[#ece5e1] text-slate-400"
                        }`}
                      >
                        {isComplete ? (
                          <DashboardIcon name="check" className="h-4 w-4" />
                        ) : isActive ? (
                          <DashboardIcon name="play" className="h-4 w-4" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-current" />
                        )}
                      </div>
                      <p
                        className={`mt-3 text-[10px] font-bold uppercase tracking-[0.22em] ${
                          isActive ? "text-[#7d0b16]" : isComplete ? "text-[#2b2929]" : "text-slate-400"
                        }`}
                      >
                        {stage.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-6 border-t border-[#f0e7e3] pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex -space-x-3">
                {content.programme.collaborators.map((member) => (
                  <div
                    key={member.name}
                    className="h-11 w-11 overflow-hidden rounded-full border-4 border-white bg-[#f4f1ee]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.imageUrl} alt={member.alt} className="h-full w-full object-cover" />
                  </div>
                ))}
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-[#f4f1ee] text-[11px] font-bold text-slate-500">
                  {content.programme.extraCollaboratorLabel}
                </div>
              </div>

              <button className="inline-flex items-center gap-2 text-sm font-bold text-[#8e6200] transition hover:gap-3">
                {content.programme.ctaLabel}
                <DashboardIcon name="arrow" className="h-4 w-4" />
              </button>
            </div>
          </section>

          <section id="resource-library">
            <h3 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              {content.library.heading}
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {content.library.resources.map((resource) => (
                <a
                  key={`${resource.title}-${resource.meta}`}
                  href={resource.href}
                  className="group flex items-center gap-5 rounded-3xl bg-[#efebe8] p-6 transition hover:bg-[#e6ddd8]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#7d0b16] shadow-sm">
                    <DashboardIcon name={resource.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2b2929]">{resource.title}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      {resource.meta}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 rounded-[2rem] bg-white p-3 shadow-[0_20px_60px_rgba(31,29,29,0.05)]">
              <div className="flex flex-col gap-6 rounded-[1.5rem] p-4 sm:flex-row sm:items-center sm:gap-8">
                <div className="h-24 overflow-hidden rounded-2xl sm:w-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={content.library.featured.imageUrl}
                    alt={content.library.featured.imageAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="inline-flex rounded-full bg-[#fff2c4] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#7d5d00]">
                    {content.library.featured.badge}
                  </span>
                  <p className="mt-3 text-xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
                    {content.library.featured.title}
                  </p>
                </div>
                <a
                  href={content.library.featured.href}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#eaded9] text-[#2b2929] transition hover:border-[#7d0b16] hover:bg-[#7d0b16] hover:text-white"
                >
                  <DashboardIcon name="arrow" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-8 lg:col-span-4">
          <section id="mentoring-schedule" className="rounded-[2rem] bg-[#ece7e3] p-8">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
                {content.calendar.heading}
              </h3>
              <DashboardIcon name="calendar" className="h-6 w-6 text-slate-400" />
            </div>

            <div className="space-y-5">
              {content.calendar.sessions.map((session) => (
                <div key={`${session.day}-${session.title}`} className="flex gap-4">
                  <div className="flex min-w-12 flex-col items-center">
                    <span className={`text-xl font-bold ${session.highlighted ? "text-[#7d0b16]" : "text-slate-500"}`}>
                      {session.day}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                      {session.month}
                    </span>
                  </div>
                  <div
                    className={`flex-1 rounded-2xl p-4 ${
                      session.highlighted ? "border-l-4 border-amber-400 bg-white" : "bg-white/65"
                    }`}
                  >
                    <p className="text-sm font-bold text-[#2b2929]">{session.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <DashboardIcon
                          name={session.mode.toLowerCase().includes("virtual") ? "video" : "calendar"}
                          className="h-3.5 w-3.5"
                        />
                        {session.time}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <DashboardIcon
                          name={session.mode.toLowerCase().includes("virtual") ? "video" : "location"}
                          className="h-3.5 w-3.5"
                        />
                        {session.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 w-full rounded-2xl border-2 border-[#ded3ce] px-4 py-4 text-xs font-bold uppercase tracking-[0.26em] text-[#2b2929] transition hover:border-[#7d0b16] hover:text-[#7d0b16]">
              {content.calendar.ctaLabel}
            </button>
          </section>

          <section className="rounded-[2rem] bg-[linear-gradient(135deg,#62000b_0%,#8a0917_100%)] p-8 text-white shadow-[0_24px_80px_rgba(98,0,11,0.24)]">
            <DashboardIcon name="insight" className="h-6 w-6 text-amber-300" />
            <h3 className="mt-5 text-2xl font-bold [font-family:var(--font-client-headline)]">
              {content.insight.title}
            </h3>
            <p className="mt-4 leading-8 text-white/85">{content.insight.body}</p>
            <button className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-amber-300 underline underline-offset-8">
              {content.insight.ctaLabel}
            </button>
          </section>
        </aside>
      </div>

      <section
        id="help-centre"
        className="mt-12 rounded-[2rem] border border-[#ece1dc] bg-white p-8 shadow-[0_20px_60px_rgba(31,29,29,0.05)]"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8e6200]">Help Centre</p>
            <h2 className="mt-3 text-3xl font-bold text-[#2b2929] [font-family:var(--font-client-headline)]">
              Extra portal tools for support, documents, and preferences
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Use the additional workspace areas to manage document access, raise support requests,
              review programme alerts, and keep your profile and notification preferences current.
            </p>
          </div>
          <Link
            href="/client-hub/support"
            className="inline-flex items-center justify-center rounded-full bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#6f0712]"
          >
            Contact support
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Link
            href="/client-hub/notifications"
            className="rounded-[1.5rem] border border-[#efe3de] bg-[#faf7f5] p-6 transition hover:-translate-y-1 hover:border-[#d6bab2] hover:shadow-[0_18px_40px_rgba(31,29,29,0.06)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#7d0b16] shadow-sm">
              <DashboardIcon name="bell" className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#2b2929]">Notifications</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Track new recommendations, session updates, and resource publishing activity.
            </p>
          </Link>

          <Link
            href="/client-hub/documents"
            className="rounded-[1.5rem] border border-[#efe3de] bg-[#faf7f5] p-6 transition hover:-translate-y-1 hover:border-[#d6bab2] hover:shadow-[0_18px_40px_rgba(31,29,29,0.06)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#7d0b16] shadow-sm">
              <DashboardIcon name="document" className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#2b2929]">Documents</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review shared files, working trackers, and programme governance packs in one place.
            </p>
          </Link>

          <Link
            href="/client-hub/settings"
            className="rounded-[1.5rem] border border-[#efe3de] bg-[#faf7f5] p-6 transition hover:-translate-y-1 hover:border-[#d6bab2] hover:shadow-[0_18px_40px_rgba(31,29,29,0.06)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#7d0b16] shadow-sm">
              <DashboardIcon name="shield" className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#2b2929]">Settings & Security</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Adjust alerts, workspace defaults, and password preferences for your programme team.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

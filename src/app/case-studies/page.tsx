import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import {
  Container,
  CtaBanner,
  PageHero,
  SectionHeader,
} from "@/components/sections";
import { caseStudies } from "@/lib/case-studies-data";
import { globalCta } from "@/lib/site-data";
import { createPageMetadata } from "@/lib/site-seo";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/structured-data";

const pageSeo = {
  description:
    "Real-world case studies showing how UK organisations have improved operational performance, reduced waste, and built sustainable Lean capability with Tacklers Consulting Group.",
  image: "/media/Productivity-Improvement-1d0b843c.jpeg",
  title: "Case Studies | Operational Excellence Results | Tacklers",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: pageSeo.description,
  image: pageSeo.image,
  keywords: [
    "lean consulting case studies",
    "operational excellence results",
    "lean transformation case study uk",
    "process improvement results",
  ],
  path: "/case-studies",
  title: pageSeo.title,
});

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: pageSeo.description,
            path: "/case-studies",
            title: pageSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Case Studies", path: "/case-studies" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Case studies"
        title="Real Results From Real Operations"
        body="Examples of how we have helped UK organisations improve operational performance, build capability, and sustain better ways of working."
        primary={globalCta.primary}
        secondary={globalCta.secondary}
        image={pageSeo.image}
      />

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Our track record"
            title="Selected case studies"
            body="Each engagement starts at Gemba, focuses on practical improvement, and transfers capability to your teams."
            center
          />
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="card-hover block rounded-[1.5rem] border border-[#8a0917]/10 bg-white p-8 text-left shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_18px_45px_rgba(138,9,23,0.10)]"
              >
                <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-[#8a0917]">
                  {study.sector}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{study.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{study.summary}</p>
                <ul className="mt-4 space-y-1">
                  {study.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#8a0917]" />
                      {outcome}
                    </li>
                  ))}
                </ul>
                <span className="mt-4 inline-block text-sm font-semibold text-[#8a0917]">
                  Read full case study →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <SectionHeader
              eyebrow="Confidentiality"
              title="A note on our case studies"
            />
            <p className="text-base leading-8 text-slate-700">
              We take client confidentiality seriously. The case studies above represent the type and
              scale of results we deliver across sectors, with details adjusted to protect client
              identity. If you would like to discuss specific examples relevant to your sector or
              challenge, we are happy to do so in confidence during a{" "}
              <Link href="/discovery-call" className="font-semibold text-[#8a0917] underline decoration-[#8a0917]/30 hover:decoration-[#8a0917]">
                discovery call
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      <CtaBanner {...globalCta} />
    </>
  );
}

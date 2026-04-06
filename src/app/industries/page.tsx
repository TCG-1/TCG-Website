import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import {
  CardGrid,
  Container,
  CtaBanner,
  PageHero,
  SectionHeader,
} from "@/components/sections";
import { globalCta } from "@/lib/site-data";
import { createPageMetadata } from "@/lib/site-seo";
import { industryPages } from "@/lib/landing-pages";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/structured-data";

const pageSeo = {
  description:
    "Sector-specific operational excellence consulting for UK organisations. We support Aerospace, Healthcare, Energy, Public Sector, IT Services, and Manufacturing teams with practical Lean improvement.",
  image: "/media/Productivity-Improvement-1d0b843c.jpeg",
  title: "Industry Sectors We Support | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: pageSeo.description,
  image: pageSeo.image,
  keywords: [
    "industry sectors operational excellence",
    "lean consulting by sector",
    "sector specific lean consulting uk",
    "operational improvement industries",
  ],
  path: "/industries",
  title: pageSeo.title,
});

export default function IndustriesPage() {
  const industryCards = industryPages.map((page) => ({
    title: page.h1.replace(/^(Operational excellence support for |Lean .+ for |Lean .+ support for |Operational improvement support for the )/, ""),
    body: page.overview,
    image: page.image,
    cta: "Learn more",
    href: `/industries/${page.slug}`,
  }));

  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: pageSeo.description,
            path: "/industries",
            title: pageSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Industries"
        title="Industries We Support"
        body="Practical Lean and operational excellence consulting tailored to the challenges of your sector. We bring direct experience across regulated, high-consequence, and complex delivery environments."
        primary={globalCta.primary}
        secondary={globalCta.secondary}
        image={pageSeo.image}
      />

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Sector expertise"
            title="Operational excellence across sectors"
            body="Every sector has its own pressures, constraints, and regulatory context. Our consulting adapts to what matters most in your environment."
            center
          />
          <CardGrid items={industryCards} columns={3} />
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl">
            <SectionHeader
              eyebrow="Our approach"
              title="How we adapt to your sector"
            />
            <div className="space-y-6 text-base leading-8 text-slate-700">
              <p>
                Lean principles are universal — but the way they are applied must respect the context
                of your sector. A manufacturing shop floor is not the same as a hospital ward. A
                defence programme is not the same as an IT service desk. The tools may overlap, but
                the approach, language, and pace of change need to be different.
              </p>
              <p>
                We bring direct sector experience across Aerospace and Defence, Healthcare, Energy,
                Public Sector, IT Services, and Manufacturing. This means we understand the
                regulatory frameworks, the operational pressures, and the cultural dynamics that shape
                how improvement work lands in your organisation.
              </p>
              <p>
                Our approach starts at Gemba — the place where work happens — and builds from there.
                We observe, listen, and co-design improvements with your teams. This ensures every
                recommendation is grounded in operational reality and owns by the people who will
                sustain it.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <CtaBanner {...globalCta} />
    </>
  );
}

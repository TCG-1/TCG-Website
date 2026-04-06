import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { Container, CtaBanner, PageHero } from "@/components/sections";
import {
  caseStudies,
  getAllCaseStudySlugs,
  getCaseStudyBySlug,
} from "@/lib/case-studies-data";
import { globalCta } from "@/lib/site-data";
import { createPageMetadata } from "@/lib/site-seo";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/structured-data";

/* ------------------------------------------------------------------ */
/*  Static params for build-time generation                            */
/* ------------------------------------------------------------------ */
export function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ */
/*  Dynamic metadata                                                   */
/* ------------------------------------------------------------------ */
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) return {};

  return createPageMetadata({
    description: cs.seoDescription,
    image: cs.cover,
    keywords: cs.keywords,
    path: `/case-studies/${cs.slug}`,
    title: cs.seoTitle,
  });
}

/* ------------------------------------------------------------------ */
/*  Render detail blocks — handles ## headings and paragraphs          */
/* ------------------------------------------------------------------ */
function DetailBlocks({ blocks }: { blocks: string[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="mt-12 mb-4 text-2xl font-bold text-slate-900"
            >
              {block.replace(/^## /, "")}
            </h2>
          );
        }
        return (
          <p key={i} className="mb-6 text-base leading-8 text-slate-700">
            {block}
          </p>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default async function CaseStudyDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  /* Find other case studies for "More case studies" section */
  const otherStudies = caseStudies.filter((s) => s.slug !== cs.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: cs.seoDescription,
            path: `/case-studies/${cs.slug}`,
            title: cs.seoTitle,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Case Studies", path: "/case-studies" },
            { name: cs.title, path: `/case-studies/${cs.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={cs.sector}
        title={cs.title}
        body={cs.summary}
        primary={globalCta.primary}
        secondary={globalCta.secondary}
        image={cs.cover}
      />

      {/* Key outcomes banner */}
      <section className="border-b border-slate-200 bg-slate-50 py-12">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-lg font-bold text-slate-900">
              Key outcomes
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {cs.outcomes.map((outcome) => (
                <span
                  key={outcome}
                  className="inline-flex items-center gap-2 rounded-full border border-[#8a0917]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#8a0917] shadow-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-[#8a0917]" />
                  {outcome}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Main narrative */}
      <section className="section-gap">
        <Container>
          <article className="prose-custom mx-auto max-w-3xl">
            <DetailBlocks blocks={cs.detail} />
          </article>
        </Container>
      </section>

      {/* Related services */}
      {cs.relatedServices.length > 0 && (
        <section className="section-gap bg-slate-50">
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-xl font-bold text-slate-900">
                Related services
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {cs.relatedServices.map((svc) => (
                  <Link
                    key={svc.href}
                    href={svc.href}
                    className="rounded-lg border border-[#8a0917]/10 bg-white px-5 py-3 text-sm font-semibold text-[#8a0917] shadow-sm transition-shadow hover:shadow-md"
                  >
                    {svc.label}
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* More case studies */}
      {otherStudies.length > 0 && (
        <section className="section-gap">
          <Container>
            <h2 className="mb-8 text-center text-xl font-bold text-slate-900">
              More case studies
            </h2>
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {otherStudies.map((study) => (
                <Link
                  key={study.slug}
                  href={`/case-studies/${study.slug}`}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="mb-1 inline-block text-xs font-semibold uppercase tracking-wider text-[#8a0917]">
                    {study.sector}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {study.title}
                  </h3>
                  <span className="mt-3 inline-block text-xs font-semibold text-[#8a0917]">
                    Read case study →
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBanner {...globalCta} />
    </>
  );
}

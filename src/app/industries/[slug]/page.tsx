import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container, CtaBanner, FaqList, PageHero, SectionHeader } from "@/components/sections";
import { JsonLd } from "@/components/seo/json-ld";
import { getIndustryPageBySlug, industryPages, getServiceDetailBySlugOrNull } from "@/lib/landing-pages";
import { globalCta } from "@/lib/site-data";
import { createPageMetadata } from "@/lib/site-seo";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

export const revalidate = 300;

export async function generateStaticParams() {
  return industryPages.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getIndustryPageBySlug(slug);

  if (!page) {
    return createPageMetadata({
      description: "The requested industry page could not be found.",
      noIndex: true,
      path: `/industries/${slug}`,
      title: "Industry page not found",
    });
  }

  return createPageMetadata({
    description: page.description,
    keywords: page.keywords,
    path: `/industries/${page.slug}`,
    title: page.title,
  });
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getIndustryPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const relatedPages = (page.relatedServices ?? [])
    .map((s) => getServiceDetailBySlugOrNull(s))
    .filter(Boolean);

  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: page.description,
            path: `/industries/${page.slug}`,
            title: page.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
            { name: page.h1, path: `/industries/${page.slug}` },
          ]),
          ...(page.faqs?.length ? [buildFaqJsonLd(page.faqs)] : []),
        ]}
      />

      <PageHero
        eyebrow="Industry focus"
        title={page.h1}
        body={page.overview}
        primary={{ label: "Book a discovery call", href: "/discovery-call" }}
        secondary={{ label: "Explore services", href: "/operational-excellence-consulting-uk" }}
        image={page.image}
      />

      {page.extendedOverview ? (
        <section className="section-gap bg-slate-50">
          <Container>
            <div className="mx-auto max-w-4xl">
              <p className="text-base leading-8 text-slate-700">{page.extendedOverview}</p>
            </div>
          </Container>
        </section>
      ) : null}

      <section className="section-gap">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="card">
              <SectionHeader
                eyebrow="Sector challenges"
                title="Common operational pressure points"
                body="We focus on issues that block flow, create avoidable risk, and reduce delivery reliability."
              />
              <ul className="mt-4 space-y-3 text-slate-700">
                {page.challenges.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#8a0917]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <SectionHeader
                eyebrow="Why Tacklers"
                title="What our support changes in practice"
                body="Our approach is designed for regulated and high-stakes environments where consistency and capability matter."
              />
              <ul className="mt-4 space-y-3 text-slate-700">
                {page.whyTacklers.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#FDD835]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {page.faqs?.length ? (
        <section className="section-gap bg-slate-50">
          <Container>
            <SectionHeader
              eyebrow="FAQs"
              title="Frequently asked questions"
              body="Common questions about operational improvement in this sector."
              center
            />
            <div className="mx-auto max-w-4xl">
              <FaqList items={page.faqs} />
            </div>
          </Container>
        </section>
      ) : null}

      {relatedPages.length > 0 ? (
        <section className="section-gap">
          <Container>
            <SectionHeader
              eyebrow="Related services"
              title="Services relevant to this sector"
              body="Practical support that addresses the operational challenges common in this industry."
              center
            />
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
              {relatedPages.map((related) => (
                <Link
                  key={related!.slug}
                  href={`/services/${related!.slug}`}
                  className="card group text-center transition-shadow hover:shadow-lg"
                >
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950 transition-colors group-hover:text-[#8a0917]">
                    {related!.h1}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{related!.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#8a0917]">
                    Learn more <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBanner
        eyebrow={globalCta.eyebrow}
        title={globalCta.title}
        body={globalCta.body}
        primary={globalCta.primary}
        secondary={globalCta.secondary}
      />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container, CtaBanner, FaqList, PageHero, SectionHeader, StepsGrid } from "@/components/sections";
import { JsonLd } from "@/components/seo/json-ld";
import { getServiceDetailBySlug, serviceDetailPages, getServiceDetailBySlugOrNull } from "@/lib/landing-pages";
import { globalCta } from "@/lib/site-data";
import { createPageMetadata } from "@/lib/site-seo";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildServiceJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

export const revalidate = 300;

export async function generateStaticParams() {
  return serviceDetailPages.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getServiceDetailBySlug(slug);

  if (!page) {
    return createPageMetadata({
      description: "The requested service page could not be found.",
      noIndex: true,
      path: `/services/${slug}`,
      title: "Service page not found",
    });
  }

  return createPageMetadata({
    description: page.description,
    image: page.image,
    keywords: page.keywords,
    path: `/services/${page.slug}`,
    title: page.title,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServiceDetailBySlug(slug);

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
            path: `/services/${page.slug}`,
            title: page.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/operational-excellence-consulting-uk" },
            { name: page.h1, path: `/services/${page.slug}` },
          ]),
          buildServiceJsonLd({
            description: page.description,
            name: page.h1,
            path: `/services/${page.slug}`,
          }),
          ...(page.faqs?.length ? [buildFaqJsonLd(page.faqs)] : []),
        ]}
      />

      <PageHero
        eyebrow="Service detail"
        title={page.h1}
        body={page.overview}
        primary={{ label: "Book a discovery call", href: "/discovery-call" }}
        secondary={{ label: "Request an on-site assessment", href: "/on-site-assessment" }}
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
                eyebrow="When to use this"
                title="Common signals that support is needed"
                body="If these patterns are showing up consistently, this service is usually the right starting point."
              />
              <ul className="mt-4 space-y-3 text-slate-700">
                {page.whenToUse.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#8a0917]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <SectionHeader
                eyebrow="What we deliver"
                title="Practical outputs your team can use"
                body="Our support is designed to improve delivery performance and transfer capability into your organisation."
              />
              <ul className="mt-4 space-y-3 text-slate-700">
                {page.whatWeDeliver.map((item) => (
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

      {page.methodology?.length ? (
        <section className="section-gap bg-slate-50">
          <Container>
            <SectionHeader
              eyebrow="Our approach"
              title="How we deliver this service"
              body="A structured method that keeps things clear, practical, and results-focused."
              center
            />
            <StepsGrid items={page.methodology} />
          </Container>
        </section>
      ) : null}

      {page.faqs?.length ? (
        <section className="section-gap">
          <Container>
            <SectionHeader
              eyebrow="FAQs"
              title="Frequently asked questions"
              body="Common questions about this service and how we deliver it."
              center
            />
            <div className="mx-auto max-w-4xl">
              <FaqList items={page.faqs} />
            </div>
          </Container>
        </section>
      ) : null}

      {relatedPages.length > 0 ? (
        <section className="section-gap bg-slate-50">
          <Container>
            <SectionHeader
              eyebrow="Related services"
              title="You may also benefit from"
              body="Services that often complement this work or address related operational challenges."
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

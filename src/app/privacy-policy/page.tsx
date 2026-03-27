import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { Container, LegalSection, PageHero } from "@/components/sections";
import { createPageMetadata } from "@/lib/site-seo";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

const privacySeo = {
  description:
    "Read how Tacklers Consulting Group collects, uses, stores, and protects personal data across its website, services, and recruitment workflows.",
  image: "/media/photo-1552664730-d307ca884978-c9ac175b.jpg",
  title: "Privacy Policy | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: privacySeo.description,
  image: privacySeo.image,
  path: "/privacy-policy",
  title: privacySeo.title,
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: privacySeo.description,
            path: "/privacy-policy",
            title: privacySeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy-policy" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Legal & compliance"
        title="Privacy Policy"
        body="Transparency matters. Here is how we collect, use, and protect your data. Effective date: October 2025."
        image={privacySeo.image}
      />
      <section className="section-gap">
        <Container>
          <div className="grid gap-6">
            <LegalSection
              number="1"
              title="Information We Collect"
              body="We may collect identity data such as name, username, job title, and company name; contact data such as email address, telephone number, and billing details; technical data such as IP address, browser type, operating system, and platform usage details; and usage data about how you use our site and services."
            />
            <LegalSection
              number="2"
              title="How We Use Your Information"
              body="We use your data to provide and manage our consulting services, manage our relationship with you, improve our website and marketing, and review applications if you submit your CV to our talent network."
            />
            <LegalSection
              number="3"
              title="Data Security"
              body="We use appropriate security measures to prevent personal data from being lost, used, accessed, altered, or disclosed without authorisation. Access is limited to people with a business need to know."
            />
            <LegalSection
              number="4"
              title="Third-Party Links"
              body="This website may include links to third-party websites, plug-ins, and applications. We do not control those sites and are not responsible for their privacy statements."
            />
            <LegalSection
              number="5"
              title="Your Legal Rights"
              body="Under data protection laws, you may have rights to access, correct, erase, restrict, or transfer your personal data. If you want to exercise those rights, contact our team directly."
            />
            <LegalSection
              title="Questions about your data?"
              body="If you have any questions about this privacy policy or our privacy practices, contact our compliance team at hello@tacklersconsulting.com."
            />
          </div>
        </Container>
      </section>
    </>
  );
}

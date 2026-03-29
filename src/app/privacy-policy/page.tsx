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
        body="How Tacklers Consulting Group collects, uses, shares, stores, and protects personal data under UK GDPR and, where applicable, EU GDPR. Effective date: 29 March 2026."
        image={privacySeo.image}
      />
      <section className="section-gap">
        <Container>
          <div className="grid gap-6">
            <LegalSection
              number="1"
              title="Who we are"
              body="Tacklers Consulting Group is the controller for personal data collected through this website, our enquiries, recruitment channels, and our client portal services, except where we clearly act on a client’s instructions as a processor or service provider. You can contact us at hello@tacklersconsulting.com about any privacy question."
            />
            <LegalSection
              number="2"
              title="Personal data we collect"
              body="Depending on how you interact with us, we may collect identity and contact data, company and role information, enquiry and correspondence records, portal account data, technical and device data, recruitment materials, service delivery records, and security logs. We aim to collect only the data reasonably necessary for a clear business purpose."
              points={[
                "Identity and contact data such as your name, work email, phone number, job title, and company.",
                "Enquiry, support, and project information you submit through forms, emails, or portal interactions.",
                "Portal account and authentication data, including session and security events needed to protect access.",
                "Recruitment and talent-network information if you apply for a role or submit your CV.",
              ]}
            />
            <LegalSection
              number="3"
              title="Why we use personal data and our legal bases"
              body="We process personal data only where we have a valid legal basis. Depending on the context, this may include taking steps before entering into a contract, performing a contract, complying with legal obligations, pursuing legitimate business interests that do not override your rights, or relying on your consent where required."
              points={[
                "Responding to enquiries, proposals, support requests, and service delivery communications.",
                "Providing portal access, maintaining secure authentication, and protecting user accounts.",
                "Managing recruitment, applications, talent-network submissions, and hiring decisions.",
                "Meeting legal, regulatory, tax, fraud-prevention, and record-keeping obligations.",
              ]}
            />
            <LegalSection
              number="4"
              title="Cookies and similar technologies"
              body="We use strictly necessary cookies and similar technologies to run the website and portal securely. If we introduce non-essential analytics, marketing, or personalisation technologies, we will ask for consent where required. See our Cookie Policy for more detail."
            />
            <LegalSection
              number="5"
              title="How long we keep data"
              body="We retain personal data only for as long as necessary for the purpose it was collected, including legal, accounting, contractual, security, and evidential needs. Retention periods vary by record type, and we may keep limited information longer where required to resolve disputes, enforce agreements, or comply with law."
            />
            <LegalSection
              number="6"
              title="How we share data"
              body="We share personal data only where necessary and proportionate. This may include trusted service providers for hosting, email, authentication, recruitment workflow support, security, and operational delivery. We may also disclose data where required by law, regulator request, court order, or to protect our rights and users."
            />
            <LegalSection
              number="7"
              title="International transfers"
              body="Where personal data is transferred outside the UK or EEA, we seek to use recognised safeguards such as adequacy decisions, standard contractual clauses, supplementary security measures, or another lawful transfer mechanism appropriate to the circumstances."
            />
            <LegalSection
              number="8"
              title="Your rights"
              body="Depending on the law that applies to you, you may have rights to access, correct, delete, restrict, object to certain processing, withdraw consent, request portability, and complain to a supervisory authority. We may ask for reasonable proof of identity before acting on a request."
            />
            <LegalSection
              number="9"
              title="Complaints and contact"
              body="If you have questions or want to exercise your rights, contact hello@tacklersconsulting.com first so we can try to resolve the issue. If you are in the UK, you may also contact the Information Commissioner’s Office. If you are in the EEA, you may contact your local supervisory authority."
            />
            <LegalSection
              title="Policy updates"
              body="We may update this policy to reflect operational, legal, or regulatory changes. The latest version published on this page will apply from its effective date."
            />
          </div>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { Container, LegalSection, PageHero } from "@/components/sections";
import { createPageMetadata } from "@/lib/site-seo";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

const termsSeo = {
  description:
    "Review the Tacklers Consulting Group terms and conditions covering website use, intellectual property, service agreements, and liability.",
  image: "/media/photo-1552664730-d307ca884978-3b59fe94.jpg",
  title: "Terms and Conditions | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: termsSeo.description,
  image: termsSeo.image,
  path: "/terms-and-conditions",
  title: termsSeo.title,
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: termsSeo.description,
            path: "/terms-and-conditions",
            title: termsSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Terms & Conditions", path: "/terms-and-conditions" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Legal & compliance"
        title="Terms & Conditions"
        body="Terms governing use of the Tacklers website, enquiries, portal access, and related digital services. Effective date: 8 September 2024."
        image={termsSeo.image}
      />
      <section className="section-gap">
        <Container>
          <div className="grid gap-6">
            <LegalSection
              number="1"
              title="About these terms"
              body="These terms apply to your access to and use of the Tacklers Consulting Group website, public pages, and any related online service or portal we make available, unless separate written terms expressly replace them for a particular engagement or platform area."
            />
            <LegalSection
              number="2"
              title="Who we work with"
              body="Our consulting, training, and delivery work is usually provided to business customers under a separate proposal, statement of work, or written agreement. Information on this website is general information only and is not a binding offer, guarantee of outcomes, or substitute for a formal contract."
            />
            <LegalSection
              number="3"
              title="Website use and acceptable conduct"
              body="You agree to use the site lawfully and responsibly. You must not interfere with site security, attempt unauthorised access, upload malicious code, scrape content in a way that harms the service, misuse contact forms, or use the site in a way that is unlawful, defamatory, fraudulent, abusive, or harmful."
            />
            <LegalSection
              number="4"
              title="Account and portal access"
              body="If we provide you with portal credentials or account access, you are responsible for keeping your login details confidential, using strong credentials, and notifying us promptly if you suspect compromise. We may suspend or revoke access where reasonably necessary for security, misuse prevention, contract management, or legal compliance."
            />
            <LegalSection
              number="5"
              title="Intellectual property rights"
              body="Unless otherwise stated, Tacklers Consulting Group and its licensors own the intellectual property rights in this website, branding, text, images, downloads, and other materials. Limited personal or internal business viewing is permitted, but broader reuse requires permission."
              points={[
                "Do not republish material from our website without proper attribution.",
                "Do not sell, rent, or sub-license material from the website.",
                "Do not reproduce or copy material for commercial purposes without permission.",
              ]}
            />
            <LegalSection
              number="6"
              title="Reliance on content"
              body="While we aim to keep website content accurate and current, the site is provided for general information and may not always be complete, current, or suitable for your specific circumstances. You remain responsible for evaluating whether any material is appropriate for your own use."
            />
            <LegalSection
              number="7"
              title="Third-party services and links"
              body="This site may reference or link to third-party websites, platforms, or tools. We do not control those external services and are not responsible for their content, availability, terms, or privacy practices. Your use of them is governed by their own terms."
            />
            <LegalSection
              number="8"
              title="Liability"
              body="Nothing in these terms excludes or limits liability where the law does not allow that, including liability for fraud, fraudulent misrepresentation, death, or personal injury caused by negligence. Subject to that, and to the fullest extent permitted by law, we exclude implied warranties and limit liability for losses arising from your use of this website and free public content."
            />
            <LegalSection
              number="9"
              title="Privacy, cookies, and data protection"
              body="Your use of the site is also governed by our Privacy Policy and Cookie Policy. Where we process personal data, we do so under applicable UK and EU data protection rules as described in those notices."
            />
            <LegalSection
              number="10"
              title="Consumer rights and mandatory local law"
              body="If you are using this website as a consumer, any mandatory rights granted by the law of your usual country of residence remain unaffected. Where separate service agreements apply, those agreements may contain additional consumer or business-specific terms relevant to the engagement."
            />
            <LegalSection
              number="11"
              title="Changes to these terms"
              body="We may update these terms from time to time. The latest version published on this page applies from its effective date. Continued use of the website after a change indicates acceptance to the extent permitted by law."
            />
            <LegalSection
              title="Questions about these terms?"
              body="If you need clarification on these terms or require a service-specific agreement, contact hello@tacklersconsulting.com."
            />
          </div>
        </Container>
      </section>
    </>
  );
}

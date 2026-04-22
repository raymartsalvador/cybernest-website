import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { HomeSkeleton } from "../components/Skeleton";

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "Privacy", path: "/privacy" },
];

export const PRIVACY_NOTICE_VERSION = "2026-04-22";
const LAST_UPDATED = "22 April 2026";

export default function Privacy() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const seo = (
    <Seo
      title="Privacy Notice — Cybernest Solutions"
      description="How Cybernest Solutions collects, uses, retains, and protects personal information under the Philippine Data Privacy Act (Republic Act 10173)."
      path="/privacy"
      breadcrumbs={breadcrumbItems}
    />
  );

  if (loading) return <>{seo}<HomeSkeleton /></>;

  return (
    <div className="font-montserrat text-gray-900 scroll-smooth">
      {seo}
      <NavBar />

      <main id="main" tabIndex={-1} className="bg-white pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24 outline-none">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} className="mb-6 sm:mb-8" />

          <header className="mb-10 sm:mb-14">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-cyberred leading-tight mb-3 sm:mb-4">
              Privacy Notice
            </h1>
            <p className="text-sm sm:text-base text-cyberviolet/70">
              Last updated: {LAST_UPDATED}
            </p>
            <p className="mt-4 text-base sm:text-lg text-cyberviolet leading-relaxed">
              Cybernest Solutions ("Cybernest", "we", "us") is committed to
              protecting your personal information. This notice describes what
              we collect, why we collect it, and the rights you have under the
              Philippine Data Privacy Act of 2012 (Republic Act 10173).
            </p>
          </header>

          <article className="space-y-10 text-cyberviolet">
            <section aria-labelledby="who-we-are">
              <h2
                id="who-we-are"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                1. Who we are
              </h2>
              <p className="text-base leading-relaxed">
                Cybernest Solutions is a Philippine technology company
                providing workflow automation, queueing, and digital
                transformation products to private businesses and government
                offices. We operate this website at{" "}
                <a
                  href="https://www.cybernestsolution.com"
                  className="text-cyberred hover:underline"
                >
                  www.cybernestsolution.com
                </a>
                .
              </p>
            </section>

            <section aria-labelledby="what-we-collect">
              <h2
                id="what-we-collect"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                2. What we collect
              </h2>
              <p className="text-base leading-relaxed mb-3">
                We collect only what is necessary for the purpose you provided
                it. Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
                <li>
                  <strong>Contact form:</strong> your name, email address, and
                  the message you send us.
                </li>
                <li>
                  <strong>Booking / consultation form:</strong> your name,
                  email, phone number, company (optional), address (where
                  relevant to the engagement), appointment date and time, and
                  any notes you include.
                </li>
                <li>
                  <strong>Technical data:</strong> your IP address, browser
                  type, device, and pages visited — collected via standard
                  server logs and privacy-respecting analytics.
                </li>
              </ul>
              <p className="text-base leading-relaxed mt-3">
                We do not knowingly collect information from children under 18
                and do not process sensitive personal information (as defined
                in the Act) through this website.
              </p>
            </section>

            <section aria-labelledby="why-we-collect">
              <h2
                id="why-we-collect"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                3. Why we collect it (purposes)
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
                <li>To respond to your inquiries and schedule consultations.</li>
                <li>
                  To prepare proposals, quotations, and contracts when you
                  engage our services.
                </li>
                <li>
                  To improve the site's performance, security, and content.
                </li>
                <li>
                  To comply with applicable laws, regulations, and lawful
                  requests from public authorities.
                </li>
              </ul>
            </section>

            <section aria-labelledby="lawful-basis">
              <h2
                id="lawful-basis"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                4. Lawful basis
              </h2>
              <p className="text-base leading-relaxed">
                We process your personal information on the basis of your{" "}
                <strong>consent</strong> (given when you submit a form) and our{" "}
                <strong>legitimate interests</strong> in operating and securing
                the website. Where a contract is formed, processing is also
                necessary for the performance of that contract.
              </p>
            </section>

            <section aria-labelledby="sharing">
              <h2
                id="sharing"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                5. How we share it
              </h2>
              <p className="text-base leading-relaxed mb-3">
                We do not sell your personal information. We share it only
                with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
                <li>
                  <strong>Service providers</strong> that help us operate the
                  site (hosting on Vercel; email; cloud infrastructure on
                  Microsoft Azure). These providers are bound by confidentiality
                  and data-protection obligations.
                </li>
                <li>
                  <strong>Authorities</strong> when required by law, court
                  order, or to protect our rights and the safety of others.
                </li>
              </ul>
            </section>

            <section aria-labelledby="locations">
              <h2
                id="locations"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                6. Where your data is stored (data locations)
              </h2>
              <p className="text-base leading-relaxed mb-3">
                We process and store your personal information with the
                following providers and regions:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
                <li>
                  <strong>Application backend:</strong> Microsoft Azure
                  Container Apps,{" "}
                  <em>Southeast Asia</em> region (Singapore).
                </li>
                <li>
                  <strong>Website &amp; serverless functions:</strong> Vercel
                  edge network, with primary egress serving Philippine
                  visitors from APAC points of presence.
                </li>
                <li>
                  <strong>Analytics:</strong> Google Analytics 4 (Google LLC,
                  United States), with IP anonymisation enabled.
                </li>
              </ul>
              <p className="text-base leading-relaxed mt-3">
                Cross-border transfers are protected by our providers'
                standard contractual clauses and data-processing addenda. If
                your engagement requires in-country data residency (e.g.,
                Philippine-government procurement requirements), contact us
                — we can scope a Philippines-resident deployment option.
              </p>
            </section>

            <section aria-labelledby="retention">
              <h2
                id="retention"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                7. How long we keep it
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
                <li>
                  <strong>Contact inquiries:</strong> up to 24 months from last
                  contact, then deleted.
                </li>
                <li>
                  <strong>Booking records:</strong> up to 5 years, aligned with
                  Philippine tax and contract-retention rules.
                </li>
                <li>
                  <strong>Technical logs:</strong> up to 12 months for security
                  and debugging.
                </li>
              </ul>
              <p className="text-base leading-relaxed mt-3">
                We may retain information longer where required by law or to
                resolve disputes.
              </p>
            </section>

            <section aria-labelledby="security">
              <h2
                id="security"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                8. How we protect it
              </h2>
              <p className="text-base leading-relaxed">
                We use TLS (HTTPS) for all site traffic, restrict access to
                personal information on a need-to-know basis, and host our
                systems on providers that maintain industry-standard security
                certifications. No system is perfectly secure; if we become
                aware of a breach affecting you, we will notify you and the
                National Privacy Commission as required by law.
              </p>
            </section>

            <section aria-labelledby="your-rights">
              <h2
                id="your-rights"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                9. Your rights under RA 10173
              </h2>
              <p className="text-base leading-relaxed mb-3">
                Subject to the limits of the Act, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
                <li>Be informed about how your data is processed.</li>
                <li>Access a copy of the personal data we hold about you.</li>
                <li>Correct inaccurate or outdated information.</li>
                <li>
                  Object to processing, or request erasure or blocking of data
                  that is incomplete, outdated, unlawfully obtained, or no
                  longer necessary.
                </li>
                <li>
                  Request data portability in a commonly used electronic
                  format.
                </li>
                <li>
                  Lodge a complaint with the{" "}
                  <a
                    href="https://privacy.gov.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyberred hover:underline"
                  >
                    National Privacy Commission
                  </a>
                  .
                </li>
              </ul>
              <p className="text-base leading-relaxed mt-3">
                To exercise any of these rights, contact us using the details
                below. We will respond within a reasonable period, and in any
                case within the timeframes required by law.
              </p>
            </section>

            <section aria-labelledby="cookies">
              <h2
                id="cookies"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                10. Cookies and analytics
              </h2>
              <p className="text-base leading-relaxed">
                We use Google Analytics 4 to understand how the site is used.
                Analytics cookies are{" "}
                <strong>denied by default</strong> and are only set after you
                accept through our cookie notice. When accepted, measurement
                runs with IP anonymisation enabled and without advertising or
                personalisation signals. You can change your preference at any
                time on our{" "}
                <a
                  href="/cookies"
                  className="text-cyberred hover:underline"
                >
                  Cookie Policy
                </a>{" "}
                page, or by clearing this site's storage in your browser.
              </p>
            </section>

            <section aria-labelledby="changes">
              <h2
                id="changes"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                11. Changes to this notice
              </h2>
              <p className="text-base leading-relaxed">
                We may update this notice from time to time. The "last updated"
                date at the top reflects the most recent revision. Continued
                use of the site after an update means you accept the revised
                notice.
              </p>
            </section>

            <section
              aria-labelledby="contact"
              className="bg-[rgba(220,61,80,0.04)] border border-cyberred/15 rounded-3xl p-6 sm:p-8"
            >
              <h2
                id="contact"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                12. Contact our Data Protection Officer
              </h2>
              <p className="text-base leading-relaxed mb-4">
                For privacy questions, data-subject requests, or to report a
                concern, please write to our Data Protection Officer:
              </p>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-cyberred mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a
                    href="mailto:privacy@cybernestsolution.com"
                    className="text-cyberred hover:underline"
                  >
                    privacy@cybernestsolution.com
                  </a>
                  <p className="text-sm text-cyberviolet/70 mt-2">
                    Cybernest Solutions &middot; Philippines
                  </p>
                </div>
              </div>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

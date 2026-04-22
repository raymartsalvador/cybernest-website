import { useEffect, useState } from "react";
import { AlertTriangle, Mail } from "lucide-react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { HomeSkeleton } from "../components/Skeleton";

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "Terms", path: "/terms" },
];

const LAST_UPDATED = "22 April 2026";

export default function Terms() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const seo = (
    <Seo
      title="Terms of Service — Cybernest Solutions"
      description="Terms governing access to and use of the Cybernest Solutions website and services, under Philippine law."
      path="/terms"
      breadcrumbs={breadcrumbItems}
    />
  );

  if (loading) return <>{seo}<HomeSkeleton /></>;

  return (
    <div className="font-montserrat text-gray-900 scroll-smooth">
      {seo}
      <NavBar />

      <main
        id="main"
        tabIndex={-1}
        className="bg-white pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24 outline-none"
      >
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} className="mb-6 sm:mb-8" />

          <header className="mb-10 sm:mb-14">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-cyberred leading-tight mb-3 sm:mb-4">
              Terms of Service
            </h1>
            <p className="text-sm sm:text-base text-cyberviolet/70">
              Last updated: {LAST_UPDATED}
            </p>
          </header>

          <div
            role="note"
            className="mb-10 flex items-start gap-3 rounded-2xl border border-amber-400/40 bg-amber-50 p-5"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm sm:text-base text-amber-900">
              <strong className="font-bold">Draft pending legal review.</strong>{" "}
              This document is a working draft intended to scope the
              contractual terms that will govern use of this website. It is
              not a substitute for advice from Philippine counsel. Engagements
              with Cybernest Solutions today are governed by the separate
              proposal or service agreement signed with the client.
            </div>
          </div>

          <article className="space-y-10 text-cyberviolet">
            <section aria-labelledby="acceptance">
              <h2
                id="acceptance"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                1. Acceptance
              </h2>
              <p className="text-base leading-relaxed">
                By accessing or using{" "}
                <a
                  href="https://www.cybernestsolution.com"
                  className="text-cyberred hover:underline"
                >
                  www.cybernestsolution.com
                </a>{" "}
                (the "Site") or submitting a booking, contact, or
                consultation request through it, you agree to be bound by
                these Terms. If you do not agree, please do not use the Site.
              </p>
            </section>

            <section aria-labelledby="services">
              <h2
                id="services"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                2. The Site and our services
              </h2>
              <p className="text-base leading-relaxed">
                The Site provides information about Cybernest Solutions and
                allows prospective clients to request a consultation. Any paid
                engagement (build, integration, support, or licensing) is
                governed by a separate written agreement signed by both
                parties, not by these Terms.
              </p>
            </section>

            <section aria-labelledby="acceptable-use">
              <h2
                id="acceptable-use"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                3. Acceptable use
              </h2>
              <p className="text-base leading-relaxed mb-3">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
                <li>Submit false information, impersonate another person, or
                  misrepresent an organisation when using our forms.</li>
                <li>Attempt to probe, scan, or test the vulnerability of the
                  Site or circumvent any security or authentication measure.</li>
                <li>Interfere with the Site's operation (including automated
                  scraping, denial-of-service, or excessive request volume).</li>
                <li>Use the Site in any way that violates Philippine law,
                  including Republic Act 10175 (Cybercrime Prevention Act).</li>
              </ul>
            </section>

            <section aria-labelledby="ip">
              <h2
                id="ip"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                4. Intellectual property
              </h2>
              <p className="text-base leading-relaxed">
                All content on the Site — including text, graphics, logos,
                icons, software, and the "Cybernest" name and marks — is the
                property of Cybernest Solutions or its licensors and is
                protected by Philippine and international intellectual
                property laws. Nothing on the Site grants, by implication or
                otherwise, any licence or right to use any mark or content
                without our prior written permission.
              </p>
            </section>

            <section aria-labelledby="privacy">
              <h2
                id="privacy"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                5. Privacy
              </h2>
              <p className="text-base leading-relaxed">
                Our collection and use of personal information is described in
                our{" "}
                <a href="/privacy" className="text-cyberred hover:underline">
                  Privacy Notice
                </a>
                . Your use of the Site constitutes your acknowledgement of the
                Privacy Notice.
              </p>
            </section>

            <section aria-labelledby="third-party">
              <h2
                id="third-party"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                6. Third-party links and services
              </h2>
              <p className="text-base leading-relaxed">
                The Site may link to third-party websites or rely on
                third-party infrastructure (including Microsoft Azure, Vercel,
                and Google Analytics). We do not control those services and
                are not responsible for their content, policies, or
                availability.
              </p>
            </section>

            <section aria-labelledby="disclaimer">
              <h2
                id="disclaimer"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                7. Disclaimer of warranties
              </h2>
              <p className="text-base leading-relaxed">
                The Site is provided on an "as is" and "as available" basis.
                To the fullest extent permitted by law, Cybernest Solutions
                disclaims all warranties, express or implied, including
                warranties of merchantability, fitness for a particular
                purpose, and non-infringement. We do not warrant that the Site
                will be uninterrupted, error-free, or free of harmful
                components.
              </p>
            </section>

            <section aria-labelledby="liability">
              <h2
                id="liability"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                8. Limitation of liability
              </h2>
              <p className="text-base leading-relaxed">
                To the fullest extent permitted by law, Cybernest Solutions
                and its officers, employees, and contractors shall not be
                liable for any indirect, incidental, special, consequential,
                or punitive damages arising out of or in connection with your
                use of the Site. Our aggregate liability for any claim
                relating to the Site is limited to one thousand pesos
                (₱1,000.00). Nothing in these Terms excludes liability that
                cannot be excluded under Philippine law.
              </p>
            </section>

            <section aria-labelledby="governing-law">
              <h2
                id="governing-law"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                9. Governing law and venue
              </h2>
              <p className="text-base leading-relaxed">
                These Terms are governed by the laws of the Republic of the
                Philippines, without regard to its conflict-of-laws
                principles. The proper courts of the city of Cybernest
                Solutions' registered office shall have exclusive jurisdiction
                over any dispute arising out of or relating to these Terms or
                the Site.
              </p>
            </section>

            <section aria-labelledby="changes">
              <h2
                id="changes"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                10. Changes
              </h2>
              <p className="text-base leading-relaxed">
                We may update these Terms from time to time. The "last
                updated" date above reflects the most recent revision.
                Continued use of the Site after an update means you accept the
                revised Terms.
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
                11. Contact
              </h2>
              <p className="text-base leading-relaxed mb-4">
                Questions about these Terms can be sent to:
              </p>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-cyberred mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a
                    href="mailto:cns@cybernestsolution.com"
                    className="text-cyberred hover:underline"
                  >
                    cns@cybernestsolution.com
                  </a>
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

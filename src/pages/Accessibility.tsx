import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { HomeSkeleton } from "../components/Skeleton";

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "Accessibility", path: "/accessibility" },
];

const LAST_REVIEWED = "22 April 2026";

export default function Accessibility() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const seo = (
    <Seo
      title="Accessibility Statement — Cybernest Solutions"
      description="Cybernest Solutions is committed to WCAG 2.1 Level AA accessibility. Read our current conformance, known gaps, and feedback channel."
      path="/accessibility"
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
              Accessibility Statement
            </h1>
            <p className="text-sm sm:text-base text-cyberviolet/70">
              Last reviewed: {LAST_REVIEWED}
            </p>
            <p className="mt-4 text-base sm:text-lg text-cyberviolet leading-relaxed">
              Cybernest Solutions is committed to ensuring our website is
              usable by the widest possible audience, including people with
              disabilities. We align our work with the Web Content
              Accessibility Guidelines (WCAG) 2.1 at Level AA and with the
              spirit of Batas Pambansa Blg. 344 (Accessibility Law) and DICT
              Memorandum Circular 2024-001.
            </p>
          </header>

          <article className="space-y-10 text-cyberviolet">
            <section aria-labelledby="target">
              <h2
                id="target"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                1. Our conformance target
              </h2>
              <p className="text-base leading-relaxed">
                We aim to meet <strong>WCAG 2.1 Level AA</strong> across all
                pages of{" "}
                <a
                  href="https://www.cybernestsolution.com"
                  className="text-cyberred hover:underline"
                >
                  www.cybernestsolution.com
                </a>
                . This covers keyboard navigation, readable text alternatives,
                sufficient colour contrast, predictable interaction patterns,
                and assistive-technology compatibility.
              </p>
            </section>

            <section aria-labelledby="measures">
              <h2
                id="measures"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                2. Measures we take
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
                <li>Semantic HTML landmarks (header, nav, main, footer) on every page.</li>
                <li>Skip-to-content link on every page for keyboard and screen-reader users.</li>
                <li>Descriptive alternative text on all informational images.</li>
                <li>Visible focus indicators and full keyboard operability of interactive elements.</li>
                <li>Labelled form fields, inline validation, and ARIA live regions for status updates.</li>
                <li>Focus-trapped dialogs that close on Escape and return focus to the trigger.</li>
                <li>Reduced-motion preference respected for decorative animations.</li>
              </ul>
            </section>

            <section aria-labelledby="known-gaps">
              <h2
                id="known-gaps"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                3. Known limitations
              </h2>
              <p className="text-base leading-relaxed mb-3">
                We are transparent about work in progress. At the time of this
                review we are tracking:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
                <li>
                  A formal third-party audit has not yet been completed; our
                  conformance claim is based on in-house review only.
                </li>
                <li>
                  Some decorative brand animations and marquee sections may
                  feel busy; users with vestibular sensitivities can enable the{" "}
                  <em>reduce motion</em> preference in their operating system
                  and we respect it.
                </li>
                <li>
                  Our colour palette uses red (<code>#DC3D50</code>) against
                  white. Normal-weight red text can sit close to the minimum
                  AA threshold; we avoid using it for small body copy and pair
                  it with icons or weight cues.
                </li>
              </ul>
              <p className="text-base leading-relaxed mt-3">
                If you encounter a barrier not listed here, please let us know
                — we treat accessibility feedback as a bug report.
              </p>
            </section>

            <section aria-labelledby="compat">
              <h2
                id="compat"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                4. Compatibility
              </h2>
              <p className="text-base leading-relaxed">
                The site is designed to be compatible with current versions of
                major browsers (Chrome, Edge, Firefox, Safari) and with common
                assistive technologies, including VoiceOver, NVDA, and TalkBack.
                Older browsers may render the site with reduced fidelity but
                remain functional.
              </p>
            </section>

            <section
              aria-labelledby="feedback"
              className="bg-[rgba(220,61,80,0.04)] border border-cyberred/15 rounded-3xl p-6 sm:p-8"
            >
              <h2
                id="feedback"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                5. Feedback and assistance
              </h2>
              <p className="text-base leading-relaxed mb-4">
                We welcome feedback on the accessibility of our website. If
                you need information on this site in a different format, or
                encounter an access barrier, please contact us and we will aim
                to respond within five working days.
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
                    Please include the page URL and a description of the
                    issue.
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

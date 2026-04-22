import { useCallback, useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { HomeSkeleton } from "../components/Skeleton";

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "Cookies", path: "/cookies" },
];

const LAST_UPDATED = "22 April 2026";

export default function Cookies() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const openPreferences = useCallback(() => {
    if (typeof window !== "undefined" && typeof window.cybernestOpenConsent === "function") {
      window.cybernestOpenConsent();
    }
  }, []);

  const seo = (
    <Seo
      title="Cookie Policy — Cybernest Solutions"
      description="How Cybernest Solutions uses cookies and analytics, what you control, and how to change your preferences."
      path="/cookies"
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
              Cookie Policy
            </h1>
            <p className="text-sm sm:text-base text-cyberviolet/70">
              Last updated: {LAST_UPDATED}
            </p>
            <p className="mt-4 text-base sm:text-lg text-cyberviolet leading-relaxed">
              This page explains the small number of cookies and similar
              technologies our website uses, what each one does, and how you
              can change your preferences at any time.
            </p>
          </header>

          <article className="space-y-10 text-cyberviolet">
            <section aria-labelledby="what-are-cookies">
              <h2
                id="what-are-cookies"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                1. What cookies are
              </h2>
              <p className="text-base leading-relaxed">
                Cookies are small text files a website places in your browser.
                They allow a site to remember information between page views
                (for example, that you have dismissed a notice) or across
                visits (for example, analytics measurements of repeat
                traffic).
              </p>
            </section>

            <section aria-labelledby="our-posture">
              <h2
                id="our-posture"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                2. Our default posture
              </h2>
              <p className="text-base leading-relaxed">
                We load Google Analytics 4 in a "consent mode" state that sets
                <em> no analytics cookies</em> until you explicitly accept.
                Essential browser storage we need for the site to function
                (for example, remembering your cookie choice itself) remains
                enabled — the law treats such storage as necessary.
              </p>
            </section>

            <section aria-labelledby="categories">
              <h2
                id="categories"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                3. Categories we use
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm sm:text-base">
                  <thead>
                    <tr className="bg-cyberlightred/60 text-cyberviolet">
                      <th className="text-left p-3 font-bold">Category</th>
                      <th className="text-left p-3 font-bold">Examples</th>
                      <th className="text-left p-3 font-bold">Purpose</th>
                      <th className="text-left p-3 font-bold">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="[&_td]:border-t [&_td]:border-cyberred/10 [&_td]:p-3 [&_td]:align-top">
                    <tr>
                      <td className="font-semibold">Strictly necessary</td>
                      <td>
                        <code>cns_consent_v1</code> (localStorage)
                      </td>
                      <td>
                        Remembers your cookie preference so we do not keep
                        asking.
                      </td>
                      <td>Until cleared or notice version changes</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Analytics (opt-in)</td>
                      <td>
                        <code>_ga</code>, <code>_ga_&lt;id&gt;</code>
                      </td>
                      <td>
                        Google Analytics 4 — aggregated traffic measurement
                        with IP anonymisation enabled. Only set if you
                        accept.
                      </td>
                      <td>Up to 14 months (GA4 default we set)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="change-pref">
              <h2
                id="change-pref"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                4. Change your preferences
              </h2>
              <p className="text-base leading-relaxed mb-4">
                You can withdraw or re-grant analytics consent at any time.
                The button below re-opens our cookie notice. Clearing site
                data in your browser settings has the same effect and will
                cause us to ask again on your next visit.
              </p>
              <button
                type="button"
                onClick={openPreferences}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-cyberred px-6 text-sm font-bold text-white hover:opacity-90 transition"
              >
                <Cookie size={18} />
                Manage cookie preferences
              </button>
            </section>

            <section aria-labelledby="third-party">
              <h2
                id="third-party"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                5. Third-party cookies
              </h2>
              <p className="text-base leading-relaxed">
                The only third-party provider that may set cookies on this
                site is Google (for Google Analytics 4), and only after you
                have accepted. We do not use advertising, remarketing,
                behavioural-profiling, or social-tracking cookies.
              </p>
            </section>

            <section aria-labelledby="more">
              <h2
                id="more"
                className="text-xl sm:text-2xl font-bold text-cyberviolet mb-3"
              >
                6. Learn more
              </h2>
              <p className="text-base leading-relaxed">
                For the broader picture of how we handle personal
                information, please read our{" "}
                <a href="/privacy" className="text-cyberred hover:underline">
                  Privacy Notice
                </a>
                . Questions can be directed to our Data Protection Officer at{" "}
                <a
                  href="mailto:privacy@cybernestsolution.com"
                  className="text-cyberred hover:underline"
                >
                  privacy@cybernestsolution.com
                </a>
                .
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

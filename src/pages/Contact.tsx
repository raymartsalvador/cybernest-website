import { useEffect, useState } from "react";
import { ArrowRight, Mail, Phone, Facebook, MapPin } from "lucide-react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import BookingModal from "../components/BookingModal";
import { HomeSkeleton } from "../components/Skeleton";
import contactImage from "../assets/images/Contact.webp";

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Cybernest Solutions",
  url: "https://www.cybernestsolution.com/contact",
  mainEntity: {
    "@type": "Organization",
    "@id": "https://www.cybernestsolution.com/#organization",
    name: "Cybernest Solutions",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+63-976-179-1990",
        contactType: "customer support",
        email: "cns@cybernestsolution.com",
        areaServed: "PH",
        availableLanguage: ["en", "fil"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+63-928-901-0072",
        contactType: "sales",
        email: "cns@cybernestsolution.com",
        areaServed: "PH",
        availableLanguage: ["en", "fil"],
      },
    ],
  },
};

export default function Contact() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const seo = (
    <Seo
      title="Contact Cybernest Solutions — Talk to Our Team"
      description="Get in touch with Cybernest Solutions for workflow automation, queueing, and digital transformation projects across the Philippines. Email, call, or book a free consultation."
      path="/contact"
      breadcrumbs={breadcrumbItems}
      jsonLd={contactSchema}
    />
  );

  if (loading) return <>{seo}<HomeSkeleton /></>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="font-montserrat text-gray-900 scroll-smooth">
      {seo}
      <NavBar />

      <main className="bg-white pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} className="mb-6 sm:mb-8" />

          <header className="mb-10 sm:mb-14 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold text-cyberred leading-tight mb-3 sm:mb-4">
              Let's talk.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-cyberviolet font-normal leading-relaxed">
              Whether you're modernising a government queue, automating
              certificates, or scoping a full digital transformation — our team
              is ready to listen.
            </p>
          </header>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
            {/* Contact details */}
            <section aria-labelledby="reach-us" className="space-y-8">
              <div>
                <h2
                  id="reach-us"
                  className="text-xl sm:text-2xl font-bold text-cyberviolet mb-4"
                >
                  Reach us directly
                </h2>
                <ul className="space-y-4 text-base sm:text-lg">
                  <li className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-cyberred mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <a
                        href="mailto:cns@cybernestsolution.com"
                        className="text-cyberviolet hover:text-cyberred transition"
                      >
                        cns@cybernestsolution.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-cyberred mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-cyberviolet">
                        <a
                          href="tel:+639761791990"
                          className="hover:text-cyberred transition"
                        >
                          0976-179-1990
                        </a>
                        {" (Support) · "}
                        <a
                          href="tel:+639289010072"
                          className="hover:text-cyberred transition"
                        >
                          0928-901-0072
                        </a>
                        {" (Sales)"}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Facebook className="w-5 h-5 text-cyberred mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Facebook</p>
                      <a
                        href="https://www.facebook.com/CybernestSolutions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyberviolet hover:text-cyberred transition"
                      >
                        facebook.com/CybernestSolutions
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-cyberred mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Based in</p>
                      <p className="text-cyberviolet">
                        Philippines &middot; serving businesses and government
                        offices nationwide.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 bg-cyberred text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition"
                >
                  Book a free consultation <ArrowRight size={18} />
                </button>
              </div>

              <img
                src={contactImage}
                alt="Cybernest team collaborating on a workflow automation project"
                width={960}
                height={640}
                loading="lazy"
                decoding="async"
                className="w-full max-w-[520px] rounded-2xl shadow-md"
              />
            </section>

            {/* Form */}
            <section aria-labelledby="send-message">
              <div className="bg-[rgba(220,61,80,0.04)] border border-cyberred/15 rounded-3xl p-6 sm:p-8 lg:p-10">
                <h2
                  id="send-message"
                  className="text-xl sm:text-2xl font-bold text-cyberviolet mb-2"
                >
                  Send a message
                </h2>
                <p className="text-sm sm:text-base text-cyberviolet/70 mb-6">
                  We typically reply within one business day.
                </p>

                {submitted ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="bg-white border border-cyberred/20 rounded-2xl p-6 text-center"
                  >
                    <p className="font-semibold text-cyberviolet mb-1">
                      Thanks — we'll be in touch.
                    </p>
                    <p className="text-sm text-cyberviolet/70">
                      In the meantime, feel free to email us directly at{" "}
                      <a
                        href="mailto:cns@cybernestsolution.com"
                        className="text-cyberred hover:underline"
                      >
                        cns@cybernestsolution.com
                      </a>
                      .
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    noValidate
                  >
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-semibold text-cyberviolet mb-1.5"
                      >
                        Your name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        className="w-full rounded-xl border border-cyberviolet/20 bg-white px-4 py-3 text-base focus:outline-none focus:border-cyberred focus:ring-2 focus:ring-cyberred/20 transition"
                        placeholder="Juan dela Cruz"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-semibold text-cyberviolet mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        className="w-full rounded-xl border border-cyberviolet/20 bg-white px-4 py-3 text-base focus:outline-none focus:border-cyberred focus:ring-2 focus:ring-cyberred/20 transition"
                        placeholder="you@company.com"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-semibold text-cyberviolet mb-1.5"
                      >
                        What are you looking to solve?
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        value={formState.message}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            message: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-cyberviolet/20 bg-white px-4 py-3 text-base focus:outline-none focus:border-cyberred focus:ring-2 focus:ring-cyberred/20 transition"
                        placeholder="Tell us about your workflow or the problem you're trying to solve."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 bg-cyberred text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition"
                    >
                      Send message <ArrowRight size={18} />
                    </button>

                    <p className="text-xs text-cyberviolet/60 text-center">
                      Form submission handler pending. For anything urgent,
                      please email{" "}
                      <a
                        href="mailto:cns@cybernestsolution.com"
                        className="text-cyberred hover:underline"
                      >
                        cns@cybernestsolution.com
                      </a>
                      .
                    </p>
                  </form>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <BookingModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

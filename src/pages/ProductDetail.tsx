import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, ExternalLink, Mail, TvMinimalPlay } from "lucide-react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
import { showPopup } from "../components/PopupService";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { ProjectDetailSkeleton } from "../components/Skeleton";
import { getProductBySlug, type FeaturedProduct } from "../data/products";
import { projects as completedProjects } from "../data/projects";

interface StatusPillProps {
  status: FeaturedProduct["status"];
}

function StatusPill({ status }: StatusPillProps) {
  const config: Record<
    FeaturedProduct["status"],
    { label: string; tone: "live" | "muted" }
  > = {
    live: { label: "Live in Production", tone: "live" },
    "coming-soon": { label: "Coming Soon", tone: "muted" },
  };
  const { label, tone } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-sm font-semibold uppercase tracking-wider ${
        tone === "live"
          ? "border-cyberred/30 bg-cyberred/10 text-cyberred"
          : "border-cyberviolet/20 bg-cyberviolet/10 text-cyberviolet"
      }`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
          tone === "live" ? "bg-cyberred animate-pulse" : "bg-cyberviolet/70"
        }`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

export default function ProductDetail() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const product = productSlug ? getProductBySlug(productSlug) : undefined;

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const handleWatchDemo = () => {
    showPopup({
      icon: "info",
      title: "Demo coming soon",
      message: "A product demo video will be available here shortly.",
      confirmText: "OK",
    });
  };

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.name, path: `/products/${product.slug}` },
  ];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.seo.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: product.liveUrl ?? `https://www.cybernestsolution.com/products/${product.slug}`,
    ...(product.seo.ogImage ? { image: product.seo.ogImage } : {}),
    brand: {
      "@type": "Brand",
      name: "Cybernest Solutions",
    },
    offers: {
      "@type": "AggregateOffer",
      url: "https://www.cybernestsolution.com/contact",
      priceCurrency: "PHP",
      lowPrice: "0",
      availability:
        product.status === "live"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      seller: {
        "@type": "Organization",
        name: "Cybernest Solutions",
      },
    },
  };

  const seo = (
    <Seo
      title={product.seo.title}
      description={product.seo.description}
      path={`/products/${product.slug}`}
      image={product.seo.ogImage}
      type="article"
      breadcrumbs={breadcrumbItems}
      jsonLd={productSchema}
    />
  );

  if (loading) return <>{seo}<ProjectDetailSkeleton /></>;

  const heroImage = product.images[0];

  const usedByProjects = (product.poweredProjects ?? [])
    .map((slug) => completedProjects.find((p) => p.slug === slug))
    .filter((p): p is (typeof completedProjects)[number] => Boolean(p));

  return (
    <div className="font-montserrat text-gray-900 scroll-smooth overflow-x-clip">
      {seo}
      <NavBar />

      <main
        id="main"
        tabIndex={-1}
        className="bg-white pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24 outline-none"
      >
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} className="mb-6 sm:mb-8" />

          <section data-aos="fade-up" className="mb-10 sm:mb-14">
            <div className="mb-4 sm:mb-5">
              <StatusPill status={product.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold text-cyberred mb-3 sm:mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-2xl text-[#3f3f3f] max-w-[1100px] mb-8 sm:mb-10">
              {product.tagline}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              {product.liveUrl && (
                <a
                  href={product.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[260px] h-11 sm:h-[60px] bg-cyberred text-white rounded-full font-bold text-sm sm:text-xl hover:opacity-90 transition shadow-sm"
                >
                  <ExternalLink className="w-4 h-4 sm:w-6 sm:h-6" />
                  Visit Live Site
                </a>
              )}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[260px] h-11 sm:h-[60px] border-2 border-cyberred text-cyberred rounded-full font-bold text-sm sm:text-xl hover:bg-cyberred/5 transition"
              >
                <Mail className="w-4 h-4 sm:w-6 sm:h-6" />
                Get a Quotation
              </button>
              <button
                type="button"
                onClick={handleWatchDemo}
                className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[220px] h-11 sm:h-[60px] border-2 border-cyberred text-cyberred rounded-full font-bold text-sm sm:text-xl hover:bg-cyberred/5 transition"
              >
                <TvMinimalPlay className="w-4 h-4 sm:w-6 sm:h-6" />
                Watch Demo
              </button>
            </div>
          </section>

          <section
            data-aos="fade-up"
            aria-label={`${product.name} preview`}
            className="relative bg-white border-2 border-cyberred rounded-[20px] sm:rounded-[24px] w-full aspect-[16/10] sm:aspect-[1255/620] overflow-hidden mb-12 sm:mb-20"
          >
            <picture>
              {heroImage.avif && (
                <source srcSet={heroImage.avif} type="image/avif" />
              )}
              <source srcSet={heroImage.src} type="image/webp" />
              <img
                src={heroImage.src}
                alt={`${product.name} preview`}
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-contain scale-[1.25]"
              />
            </picture>
          </section>

          {product.problem && (
            <section data-aos="fade-up" className="mb-12 sm:mb-20">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-cyberred mb-4 sm:mb-5">
                The Problem
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-[22px] text-[#3f3f3f] leading-relaxed max-w-[1100px]">
                {product.problem}
              </p>
            </section>
          )}

          <section data-aos="fade-up" className="mb-12 sm:mb-20">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-cyberred mb-5 sm:mb-7">
              Capabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {product.expandedFeatures.map((feature) => (
                <article
                  key={feature.title}
                  className="bg-white border border-cyberred/20 rounded-2xl p-5 sm:p-6 shadow-[0px_4px_20px_0px_rgba(220,61,80,0.06)]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2
                      className="w-6 h-6 text-cyberred shrink-0"
                      strokeWidth={2}
                    />
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-cyberviolet">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#3f3f3f] leading-relaxed">
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {product.useCases && product.useCases.length > 0 && (
            <section data-aos="fade-up" className="mb-12 sm:mb-20">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-cyberred mb-5 sm:mb-7">
                Who It's For
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {product.useCases.map((useCase) => (
                  <article
                    key={useCase.title}
                    className="bg-cyberlightred rounded-2xl p-5 sm:p-6"
                  >
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-cyberred mb-2 sm:mb-3">
                      {useCase.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#3f3f3f] leading-relaxed">
                      {useCase.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {product.techStack && product.techStack.length > 0 && (
            <section data-aos="fade-up" className="mb-12 sm:mb-20">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-cyberred mb-4 sm:mb-5">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-full border border-cyberred/30 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-cyberviolet"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {usedByProjects.length > 0 && (
            <section data-aos="fade-up" className="mb-12 sm:mb-20">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-cyberred mb-5 sm:mb-7">
                Powering These Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {usedByProjects.map((proj) => (
                  <Link
                    key={proj.slug}
                    to={`/products/projects/${proj.slug}`}
                    className="group bg-white border border-cyberred/20 rounded-2xl p-5 sm:p-6 shadow-[0px_4px_20px_0px_rgba(220,61,80,0.06)] hover:shadow-[0px_4px_20px_0px_rgba(220,61,80,0.18)] transition flex items-center gap-4"
                  >
                    <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-cyberlightred overflow-hidden">
                      <img
                        src={proj.mockup}
                        alt={`${proj.name} preview`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-contain scale-[1.35]"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-cyberred mb-1">
                        {proj.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#3f3f3f] line-clamp-2">
                        {proj.tagline}
                      </p>
                    </div>
                    <ArrowRight
                      className="w-5 h-5 text-cyberred shrink-0 group-hover:translate-x-1 transition-transform"
                      strokeWidth={2}
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section
            data-aos="fade-up"
            className="bg-cyberlightred rounded-[24px] p-6 sm:p-10 lg:p-12 flex flex-col items-center text-center gap-5 sm:gap-6"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-cyberred max-w-[820px]">
              Want to put {product.name} to work for your team?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#3f3f3f] max-w-[720px]">
              Book a discovery call and we'll scope an integration that fits
              your workflow, your stakeholders, and your timeline.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[260px] h-11 sm:h-[60px] bg-cyberred text-white rounded-full font-bold text-sm sm:text-xl hover:opacity-90 transition shadow-sm"
              >
                <Mail className="w-4 h-4 sm:w-6 sm:h-6" />
                Get a Quotation
              </button>
              {product.liveUrl && (
                <a
                  href={product.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[240px] h-11 sm:h-[60px] border-2 border-cyberred text-cyberred rounded-full font-bold text-sm sm:text-xl hover:bg-cyberred/5 transition"
                >
                  <ExternalLink className="w-4 h-4 sm:w-6 sm:h-6" />
                  Visit Live Site
                </a>
              )}
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[220px] h-11 sm:h-[60px] border-2 border-cyberred text-cyberred rounded-full font-bold text-sm sm:text-xl hover:bg-cyberred/5 transition"
              >
                Back to Products
                <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <BookingModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

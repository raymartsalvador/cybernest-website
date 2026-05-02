import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  CalendarFold,
  CheckCircle2,
  ExternalLink,
  Mail,
} from "lucide-react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { ProjectDetailSkeleton } from "../components/Skeleton";
import { getProjectBySlug, type Project } from "../data/projects";

interface StatusPillProps {
  status: Project["status"];
}

function StatusPill({ status }: StatusPillProps) {
  const config: Record<Project["status"], { label: string; tone: "live" | "muted" }> = {
    live: { label: "Live in Production", tone: "live" },
    "in-development": { label: "In Development", tone: "muted" },
    archived: { label: "Archived", tone: "muted" },
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

interface CtaButtonsProps {
  liveUrl?: string;
  onBook: () => void;
}

function CtaButtons({ liveUrl, onBook }: CtaButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {liveUrl && (
        <a
          href={liveUrl}
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
        onClick={onBook}
        className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[300px] h-11 sm:h-[60px] border-2 border-cyberred text-cyberred rounded-full font-bold text-sm sm:text-xl hover:bg-cyberred/5 transition"
      >
        <CalendarFold className="w-4 h-4 sm:w-6 sm:h-6" />
        Book a Similar Project
      </button>
    </div>
  );
}

function FeaturePill({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-[rgba(220,61,80,0.15)] rounded-full h-10 sm:h-12 lg:h-[51px] px-3 sm:px-4">
      <CheckCircle2
        className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[30px] lg:h-[30px] text-cyberred shrink-0"
        strokeWidth={2}
      />
      <span className="text-[#473c59] text-sm sm:text-base md:text-lg lg:text-[20px] font-normal leading-none">
        {label}
      </span>
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  if (!project) {
    return <Navigate to="/products" replace />;
  }

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: project.name, path: `/products/projects/${project.slug}` },
  ];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.seo.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    ...(project.liveUrl ? { url: project.liveUrl } : {}),
    ...(project.seo.ogImage ? { image: project.seo.ogImage } : {}),
    brand: {
      "@type": "Brand",
      name: "Cybernest Solutions",
    },
    offers: {
      "@type": "Offer",
      url: "https://www.cybernestsolution.com/contact",
      priceCurrency: "PHP",
      price: "0",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Cybernest Solutions",
      },
    },
  };

  const seo = (
    <Seo
      title={`${project.name} — Case Study | Cybernest Solutions`}
      description={project.seo.description}
      path={`/products/projects/${project.slug}`}
      image={project.seo.ogImage}
      type="article"
      breadcrumbs={breadcrumbItems}
      jsonLd={productSchema}
    />
  );

  if (loading) return <>{seo}<ProjectDetailSkeleton /></>;

  const galleryImages =
    project.gallery && project.gallery.length > 0
      ? project.gallery
      : [{ src: project.mockup, alt: `${project.name} preview` }];

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
              <StatusPill status={project.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold text-cyberred mb-3 sm:mb-4 leading-tight">
              {project.name}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-2xl text-[#3f3f3f] max-w-[1100px] mb-8 sm:mb-10">
              {project.tagline}
            </p>
            <CtaButtons
              liveUrl={project.liveUrl}
              onBook={() => setShowModal(true)}
            />
          </section>

          <section
            data-aos="fade-up"
            aria-label={`${project.name} preview`}
            className="relative bg-white border-2 border-cyberred rounded-[20px] sm:rounded-[24px] w-full aspect-[16/10] sm:aspect-[1255/620] overflow-hidden mb-12 sm:mb-20"
          >
            <img
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-contain scale-[1.25]"
            />
          </section>

          {project.problem && (
            <section data-aos="fade-up" className="mb-12 sm:mb-20">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-cyberred mb-4 sm:mb-5">
                The Problem
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-[22px] text-[#3f3f3f] leading-relaxed max-w-[1100px]">
                {project.problem}
              </p>
            </section>
          )}

          <section data-aos="fade-up" className="mb-12 sm:mb-20">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-cyberred mb-5 sm:mb-7">
              Core Features
            </h2>
            {project.expandedFeatures && project.expandedFeatures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {project.expandedFeatures.map((feature) => (
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 max-w-[820px]">
                {project.features.map((f) => (
                  <FeaturePill key={f} label={f} />
                ))}
              </div>
            )}
          </section>

          {project.techStack && project.techStack.length > 0 && (
            <section data-aos="fade-up" className="mb-12 sm:mb-20">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-cyberred mb-4 sm:mb-5">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {project.techStack.map((tech) => (
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

          {galleryImages.length > 1 && (
            <section data-aos="fade-up" className="mb-12 sm:mb-20">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-cyberred mb-5 sm:mb-7">
                Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {galleryImages.slice(1).map((image, i) => (
                  <div
                    key={i}
                    className="relative bg-white border border-cyberred/20 rounded-2xl overflow-hidden aspect-[4/3]"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-contain scale-[1.2]"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.outcomes && project.outcomes.length > 0 && (
            <section data-aos="fade-up" className="mb-12 sm:mb-20">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-cyberred mb-5 sm:mb-7">
                Outcomes
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {project.outcomes.map((outcome) => (
                  <div
                    key={outcome.label}
                    className="bg-cyberlightred rounded-2xl p-5 sm:p-6 text-center"
                  >
                    <div className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-cyberred mb-1 sm:mb-2">
                      {outcome.metric}
                    </div>
                    <div className="text-xs sm:text-sm text-[#473c59]">
                      {outcome.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.poweredBy.length > 0 && (
            <section data-aos="fade-up" className="mb-12 sm:mb-20">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-cyberred mb-5 sm:mb-7">
                Powered By
              </h2>
              <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                {project.poweredBy.map((logo) => {
                  const img = (
                    <picture className="inline-flex items-center">
                      {logo.avif && (
                        <source srcSet={logo.avif} type="image/avif" />
                      )}
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-10 sm:h-12 w-auto object-contain"
                      />
                    </picture>
                  );
                  return logo.href ? (
                    <Link
                      key={logo.alt}
                      to={logo.href}
                      aria-label={`Learn more about ${logo.alt}`}
                      className="inline-flex items-center hover:opacity-80 transition"
                    >
                      {img}
                    </Link>
                  ) : (
                    <span key={logo.alt}>{img}</span>
                  );
                })}
              </div>
            </section>
          )}

          <section
            data-aos="fade-up"
            className="bg-cyberlightred rounded-[24px] p-6 sm:p-10 lg:p-12 flex flex-col items-center text-center gap-5 sm:gap-6"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-cyberred max-w-[820px]">
              Want something like {project.name} for your team?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#3f3f3f] max-w-[720px]">
              Book a discovery call and we'll scope a build that fits your
              workflow, your stakeholders, and your timeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[300px] h-11 sm:h-[60px] bg-cyberred text-white rounded-full font-bold text-sm sm:text-xl hover:opacity-90 transition shadow-sm"
              >
                <Mail className="w-4 h-4 sm:w-6 sm:h-6" />
                Get a Quotation
              </button>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[260px] h-11 sm:h-[60px] border-2 border-cyberred text-cyberred rounded-full font-bold text-sm sm:text-xl hover:bg-cyberred/5 transition"
                >
                  <ExternalLink className="w-4 h-4 sm:w-6 sm:h-6" />
                  Visit Live Site
                </a>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <BookingModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

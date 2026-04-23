import { useEffect, useRef, useState } from "react";
import { Mail, TvMinimalPlay, CheckCircle2 } from "lucide-react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
import { showPopup } from "../components/PopupService";
import { ProductsSkeleton } from "../components/Skeleton";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import pointflowPreview from "../assets/images/pointflow-preview.webp";
import certifyLogo from "../assets/images/certify-logo.webp";
import certifyLogoAvif from "../assets/images/certify-logo.avif";
import iotSolutionsImg from "../assets/images/services/iot-solutions.png";
import trainingSeminarsImg from "../assets/images/services/training-seminars.png";
import strategicAdvisoryImg from "../assets/images/services/strategic-advisory.webp";

interface ProductImage {
  src: string;
  avif?: string;
}

interface Product {
  name: string;
  description: string;
  features: string[];
  images?: ProductImage[];
  comingSoon?: boolean;
}

const CAROUSEL_INTERVAL_MS = 4000;

function useIsBelowLg() {
  const [isBelow, setIsBelow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsBelow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isBelow;
}

interface Service {
  name: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    name: "IOT Solutions",
    description:
      "Automated monitoring and control through smart infrastructure integration.",
    image: iotSolutionsImg,
  },
  {
    name: "Training Seminars",
    description:
      "Expert-led talks and workshops on digital transformation and emerging tech.",
    image: trainingSeminarsImg,
  },
  {
    name: "Strategic Advisory",
    description:
      "Expert guidance on long-term digital transformation strategy and execution.",
    image: strategicAdvisoryImg,
  },
];

const products: Product[] = [
  {
    name: "Certify+",
    description:
      "Certify is a web application that streamlines certificate creation. It offers customizable templates, custom uploads, and QR legitimacy verification—perfect for organizations or individuals who are constantly issuing certificates in bulk.",
    features: [
      "Certificate Generator",
      "Import & Export Feature",
      "Bulk Email Delivery",
      "Customizable Templates",
    ],
    images: [{ src: certifyLogo, avif: certifyLogoAvif }],
    comingSoon: true,
  },
  {
    name: "PointFlow+",
    description:
      "PointFlow is a system that plugs right into your current setup. It helps you manage appointments, bookings, and waiting lines, making it easy to handle customers whether they are standing in your office or booking from home.",
    features: [
      "Queueing System",
      "Booking System",
      "Appointment System",
      "Easy Integration",
    ],
    images: [{ src: pointflowPreview }],
  },
];

function PaginationDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  const dotCount = count > 0 ? count : 3;
  const interactive = count > 1;
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: dotCount }).map((_, i) => {
        const isActive = count > 0 ? i === active : i === 1;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onSelect(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              isActive
                ? "w-[60px] h-3 bg-cyberred"
                : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
            } ${interactive ? "cursor-pointer" : "cursor-default"}`}
          />
        );
      })}
    </div>
  );
}

function ProductCarousel({
  images,
  name,
  comingSoon,
}: {
  images: ProductImage[];
  name: string;
  comingSoon?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const isMobile = useIsBelowLg();

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length, paused]);

  const handleSelect = (i: number) => {
    setIndex(i);
    setPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
    window.setTimeout(() => setPaused(false), CAROUSEL_INTERVAL_MS * 2);
  };

  return (
    <div
      data-aos={isMobile ? "fade-up" : "fade-right"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative bg-white border-2 border-cyberred rounded-[20px] sm:rounded-[24px] w-full aspect-[4/3] sm:aspect-[587/474] overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${name} preview`}
    >
      {images.map((image, i) => (
        <picture
          key={i}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {image.avif && <source srcSet={image.avif} type="image/avif" />}
          <source srcSet={image.src} type="image/webp" />
          <img
            src={image.src}
            alt={`${name} preview ${i + 1}`}
            width={1600}
            height={1280}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>
      ))}
      {comingSoon && (
        <span className="absolute top-4 right-4 sm:top-5 sm:right-5 inline-flex items-center gap-2 rounded-full border border-cyberred/30 bg-cyberred/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-sm font-semibold uppercase tracking-wider text-cyberred backdrop-blur-sm">
          <span className="inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-cyberred animate-pulse" aria-hidden="true" />
          Coming Soon
        </span>
      )}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <PaginationDots
          count={images.length}
          active={index}
          onSelect={handleSelect}
        />
      </div>
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

function ProductRow({
  product,
  onQuotation,
  onWatchDemo,
}: {
  product: Product;
  onQuotation: () => void;
  onWatchDemo: () => void;
}) {
  const isMobile = useIsBelowLg();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center">
      <ProductCarousel
        images={product.images ?? []}
        name={product.name}
        comingSoon={product.comingSoon}
      />

      <div data-aos={isMobile ? "fade-up" : "fade-left"} className="flex flex-col gap-4 sm:gap-5 lg:gap-[22px]">
        <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-cyberred leading-tight">
          {product.name}
        </h2>
        <p className="text-sm sm:text-base lg:text-[24px] text-[#3f3f3f] leading-normal">
          {product.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
          {product.features.map((f) => (
            <FeaturePill key={f} label={f} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-3">
          <button
            type="button"
            onClick={onQuotation}
            className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[300px] h-11 sm:h-[60px] bg-cyberred text-white rounded-full font-bold text-sm sm:text-xl hover:opacity-90 transition shadow-sm"
          >
            <Mail className="w-4 h-4 sm:w-6 sm:h-6" />
            Get a Quotation
          </button>
          <button
            type="button"
            onClick={onWatchDemo}
            className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[260px] h-11 sm:h-[60px] border-2 border-cyberred text-cyberred rounded-full font-bold text-sm sm:text-xl hover:bg-cyberred/5 transition"
          >
            <TvMinimalPlay className="w-4 h-4 sm:w-6 sm:h-6" />
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  onQuotation,
}: {
  service: Service;
  onQuotation: () => void;
}) {
  return (
    <div
      data-aos="fade-up"
      className="bg-white border-2 border-cyberred rounded-[20px] sm:rounded-[24px] shadow-[0px_4px_10px_2px_rgba(220,61,80,0.1)] p-4 sm:p-6 flex flex-col items-center w-full max-w-[390px] mx-auto"
    >
      <div className="w-full aspect-[337/262] overflow-hidden rounded-[10px] sm:rounded-[12px]">
        <img
          src={service.image}
          alt={`${service.name} illustration`}
          width={337}
          height={262}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-cyberred font-bold text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-center mt-5 sm:mt-8">
        {service.name}
      </h3>
      <p className="text-[#3f3f3f] text-sm sm:text-base md:text-lg lg:text-[20px] text-center mt-3 sm:mt-4 max-w-[330px]">
        {service.description}
      </p>
      <button
        type="button"
        onClick={onQuotation}
        className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full max-w-[300px] h-11 sm:h-[60px] bg-cyberred text-white rounded-full font-bold text-sm sm:text-xl hover:opacity-90 transition shadow-sm mt-5 sm:mt-8"
      >
        <Mail className="w-4 h-4 sm:w-6 sm:h-6" />
        Get a Quotation
      </button>
    </div>
  );
}

export default function Products() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const handleWatchDemo = () => {
    showPopup({
      icon: "info",
      title: "Demo coming soon",
      message: "A product demo video will be available here shortly.",
      confirmText: "OK",
    });
  };

  const productSchema = products.map((p) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    description: p.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
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
  }));

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ];

  const seo = (
    <Seo
      title="Products — Certify+, PointFlow+ & Flow | Cybernest Solutions"
      description="Explore Cybernest's workflow automation products: Certify+ for bulk certificate generation, PointFlow+ for queue & appointment management, and Flow for end-to-end digital transformation."
      path="/products"
      breadcrumbs={breadcrumbItems}
      jsonLd={productSchema}
    />
  );

  if (loading) return <>{seo}<ProductsSkeleton /></>;

  return (
    <div className="font-montserrat text-gray-900 scroll-smooth overflow-x-clip">
      {seo}
      <NavBar />

      <main id="main" tabIndex={-1} className="bg-white pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24 outline-none">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} className="mb-6 sm:mb-8" />
          <h1
            data-aos="fade-up"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold text-cyberred mb-3 sm:mb-4"
          >
            Other Products
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-sm sm:text-base md:text-lg lg:text-2xl text-[#3f3f3f] max-w-[1258px] mb-10 sm:mb-14"
          >
            Discover the future of automated workflow management. FLOW is
            designed to bridge the gap between complex data and intuitive user
            experiences, making high-level operations accessible.
          </p>

          <div className="flex flex-col gap-16 sm:gap-20 lg:gap-[90px]">
            {products.map((p) => (
              <ProductRow
                key={p.name}
                product={p}
                onQuotation={() => setShowModal(true)}
                onWatchDemo={handleWatchDemo}
              />
            ))}
          </div>

          <section className="mt-16 sm:mt-24 lg:mt-32">
            <h2
              data-aos="fade-up"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold text-cyberred mb-3 sm:mb-4"
            >
              Additional Services
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-sm sm:text-base md:text-lg lg:text-[24px] text-[#3f3f3f] max-w-[1258px] mb-10 sm:mb-14"
            >
              In addition to our core solutions, Cybernest IT Solutions provides
              the following services to support your digital transformation
              efforts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-11">
              {services.map((s) => (
                <ServiceCard
                  key={s.name}
                  service={s}
                  onQuotation={() => setShowModal(true)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <BookingModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

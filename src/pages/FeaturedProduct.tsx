import { useState, useCallback } from "react";
import { ExternalLink, Mail, TvMinimalPlay } from "lucide-react";
import BookingModal from "../components/BookingModal";
import { showPopup } from "../components/PopupService";
import certifyLogo from "../assets/images/certify-logo.webp";
import certifyLogoAvif from "../assets/images/certify-logo.avif";

const featured = {
  name: "Certify+",
  liveUrl: "https://certify.cybernestsolution.com/",
  topDescription:
    "Bulk certificate generation with a visual template builder and QR-based verification — built for schools, training centers, and event organizers. Now live with a free tier.",
};

const FeaturedProduct: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleWatchDemo = useCallback(() => {
    showPopup({
      icon: "info",
      title: "Demo coming soon",
      message: "A product demo video will be available here shortly.",
      confirmText: "OK",
    });
  }, []);

  return (
    <section
      id="products"
      className="relative py-16 sm:py-24 font-montserrat bg-white overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <h2
          data-aos="fade-up"
          className="text-3xl sm:text-4xl md:text-[48px] font-bold text-cyberred text-center mb-4"
        >
          Featured Product
        </h2>

        <p
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-base sm:text-lg md:text-[24px] text-[#3f3f3f] text-center max-w-[1190px] mx-auto mb-12 sm:mb-16 font-normal leading-normal"
        >
          {featured.topDescription}
        </p>

        {/* Carousel-style showcase */}
        <div
          data-aos="fade-up"
          className="relative w-full max-w-[1255px] mx-auto aspect-[4/3] sm:aspect-[1255/477] mb-8 sm:mb-10"
        >
          {/* Left side card */}
          <div
            aria-hidden="true"
            className="absolute bg-cyberred border-2 border-cyberred rounded-[24px] left-[-6%] top-[7.34%] w-[28%] h-[85.32%] sm:left-0 sm:w-[40.08%]"
          />
          {/* Right side card */}
          <div
            aria-hidden="true"
            className="absolute bg-cyberred border-2 border-cyberred rounded-[24px] right-[-6%] top-[7.34%] w-[28%] h-[85.32%] sm:right-auto sm:left-[59.92%] sm:w-[40.08%]"
          />
          {/* Center featured card */}
          <div
            className="absolute bg-white border-2 border-cyberred rounded-[24px] overflow-hidden left-[16%] top-0 w-[68%] h-full sm:left-[26.37%] sm:w-[47.01%]"
          >
            <picture>
              <source srcSet={certifyLogoAvif} type="image/avif" />
              <source srcSet={certifyLogo} type="image/webp" />
              <img
                src={certifyLogo}
                alt={`${featured.name} preview`}
                width={1600}
                height={1280}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </picture>
            <span className="absolute top-4 right-4 sm:top-5 sm:right-5 inline-flex items-center gap-2 rounded-full border border-cyberred/30 bg-cyberred/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-sm font-semibold uppercase tracking-wider text-cyberred backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-cyberred animate-pulse" aria-hidden="true" />
              Live Now
            </span>
          </div>
        </div>

        {/* Pagination dots */}
        <div
          data-aos="fade-up"
          className="flex items-center justify-center gap-3 mb-8 sm:mb-10"
          role="tablist"
          aria-label="Featured product slides"
        >
          <span className="w-3 h-3 rounded-full bg-gray-300" aria-hidden="true" />
          <span
            className="w-[60px] h-3 rounded-full bg-cyberred"
            aria-hidden="true"
          />
          <span className="w-3 h-3 rounded-full bg-gray-300" aria-hidden="true" />
        </div>

        <div
          data-aos="fade-up"
          className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-6 max-w-[320px] sm:max-w-none mx-auto"
        >
          <a
            href={featured.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[260px] h-[48px] sm:h-[60px] bg-cyberred text-white rounded-full font-bold text-sm sm:text-xl hover:opacity-90 transition shadow-sm"
          >
            <ExternalLink className="w-4 h-4 sm:w-6 sm:h-6" />
            Visit Certify+
          </a>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[260px] h-[48px] sm:h-[60px] border-2 border-cyberred text-cyberred rounded-full font-bold text-sm sm:text-xl hover:bg-cyberred/5 transition"
          >
            <Mail className="w-4 h-4 sm:w-6 sm:h-6" />
            Get a Quotation
          </button>
          <button
            type="button"
            onClick={handleWatchDemo}
            className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[220px] h-[48px] sm:h-[60px] border-2 border-cyberred text-cyberred rounded-full font-bold text-sm sm:text-xl hover:bg-cyberred/5 transition"
          >
            <TvMinimalPlay className="w-4 h-4 sm:w-6 sm:h-6" />
            Watch Demo
          </button>
        </div>
      </div>

      <BookingModal show={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
};

export default FeaturedProduct;

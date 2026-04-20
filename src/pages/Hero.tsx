import { useState } from "react";
import { Link } from "react-router-dom";
import BookingModal from "../components/BookingModal";
import heroAsset from "../assets/images/hero-asset2.webp";
import { BadgeCheck, Puzzle, Package } from "lucide-react";

const Hero: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section
      id="hero"
      className="relative bg-white pt-24 sm:pt-32 pb-0 px-4 sm:px-6 font-montserrat overflow-hidden"
    >
      {/* Text Content */}
      <div className="text-center max-w-5xl mx-auto z-10 relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2.5 bg-[rgba(220,61,80,0.15)] px-3 sm:px-10 py-1.5 sm:py-4 rounded-full text-[11px] sm:text-base font-normal text-cyberviolet mt-4 sm:mt-6 mb-3">
          <BadgeCheck className="text-cyberred flex-shrink-0 w-3.5 h-3.5 sm:w-5 sm:h-5" />
          <span className="whitespace-nowrap">Keep Flowing Forward with Cybernest Solutions</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold leading-tight lg:leading-[80px] mb-4 sm:mb-6">
          <span className="text-cyberred">Ready to GROW?</span>
          <br />
          <span className="text-[#5d5272]">We've got the </span>
          <span className="relative inline-block text-[#5d5272]">
            <span className="relative z-10">FLOW.</span>
            <div
              className="absolute -inset-x-3 -inset-y-1 pointer-events-none z-0"
              aria-hidden="true"
              style={{
                backgroundColor: 'rgba(220, 61, 80, 0.04)',
                backgroundImage:
                  'linear-gradient(to right, rgba(220, 61, 80, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(220, 61, 80, 0.12) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            >
              <span className="absolute top-0 left-0 w-2 h-2 bg-cyberred -translate-x-1/2 -translate-y-1/2" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-cyberred translate-x-1/2 -translate-y-1/2" />
              <span className="absolute bottom-0 left-0 w-2 h-2 bg-cyberred -translate-x-1/2 translate-y-1/2" />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-cyberred translate-x-1/2 translate-y-1/2" />
            </div>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-2xl text-cyberviolet font-normal max-w-3xl mx-auto leading-normal mb-4 sm:mb-6 px-2 sm:px-0">
          Cybernest streamlines traditional workflows through AI solutions, turning
          <br className="hidden sm:inline" />
          complex legacy operations into seamless digital experiences.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 mb-0 px-4 sm:px-0">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2.5 bg-cyberred cursor-pointer text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-lg sm:text-xl font-bold shadow-md hover:opacity-90 transition w-full sm:w-auto"
          >
            <Puzzle size={24} className="flex-shrink-0" />
            Get Started
          </button>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2.5 border-2 border-cyberred text-cyberred px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-lg sm:text-xl font-bold hover:bg-cyberred/5 transition w-full sm:w-auto text-center"
          >
            <Package size={24} className="flex-shrink-0" />
            View all Products
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative mx-auto max-w-7xl z-10">
        <div className="flex justify-center">
          <img
            src={heroAsset}
            alt="Cybernest workflow automation dashboard with queueing and appointment UI"
            width={3000}
            height={2004}
            fetchPriority="high"
            decoding="async"
            data-aos="fade-up"
            className="w-full max-w-[500px] sm:max-w-[700px] md:max-w-[900px] lg:max-w-[1200px] h-auto"
          />
        </div>
      </div>

      {/* Stats Banner */}
      <div className="relative z-10 max-w-7xl mx-auto mt-0 px-4 sm:px-6">
        <div className="bg-cyberred rounded-[40px] py-8 sm:py-10 md:py-12 px-6 sm:px-10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-center text-white">
          {[
            {
              value: "98%",
              titleBold: "Client satisfaction",
              descLines: ["Rate across our digital", "transformation projects."],
            },
            {
              value: "10+",
              titleBold: "Startups and Enterprises",
              descLines: ["Successfully integrated", "into our ecosystem."],
            },
            {
              value: "24/7",
              titleBold: "Dedicated Support",
              descLines: ["And creative consulting", "for your systems."],
            },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <p className="text-5xl sm:text-6xl md:text-[64px] font-bold leading-tight mb-3">
                {stat.value}
              </p>
              <p className="text-lg sm:text-xl font-bold leading-normal">
                {stat.titleBold}
              </p>
              <div className="mt-1 text-base sm:text-lg font-normal leading-normal">
                {stat.descLines.map((line, j) => (
                  <p key={j}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BookingModal show={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
};

export default Hero;

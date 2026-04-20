import { useState } from "react";
import { Mail } from "lucide-react";
import BookingModal from "../components/BookingModal";
import certifiedExcellencePhoto from "../assets/images/about/certified-excellence.png";

export default function CertifiedExcellence() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section
      id="certified-excellence"
      className="font-montserrat bg-white py-16 px-4 sm:px-6 lg:px-12 xl:px-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          data-aos="fade-up"
          className="text-3xl sm:text-4xl md:text-[48px] font-bold text-cyberred text-center mb-10 md:mb-14"
        >
          Certified Excellence
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div
            data-aos="fade-right"
            className="order-2 lg:order-1 flex flex-col gap-6"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-cyberred leading-tight">
              We, at Cybernest Solutions
            </h3>

            <div className="flex flex-col gap-6 text-base sm:text-lg lg:text-[24px] text-[#3f3f3f] leading-normal">
              <p>
                Believe that superior technology starts with superior minds.
                Cybernest is powered by a synergy of certified Computer
                Engineers and MBA professionals dedicated to a philosophy of
                continuous learning and professional mentorship.
              </p>
              <p>
                Rooted in strong academic degrees and fueled by a relentless
                drive for innovation, our team merges technical mastery with
                strategic foresight. This ensures that our AI-driven solutions
                are not just built for today, but are designed to evolve
                alongside the businesses we serve.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto sm:min-w-[340px] lg:min-w-[415px] h-[60px] px-8 bg-cyberred text-white rounded-full font-bold text-lg sm:text-xl hover:opacity-90 transition shadow-sm shrink-0 mt-2"
            >
              <Mail className="w-6 h-6" strokeWidth={2} />
              Get a Quotation
            </button>
          </div>

          <div
            data-aos="fade-left"
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <img
              src={certifiedExcellencePhoto}
              alt="Certified Cybernest professional with trophy and graduation cap"
              width={2155}
              height={2018}
              loading="lazy"
              decoding="async"
              className="w-full max-w-[637px] h-auto object-contain"
            />
          </div>
        </div>
      </div>

      <BookingModal show={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}

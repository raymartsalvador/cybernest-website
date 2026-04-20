import { useState } from "react";
import { UserRoundPlus } from "lucide-react";
import BookingModal from "../components/BookingModal";
import aboutPhoto1 from "../assets/images/about/about-1.png";
import aboutPhoto2 from "../assets/images/about/about-2.png";
import aboutPhoto3 from "../assets/images/about/about-3.png";
import aboutPhoto4 from "../assets/images/about/about-4.png";
import aboutPhoto5 from "../assets/images/about/about-5.png";

export default function AboutUs() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section
      id="about"
      className="font-montserrat bg-white pt-6 pb-16 sm:pt-8 px-4 sm:px-6 lg:px-12 xl:px-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <h1
          data-aos="fade-up"
          className="text-3xl sm:text-4xl md:text-[48px] font-bold text-cyberred text-center mb-10 md:mb-14"
        >
          About Us
        </h1>

        {/* Mobile collage */}
        <div data-aos="fade-up" className="md:hidden space-y-4">
          <div className="rounded-2xl overflow-hidden aspect-square">
            <img
              src={aboutPhoto1}
              alt="Cybernest team on site"
              width={2048}
              height={1536}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden aspect-[500/235]">
              <img
                src={aboutPhoto2}
                alt="Cybernest partnership meeting"
                width={2048}
                height={1536}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[500/235]">
              <img
                src={aboutPhoto3}
                alt="Big idea showcase"
                width={2048}
                height={1536}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[500/235]">
              <img
                src={aboutPhoto4}
                alt="Startup roadshow"
                width={1536}
                height={2048}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[500/235]">
              <img
                src={aboutPhoto5}
                alt="Team gathering"
                width={2048}
                height={1536}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Desktop collage (md+) */}
        <div
          data-aos="fade-up"
          className="hidden md:grid grid-cols-12 grid-rows-2 gap-5 lg:gap-[30px] md:aspect-[1260/500]"
        >
          <div className="col-span-5 row-span-2 rounded-2xl overflow-hidden">
            <img
              src={aboutPhoto1}
              alt="Cybernest team on site"
              width={2048}
              height={1536}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-5 rounded-2xl overflow-hidden">
            <img
              src={aboutPhoto2}
              alt="Cybernest partnership meeting"
              width={2048}
              height={1536}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-2 rounded-2xl overflow-hidden">
            <img
              src={aboutPhoto3}
              alt="Big idea showcase"
              width={2048}
              height={1536}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-3 rounded-2xl overflow-hidden">
            <img
              src={aboutPhoto4}
              alt="Startup roadshow"
              width={1536}
              height={2048}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-4 rounded-2xl overflow-hidden">
            <img
              src={aboutPhoto5}
              alt="Team gathering"
              width={2048}
              height={1536}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mt-10 md:mt-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
          <p
            data-aos="fade-right"
            className="text-base sm:text-lg lg:text-[24px] text-[#3f3f3f] leading-normal max-w-[891px]"
          >
            We are a creative team dedicated to building digital solutions for
            startups or enterprises looking to scale their impact within the
            industry.
          </p>
          <button
            data-aos="fade-left"
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto sm:min-w-[290px] h-[60px] px-8 bg-cyberred text-white rounded-full font-bold text-lg sm:text-xl hover:opacity-90 transition shadow-sm shrink-0"
          >
            <UserRoundPlus className="w-6 h-6" strokeWidth={2} />
            Join our Team
          </button>
        </div>
      </div>

      <BookingModal show={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}

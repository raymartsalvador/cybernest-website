import { useState } from "react";
import { ArrowRight, BadgeCheck } from "lucide-react";
import BookingModal from "../components/BookingModal";
import laptop from "../assets/images/hero-laptop.png";
import leftCard from "../assets/images/left-card.png";
import rightCard from "../assets/images/right-card.png";
import dostLogo from "../assets/images/dost-logo.png";
import pupLogo from "../assets/images/pup-logo.png";
import tbidoLogo from "../assets/images/tbido-logo.png";
import gridBox from "../assets/images/grid-box.png";
import gridBg from "../assets/images/grid-bg.png";

const Hero: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section
      id="hero"
      className="relative bg-white pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 font-montserrat overflow-hidden"
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${gridBg})`,
        }}
      />

      {/* Text Content */}
      <div className="text-center max-w-4xl mx-auto z-10 relative">
        {/* Incubation Label */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#F8F1F2] px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium text-cyberviolet mb-3 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <img src={tbidoLogo} alt="TBIDO" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            <img src={pupLogo} alt="PUP" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            <img src={dostLogo} alt="DOST" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
          </div>
          <span className="whitespace-nowrap">Powered by PUP PYLON TBI</span>
          <BadgeCheck size={16} className="text-cyberred flex-shrink-0" />
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-tight mb-4 sm:mb-6">
          <div className="flex items-center justify-center flex-wrap">
            <span className="text-cyberred mr-1">Always</span>
            <span
              className="inline-flex items-center justify-center text-cyberred font-extrabold mx-1"
              style={{
                backgroundImage: `url(${gridBox})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                width: "clamp(120px, 25vw, 160px)",
                height: "clamp(45px, 8vw, 60px)",
                lineHeight: "1",
              }}
            >
              <span className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-[56px]">
                Flow
              </span>
            </span>
            <span className="text-cyberviolet ml-1">Forward.</span>
          </div>
        </h1>

        {/* Subtext */}
        <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-xl sm:max-w-2xl mt-[-10px] sm:mt-[-15px] mx-auto leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">
          Cybernest provides digital solutions for managing queues, services, and workflows. Built
          for institutions aiming to reduce delays, enhance coordination, and deliver seamless user
          experiences in high-demand environments.
        </p>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 px-4 sm:px-0">
          <button
            onClick={() => setShowModal(true)}
            className="bg-cyberred slow-beat-animation cursor-pointer text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold shadow-md hover:opacity-90 flex items-center justify-center gap-2 transition w-full sm:w-auto"
          >
            Get Started <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>

      {/* Visuals */}
      <div className="relative mx-auto max-w-7xl">
        <div className="flex justify-center items-center relative z-10 px-2 sm:px-4">
          <img
            src={leftCard}
            alt="Left Card"
            data-aos="fade-right"
            className="absolute left-0 bottom-0 w-[100px] xs:w-[120px] sm:w-[180px] md:w-[220px] lg:w-[280px] xl:w-[320px] drop-shadow-xl z-20 transform 
              translate-x-[15%] sm:translate-x-[5%] lg:translate-x-[10%] xl:translate-x-[15%] 
              -translate-y-[25px] sm:-translate-y-[40px] md:-translate-y-[60px] lg:-translate-y-[80px]"
          />

          <img
            src={laptop}
            alt="Laptop UI"
            data-aos="fade-up"
            className="w-full max-w-[250px] xs:max-w-[320px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[700px] xl:max-w-[800px] z-10 relative"
          />

          <img
            src={rightCard}
            alt="Right Card"
            data-aos="fade-left"
            className="absolute right-0 bottom-0 w-[100px] xs:w-[120px] sm:w-[180px] md:w-[200px] lg:w-[240px] xl:w-[280px] 
              h-[150px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover drop-shadow-xl z-20 transform 
              translate-x-[-15%] sm:translate-x-[-5%] lg:translate-x-[-15%] xl:translate-x-[-20%] 
              -translate-y-[25px] sm:-translate-y-[40px] md:-translate-y-[60px] lg:-translate-y-[80px]"
          />
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal show={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
};

export default Hero;

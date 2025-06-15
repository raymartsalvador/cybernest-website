import { ArrowRight, Puzzle, BadgeCheck } from "lucide-react";
import laptop from "../assets/images/hero-laptop.png";
import leftCard from "../assets/images/left-card.png";
import rightCard from "../assets/images/right-card.png";
import dostLogo from "../assets/images/dost-logo.png";
import pupLogo from "../assets/images/pup-logo.png";
import tbidoLogo from "../assets/images/tbido-logo.png";
import gridBox from "../assets/images/grid-box.png";
import gridBg from "../assets/images/grid-bg.png"; // ✅ Import background image

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative bg-white pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 font-montserrat overflow-hidden"
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${gridBg})`, // ✅ Use imported image
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
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-tight mb-4 sm:mb-6 whitespace-nowrap">
          <span className="text-cyberred">Always </span>
          <span
            className="inline-flex items-center justify-center text-cyberred font-extrabold"
            style={{
              backgroundImage: `url(${gridBox})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
              width: "120px",
              height: "60px",
              lineHeight: "1",
            }}
          >
            <span className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-[56px]">Flow</span>
          </span>{" "}
          <span className="text-cyberviolet">Forward.</span>
        </h1>

        {/* Subtext */}
        <p className="text-xs sm:text-base text-gray-600 max-w-xl sm:max-w-2xl mt-[-10px] sm:mt-[-20px] mx-auto leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">
          Cybernest provides digital solutions for managing queues, services, and workflows. Built
          for institutions aiming to reduce delays, enhance coordination, and deliver seamless user
          experiences in high-demand environments.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 px-4 sm:px-0">
          <a
            href="https://calendly.com/tlvelardo-pup/30min"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-cyberred slow-beat-animation cursor-pointer text-white px-6 py-2.5 sm:py-2 rounded-full font-semibold shadow-md hover:opacity-90 flex items-center justify-center gap-2 transition w-full sm:w-auto">
              Get Started <ArrowRight size={18} />
            </button>
          </a>
        </div>
      </div>

      {/* Visuals Only (Laptop + Cards) */}
      <div className="relative mx-auto max-w-7xl">
        <div className="flex justify-center items-center relative z-10 px-2 sm:px-4">
          {/* Left Card */}
          <img
            src={leftCard}
            alt="Left Card"
            data-aos="fade-right"
            className="absolute left-0 bottom-0 w-[120px] xs:w-[150px] sm:w-[200px] md:w-[250px] lg:w-[320px] xl:w-[350px] drop-shadow-xl z-20 transform 
              translate-x-[10%] sm:translate-x-[0%] lg:translate-x-[10%] xl:translate-x-[15%] 
              -translate-y-[30px] sm:-translate-y-[60px] lg:-translate-y-[80px] xl:-translate-y-[90px]"
          />

          {/* Laptop Image */}
          <img
            src={laptop}
            alt="Laptop UI"
            data-aos="fade-up"
            className="w-full max-w-[300px] xs:max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[750px] xl:max-w-[850px] z-10 relative"
          />

          {/* Right Card */}
          <img
            src={rightCard}
            alt="Right Card"
            data-aos="fade-left"
            className="absolute right-0 bottom-0 w-[120px] xs:w-[150px] sm:w-[200px] md:w-[220px] lg:w-[260px] xl:w-[300px] 
              h-[180px] sm:h-[400px] md:h-[440px] lg:h-[520px] xl:h-[600px] object-cover drop-shadow-xl z-20 transform 
              translate-x-[-10%] sm:translate-x-[0%] lg:translate-x-[-15%] xl:translate-x-[-25%] 
              -translate-y-[35px] sm:-translate-y-[60px] lg:-translate-y-[80px] xl:-translate-y-[90px]"
          />
        </div>
      </div>
    </section>
  );
}

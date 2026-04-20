import cybernestIcon from "../assets/images/cybernest-icon.png";

export default function Footer() {
  return (
    <footer className="relative bg-white font-montserrat pt-32 sm:pt-36 pb-8 sm:pb-12">
      {/* Cybernest icon + circles - centered, overlapping the red card */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10 flex items-center justify-center">
        {/* Outer circle */}
        <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] rounded-full bg-gradient-to-b from-white to-gray-200 flex items-center justify-center shadow-md">
          {/* Inner circle */}
          <div className="w-[170px] h-[170px] sm:w-[210px] sm:h-[210px] rounded-full bg-gradient-to-b from-white to-gray-100 flex items-center justify-center">
            <img
              src={cybernestIcon}
              alt="Cybernest"
              width={4096}
              height={4096}
              loading="lazy"
              decoding="async"
              className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] object-contain"
            />
          </div>
        </div>
      </div>

      {/* Red card */}
      <div className="relative mx-4 sm:mx-8 lg:mx-auto max-w-[1260px] bg-cyberred rounded-[24px] pt-28 sm:pt-32 pb-10 sm:pb-12 px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Left side */}
          <div className="text-white">
            <h2 className="text-3xl sm:text-[40px] font-bold mb-3 leading-tight">
              Lets Talk!
            </h2>
            <p className="text-base sm:text-xl font-normal leading-relaxed max-w-[466px]">
              "In Cybernest, we ensure solutions that are not just functional — but exceptional"
            </p>
          </div>

          {/* Right side - Contact info */}
          <div className="text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">
              Contact us at
            </h3>
            <div className="space-y-2 text-base sm:text-xl font-normal">
              <p>cns@cybernestsolution.com</p>
              <p>facebook.com/CybernestSolutions</p>
              <p>cybernestsolutionph@gmail.com</p>
              <p>0976-179-1990 | 0928-901-0072</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-white text-base sm:text-xl font-normal mt-8 sm:mt-12">
          &copy; 2026 Cybernest Solutions. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

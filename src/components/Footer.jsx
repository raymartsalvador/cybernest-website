import { Link } from "react-router-dom";
import cybernestIcon from "../assets/images/cybernest-icon.webp";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const legalLinks = [
  { label: "Privacy Notice", to: "/privacy" },
  { label: "Cookie Policy", to: "/cookies" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Accessibility", to: "/accessibility" },
];

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
        {/* Tagline */}
        <div className="text-white mb-10 sm:mb-14 max-w-[640px]">
          <h2 className="text-3xl sm:text-[40px] font-bold mb-3 leading-tight">
            Let's Talk!
          </h2>
          <p className="text-base sm:text-xl font-normal leading-relaxed">
            "In Cybernest, we ensure solutions that are not just functional — but exceptional."
          </p>
        </div>

        {/* Link columns */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 text-white"
        >
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 uppercase tracking-wide">
              Explore
            </h3>
            <ul className="space-y-2 text-sm sm:text-base font-normal">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/90 hover:text-white hover:underline transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-2 text-sm sm:text-base font-normal">
              <li>
                <a
                  href="mailto:cns@cybernestsolution.com"
                  className="text-white/90 hover:text-white hover:underline transition"
                >
                  cns@cybernestsolution.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:cybernestsolutionph@gmail.com"
                  className="text-white/90 hover:text-white hover:underline transition"
                >
                  cybernestsolutionph@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+639761791990"
                  className="text-white/90 hover:text-white hover:underline transition"
                >
                  0976-179-1990 (Support)
                </a>
              </li>
              <li>
                <a
                  href="tel:+639289010072"
                  className="text-white/90 hover:text-white hover:underline transition"
                >
                  0928-901-0072 (Sales)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 uppercase tracking-wide">
              Connect
            </h3>
            <ul className="space-y-2 text-sm sm:text-base font-normal">
              <li>
                <a
                  href="https://www.facebook.com/CybernestSolutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white hover:underline transition"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 uppercase tracking-wide">
              Legal
            </h3>
            <ul className="space-y-2 text-sm sm:text-base font-normal">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/90 hover:text-white hover:underline transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:privacy@cybernestsolution.com"
                  className="text-white/90 hover:text-white hover:underline transition"
                >
                  Data Protection Officer
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Copyright */}
        <div className="text-white/90 text-sm sm:text-base font-normal mt-10 sm:mt-14 pt-6 border-t border-white/20">
          <p>&copy; 2026 Cybernest Solutions. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useState, useRef, useCallback } from "react";
import { Menu, CircleUserRound, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.webp";
import BookingModal from "../components/BookingModal";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();
  const isProductsPage = pathname === "/products";
  const isAboutPage = pathname === "/about";
  const isContactPage = pathname === "/contact";
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (isProductsPage) {
      setActiveSection("products");
      return;
    }
    if (isAboutPage) {
      setActiveSection("about");
      return;
    }
    if (isContactPage) {
      setActiveSection("contact");
      return;
    }
    const sections = ["hero", "products", "about", "purpose", "team"];
    const handler = () => {
      const scrollY = window.scrollY + 100;
      for (let i = 0; i < sections.length; i++) {
        const section = document.getElementById(sections[i]);
        if (section && scrollY >= section.offsetTop) {
          setActiveSection(sections[i]);
        }
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [isProductsPage, isAboutPage, isContactPage]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  const handleNavClick = useCallback(
    (e, item) => {
      e.preventDefault();
      if (item.to) {
        navigate(item.to);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (!isHomePage) {
        navigate(`/#${item.href}`);
      } else {
        const element = document.getElementById(item.href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
      setTimeout(() => setMenuOpen(false), 150);
    },
    [navigate, isHomePage]
  );

  const handleGetStarted = useCallback(() => {
    setMenuOpen(false);
    setShowModal(true);
  }, []);

  const navLinks = [
    { label: "Home", href: "hero" },
    { label: "Products", href: "products", to: "/products" },
    { label: "About", href: "about", to: "/about" },
    { label: "Contact", href: "contact", to: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center py-3 font-montserrat">
      <nav
        className="relative flex items-center w-full max-w-6xl mx-auto px-6 md:px-10 bg-white rounded-full h-[70px] md:h-[90px] border-2 border-cyberred"
      >
        {/* Logo */}
        <div className="flex items-center cursor-pointer">
          <a href="#hero" aria-label="Cybernest home">
            <img
              src={logo}
              alt="Cybernest Logo"
              width={2693}
              height={740}
              decoding="async"
              className="h-8 md:h-[50px] w-auto"
            />
          </a>
        </div>

        {/* Desktop Nav (centered) */}
        <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-10 items-center">
          {navLinks.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <li key={item.href}>
                <a
                  href={item.to ?? `#${item.href}`}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`text-base transition whitespace-nowrap ${
                    isActive
                      ? "text-cyberred font-bold"
                      : "text-cyberviolet font-normal hover:text-cyberred"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right side: Settings + CTA + Mobile toggle */}
        <div className="flex items-center gap-4 ml-auto">
          <button
            type="button"
            aria-label="Account"
            className="hidden sm:inline-flex text-cyberred hover:opacity-80 transition"
          >
            <CircleUserRound size={28} strokeWidth={2} />
          </button>
          <button
            type="button"
            className="hidden sm:flex items-center justify-center h-9 w-[140px] bg-cyberred text-white text-sm font-bold rounded-3xl shadow-[0_2px_2px_0_rgba(0,0,0,0.1)] hover:opacity-90 transition"
            onClick={handleGetStarted}
          >
            Get Started!
          </button>
          <button
            ref={menuButtonRef}
            className="md:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`md:hidden bg-white w-[calc(100%-1.5rem)] mx-3 rounded-2xl shadow border border-cyberred px-6 py-4 absolute top-[80px] left-0 right-0 z-40 transition-all duration-200 ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col gap-4 text-base font-medium">
          {navLinks.map((item) => (
            <li key={item.href}>
              <a
                href={item.to ?? `#${item.href}`}
                onClick={(e) => handleNavClick(e, item)}
                className={`block py-1 transition ${
                  activeSection === item.href
                    ? "text-cyberred font-bold"
                    : "text-cyberviolet hover:text-cyberred"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <button
              className="mt-2 w-full bg-cyberred text-white py-2 rounded-full text-sm font-bold hover:opacity-90 transition"
              onClick={handleGetStarted}
            >
              Get Started!
            </button>
          </li>
        </ul>
      </div>

      <BookingModal show={showModal} onClose={() => setShowModal(false)} />
    </header>
  );
}

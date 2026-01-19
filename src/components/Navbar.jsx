import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import logo from "../assets/images/logo.png";
import BookingModal from "../components/BookingModal";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Track active section on scroll
  useEffect(() => {
    const sections = ["hero", "products", "about", "purpose", "team", "contact"];
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
  }, []);

  // Close menu when clicking outside
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

  // Close menu on escape key
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

  // Close menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    const element = document.getElementById(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    // Delay closing menu slightly for visual feedback
    setTimeout(() => setMenuOpen(false), 150);
  }, []);

  const handleGetStarted = useCallback(() => {
    setMenuOpen(false);
    setShowModal(true);
  }, []);

  const navLinks = [
    { label: "Home", href: "hero" },
    { label: "Products", href: "products", icon: <ChevronDown size={14} /> },
    { label: "About", href: "about" },
    { label: "Partners", href: "purpose" },
    { label: "Contact", href: "contact" },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-40 bg-white flex justify-center py-4 font-montserrat">
      <nav
        className="flex items-center justify-between w-full max-w-5xl mx-auto px-4 md:px-8 bg-white rounded-full h-[52px]"
        style={{ border: "1px solid #DC3D50" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <a href="#hero">
            <img src={logo} alt="Cybernest Logo" className="h-6 w-auto" />
          </a>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 lg:gap-8 text-xs font-medium items-center">
          {navLinks.map((item) => (
            <li key={item.href} className="flex items-center gap-1">
              <a
                href={`#${item.href}`}
                className={`cursor-pointer transition ${
                  activeSection === item.href
                    ? "text-cyberred font-bold"
                    : "hover:text-cyberred"
                }`}
              >
                {item.label}
              </a>
              {item.icon}
            </li>
          ))}
        </ul>

        {/* CTA & Menu Toggle */}
        <div className="flex items-center gap-2">
          <button
            className="hidden cursor-pointer sm:flex px-4 py-1.5 bg-cyberred text-white text-xs font-semibold rounded-full shadow hover:opacity-90 transition"
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
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`md:hidden bg-white w-full shadow border-t border-cyberred px-6 py-4 absolute top-[60px] left-0 z-40 transition-all duration-200 ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col gap-4 text-sm font-medium">
          {navLinks.map((item) => (
            <li key={item.href}>
              <a
                href={`#${item.href}`}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`block py-1 transition ${
                  activeSection === item.href
                    ? "text-cyberred font-bold"
                    : "hover:text-cyberred"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <button
              className="mt-2 w-full bg-cyberred text-white py-2 rounded-full text-xs font-semibold hover:opacity-90 transition"
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

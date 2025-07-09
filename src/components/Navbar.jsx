import { useEffect, useState } from "react";
import { ChevronDown, Settings, Menu, X } from "lucide-react";
import logo from "../assets/images/logo.png";
import BookingModal from "../components/BookingModal";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
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

  const navLinks = [
    { label: "Home", href: "hero" },
    { label: "Products", href: "products", icon: <ChevronDown size={14} /> },
    { label: "About", href: "about" },
    { label: "Partners", href: "purpose" },
    { label: "Our Team", href: "team" },
    { label: "Contact", href: "contact" },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-40 bg-white flex justify-center py-4 font-montserrat md:">
      <nav
          className="flex items-center justify-between w-full max-w-5xl mx-auto px-4 md:px-8 bg-white rounded-full h-[52px]"
          style={{ border: "1px solid #DC3D50" }}
        >
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
         <a href="hero"> <img src={logo} alt="Cybernest Logo" className="h-6 w-auto" /></a>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 lg:gap-8 text-xs font-medium items-center">
          {navLinks.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              <a
                href={`#${item.href}`}
                className={`cursor-pointer transition ${
                  activeSection === item.href ? "text-cyberred font-bold" : "hover:text-cyberred"
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
          <button className="hidden cursor-pointer sm:flex px-4 py-1.5 bg-cyberred text-white text-xs font-semibold rounded-full shadow hover:opacity-90 transition"
          
                onClick={() => setShowModal(true)}
          >
            Get Started!
          </button>
          <button
            className="md:hidden p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white w-full shadow border-t border-cyberred px-6 py-4 absolute top-[60px] left-0 z-40">
          <ul className="flex flex-col gap-4 text-sm font-medium">
            {navLinks.map((item, index) => (
              <li key={index}>
                <a
                  href={`#${item.href}`}
                  onClick={() => setMenuOpen(false)}
                  className={`block transition ${
                    activeSection === item.href ? "text-cyberred font-bold" : "hover:text-cyberred"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <button className="mt-2 w-full bg-cyberred text-white py-2 rounded-full text-xs font-semibold"
                onClick={() => setShowModal(true)}
              >
                Get Started!
              </button>
            </li>
          </ul>
        </div>
      )}
      <BookingModal show={showModal} onClose={() => setShowModal(false)} />
    </header>
  );
}

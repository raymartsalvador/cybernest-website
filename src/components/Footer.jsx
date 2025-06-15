import logo from "../assets/images/logo.png";
import { Facebook, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-sm text-gray-600 font-montserrat px-4 sm:px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-6">
        {/* Logo & Description */}
        <div className="md:col-span-2 flex flex-col items-start">
          <img src={logo} alt="Cybernest Logo" className="h-10 mb-4" />
          <p className="text-xs mb-1">Skip the search for the best home loan rates.</p>
          <p className="text-xs">Let the best rates find you!</p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://web.facebook.com/CybernestSolutions"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-5 w-5 cursor-pointer hover:text-cyberred transition" />
            </a>
            <a
              href="https://www.linkedin.com/company/cybernestsolutions/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-5 w-5 cursor-pointer hover:text-cyberred transition" />
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Company */}
          <div>
            <h4 className="font-bold text-cyberred mb-2">Company</h4>
            <ul className="space-y-1 text-xs">
              <li>
                <a href="#about" className="hover:text-cyberred transition">About</a>
              </li>
              <li>
                <a href="#" className="hover:text-cyberred transition">FAQs</a>
              </li>

            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-cyberred mb-2">Features</h4>
            <ul className="space-y-1 text-xs">
              <li>
                <a href="#products" className="hover:text-cyberred transition">Flow</a>
              </li>
              <li>
                <a href="#products" className="hover:text-cyberred transition">Flow+</a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="text-xs">
            <h4 className="font-bold text-cyberred mb-2 text-sm">Contacts</h4>
            <p className="mb-2">
              <span className="font-bold text-cyberred">Company Email:</span> cybernestsolutionph.com
            </p>
            <p>
              <span className="font-bold text-cyberred">Company Address:</span> NALLRC TBIDO PUP, Anonas Street, Sta. Mesa, Manila, Philippines 1016.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 mt-6">
        Copyright © 2025 Cybernest Solutions. All Rights Reserved.
      </div>
    </footer>
  );
}

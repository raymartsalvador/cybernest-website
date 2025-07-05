import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import flow from "../assets/images/flow.png";
import { CheckCircle } from "lucide-react";

const FlowPopup = () => {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 flex flex-col md:flex-row items-center relative"
        onClick={stopPropagation}
      >
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#DC3D50] text-2xl"
          aria-label="Close"
        >
          ×
        </button>
        {/* Content */}
        <div className="md:w-2/3 md:px-10">
          <img
            src={logo}
            alt="Cybernest Solutions Logo"
            className="h-8 mb-6"
          />
          <h2 className="text-[#DC3D50] font-bold text-xl mb-1">
            Why Let Hassle Disrupt Your workflow?
          </h2>
          <p className="text-lg mb-4">
            Be our partner and get{" "}
            <img src={flow} alt="FLOW" className="inline h-5 align-middle mx-1" /> system for <strong>FREE!</strong>
          </p>
          <ul className="mb-4 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500 w-5 h-5" />
              Appointment System
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500 w-5 h-5" />
              Registration System
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500 w-5 h-5" />
              CRM Dashboard
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500 w-5 h-5" />
              Workflow Tracking
            </li>
          </ul>
          <p className="text-sm mb-6 pr-10">
           Book your appointment today! ELIMINATE the bottlenecks, OPTIMIZE your operations, and MOVE forward with FLOW!
          </p>
          <a
            href="#"
            className="bg-[#DC3D50] hover:bg-[#b62d42] text-white py-1 px-6 rounded-full inline-block"
          >
            Get your <span className="font-bold">FREE FLOW SYSTEM</span> here!
          </a>
        </div>
        {/* Right side image */}
        <div className="md:w-1/3 mt-6 md:mt-0 flex justify-center">
          <img
            src="/popup-illustration.png"
            alt="Flow System Illustration"
            className="w-52 h-auto rounded-xl"
          />
        </div>
        {/* Remind me Later button - ABSOLUTE BOTTOM CENTER */}
        <button
          onClick={() => setOpen(false)}
          className="absolute left-1/2 -bottom-10 transform cursor-pointer -translate-x-1/2 text-white text-lg px-6 hover:text-[#DC3D50]"
        >
          Remind me Later
        </button>
      </div>
    </div>
  );
};

export default FlowPopup;

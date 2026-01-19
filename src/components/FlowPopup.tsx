import React, { useState, useEffect, MouseEvent } from "react";
import logo from "../assets/images/logo.png";
import flow from "../assets/images/flow.png";
import { CheckCircle } from "lucide-react";
import rightImage from "../assets/images/right-image.png";
import gridBG from "../assets/images/grid-bg.png";
import BookingModal from "../components/BookingModal";

const FlowPopup: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Disable horizontal scroll on body while open
  useEffect(() => {
    if (open) {
      document.body.style.overflowX = "hidden";
    } else {
      document.body.style.overflowX = "";
    }
    return () => {
      document.body.style.overflowX = "";
    };
  }, [open]);

  // Handle escape key to close popup
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  if (!open) return null;

  const stopPropagation = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/80 p-4 overflow-hidden"
      onClick={() => setOpen(false)}
    >
      <div
        data-aos="fade-right"
        className="bg-white rounded-2xl shadow-xl w-full max-w-[95vw] md:max-w-4xl 2xl:max-w-6xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center relative overflow-hidden"
        onClick={stopPropagation}
        style={{
          backgroundImage: `url(${gridBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-[#DC3D50] text-2xl"
          aria-label="Close"
        >
          ×
        </button>

        {/* Mobile Layout */}
        <div className="flex flex-col w-full md:hidden">
          <div className="w-full mx-auto flex flex-col items-center text-center">
            <div className="w-full flex flex-col items-center">
              <img src={logo} alt="Cybernest Solutions Logo" className="h-6 sm:h-8 mb-4" />
              <h2 className="text-[#DC3D50] font-bold text-lg mb-1">
                Why Let Hassle Disrupt Your workflow?
              </h2>
              <p className="text-base mb-3">
                Be our partner and get <img src={flow} alt="FLOW" className="inline h-4 align-middle mx-1" /> system for <strong>FREE!</strong>
              </p>
              <ul className="mb-4 space-y-1 w-fit mx-auto">
                {["Appointment System", "Registration System", "CRM Dashboard", "Workflow Tracking"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 justify-center">
                    <CheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="w-full flex justify-center mb-4">
                <img src={rightImage} alt="Flow System Illustration" className="w-full max-w-[200px] h-auto rounded-xl" />
              </div>
              <p className="text-xs mb-4 px-4 max-w-md mx-auto">
                Book your appointment today! ELIMINATE the bottlenecks, OPTIMIZE your operations, and MOVE forward with FLOW!
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#DC3D50] hover:bg-[#b62d42] text-white text-sm py-1 px-4 rounded-full text-center mx-auto mb-2 block"
            >
              Get your <span className="font-bold">FREE FLOW SYSTEM</span> here!
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex md:flex-row w-full">
          <div className="md:w-3/5 md:pr-6 lg:px-10">
            <img src={logo} alt="Cybernest Solutions Logo" className="h-8 mb-6" />
            <h2 className="text-[#DC3D50] font-bold text-xl mb-1">
              Why Let Hassle Disrupt Your workflow?
            </h2>
            <p className="text-lg mb-4">
              Be our partner and get <img src={flow} alt="FLOW" className="inline h-5 align-middle mx-1" /> system for <strong>FREE!</strong>
            </p>
            <ul className="mb-6 space-y-2">
              {["Appointment System", "Registration System", "CRM Dashboard", "Workflow Tracking"].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm mb-6 pr-10">
              Book your appointment today! ELIMINATE the bottlenecks, OPTIMIZE your operations, and MOVE forward with FLOW!
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#DC3D50] hover:bg-[#b62d42] text-white py-1 px-6 rounded-full inline-block"
            >
              Get your <span className="font-bold">FREE FLOW SYSTEM</span> here!
            </button>
          </div>
          <div className="md:w-[450px] h-auto flex justify-center items-center">
            <img src={rightImage} alt="Flow System Illustration" className="w-full h-auto rounded-xl" />
          </div>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="absolute left-1/2 -bottom-12 sm:-bottom-10 transform cursor-pointer -translate-x-1/2 text-white text-sm px-4 sm:px-6 hover:text-[#DC3D50]"
        >
          Remind me Later
        </button>
      </div>

      <BookingModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default FlowPopup;

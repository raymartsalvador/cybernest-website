import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import BookingModal from "../components/BookingModal";
import flowDot from "../assets/images/flow.png";
import flowPlus from "../assets/images/flow-plus.png";
import gridBox from "../assets/images/grid-box.png";

const FeaturedProduct: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section id="products" className="px-4 sm:px-6 py-16 sm:py-20 font-montserrat text-gray-700 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Headings */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 text-center md:text-left mb-12 mx-2 sm:mx-20">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              <span
                className="inline-flex items-center justify-center text-cyberred font-extrabold"
                style={{
                  backgroundImage: `url(${gridBox})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%",
                  width: "150px",
                  height: "60px",
                  lineHeight: "1",
                }}
              >
                Featured
              </span>{" "}
              <span className="text-cyberviolet">Product</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Discover how our FLOW solutions help streamline your operations,
              reduce wait times, and enhance client satisfaction—
              whether you’re running a small clinic or a midsize institution.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm sm:text-base text-gray-600">
              Learn more about how Flow works and how it can help you in optimizing your queueing system.
            </p>
          </div>
        </div>

        {/* Comparison Cards */}
        <div data-aos="fade-up" className="flex flex-col lg:flex-row justify-center gap-6 sm:gap-8">
          {/* Basic Version */}
          <div className="bg-white mb-4 shadow-lg rounded-xl overflow-hidden max-w-lg w-full border border-gray-200">
            <div className="absolute bg-cyberviolet text-white text-xs font-bold px-10 py-2 rounded-t-2xl w-fit mx-6 mt-[-30px]">
              Basic Version
            </div>
            <div className="p-6 text-left flex gap-20">
              <div className="w-1/2">
                <img src={flowDot} alt="Flow Basic" className="h-12 object-contain" />
                <p className="text-[10px] mb-20 text-gray-600 px-2">
                  Basic queuing system for small offices and clinics with
                  simple registration and public queue display.
                </p>
                <p className="text-[9px] mb-2 text-gray-600 px-2">
                  Book a quick meeting with our team for more in depth inquiries.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-[10px] slow-beat-animation sm:text-xs px-6 sm:px-8 py-1.5 sm:py-2 bg-cyberviolet text-white rounded-full font-bold w-full sm:w-auto"
                >
                  Book a Meeting
                </button>
              </div>
              <div className="w-3/5">
                <ul className="space-y-2 text-xs sm:text-sm mb-4">
                  {["Queueing System", "Booking System", "Client Tracking", "Digital or Physical Kiosk", "Dashboard CRM", "Auto Assign Client", "Point of Sale (POS)", "Client Demographics", "Data Analytics"].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {i < 6 ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <XCircle size={16} className="text-red-400" />
                      )}
                      <span className="text-[11px] sm:text-[13px]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Premium Version */}
          <div className="bg-white mb-4 shadow-lg rounded-xl overflow-hidden max-w-lg w-full border border-gray-200">
            <div className="absolute bg-cyberred text-white text-xs font-bold px-10 py-2 rounded-t-2xl w-fit mx-6 mt-[-30px]">
              Premium Version
            </div>
            <div className="p-6 text-left flex gap-20">
              <div className="w-1/2">
                <img src={flowPlus} alt="Flow+" className="h-12 object-contain" />
                <p className="text-[10px] mb-20 text-gray-600 px-2">
                  Enhanced system with digital registration, automated tracking, and CRM for midsize institutions.
                </p>
                <p className="text-[9px] mb-2 text-gray-600 px-2">
                  Book a quick meeting with our team for more in depth inquiries.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-[10px] slow-beat-animation cursor-pointer sm:text-xs px-6 sm:px-8 py-1.5 sm:py-2 bg-cyberred text-white rounded-full font-bold w-full sm:w-auto"
                >
                  Book a Meeting
                </button>
              </div>
              <div className="w-3/5">
                <ul className="space-y-2 text-xs sm:text-sm mb-4">
                  {["Queueing System", "Booking System", "Client Tracking", "Digital or Physical Kiosk", "Dashboard CRM", "Auto Assign Client", "Point of Sale (POS)", "Client Demographics", "Data Analytics"].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-[11px] sm:text-[13px]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal show={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
};

export default FeaturedProduct;
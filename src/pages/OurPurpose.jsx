import React from "react";
import { ArrowRight } from "lucide-react";
import gridBox from "../assets/images/grid-box.png";

export default function OurPurpose() {
  return (
    <section id="purpose" className="font-montserrat bg-white py-16 px-4 sm:px-6 lg:px-24 text-center md:text-left">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            <span className="text-cyberviolet">Our</span>{" "}
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
              Purpose
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto md:mx-0">
            We aim to empower institutions with digital solutions that enhance flow, reduce friction, and maximize time efficiency.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div data-aos="flip-left" className="bg-gray-100 p-6 sm:p-8 rounded-xl shadow text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-cyberviolet mb-4">Mission</h3>
            <p className="text-sm text-gray-700 mb-6 max-w-sm mx-auto">
              To provide an end-to-end Flow Management system that optimizes the movement of people, tasks, and data—
              ensuring time and effort efficiency.
            </p>
          </div>

          {/* Vision */}
          <div data-aos="flip-right" className="bg-[#FFF5F5] p-6 sm:p-8 rounded-xl shadow text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-cyberred mb-4">Vision</h3>
            <p className="text-sm text-gray-700 mb-6 max-w-sm mx-auto">
              To enable efficient ecosystems where private and government institutions deliver seamless and digitally driven operations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

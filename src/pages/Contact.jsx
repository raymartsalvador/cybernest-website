import { ArrowRight } from "lucide-react";
import contactImage from "../assets/images/Contact.jpg";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 bg-white font-montserrat">
      <div data-aos="fade-up" className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center text-center">
        
        {/* Left image */}
        <div className="flex justify-center">
          <img
            src={contactImage}
            alt="Cybernest Contact"
            className="w-full max-w-[480px] rounded-lg shadow-md"
          />
        </div>

        {/* Right content */}
        <div className="flex flex-col justify-center items-center space-y-5">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-cyberred leading-snug">
            Streamline your operation <br className="hidden sm:block" />
            with us at Cybernest
          </h2>

          <p className="text-sm sm:text-base text-gray-600 max-w-md">
            Start your transformation journey with a seamless system built to optimize your people, tasks, and data flow.
          </p>

          <a
            href="https://calendly.com/tlvelardo-pup/30min"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-cyberred cursor-pointer text-white px-6 py-2 rounded-full font-semibold shadow-md hover:opacity-90 flex items-center gap-2 transition">
              Book an free appointment now <ArrowRight size={18} />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

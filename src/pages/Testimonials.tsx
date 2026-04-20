import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Cristina Maria Ibanez",
    role: "President, ENEDA",
    quote:
      "“The level of technical expertise and creative vision provided was exactly what we needed to scale our digital presence effectively.”",
    rating: 5,
  },
  {
    name: "Kurt Leinard D. Balbuena",
    role: "Project Leader, AEROCOMP",
    quote:
      "“ Working with this team turned our complex legacy issues into a streamlined, user-centric interface that our clients absolutely love.”",
    rating: 5,
  },
  {
    name: "Dr. Philip P. Ermita",
    role: "Project Leader, PUP PYLON TBI",
    quote:
      "“Their data-driven approach to design and systems engineering sets them apart in a crowded market of digital solution providers.”",
    rating: 5,
  },
];

function getInitials(name: string): string {
  const honorifics = new Set(["dr", "mr", "mrs", "ms", "sir", "prof"]);
  const parts = name.split(/\s+/).filter((p) => {
    const clean = p.replace(/\./g, "").toLowerCase();
    return clean && !honorifics.has(clean);
  });
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-[rgba(220,61,80,0.1)] rounded-[24px] sm:rounded-[40px] px-5 py-5 sm:px-8 sm:py-[30px] flex flex-col items-center text-center w-full max-w-[393px] sm:min-h-[345px]">
      {/* Avatar with concentric rings + initials */}
      <div className="relative w-[60px] h-[60px] sm:w-[74px] sm:h-[74px] mb-3 sm:mb-[14px]">
        <div className="absolute inset-0 rounded-full border-2 border-cyberred" />
        <div className="absolute inset-[3px] rounded-full bg-white" />
        <div
          aria-label={testimonial.name}
          className="absolute inset-[7px] rounded-full bg-cyberred/10 flex items-center justify-center text-cyberred font-bold text-base sm:text-lg tracking-wide"
        >
          {getInitials(testimonial.name)}
        </div>
      </div>

      {/* Name & Role */}
      <h3 className="text-base sm:text-[20px] font-bold text-black leading-tight">
        {testimonial.name}
      </h3>
      <p className="text-xs sm:text-sm text-black mt-[3px]">{testimonial.role}</p>

      {/* Stars */}
      <div className="flex gap-1.5 sm:gap-2.5 mt-3 mb-3 sm:mt-[14px] sm:mb-[14px]">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star
            key={i}
            className="w-[18px] h-[18px] sm:w-[30px] sm:h-[30px] fill-cyberred text-cyberred"
            strokeWidth={0}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm sm:text-base text-black leading-normal max-w-[326px]">
        {testimonial.quote}
      </p>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-24">
      <div className="max-w-7xl mx-auto text-center">
        <h2
          data-aos="fade-up"
          className="text-3xl sm:text-4xl md:text-[48px] font-bold text-cyberred mb-4"
        >
          Testimonials
        </h2>
        <p
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-base sm:text-lg md:text-2xl text-[#3f3f3f] max-w-[1190px] mx-auto mb-14"
        >
          Trusted by industry leaders and startup founders to deliver
          exceptional digital experiences and scalable innovation.
        </p>

        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="flex flex-wrap justify-center gap-5"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

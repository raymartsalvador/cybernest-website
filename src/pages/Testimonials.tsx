import cristinaIbanez from "../assets/images/testimonials/cristina-ibanez.webp";
import starIcon from "../assets/images/testimonials/star.svg";
import raymartBonete from "../assets/images/testimonials/raymart-bonete.webp";
import philipErmita from "../assets/images/testimonials/philip-ermita.webp";

interface Testimonial {
  name: string;
  roleLines: [string, string];
  quote: string;
  photo: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Ms. Cristina Maria Ibanez",
    roleLines: ["President, ENEDA", "President, SCALE NCR"],
    quote:
      "“Cybernest delivered a reliable and user-friendly web application for ENEDA that effectively supported and digitalized our operations. Their team understood our needs and translated them into a scalable and efficient solution.”",
    photo:cristinaIbanez,
  },
  {
    name: "Engr. Raymart Ireneo Bonete",
    roleLines: [
      "CTO, Liknayan Innovation Corp.",
      "Content Creator, EngineerProf PH",
    ],
    quote:
      "“Working with Cybernest on Aeriocomp’s web app was a smooth and productive experience. They were responsive, technically skilled, and delivered a platform that strengthened our digital presence”",
    photo:raymartBonete,
  },
  {
    name: "Dr. Philip P. Ermita",
    roleLines: ["Director, PUP TBIDO", "Project Lead, PUP PYLON TBI"],
    quote:
      "“Cybernest demonstrated strong technical capability in developing the PointFLOW System. They were able to turn our requirements into a functional and efficient platform.”",
    photo:philipErmita,
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-[rgba(220,61,80,0.1)] rounded-[24px] sm:rounded-[40px] px-5 py-6 sm:px-8 sm:py-[30px] flex flex-col items-center text-center w-full max-w-[393px] sm:min-h-[354px] shadow-[0_8px_24px_rgba(220,61,80,0.08)]">
      {/* Avatar: outer rose ring → white gap → photo framed by red ring */}
      <div className="relative w-[74px] h-[74px] sm:w-[84px] sm:h-[84px] shrink-0">
        <div className="absolute inset-0 rounded-full bg-[#F0A0A8]" />
        <div className="absolute inset-[4px] rounded-full bg-[#E5808C]" />
        <div className="absolute inset-[7px] rounded-full border-[1.5px] border-cyberred overflow-hidden">
          <img
            src={testimonial.photo}
            alt={testimonial.name}
            width={70}
            height={70}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Name */}
      <h3 className="mt-3 sm:mt-[14px] text-base sm:text-[20px] font-bold text-black leading-tight">
        {testimonial.name}
      </h3>

      {/* Role (two lines) */}
      <p className="mt-[3px] text-xs sm:text-sm text-black leading-normal">
        {testimonial.roleLines[0]}
        <br />
        {testimonial.roleLines[1]}
      </p>

      {/* Divider: line — layered star medallion — line (Figma group38341) */}
      <div
        aria-hidden="true"
        className="flex items-center justify-center mt-3 mb-3 sm:mt-[14px] sm:mb-[14px] w-full max-w-[324px]"
      >
        <span className="h-px flex-1 bg-black/20" />
        <span className="relative mx-3 inline-block w-[34px] h-[34px]">
          <span className="absolute inset-0 rounded-full bg-[#F0A0A8]" />
          <span className="absolute inset-[4px] rounded-full bg-[#E5808C]" />
          <img
            src={starIcon}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 m-auto w-[24px] h-[20px]"
          />
        </span>
        <span className="h-px flex-1 bg-black/20" />
      </div>

      {/* Quote */}
      <p className="text-sm sm:text-base text-black leading-normal max-w-[336px]">
        {testimonial.quote}
      </p>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1260px] mx-auto text-center">
        <h2
          data-aos="fade-up"
          className="text-3xl sm:text-4xl md:text-[48px] font-bold text-cyberred mb-4 leading-tight"
        >
          Testimonials
        </h2>
        <p
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-base sm:text-lg md:text-[24px] text-[#3f3f3f] max-w-[1190px] mx-auto mb-10 sm:mb-14 font-normal leading-normal"
        >
          Trusted by industry leaders and startup founders to deliver
          exceptional digital experiences and scalable innovation.
        </p>

        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="flex flex-wrap justify-center gap-5"
        >
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

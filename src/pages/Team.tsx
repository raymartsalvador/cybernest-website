import { ExternalLink } from "lucide-react";

// Images
import tristan from "../assets/images/cybermest-team/tristanFormal.png";
import froilan from "../assets/images/cybermest-team/froiFormal.jpg";
import raymart from "../assets/images/cybermest-team/raymart.jpg";
import kurt from "../assets/images/cybermest-team/kurtFormal.jpg";
import kenneth from "../assets/images/cybermest-team/kenneth.png";
import philip from "../assets/images/cybermest-team/doc-philip-formal.jpg";
import airah from "../assets/images/cybermest-team/aira.jpg";
import gridBox from "../assets/images/grid-box.png";

// ---- Portrait card
function MemberCard({
  name,
  position,
  image,
  linkedin,
}: {
  name: string;
  position: string;
  image: string;
  linkedin?: string;
}) {
  return (
    <div className="group flex flex-col items-center text-center mx-3 mb-10 w-32 md:w-60">
      {/* Entire image clickable */}
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${name}'s profile`}
        className="relative block overflow-hidden rounded-xl shadow-md ring-1 ring-black/5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyberviolet/60 group-hover:shadow-lg group-hover:-translate-y-1"
      >
        <div className="h-48 w-32 md:h-56 md:w-40 ">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Hover overlay cue */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-medium text-slate-800 shadow-sm">
            <ExternalLink className="h-3 w-3" />
            <span className="hidden sm:inline">Profile</span>
          </div>
        </div>
      </a>

      {/* Text - allow wrapping, always centered */}
      <h3 className="mt-3 text-sm md:text-base font-semibold text-slate-900 leading-snug">
        {name}
      </h3>
      <p className="text-xs md:text-sm text-slate-500">{position}</p>
    </div>
  );
}

export default function Team() {
  const members = [
    {
      name: "Engr. Tristan L Velardo",
      position: "Chief Executive Officer",
      image: tristan,
      linkedin: "https://www.linkedin.com/in/tristan-velardo-627a6b274/",
    },
    {
      name: "Engr. John Froilan C. Lluz",
      position: "Chief Operating Officer",
      image: froilan,
      linkedin: "https://www.linkedin.com/in/john-froilan-lluz-3038a6274/",
    },
    {
      name: "Engr. Raymart Salvador",
      position: "Chief Technology Officer",
      image: raymart,
      linkedin: "https://www.linkedin.com/in/raymart-g-salvador-54096221b/",
    },
    {
      name: "Dr. Philip P. Ermita",
      position: "Advisor",
      image: philip,
      linkedin:
        "https://www.linkedin.com/in/philip-p-ermita-pie-phd-pdqm-asean-eng-91996245",
    },
    {
      name: "Engr. Kurt Leinard D. Balbuena",
      position: "Creative Lead",
      image: kurt,
      linkedin: "https://www.linkedin.com/in/kurt-leinard-balbuena-ba1ba9271/",
    },
    {
      name: "Ms. Airah Isabel",
      position: "Sales Manager",
      image: airah,
      linkedin: "https://www.linkedin.com/in/airah-isabel",
    },
    {
      name: "Engr. Kenneth D. Musngi",
      position: "Software Developer",
      image: kenneth,
      linkedin: "https://www.linkedin.com/in/knnth-msng/",
    },
  ];

  const topRow = members.slice(0, 4);
  const bottomRow = members.slice(4);

  return (
    <section id="team" className="relative py-20 px-6 bg-white font-montserrat">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            The{" "}
            <span
              className="inline-flex items-center justify-center text-cyberred"
              style={{
                backgroundImage: `url(${gridBox})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                width: "120px",
                height: "60px",
                lineHeight: "1",
              }}
            >
              Team
            </span>{" "}
            Behind <span className="text-cyberviolet">Cybernest</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            A powerhouse of engineers, designers, and innovators dedicated to
            transforming service delivery through efficient, people-centered
            technology.
          </p>
        </div>

        {/* Top row - 4 people */}
        <div className="flex flex-wrap justify-center">
          {topRow.map((m) => (
            <MemberCard key={m.name} {...m} />
          ))}
        </div>

        {/* Bottom row - 3 people */}
        <div className="flex flex-wrap justify-center">
          {bottomRow.map((m) => (
            <MemberCard key={m.name} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
}

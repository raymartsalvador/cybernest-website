import { Linkedin } from "lucide-react";

// Images
import tristan from "../assets/images/cybermest-team/tristanFormal.png";
import froilan from "../assets/images/cybermest-team/froiFormal.jpg";
import raymart from "../assets/images/cybermest-team/raymart.jpg";
import kurt from "../assets/images/cybermest-team/kurtFormal.jpg";
import kenneth from "../assets/images/cybermest-team/kenneth.png";
import philip from "../assets/images/cybermest-team/doc-philip-formal.jpg";
import airah from "../assets/images/cybermest-team/aira.jpg";
import valdez from "../assets/images/cybermest-team/valdez.jpg";
import gridBox from "../assets/images/grid-box.png";

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
      linkedin: "https://www.linkedin.com/in/philip-p-ermita-pie-phd-pdqm-asean-eng-91996245",
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
    {
      name: "Engr. Ronniel K. Valdez",
      position: "Managing Consultant",
      image: valdez,
      linkedin: "https://www.linkedin.com/in/ronneil-valdez-170b96219/",
    },
  ];

  return (
    <section id="team" className="py-20 px-6 bg-white font-montserrat text-center">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          The{" "}
          <span
            className="inline-flex items-center justify-center text-cyberred font-extrabold"
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
        <p className="text-sm text-gray-600 max-w-sm mx-auto mb-10">
          A powerhouse of engineers, designers, and innovators dedicated to transforming service delivery through efficient, people-centered technology.
        </p>

        {/* Grid */}
        <div data-aos="fade-up" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {members.map((member, index) => (
            <div key={index} className="flex flex-col items-center text-sm">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-32 object-cover rounded-lg mb-2 shadow group-hover:opacity-80 transition"
                />
                <p className="font-medium text-gray-800 text-center group-hover:text-cyberred">
                  {member.name}
                </p>
              </a>
              <p className="text-gray-500 text-center mb-1">{member.position}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

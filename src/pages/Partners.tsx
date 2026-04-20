import dostSeal from "../assets/images/partners/dost-seal.png";
import pcieerd from "../assets/images/partners/pcieerd-logo.png";
import pupLogo from "../assets/images/partners/pup-logo.png";
import dostPylon from "../assets/images/partners/dost-pylon-logo.png";
import eneda from "../assets/images/partners/eneda-logo.png";
import aerocenzi from "../assets/images/partners/aerocenzi-logo.png";
import cybercafe from "../assets/images/partners/cybercafe-logo.png";
import scalencr from "../assets/images/partners/scalencr-logo.png";
import bploBinan from "../assets/images/partners/bplo-binan-logo.png";
import orbit360 from "../assets/images/partners/orbit-360.jpeg";

type Partner = { name: string; logo: string };

const partners: Partner[] = [
  { name: "DOST", logo: dostSeal },
  { name: "PCIEERD", logo: pcieerd },
  { name: "PUP", logo: pupLogo },
  { name: "DOST PYLON", logo: dostPylon },
  { name: "ENEDA", logo: eneda },
  { name: "Aerocenzi", logo: aerocenzi },
  { name: "Cybercafe", logo: cybercafe },
  { name: "ScaleNCR", logo: scalencr },
  { name: "BPLO City of Biñan", logo: bploBinan },
  { name: "Orbit 360", logo: orbit360 },
];

export default function Partners() {
  const track = [...partners, ...partners];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-24 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <h2
          data-aos="fade-up"
          className="text-3xl sm:text-4xl md:text-[48px] font-bold text-cyberred mb-4"
        >
          Partners and Collaborators
        </h2>
        <p
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-base sm:text-lg md:text-2xl text-[#3f3f3f] max-w-[1190px] mx-auto mb-14"
        >
          At Cybernest, we champion a culture of partnership, actively fueling
          the tech ecosystem through collaborative innovation and the shared
          advancement of emerging technologies.
        </p>
      </div>

      <div className="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-6 sm:gap-10 md:gap-16 group-hover:[animation-play-state:paused]">
          {track.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex h-[110px] w-[140px] shrink-0 items-center justify-center px-3 sm:h-[130px] sm:w-[170px] md:h-[150px] md:w-[200px]"
            >
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                width={200}
                height={200}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

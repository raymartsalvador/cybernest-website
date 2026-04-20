import {
  FileCheck,
  Clock,
  Trophy,
  Sprout,
  Rocket,
  Handshake,
  Briefcase,
  Medal,
  type LucideIcon,
} from "lucide-react";

type Milestone = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

const topRow: Milestone[] = [
  {
    title: "2023: Filled Patent for BME",
    description: "BME: A BMI Machine with AI Nutritionist (Thesis Paper)",
    Icon: FileCheck,
  },
  {
    title: "2023: QueueWise Project",
    description: "Tailored Queuing System for Biñan City Hall",
    Icon: Clock,
  },
  {
    title: "2023: Pitching Champions",
    description: "Pitched and secured 1st place at StartUp Week Biñan",
    Icon: Trophy,
  },
  {
    title: "2024: Incubation Program",
    description: "Admitted to PUP Technology Business Incubation Program",
    Icon: Sprout,
  },
];

const bottomRow: Milestone[] = [
  {
    title: "2025: SCALE NCR Acceleration",
    description: "Admitted in SCALE NCR Acceleration Program Cohort 1",
    Icon: Rocket,
  },
  {
    title: "2025: First Client: ENEDA PH",
    description: "Integration of FLOW for Membership application",
    Icon: Handshake,
  },
  {
    title: "2025: Business Formalization",
    description: "DTI, BIR, Mayors Permit, and Bank compliance",
    Icon: Briefcase,
  },
  {
    title: "2024: Pitching Finalist",
    description:
      "Development Academy of the Philippines ImagineGov Finalist",
    Icon: Medal,
  },
];

function MilestoneNode({ item }: { item: Milestone }) {
  const { Icon, title, description } = item;
  return (
    <div className="flex flex-col items-center text-center max-w-[260px]">
      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-[20px] bg-cyberred">
        <Icon className="h-8 w-8 text-white" strokeWidth={2} />
      </div>
      <h3 className="mt-6 text-base font-bold tracking-[-0.03em] text-cyberred leading-normal">
        {title}
      </h3>
      <p className="mt-[31px] text-base text-[#64607d] leading-normal">
        {description}
      </p>
    </div>
  );
}

export default function KeyMilestones() {
  return (
    <section
      id="milestones"
      className="font-montserrat bg-white py-16 px-4 sm:px-6 lg:px-12 xl:px-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          data-aos="fade-up"
          className="text-3xl sm:text-4xl md:text-[48px] font-bold text-cyberred text-center"
        >
          Key Milestones
        </h2>

        <p
          data-aos="fade-up"
          className="mt-6 md:mt-8 mx-auto max-w-5xl text-base sm:text-lg lg:text-[24px] leading-normal text-[#3f3f3f] text-center"
        >
          Collaboration is at the heart of innovation. We are proud to work
          alongside leading government agencies and academic institutions to
          push the boundaries of technology and design.
        </p>

        {/* Desktop / tablet timeline */}
        <div
          data-aos="fade-up"
          className="relative hidden md:block mt-16 lg:mt-20"
        >
          {/* Connector curve */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1260 255"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-8 h-[255px] w-full"
          >
            <path
              d="M 60 0 H 1117 A 127.5 127.5 0 0 1 1117 255 H 143"
              fill="none"
              stroke="#DC3D50"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <div className="relative grid grid-cols-4 gap-6 lg:gap-10">
            {topRow.map((item) => (
              <div key={item.title} className="flex justify-center">
                <MilestoneNode item={item} />
              </div>
            ))}
          </div>

          <div className="relative mt-16 grid grid-cols-4 gap-6 lg:gap-10">
            {bottomRow.map((item) => (
              <div key={item.title} className="flex justify-center">
                <MilestoneNode item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile timeline */}
        <div data-aos="fade-up" className="md:hidden mt-12">
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute left-8 top-0 bottom-0 w-[2px] bg-cyberred/60"
            />
            <ul className="space-y-10">
              {[...topRow, ...bottomRow].map((item) => (
                <li key={item.title} className="relative pl-20">
                  <div className="absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-[20px] bg-cyberred">
                    <item.Icon
                      className="h-8 w-8 text-white"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-base font-bold tracking-[-0.03em] text-cyberred">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#64607d] leading-normal">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 md:mt-20 flex justify-center px-4">
          <div
            data-aos="fade-up"
            className="inline-flex items-center justify-center rounded-full bg-[#FCE4E7] px-10 sm:px-16 py-4 sm:py-5 shadow-[0_2px_12px_rgba(220,61,80,0.08)]"
          >
            <p className="text-base sm:text-xl md:text-[24px] font-bold text-cyberred text-center leading-normal whitespace-nowrap tracking-wide">
              And We Keep Moving Forward
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

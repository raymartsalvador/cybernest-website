import { CalendarDays, CheckCircle2, Clock, SearchCheck, Star } from "lucide-react";
import macbookMockup from "../assets/images/services/macbook-mockup.png";

export interface WebDevTier {
  size: "S" | "M" | "L";
  name: string;
  description: string;
  timeFrame: string;
  features: string[];
  price: string;
  popular?: boolean;
  hostingNote?: boolean;
}

const tiers: WebDevTier[] = [
  {
    size: "S",
    name: "Small Project",
    description:
      "Perfect for individuals or startups a professional landing page. Designed to convert visitors into leads.",
    timeFrame: "1-2 Weeks",
    features: [
      "Static Website (12 sections)",
      "Tailored Branding",
      "Life Time Hosting",
      "Search Engine Optimization (SEO)",
    ],
    price: "P 25,000.00",
  },
  {
    size: "M",
    name: "Medium Project",
    description:
      "Ideal for growing businesses that require content management to maintain a dynamic online presence.",
    timeFrame: "1-2 Months",
    features: [
      "Dynamic Website (15 sections)",
      "Content Management System",
      "1 Year Free Hosting",
      "Includes everything in Small Project except Hosting",
    ],
    price: "P 50,000.00",
    popular: true,
    hostingNote: true,
  },
  {
    size: "L",
    name: "Large Project",
    description:
      "Tailored for companies looking to automate workflows. Best for streamlining your operations.",
    timeFrame: "2-4 Months",
    features: [
      "Dynamic Web Application",
      "Appointment System",
      "1 Year Free Hosting",
      "Includes everything in Medium Project except Hosting",
    ],
    price: "P 120,000.00",
    hostingNote: true,
  },
];

function SizeBadge({ letter }: { letter: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center shrink-0 size-[46px] rounded-md bg-cyberlightred font-bold text-2xl text-cyberred"
    >
      {letter}
    </div>
  );
}

function TierCard({
  tier,
  onBook,
}: {
  tier: WebDevTier;
  onBook: () => void;
}) {
  return (
    <div
      data-aos="fade-up"
      className="relative bg-white border-2 border-[rgba(220,61,80,0.10)] rounded-[24px] p-6 sm:p-7 flex flex-col h-full"
    >
      {tier.popular && (
        <div className="absolute -top-5 left-4 inline-flex items-center gap-2 bg-cyberred text-white rounded-full px-5 py-2 shadow-md">
          <Star className="w-5 h-5" strokeWidth={2} />
          <span className="font-bold text-base">Most Popular</span>
        </div>
      )}

      <div className="flex gap-3.5 items-start flex-1">
        <SizeBadge letter={tier.size} />
        <div className="flex-1 min-w-0 flex flex-col self-stretch">
          <h3 className="font-bold text-2xl text-cyberred leading-tight">
            {tier.name}
          </h3>
          <p className="mt-3 text-base text-[#473c59] leading-snug">
            {tier.description}
          </p>

          <div className="my-4 h-[2px] rounded bg-[#473c59]/10" />

          <div className="flex items-center gap-2.5 text-[#473c59] text-base">
            <Clock className="w-5 h-5 text-cyberred shrink-0" strokeWidth={2} />
            <span>
              Time frame:{" "}
              <span className="font-bold text-cyberred">{tier.timeFrame}</span>
            </span>
          </div>

          <div className="my-4 h-[2px] rounded bg-[#473c59]/10" />

          <ul className="flex flex-col gap-3">
            {tier.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2.5 text-base text-[#473c59] leading-snug"
              >
                <CheckCircle2
                  className="w-5 h-5 text-cyberred shrink-0 mt-[3px]"
                  strokeWidth={2}
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {tier.hostingNote && (
            <div className="mt-5 rounded-xl bg-cyberlightred px-4 py-3">
              <p className="text-base text-cyberred leading-snug">
                Hosting renewal fees are subject to storage limits and total
                processing power consumption.
              </p>
            </div>
          )}

          <div className="mt-auto pt-6">
            <p className="text-base text-[#473c59]">Starts at</p>
            <p className="font-bold text-4xl text-cyberred mt-1">
              {tier.price}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onBook}
        className="mt-3 inline-flex items-center justify-center gap-2.5 w-full h-[60px] bg-cyberred text-white rounded-xl font-bold text-lg sm:text-xl hover:opacity-90 transition shadow-sm"
      >
        <CalendarDays className="w-6 h-6" strokeWidth={2} />
        Book a Meeting
      </button>
    </div>
  );
}

export default function WebDevServices({ onBook }: { onBook: () => void }) {
  return (
    <section
      aria-labelledby="web-dev-services-title"
      className="mt-16 sm:mt-24 lg:mt-32"
    >
      <h2
        id="web-dev-services-title"
        data-aos="fade-up"
        className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold text-cyberred mb-3 sm:mb-4"
      >
        Web Development Services
      </h2>
      <p
        data-aos="fade-up"
        data-aos-delay="100"
        className="text-sm sm:text-base md:text-lg lg:text-2xl text-[#3f3f3f] max-w-[1258px] mb-10 sm:mb-14"
      >
        Explore our tailored, comprehensive development packages designed to
        accelerate your unique digital growth journey.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 lg:pt-6">
        {tiers.map((tier) => (
          <TierCard key={tier.size} tier={tier} onBook={onBook} />
        ))}
      </div>

      <div
        data-aos="fade-up"
        className="mt-8 sm:mt-10 rounded-3xl bg-cyberlightred px-5 sm:px-10 py-5 flex items-center gap-3.5"
      >
        <div className="flex items-center justify-center shrink-0 size-[46px] rounded-md bg-white/[0.04]">
          <SearchCheck
            className="w-5 h-5 sm:w-6 sm:h-6 text-cyberred"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
        <p className="text-sm sm:text-base text-cyberred leading-snug">
          Every project includes fundamental SEO and AI-indexing optimization.
          We ensure your site is &ldquo;Search &amp; AI Ready,&rdquo; allowing
          Google and emerging AI services to easily crawl, understand, and rank
          your content at the top of their results.
        </p>
      </div>

      <div
        data-aos="fade-up"
        className="mt-6 sm:mt-8 rounded-[24px] bg-cyberred text-white overflow-hidden grid grid-cols-1 lg:grid-cols-[minmax(0,596fr)_minmax(0,664fr)] lg:h-[326px]"
      >
        <div className="px-6 sm:px-10 lg:px-9 py-8 lg:py-0 flex flex-col gap-5 lg:gap-6 lg:justify-center">
          <div className="flex items-start gap-5 lg:gap-6">
            <div
              aria-hidden="true"
              className="flex items-center justify-center shrink-0 size-14 rounded-md bg-white/5 font-bold text-[36px] leading-none text-white"
            >
              XL
            </div>
            <h3 className="font-bold text-2xl sm:text-3xl lg:text-[36px] leading-tight">
              Have a Custom Project in Mind?
            </h3>
          </div>
          <p className="text-base leading-normal max-w-[530px]">
            <span className="font-bold">
              Designed for those building the next big platform or scaling their
              current infrastructure.
            </span>{" "}
            We specialize in turning complex custom requirements into
            fully-integrated systems providing the dedicated engineering power
            needed to lead your industry.
          </p>
          <button
            type="button"
            onClick={onBook}
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto sm:max-w-[360px] h-[60px] px-8 bg-white text-cyberred rounded-xl font-bold text-lg sm:text-xl hover:opacity-90 transition shadow-sm"
          >
            <CalendarDays className="w-6 h-6" strokeWidth={2} />
            Book a Meeting
          </button>
        </div>

        <div className="relative h-56 sm:h-72 lg:h-full overflow-hidden">
          <img
            src={macbookMockup}
            alt="Macbook displaying a Cybernest custom web project"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-left"
          />
        </div>
      </div>
    </section>
  );
}

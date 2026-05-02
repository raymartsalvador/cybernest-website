import orbit360Mockup from "../assets/images/projects/orbit360-mockup.png";
import enedaMockup from "../assets/images/projects/eneda-mockup.png";
import tbidoMockup from "../assets/images/projects/tbido-mockup.png";
import aerocompMockup from "../assets/images/projects/aerocomp-mockup.png";
import flowLogo from "../assets/images/flow-logo.png";
import certifyLogo from "../assets/images/certify-logo-real.png";

export type ProjectSlug = "orbit360" | "eneda" | "tbido" | "aerocomp";

export type ProjectStatus = "live" | "in-development" | "archived";

export interface PoweredByLogo {
  src: string;
  avif?: string;
  alt: string;
  href?: string;
}

export interface ExpandedFeature {
  title: string;
  body: string;
}

export interface ProjectOutcome {
  metric: string;
  label: string;
}

export interface ProjectGalleryImage {
  src: string;
  alt: string;
}

export interface Project {
  slug: ProjectSlug;
  name: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  liveUrl?: string;
  features: string[];
  expandedFeatures?: ExpandedFeature[];
  problem?: string;
  techStack?: string[];
  outcomes?: ProjectOutcome[];
  mockup: string;
  gallery?: ProjectGalleryImage[];
  poweredBy: PoweredByLogo[];
  seo: {
    description: string;
    ogImage?: string;
  };
}

const flow: PoweredByLogo = {
  src: flowLogo,
  alt: "FLOW+",
  href: "/products/pointflow",
};
const certify: PoweredByLogo = {
  src: certifyLogo,
  alt: "Certify+",
  href: "/products/certify",
};

export const projects: Project[] = [
  {
    slug: "orbit360",
    name: "Orbit 360",
    tagline: "Self-serve camera rental booking, built for studios that want zero phone tag.",
    description:
      "Self-serve camera rental booking platform with real-time availability, ID verification, and an admin dashboard.",
    status: "live",
    liveUrl: "https://orbit360.rentals",
    features: [
      "Reservation System",
      "ID Verification",
      "Payment Integration",
      "Admin Dashboard",
    ],
    expandedFeatures: [
      {
        title: "Reservation System",
        body: "Real-time inventory and date-aware availability so customers only see gear that's actually free for the dates they want.",
      },
      {
        title: "ID Verification",
        body: "Built-in identity capture and review queue — gear only goes out the door once an admin clears the renter.",
      },
      {
        title: "Payment Integration",
        body: "Card-on-file checkout with deposit holds and refund-friendly reconciliation, so the back office isn't chasing receipts.",
      },
      {
        title: "Admin Dashboard",
        body: "One pane of glass for inventory, bookings, customers, and revenue — staff can run the whole rental floor from a browser tab.",
      },
      {
        title: "Equipment Catalog",
        body: "Each piece of gear has its own listing with photos, daily rates, and availability rules — so renters always see what's actually bookable.",
      },
      {
        title: "Add-Ons & Extras",
        body: "Optional accessories and bundled extras can be attached to a booking at checkout, increasing average order value without extra ops work.",
      },
      {
        title: "Booking Confirmations & Email",
        body: "Every confirmed booking generates a secure confirmation link and a transactional email so renters always have a record they can pull up.",
      },
      {
        title: "Operational Controls",
        body: "Admins can configure reservation fees, security deposits, payment methods, and block out dates when the studio is closed — no developer needed.",
      },
    ],
    problem:
      "The studio was running rentals over DM threads and Google Sheets, which meant double-bookings, missed IDs, and zero visibility into utilization. We replaced that with a self-serve booking flow and an admin console — the renter sees what's actually available, and the team sees what's actually happening.",
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "AWS",
    ],
    mockup: orbit360Mockup,
    poweredBy: [flow],
    seo: {
      description:
        "Case study: Orbit 360 — a self-serve camera rental booking platform with real-time availability, ID verification, and a unified admin dashboard, built by Cybernest Solutions.",
      ogImage: "https://www.cybernestsolution.com/og-orbit360.png",
    },
  },
  {
    slug: "eneda",
    name: "ENEDA PH",
    tagline: "A public-facing org site, member registry, and certificate engine in one.",
    description:
      "Public-facing org site and admin dashboard with member registration, an article CMS, and an in-app certificate generator.",
    status: "live",
    liveUrl: "https://eneda-ph.com",
    features: [
      "Marketing Site",
      "Member Registration",
      "Article CMS",
      "Certificate Generator",
    ],
    expandedFeatures: [
      {
        title: "Marketing Site",
        body: "A polished public-facing site that explains who ENEDA is, what they do, and how to get involved — optimized for search and social sharing.",
      },
      {
        title: "Member Registration",
        body: "Self-serve sign-up with profile management and admin moderation, so the org's roster stays clean without manual data entry.",
      },
      {
        title: "Article CMS",
        body: "A content workflow for staff to publish news and updates without engineering involvement.",
      },
      {
        title: "Certificate Generator",
        body: "In-app certificate issuance powered by Certify+, with QR-based verification so recipients can prove legitimacy on the spot.",
      },
      {
        title: "Appointment Booking",
        body: "Members can book consultation slots directly from the site, with admin-managed availability and email confirmations — no manual back-and-forth.",
      },
      {
        title: "Member Profiles",
        body: "Each registered member has their own profile they can update, so the org's roster stays current without admins keying in changes.",
      },
      {
        title: "Application Tracking",
        body: "Applicants can check the status of their membership application at any time, removing the constant 'any update?' inbound to staff.",
      },
      {
        title: "Admin Slot Management",
        body: "Operators define and regenerate appointment slots in bulk, so opening up a new month of availability takes minutes instead of an afternoon.",
      },
    ],
    problem:
      "ENEDA needed a single home for member-facing content, member onboarding, and event certification — without stitching together three different SaaS tools. We delivered all three on one stack so the org's day-to-day is one login instead of five.",
    techStack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "MongoDB",
      "Azure",
    ],
    mockup: enedaMockup,
    poweredBy: [certify, flow],
    seo: {
      description:
        "Case study: ENEDA PH — a public-facing organization site with member registration, article CMS, and an embedded Certify+ certificate generator, built by Cybernest Solutions.",
      ogImage: "https://www.cybernestsolution.com/og-eneda.png",
    },
  },
  {
    slug: "tbido",
    name: "TBIDO",
    tagline: "Public site for PUP TBI's PYLON incubation program — marketing, program info, and applications.",
    description:
      "Public-facing website for PUP Technology Business Incubator (PUP TBI) and its PYLON incubation program — marketing, program info, and incubation applications.",
    status: "live",
    liveUrl: "https://www.puptbi.site",
    features: [
      "Marketing Site",
      "Application Intake",
      "Article CMS",
      "Certificate Generator",
    ],
    expandedFeatures: [
      {
        title: "Marketing Site",
        body: "Polished public site that introduces PUP TBI and the PYLON incubation program — programs, news, and how to engage.",
      },
      {
        title: "Application Intake",
        body: "Self-serve incubation application flow with auth, email notifications, and admin review — replacing ad-hoc inboxes and forms.",
      },
      {
        title: "Article CMS",
        body: "In-app rich-text authoring so staff can publish program updates and announcements without engineering involvement.",
      },
      {
        title: "Certificate Generator",
        body: "Server-side document generation for program artifacts and certificates issued through the incubation pipeline.",
      },
      {
        title: "Auth & Roles",
        body: "Secure login for staff and applicants, with role-based access so reviewers, admins, and applicants each see only what they should.",
      },
      {
        title: "Email Notifications",
        body: "Applicants get transactional email at every milestone — submission, review, decision — so nobody is left wondering where their application stands.",
      },
      {
        title: "Real-Time Updates",
        body: "Live status changes pushed to the browser instead of forcing a refresh, so admins and applicants see updates the moment they happen.",
      },
      {
        title: "Scheduled Jobs",
        body: "Background tasks run on a schedule to handle reminders, cleanups, and recurring program operations without manual triggering.",
      },
    ],
    problem:
      "PUP TBI's PYLON program needed a single public home for program information and application intake — not a static brochure site, but a working pipeline that handles applications, communications, and document generation end-to-end. We delivered a marketing site fronting a real backend with auth, email, scheduled jobs, and a real-time queue subsystem. Code is now maintained in-house by the TechDev-TBIDO team.",
    techStack: [
      "React",
      "Tailwind CSS",
      "Node.js",
      "MongoDB",
      "PostgreSQL",
      "Socket.io",
      "Azure",
    ],
    mockup: tbidoMockup,
    poweredBy: [certify, flow],
    seo: {
      description:
        "Case study: TBIDO — the public-facing website for PUP Technology Business Incubator and its PYLON incubation program, with application intake, article CMS, and document generation, built by Cybernest Solutions.",
      ogImage: "https://www.cybernestsolution.com/og-tbido.png",
    },
  },
  {
    slug: "aerocomp",
    name: "Aerocomp PH",
    tagline: "Marketing site, content workflow, and appointment booking for Aerocomp Inc.",
    description:
      "Public-facing marketing site, content management, and appointment booking for Aerocomp Inc., live in production.",
    status: "live",
    liveUrl: "https://aerocomp.ph",
    features: [
      "Marketing Site",
      "Content Management",
      "Appointment System",
      "Admin Dashboard",
    ],
    expandedFeatures: [
      {
        title: "Marketing Site",
        body: "A polished public site that positions Aerocomp's services and converts visits into booked appointments.",
      },
      {
        title: "Content Management",
        body: "Editorial workflow that lets the Aerocomp team publish without filing a developer ticket.",
      },
      {
        title: "Appointment System",
        body: "Self-serve booking with availability rules, confirmations, and cancellations — wired into the company's day-to-day calendar.",
      },
      {
        title: "Admin Dashboard",
        body: "Operational console to manage content, appointments, and customer records from one place.",
      },
      {
        title: "Product Catalog",
        body: "Admin-managed product listings with images and details, so the team can publish or retire products without filing a developer ticket.",
      },
      {
        title: "Carousel & Featured Video",
        body: "Hero carousel slides and the homepage featured video are managed entirely from the admin panel — marketing can refresh the front page anytime.",
      },
      {
        title: "Partners Management",
        body: "Partner logos and links are maintained in the admin UI, so adding or removing a partner is a 30-second task instead of a deploy.",
      },
      {
        title: "Customer Records",
        body: "All bookings and contact submissions land in one searchable admin view, so the team has a single place to follow up on leads.",
      },
    ],
    problem:
      "Aerocomp's previous site was static and disconnected from how the business actually ran. We replaced it with a content-managed marketing site bolted onto a live appointment booking system, so leads can self-serve and the team can run the calendar without juggling channels.",
    techStack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      ".NET",
      "PostgreSQL",
      "Node.js",
      "MongoDB",
      "Azure",
    ],
    mockup: aerocompMockup,
    poweredBy: [flow],
    seo: {
      description:
        "Case study: Aerocomp PH — a marketing site with integrated content management and appointment booking, live in production, built by Cybernest Solutions.",
      ogImage: "https://www.cybernestsolution.com/og-aerocomp.png",
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

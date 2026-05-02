import certifyLogo from "../assets/images/certify-logo.webp";
import certifyLogoAvif from "../assets/images/certify-logo.avif";
import pointflowPreview from "../assets/images/pointflow-preview.webp";
import type { ProjectSlug } from "./projects";

export type ProductSlug = "certify" | "pointflow";

export interface ProductImage {
  src: string;
  avif?: string;
}

export interface ProductExpandedFeature {
  title: string;
  body: string;
}

export interface ProductUseCase {
  title: string;
  body: string;
}

export interface FeaturedProduct {
  slug: ProductSlug;
  name: string;
  tagline: string;
  description: string;
  status: "live" | "coming-soon";
  liveUrl?: string;
  features: string[];
  expandedFeatures: ProductExpandedFeature[];
  useCases?: ProductUseCase[];
  problem?: string;
  techStack?: string[];
  images: ProductImage[];
  poweredProjects?: ProjectSlug[];
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
}

export const products: FeaturedProduct[] = [
  {
    slug: "certify",
    name: "Certify+",
    tagline:
      "Bulk certificate generation with a visual template builder and QR-based verification — built for Philippine schools, training centers, and event organizers.",
    description:
      "Certify+ lets organizations design certificate templates with a drag-and-drop builder, generate hundreds of personalized PDFs from a CSV, send them out by email, and let recipients prove authenticity with a public QR scan — all from one app, with a free tier to start.",
    status: "live",
    liveUrl: "https://certify.cybernestsolution.com/",
    features: [
      "Visual Template Builder",
      "Bulk Generation from CSV",
      "QR Code Verification",
      "Bulk Email Delivery",
    ],
    expandedFeatures: [
      {
        title: "Visual Template Builder",
        body: "Design certificates in a drag-and-drop editor — drop in logos, signatures, dynamic fields, and backgrounds without fighting document formatting.",
      },
      {
        title: "Bulk Generation from CSV",
        body: "Upload a recipient list and generate hundreds of personalized certificates in seconds, with names, dates, and details merged into the template automatically.",
      },
      {
        title: "QR Code Verification",
        body: "Every certificate carries a unique QR code that anyone can scan to confirm authenticity — no more 'is this real?' inbound to your team.",
      },
      {
        title: "Bulk Email Delivery",
        body: "Generate first, review the batch, then send — one click delivers every certificate to its recipient, with no manual attachments or copy-pasted addresses.",
      },
      {
        title: "Public Verification Page",
        body: "Recipients and third parties can verify any certificate on a public page in seconds, building trust without putting load on your staff.",
      },
      {
        title: "Brand Asset Management",
        body: "Upload logos, signatures, and backgrounds once, then reuse them across every template so every certificate looks unmistakably like your organization.",
      },
      {
        title: "Signatories & Audit Trail",
        body: "Manage authorized signatories from one place, and keep a full record of every certificate issued — who, when, and to whom.",
      },
      {
        title: "Free Tier & Paid Plans",
        body: "Start free with 50 certificates a month and 3 saved designs, or upgrade to Starter (₱199/mo) and Business (₱1,499/mo) plans as your volume grows.",
      },
    ],
    useCases: [
      {
        title: "Schools & Training Providers",
        body: "Issue completion certificates for courses, workshops, and graduations at scale, with QR verification recruiters can scan in seconds.",
      },
      {
        title: "Event Organizers",
        body: "Hand out attendance and speaker certificates the same day the event ends — not three weeks later when momentum is gone.",
      },
      {
        title: "Membership Organizations",
        body: "Generate annual membership certificates and renewals from a roster export, with QR-verifiable proof of standing.",
      },
      {
        title: "HR & Internal Recognition",
        body: "Run quarterly recognition programs with branded certificates issued from one place, complete with audit trail.",
      },
    ],
    problem:
      "Organizations issuing certificates by the hundreds waste hours every month assembling them in word processors and design tools, then chasing email delivery in spreadsheets. Certify+ replaces that workflow with a template-driven generator, bulk CSV import, one-click email delivery, and a public verification page — so issuance becomes a 10-minute task and recipients can prove legitimacy in seconds.",
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Vercel",
    ],
    images: [{ src: certifyLogo, avif: certifyLogoAvif }],
    poweredProjects: ["eneda", "tbido"],
    seo: {
      title: "Certify+ — Bulk Certificate Generator | Cybernest",
      description:
        "Certify+ — Cybernest's bulk certificate generator with a visual template builder, CSV import, bulk email delivery, and QR-based public verification. Free tier available.",
      ogImage: "https://www.cybernestsolution.com/og-certify.webp",
    },
  },
  {
    slug: "pointflow",
    name: "PointFlow+",
    tagline:
      "End-to-end queueing, booking, and appointment management — for customers in your office and customers booking from home.",
    description:
      "PointFlow+ lets organizations run walk-in queues, online bookings, and appointment calendars from a single system, so the team isn't juggling a paper queue, a shared calendar, and a DM inbox.",
    status: "live",
    features: [
      "Queueing System",
      "Booking System",
      "Appointment System",
      "Easy Integration",
    ],
    expandedFeatures: [
      {
        title: "Walk-in Queueing",
        body: "Issue queue numbers from a kiosk or counter, track who's waiting in real time, and call the next customer with a tap — no more paper tickets.",
      },
      {
        title: "Online Booking",
        body: "Customers book a slot from your website on their own time, with availability rules that match how your business actually runs.",
      },
      {
        title: "Appointment Calendar",
        body: "One unified calendar for staff that combines booked appointments and walk-ins, so the team always knows what's next.",
      },
      {
        title: "Teller Interface",
        body: "A purpose-built screen for counter staff to call, serve, and complete tickets — fast enough to keep up with peak hours.",
      },
      {
        title: "Public Display Boards",
        body: "Live-updating screens in the lobby show now-serving and next-up numbers, so customers always know where they stand.",
      },
      {
        title: "Email & SMS Reminders",
        body: "Automated confirmations and reminders so customers actually show up — and rebook quickly if they can't.",
      },
      {
        title: "Real-Time Status Updates",
        body: "Status changes propagate instantly across teller, display board, and customer-facing views, so everyone sees the same truth.",
      },
      {
        title: "Easy Integration",
        body: "PointFlow+ plugs into the systems you already use — websites, customer dashboards, internal tools — without forcing a platform migration.",
      },
    ],
    useCases: [
      {
        title: "Government & Public Service Offices",
        body: "Replace paper queues with a digital system citizens can join from their phone, so lobbies are calmer and processing throughput is visible.",
      },
      {
        title: "Clinics & Healthcare",
        body: "Combine appointment-based patients with walk-ins on one screen, so reception isn't toggling between tools during peak hours.",
      },
      {
        title: "Studios & Service Businesses",
        body: "Let customers self-book sessions online, with availability and capacity rules that match real-world constraints.",
      },
      {
        title: "Multi-Branch Operations",
        body: "Run the same system across every branch with consistent UX, while each branch manages its own queue and calendar.",
      },
    ],
    problem:
      "Walk-in customers, scheduled appointments, and online bookings usually live in three different tools — a paper ticket dispenser, a shared calendar, and a DM inbox. PointFlow+ unifies them into one coordinated system the team runs from any browser, so customers see consistent status and staff stop reconciling channels by hand.",
    techStack: [
      "React",
      "Tailwind CSS",
      "Node.js",
      "MongoDB",
      "Socket.io",
      "Azure",
    ],
    images: [{ src: pointflowPreview }],
    poweredProjects: ["orbit360", "eneda", "tbido", "aerocomp"],
    seo: {
      title: "PointFlow+ — Queueing & Appointment System | Cybernest",
      description:
        "PointFlow+ — Cybernest's unified queueing, booking, and appointment management platform for offices, clinics, studios, and multi-branch operations.",
      ogImage: "https://www.cybernestsolution.com/og-pointflow.webp",
    },
  },
];

export function getProductBySlug(slug: string): FeaturedProduct | undefined {
  return products.find((p) => p.slug === slug);
}

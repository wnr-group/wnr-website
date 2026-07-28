// Section 9 — Products. Each vertical SaaS product gets a premium moment.

export interface Product {
  slug: string;
  name: string;
  label: string; // e.g. "LIVE · VERTICAL SAAS"
  tagline: string;
  oneLiner: string;
  roi?: string;
  features: string[];
  href: string;
  ctaLabel: string;
  art: string; // vibrant product-brand artwork (under /brand)
  accent: "teal" | "amber"; // secondary accent tuned to the art
  // Detail-page extras
  heroBody?: string;
  strapline?: string;
  target: string;
  moat: string;
  revenueLabel: string;
  revenueValue: string;
  // In-page product hero extras
  overview: string;
  businessProblem: string;
  solution: string;
  industries: string[];
  technology: string[];
}

export const products: Product[] = [
  {
    slug: "eduos",
    name: "EduOS",
    label: "",
    tagline: "The operating brain for schools.",
    heroBody:
      "Fees, attendance, academics, staff, and parent communication in one platform. EduOS learns your school over time: every year it runs, it understands your students better. Built for where education is going, not where it's been.",
    strapline: "Beyond School. Beyond Marks. Beyond Tomorrow.",
    oneLiner:
      "Fees, attendance, academics, staff operations, and parent communication. One platform replacing spreadsheets, registers, and four WhatsApp groups. Configured to each school's real workflows.",
    roi: "The ROI is concrete: an 800-student school loses around $10,000 a year in leaky systems. EduOS recovers it.",
    features: [
      "Fee management & collections",
      "Attendance tracking",
      "Parent communication portal",
      "Staff operations",
      "Academic workflows",
      "Admin dashboards",
    ],
    href: "/products/eduos",
    ctaLabel: "Explore EduOS",
    art: "/brand/product-eduos.webp",
    accent: "teal",
    target: "Schools with 300–2,000 students.",
    moat: "Implementation depth + staff training + ongoing operational partnership.",
    revenueLabel: "SaaS Revenue",
    revenueValue: "$14.99 per school post-implementation",
    overview:
      "EduOS is the single operating system a school runs on: fees, attendance, academics, staff operations, and parent communication in one connected platform, configured to how the school actually works rather than forcing a generic template.",
    businessProblem:
      "Schools run fees, attendance, and parent communication across disconnected spreadsheets, paper registers, and ad-hoc WhatsApp groups. Nothing reconciles automatically, and the gaps leak revenue and staff hours every term.",
    solution:
      "EduOS unifies fee collection, attendance, academic workflows, staff operations, and parent communication into one implemented platform, configured against the school's real processes during onboarding rather than a one-size-fits-all setup.",
    industries: ["K-12 Schools", "Higher Education", "Coaching Institutes"],
    technology: [
      "Cloud-hosted platform",
      "Role-based admin dashboards",
      "Mobile parent portal",
      "Payment gateway integration",
    ],
  },
  {
    slug: "arenaos",
    name: "ArenaOS",
    label: "",
    tagline: "The operating system for booking-led businesses.",
    heroBody:
      "Wherever customers book a station, a court, or an hour, ArenaOS runs it. Billing tools tell you what you charged; ArenaOS tells you how the business is actually performing. Built for every venue that runs on time and space.",
    oneLiner:
      "Billing tools tell you what you charged. ArenaOS tells you how your business is actually performing: station booking, real-time revenue, and operational BI in one system.",
    roi: "Station & session management · Real-time revenue tracking · Operational dashboards & BI · UPI and GST ready.",
    features: [
      "Station & session management",
      "Real-time revenue tracking",
      "Operational dashboards & BI",
      "UPI & GST ready",
      "Business intelligence",
    ],
    href: "/products/arenaos",
    ctaLabel: "Explore ArenaOS",
    art: "/brand/product-arenaos.webp",
    accent: "amber",
    target: "Gaming cafes with 10+ stations. India.",
    moat: "India's only full gaming cafe OS.",
    revenueLabel: "Pipeline",
    revenueValue: "Productised SaaS for chains across India",
    overview:
      "ArenaOS is the full business operating system for gaming cafes: station and session booking, real-time revenue tracking, and operational business intelligence in one system, replacing billing software that only records what was charged.",
    businessProblem:
      "Gaming cafe owners typically run on billing tools that log transactions but say nothing about station utilization, peak hours, or true business performance. Decisions get made on gut feel, not data.",
    solution:
      "ArenaOS combines station and session management with real-time revenue tracking and operational dashboards, giving owners a live, accurate read on how the business is performing, with UPI and GST-ready billing built in.",
    industries: ["Gaming Cafes", "Esports Lounges", "Entertainment Centers"],
    technology: [
      "Cloud-hosted platform",
      "Real-time analytics dashboards",
      "UPI & GST-ready billing",
      "Station & session management engine",
    ],
  },
];

// "Coming soon" future products grid — portfolio ambition.
export const futureProducts = {
  eyebrow: "The Portfolio",
  heading: "More operating systems, coming soon.",
  list: ["Healthcare", "Manufacturing", "Retail", "Construction", "Hospitality"],
};

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

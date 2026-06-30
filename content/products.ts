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
  // Detail-page extras
  target: string;
  moat: string;
  revenueLabel: string;
  revenueValue: string;
}

export const products: Product[] = [
  {
    slug: "eduos",
    name: "EduOS",
    label: "Live · Vertical SaaS",
    tagline: "The operating brain for schools.",
    oneLiner:
      "Fees, attendance, academics, staff operations, and parent communication — one platform replacing spreadsheets, registers, and four WhatsApp groups. Configured to each school's real workflows.",
    roi: "The ROI is concrete: an 800-student school loses around ₹9.6L a year in leaky systems. EduOS recovers it.",
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
    target: "Schools with 300–2,000 students. South India + UAE.",
    moat: "Implementation depth + staff training + ongoing operational partnership.",
    revenueLabel: "SaaS Revenue",
    revenueValue: "₹1,000/month per school post-implementation",
  },
  {
    slug: "arenaos",
    name: "ArenaOS",
    label: "Live · Vertical SaaS",
    tagline: "The full business OS for gaming cafes.",
    oneLiner:
      "Billing tools tell you what you charged. ArenaOS tells you how your business is actually performing — station booking, real-time revenue, and operational BI in one system.",
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
    target: "Gaming cafes with 10+ stations. India.",
    moat: "India's only full gaming cafe OS.",
    revenueLabel: "Pipeline",
    revenueValue: "Productised SaaS for chains across India",
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

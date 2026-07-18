// Section 8 — Our divisions. Three operating arms, presented as live divisions.

export interface ArmProduct {
  name: string;
  href: string;
}

export interface Arm {
  name: string;
  slug: string;
  summary: string;
  description?: string;
  products?: ArmProduct[];
  flow?: string;
  capabilitiesLabel?: string;
  capabilitiesTitle?: string;
  capabilitiesBody?: string;
  whatYouGet?: string;
  deliverables?: string[];
}

const armData: Omit<Arm, "description">[] = [
  {
    name: "WnR Systems",
    slug: "systems",
    summary:
      "Custom operational builds, ERPs, web platforms, mobile apps. Generates revenue that funds product development.",
    products: [
      { name: "WnR EduOS", href: "/products/eduos" },
      { name: "WnR ArenaOS", href: "/products/arenaos" },
    ],
    capabilitiesLabel: "ARM 02",
    capabilitiesTitle: "The platform your business actually runs on.",
    capabilitiesBody:
      "WnR Systems builds the custom ERP platforms, business software, web applications, and mobile solutions our clients operate on every day — purpose-built around real workflows, never off-the-shelf compromises.",
    whatYouGet:
      "a live, working system configured to how your business runs — deployed, integrated, and adopted by your team.",
    deliverables: [
      "Custom operational platforms and ERP systems",
      "Web applications and multi-portal systems",
      "E-commerce platforms and marketplaces",
      "Mobile applications",
      "Implementation, training, and ongoing support",
    ],
  },
  {
    name: "WnR Consulting",
    slug: "consulting",
    summary:
      "Operational advisory. Map workflows, identify losses, prescribe the right system before any code is written.",
    flow: "Consulting → Systems → SaaS.",
    capabilitiesLabel: "ARM 01",
    capabilitiesTitle: "We don't start with code. We start with your operations.",
    capabilitiesBody:
      "WnR Consulting studies how your business actually runs — mapping workflows, finding where time and money leak, and designing the right operational strategy before a single line of software is written.",
    whatYouGet:
      "a clear diagnosis of your operations, a prioritised map of what to fix, and the right system prescribed — whether we build it or not.",
    deliverables: [
      "Workflow mapping and process audit",
      "Operational gap analysis — where time and money leak",
      "System prescription and roadmap",
      "Digital transformation strategy",
    ],
  },
  {
    name: "WnR AI Labs",
    slug: "ai-labs",
    summary:
      "Builds the AI and automation layer powering all products. The intelligence inside everything WnR builds.",
    capabilitiesLabel: "ARM 03",
    capabilitiesTitle: "The intelligence layer across everything we build.",
    capabilitiesBody:
      "WnR AI Labs develops the AI-native technologies and automation that power every WnR product and solution — removing manual effort and surfacing the operational intelligence hiding in your data.",
    whatYouGet:
      "workflows that run themselves, insights you didn't have to ask for, and systems that get smarter the longer they run.",
    deliverables: [
      "AI-enabled workflow automation",
      "Operational intelligence and predictive insight",
      "Document and process automation",
      "The AI capability inside EduOS and ArenaOS",
    ],
  },
];

export const arms: Arm[] = armData.map((arm) => ({
  ...arm,
  description: arm.summary,
}));

export const divisions = {
  eyebrow: "How We're Built",
  heading: "One company. Three operating arms.",
  intro:
    "Each arm specialises — together they take a business from operational strategy to live system to intelligent automation.",
};

export const capabilitiesHero = {
  eyebrow: "OUR CAPABILITIES",
  heading: "One company. Three operating arms.",
  subhead:
    "Consulting maps it. Systems build it. AI Labs makes it intelligent. Together they take a business from operational strategy to live system to intelligent automation.",
};

export const capabilitiesCta = {
  title: "Not sure which arm you need?",
  body:
    "Most clients don't — that's what the first conversation is for. Tell us what's not working, and we'll tell you what would fix it.",
  button: "Let's Talk",
};


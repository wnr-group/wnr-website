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
  },
  {
    name: "WnR Consulting",
    slug: "consulting",
    summary:
      "Operational advisory. Map workflows, identify losses, prescribe the right system before any code is written.",
    flow: "Consulting → Systems → SaaS.",
  },
  {
    name: "WnR AI Labs",
    slug: "ai-labs",
    summary:
      "Builds the AI and automation layer powering all products. The intelligence inside everything WnR builds.",
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

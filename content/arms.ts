// Section 8 — Our divisions. Three operating arms, presented as live divisions.

export interface Arm {
  name: string;
  slug: string;
  description: string;
}

export const arms: Arm[] = [
  {
    name: "WnR Systems",
    slug: "systems",
    description:
      "Builds the custom ERP platforms, business software, web applications, and mobile solutions our clients run on.",
  },
  {
    name: "WnR Consulting",
    slug: "consulting",
    description:
      "Studies business operations, identifies workflow challenges, and designs the right operational strategy before any software is built.",
  },
  {
    name: "WnR AI Labs",
    slug: "ai-labs",
    description:
      "Develops the AI-native technologies and automation that power every WnR product and solution — the intelligence layer across the portfolio.",
  },
];

export const divisions = {
  eyebrow: "How We're Built",
  heading: "One company. Three operating arms.",
  intro:
    "Each arm specialises — together they take a business from operational strategy to live system to intelligent automation.",
};

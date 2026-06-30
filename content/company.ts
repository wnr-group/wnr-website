// All site copy lives in typed content modules so pages stay presentational.
// Copy is taken verbatim from the WnR Website Build Spec + landing brief.

export const company = {
  name: "WnR Group",
  wordmark: "WnR",
  motto: "Wisdom & Results",
  tagline: "Building What's Next",
  subTagline: "Operational intelligence for modern business.",
  geography: "Tamil Nadu → India → Europe",
  hq: "Tamil Nadu, India",
  category: "Tech Company & Services",

  heroBody:
    "We build the operational brain of your business — custom platforms, AI-native workflows, and vertical SaaS products that replace scattered tools with one intelligent system. We don't just build it. We implement it, train your team, and stay.",

  // Section 14 — Vision
  mission:
    "To become the most trusted AI-native operational intelligence company — helping businesses transform complexity into clarity.",
  vision:
    "A portfolio of industry operating systems that replace chaos with clarity, across every sector where businesses operate.",
  coreBelief:
    "The long-term moat is not coding. It's workflow understanding, implementation depth, and the strength of customer relationships.",
} as const;

// Section 2 — Proof bar. Keep these consistent with deck / MIS / sales.
export interface ProofStat {
  value: string;
  label: string;
}

export const proofStats: ProofStat[] = [
  { value: "73+", label: "Clients served across industries" },
  { value: "2", label: "Live vertical SaaS products (EduOS · ArenaOS)" },
  { value: "25+", label: "Engineers, sales & support" },
  { value: "3", label: "Operating arms (Systems · Consulting · AI Labs)" },
];

export const recognition = [
  "Redex People Power Award",
  "Official Technology Partner — Testio",
];

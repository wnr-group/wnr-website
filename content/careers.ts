// Careers page content — hero, why-work-with-us, benefits, hiring process,
// current openings, and resume-upload configuration. Culture content is
// intentionally reused from content/sections.ts's `culture` export (same
// pillars already used elsewhere) rather than duplicated here.

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
  experience: string;
  description: string;
}

export const careersHero = {
  eyebrow: "Careers",
  heading: "Build your future with WnR Group.",
  lead: "We're 25+ engineers, strategists, and operators building the operating systems businesses actually run on. Come build what's next with us.",
  ctaLabel: "Explore Opportunities",
};

export interface CareersReason {
  title: string;
  body: string;
  icon: "growth" | "impact" | "team";
}

export const whyWorkWithUs = {
  eyebrow: "Why Work With WnR",
  heading: "Real ownership, from day one.",
  intro:
    "You won't be a cog in a delivery machine. Every engineer, consultant, and designer here owns outcomes — not just tickets.",
  reasons: [
    {
      title: "Ship what you build",
      body: "No hand-off to a separate delivery team — you scope it, build it, implement it with the client, and see the outcome land.",
      icon: "growth",
    },
    {
      title: "Work that compounds",
      body: "Every engagement feeds the product portfolio. What you learn on one client's workflow makes EduOS and ArenaOS smarter.",
      icon: "impact",
    },
    {
      title: "A small, senior team",
      body: "25+ people, no layers of management between you and the decision. You'll work directly with the founders and the client.",
      icon: "team",
    },
  ] satisfies CareersReason[],
};

export interface Benefit {
  title: string;
  body: string;
  icon: "health" | "flexibility" | "growth" | "compensation" | "tools" | "culture";
}

export const benefits = {
  eyebrow: "Benefits",
  heading: "What you get.",
  items: [
    {
      title: "Health coverage",
      body: "Group health insurance for you and your family from day one.",
      icon: "health",
    },
    {
      title: "Flexible hours",
      body: "Remote-friendly roles and flexible schedules built around outcomes, not desk time.",
      icon: "flexibility",
    },
    {
      title: "Learning budget",
      body: "An annual budget for courses, books, and conferences — your growth compounds ours.",
      icon: "growth",
    },
    {
      title: "Competitive pay",
      body: "Salary benchmarked against the market, reviewed every year, no negotiation games.",
      icon: "compensation",
    },
    {
      title: "Modern tooling",
      body: "The laptop and stack you need to do your best work, no fighting procurement for it.",
      icon: "tools",
    },
    {
      title: "A real team",
      body: "Small enough that everyone knows your name, senior enough that you'll learn something every week.",
      icon: "culture",
    },
  ] satisfies Benefit[],
};

export interface HiringStep {
  num: string;
  title: string;
  body: string;
}

export const hiringProcess = {
  eyebrow: "Hiring Process",
  heading: "How we hire.",
  intro: "Four steps, no black box. We move fast and tell you where you stand at every stage.",
  steps: [
    { num: "01", title: "Apply", body: "Send your resume against a role — or submit it speculatively if nothing's open yet." },
    { num: "02", title: "Screen", body: "A 30-minute call with our team to understand your background and what you're looking for." },
    { num: "03", title: "Interview", body: "A working session on real problems from our client engagements — no whiteboard trivia." },
    { num: "04", title: "Offer", body: "We move fast on a decision and make an offer within days of your final interview." },
  ] satisfies HiringStep[],
};

export const openings: Job[] = [
  {
    id: "senior-fullstack-engineer",
    title: "Senior Full-Stack Engineer",
    department: "WnR Systems",
    location: "Tamil Nadu / Remote",
    employmentType: "Full-time",
    experience: "4-7 years",
    description:
      "Own features end-to-end across our client platforms and vertical SaaS products — from data model to deployed UI.",
  },
  {
    id: "operations-consultant",
    title: "Operations Consultant",
    department: "WnR Consulting",
    location: "Tamil Nadu",
    employmentType: "Full-time",
    experience: "3-5 years",
    description:
      "Map client workflows on-site, identify where time and money leak, and design the operational strategy our engineers build against.",
  },
  {
    id: "ai-ml-engineer",
    title: "AI/ML Engineer",
    department: "WnR AI Labs",
    location: "Remote, India",
    employmentType: "Full-time",
    experience: "2-5 years",
    description:
      "Build the automation and intelligence layer that ships inside every WnR product — from workflow copilots to operational forecasting.",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    department: "WnR Systems",
    location: "Tamil Nadu / Remote",
    employmentType: "Full-time",
    experience: "3-6 years",
    description:
      "Design the interfaces real operators use every day — dense, fast, and built around how the workflow actually happens.",
  },
];

export const noOpeningsCopy = {
  heading: "No current openings.",
  body: "We are always looking for exceptional talent.",
  ctaLabel: "Submit Resume",
};

export const careersCta = {
  heading: "We're building what's next. Want in?",
  body: "Don't see your role? Tell us how you'd make WnR Group better.",
  ctaLabel: "Get in Touch",
};

export const resumeConfig = {
  acceptedExtensions: [".pdf", ".doc", ".docx"] as const,
  acceptedMimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ] as const,
  maxSizeBytes: 4 * 1024 * 1024,
};

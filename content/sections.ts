// Homepage narrative content — one export per section, in scroll order.
// Verbatim copy from the WnR Website Build Spec + landing brief.

/* ── 3 · The Problem ─────────────────────────────────────────────────── */
export const problem = {
  eyebrow: "Why We Exist",
  heading: "Businesses don't fail from lack of effort. They drown in complexity.",
  body: "Growing businesses run on WhatsApp threads, Excel sheets, emails, and disconnected software. As teams grow, information scatters, decisions slow down, and no one has a single source of truth. The effort is there. The system isn't.",
  // The scatter→system animation cycles through these
  scatter: ["WhatsApp", "Excel", "Emails", "Paper files", "Manual approvals", "Disconnected apps"],
};

/* ── 4 · What We Build ───────────────────────────────────────────────── */
export interface Pillar {
  title: string;
  body: string;
  icon: "system" | "ai" | "saas";
}

export const whatWeBuild = {
  eyebrow: "What We Build",
  heading: "We build the operating system behind your business.",
  intro:
    "We don't hand you another app. We study how your business actually runs, find where time and money leak, and build the intelligent system that fixes it.",
  pillars: [
    {
      title: "Custom Software & Systems",
      body: "Bespoke operational platforms, ERP systems, web platforms, and mobile apps — built around your workflows, not off-the-shelf compromises. Fees, attendance, operations, dashboards: one system replacing scattered spreadsheets and WhatsApp groups.",
      icon: "system",
    },
    {
      title: "AI-Native Workflows",
      body: "AI-enabled automation that removes manual effort and surfaces real operational intelligence — smart approvals, insights, and workflow optimisation built in from the ground up.",
      icon: "ai",
    },
    {
      title: "Vertical SaaS Products",
      body: "Industry-specific operating systems — EduOS, ArenaOS, and more — productised from real operational experience and ready to scale.",
      icon: "saas",
    },
  ] satisfies Pillar[],
  closer: "One partner — from strategy to system to support.",
};

/* ── 5 · Our Approach ────────────────────────────────────────────────── */
export interface ApproachStep {
  num: string;
  title: string;
  body: string;
}

export const approach = {
  eyebrow: "Our Approach",
  heading: "We don't start with code. We start with your operations.",
  intro: "Consulting → Systems → SaaS. A four-step method that maps your business before a single line is written.",
  steps: [
    { num: "01", title: "Map", body: "We map your workflows and pinpoint exactly where time and money leak today." },
    { num: "02", title: "Build", body: "We build the right system around your operations — purpose-built, never a generic tool." },
    { num: "03", title: "Implement & Train", body: "We deploy, configure to your real workflows, and train your team to full adoption." },
    { num: "04", title: "Partner", body: "We stay on — monthly support, reviews, and improvements. We don't build and leave." },
  ] satisfies ApproachStep[],
};

/* ── 7 · Why WnR is different ─────────────────────────────────────────── */
export const whyUs = {
  eyebrow: "Why Teams Choose Us",
  heading: "Most companies build and leave. We build and stay.",
  subhead: "That's not a better product. It's a completely different relationship.",
  // Left = most agencies, right = WnR. Rows are paired contrasts.
  contrast: [
    { them: "Build an application", us: "Study how your business operates" },
    { them: "Deliver the project", us: "Design the complete workflow" },
    { them: "Move to the next client", us: "Build the intelligent system" },
    { them: "Limited grasp of operations", us: "Implement across the organisation" },
    { them: "Project ends at deployment", us: "Train your team to full adoption" },
    { them: "You're on your own after", us: "Stay on with continuous improvement" },
  ],
  themLabel: "A vendor",
  usLabel: "A long-term operational partner",
  chips: [
    "Implementation-first",
    "Operational depth",
    "Outcome-driven",
    "Vertical expertise",
    "Long-term partner",
    "Proven & recognised",
  ],
};

/* Value cards from the landing brief (Zoho-style "Why us") */
export interface ValueCard {
  title: string;
  body: string;
  icon: "partnership" | "people" | "privacy" | "ai";
}

export const values: ValueCard[] = [
  {
    title: "Long-term Partnership",
    body: "We don't just launch projects — we stay to optimize, scale, and grow with your business. Our relationship begins where most engagements end.",
    icon: "partnership",
  },
  {
    title: "People Before Platforms",
    body: "Great businesses are built by great people. Every solution we create empowers both your customers and your employees, making work simpler and experiences better.",
    icon: "people",
  },
  {
    title: "Privacy by Design",
    body: "Your data is your competitive advantage. We never monetize or sell it. Every solution is built with security, transparency, and trust at its core.",
    icon: "privacy",
  },
  {
    title: "AI-Native Innovation",
    body: "AI isn't an add-on — it's how we build. We embed intelligent automation into everyday operations to improve efficiency, decision-making, and continuous growth.",
    icon: "ai",
  },
];

/* ── 10 · Industries ─────────────────────────────────────────────────── */
export const industries = {
  eyebrow: "Where We've Built",
  heading: "Operating systems across industries.",
  footnote: "From single-site deployments to productised vertical operating systems.",
  list: [
    "Schools & Education",
    "Gaming & Esports",
    "Logistics & Freight",
    "B2B & D2C E-Commerce",
    "Marine",
    "Training & Careers",
    "Food & Marketplace",
    "SMB Enterprises",
  ],
};

/* ── 11 · Selected work ──────────────────────────────────────────────── */
export interface CaseStudy {
  tag: string;
  title: string;
  body: string;
  result: string;
}

export const work = {
  eyebrow: "Selected Work",
  heading: "Custom platforms. Measurable outcomes.",
  cases: [
    {
      tag: "Education / HR",
      title: "Campus Recruitment Platform",
      body: "Unified student, recruiter, and admin dashboards with an automated recruitment workflow, approvals, and analytics.",
      result: "~60% reduction in manual processes, faster recruiter coordination, data-driven placement insights.",
    },
    {
      tag: "Textile / Retail",
      title: "D2C E-Commerce Channel",
      body: "SEO-optimised, mobile-friendly storefront with secure payments and order management for a brand moving beyond offline retail.",
      result: "A new direct sales channel, improved discoverability, stronger repeat-purchase loyalty.",
    },
    {
      tag: "Logistics",
      title: "Freight & Customs Operations",
      body: "Automated logistics pipeline — shipment booking, documentation, customs workflow, and live delivery monitoring.",
      result: "Real-time shipment visibility, fewer delays, streamlined customs coordination.",
    },
  ] satisfies CaseStudy[],
};

/* ── 12 · Technology ─────────────────────────────────────────────────── */
export const technology = {
  eyebrow: "Technology",
  heading: "Modern full-stack engineering.",
  body: "Scalable, high-performance, SEO-ready platforms — web applications, multi-portal systems, talent marketplaces, e-commerce, and high-performance landing pages.",
  layers: [
    { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind"] },
    { label: "Backend", items: ["Node.js", "Python", "PostgreSQL", "REST / GraphQL"] },
    { label: "Automation", items: ["AI Workflows", "LLM Pipelines", "Event Queues", "Webhooks"] },
    { label: "Hosting", items: ["Vercel", "AWS", "Cloudflare", "Edge CDN"] },
  ],
};

/* ── 13 · Inside WnR — team & culture (no faces) ─────────────────────── */
export const culture = {
  eyebrow: "Inside WnR",
  heading: "A team obsessed with how businesses actually work.",
  intro:
    "We're 25+ engineers, strategists, and operators who believe the hard part was never the code — it's understanding the business well enough to build the system it truly needs. That belief shapes how we hire, how we build, and how we stay.",
  pillars: [
    { title: "We map before we build", body: "Every engineer here learns the business first. We sit with operations, watch the workflow, and find the leak before we write a line of code." },
    { title: "We stay for the outcome", body: "We measure ourselves in time saved and money recovered — not features shipped. The work isn't done at deployment; it's done when it's adopted." },
    { title: "We build what's next", body: "AI-native from the ground up, productising what we learn into vertical operating systems. Every client engagement makes the whole portfolio smarter." },
  ],
  recruitCta: "We're building what's next. Want in?",
};

/* ── 15 · Final CTA ──────────────────────────────────────────────────── */
export const finalCta = {
  heading: "Let's talk about your operations.",
  body: "Whether you're streamlining operations, building a custom platform, or adopting an industry operating system — WnR is ready. Together we build, together we grow.",
  ctaLabel: "Start Your Journey",
};

// Exact verbatim copy for WnR About Us Page from Project Documentation & PDF Spec.
// Every section adheres strictly to the ordered 11-part enterprise storytelling flow.

export interface AboutSectionCopy {
  eyebrow?: string;
  heading: string;
  subhead?: string;
  body?: string | string[];
}

// 1. Hero
export const aboutHero = {
  eyebrow: "ABOUT WNR",
  heading: "We build the operational brain of your business.",
  lead: "WnR Group is an information technology and services company. We build intelligent operational systems, custom platforms, AI-enabled workflows, and vertical SaaS products, for schools, gaming businesses, and modern enterprises.",
};

// 2. Awards & Recognition
export const aboutAwards = {
  eyebrow: "AWARDS & RECOGNITION",
  heading: "Recognized for operational excellence and workplace culture.",
  featuredAward: {
    title: "Redex People Power Award",
    quoteBadge: "'PEOPLE POWER AWARD RECIPIENT'",
    body: "Recognized for building an engineering and consulting culture obsessed with deep workflow understanding and long-term client outcomes. Our engineers sit with operations before writing a single line of code.",
  },
  recognitions: [
    {
      icon: "Users" as const,
      theme: "green" as const,
      badge: "People & Culture",
      title: "Redex People Power Award",
      description: "Recognized for building an engineering culture focused on business outcomes and long-term relationship.",
      year: "2025–2026",
    },
    {
      icon: "Gem" as const,
      theme: "blue" as const,
      badge: "Partnership Excellence",
      title: "Official Technology Partner, Testio",
      description: "Trusted technology partner for enterprise software systems.",
      year: "Certified Partner",
    },
  ],
  trustPoints: [
    { icon: "Crown" as const, tone: "forestDeep" as const, title: "People First", description: "Culture built on trust, growth, and ownership." },
    { icon: "Target" as const, tone: "gold" as const, title: "Outcome Driven", description: "We focus on real business outcomes that matter." },
    { icon: "ShieldCheck" as const, tone: "forestBright" as const, title: "Trusted by Clients", description: "Long-term partnerships built on results." },
    { icon: "Globe" as const, tone: "navy" as const, title: "Excellence Certified", description: "Recognitions that reflect our commitment to quality." },
  ],
};

// 3. Why WNR Exists
export const aboutWhyWeExist = {
  eyebrow: "WHY WE EXIST",
  heading: "Businesses don't fail from lack of effort, they fail from disconnected systems.",
  paragraphs: [
    "When WhatsApp, Excel, emails, and scattered software become the operating model, growth slows. WnR was built to bring everything together into one intelligent system.",
  ],
  chaosTools: [
    "WhatsApp threads",
    "Excel sheets",
    "Scattered emails",
    "Disconnected software",
    "Siloed databases",
    "Manual approval chains",
  ],
  claritySystem: "Connected Operational Platform",
};

// 4. Mission
export const aboutMission = {
  eyebrow: "OUR MISSION",
  heading: "To become the most trusted AI-native operational intelligence company, helping businesses transform complexity into clarity.",
};

// 5. Vision
export const aboutVision = {
  eyebrow: "OUR VISION",
  heading: "To build a vertical SaaS holding company, a portfolio of industry operating systems that replace chaos with clarity, across every sector where businesses operate.",
};

// 6. What We Believe
export const aboutWhatWeBelieve = {
  eyebrow: "WHAT WE BELIEVE",
  heading: "The moat AI can't automate.",
  body: "The future doesn't belong to those who write the best code alone. Our advantage isn't writing code, it's understanding workflows, solving real operational problems, and staying until the solution delivers results.",
};

// 7. How We Work
export const aboutHowWeWork = {
  eyebrow: "HOW WE WORK",
  heading: "Four principles, every engagement.",
  principles: [
    {
      number: "01",
      title: "We map before we build",
      body: "Every engineer here learns the business first. We sit with operations, watch the workflow, and find the leak before we write a line of code.",
    },
    {
      number: "02",
      title: "We stay for the outcome",
      body: "We measure ourselves in time saved and money recovered, not features shipped. The work isn't done at deployment; it's done when it's adopted.",
    },
    {
      number: "03",
      title: "We build vertical, not generic",
      body: "Purpose-built operating systems for real industries. Depth beats breadth, every time.",
    },
    {
      number: "04",
      title: "We build what's next",
      body: "AI-native from the ground up, productising what we learn into vertical operating systems. Every client engagement makes the whole portfolio smarter.",
    },
  ],
};

// 8. Inside WNR
export const aboutInsideWnr = {
  eyebrow: "INSIDE WNR",
  heading: "A team obsessed with how businesses actually work.",
  body: "We're 23+ engineers, strategists, and operators who believe the hard part was never the code, it's understanding the business well enough to build the system it truly needs. That belief shapes how we hire, how we build, and how we stay.",
  culturePillars: [
    {
      title: "We map before we build",
      body: "Every engineer here learns the business first. We sit with operations, watch the workflow, and find the leak before we write a line of code.",
    },
    {
      title: "We stay for the outcome",
      body: "We measure ourselves in time saved and money recovered, not features shipped. The work isn't done at deployment; it's done when it's adopted.",
    },
    {
      title: "We build intelligent systems",
      body: "AI-native from the ground up, productising what we learn into vertical operating systems. Every client engagement makes the whole portfolio smarter.",
    },
  ],
};

// 9. Where We're Going
export const aboutWhereWeAreGoing = {
  eyebrow: "WHERE WE'RE GOING",
  heading: "We're not building software. We're building the intelligence layer for how businesses run.",
  intro: [
    "Every system we build teaches us something about how an industry actually works. We productise that understanding. Then we do it again, in a new industry, and the whole portfolio gets smarter.",
    "That's the compounding engine behind everything below.",
  ],
  horizons: [
    {
      horizon: "HORIZON ONE · NOW",
      title: "Two industries, running live.",
      paragraphs: [
        "EduOS is the operating brain for schools, fees, attendance, academics, staff, and parents in one system. ArenaOS runs booking-led venues, from gaming cafes to courts and studios, turning billing into real operational intelligence.",
        "Both are live, both are learning, and both are getting sharper every term they run.",
      ],
      badge: "Active & Learning",
      accent: "forest",
    },
    {
      horizon: "HORIZON TWO · NEXT",
      title: "A third vertical. A new shape of problem.",
      paragraphs: [
        "This year we launch our third product, our most ambitious yet, and the first time we take our operating-system thinking beyond the businesses we serve, and into the way people move things across a city.",
        "Same philosophy: understand the operation deeply, build the system it truly needs, then stay. Different scale entirely.",
        "More soon.",
      ],
      badge: "Launching This Year",
      accent: "teal",
    },
    {
      horizon: "HORIZON THREE · BEYOND",
      title: "A portfolio of industry operating systems.",
      paragraphs: [
        "From healthcare and retail to manufacturing, hospitality, education, logistics, and financial services, every industry deserves systems built for the way it actually operates.",
        "We don't expand into sectors, we earn the right to serve them. By deeply understanding business workflows, we create industry-specific platforms that scale across organizations, regions, and global markets.",
        "From Neighbourhoods to Nations.",
      ],
      badge: "Long-Term Vision",
      accent: "amber",
    },
  ],
};

// 10. The 2040 Anchor (EduOS)
export const aboutEduOsAnchor = {
  eyebrow: "A WNR ADVISORY INITIATIVE, EduOS",
  title: "THE LONG VIEW",
  heading: "Education is not about managing schools. It is about empowering students.",
  paragraphs: [
    "EduOS was founded on a simple yet powerful belief: every student has the potential to succeed when they are understood, encouraged, and guided in the right direction.",
    "Our mission is to empower 1 Million students by 2030 by helping schools, teachers, and parents understand every learner beyond marks, enabling each student to discover their strengths and reach their fullest potential.",
    "Our vision is to create the world's most trusted student intelligence ecosystem, where every learner's educational journey is understood, supported, and celebrated from the first day of school through graduation.",
    "Every decision begins with one question: will this improve the educational experience of students?",
    "EduOS exists to bridge this gap. More than a platform, EduOS is designed to be a trusted companion throughout a student's educational journey.",
  ],
  closingBold: "Empowering Every Student. Enabling Every School. Inspiring Every Future.",
  progression: ["Data", "Intelligence", "Action", "Success"],
};

// 11. CTA
export const aboutCta = {
  eyebrow: "CTA",
  heading: "Build what's next with us.",
  body: "Whether you want a system built or a career made, let's talk.",
  primaryButton: "Work With Us",
  primaryHref: "/contact",
  secondaryButton: "See Open Roles",
  secondaryHref: "/careers",
};

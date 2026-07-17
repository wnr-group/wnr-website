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
  lead: "WnR Group is an information technology and services company. We build intelligent operational systems — custom platforms, AI-enabled workflows, and vertical SaaS products — for schools, gaming businesses, and modern enterprises.",
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
      badge: "People & Culture",
      title: "Redex People Power Award",
      description: "Recognized for building an engineering culture obsessed with business workflows and long-term client outcomes.",
      year: "2025–2026",
    },
    {
      badge: "Partnership Excellence",
      title: "Official Technology Partner — Testio",
      description: "Trusted enterprise integration and quality assurance partnership across high-performance software systems.",
      year: "Certified Partner",
    },
  ],
};

// 3. Why WNR Exists
export const aboutWhyWeExist = {
  eyebrow: "WHY WE EXIST",
  heading: "Businesses don't fail from lack of effort. They drown in complexity.",
  paragraphs: [
    "Growing businesses run on WhatsApp threads, Excel sheets, emails, and disconnected software. As teams grow, information scatters, decisions slow down, and no one has a single source of truth. The effort is there. The system isn't. We started WnR to build the system.",
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
  heading: "To become the most trusted AI-native operational intelligence company — helping businesses transform complexity into clarity.",
};

// 5. Vision
export const aboutVision = {
  eyebrow: "OUR VISION",
  heading: "To build a vertical SaaS holding company — a portfolio of industry operating systems that replace chaos with clarity, across every sector where businesses operate.",
};

// 6. What We Believe
export const aboutWhatWeBelieve = {
  eyebrow: "WHAT WE BELIEVE",
  heading: "The long-term moat is not coding.",
  body: "It's workflow understanding, implementation depth, and the depth of customer relationships. Anyone can write software. Almost nobody takes the time to understand how a business actually runs — and then stays to make sure the system works.",
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
      body: "We measure ourselves in time saved and money recovered — not features shipped. The work isn't done at deployment; it's done when it's adopted.",
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
  body: "We're 25+ engineers, strategists, and operators who believe the hard part was never the code — it's understanding the business well enough to build the system it truly needs. That belief shapes how we hire, how we build, and how we stay.",
  culturePillars: [
    {
      title: "We map before we build",
      body: "Every engineer here learns the business first. We sit with operations, watch the workflow, and find the leak before we write a line of code.",
    },
    {
      title: "We stay for the outcome",
      body: "We measure ourselves in time saved and money recovered — not features shipped. The work isn't done at deployment; it's done when it's adopted.",
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
    "Every system we build teaches us something about how an industry actually works. We productise that understanding. Then we do it again, in a new industry — and the whole portfolio gets smarter.",
    "That's the compounding engine behind everything below.",
  ],
  horizons: [
    {
      horizon: "HORIZON ONE · NOW",
      title: "Two industries, running live.",
      paragraphs: [
        "EduOS is the operating brain for schools — fees, attendance, academics, staff, and parents in one system. ArenaOS runs booking-led venues, from gaming cafes to courts and studios, turning billing into real operational intelligence.",
        "Both are live, both are learning, and both are getting sharper every term they run.",
      ],
      badge: "Active & Learning",
      accent: "forest",
    },
    {
      horizon: "HORIZON TWO · NEXT",
      title: "A third vertical. A new shape of problem.",
      paragraphs: [
        "This year we launch our third product — our most ambitious yet, and the first time we take our operating-system thinking beyond the businesses we serve, and into the way people move things across a city.",
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
        "Healthcare. Retail. Manufacturing. Hospitality. Construction. Every sector where businesses still run on spreadsheets, WhatsApp groups, and instinct — and deserve better.",
        "We enter an industry only when we understand it deeply enough to productise it. That's slower than raising and spraying. It's also why our products work.",
        "Tamil Nadu → India → Europe.",
      ],
      badge: "Long-Term Vision",
      accent: "amber",
    },
  ],
};

// 10. The 2040 Anchor (EduOS)
export const aboutEduOsAnchor = {
  eyebrow: "THE 2040 ANCHOR — EduOS",
  title: "THE LONG VIEW",
  heading: "By 2040, no student's future will be decided by incomplete information.",
  paragraphs: [
    "Today, EduOS runs a school's operations. That's the beginning, not the ambition.",
    "Every year EduOS runs, it builds a deeper understanding of how each student actually learns — not just marks, but patterns, strengths, participation, and growth over time. Multiply that across thousands of students and a decade of real outcomes, and something becomes possible that has never existed in Indian education: evidence where there was only instinct.",
    "A teacher who sees a student struggling in week three, not month three. A parent who understands their child beyond a report card. A 13-year-old who discovers a strength nobody noticed — and a path nobody thought to suggest.",
    "Not an algorithm that decides a child's future. An intelligence that makes sure nobody's future is decided by what the system failed to see.",
    "That's what we mean by a lifetime companion. And it's why we're building EduOS now, patiently, one school at a time — because the intelligence of 2040 is made of the data, trust, and understanding we earn today.",
  ],
  closingBold: "Beyond School. Beyond Marks. Beyond Tomorrow.",
  progression: ["Data", "Intelligence", "Action", "Success"],
};

// 11. CTA
export const aboutCta = {
  eyebrow: "CTA",
  heading: "Build what's next with us.",
  body: "Whether you want a system built or a career made — let's talk.",
  primaryButton: "Work With Us",
  primaryHref: "/contact",
  secondaryButton: "See Open Roles",
  secondaryHref: "/careers",
};

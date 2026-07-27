// Verbatim content for the EduOS Information Experience modal, sourced entirely
// from docs/Edu Os.docx. Nothing here is invented, rewritten, or summarized —
// only structured for presentation. See docs/superpowers/specs/2026-07-24-eduos-information-experience-design.md.

export interface EduOsCoreValue {
  icon: "Target" | "ShieldCheck" | "GraduationCap" | "Sprout" | "Lightbulb";
  title: string;
  body: string[];
}

export interface EduOsRoadmapPhase {
  year: string;
  title: string;
  focus?: string;
  milestones?: string[];
  paragraphs?: string[];
  statTarget?: number;
  statLabel?: string;
}

export const eduOsExperience = {
  eyebrow: "A WnR Advisory Initiative",

  hero: {
    kicker: "About Us",
    heading: ["Education is not about managing schools.", "It is about empowering students."],
    beliefLead: "EduOS was founded on a simple yet powerful belief:",
    belief:
      "Every student has the potential to succeed when they are understood, encouraged, and guided in the right direction.",
  },

  story: {
    heading: "Our Story",
    paragraphs: [
      "While schools have embraced technology to digitise administration, the true purpose of education extends far beyond attendance registers, examinations, and report cards. Every student carries a unique combination of abilities, aspirations, challenges, and talents that deserve to be recognised and nurtured.",
      "EduOS exists to bridge this gap.",
      "We are building an ecosystem where technology serves education with purpose—helping schools understand learners better, enabling teachers with meaningful insights, strengthening collaboration with parents, and empowering students to discover their own strengths.",
      "More than a platform, EduOS is designed to be a trusted companion throughout a student's educational journey.",
    ],
    advisory: {
      heading: "A Wing of WnR Advisory",
      paragraphs: [
        "EduOS is an education initiative developed by WnR Advisory, a consulting and technology firm focused on creating practical, human-centred digital solutions for organisations.",
        "At WnR Advisory, our philosophy is reflected in our name: Wisdom and Results.",
        "We believe that meaningful technology should simplify complexity, support better decisions, and create measurable impact.",
        "Drawing on our experience in digital transformation, data strategy, and technology consulting, we established EduOS with a single purpose—to apply these capabilities where they can make one of the greatest long-term differences: education.",
        "By combining educational understanding with thoughtful technology, we aim to help schools move beyond administration and towards truly student-centred learning.",
      ],
    },
  },

  whyWeStarted: {
    heading: "Why We Started EduOS",
    paragraphs: [
      "Schools generate valuable information every day. Students create stories of perseverance, curiosity, improvement, leadership, creativity, and resilience.",
      "Yet much of this information remains scattered across registers, spreadsheets, examination records, and disconnected systems. As a result, opportunities to understand and support students can be missed.",
      "EduOS was created to change this.",
      "Our goal is to transform educational information into meaningful understanding—helping educators recognise strengths earlier, identify learning needs sooner, and make informed decisions that support every learner's growth.",
      "We believe that when schools understand students better, students gain a greater opportunity to realise their full potential.",
    ],
  },

  pillars: {
    purpose: {
      label: "Our Purpose",
      body: "To build an educational ecosystem where every student is known, every teacher is empowered, every parent is engaged, and every school is equipped to make informed decisions that improve learning outcomes.",
    },
    mission: {
      label: "Our Mission",
      body: "To empower 1 Million students by 2030 by helping schools, teachers, and parents understand every learner beyond marks, enabling each student to discover their strengths and reach their fullest potential.",
    },
    vision: {
      label: "Our Vision",
      body: "To create the world's most trusted student intelligence ecosystem, where every learner's educational journey is understood, supported, and celebrated from the first day of school through graduation.",
    },
  },

  coreValues: {
    heading: "Our Core Values",
    values: [
      {
        icon: "Target",
        title: "Student First",
        body: ["Every decision begins with one question: Will this improve the educational experience of students?"],
      },
      {
        icon: "ShieldCheck",
        title: "Trust Through Responsibility",
        body: [
          "Student information is handled with integrity, transparency, and respect.",
          "Trust is earned through responsible action.",
        ],
      },
      {
        icon: "GraduationCap",
        title: "Empower Educators",
        body: [
          "Technology should reduce administrative burden and allow teachers to focus on what matters most—inspiring and mentoring students.",
        ],
      },
      {
        icon: "Sprout",
        title: "Continuous Growth",
        body: [
          "Education is a lifelong journey.",
          "Our platform is built to evolve alongside students, schools, and the changing needs of education.",
        ],
      },
      {
        icon: "Lightbulb",
        title: "Innovation with Purpose",
        body: ["We embrace technology not because it is new, but because it creates meaningful value for schools and learners."],
      },
    ] as EduOsCoreValue[],
  },

  roadmap: {
    heading: "EduOS Roadmap",
    subheading: "Building the Future of Student-Centred Education",
    intro:
      "Our roadmap reflects a long-term commitment to creating meaningful value for schools while steadily expanding the capabilities available to students, parents, and educators.",
    phases: [
      {
        year: "2027",
        title: "Building Strong Foundations",
        focus: "Digital transformation for schools.",
        milestones: [
          "Expand EduOS across partner schools.",
          "Deliver a unified platform for academics, administration, finance, communication, and school operations.",
          "Build comprehensive student profiles by connecting academic, attendance, co-curricular, and engagement data.",
          "Launch intuitive mobile experiences for teachers, parents, and students.",
          "Establish robust privacy, governance, and security practices.",
          "Reach 50,000 students supported through EduOS.",
        ],
        statTarget: 50000,
        statLabel: "students supported",
      },
      {
        year: "2028",
        title: "Intelligent Insights for Better Decisions",
        focus: "Turning information into understanding.",
        milestones: [
          "Introduce AI-assisted educational insights for teachers and school leaders.",
          "Enable personalised student progress reports that highlight strengths, growth areas, and learning trends.",
          "Provide school-wide analytics to support academic planning and student wellbeing initiatives.",
          "Enhance collaboration between teachers and parents through timely, meaningful updates.",
          "Reach 250,000 students across a growing network of schools.",
        ],
        statTarget: 250000,
        statLabel: "students reached",
      },
      {
        year: "2029",
        title: "A Connected Learning Journey",
        focus: "Continuity across educational transitions.",
        milestones: [
          "Enable participating schools to support smoother student transitions with appropriate permissions and data governance.",
          "Expand student portfolios to include achievements, interests, projects, and extracurricular development.",
          "Introduce personalised learning pathways and goal-setting features.",
          "Launch tools that help schools identify students who may benefit from early support or enrichment opportunities.",
          "Reach 600,000 students empowered through EduOS.",
        ],
        statTarget: 600000,
        statLabel: "students empowered",
      },
      {
        year: "2030",
        title: "Empowering One Million Students",
        focus: "Creating a lasting educational impact.",
        milestones: [
          "Achieve our mission of supporting 1 Million students.",
          "Build one of India's most trusted student intelligence ecosystems.",
          "Provide schools with richer insights that inform teaching, student development, and institutional planning.",
          "Strengthen partnerships with educators, parents, and education leaders to foster holistic growth.",
          "Continue innovating responsibly, with ethics, privacy, and student wellbeing at the centre of every advancement.",
        ],
        statTarget: 1000000,
        statLabel: "students empowered",
      },
      {
        year: "Beyond 2030",
        title: "A Lifelong Educational Companion",
        paragraphs: [
          "Our ambition extends beyond a number.",
          "We envision EduOS becoming a lifelong educational companion—supporting learners through every stage of their academic journey while helping institutions make informed, compassionate, and impactful decisions.",
          "As education evolves, so will EduOS.",
        ],
      },
    ] as EduOsRoadmapPhase[],
  },

  lookingAhead: {
    heading: "Looking Ahead",
    paragraphs: [
      "EduOS is not being built for today's classrooms alone. We are building the foundation for the future of student development.",
      "Every enhancement we introduce is guided by one objective: Helping schools understand students better so students can understand themselves better.",
      "Together with educators, parents, and institutions, we are creating a future where every learner receives the support they deserve.",
    ],
  },

  closing: {
    commitmentLead: "Our commitment remains unchanged:",
    commitment: "To ensure that every student is seen, every potential is recognised, and every journey is empowered.",
    wordmark: "EduOS",
    tagline: "Empowering Every Student. Enabling Every School. Inspiring Every Future.",
    attribution: "A WnR Advisory Initiative",
  },
};

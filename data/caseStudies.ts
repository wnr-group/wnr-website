// Case studies content — extracted from the WnR case studies collateral.
// Client names are never used; each entry is identified by industry and
// solution category only. Grouping order matches the source material.

import type { CaseStudy, CaseStudyIndustryGroup } from "@/types/caseStudy";

export const caseStudies: CaseStudy[] = [
  // ── Education & Digital Learning ──────────────────────────────────────
  {
    id: "student-success-platform",
    slug: "ai-student-success-platform",
    industry: "Education & Digital Learning",
    industryLabel: "Education",
    accent: "forest",
    title: "AI-Powered Student Success Platform",
    summary:
      "An end-to-end education intelligence platform spanning the full student journey, from understanding learning patterns to predicting academic performance and guiding career decisions.",
    result:
      "3x faster identification of at-risk students and improved academic retention across connected campuses.",
    highlights: [
      "AI-powered student profiling",
      "Psychometric assessment engine",
      "Predictive academic analytics",
      "Personalized learning recommendations",
      "Institutional analytics and reporting",
    ],
    image: "/case-studies/ai-powered-student-platform.png",
    visual: "student-analytics",
    tags: ["AI", "Analytics", "Education"],
  },
  {
    id: "university-management-system",
    slug: "university-management-system",
    industry: "Education & Digital Learning",
    industryLabel: "Education",
    accent: "forest",
    title: "University Management System",
    summary:
      "A comprehensive digital ERP platform modernizing university administration: admissions, academics, finance, examinations, HR, and campus operations, in one unified ecosystem.",
    highlights: [
      "Student lifecycle management",
      "Digital admissions",
      "Examination management",
      "Finance & payroll",
      "Role-based access control",
    ],
    image: "/case-studies/university-platform.png",
    visual: "university-erp",
    tags: ["ERP", "Higher Education"],
  },
  {
    id: "student-career-guidance",
    slug: "student-career-guidance-platform",
    industry: "Education & Digital Learning",
    industryLabel: "Education",
    accent: "forest",
    title: "Student Career Guidance Platform",
    summary:
      "A digital platform helping students navigate academic and career decisions through structured guidance, curated resources, mentorship, and personalized recommendations.",
    highlights: [
      "Career exploration",
      "College discovery",
      "Student progress tracking",
      "Mentor engagement",
      "Digital counselling ecosystem",
    ],
    image: "/case-studies/student-career-guidance-platform.png",
    visual: "career-guidance",
    tags: ["EdTech", "Mentorship"],
  },

  // ── Commerce & Retail ──────────────────────────────────────────────────
  {
    id: "premium-fashion-commerce",
    slug: "premium-fashion-commerce",
    industry: "Commerce & Retail",
    industryLabel: "Retail",
    accent: "amber",
    title: "Premium Fashion Commerce Platform",
    summary:
      "A modern online shopping platform for a premium fashion brand, delivering an intuitive buying experience with powerful inventory management and secure transactions.",
    highlights: [
      "Product catalogue management",
      "Smart inventory control",
      "Secure payment integration",
      "Wishlist functionality",
      "Order lifecycle management",
    ],
    image: "/case-studies/e-commerce-platform.png",
    visual: "fashion-commerce",
    tags: ["E-Commerce", "Retail"],
  },
  {
    id: "pharmaceutical-commerce",
    slug: "pharmaceutical-commerce",
    industry: "Commerce & Retail",
    industryLabel: "Healthcare",
    accent: "amber",
    title: "Pharmaceutical Commerce Platform",
    summary:
      "A secure e-commerce ecosystem for pharmaceutical businesses, enabling digital ordering, inventory management, customer engagement, and operational visibility.",
    highlights: [
      "Product information management",
      "Inventory synchronization",
      "Order management",
      "Analytics dashboard",
      "Secure authentication",
    ],
    image: "/case-studies/pharma-platform.png",
    visual: "pharma-commerce",
    tags: ["E-Commerce", "Healthcare"],
  },
  {
    id: "hyperlocal-food-marketplace",
    slug: "hyperlocal-marketplace",
    industry: "Commerce & Retail",
    industryLabel: "Food Technology",
    accent: "amber",
    title: "Hyperlocal Food Marketplace",
    summary:
      "A community-driven food ordering platform connecting home chefs with customers seeking healthy, affordable home-cooked meals, built on a trusted local marketplace.",
    result:
      "40% increase in repeat customer orders and streamlined onboarding for 200+ local home chefs.",
    highlights: [
      "Customer mobile application",
      "Vendor onboarding",
      "Order & delivery workflow",
      "Subscription meal plans",
      "Ratings & reviews",
    ],
    image: "/case-studies/hyperlocal-food-platform.png",
    visual: "food-marketplace",
    tags: ["Marketplace", "Food Technology"],
  },

  // ── Enterprise Digital Transformation ──────────────────────────────────
  {
    id: "recruitment-management-platform",
    slug: "recruitment-platform",
    industry: "Enterprise Digital Transformation",
    industryLabel: "Recruitment",
    accent: "teal",
    title: "Recruitment Management Platform",
    summary:
      "A complete recruitment ecosystem enabling staffing agencies to digitize hiring operations, improve recruiter productivity, and deliver a seamless candidate experience.",
    result:
      "~60% reduction in manual processes, faster recruiter coordination, data-driven placement insights.",
    highlights: [
      "Job publishing platform",
      "Applicant tracking system",
      "Recruiter dashboard",
      "Candidate pipeline",
      "Hiring workflow automation",
    ],
    image: "/case-studies/recruitment-management-platform.png",
    visual: "recruitment-ats",
    tags: ["HR Tech", "Recruitment"],
  },
  {
    id: "digital-production-studio",
    slug: "digital-production-studio",
    industry: "Enterprise Digital Transformation",
    industryLabel: "Enterprise",
    accent: "teal",
    title: "Digital Production Studio Website",
    summary:
      "A premium digital presence for a creative production studio, built around storytelling and visual excellence, doubling as a portfolio and lead-generation platform.",
    highlights: [
      "Dynamic project portfolio",
      "Multimedia showcase",
      "SEO optimization",
      "Lead generation",
      "Responsive user experience",
    ],
    image: "/case-studies/digital-photo-studio.png",
    visual: "production-portfolio",
    tags: ["Website", "Media & Creative"],
  },
  {
    id: "travel-agency-platform",
    slug: "travel-platform",
    industry: "Enterprise Digital Transformation",
    industryLabel: "Travel",
    accent: "teal",
    title: "Travel Agency Digital Platform",
    summary:
      "A modern travel experience platform enabling agencies to showcase curated packages, manage inquiries, streamline bookings, and engage customers through interactive itineraries.",
    highlights: [
      "Tour package management",
      "Destination showcase",
      "Booking requests",
      "CRM integration",
      "Interactive itineraries",
    ],
    image: "/case-studies/travel-agency-digital-platform.png",
    visual: "travel-booking",
    tags: ["Travel", "Bookings"],
  },
];

/** Derived, in source order — one entry per distinct `industry` in `caseStudies`. */
export const caseStudyIndustryGroups: CaseStudyIndustryGroup[] = caseStudies.reduce<
  CaseStudyIndustryGroup[]
>((groups, study) => {
  const existing = groups.find((g) => g.name === study.industry);
  if (existing) {
    existing.studies.push(study);
  } else {
    groups.push({
      id: study.industry.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: study.industry,
      accent: study.accent,
      studies: [study],
    });
  }
  return groups;
}, []);

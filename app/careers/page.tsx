import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { CareersHero } from "@/components/sections/careers/CareersHero";
import { WhyWorkWithUs } from "@/components/sections/careers/WhyWorkWithUs";
import { LifeAtWnR } from "@/components/sections/careers/LifeAtWnR";
import { HiringProcess } from "@/components/sections/careers/HiringProcess";
import { JobList } from "@/components/sections/careers/JobList";
import { CareersCta } from "@/components/sections/careers/CareersCta";
import { openings, type Job } from "@/content/careers";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join a team obsessed with how businesses actually work. We're 23+ engineers, strategists, and operators building vertical operating systems.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers",
    description: "Join a team obsessed with how businesses actually work.",
    url: "/careers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers",
    description: "Join a team obsessed with how businesses actually work.",
  },
};

const EMPLOYMENT_TYPE_SCHEMA: Record<Job["employmentType"], string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACTOR",
  Internship: "INTERN",
};

export default function CareersPage() {
  const jobPostingSchema = openings.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    employmentType: EMPLOYMENT_TYPE_SCHEMA[job.employmentType],
    hiringOrganization: {
      "@type": "Organization",
      name: "WnRTech",
      sameAs: "https://wnrtech.com",
    },
    jobLocation: {
      "@type": "Place",
      address: job.location,
    },
  }));

  return (
    <>
      {jobPostingSchema.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
        />
      )}

      <CareersHero />
      <WhyWorkWithUs />
      <LifeAtWnR />
      <HiringProcess />

      <Section id="openings" tone="canvas">
        <div className="max-w-2xl">
          <p className="eyebrow">Current Openings</p>
          <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
            {openings.length > 0
              ? "Open roles at WnRTech."
              : "No openings right now — but talent always has a seat."}
          </h2>
        </div>
        <div className="mt-10">
          <JobList jobs={openings} />
        </div>
      </Section>

      <CareersCta />
    </>
  );
}

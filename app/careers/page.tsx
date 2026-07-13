import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { WhyWorkWithUs } from "@/components/sections/careers/WhyWorkWithUs";
import { Benefits } from "@/components/sections/careers/Benefits";
import { Culture } from "@/components/sections/careers/Culture";
import { HiringProcess } from "@/components/sections/careers/HiringProcess";
import { JobList } from "@/components/sections/careers/JobList";
import { careersHero, careersCta, openings, type Job } from "@/content/careers";
import { media } from "@/content/media";

export const metadata: Metadata = {
  title: "Careers — Build What's Next",
  description:
    "Join a team obsessed with how businesses actually work. We're 25+ engineers, strategists, and operators building vertical operating systems.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers — Build What's Next",
    description: "Join a team obsessed with how businesses actually work.",
    url: "/careers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers — Build What's Next",
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
  const img = media.careers;

  const jobPostingSchema = openings.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    employmentType: EMPLOYMENT_TYPE_SCHEMA[job.employmentType],
    hiringOrganization: {
      "@type": "Organization",
      name: "WnR Group",
      sameAs: "https://wnrgroup.com",
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

      <PageHero
        eyebrow={careersHero.eyebrow}
        title={careersHero.heading}
        lead={careersHero.lead}
        aside={
          img && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line shadow-card">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          )
        }
      >
        <Cta href="#openings" variant="primary">
          {careersHero.ctaLabel}
          <ArrowRight size={16} />
        </Cta>
      </PageHero>

      <WhyWorkWithUs />
      <Benefits />
      <Culture />
      <HiringProcess />

      <Section id="openings" tone="canvas">
        <div className="max-w-2xl">
          <p className="eyebrow">Current Openings</p>
          <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
            {openings.length > 0
              ? "Open roles at WnR Group."
              : "No openings right now — but talent always has a seat."}
          </h2>
        </div>
        <div className="mt-10">
          <JobList jobs={openings} />
        </div>
      </Section>

      <Section tone="wash" className="text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
            {careersCta.heading}
          </h2>
          <p className="mt-4 text-body">{careersCta.body}</p>
          <div className="mt-9 flex justify-center">
            <Cta href="/contact?inquiry=careers" variant="primary" className="px-8 py-4 text-base">
              {careersCta.ctaLabel}
              <ArrowRight size={18} />
            </Cta>
          </div>
        </div>
      </Section>
    </>
  );
}

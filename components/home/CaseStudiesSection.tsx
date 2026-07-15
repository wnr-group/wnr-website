"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/motion";

interface CaseStudyCardData {
  id: string;
  category: string;
  headline: string;
  summary: string;
  result?: string;
  image: string;
  alt: string;
  href: string;
  categoryToneClass: string;
}

// Featured large card (Left column, ~58% width, strongest quantifiable metric)
const featuredCaseStudy: CaseStudyCardData = {
  id: "recruitment-management-platform",
  category: "EDUCATION / HR TECH",
  headline: "Recruitment Management Platform",
  summary:
    "Unified student, recruiter, and admin dashboards with an automated recruitment workflow, approvals, and analytics.",
  result:
    "~60% reduction in manual processes, faster recruiter coordination, data-driven placement insights.",
  image: "/case-studies/recruitment-management-platform.png",
  alt: "Recruitment Management Platform dashboard showing candidate pipeline and automated hiring operations",
  href: "/insights#case-studies",
  categoryToneClass: "text-teal-bright",
};

// Stacked right cards (~42% width, stacked vertically)
const stackedCaseStudies: CaseStudyCardData[] = [
  {
    id: "student-success-platform",
    category: "EDUCATION & DIGITAL LEARNING",
    headline: "AI-Powered Student Success Platform",
    summary:
      "An end-to-end education intelligence platform predicting academic performance and student analytics.",
    image: "/case-studies/ai-powered-student-platform.png",
    alt: "AI-Powered Student Success Platform interface predicting academic performance and student analytics",
    href: "/insights#case-studies",
    categoryToneClass: "text-[#34d399]", // Luminous variant of --color-forest for AA contrast on dark photo overlay
  },
  {
    id: "hyperlocal-food-marketplace",
    category: "TEXTILE / RETAIL & COMMERCE",
    headline: "Hyperlocal Food Marketplace",
    summary:
      "A community-driven food ordering mobile application connecting home chefs with local customers.",
    image: "/case-studies/hyperlocal-food-platform.png",
    alt: "Hyperlocal Food Marketplace mobile application interface connecting home chefs with local customers",
    href: "/insights#case-studies",
    categoryToneClass: "text-[color:var(--color-amber)]",
  },
];

type Tone = "canvas" | "mist" | "paper" | "wash" | "forest" | "forest-deep";

export interface CaseStudiesSectionProps {
  id?: string;
  tone?: Tone;
  className?: string;
}

export function CaseStudiesSection({
  id = "case-studies",
  tone = "canvas",
  className = "pt-2 md:pt-4 lg:pt-6",
}: CaseStudiesSectionProps = {}) {
  return (
    <Section
      id={id}
      tone={tone}
      reveal={false}
      className={className}
    >
      {/* Section Header: Left Eyebrow/Headline, Right "All insights →" link */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-forest">
            SELECTED WORK
          </span>
          <h2 className="mt-4 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
            <span className="block">Custom platforms.</span>
            <span className="block">Measurable outcomes.</span>
          </h2>
        </div>

        <div className="self-start md:self-auto">
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-forest transition-colors hover:text-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            <span>All insights</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Asymmetric Featured Grid: 1 large left card + 2 stacked right cards */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:mt-14">
        {/* Left Column: Large Featured Card (roughly 58% width split on desktop) */}
        <Reveal className="lg:col-span-7 h-full" y={18} delay={0} amount={0.1}>
          <Link
            href={featuredCaseStudy.href}
            className="group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-3xl border border-line bg-ink min-h-[380px] sm:min-h-[480px] lg:min-h-[580px] p-6 sm:p-8 md:p-10 transition-all duration-300 hover:border-line-strong hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            {/* Full-bleed background photo */}
            <Image
              src={featuredCaseStudy.image}
              alt={featuredCaseStudy.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              loading="lazy"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
            />

            {/* Dual-layer dark scrim & deep bottom-to-top gradient for verified contrast */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-ink/35 transition-opacity duration-300 group-hover:bg-ink/45"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-ink/95 via-ink/85 to-transparent transition-opacity duration-300 group-hover:opacity-100"
            />

            {/* Top-right subtle circular/pill arrow icon (↗) */}
            <div
              aria-hidden="true"
              className="absolute top-6 right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-ink/50 text-white backdrop-blur-md transition-all duration-300 group-hover:border-teal-bright group-hover:bg-teal-bright group-hover:text-forest-deep"
            >
              <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
            </div>

            {/* Card Content Area */}
            <div className="relative z-10 max-w-xl">
              <span
                className={`block text-[0.75rem] font-semibold uppercase tracking-[0.14em] ${featuredCaseStudy.categoryToneClass}`}
              >
                {featuredCaseStudy.category}
              </span>

              <h3 className="mt-3 font-display text-xl font-bold leading-snug text-white sm:text-2xl lg:text-[1.75rem]">
                {featuredCaseStudy.headline}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
                {featuredCaseStudy.summary}
              </p>

              {/* Large card only — additional "Result" line */}
              {featuredCaseStudy.result && (
                <div className="mt-5 border-t border-white/15 pt-5">
                  <p className="text-sm leading-relaxed text-white/90 sm:text-[0.95rem]">
                    <span className="font-semibold text-teal-bright">
                      Result —{" "}
                    </span>
                    <span>{featuredCaseStudy.result}</span>
                  </p>
                </div>
              )}
            </div>
          </Link>
        </Reveal>

        {/* Right Column: 2 Stacked Cards vertically (roughly 42% width split on desktop) */}
        <Reveal className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 h-full" y={18} delay={0.15} amount={0.1}>
          {stackedCaseStudies.map((study) => (
            <Link
              key={study.id}
              href={study.href}
              className="group relative flex flex-1 w-full flex-col justify-end overflow-hidden rounded-3xl border border-line bg-ink min-h-[230px] sm:min-h-[260px] lg:min-h-[280px] p-6 sm:p-7 transition-all duration-300 hover:border-line-strong hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              {/* Full-bleed background photo */}
              <Image
                src={study.image}
                alt={study.alt}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                loading="lazy"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
              />

              {/* Dual-layer dark scrim & bottom-to-top gradient */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-ink/35 transition-opacity duration-300 group-hover:bg-ink/45"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-ink/95 via-ink/85 to-transparent transition-opacity duration-300 group-hover:opacity-100"
              />

              {/* Top-right subtle circular arrow icon (↗) */}
              <div
                aria-hidden="true"
                className="absolute top-5 right-5 sm:top-6 sm:right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-ink/50 text-white backdrop-blur-md transition-all duration-300 group-hover:border-teal-bright group-hover:bg-teal-bright group-hover:text-forest-deep"
              >
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </div>

              {/* Card Content Area */}
              <div className="relative z-10">
                <span
                  className={`block text-[0.75rem] font-semibold uppercase tracking-[0.14em] ${study.categoryToneClass}`}
                >
                  {study.category}
                </span>

                <h3 className="mt-2 font-display text-lg font-bold leading-snug text-white sm:text-xl">
                  {study.headline}
                </h3>

                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-white/80 line-clamp-2">
                  {study.summary}
                </p>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

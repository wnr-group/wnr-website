"use client";

import React from "react";
import { Award, CheckCircle2, Star, Trophy } from "lucide-react";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/motion";
import { aboutAwards } from "@/content/about";
import { cn } from "@/lib/utils";

export function AboutAwards() {
  const { featuredAward, recognitions } = aboutAwards;

  return (
    <Section id="awards" tone="canvas" className="py-20 md:py-28 border-b border-line overflow-hidden">
      <Container>
        <Reveal className="mb-12 md:mb-16">
          <Eyebrow>{aboutAwards.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink max-w-2xl">
            {aboutAwards.heading}
          </h2>
        </Reveal>

        {/* Split Layout: Concentrix-inspired featured award card left/top + Future-proof recognition grid right/bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Featured Award Artwork & Quote Card (Concentrix/Glassdoor reference) */}
          <Reveal className="lg:col-span-7 h-full" delay={0.1}>
            <div className={cn("group relative h-full rounded-3xl border border-line bg-paper p-8 sm:p-12 shadow-card transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-card-hover hover:-translate-y-1")}>
              {/* Oversized background graphic / Gold accent badge details */}
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#c9a24b]/15 blur-3xl group-hover:bg-[#c9a24b]/25 transition-all duration-500"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute right-4 top-4 opacity-10 text-[#c9a24b] font-display text-8xl font-black select-none tracking-tighter"
                aria-hidden="true"
              >
                #1
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/40 bg-[#c9a24b]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#a6822f]">
                    <Trophy size={14} className="text-[#c9a24b]" />
                    <span>Featured Recognition</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#c9a24b]" aria-label="5 out of 5 rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#c9a24b" />
                    ))}
                  </div>
                </div>

                {/* Large award artwork / badge typography */}
                <div className="my-6 rounded-2xl bg-[linear-gradient(135deg,#0e1a13_0%,#124734_100%)] p-6 sm:p-8 text-white shadow-inner relative overflow-hidden group-hover:shadow-md transition-shadow">
                  <div
                    className="grid-blueprint pointer-events-none absolute inset-0 opacity-25 group-hover:scale-105 transition-transform duration-700"
                    aria-hidden="true"
                  />
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#c9a24b] font-semibold">
                        2026 Workplace Honors
                      </div>
                      <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                        {featuredAward.title}
                      </div>
                    </div>
                    <div className="shrink-0 rounded-xl bg-[#c9a24b] text-ink font-display font-black text-xs uppercase px-3 py-2 shadow">
                      Top Rated
                    </div>
                  </div>
                </div>

                <blockquote className="mt-6 font-display text-xl sm:text-2xl font-bold leading-snug text-ink">
                  {featuredAward.quoteBadge}
                </blockquote>
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-body font-normal">
                  {featuredAward.body}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-muted">
                <span>Verified Employee & Client Satisfaction</span>
                <span className="inline-flex items-center gap-1.5 text-forest font-semibold">
                  <CheckCircle2 size={15} />
                  Excellence Certified
                </span>
              </div>
            </div>
          </Reveal>

          {/* Future-proof grid for Certifications, Partnerships & Recognitions */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {recognitions.map((rec, index) => (
              <Reveal key={rec.title} y={16} delay={0.2 + index * 0.1}>
                <div className={cn("group rounded-3xl border border-line bg-paper p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 hover:border-forest/40")}>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-wider text-forest">
                      <Award size={13} className="text-forest-bright" />
                      {rec.badge}
                    </span>
                    <span className="font-display text-xs font-bold text-muted bg-canvas px-2.5 py-1 rounded-md border border-line">
                      {rec.year}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink group-hover:text-forest transition-colors">
                    {rec.title}
                  </h3>
                  <p className="mt-2 text-sm text-body leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

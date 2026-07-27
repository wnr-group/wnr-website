"use client";

import React from "react";
import { ArrowRight, BadgeCheck, Crown, Gem, Globe, ShieldCheck, Target, Trophy, Users } from "lucide-react";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/motion";
import { aboutAwards } from "@/content/about";
import { cn } from "@/lib/utils";

const trustIcons = { Crown, Target, ShieldCheck, Globe } as const;
const recognitionIcons = { Users, Gem } as const;

const trustTones = {
  forestDeep: "bg-forest-deep",
  gold: "bg-[#c9a24b]",
  forestBright: "bg-forest-bright",
  navy: "bg-[#1e3a66]",
} as const;

const recognitionThemes = {
  green: {
    iconBox: "bg-forest-wash text-forest",
    pill: "bg-forest-wash text-forest",
    tag: "bg-canvas border border-line text-muted",
    arrow: "text-forest",
    accent: "from-forest/60",
  },
  blue: {
    iconBox: "bg-[#dde8f9] text-[#3a62ab]",
    pill: "bg-[#e6eefb] text-[#3a62ab]",
    tag: "bg-[#eef3fc] text-[#3a62ab]",
    arrow: "text-[#3a62ab]",
    accent: "from-[#3a62ab]/60",
  },
} as const;

/** Laurel-wreath medal graphic — matches the reference award artwork (no emoji/raster asset). */
function AwardMedal({ className }: { className?: string }) {
  const leafAngles = [-58, -80, -102, -124, -146];
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="medalDisc" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fbe7ae" />
          <stop offset="55%" stopColor="#e3b34e" />
          <stop offset="100%" stopColor="#b8862e" />
        </radialGradient>
        <linearGradient id="medalLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3d187" />
          <stop offset="100%" stopColor="#b8862e" />
        </linearGradient>
      </defs>

      {/* Laurel wreath — left side */}
      <g fill="url(#medalLeaf)" stroke="#9c6f1f" strokeWidth="0.5">
        {leafAngles.map((deg) => (
          <ellipse key={`l-${deg}`} cx="0" cy="-40" rx="6" ry="12" transform={`translate(60,68) rotate(${deg})`} />
        ))}
      </g>
      {/* Laurel wreath — right side (exact mirror of left across the medal's vertical axis) */}
      <g fill="url(#medalLeaf)" stroke="#9c6f1f" strokeWidth="0.5" transform="translate(120,0) scale(-1,1)">
        {leafAngles.map((deg) => (
          <ellipse key={`r-${deg}`} cx="0" cy="-40" rx="6" ry="12" transform={`translate(60,68) rotate(${deg})`} />
        ))}
      </g>

      {/* Medal disc */}
      <circle cx="60" cy="50" r="34" fill="url(#medalDisc)" stroke="#9c6f1f" strokeWidth="3" />
      <circle cx="60" cy="50" r="27" fill="none" stroke="#f6dc9e" strokeOpacity="0.6" strokeWidth="1.5" />

      {/* Star */}
      <path
        d="M60 32 L65.5 46 L80 46 L68.5 55 L73 69 L60 60.5 L47 69 L51.5 55 L40 46 L54.5 46 Z"
        fill="#8a6220"
      />
      <path
        d="M60 34 L65 46.5 L60 58 L55 46.5 Z"
        fill="#f0d68a"
        opacity="0.55"
      />
    </svg>
  );
}

export function AboutAwards() {
  const { featuredAward, recognitions, trustPoints } = aboutAwards;

  return (
    <Section id="awards" tone="canvas" revealY={40} revealDuration={0.8} className="py-20 md:py-28 border-b border-line overflow-hidden">
      <Container>
        <Reveal className="mb-12 md:mb-16">
          <Eyebrow>{aboutAwards.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink max-w-2xl">
            {aboutAwards.heading}
          </h2>
        </Reveal>

        {/* Split Layout: Concentrix-inspired featured award card left/top + Future-proof recognition grid right/bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Featured Award Artwork & Quote Card */}
          <Reveal className="lg:col-span-7 h-full" delay={0.1}>
            <div className={cn("group relative h-full rounded-3xl border border-line bg-paper p-8 sm:p-12 shadow-card transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-card-hover hover:-translate-y-1.5 hover:border-[#c9a24b]/50")}>
              <div>
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/40 bg-[#c9a24b]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#a6822f]">
                  <Trophy size={14} className="text-[#c9a24b]" />
                  <span>Featured Recognition</span>
                </div>

                {/* Large award artwork / badge typography */}
                <div className="my-6 rounded-2xl bg-[linear-gradient(135deg,#0e1a13_0%,#124734_100%)] p-6 sm:p-8 text-white shadow-inner relative overflow-hidden group-hover:shadow-md transition-shadow">
                  <div
                    className="grid-blueprint pointer-events-none absolute inset-0 opacity-25 group-hover:scale-105 transition-transform duration-700"
                    aria-hidden="true"
                  />
                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#c9a24b] font-semibold">
                        2026 Workplace Honors
                      </div>
                      <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                        {featuredAward.title}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      <AwardMedal className="h-16 w-16 sm:h-20 sm:w-20" />
                      <div className="rounded-xl bg-[#c9a24b] text-ink font-display font-black text-xs uppercase px-3 py-2 shadow">
                        Top Rated
                      </div>
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
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-forest" />
                  Verified Employee & Client Satisfaction
                </span>
                <span className="inline-flex items-center gap-1.5 text-forest font-semibold">
                  <BadgeCheck size={15} className="text-[#c9a24b]" />
                  Excellence Certified
                </span>
              </div>
            </div>
          </Reveal>

          {/* Future-proof grid for Certifications, Partnerships & Recognitions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {recognitions.map((rec, index) => {
              const Icon = recognitionIcons[rec.icon];
              const theme = recognitionThemes[rec.theme];
              return (
                <Reveal key={rec.title} className="flex-1" y={16} delay={0.2 + index * 0.1}>
                  <div className={cn("group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-paper p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 hover:border-forest/40")}>
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", theme.iconBox)}>
                            <Icon size={18} />
                          </span>
                          <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider", theme.pill)}>
                            {rec.badge}
                          </span>
                        </div>
                        <span className={cn("font-display text-xs font-bold px-2.5 py-1 rounded-full shrink-0", theme.tag)}>
                          {rec.year}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-ink group-hover:text-forest transition-colors">
                        <span className="relative inline-block after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-forest after:transition-all after:duration-300 group-hover:after:w-full">
                          {rec.title}
                        </span>
                      </h3>
                      <p className="mt-2 text-sm text-body leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <ArrowRight
                        size={16}
                        className={cn("transition-transform duration-300 group-hover:translate-x-1", theme.arrow)}
                        aria-hidden="true"
                      />
                    </div>
                    <div
                      className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r to-transparent", theme.accent)}
                      aria-hidden="true"
                    />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Trust-badge strip */}
        <Reveal className="mt-8" delay={0.3}>
          <div className="rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:divide-x lg:divide-line">
              {trustPoints.map((point) => {
                const Icon = trustIcons[point.icon];
                return (
                  <div key={point.title} className="flex items-start gap-3 lg:pl-6 first:lg:pl-0">
                    <div className={cn("rounded-xl p-2.5 text-white shrink-0", trustTones[point.tone])}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="font-display text-sm font-bold text-ink">{point.title}</div>
                      <div className="text-xs text-muted mt-0.5">{point.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

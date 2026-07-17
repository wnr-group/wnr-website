"use client";

import React from "react";
import { m } from "motion/react";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { aboutEduOsAnchor } from "@/content/about";
import { cn } from "@/lib/utils";

export function AboutEduOsAnchor() {
  const { progression, paragraphs, closingBold } = aboutEduOsAnchor;

  return (
    <Section
      id="eduos-2040-anchor"
      bleed
      className="relative py-32 md:py-48 bg-[#0b2e20] text-white overflow-hidden border-b border-line/10 shadow-2xl"
    >
      {/* Cinematic dark/radial backgrounds & Blueprint pattern */}
      <div
        className="grid-blueprint pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_85%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(31,122,84,0.35)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#c9a24b]/15 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <Reveal y={16} delay={0.1}>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#c9a24b] mb-6 backdrop-blur-md">
              <Sparkles size={14} />
              <span>{aboutEduOsAnchor.eyebrow}</span>
            </div>
            <div className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-white/60 mb-6">
              {aboutEduOsAnchor.title}
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal y={24} delay={0.2}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] text-white tracking-tight max-w-3xl">
              {aboutEduOsAnchor.heading}
            </h2>
          </Reveal>

          {/* Emotional Story Paragraphs */}
          <Reveal y={24} delay={0.3} className="mt-12 space-y-7 text-left sm:text-center max-w-3xl">
            {paragraphs.map((p, idx) => {
              const isBoldCallout = idx === 3; // "Not an algorithm that decides a child's future..."
              return (
                <p
                  key={idx}
                  className={cn(
                    "text-lg sm:text-xl md:text-[1.35rem] leading-[1.65] font-normal tracking-tight",
                    isBoldCallout
                      ? "font-display font-bold text-white text-xl sm:text-2xl md:text-[1.55rem] bg-white/[0.06] p-6 sm:p-8 rounded-2xl border border-white/15 shadow-inner"
                      : "text-white/85"
                  )}
                >
                  {p}
                </p>
              );
            })}
          </Reveal>

          {/* Closing Bold Statement */}
          <Reveal y={20} delay={0.4}>
            <div className="mt-14 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#c9a24b]">
              {closingBold}
            </div>
          </Reveal>

          {/* Visual Progression Banner: Data → Intelligence → Action → Success */}
          <Reveal y={24} delay={0.5} className="mt-16 w-full">
            <div className="rounded-3xl border border-white/20 bg-black/30 p-6 sm:p-10 backdrop-blur-md shadow-xl">
              <div className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-6">
                The Compounding Intelligence Loop
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-between relative">
                {progression.map((step, idx) => {
                  const isLast = idx === progression.length - 1;
                  return (
                    <div
                      key={step}
                      className={cn(
                        "group flex flex-col items-center justify-center rounded-2xl p-5 sm:p-6 transition-all duration-300 relative border",
                        isLast
                          ? "bg-[linear-gradient(135deg,#c9a24b_0%,#a6822f_100%)] text-ink border-[#c9a24b] shadow-lg scale-105"
                          : "bg-white/5 text-white border-white/10 hover:border-white/30 hover:bg-white/10"
                      )}
                    >
                      <div className="font-display text-sm sm:text-base font-extrabold tracking-tight">
                        {step}
                      </div>
                      <div
                        className={cn(
                          "text-[10px] uppercase font-bold tracking-wider mt-1",
                          isLast ? "text-ink/80" : "text-white/50"
                        )}
                      >
                        Step 0{idx + 1}
                      </div>

                      {/* Arrow to next node on sm screens */}
                      {!isLast && (
                        <div className="hidden sm:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-forest border border-white/20 items-center justify-center text-white shadow">
                          <ArrowRight size={13} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

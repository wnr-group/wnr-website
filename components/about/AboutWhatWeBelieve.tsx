"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { Section, Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/motion";
import { aboutWhatWeBelieve } from "@/content/about";

export function AboutWhatWeBelieve() {
  return (
    <Section
      id="what-we-believe"
      bleed
      revealY={40}
      revealDuration={0.8}
      className="relative py-32 md:py-48 bg-[#0e1a13] text-white overflow-hidden border-b border-line/10"
    >
      {/* Cinematic dark gradients & Blueprint motif */}
      <div
        className="grid-blueprint pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(circle_at_center,white,transparent_80%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(18,71,52,0.4)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#c9a24b]/10 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <Reveal y={16} delay={0.1}>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#c9a24b]/30 bg-[#c9a24b]/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#c9a24b] mb-10 backdrop-blur-sm">
              <Sparkles size={14} />
              <span>{aboutWhatWeBelieve.eyebrow}</span>
            </div>
          </Reveal>

          {/* Slow cinematic reveal on large statement */}
          <Reveal y={24} delay={0.25} amount={0.3}>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold leading-[1.08] text-white tracking-tight">
              {aboutWhatWeBelieve.heading}
            </h2>
          </Reveal>

          <Reveal y={24} delay={0.4} amount={0.3}>
            <p className="mt-10 max-w-3xl text-xl sm:text-2xl md:text-[1.65rem] leading-[1.6] text-white/85 font-normal tracking-tight">
              {aboutWhatWeBelieve.body}
            </p>
          </Reveal>

          {/* Gold divider flourish at bottom */}
          <Reveal y={16} delay={0.55}>
            <div className="mt-16 flex items-center justify-center gap-3 opacity-60">
              <div className="h-px w-16 bg-[linear-gradient(to_right,transparent,#c9a24b)]" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#c9a24b]" />
              <div className="h-px w-16 bg-[linear-gradient(to_left,transparent,#c9a24b)]" />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

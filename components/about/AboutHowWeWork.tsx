"use client";

import React from "react";
import { m } from "motion/react";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { aboutHowWeWork } from "@/content/about";
import { cn } from "@/lib/utils";

export function AboutHowWeWork() {
  return (
    <Section id="how-we-work" tone="canvas" revealY={40} revealDuration={0.8} className="py-24 md:py-36 border-b border-line overflow-hidden">
      <Container>
        <Reveal className="mb-16 md:mb-24 text-center max-w-2xl mx-auto">
          <div className="flex justify-center">
            <Eyebrow>{aboutHowWeWork.eyebrow}</Eyebrow>
          </div>
          <h2 className="mt-4 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
            {aboutHowWeWork.heading}
          </h2>
        </Reveal>

        {/* DESKTOP TIMELINE: Horizontal connected 4-step flow (lg+) - marked aria-hidden so screen readers use the semantic list below */}
        <div className="hidden lg:block relative" aria-hidden="true">
          {/* Horizontal animated connecting line running behind nodes */}
          <div className="absolute top-10 left-[12%] right-[12%] h-0.5 bg-line z-0">
            <m.div
              className="h-full bg-[linear-gradient(to_right,var(--color-forest),var(--color-teal),#c9a24b)]"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <Stagger className="grid grid-cols-4 gap-8 relative z-10" stagger={0.15}>
            {aboutHowWeWork.principles.map((principle) => (
              <StaggerItem key={principle.number} className="flex flex-col items-center text-center">
                {/* Step Circle Node */}
                <div className="h-20 w-20 rounded-full border-4 border-paper bg-forest text-white font-display text-2xl font-black flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 mb-8">
                  {principle.number}
                </div>

                <div className={cn("rounded-3xl border border-line bg-paper p-7 shadow-sm transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 hover:border-forest/40 w-full flex-1 flex flex-col justify-start text-left")}>
                  <h3 className="font-display text-xl font-bold text-ink leading-snug">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] text-body leading-relaxed">
                    {principle.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* MOBILE & TABLET & SCREEN READER TIMELINE: Semantic ol list */}
        <ol className="lg:hidden relative pl-8 sm:pl-12 space-y-10">
          {/* Vertical progress line */}
          <div className="absolute top-4 bottom-4 left-3 sm:left-4 w-0.5 bg-line" aria-hidden="true">
            <m.div
              className="w-full bg-[linear-gradient(to_bottom,var(--color-forest),var(--color-teal),#c9a24b)]"
              initial={{ height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {aboutHowWeWork.principles.map((principle) => (
            <li key={principle.number} className="relative">
              {/* Node point on the vertical line */}
              <div className="absolute -left-8 sm:-left-12 top-0 h-8 w-8 rounded-full border-2 border-paper bg-forest text-white font-display text-xs font-bold flex items-center justify-center shadow" aria-hidden="true">
                {principle.number}
              </div>

              <div className={cn("rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 hover:border-forest/40")}>
                <h3 className="font-display text-xl font-bold text-ink leading-snug">
                  {principle.title}
                </h3>
                <p className="mt-3 text-[0.95rem] text-body leading-relaxed">
                  {principle.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

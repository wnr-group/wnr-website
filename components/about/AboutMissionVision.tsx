"use client";

import React from "react";
import { Compass, Eye } from "lucide-react";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/motion";
import { aboutMission, aboutVision } from "@/content/about";
import { cn } from "@/lib/utils";

export function AboutMissionVision() {
  return (
    <Section id="mission-vision" tone="mist" className="py-24 md:py-36 border-b border-line overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Mission Block */}
          <Reveal className="h-full" delay={0.1}>
            <div className={cn("group relative h-full flex flex-col justify-between rounded-3xl border border-line bg-paper p-8 sm:p-12 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1")}>
              <div
                className="grid-blueprint pointer-events-none absolute inset-0 opacity-20"
                aria-hidden="true"
              />
              <div>
                <div className="flex items-center justify-between gap-4 pb-8 border-b border-line">
                  <Eyebrow>{aboutMission.eyebrow}</Eyebrow>
                  <div className="rounded-xl bg-forest-wash p-3 text-forest group-hover:bg-forest group-hover:text-white transition-colors duration-300">
                    <Compass size={22} />
                  </div>
                </div>

                <h2 className="mt-8 font-display text-2xl sm:text-3xl md:text-[2.25rem] font-bold leading-[1.15] text-ink tracking-tight">
                  {aboutMission.heading}
                </h2>
              </div>

              <div className="mt-12 pt-6 border-t border-line/60 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-muted">
                <span>Core Purpose</span>
                <span className="text-forest">Operational Empathy</span>
              </div>
            </div>
          </Reveal>

          {/* Vision Block */}
          <Reveal className="h-full" delay={0.2}>
            <div className={cn("group relative h-full flex flex-col justify-between rounded-3xl border border-forest/30 bg-[linear-gradient(135deg,var(--color-forest)_0%,var(--color-forest-deep)_100%)] p-8 sm:p-12 text-white shadow-card transition-all duration-300 overflow-hidden hover:shadow-card-hover hover:-translate-y-1")}>
              <div
                className="grid-blueprint pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,white,transparent)]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-forest-bright/20 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4 pb-8 border-b border-white/15">
                  <Eyebrow onDark>{aboutVision.eyebrow}</Eyebrow>
                  <div className="rounded-xl bg-white/10 p-3 text-white backdrop-blur-sm group-hover:bg-white group-hover:text-forest transition-colors duration-300">
                    <Eye size={22} />
                  </div>
                </div>

                <h2 className="mt-8 font-display text-2xl sm:text-3xl md:text-[2.25rem] font-bold leading-[1.15] text-white tracking-tight">
                  {aboutVision.heading}
                </h2>
              </div>

              <div className="relative z-10 mt-12 pt-6 border-t border-white/15 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-white/70">
                <span>Long-Term Horizon</span>
                <span className="text-forest-bright">Vertical SaaS Engine</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

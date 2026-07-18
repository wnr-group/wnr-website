"use client";

import React from "react";
import Image from "next/image";
import { Terminal, Cpu, Layers } from "lucide-react";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { aboutInsideWnr } from "@/content/about";

export function AboutInsideWnr() {
  return (
    <Section id="inside-wnr" bleed className="py-24 md:py-36 bg-[#0e1a13] text-white overflow-hidden border-b border-line/10">
      <Container>
        <div className="max-w-3xl">
          <Reveal delay={0.1}>
            <Eyebrow onDark>{aboutInsideWnr.eyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-white">
              {aboutInsideWnr.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-[length:var(--text-lead)] leading-relaxed text-white/80">
              {aboutInsideWnr.body}
            </p>
          </Reveal>
        </div>

        {/* Three Culture Pillars as text cards with subtle gold rules */}
        <Stagger className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" stagger={0.15}>
          {aboutInsideWnr.culturePillars.map((pillar, index) => (
            <StaggerItem key={pillar.title}>
              <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]">
                {/* Subtle gold rule at top */}
                <div className="absolute top-0 left-8 right-8 h-0.5 bg-[#c9a24b] opacity-80" aria-hidden="true" />

                <div>
                  <div className="font-display text-xs font-bold uppercase tracking-widest text-[#c9a24b] mb-4">
                    0{index + 1} · Culture Pillar
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/75">
                    {pillar.body}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                  <span>WnR Engineering Standard</span>
                  <span className="font-mono text-[#c9a24b]">/ops-first</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Visual Strip: Abstract on-brand imagery — desk details, architecture sketches, no identifiable faces */}
        <Reveal className="mt-16 md:mt-24 pt-12 border-t border-white/10" delay={0.3}>
          <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-widest text-white/60 font-semibold">
            <span>Inside The Lab · Abstract Artifacts</span>
            <span>No generic code — Pure Operational Mapping</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Sketch / Architecture Diagram Card */}
            <div className="relative h-64 sm:h-72 rounded-3xl border border-white/15 bg-[#124734]/30 overflow-hidden group">
              <div className="grid-blueprint absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.6)_0%,transparent_100%)]">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur-md w-fit">
                  <Terminal size={13} className="text-forest-bright" />
                  <span>Workflow Architecture</span>
                </div>
                <div>
                  <div className="font-display text-base font-bold text-white">System Blueprints</div>
                  <div className="text-xs text-white/65 mt-1">Mapping operational leaks before line one.</div>
                </div>
              </div>
            </div>

            {/* Whiteboard / Discovery Detail (No faces) */}
            <div className="relative h-64 sm:h-72 rounded-3xl border border-white/15 bg-black/40 overflow-hidden group">
              <Image
                src="/brand/build-systems.webp"
                alt="Abstract system and code diagrams on screen"
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.7)_0%,transparent_80%)]">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur-md w-fit">
                  <Layers size={13} className="text-teal-bright" />
                  <span>Desk & Whiteboard Study</span>
                </div>
                <div>
                  <div className="font-display text-base font-bold text-white">Operational Diagnostics</div>
                  <div className="text-xs text-white/65 mt-1">Sitting with operators to understand real friction.</div>
                </div>
              </div>
            </div>

            {/* Product Planning Visual */}
            <div className="relative h-64 sm:h-72 rounded-3xl border border-white/15 bg-[#0b2e20]/80 overflow-hidden group">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#1f7a54_1px,transparent_1px)] [background-size:16px_16px] group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.6)_0%,transparent_100%)]">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur-md w-fit">
                  <Cpu size={13} className="text-[#c9a24b]" />
                  <span>Intelligence Layer</span>
                </div>
                <div>
                  <div className="font-display text-base font-bold text-white">Product Compounding</div>
                  <div className="text-xs text-white/65 mt-1">Every vertical deployed makes the portfolio smarter.</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

"use client";

import React from "react";
import { m } from "motion/react";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { approach } from "@/content/sections";
import { cn } from "@/lib/utils";

export function CapabilitiesWorkflow() {
  return (
    <Section id="approach" tone="mist" className="py-24 md:py-36 border-b border-line overflow-hidden">
      <Container>
        {/* Header */}
        <Reveal className="max-w-3xl mb-16 md:mb-24">
          <Eyebrow>{approach.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.06] text-ink">
            {approach.heading}
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-body leading-relaxed max-w-2xl">
            Each arm flows into the next without friction. No handoff gaps, no lost context, no building things twice.
          </p>
        </Reveal>

        {/* Desktop Connected Horizontal Timeline (hidden on lg and below) */}
        <div className="hidden lg:block relative">
          <Stagger className="grid grid-cols-4 gap-8 relative" stagger={0.15}>
            {approach.steps.map((step, index) => {
              const isLast = index === approach.steps.length - 1;

              return (
                <StaggerItem key={step.num} className="h-full relative">
                  {/* Horizontal SVG connector line between steps */}
                  {!isLast && (
                    <div className="absolute top-7 left-[3.5rem] w-[calc(100%-3rem)] h-6 z-0 flex items-center overflow-visible">
                      <m.svg
                        className="w-full h-1 overflow-visible"
                        viewBox="0 0 100 2"
                        preserveAspectRatio="none"
                        fill="none"
                        initial={{ strokeDashoffset: 100 }}
                        whileInView={{ strokeDashoffset: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.7,
                          ease: [0.22, 1, 0.36, 1],
                          delay: 0.3 + index * 0.2,
                        }}
                        aria-hidden="true"
                      >
                        <path
                          d="M 0 1 L 100 1"
                          stroke="var(--color-gold)"
                          strokeWidth="2"
                          vectorEffect="non-scaling-stroke"
                          style={{ strokeDasharray: 100 }}
                        />
                      </m.svg>
                    </div>
                  )}

                  <div className="group relative z-10 flex flex-col justify-between h-full rounded-3xl border border-line bg-paper p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-forest hover:shadow-card-hover">
                    <div>
                      {/* Step Number Circle */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-wash text-forest font-display text-lg font-bold tabular-nums ring-1 ring-forest/20 group-hover:bg-forest group-hover:text-white transition-colors duration-300">
                          {step.num}
                        </span>

                        <span className="text-xs font-semibold uppercase tracking-widest text-muted opacity-60">
                          Phase 0{index + 1}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl font-bold text-ink group-hover:text-forest transition-colors">
                        {step.title}
                      </h3>

                      <p className="mt-4 text-[0.95rem] leading-relaxed text-body">
                        {step.body}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-line/50 flex items-center gap-2 text-xs font-semibold text-forest opacity-80 group-hover:opacity-100 transition-opacity">
                      <span>{index === 0 ? "Workflow Audit" : index === 1 ? "System Architecture" : index === 2 ? "Full Deployment" : "Continuous Growth"}</span>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>

        {/* Mobile & Tablet Vertical Connected Timeline (visible on lg and below) */}
        <div className="lg:hidden relative">
          {/* Vertical progress connector dropping down the left side */}
          <div className="absolute left-[1.625rem] top-8 bottom-8 w-0.5 z-0 flex justify-center overflow-visible">
            <m.svg
              className="w-0.5 h-full overflow-visible"
              viewBox="0 0 2 400"
              preserveAspectRatio="none"
              fill="none"
              initial={{ strokeDashoffset: 400 }}
              whileInView={{ strokeDashoffset: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              aria-hidden="true"
            >
              <path
                d="M 1 0 L 1 400"
                stroke="var(--color-forest)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                style={{ strokeDasharray: 400 }}
              />
            </m.svg>
          </div>

          <div className="flex flex-col gap-6 relative z-10">
            {approach.steps.map((step, index) => (
              <Reveal key={step.num} delay={index * 0.1} y={16}>
                <div className="group flex items-start gap-5 rounded-3xl border border-line bg-paper p-6 sm:p-7 shadow-card transition-all duration-300 active:border-forest">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest-wash text-forest font-display text-base font-bold tabular-nums ring-1 ring-forest/20 group-hover:bg-forest group-hover:text-white transition-colors duration-300">
                    {step.num}
                  </span>

                  <div className="pt-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted block mb-1">
                      Phase 0{index + 1}
                    </span>
                    <h3 className="font-display text-xl font-bold text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 text-sm sm:text-[0.95rem] leading-relaxed text-body">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

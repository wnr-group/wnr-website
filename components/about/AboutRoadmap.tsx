"use client";

import React from "react";
import { m } from "motion/react";
import { Sparkles, Layers, ArrowRight, Globe } from "lucide-react";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { aboutWhereWeAreGoing } from "@/content/about";
import { cn } from "@/lib/utils";

export function AboutRoadmap() {
  const { intro, horizons } = aboutWhereWeAreGoing;

  return (
    <Section id="roadmap" tone="canvas" revealY={40} revealDuration={0.8} className="py-24 md:py-36 border-b border-line overflow-hidden">
      <Container>
        <Reveal className="max-w-3xl mb-16 md:mb-24">
          <Eyebrow>{aboutWhereWeAreGoing.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
            {aboutWhereWeAreGoing.heading}
          </h2>
          {intro.map((p, i) => (
            <p key={i} className="mt-6 text-[length:var(--text-lead)] leading-relaxed text-body">
              {p}
            </p>
          ))}
        </Reveal>

        {/* Three Horizon Roadmap Timeline with elegant milestone reveals */}
        <div className="relative pl-6 sm:pl-12 md:pl-16">
          {/* Vertical Timeline Spine */}
          <div className="absolute top-6 bottom-6 left-3 sm:left-6 w-0.5 bg-line">
            <m.div
              className="w-full bg-[linear-gradient(to_bottom,var(--color-forest),var(--color-teal),#c9a24b)]"
              initial={{ height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <Stagger className="flex flex-col gap-14 sm:gap-20" stagger={0.2}>
            {horizons.map((h, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1;
              const isThird = idx === 2;

              return (
                <StaggerItem key={h.horizon} className="relative">
                  {/* Glowing timeline node dot */}
                  <div className="absolute -left-6 sm:-left-12 top-2 h-6 w-6 rounded-full border-4 border-paper bg-forest flex items-center justify-center shadow-md">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  </div>

                  <div
                    className={cn(
                      "rounded-3xl border p-8 sm:p-12 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 relative overflow-hidden",
                      isFirst && "border-forest/30 bg-[linear-gradient(135deg,var(--color-paper)_0%,var(--color-forest-wash)_100%)] hover:border-forest/50",
                      isSecond && "border-teal/30 bg-[linear-gradient(135deg,var(--color-paper)_0%,var(--color-teal-wash)_100%)] hover:border-teal/50",
                      isThird && "border-[#c9a24b]/40 bg-[linear-gradient(135deg,#124734_0%,#0e1a13_100%)] text-white hover:border-[#c9a24b]/60"
                    )}
                  >
                    {/* Background decoration */}
                    {isThird && (
                      <div className="grid-blueprint pointer-events-none absolute inset-0 opacity-20" />
                    )}

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <span
                        className={cn(
                          "font-display text-xs font-extrabold tracking-[0.16em] uppercase",
                          isThird ? "text-[#c9a24b]" : "text-forest"
                        )}
                      >
                        {h.horizon}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-semibold w-fit shadow-sm",
                          isFirst && "bg-forest text-white",
                          isSecond && "bg-teal text-white",
                          isThird && "bg-[#c9a24b] text-ink"
                        )}
                      >
                        {isFirst && <Layers size={13} />}
                        {isSecond && <Sparkles size={13} />}
                        {isThird && <Globe size={13} />}
                        <span>{h.badge}</span>
                      </span>
                    </div>

                    <h3
                      className={cn(
                        "relative z-10 font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight",
                        isThird ? "text-white" : "text-ink"
                      )}
                    >
                      {h.title}
                    </h3>

                    <div className="relative z-10 mt-6 space-y-4">
                      {h.paragraphs.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className={cn(
                            "text-base sm:text-lg leading-relaxed",
                            isThird ? "text-white/85" : "text-body"
                          )}
                        >
                          {para}
                        </p>
                      ))}
                    </div>

                    {isThird && (
                      <div className="relative z-10 mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#c9a24b]">
                        <span>Compounding Geographic Scale</span>
                        <span className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          Neighbourhoods <ArrowRight size={14} /> Nations
                        </span>
                      </div>
                    )}
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}

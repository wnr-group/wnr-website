"use client";

import React, { useState } from "react";
import Link from "next/link";
import { m } from "motion/react";
import { Compass, Layers, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

export function CapabilitiesArchitecture() {
  // Track hovered arm to subtly highlight related products and connection lines
  const [hoveredArm, setHoveredArm] = useState<string | null>(null);

  const isSystemsHovered = hoveredArm === "systems";
  const isAiLabsHovered = hoveredArm === "ai-labs";
  const isConsultingHovered = hoveredArm === "consulting";
  const isProductsHighlighted = isSystemsHovered || isAiLabsHovered;

  return (
    <Section id="architecture" bleed tone="canvas" className="py-20 md:py-32 border-b border-line overflow-hidden">
      <Container>
        {/* Section Header */}
        <Reveal className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="flex justify-center">
            <Eyebrow>THE ARCHITECTURE</Eyebrow>
          </div>
          <h2 className="mt-4 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
            How our ecosystem fits together
          </h2>
          <p className="mt-4 text-[length:var(--text-lead)] text-body leading-relaxed max-w-2xl mx-auto">
            Three specialized operating arms powered by one parent entity, engineered to turn strategic clarity into live software and autonomous intelligence.
          </p>
        </Reveal>

        {/* Desktop Architecture Visualization (hidden on screens smaller than lg) */}
        <div className="hidden lg:block relative mx-auto max-w-5xl rounded-3xl border border-line bg-paper p-12 shadow-card">
          {/* Subtle blueprint grid inside card */}
          <div
            className="grid-blueprint pointer-events-none absolute inset-0 opacity-40 rounded-3xl [mask-image:linear-gradient(to_bottom,white,transparent_80%)]"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Phase 1: Parent Entity Reveal */}
            <Reveal y={16} delay={0.1}>
              <div
                className="flex flex-col items-center justify-center rounded-2xl border border-forest/30 px-10 py-4 text-white shadow-md transition-all duration-300 hover:shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-forest) 0%, var(--color-forest-deep) 100%)",
                }}
              >
                <span className="font-display text-xl font-bold tracking-tight">WnRTech</span>
                <span className="text-xs uppercase tracking-widest text-forest-bright font-semibold mt-0.5">
                  Parent Entity · WnR Group
                </span>
              </div>
            </Reveal>

            {/* Phase 2: Line drawing animation dropping from Parent */}
            <div className="h-10 w-full flex justify-center relative my-1 overflow-visible">
              <m.svg
                className="h-10 w-0.5 overflow-visible"
                viewBox="0 0 2 40"
                fill="none"
                initial={{ strokeDashoffset: 40 }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                aria-hidden="true"
              >
                <path
                  d="M 1 0 L 1 40"
                  stroke={hoveredArm ? "var(--color-forest)" : "var(--color-line-strong)"}
                  strokeWidth="2"
                  style={{ strokeDasharray: 40 }}
                />
              </m.svg>
            </div>

            {/* Phase 2b: Horizontal branching line across arms */}
            <div className="w-[74%] h-10 relative mb-4 flex justify-between">
              {/* Horizontal line */}
              <m.svg
                className="absolute inset-x-0 top-0 h-1 w-full overflow-visible"
                viewBox="0 0 100 2"
                preserveAspectRatio="none"
                fill="none"
                initial={{ strokeDashoffset: 100 }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                aria-hidden="true"
              >
                <path
                  d="M 0 1 L 100 1"
                  stroke={hoveredArm ? "var(--color-forest)" : "var(--color-line-strong)"}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  style={{ strokeDasharray: 100 }}
                />
              </m.svg>

              {/* Left drop down to ARM 01 */}
              <m.svg
                className="absolute left-0 top-0 h-10 w-0.5 overflow-visible"
                viewBox="0 0 2 40"
                fill="none"
                initial={{ strokeDashoffset: 40 }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                aria-hidden="true"
              >
                <path
                  d="M 1 0 L 1 40"
                  stroke={isConsultingHovered ? "var(--color-teal)" : "var(--color-line-strong)"}
                  strokeWidth={isConsultingHovered ? "2.5" : "2"}
                  style={{ strokeDasharray: 40 }}
                />
              </m.svg>

              {/* Center drop down to ARM 02 */}
              <m.svg
                className="absolute left-1/2 top-0 h-10 w-0.5 -translate-x-1/2 overflow-visible"
                viewBox="0 0 2 40"
                fill="none"
                initial={{ strokeDashoffset: 40 }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                aria-hidden="true"
              >
                <path
                  d="M 1 0 L 1 40"
                  stroke={isSystemsHovered ? "var(--color-forest)" : "var(--color-line-strong)"}
                  strokeWidth={isSystemsHovered ? "2.5" : "2"}
                  style={{ strokeDasharray: 40 }}
                />
              </m.svg>

              {/* Right drop down to ARM 03 */}
              <m.svg
                className="absolute right-0 top-0 h-10 w-0.5 overflow-visible"
                viewBox="0 0 2 40"
                fill="none"
                initial={{ strokeDashoffset: 40 }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                aria-hidden="true"
              >
                <path
                  d="M 1 0 L 1 40"
                  stroke={isAiLabsHovered ? "var(--color-amber)" : "var(--color-line-strong)"}
                  strokeWidth={isAiLabsHovered ? "2.5" : "2"}
                  style={{ strokeDasharray: 40 }}
                />
              </m.svg>
            </div>

            {/* Phase 3: Three Arms Card Stagger */}
            <Stagger className="grid grid-cols-3 gap-6 w-full z-10" stagger={0.12} delayChildren={0.45}>
              {/* ARM 01: Consulting */}
              <StaggerItem className="h-full">
                <Link
                  href="#consulting"
                  onMouseEnter={() => setHoveredArm("consulting")}
                  onMouseLeave={() => setHoveredArm(null)}
                  className={cn(
                    "flex flex-col items-center text-center rounded-2xl border p-6 transition-all duration-300 h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal",
                    isConsultingHovered
                      ? "border-teal bg-teal-wash/60 shadow-card -translate-y-1"
                      : "border-line bg-canvas hover:border-line-strong hover:-translate-y-0.5"
                  )}
                >
                  <div
                    className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300",
                      isConsultingHovered ? "bg-teal text-white" : "bg-teal-wash text-teal group-hover:bg-teal group-hover:text-white"
                    )}
                  >
                    <Compass size={24} strokeWidth={1.75} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal">ARM 01</span>
                  <span className="font-display text-xl font-bold text-ink mt-1">WnR Consulting</span>
                  <p className="text-xs text-muted mt-2 leading-relaxed">
                    Operational mapping, audit, and exact system prescription before code is written.
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-teal group-hover:translate-x-1 transition-transform">
                    <span>Explore division</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              </StaggerItem>

              {/* ARM 02: Systems */}
              <StaggerItem className="h-full relative">
                <Link
                  href="#systems"
                  onMouseEnter={() => setHoveredArm("systems")}
                  onMouseLeave={() => setHoveredArm(null)}
                  className={cn(
                    "flex flex-col items-center text-center rounded-2xl border p-6 transition-all duration-300 h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest",
                    isSystemsHovered
                      ? "border-forest bg-forest-wash/80 shadow-card -translate-y-1"
                      : "border-line bg-canvas hover:border-line-strong hover:-translate-y-0.5"
                  )}
                >
                  <div
                    className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300",
                      isSystemsHovered ? "bg-forest text-white" : "bg-forest-wash text-forest group-hover:bg-forest group-hover:text-white"
                    )}
                  >
                    <Layers size={24} strokeWidth={1.75} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-forest">ARM 02</span>
                  <span className="font-display text-xl font-bold text-ink mt-1">WnR Systems</span>
                  <p className="text-xs text-muted mt-2 leading-relaxed">
                    Custom operational platforms, ERP systems, multi-portal web apps, and mobile builds.
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-forest group-hover:translate-x-1 transition-transform">
                    <span>Explore division</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>

                {/* Connector from Systems to Products */}
                <m.svg
                  className="absolute -bottom-10 left-1/2 h-10 w-0.5 -translate-x-1/2 overflow-visible"
                  viewBox="0 0 2 40"
                  fill="none"
                  initial={{ strokeDashoffset: 40 }}
                  whileInView={{ strokeDashoffset: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                  aria-hidden="true"
                >
                  <path
                    d="M 1 0 L 1 40"
                    stroke={isProductsHighlighted ? "var(--color-gold)" : "var(--color-line-strong)"}
                    strokeWidth={isProductsHighlighted ? "2.5" : "2"}
                    style={{ strokeDasharray: 40 }}
                  />
                </m.svg>
              </StaggerItem>

              {/* ARM 03: AI Labs */}
              <StaggerItem className="h-full">
                <Link
                  href="#ai-labs"
                  onMouseEnter={() => setHoveredArm("ai-labs")}
                  onMouseLeave={() => setHoveredArm(null)}
                  className={cn(
                    "flex flex-col items-center text-center rounded-2xl border p-6 transition-all duration-300 h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber",
                    isAiLabsHovered
                      ? "border-amber bg-amber-wash/70 shadow-card -translate-y-1"
                      : "border-line bg-canvas hover:border-line-strong hover:-translate-y-0.5"
                  )}
                >
                  <div
                    className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300",
                      isAiLabsHovered ? "bg-amber text-white" : "bg-amber-wash text-amber group-hover:bg-amber group-hover:text-white"
                    )}
                  >
                    <Sparkles size={24} strokeWidth={1.75} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber">ARM 03</span>
                  <span className="font-display text-xl font-bold text-ink mt-1">WnR AI Labs</span>
                  <p className="text-xs text-muted mt-2 leading-relaxed">
                    AI-enabled workflow automation, predictive intelligence, and our core AI layer.
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber group-hover:translate-x-1 transition-transform">
                    <span>Explore division</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              </StaggerItem>
            </Stagger>

            {/* Phase 4: Output Products Reveal */}
            <Reveal
              className={cn(
                "mt-10 flex flex-col items-center w-full max-w-xl border-t pt-8 transition-colors duration-500",
                isProductsHighlighted ? "border-gold" : "border-line/80"
              )}
              delay={0.65}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted">Output Products</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors duration-300",
                    isProductsHighlighted
                      ? "bg-gold text-forest-deep"
                      : "bg-forest-wash text-forest"
                  )}
                >
                  Built by Systems · Powered by AI Labs
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <Link
                  href="/products/eduos"
                  onMouseEnter={() => setHoveredArm("systems")}
                  onMouseLeave={() => setHoveredArm(null)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-5 py-3.5 transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest",
                    isProductsHighlighted
                      ? "border-gold bg-amber-wash/40 shadow-md scale-[1.02]"
                      : "border-line bg-forest-wash/40 hover:border-forest hover:bg-forest-wash/80"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={18} className={cn(isProductsHighlighted ? "text-gold-ink" : "text-forest")} />
                    <span className="font-display font-bold text-base text-ink">EduOS</span>
                  </div>
                  <span className="text-xs font-medium text-forest underline decoration-forest/40 underline-offset-4 group-hover:decoration-forest">
                    Explore product →
                  </span>
                </Link>

                <Link
                  href="/products/arenaos"
                  onMouseEnter={() => setHoveredArm("systems")}
                  onMouseLeave={() => setHoveredArm(null)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-5 py-3.5 transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest",
                    isProductsHighlighted
                      ? "border-gold bg-amber-wash/40 shadow-md scale-[1.02]"
                      : "border-line bg-forest-wash/40 hover:border-forest hover:bg-forest-wash/80"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={18} className={cn(isProductsHighlighted ? "text-gold-ink" : "text-forest")} />
                    <span className="font-display font-bold text-base text-ink">ArenaOS</span>
                  </div>
                  <span className="text-xs font-medium text-forest underline decoration-forest/40 underline-offset-4 group-hover:decoration-forest">
                    Explore product →
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Mobile & Tablet Architecture Visualization (visible on lg and below) */}
        <div className="lg:hidden relative mx-auto max-w-lg rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-card">
          <div className="flex flex-col items-center">
            {/* Top Parent Node */}
            <div
              className="z-10 flex flex-col items-center justify-center rounded-2xl border border-forest/30 px-8 py-3.5 text-white shadow-md text-center w-full"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-forest) 0%, var(--color-forest-deep) 100%)",
              }}
            >
              <span className="font-display text-lg font-bold tracking-tight">WnRTech</span>
              <span className="text-[11px] uppercase tracking-widest text-forest-bright font-semibold mt-0.5">
                Parent Entity · WnR Group
              </span>
            </div>

            {/* Vertical connector */}
            <div className="h-6 w-0.5 bg-line-strong my-1" aria-hidden="true" />

            {/* Mobile Stacked Arms */}
            <div className="flex flex-col gap-4 w-full">
              {/* ARM 01 */}
              <Link
                href="#consulting"
                className="flex items-start gap-4 rounded-2xl border border-line bg-canvas p-4 sm:p-5 active:bg-teal-wash/60 transition-colors"
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-teal-wash text-teal flex items-center justify-center">
                  <Compass size={20} strokeWidth={1.75} />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-teal">ARM 01</span>
                  <h3 className="font-display text-base font-bold text-ink">WnR Consulting</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Workflow mapping, process audit, and system prescription.
                  </p>
                </div>
              </Link>

              {/* ARM 02 */}
              <div className="flex flex-col rounded-2xl border border-line bg-canvas p-4 sm:p-5 transition-colors">
                <Link
                  href="#systems"
                  className="flex items-start gap-4 active:opacity-80 transition-opacity"
                >
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-forest-wash text-forest flex items-center justify-center">
                    <Layers size={20} strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-forest">ARM 02</span>
                    <h3 className="font-display text-base font-bold text-ink">WnR Systems</h3>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      Custom ERP systems, web platforms, and mobile builds.
                    </p>
                  </div>
                </Link>

                {/* Mobile Products Under Systems */}
                <div className="mt-4 pt-3 border-t border-line/60 grid grid-cols-2 gap-2">
                  <Link
                    href="/products/eduos"
                    className="flex items-center justify-center rounded-xl bg-forest-wash/50 py-2 px-3 text-center font-display font-semibold text-xs text-forest hover:bg-forest hover:text-white transition-colors"
                  >
                    EduOS
                  </Link>
                  <Link
                    href="/products/arenaos"
                    className="flex items-center justify-center rounded-xl bg-forest-wash/50 py-2 px-3 text-center font-display font-semibold text-xs text-forest hover:bg-forest hover:text-white transition-colors"
                  >
                    ArenaOS
                  </Link>
                </div>
              </div>

              {/* ARM 03 */}
              <Link
                href="#ai-labs"
                className="flex items-start gap-4 rounded-2xl border border-line bg-canvas p-4 sm:p-5 active:bg-amber-wash/60 transition-colors"
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-wash text-amber flex items-center justify-center">
                  <Sparkles size={20} strokeWidth={1.75} />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber">ARM 03</span>
                  <h3 className="font-display text-base font-bold text-ink">WnR AI Labs</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    AI workflow automation and predictive intelligence.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

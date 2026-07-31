"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { m, useReducedMotion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseStudy, CaseStudyAccent } from "@/types/caseStudy";
import { CaseStudyVisual } from "./CaseStudyVisual";

const ACCORDION_CONFIG = {
  autoplayIntervalMs: 4300,
  transitionDuration: 0.55,
  transitionEase: [0.4, 0, 0.2, 1] as const,
  // Content crossfade must start the instant the width transition starts
  // (delay-0) and finish no later than the width transition, so there is
  // never a frame where neither the collapsed nor expanded content is
  // visible. Matches transitionDuration in milliseconds.
  contentTransitionMs: 500,
};

const badgeTone: Record<CaseStudyAccent, string> = {
  forest: "bg-forest-wash text-forest",
  teal: "bg-teal-wash text-teal",
  amber: "bg-amber-wash text-amber",
};

interface CaseStudyAccordionBannerProps {
  studies: CaseStudy[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

/**
 * Case Study Accordion Banner — Reference Spec A implementation.
 * Displays 5 horizontal panels in a full-width row.
 * - Active panel expanded: shows full visual background + bold title, 2–3 line summary, and CTA.
 * - Collapsed panels: ~64px–88px wide, rotated 90° bold white title with dark/dimmed visual.
 * - Autoplay: ~4.3s dwell per panel, ~550ms ease-in-out flex width transition.
 * - Interactivity: Hover/click expands immediately, pauses autoplay while hovered/focused.
 * - Accessibility: Supports keyboard navigation and prefers-reduced-motion (instant switch).
 */
export function CaseStudyAccordionBanner({
  studies,
  activeIndex,
  onSelectIndex,
}: CaseStudyAccordionBannerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Limit to 5 panels per Reference Spec A
  const panels = studies.slice(0, 5);
  const total = panels.length;

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    onSelectIndex((activeIndex + 1) % total);
  }, [total, activeIndex, onSelectIndex]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    onSelectIndex((activeIndex - 1 + total) % total);
  }, [total, activeIndex, onSelectIndex]);

  // Autoplay loop
  useEffect(() => {
    if (isPaused || Boolean(shouldReduceMotion) || total <= 1) return;
    const timer = setInterval(handleNext, ACCORDION_CONFIG.autoplayIntervalMs);
    return () => clearInterval(timer);
  }, [isPaused, shouldReduceMotion, total, handleNext]);

  // Keyboard navigation across the banner region
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    },
    [handlePrev, handleNext]
  );

  if (!panels || total === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured case studies accordion banner"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative z-10 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-3xl"
    >
      {/* Screen Reader Live Region */}
      <div aria-live="polite" className="sr-only">
        {panels[activeIndex]
          ? `Active Case Study ${activeIndex + 1} of ${total}: ${panels[activeIndex].title}. ${panels[activeIndex].summary}`
          : ""}
      </div>

      {/* Accordion Horizontal Row */}
      <div className="flex h-[440px] w-full gap-2.5 overflow-hidden rounded-3xl sm:h-[480px] sm:gap-3 md:h-[520px] lg:h-[560px] lg:gap-4">
        {panels.map((study, index) => {
          const isActive = index === activeIndex;
          const isAdjacent =
            index === (activeIndex + 1) % total ||
            index === (activeIndex - 1 + total) % total;
          const contentTransitionStyle = Boolean(shouldReduceMotion)
            ? { transitionDuration: "0ms", transitionDelay: "0ms" }
            : undefined;

          return (
            <m.div
              key={study.id}
              role={isActive ? "group" : "button"}
              aria-roledescription={isActive ? "slide" : undefined}
              aria-label={`Case study ${index + 1} of ${total}: ${study.title}`}
              aria-expanded={isActive ? undefined : false}
              tabIndex={isActive ? -1 : 0}
              onMouseEnter={() => {
                setIsPaused(true);
                if (!isActive) {
                  onSelectIndex(index);
                }
              }}
              onClick={() => {
                if (!isActive) {
                  onSelectIndex(index);
                }
              }}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !isActive) {
                  e.preventDefault();
                  onSelectIndex(index);
                }
              }}
              animate={{
                flexGrow: isActive ? 10 : 0,
              }}
              transition={{
                duration: Boolean(shouldReduceMotion)
                  ? 0
                  : ACCORDION_CONFIG.transitionDuration,
                ease: ACCORDION_CONFIG.transitionEase,
              }}
              style={{ willChange: "flex-grow" }}
              className={cn(
                "group relative h-full overflow-hidden rounded-2xl sm:rounded-3xl border transition-colors select-none",
                isActive
                  ? "w-full sm:w-auto flex-[10_1_0%] border-line-strong bg-mist shadow-card"
                  : "w-[60px] sm:w-[72px] md:w-[84px] lg:w-[96px] shrink-0 flex-[0_0_auto] cursor-pointer border-line bg-ink hover:border-forest/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              )}
            >
              {/* Background Visual Area */}
              <div
                className={cn(
                  "absolute inset-0 overflow-hidden transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-35 filter brightness-75 group-hover:opacity-55"
                )}
              >
                {study.image ? (
                  <Image
                    src={study.image}
                    alt={`${study.title} visual`}
                    fill
                    sizes="(min-width: 1024px) 75vw, 100vw"
                    className="object-cover"
                    preload={isActive}
                    loading={isActive || isAdjacent ? "eager" : "lazy"}
                  />
                ) : (
                  <CaseStudyVisual
                    kind={study.visual}
                    accent={study.accent}
                    label={study.industryLabel}
                  />
                )}
              </div>

              {/* Collapsed Panel Content (Rotated 90° Bottom-to-Top) */}
              <div
                style={contentTransitionStyle}
                className={cn(
                  "absolute inset-0 z-10 flex flex-col items-center justify-between py-5 sm:py-7 bg-ink/75 transition-opacity group-hover:bg-ink/65",
                  isActive
                    ? "pointer-events-none opacity-0 duration-200 delay-0"
                    : "opacity-100 duration-300 delay-300"
                )}
              >
                <span className="font-mono text-[0.7rem] font-bold tracking-widest text-white/60">
                  0{index + 1}
                </span>

                <span
                  className="font-display text-sm sm:text-base font-bold tracking-wide text-white whitespace-nowrap select-none"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {study.title}
                </span>

                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors group-hover:bg-white/20 group-hover:text-white"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </span>
              </div>

              {/* Expanded Panel Content Area — fade-in starts the instant the
                  width transition starts (delay-0) and completes alongside it,
                  eliminating the dead window where neither collapsed nor
                  expanded content was visible mid-transition. */}
              <div
                style={{
                  ...contentTransitionStyle,
                  transitionDuration: contentTransitionStyle
                    ? undefined
                    : isActive
                    ? `${ACCORDION_CONFIG.contentTransitionMs}ms`
                    : "200ms",
                  transitionDelay: contentTransitionStyle ? undefined : "0ms",
                }}
                className={cn(
                  "absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 lg:p-10 transition-opacity",
                  isActive
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                )}
              >
                {/* Legibility gradient overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/50 to-transparent"
                />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className={cn(
                      "rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] shadow-sm",
                      badgeTone[study.accent]
                    )}
                  >
                    {study.industryLabel}
                  </span>
                  <span className="font-mono text-sm font-semibold tracking-wider text-white/70">
                    0{index + 1} / 0{total}
                  </span>
                </div>

                {/* Bottom Text Block & CTA */}
                <div className="relative z-10 max-w-2xl mt-auto flex flex-col gap-3 sm:gap-4">
                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
                    {study.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-white/85 line-clamp-3">
                    {study.summary}
                  </p>
                  <div className="mt-2 flex items-center gap-2.5 text-sm sm:text-base font-semibold text-white group-hover:underline">
                    <span>Explore Case Study</span>
                    <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>
              </div>
            </m.div>
          );
        })}
      </div>
    </div>
  );
}

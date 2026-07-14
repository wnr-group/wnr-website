"use client";

import React, { useState, useEffect, useCallback } from "react";
import { m, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/types/caseStudy";
import { CaseStudyCard } from "./CaseStudyCard";

const STACK_CONFIG = {
  autoplayIntervalMs: 4800,
  swipeThresholdDistance: 45,
  swipeThresholdVelocity: 250,
  spring: {
    type: "spring" as const,
    stiffness: 260,
    damping: 28,
    mass: 1,
  },
  reducedMotionTransition: {
    duration: 0.25,
    ease: [0.22, 1, 0.36, 1] as const,
  },
};

/**
 * Calculates circular offset relative to the active card.
 * Returns 0 for active, 1 for Stack 1 (beneath active), 2 for Stack 2, etc.
 */
function getStackOffset(index: number, activeIndex: number, total: number): number {
  if (total <= 1) return 0;
  return (index - activeIndex + total) % total;
}

/**
 * Maps stack position to physical 2D depth properties (scale, translateY, opacity, shadow, zIndex).
 * Strictly avoids fake 3D perspective transforms per requirements.
 */
function getStackMotionVariants(stackIndex: number, isReducedMotion: boolean) {
  if (isReducedMotion) {
    return {
      y: 0,
      scale: stackIndex === 0 ? 1 : 0.9,
      opacity: stackIndex === 0 ? 1 : 0,
      zIndex: stackIndex === 0 ? 50 : 10,
    };
  }

  switch (stackIndex) {
    case 0: // Active Card — Main Display
      return {
        y: 0,
        scale: 1,
        opacity: 1,
        zIndex: 50,
        filter: "blur(0px)",
      };
    case 1: // Stack 1 — First layer beneath active
      return {
        y: 36,
        scale: 0.94,
        opacity: 0.75,
        zIndex: 40,
        filter: "blur(0.5px)",
      };
    case 2: // Stack 2 — Second layer beneath active
      return {
        y: 68,
        scale: 0.88,
        opacity: 0.50,
        zIndex: 30,
        filter: "blur(1px)",
      };
    case 3: // Stack 3 — Third layer beneath active
      return {
        y: 96,
        scale: 0.82,
        opacity: 0.25,
        zIndex: 20,
        filter: "blur(1.5px)",
      };
    default: // Stack 4+ / Background / Leaving
      return {
        y: 120,
        scale: 0.76,
        opacity: 0,
        zIndex: 10,
        filter: "blur(2px)",
      };
  }
}

interface CaseStudyCardStackProps {
  studies: CaseStudy[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

/**
 * Premium Stacked Card Animation System for the Case Study section.
 * The active card occupies the main display while remaining cards stay stacked beneath it
 * with physical depth (scale, translateY, opacity, shadow, zIndex).
 */
export function CaseStudyCardStack({
  studies,
  activeIndex,
  onSelectIndex,
}: CaseStudyCardStackProps) {
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const total = studies.length;

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
    const timer = setInterval(handleNext, STACK_CONFIG.autoplayIntervalMs);
    return () => clearInterval(timer);
  }, [isPaused, shouldReduceMotion, total, handleNext]);

  // Keyboard navigation
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

  if (!studies || total === 0) return null;

  const activeStudy = studies[activeIndex] || studies[0];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Stacked case studies showcase"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative flex w-full flex-col items-center rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
    >
      {/* Screen Reader Live Region */}
      <div aria-live="polite" className="sr-only">
        {activeStudy
          ? `Active Case Study ${activeIndex + 1} of ${total}: ${activeStudy.title}. ${activeStudy.summary}`
          : ""}
      </div>

      {/* Stack Viewport */}
      <div className="relative flex h-[480px] w-full items-start justify-center overflow-visible sm:h-[530px] md:h-[560px] lg:h-[590px] pt-2">
        {studies.map((study, index) => {
          const stackIndex = getStackOffset(index, activeIndex, total);
          const variants = getStackMotionVariants(stackIndex, Boolean(shouldReduceMotion));
          const isActive = stackIndex === 0;

          return (
            <m.div
              key={study.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Case Study ${index + 1} of ${total}: ${study.title}`}
              aria-hidden={!isActive}
              onPanStart={() => setIsPaused(true)}
              onPanEnd={(_, info) => {
                if (
                  info.offset.x < -STACK_CONFIG.swipeThresholdDistance ||
                  info.velocity.x < -STACK_CONFIG.swipeThresholdVelocity ||
                  info.offset.y > STACK_CONFIG.swipeThresholdDistance ||
                  info.velocity.y > STACK_CONFIG.swipeThresholdVelocity
                ) {
                  handleNext();
                } else if (
                  info.offset.x > STACK_CONFIG.swipeThresholdDistance ||
                  info.velocity.x > STACK_CONFIG.swipeThresholdVelocity ||
                  info.offset.y < -STACK_CONFIG.swipeThresholdDistance ||
                  info.velocity.y < -STACK_CONFIG.swipeThresholdVelocity
                ) {
                  handlePrev();
                }
                setIsPaused(false);
              }}
              animate={variants}
              transition={
                shouldReduceMotion
                  ? STACK_CONFIG.reducedMotionTransition
                  : STACK_CONFIG.spring
              }
              style={{
                willChange: "transform, opacity",
                position: "absolute",
              }}
              className={cn(
                "w-[310px] h-[410px] sm:w-[380px] sm:h-[450px] md:w-[460px] md:h-[480px] lg:w-[540px] lg:h-[510px] transition-shadow duration-300",
                isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
              )}
            >
              <CaseStudyCard
                study={study}
                isActive={isActive}
                onClick={() => {
                  if (!isActive) {
                    onSelectIndex(index);
                  }
                }}
              />
            </m.div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex flex-col items-center gap-6 sm:mt-10">
        <div className="flex items-center gap-6 sm:gap-8">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous case study in stack"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-card transition-all duration-200 hover:border-forest/40 hover:bg-forest-wash/50 hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest active:scale-95"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2.5" role="tablist" aria-label="Case study stack selection">
            {studies.map((study, index) => {
              const isCurrent = index === activeIndex;
              return (
                <button
                  key={study.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Go to case study ${index + 1}: ${study.title}`}
                  onClick={() => onSelectIndex(index)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest",
                    isCurrent ? "w-8 bg-forest" : "w-2.5 bg-line-strong hover:bg-forest/50"
                  )}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next case study in stack"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-card transition-all duration-200 hover:border-forest/40 hover:bg-forest-wash/50 hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest active:scale-95"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

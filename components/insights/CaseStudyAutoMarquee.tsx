"use client";

import React, { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/types/caseStudy";
import { CaseStudyCard } from "./CaseStudyCard";

interface CaseStudyAutoMarqueeProps {
  studies: CaseStudy[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

const MARQUEE_KEYFRAMES = `
@keyframes wnr-infinite-marquee {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-33.333333%, 0, 0);
  }
}
`;

/**
 * Continuous, infinite auto-scrolling horizontal thumbnail strip.
 * Duplicates case studies internally (`[...studies, ...studies, ...studies]`) and uses
 * GPU-accelerated CSS keyframes (`transform: translate3d`) for linear 60fps motion
 * without jumps, snapping, or pauses between loops.
 *
 * Clicking a thumbnail activates the corresponding case study in the top stack and highlights
 * the thumbnail without interrupting or restarting the marquee motion.
 */
export function CaseStudyAutoMarquee({
  studies,
  activeIndex,
  onSelectIndex,
}: CaseStudyAutoMarqueeProps) {
  const shouldReduceMotion = useReducedMotion();

  // Duplicate items 3 times so translating exactly 33.333333% wraps seamlessly
  const duplicatedStudies = useMemo(() => {
    if (!studies || studies.length === 0) return [];
    return [...studies, ...studies, ...studies];
  }, [studies]);

  if (!studies || studies.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Case studies continuous preview strip"
      className="relative w-full overflow-hidden py-4"
    >
      {/* Isolated Keyframes Injection */}
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_KEYFRAMES }} />

      {/* Edge Fade Masks for clean visual presentation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-canvas to-transparent sm:w-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-canvas to-transparent sm:w-20"
      />

      {/* Marquee Track Container */}
      <div
        className="flex w-max gap-6 sm:gap-7"
        style={{
          willChange: "transform",
          animation: shouldReduceMotion
            ? "none"
            : "wnr-infinite-marquee 58s linear infinite",
        }}
      >
        {duplicatedStudies.map((study, idx) => {
          const originalIndex = idx % studies.length;
          const isCurrentActive = originalIndex === activeIndex;

          return (
            <div
              key={`${study.id}-${idx}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Preview: ${study.title}`}
              onClick={() => onSelectIndex(originalIndex)}
              className={cn(
                "w-[260px] sm:w-[300px] md:w-[330px] lg:w-[360px] shrink-0 transition-all duration-300 cursor-pointer select-none rounded-3xl",
                isCurrentActive
                  ? "ring-2 ring-forest ring-offset-4 ring-offset-canvas scale-[1.02] shadow-card-hover opacity-100"
                  : "opacity-80 hover:opacity-100 hover:scale-[1.01]"
              )}
            >
              <CaseStudyCard
                study={study}
                isActive={isCurrentActive}
                onClick={() => onSelectIndex(originalIndex)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

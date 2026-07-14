"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/types/caseStudy";
import { CaseStudyCard } from "./CaseStudyCard";

const CAROUSEL_CONFIG = {
  autoplayIntervalMs: 3000,
  transitionDuration: 0.525,
  transitionEase: [0.4, 0, 0.2, 1] as const,
};

interface CaseStudyHorizontalCarouselProps {
  studies: CaseStudy[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

/**
 * Horizontal Auto-Scroll Case Study Cards — Reference Spec B implementation.
 * - Header with section description and top-right circular prev/next arrow controls.
 * - Displays 3 visible cards on desktop (`lg`), 2 on tablet (`sm`), 1 on mobile (`xs`).
 * - Autoplay: ~3s dwell per step, ~525ms ease-in-out transition advancing by exactly 1 card.
 * - Loop behavior: Forward-infinite loop using cloned leading cards at the end of the track.
 * - Prev behavior: Clamps at index 0 (does not wrap backward, matching reference video exactly).
 * - Interactivity: Pauses autoplay on hover/focus, clickable thumbnails to sync top accordion.
 * - Accessibility: Keyboard navigable, reduced-motion support (instant position switch, no autoplay).
 */
export function CaseStudyHorizontalCarousel({
  studies,
  activeIndex,
  onSelectIndex,
}: CaseStudyHorizontalCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const total = studies.length;

  // Responsive visible count math matching tokens
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      if (width >= 1024) {
        setVisibleCount(3);
      } else if (width >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Clone leading cards to enable seamless forward-infinite looping
  const duplicatedStudies = useMemo(() => {
    if (!studies || total === 0) return [];
    // Clone first 3 cards (or up to total) at the end of the track
    return [...studies, ...studies.slice(0, Math.max(3, visibleCount))];
  }, [studies, total, visibleCount]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setEnableTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1 || currentIndex <= 0) return; // Clamped at 0 per Reference Spec B
    setEnableTransition(true);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, [total, currentIndex]);

  // Handle snapback when clone transition completes
  const handleAnimationComplete = useCallback(() => {
    if (currentIndex === total && total > 0) {
      // We reached the first cloned item. Snap back to index 0 with no transition.
      setEnableTransition(false);
      setCurrentIndex(0);
      // Re-enable transition on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
        });
      });
    }
  }, [currentIndex, total]);

  // Autoplay loop
  useEffect(() => {
    if (isPaused || Boolean(shouldReduceMotion) || total <= 1) return;
    const timer = setInterval(handleNext, CAROUSEL_CONFIG.autoplayIntervalMs);
    return () => clearInterval(timer);
  }, [isPaused, shouldReduceMotion, total, handleNext]);

  // Keyboard navigation across the track
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

  // Calculate card width and gap
  // Gap is 24px (1.5rem / gap-6).
  // Total gap space in track percentage = (gapInPx * (visibleCount - 1)) etc.
  // Using exact width classes + flex shrink-0 on item guarantees clean alignment without math drift.
  const isZeroClamped = currentIndex === 0;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Case study cards horizontal auto-scroll section"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-3xl"
    >
      {/* Header & Controls Row */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-10 sm:flex-row sm:items-center">
        <div className="max-w-2xl">
          <p className="font-display text-lg sm:text-xl font-bold tracking-tight text-ink">
            Explore specialized platforms and outcomes delivered across our key industries.
          </p>
        </div>

        {/* Circular Prev/Next Arrow Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isZeroClamped}
            aria-label="Previous case studies"
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-card transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest active:scale-95",
              isZeroClamped
                ? "opacity-40 cursor-not-allowed shadow-none border-line/60 text-muted"
                : "hover:border-forest/40 hover:bg-forest-wash/50 hover:text-forest"
            )}
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next case studies"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-card transition-all duration-200 hover:border-forest/40 hover:bg-forest-wash/50 hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest active:scale-95"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Outer Overflow Viewport */}
      <div className="relative w-full overflow-hidden py-2" ref={trackRef}>
        {/* Sliding Card Track */}
        <div
          role="group"
          aria-label="Case studies track"
          onTransitionEnd={handleAnimationComplete}
          style={{
            transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% - ${
              currentIndex * (24 / visibleCount)
            }px))`,
            transition:
              !enableTransition || Boolean(shouldReduceMotion)
                ? "none"
                : `transform ${CAROUSEL_CONFIG.transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
          className="flex gap-6 will-change-transform"
        >
          {duplicatedStudies.map((study, idx) => {
            const originalIndex = idx % total;
            const isTopActive = originalIndex === activeIndex;

            return (
              <div
                key={`${study.id}-${idx}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`Case study: ${study.title}`}
                onClick={() => onSelectIndex(originalIndex)}
                className={cn(
                  "shrink-0 transition-all duration-300 cursor-pointer select-none",
                  visibleCount === 3 && "w-[calc((100%_-_48px)_/_3)]",
                  visibleCount === 2 && "w-[calc((100%_-_24px)_/_2)]",
                  visibleCount === 1 && "w-full",
                  isTopActive
                    ? "ring-2 ring-forest ring-offset-4 ring-offset-canvas scale-[1.01]"
                    : "opacity-95 hover:opacity-100 hover:scale-[1.005]"
                )}
              >
                <CaseStudyCard
                  study={study}
                  isActive={isTopActive}
                  onClick={() => onSelectIndex(originalIndex)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

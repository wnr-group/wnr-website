"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { m, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { whyUsItems, type WhyUsItem } from "@/data/why-us";
import { ValueCard } from "./ValueCard";

const COVERFLOW_CONFIG = {
  autoplayIntervalMs: 4800,
  swipeThresholdDistance: 45,
  swipeThresholdVelocity: 250,
  perspectivePx: 1200,
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

function getCircularOffset(index: number, activeIndex: number, total: number): number {
  if (total <= 1) return 0;
  let diff = (index - activeIndex) % total;
  if (diff > Math.floor(total / 2)) {
    diff -= total;
  } else if (diff < -Math.floor((total - 1) / 2)) {
    diff += total;
  }
  return diff;
}

function getCardMotionVariants(offset: number, isReducedMotion: boolean) {
  if (isReducedMotion) {
    return {
      x: "0%",
      z: 0,
      rotateY: 0,
      scale: offset === 0 ? 1 : 0.9,
      opacity: offset === 0 ? 1 : 0,
      zIndex: offset === 0 ? 30 : 10,
    };
  }

  if (offset === 0) {
    return {
      x: "0%",
      z: 0,
      rotateY: 0,
      scale: 1,
      opacity: 1,
      zIndex: 30,
      filter: "blur(0px)",
    };
  } else if (offset === -1) {
    return {
      x: "-68%",
      z: -140,
      rotateY: 35,
      scale: 0.85,
      opacity: 0.65,
      zIndex: 20,
      filter: "blur(0.5px)",
    };
  } else if (offset === 1) {
    return {
      x: "68%",
      z: -140,
      rotateY: -35,
      scale: 0.85,
      opacity: 0.65,
      zIndex: 20,
      filter: "blur(0.5px)",
    };
  } else {
    const sign = Math.sign(offset) || 1;
    return {
      x: `${sign * 125}%`,
      z: -280,
      rotateY: -sign * 45,
      scale: 0.7,
      opacity: 0.15,
      zIndex: 10,
      filter: "blur(2px)",
    };
  }
}

interface WhyUsCoverflowProps {
  items?: WhyUsItem[];
}

export function WhyUsCoverflow({ items = whyUsItems }: WhyUsCoverflowProps = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const total = items.length;

  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay loop
  useEffect(() => {
    if (isPaused || shouldReduceMotion || total <= 1) return;
    const timer = setInterval(handleNext, COVERFLOW_CONFIG.autoplayIntervalMs);
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

  // Touch handlers for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    setIsPaused(true);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || touchStartTime.current === null) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaTime = (Date.now() - touchStartTime.current) / 1000;
      const velocityX = deltaX / (deltaTime || 0.01);

      if (
        deltaX < -COVERFLOW_CONFIG.swipeThresholdDistance ||
        velocityX < -COVERFLOW_CONFIG.swipeThresholdVelocity
      ) {
        handleNext();
      } else if (
        deltaX > COVERFLOW_CONFIG.swipeThresholdDistance ||
        velocityX > COVERFLOW_CONFIG.swipeThresholdVelocity
      ) {
        handlePrev();
      }
      touchStartX.current = null;
      touchStartTime.current = null;
      setIsPaused(false);
    },
    [handleNext, handlePrev]
  );

  const activeItem = items[activeIndex] || items[0];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Why Us principles"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative flex flex-col items-center w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-3xl"
    >
      {/* Screen Reader Live Region */}
      <div aria-live="polite" className="sr-only">
        {activeItem
          ? `Principle ${activeIndex + 1} of ${total}: ${activeItem.title}. ${activeItem.description}`
          : ""}
      </div>

      {/* 3D Coverflow Viewport */}
      <div
        className="relative flex h-[350px] w-full items-center justify-center overflow-hidden sm:h-[370px] md:h-[390px] lg:h-[410px]"
        style={{ perspective: `${COVERFLOW_CONFIG.perspectivePx}px` }}
      >
        {items.map((item, index) => {
          const offset = getCircularOffset(index, activeIndex, total);
          const variants = getCardMotionVariants(offset, Boolean(shouldReduceMotion));
          const isActive = offset === 0;

          return (
            <m.div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Principle ${index + 1} of ${total}: ${item.title}`}
              aria-hidden={!isActive}
              onPanStart={() => setIsPaused(true)}
              onPanEnd={(e, info) => {
                if (
                  info.offset.x < -COVERFLOW_CONFIG.swipeThresholdDistance ||
                  info.velocity.x < -COVERFLOW_CONFIG.swipeThresholdVelocity
                ) {
                  handleNext();
                } else if (
                  info.offset.x > COVERFLOW_CONFIG.swipeThresholdDistance ||
                  info.velocity.x > COVERFLOW_CONFIG.swipeThresholdVelocity
                ) {
                  handlePrev();
                }
                setIsPaused(false);
              }}
              animate={variants}
              transition={
                shouldReduceMotion
                  ? COVERFLOW_CONFIG.reducedMotionTransition
                  : COVERFLOW_CONFIG.spring
              }
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
                position: "absolute",
              }}
              className={cn(
                "w-[290px] h-[310px] sm:w-[340px] sm:h-[330px] md:w-[380px] md:h-[350px] lg:w-[420px] lg:h-[360px]",
                isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
              )}
            >
              <ValueCard
                item={item}
                isActive={isActive}
                isGreen={index % 2 === 0}
                onClick={() => {
                  if (!isActive) {
                    setActiveIndex(index);
                  }
                }}
              />
            </m.div>
          );
        })}
      </div>

      {/* Carousel Navigation Controls */}
      <div className="mt-8 flex flex-col items-center gap-6 sm:mt-10">
        <div className="flex items-center gap-6 sm:gap-8">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous principle"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-card transition-all duration-200 hover:border-forest/40 hover:bg-forest-wash/50 hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest active:scale-95"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2.5" role="tablist" aria-label="Slide selection">
            {items.map((item, index) => {
              const isCurrent = index === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Go to principle ${index + 1}: ${item.title}`}
                  onClick={() => setActiveIndex(index)}
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
            aria-label="Next principle"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-card transition-all duration-200 hover:border-forest/40 hover:bg-forest-wash/50 hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest active:scale-95"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

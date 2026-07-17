"use client";

import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { cn } from "@/lib/utils";

/* Motion primitives. LazyMotion ships only the ~15kb domAnimation feature set
   (animations + variants + whileInView + gestures) — enough for reveals and
   page transitions, without drag/layout. `strict` forbids the full `motion.*`
   component so bundle discipline is enforced. reducedMotion="user" makes every
   animation honour the OS setting: transforms are dropped, opacity still fades. */

const EASE = [0.22, 1, 0.36, 1] as const;

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

/* Fade-up on entering the viewport, once. Elements already in view on load
   animate immediately (the observer fires on mount), so above-the-fold content
   gets the same treatment. Only opacity + transform animate — no layout shift. */
export function Reveal({
  children,
  className,
  y = 16,
  delay = 0,
  amount = 0.2,
  onViewportEnter,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  amount?: number | "some" | "all";
  onViewportEnter?: () => void;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      onViewportEnter={onViewportEnter}
    >
      {children}
    </m.div>
  );
}

/* Staggered group — children reveal in sequence as the container enters view.
   Pair with StaggerItem for each child. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  amount = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren } },
      }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 18,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <m.div
      className={cn("h-full", className)}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      }}
    >
      {children}
    </m.div>
  );
}

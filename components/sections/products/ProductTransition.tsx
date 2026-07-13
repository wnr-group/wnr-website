// components/sections/products/ProductTransition.tsx
"use client";

import { AnimatePresence, m } from "motion/react";
import { EASE, TRANSITION_DURATION } from "./constants";

/* Sequential crossfade: whatever is currently mounted (grid or hero) fades
   and lifts out, THEN the next thing fades and lifts in — this is
   AnimatePresence's default mode="wait", chosen because the spec's animation
   sequence is explicitly sequential ("Grid Fade Out -> Hero Fade In"), not a
   simultaneous crossfade. Opacity + transform only (GPU), and
   prefers-reduced-motion is already handled globally by the
   MotionConfig reducedMotion="user" wrapper in components/ui/motion.tsx. */
export function ProductTransition({
  activeKey,
  children,
}: {
  activeKey: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={activeKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: TRANSITION_DURATION, ease: EASE }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}

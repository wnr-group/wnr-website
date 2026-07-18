"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

export interface UseCountUpOptions {
  end: number;
  suffix?: string;
  duration?: number;
  delay?: number;
}

/**
 * Scroll-triggered count-up animation hook using Framer Motion's imperative animate().
 * - Renders terminal string (`end + suffix`) by default on SSR / reduced motion.
 * - Sets initial `0 + suffix` right on hydration if out of view, then counts up when scrolled into view.
 * - Triggers exactly once.
 * - Directly updates DOM `textContent` via requestAnimationFrame / onUpdate (zero React re-renders).
 */
export function useCountUp({
  end,
  suffix = "",
  duration = 2.2,
  delay = 0,
}: UseCountUpOptions) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const hasAnimatedRef = useRef(false);
  const activeControlsRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (shouldReduceMotion) {
      if (activeControlsRef.current) {
        activeControlsRef.current.stop();
        activeControlsRef.current = null;
      }
      el.textContent = `${end.toLocaleString()}${suffix}`;
      hasAnimatedRef.current = true;
      return;
    }

    if (hasAnimatedRef.current) return;

    // Immediately set initial zero state upon mounting on the client
    el.textContent = `0${suffix}`;

    const checkAndAnimate = () => {
      if (hasAnimatedRef.current || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // In JSDOM / unit tests, elements have rect 0,0,0,0. In real browser, height > 0.
      const isJsdom = rect.height === 0 && rect.top === 0 && rect.bottom === 0;

      // In real browser: trigger strictly when the element scrolls into the viewable window (80px safety margin).
      const isVisibleInBrowser = rect.top < windowHeight - 80 && rect.bottom > 80 && rect.top >= -100;

      if (isJsdom || isVisibleInBrowser) {
        hasAnimatedRef.current = true;
        window.removeEventListener("scroll", checkAndAnimate);
        window.removeEventListener("resize", checkAndAnimate);

        const controls = animate(0, end, {
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (latest) => {
            if (ref.current) {
              ref.current.textContent = `${Math.round(latest).toLocaleString()}${suffix}`;
            }
          },
          onComplete: () => {
            if (ref.current) {
              ref.current.textContent = `${end.toLocaleString()}${suffix}`;
            }
            activeControlsRef.current = null;
          },
        });
        activeControlsRef.current = controls;
      }
    };

    // Check on mount (for direct refreshes or unit tests)
    checkAndAnimate();

    if (!hasAnimatedRef.current) {
      window.addEventListener("scroll", checkAndAnimate, { passive: true });
      window.addEventListener("resize", checkAndAnimate, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", checkAndAnimate);
      window.removeEventListener("resize", checkAndAnimate);
      if (activeControlsRef.current) {
        activeControlsRef.current.stop();
        activeControlsRef.current = null;
      }
    };
  }, [end, suffix, duration, delay, shouldReduceMotion]);

  return ref;
}

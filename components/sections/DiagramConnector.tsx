"use client";

import { useState } from "react";
import { m } from "motion/react";
import { cn } from "@/lib/utils";

export function DiagramDropLine() {
  const [inView, setInView] = useState(false);

  return (
    <m.svg
      className="h-8 w-0.5 my-1 overflow-visible"
      viewBox="0 0 2 32"
      fill="none"
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true }}
      aria-hidden="true"
    >
      <path
        d="M 1 0 L 1 32"
        stroke="var(--color-line-strong)"
        strokeWidth="1.5"
        style={{ "--dash": "32" } as React.CSSProperties}
        className={cn(inView ? "animate-draw" : "opacity-0")}
      />
    </m.svg>
  );
}

export function DiagramBranchLine() {
  const [inView, setInView] = useState(false);

  return (
    <m.div
      className="relative w-3/4 sm:w-2/3 h-8 mb-6 flex justify-between"
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true }}
      aria-hidden="true"
    >
      {/* Horizontal spanning line across arms */}
      <svg
        className="absolute inset-x-0 top-4 h-0.5 w-full overflow-visible"
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M 0 1 L 100 1"
          stroke="var(--color-line-strong)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          style={{ "--dash": "100" } as React.CSSProperties}
          className={cn(inView ? "animate-draw" : "opacity-0")}
        />
      </svg>

      {/* Upward tick connecting to the drop line from WnR Tech */}
      <svg
        className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 overflow-visible"
        viewBox="0 0 2 16"
        fill="none"
      >
        <path
          d="M 1 0 L 1 16"
          stroke="var(--color-line-strong)"
          strokeWidth="1.5"
          style={{ "--dash": "16" } as React.CSSProperties}
          className={cn(inView ? "animate-draw" : "opacity-0")}
        />
      </svg>

      {/* Left tick dropping down to ARM 01 (Consulting) */}
      <svg
        className="absolute left-0 top-4 h-4 w-0.5 overflow-visible"
        viewBox="0 0 2 16"
        fill="none"
      >
        <path
          d="M 1 0 L 1 16"
          stroke="var(--color-line-strong)"
          strokeWidth="1.5"
          style={{ "--dash": "16" } as React.CSSProperties}
          className={cn(inView ? "animate-draw" : "opacity-0")}
        />
      </svg>

      {/* Right tick dropping down to ARM 03 (AI Labs) */}
      <svg
        className="absolute right-0 top-4 h-4 w-0.5 overflow-visible"
        viewBox="0 0 2 16"
        fill="none"
      >
        <path
          d="M 1 0 L 1 16"
          stroke="var(--color-line-strong)"
          strokeWidth="1.5"
          style={{ "--dash": "16" } as React.CSSProperties}
          className={cn(inView ? "animate-draw" : "opacity-0")}
        />
      </svg>
    </m.div>
  );
}

export function DiagramProductConnector({ mobileOnly = false }: { mobileOnly?: boolean }) {
  const [inView, setInView] = useState(false);

  return (
    <m.svg
      className={cn(
        "overflow-visible",
        mobileOnly
          ? "md:hidden h-8 w-0.5 my-1"
          : "hidden md:block absolute -bottom-8 left-1/2 h-8 w-0.5 -translate-x-1/2"
      )}
      viewBox="0 0 2 32"
      fill="none"
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true }}
      aria-hidden="true"
    >
      <path
        d="M 1 0 L 1 32"
        stroke="var(--color-line-strong)"
        strokeWidth="1.5"
        style={{ "--dash": "32" } as React.CSSProperties}
        className={cn(inView ? "animate-draw" : "opacity-0")}
      />
    </m.svg>
  );
}

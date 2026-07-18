"use client";

import { proofStats } from "@/content/company";
import { useCountUp } from "@/hooks/useCountUp";

interface StatItemProps {
  value: string;
  label: string;
  index: number;
}

function StatItem({ value, label, index }: StatItemProps) {
  // Parse numeric target and suffix from values like "73+", "2", "25+"
  const numericMatch = value.match(/\d+/);
  const end = numericMatch ? parseInt(numericMatch[0], 10) : 0;
  const suffix = value.replace(/[0-9]/g, "");

  // Medium pace: 2.2s for larger counts, 1.4s for single digit, with a 150ms arrival pause
  const duration = end <= 5 ? 1.4 : 2.2;
  const delay = 0.15 + index * 0.18;

  const ref = useCountUp({ end, suffix, duration, delay });

  return (
    <div className="flex flex-col items-center text-center mx-auto">
      <span
        ref={ref}
        className="font-display text-[clamp(3.5rem,6vw,5.25rem)] font-extrabold tracking-tight leading-none text-ink tabular-nums"
      >
        {value}
      </span>
      <p className="mt-3.5 md:mt-4 text-base md:text-[1.05rem] font-normal leading-relaxed text-muted max-w-[280px] sm:max-w-[310px] text-pretty">
        {label}
      </p>
    </div>
  );
}

/**
 * Homepage Stats Section (`StatsSection`)
 * 3-column evenly-spaced layout (Reference Image 1 style) with soft diagonal gradient wash (`gradient-stat-wash`).
 * Renders the 3 confirmed stats (`73+`, `2`, `23+`) with scroll-triggered count-up animation.
 */
export function StatsSection() {
  // Take exactly the 3 approved stats: 73+, 2, 23+
  const homeStats = proofStats.slice(0, 3);

  return (
    <section
      id="stats"
      aria-label="Company impact metrics"
      className="gradient-stat-wash relative overflow-hidden py-20 sm:py-24 lg:py-28 border-y border-line flex items-center justify-center"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-16 items-center justify-center">
          {homeStats.map((stat, i) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

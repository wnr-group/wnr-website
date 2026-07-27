"use client";

import { proofStats } from "@/content/company";
import { useCountUp } from "@/hooks/useCountUp";
import { Reveal } from "@/components/ui/motion";

interface StatItemProps {
  value: string;
  label: string;
  index: number;
}

function StatItem({ value, label, index }: StatItemProps) {
  const numericMatch = value.match(/\d+/);
  const end = numericMatch ? parseInt(numericMatch[0], 10) : 0;
  const suffix = value.replace(/[0-9]/g, "");

  const duration = end <= 5 ? 1.4 : 2.2;
  const delay = 0.15 + index * 0.18;

  const ref = useCountUp({ end, suffix, duration, delay });

  return (
    <div
      className="flex flex-col items-center text-center"
      role="figure"
      aria-label={`${value}: ${label}`}
    >
      <span
        ref={ref}
        className="font-display text-[clamp(2.75rem,6vw,5rem)] font-extrabold tracking-tight leading-none text-ink tabular-nums"
        aria-hidden="true"
      >
        {value}
      </span>
      <p className="mt-3.5 text-[0.95rem] sm:text-base font-normal leading-relaxed text-muted max-w-[260px] sm:max-w-[300px] text-pretty">
        {label}
      </p>
    </div>
  );
}

export function StatsSection() {
  const homeStats = proofStats.slice(0, 3);

  return (
    <section
      id="stats"
      aria-label="Company impact metrics"
      className="gradient-stat-wash relative overflow-hidden border-y border-line"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8 py-16 sm:py-24 lg:py-28">
        <Reveal y={12} delay={0}>
          <div
            className="grid grid-cols-1 gap-14 sm:gap-10 md:grid-cols-3 md:gap-8 lg:gap-16 items-center justify-items-center"
            role="list"
          >
            {homeStats.map((stat, i) => (
              <div key={stat.label} role="listitem">
                <StatItem value={stat.value} label={stat.label} index={i} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

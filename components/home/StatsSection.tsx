"use client";

import type { CSSProperties, ElementType } from "react";
import { m } from "motion/react";
import { Building2, Layers, Users } from "lucide-react";
import { proofStats } from "@/content/company";
import { useCountUp } from "@/hooks/useCountUp";

interface StatItemProps {
  value: string;
  label: string;
  icon: ElementType;
  index: number;
}

// One line-drawn, consistent-stroke glyph per metric, aligned to the copy order
// in content/company.ts (clients · live products · team). Layers reads as
// stacked product surfaces, which suits the architectural motif better than a
// cluster of cubes did. No colour, no emoji.
const STAT_ICONS: ElementType[] = [Building2, Layers, Users];

// The site's house easing — a long, decelerating tail. Used for both the
// entrance and the hover so the section moves with one voice.
const EASE = [0.22, 1, 0.36, 1] as const;

// Written as a style rather than an arbitrary Tailwind value: the nested commas
// in color-mix() are far easier to read here.
const SECTION_SHEEN: CSSProperties = {
  backgroundImage:
    "radial-gradient(88% 46% at 50% -8%, color-mix(in oklab, var(--color-paper) 42%, transparent) 0%, transparent 72%)",
};

/* Three-layer elevation. A premium shadow is not one big blur — it is a tight
   contact shadow that anchors the card, a mid ambient layer, and a wide soft
   cast, all brand-tinted rather than black. The inset top line is the glass
   highlight that sells the surface as glass rather than as a flat panel. */
const CARD_SHADOW =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_1px_color-mix(in_oklab,var(--color-forest)_5%,transparent),0_4px_10px_-4px_color-mix(in_oklab,var(--color-forest)_8%,transparent),0_18px_44px_-22px_color-mix(in_oklab,var(--color-forest)_18%,transparent)]";

const CARD_SHADOW_HOVER =
  "group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_3px_color-mix(in_oklab,var(--color-forest)_6%,transparent),0_10px_20px_-8px_color-mix(in_oklab,var(--color-forest)_12%,transparent),0_36px_70px_-26px_color-mix(in_oklab,var(--color-forest)_26%,transparent)]";

function StatItem({ value, label, icon: Icon, index }: StatItemProps) {
  const numericMatch = value.match(/\d+/);
  const end = numericMatch ? parseInt(numericMatch[0], 10) : 0;
  const suffix = value.replace(/[0-9]/g, "");

  // 1.1s–1.5s, expo-out (eased in the hook). A two-digit target needs the
  // longer pass to feel like a climb; "2" would just stutter over one glyph.
  const duration = end <= 5 ? 1.1 : 1.5;
  // Matches the card's own entrance delay, so the digits climb *with* the card
  // rather than after it.
  const delay = 0.08 + index * 0.08;

  const ref = useCountUp({ end, suffix, duration, delay });

  return (
    // Equal-height grid cell. `group` drives the hover choreography; every
    // moving part is transform/opacity only, and the transforms are gated
    // behind motion-safe so prefers-reduced-motion leaves the card at rest.
    <div role="listitem" className="group h-full">
      {/* Entrance: fade + 18px rise + a 0.98 → 1 settle, staggered 80ms per
          card, once only. MotionConfig reducedMotion="user" (set in
          MotionProvider) drops the transforms and keeps the fade. */}
      <m.div
        className="h-full"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.62, ease: EASE, delay: index * 0.08 }}
      >
        <article
          role="figure"
          aria-label={`${value}: ${label}`}
          className={[
            "relative isolate flex h-full flex-col overflow-hidden p-7 sm:p-8",
            // 22px rather than the 24.5px token: at this card size a slightly
            // tighter radius reads as engineered instead of soft-toy.
            "rounded-[1.375rem]",
            // Light-mode glass. The 55% surface lets the wash read through, so
            // the card sits *in* the background rather than on top of it. Two
            // rims do what one white border can't on a pale backdrop — a bright
            // glass highlight plus a brand hairline for definition.
            //
            // Deliberately NO backdrop-filter. Nothing textured sits behind
            // these cards, so blur(4px) and blur(8px) render byte-identically —
            // it buys zero pixels. What it does cost is real: it promotes the
            // card to a composited layer, which drops text from subpixel to
            // grayscale antialiasing (measured: 20.6% chromatic pixels → 0%)
            // and pushes hover frames over budget (p95 33ms → 17ms without).
            // The translucency alone carries the glass. Re-add it only if
            // textured background artwork ever lands behind the cards.
            "border border-white/65 bg-paper/55",
            "ring-1 ring-inset ring-forest/[0.06]",
            CARD_SHADOW,
            "transition-all duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            // Hover: 10px lift, 2% scale, rim brightens, glass thickens, shadow
            // expands. Gating the transforms behind motion-safe rather than
            // overriding them in motion-reduce leaves no specificity race.
            "group-hover:border-white/90 group-hover:bg-paper/[0.72] group-hover:ring-forest/[0.14]",
            CARD_SHADOW_HOVER,
            "motion-safe:group-hover:-translate-y-[10px] motion-safe:group-hover:scale-[1.02]",
            // Touch devices never fire :hover, so the press is the feedback.
            "group-active:border-white/90 group-active:bg-paper/[0.72]",
            "motion-safe:group-active:scale-[0.99] group-active:duration-150",
            "motion-reduce:transition-none",
          ].join(" ")}
        >
          {/* Soft reflection raking across the glass from the top-left. Sits
              below the content via -z-10 inside the article's own stacking
              context. Static gradient, opacity-only on hover. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(148deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.14)_26%,transparent_52%)] opacity-70 transition-opacity duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
          />

          {/* Hairline of brand colour that surfaces on hover — quiet accent,
              never a glow. Purely decorative. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-forest/30 to-transparent opacity-0 transition-opacity duration-[320ms] group-hover:opacity-100"
          />

          {/* Icon: a 36px soft-rounded square with a hairline outline and a 4%
              accent wash — a quiet container, not a chip. 16px glyph at a 1.5
              stroke keeps it far below the number in visual weight. Entrance is
              a plain delayed fade; only hover moves it (3px + 1.03). */}
          <m.span
            aria-hidden="true"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.28 + index * 0.08 }}
            className="mb-6 inline-flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-[0.625rem] border border-forest/10 bg-forest/[0.04] text-forest/85 transition-all duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-forest/20 group-hover:bg-forest/[0.07] group-hover:text-forest motion-safe:group-hover:-translate-y-[3px] motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none"
          >
            <Icon className="h-4 w-4 stroke-[1.5]" />
          </m.span>

          {/* The hero. Full-width block + tabular figures: the box never resizes
              while the digits climb, so the count-up cannot shift layout. Hover
              gives it a 1px lift — emphasis without touching the counter. */}
          <span
            ref={ref}
            className="block font-display text-[clamp(2.75rem,5.5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-ink tabular-nums transition-transform duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:-translate-y-px motion-reduce:transition-none"
            aria-hidden="true"
          >
            {value}
          </span>

          {/* Decorative rule. Extends via scaleX — a width transition here
              would reflow the card on every hover. */}
          <span
            aria-hidden="true"
            className="mt-5 block h-px w-10 origin-left bg-forest/25 transition-all duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-forest/50 motion-safe:group-hover:scale-x-[1.6] motion-reduce:transition-none"
          />

          <p className="mt-3.5 text-[0.95rem] leading-relaxed text-muted text-pretty">
            {label}
          </p>
        </article>
      </m.div>
    </div>
  );
}

export function StatsSection() {
  const homeStats = proofStats.slice(0, 3);

  return (
    // Section shell, wash and spacing are unchanged: the existing full-width
    // gradient-stat-wash still spans this section edge to edge and stops at the
    // hairline borders, so adjacent sections are untouched.
    <section
      id="stats"
      aria-label="Company impact metrics"
      className="gradient-stat-wash relative overflow-hidden border-y border-line"
    >
      {/* A soft pool of light from the top edge that fades in gently as the
          section arrives — the background's own entrance. Layered over the
          existing wash rather than replacing it, so the wash never flashes in
          from nothing on a below-the-fold section. Purely decorative. */}
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={SECTION_SHEEN}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-6 py-16 sm:px-8 sm:py-24 lg:py-28">
        <div
          className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3"
          role="list"
        >
          {homeStats.map((stat, i) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={STAT_ICONS[i] ?? Building2}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

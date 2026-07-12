import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { whatWeBuild } from "@/content/sections";
import { cn } from "@/lib/utils";

/* Per-pillar accent for the floating index chip — forest / teal / amber
   rotate across the three so the row carries colour beyond green. */
const accentBg: Record<string, string> = {
  forest: "bg-forest",
  teal: "bg-teal",
  amber: "bg-amber",
};

/* What we build — three image-led pillars. Each leads with a real photograph
   (an Infosys-style showcase card) rather than an icon-and-text box. Distinct
   from Products (side-by-side) and Work (overlay scrim): here the image sits
   on top and the copy reads below. Mist band for rhythm. */
export function WhatWeBuild() {
  return (
    <Section id="what-we-build" tone="mist">
      <div className="max-w-3xl">
        <p className="eyebrow">{whatWeBuild.eyebrow}</p>
        <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
          {whatWeBuild.heading}
        </h2>
        <p className="mt-6 text-[length:var(--text-lead)] leading-relaxed text-body">
          {whatWeBuild.intro}
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {whatWeBuild.pillars.map((pillar, i) => (
          <article
            key={pillar.title}
            className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={pillar.image}
                alt={pillar.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <span
                className={cn(
                  "absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full font-display text-sm font-bold tabular-nums text-white shadow-card",
                  accentBg[pillar.accent],
                )}
                aria-hidden="true"
              >
                {i + 1}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-7">
              <h3 className="font-display text-xl font-semibold text-ink">
                {pillar.title}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-body">
                {pillar.body}
              </p>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-10 max-w-2xl font-display text-xl font-medium text-ink md:text-2xl">
        {whatWeBuild.closer}
      </p>
    </Section>
  );
}

import { Boxes, Cpu, Layers } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { whatWeBuild, type Pillar } from "@/content/sections";

const icons: Record<Pillar["icon"], React.ElementType> = {
  system: Boxes,
  ai: Cpu,
  saas: Layers,
};

/* Section 4 — What we build. Three pillars on dark forest. */
export function WhatWeBuild() {
  return (
    <Section id="what-we-build" tone="forest">
      <div className="max-w-2xl">
        <Eyebrow>{whatWeBuild.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-cream md:text-[2.75rem]">
          {whatWeBuild.heading}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-cream/70">
          {whatWeBuild.intro}
        </p>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
        {whatWeBuild.pillars.map((pillar, i) => {
          const Icon = icons[pillar.icon];
          return (
            <article
              key={pillar.title}
              className="group flex flex-col gap-4 bg-forest p-8 transition-colors duration-300 hover:bg-forest-2 md:p-9"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/12 text-gold ring-1 ring-gold/25">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <span className="font-display text-sm font-medium tabular-nums text-cream/30">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold text-cream">
                {pillar.title}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-cream/65">
                {pillar.body}
              </p>
            </article>
          );
        })}
      </div>

      <p className="mt-12 text-center font-display text-xl font-medium text-cream/90 md:text-2xl">
        {whatWeBuild.closer}
      </p>
    </Section>
  );
}

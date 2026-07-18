import { HeartPulse, Clock4, GraduationCap, Wallet, Laptop, PartyPopper } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/motion";
import { culture } from "@/content/sections";
import { benefits } from "@/content/careers";

const benefitIcons: Record<string, React.ElementType> = {
  health: HeartPulse,
  flexibility: Clock4,
  growth: GraduationCap,
  compensation: Wallet,
  tools: Laptop,
  culture: PartyPopper,
};

/* The page's signature moment: philosophy and perks presented as one spec
   sheet for the job, facing each other across a hairline divider, rather than
   two more stacked card grids. Left column reuses the same culture pillars as
   the About page (shared content, per content/careers.ts); right column
   reuses the existing benefits list — no new copy invented, just recomposed
   into an asymmetric editorial split. */
export function LifeAtWnR() {
  return (
    <Section id="life-at-wnr" tone="wash">
      <div className="max-w-2xl">
        <Eyebrow>Life at WnR</Eyebrow>
        <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
          Philosophy over personalities. Perks that back it up.
        </h2>
        <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-body">
          {culture.intro}
        </p>
      </div>

      <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-14 md:gap-y-0">
        <Reveal className="flex flex-col md:border-r md:border-line-strong md:pr-14">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            How We Work
          </h3>
          <ul className="mt-6 flex flex-col gap-8">
            {culture.pillars.map((pillar) => (
              <li key={pillar.title} className="flex flex-col gap-2">
                <span className="h-1 w-10 rounded-full bg-forest" aria-hidden="true" />
                <h4 className="font-display text-lg font-semibold text-ink">{pillar.title}</h4>
                <p className="text-[0.95rem] leading-relaxed text-body">{pillar.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {benefits.heading}
          </h3>
          <dl className="mt-6 flex flex-col gap-6">
            {benefits.items.map((benefit) => {
              const Icon = benefitIcons[benefit.icon];
              return (
                <div key={benefit.title} className="flex items-start gap-4">
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest text-white">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <div>
                    <dt className="font-display text-base font-semibold text-ink">
                      {benefit.title}
                    </dt>
                    <dd className="mt-1 text-[0.9rem] leading-relaxed text-body">{benefit.body}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

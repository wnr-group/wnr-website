import { ArrowRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { culture } from "@/content/sections";

/* Section 13 — Inside WnR. Editorial, dark, no faces — philosophy not
   personalities. Three culture pillars as text cards with gold rules. */
export function InsideWnr() {
  return (
    <Section id="inside" tone="forest-deep">
      <div className="max-w-2xl">
        <Eyebrow>{culture.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-cream md:text-[2.75rem]">
          {culture.heading}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-cream/70">{culture.intro}</p>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
        {culture.pillars.map((p) => (
          <article key={p.title} className="flex flex-col gap-4 bg-forest-deep p-8">
            <span className="h-0.5 w-10 bg-gold" aria-hidden="true" />
            <h3 className="font-display text-xl font-semibold text-cream">
              {p.title}
            </h3>
            <p className="text-[0.95rem] leading-relaxed text-cream/65">{p.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-xl font-medium text-cream/90">
          {culture.recruitCta}
        </p>
        <Cta href="/careers" variant="secondary-dark">
          View Careers
          <ArrowRight size={16} />
        </Cta>
      </div>
    </Section>
  );
}

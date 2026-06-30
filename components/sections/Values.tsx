import { Handshake, Users, ShieldCheck, Sparkles } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { values, type ValueCard } from "@/content/sections";

const icons: Record<ValueCard["icon"], React.ElementType> = {
  partnership: Handshake,
  people: Users,
  privacy: ShieldCheck,
  ai: Sparkles,
};

/* Our principles (landing brief "Why us"). Editorial two-column list on cream —
   not an icon-card grid. */
export function Values() {
  return (
    <Section id="values" tone="gold-soft">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="max-w-sm">
          <Eyebrow>What We Stand For</Eyebrow>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-forest md:text-4xl">
            The relationship begins where most engagements end.
          </h2>
        </div>

        <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {values.map((v) => {
            const Icon = icons[v.icon];
            return (
              <div key={v.title} className="flex flex-col gap-3">
                <dt className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-gold">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className="font-display text-lg font-semibold text-forest">
                    {v.title}
                  </span>
                </dt>
                <dd className="text-[0.95rem] leading-relaxed text-muted">
                  {v.body}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </Section>
  );
}

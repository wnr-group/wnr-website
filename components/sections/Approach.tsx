import { ChevronRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { approach } from "@/content/sections";

/* Section 5 — Our approach. Horizontal four-step flow with gold connectors on
   desktop; vertical timeline on mobile. */
export function Approach() {
  return (
    <Section id="approach" tone="cream">
      <div className="max-w-2xl">
        <Eyebrow>{approach.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-forest md:text-[2.75rem]">
          {approach.heading}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-muted">{approach.intro}</p>
      </div>

      <ol className="mt-14 grid gap-x-6 gap-y-10 md:grid-cols-4">
        {approach.steps.map((step, i) => (
          <li key={step.num} className="relative flex flex-col gap-3">
            {/* connector */}
            {i < approach.steps.length - 1 && (
              <ChevronRight
                size={22}
                className="absolute -right-4 top-2 hidden text-gold/50 md:block"
                aria-hidden="true"
              />
            )}
            <span className="font-display text-sm font-bold tabular-nums text-gold">
              {step.num}
            </span>
            <span className="h-px w-full bg-hairline" aria-hidden="true" />
            <h3 className="font-display text-xl font-semibold text-forest">
              {step.title}
            </h3>
            <p className="text-[0.95rem] leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

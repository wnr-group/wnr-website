import { Rocket, Target, Users2 } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { whyWorkWithUs } from "@/content/careers";

const icons: Record<string, React.ElementType> = {
  growth: Rocket,
  impact: Target,
  team: Users2,
};

export function WhyWorkWithUs() {
  return (
    <Section id="why-work-with-us" tone="canvas">
      <div className="max-w-2xl">
        <Eyebrow>{whyWorkWithUs.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
          {whyWorkWithUs.heading}
        </h2>
        <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-body">
          {whyWorkWithUs.intro}
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {whyWorkWithUs.reasons.map((reason) => {
          const Icon = icons[reason.icon];
          return (
            <article
              key={reason.title}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-8"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-forest-wash text-forest">
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">{reason.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-body">{reason.body}</p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

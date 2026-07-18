import { Rocket, Target, Users2 } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/motion";
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

      <Stagger className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.12}>
        {whyWorkWithUs.reasons.map((reason, index) => {
          const Icon = icons[reason.icon];
          return (
            <StaggerItem key={reason.title}>
              <article className="group flex h-full flex-col gap-4 rounded-2xl border border-line bg-paper p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-card">
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-forest-wash text-forest transition-colors duration-300 group-hover:bg-forest group-hover:text-white">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <span
                    className="font-display text-3xl font-bold tabular-nums text-forest/20"
                    aria-hidden="true"
                  >
                    0{index + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-ink">{reason.title}</h3>
                <p className="text-[0.95rem] leading-relaxed text-body">{reason.body}</p>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}

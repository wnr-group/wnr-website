import { HeartPulse, Clock4, GraduationCap, Wallet, Laptop, PartyPopper } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { benefits } from "@/content/careers";

const icons: Record<string, React.ElementType> = {
  health: HeartPulse,
  flexibility: Clock4,
  growth: GraduationCap,
  compensation: Wallet,
  tools: Laptop,
  culture: PartyPopper,
};

export function Benefits() {
  return (
    <Section id="benefits" tone="wash">
      <div className="max-w-2xl">
        <Eyebrow>{benefits.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
          {benefits.heading}
        </h2>
      </div>

      <dl className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.items.map((benefit) => {
          const Icon = icons[benefit.icon];
          return (
            <div key={benefit.title} className="flex flex-col gap-3">
              <dt className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-white">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span className="font-display text-base font-semibold text-ink">{benefit.title}</span>
              </dt>
              <dd className="text-[0.9rem] leading-relaxed text-body">{benefit.body}</dd>
            </div>
          );
        })}
      </dl>
    </Section>
  );
}

import { Section, Eyebrow } from "@/components/ui/Section";
import { hiringProcess } from "@/content/careers";

export function HiringProcess() {
  return (
    <Section id="hiring-process" tone="mist">
      <div className="max-w-2xl">
        <Eyebrow>{hiringProcess.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
          {hiringProcess.heading}
        </h2>
        <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-body">
          {hiringProcess.intro}
        </p>
      </div>

      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {hiringProcess.steps.map((step) => (
          <li key={step.num} className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-7">
            <span
              className="font-display text-3xl font-bold tabular-nums text-forest/25"
              aria-hidden="true"
            >
              {step.num}
            </span>
            <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
            <p className="text-[0.9rem] leading-relaxed text-body">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

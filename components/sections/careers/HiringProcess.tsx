import { Section, Eyebrow } from "@/components/ui/Section";
import { hiringProcess } from "@/content/careers";

/* Numbered timeline — justified here (unlike the reasons/benefits grids)
   because these steps are a literal ordered sequence a candidate moves
   through. Mirrors the horizontal-flow-with-connectors pattern already
   established in components/sections/Approach.tsx: a vertical stepper below
   lg, a connected horizontal flow with gold nodes at lg and up. */
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

      {/* Vertical stepper — below lg */}
      <ol className="mt-12 flex flex-col lg:hidden">
        {hiringProcess.steps.map((step, i) => (
          <li
            key={step.num}
            className={`group relative flex gap-5 pb-8 last:pb-0 ${
              i < hiringProcess.steps.length - 1
                ? "before:absolute before:left-[1.1875rem] before:top-10 before:h-[calc(100%-1.75rem)] before:w-px before:bg-line-strong"
                : ""
            }`}
          >
            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper font-display text-sm font-bold tabular-nums text-gold-ink ring-2 ring-gold/60 transition-all duration-300 group-hover:bg-gold group-hover:text-white group-hover:ring-gold">
              {step.num}
            </span>
            <div className="pt-1">
              <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Horizontal connected flow with gold nodes — lg and up */}
      <ol className="relative mt-16 hidden lg:grid lg:grid-cols-4 lg:gap-8">
        {hiringProcess.steps.map((step, i) => (
          <li key={step.num} className="group relative flex flex-col">
            {i < hiringProcess.steps.length - 1 && (
              <div
                className="absolute left-12 top-6 flex h-[2px] w-[calc(100%-3rem)] items-center justify-end bg-gold pr-1"
                aria-hidden="true"
              >
                <span className="h-2 w-2 translate-x-1 rotate-45 transform border-r-2 border-t-2 border-gold" />
              </div>
            )}
            <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper font-display text-sm font-bold tabular-nums text-gold-ink shadow-sm ring-2 ring-gold/60 transition-all duration-300 group-hover:bg-gold group-hover:text-white group-hover:ring-gold">
              {step.num}
            </span>
            <div className="pt-6">
              <h3 className="font-display text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

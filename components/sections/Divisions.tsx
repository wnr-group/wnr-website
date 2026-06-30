import { Section, Eyebrow } from "@/components/ui/Section";
import { arms, divisions } from "@/content/arms";

/* Section 8 — Our divisions. Architecture diagram: WnR Group → three arms →
   products as the output. Mirrors the capabilities deck. */
export function Divisions() {
  return (
    <Section id="divisions" tone="cream">
      <div className="max-w-2xl">
        <Eyebrow>{divisions.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-forest md:text-[2.75rem]">
          {divisions.heading}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-muted">{divisions.intro}</p>
      </div>

      {/* parent */}
      <div className="mt-14 flex flex-col items-center">
        <span className="rounded-full bg-forest px-6 py-2.5 font-display text-sm font-semibold tracking-wide text-cream">
          WnR Group
        </span>
        <span className="my-5 h-8 w-px bg-hairline" aria-hidden="true" />

        {/* three arms */}
        <div className="grid w-full gap-5 md:grid-cols-3">
          {arms.map((arm) => (
            <article
              key={arm.slug}
              className="flex flex-col gap-3 rounded-2xl border border-hairline bg-paper p-7 transition-shadow duration-300 hover:shadow-[0_24px_50px_-30px_rgba(14,59,46,0.35)]"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-gold" />
                <h3 className="font-display text-lg font-semibold text-forest">
                  {arm.name}
                </h3>
              </div>
              <p className="text-[0.95rem] leading-relaxed text-muted">
                {arm.description}
              </p>
            </article>
          ))}
        </div>

        <span className="my-5 h-8 w-px bg-hairline" aria-hidden="true" />

        {/* output: products */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Output
          </span>
          {["EduOS", "ArenaOS"].map((p) => (
            <span
              key={p}
              className="rounded-lg border border-gold/40 bg-gold-soft px-4 py-2 font-display text-sm font-semibold text-forest"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

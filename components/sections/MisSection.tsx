import { Section, Eyebrow } from "@/components/ui/Section";
import { MisDashboard } from "@/components/ui/MisDashboard";

/* Section 6 — The MIS dashboard centrepiece. Full forest-deep band. */
export function MisSection() {
  return (
    <Section id="mis" tone="forest-deep">
      <div className="mx-auto max-w-2xl text-center">
        <div className="flex justify-center">
          <Eyebrow>Operational Intelligence, Live</Eyebrow>
        </div>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-cream md:text-[2.75rem]">
          This is what clarity looks like.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-cream/70">
          Every system we build rolls up into one real-time view — revenue,
          operations, adoption, and performance in a single source of truth. No
          more guessing. No more scattered reports.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-3xl">
        <MisDashboard />
        <p className="mt-5 text-center text-xs text-cream/40">
          Representative, aggregated data shown for demonstration. We never
          expose identifiable client information.
        </p>
      </div>
    </Section>
  );
}

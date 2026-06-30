import { Section, Eyebrow } from "@/components/ui/Section";
import { technology } from "@/content/sections";

/* Section 12 — Technology. Compact reassurance: four quiet rows of stack
   layers. Understated, not the main act. */
export function Technology() {
  return (
    <Section id="technology" tone="cream" className="md:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="max-w-md">
          <Eyebrow>{technology.eyebrow}</Eyebrow>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-forest md:text-4xl">
            {technology.heading}
          </h2>
          <p className="mt-5 leading-relaxed text-muted">{technology.body}</p>
        </div>

        <dl className="divide-y divide-hairline border-y border-hairline">
          {technology.layers.map((layer) => (
            <div
              key={layer.label}
              className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-gold">
                {layer.label}
              </dt>
              <dd className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-medium text-forest sm:justify-end">
                {layer.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

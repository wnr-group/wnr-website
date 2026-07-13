import { Section, Eyebrow } from "@/components/ui/Section";
import { culture } from "@/content/sections";

export function Culture() {
  return (
    <Section id="culture" tone="canvas">
      <Eyebrow>Culture</Eyebrow>
      <h2 className="mt-5 max-w-2xl font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
        Philosophy over personalities.
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {culture.pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-8"
          >
            <span className="h-1 w-10 rounded-full bg-forest" aria-hidden="true" />
            <h3 className="font-display text-xl font-semibold text-ink">{pillar.title}</h3>
            <p className="text-[0.95rem] leading-relaxed text-body">{pillar.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

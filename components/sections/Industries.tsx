import { Section } from "@/components/ui/Section";
import { industries } from "@/content/sections";

/* Industries — an oversized editorial index rather than an icon-card grid.
   Sector names read as large type in a flowing wrap, each numbered and
   underlined on hover. Header sits inline with the footnote across the top. */
export function Industries() {
  return (
    <Section id="industries" tone="canvas">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow">{industries.eyebrow}</p>
          <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
            {industries.heading}
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted">
          {industries.footnote}
        </p>
      </div>

      <ul className="mt-14 flex flex-wrap items-baseline gap-x-8 gap-y-5 md:gap-x-12">
        {industries.list.map((name, i) => (
          <li key={name} className="group flex items-baseline gap-2.5">
            <span className="font-display text-xs font-bold tabular-nums text-forest/45">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink decoration-forest decoration-2 underline-offset-[6px] transition-colors group-hover:text-forest group-hover:underline md:text-[2rem]">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

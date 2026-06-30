import { ArrowUpRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { work } from "@/content/sections";

/* Section 11 — Selected work. Three case cards with a bold gold result line. */
export function Work() {
  return (
    <Section id="work" tone="gold-soft">
      <div className="max-w-2xl">
        <Eyebrow>{work.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-forest md:text-[2.75rem]">
          {work.heading}
        </h2>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {work.cases.map((c) => (
          <article
            key={c.title}
            className="group flex flex-col gap-4 rounded-2xl border border-hairline bg-paper p-7 transition-shadow duration-300 hover:shadow-[0_30px_60px_-34px_rgba(14,59,46,0.4)]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-forest">
                {c.tag}
              </span>
              <ArrowUpRight
                size={18}
                className="text-muted transition-colors group-hover:text-gold"
              />
            </div>
            <h3 className="font-display text-lg font-semibold leading-snug text-forest">
              {c.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">{c.body}</p>
            <p className="mt-auto border-t border-hairline pt-4 text-sm font-semibold text-forest">
              <span className="text-gold">Result · </span>
              {c.result}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}

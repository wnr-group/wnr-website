import { Section, Eyebrow } from "@/components/ui/Section";
import { company } from "@/content/company";

const sectors = [
  "Schools",
  "Gaming",
  "Healthcare",
  "Retail",
  "Manufacturing",
  "Hospitality",
  "Construction",
  "more to come",
];

/* Section 14 — Vision. Dark, expansive — the emotional high point before the
   close. Mission / vision / core belief, with sectors connecting into a
   portfolio. */
export function Vision() {
  return (
    <Section id="vision" tone="forest">
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <Eyebrow>Where We&rsquo;re Going</Eyebrow>
        </div>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-cream md:text-5xl">
          Building a vertical SaaS{" "}
          <span className="text-gold">holding company.</span>
        </h2>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
        {[
          { label: "Mission", body: company.mission },
          { label: "Vision", body: company.vision },
          { label: "Core Belief", body: company.coreBelief },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-forest-2/30 p-7 text-left"
          >
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-gold">
              {item.label}
            </span>
            <p className="text-[0.95rem] leading-relaxed text-cream/75">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      {/* sectors connecting into the portfolio */}
      <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
        {sectors.map((s, i) => (
          <span
            key={s}
            className={
              i === sectors.length - 1
                ? "rounded-full px-4 py-2 text-sm italic text-cream/45"
                : "rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-sm font-medium text-cream/85"
            }
          >
            {s}
          </span>
        ))}
      </div>
    </Section>
  );
}

import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { whyUs } from "@/content/sections";

/* Why WnR is different — a transformation ledger, not a two-column split.
   Each row reads left-to-right as "the old way → the WnR way": the vendor
   habit recedes (muted, struck through) and resolves into what we do instead
   (ink, bold). One flowing column, generous, editorial. */
export function WhyUs() {
  return (
    <Section id="why-us" tone="canvas">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{whyUs.eyebrow}</p>
          <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
            Most companies build and leave.{" "}
            <span className="text-forest">We build and stay.</span>
          </h2>
          <p className="mt-6 max-w-md text-[length:var(--text-lead)] leading-relaxed text-body">
            {whyUs.subhead}
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {whyUs.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-[0.8rem] font-medium text-body"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <ul className="flex flex-col">
          {whyUs.contrast.map((row) => (
            <li
              key={row.us}
              className="grid grid-cols-1 items-baseline gap-1 border-t border-line py-5 first:border-t-0 first:pt-0 sm:grid-cols-[1fr_auto_1.1fr] sm:gap-5"
            >
              <span className="text-[0.95rem] text-muted line-through decoration-line-strong decoration-1">
                {row.them}
              </span>
              <ArrowRight
                size={16}
                className="hidden shrink-0 text-forest/50 sm:block"
                aria-hidden="true"
              />
              <span className="font-display text-[1.05rem] font-semibold leading-snug text-ink">
                {row.us}
              </span>
            </li>
          ))}
          <li className="mt-6 flex items-center gap-3 rounded-2xl bg-forest-wash px-5 py-4">
            <span className="text-sm text-muted line-through">
              {whyUs.themLabel}
            </span>
            <ArrowRight size={16} className="shrink-0 text-forest" aria-hidden="true" />
            <span className="font-display text-base font-semibold text-forest">
              {whyUs.usLabel}
            </span>
          </li>
        </ul>
      </div>
    </Section>
  );
}

import { Check, X } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { whyUs } from "@/content/sections";

/* Section 7 — Why WnR is different. The sharpest contrast on the site:
   two columns, visually unequal — the WnR side richer and gold-tinted. */
export function WhyUs() {
  return (
    <Section id="why-us" tone="forest">
      <div className="max-w-2xl">
        <Eyebrow>{whyUs.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-cream md:text-[2.75rem]">
          Most companies build and leave.{" "}
          <span className="text-gold">We build and stay.</span>
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-cream/70">{whyUs.subhead}</p>
      </div>

      {/* contrast table */}
      <div className="mt-14 grid gap-5 lg:grid-cols-2 lg:gap-6">
        {/* Them — muted, recessed */}
        <div className="rounded-2xl border border-white/10 bg-forest-deep/40 p-7 md:p-8">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-cream/45">
            Most agencies
          </h3>
          <ul className="mt-6 flex flex-col gap-4">
            {whyUs.contrast.map((row) => (
              <li key={row.them} className="flex items-start gap-3 text-cream/55">
                <X size={18} className="mt-0.5 shrink-0 text-cream/25" />
                <span className="text-[0.95rem]">{row.them}</span>
              </li>
            ))}
          </ul>
          <p className="mt-7 border-t border-white/10 pt-5 font-display text-lg font-medium text-cream/50">
            {whyUs.themLabel}
          </p>
        </div>

        {/* Us — richer, gold-tinted, alive */}
        <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-forest-2 to-forest p-7 shadow-[0_30px_70px_-30px_rgba(201,162,75,0.35)] md:p-8">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
          <h3 className="relative font-display text-sm font-semibold uppercase tracking-wide text-gold">
            WnR
          </h3>
          <ul className="relative mt-6 flex flex-col gap-4">
            {whyUs.contrast.map((row) => (
              <li key={row.us} className="flex items-start gap-3 text-cream">
                <Check size={18} className="mt-0.5 shrink-0 text-gold" />
                <span className="text-[0.95rem] font-medium">{row.us}</span>
              </li>
            ))}
          </ul>
          <p className="relative mt-7 border-t border-gold/20 pt-5 font-display text-lg font-semibold text-gold">
            {whyUs.usLabel}
          </p>
        </div>
      </div>

      {/* proof chips */}
      <ul className="mt-10 flex flex-wrap gap-2.5">
        {whyUs.chips.map((chip) => (
          <li
            key={chip}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-cream/75"
          >
            {chip}
          </li>
        ))}
      </ul>
    </Section>
  );
}

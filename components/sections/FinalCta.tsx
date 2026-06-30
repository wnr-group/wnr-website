import { ArrowRight } from "lucide-react";
import { Cta } from "@/components/ui/Cta";
import { finalCta } from "@/content/sections";
import { company as co } from "@/content/company";

/* Section 15 — Final CTA. Full forest-deep band: one headline, one line, one
   gold button. Nothing competing. */
export function FinalCta() {
  return (
    <section className="bg-forest-deep px-5 py-24 text-center sm:px-6 md:py-32">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-3xl font-bold leading-tight text-cream md:text-5xl">
          {finalCta.heading}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream/70">
          {finalCta.body}
        </p>
        <div className="mt-10 flex justify-center">
          <Cta href="/contact" variant="primary" className="px-8 py-4 text-base">
            {finalCta.ctaLabel}
            <ArrowRight size={18} />
          </Cta>
        </div>
        <p className="mt-10 text-sm text-cream/40">
          {co.name} · <span className="text-gold/70">{co.geography}</span> ·{" "}
          {co.tagline}
        </p>
      </div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import { Cta } from "@/components/ui/Cta";
import { OperationalBrain } from "@/components/ui/OperationalBrain";
import { company } from "@/content/company";

export function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden bg-forest pt-18 text-cream">
      {/* departments-connecting motion, behind the text, low-contrast */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.55]" aria-hidden="true">
        <OperationalBrain />
      </div>
      {/* warm vignette so text always wins */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(120% 90% at 15% 30%, rgba(10,44,34,0.35) 0%, rgba(14,59,46,0.85) 55%, #0e3b2e 100%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-6 md:py-28">
        <div className="max-w-3xl">
          <span className="flex items-center gap-3 text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-gold">
            <span className="h-px w-8 bg-gold" />
            {company.tagline}
          </span>

          <h1 className="mt-6 font-display text-[2.75rem] font-bold leading-[1.05] tracking-tight text-cream sm:text-6xl md:text-7xl">
            Operational intelligence
            <br />
            for{" "}
            <span className="italic text-gold">modern business.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-cream/75 md:text-xl">
            {company.heroBody}
          </p>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Cta href="/contact" variant="primary" className="px-7 py-3.5 text-base">
              Build Your System
            </Cta>
            <Cta href="/#products" variant="ghost" className="group text-base">
              See What We&rsquo;ve Built
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Cta>
          </div>
        </div>
      </div>

      {/* bottom fade into the proof bar */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-cream/0" />
    </section>
  );
}

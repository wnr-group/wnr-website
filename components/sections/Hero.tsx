import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Cta } from "@/components/ui/Cta";
import { company, proofStats } from "@/content/company";
import { media } from "@/content/media";

/* Hero — headline-forward, with a real photograph anchoring the right.
   The photo overlaps a soft forest plate and carries a small floating proof
   chip, so it reads as an editorial composition, not a boxed illustration. */
export function Hero() {
  const img = media.hero;

  return (
    <section
      data-hero-variant="A"
      className="relative overflow-hidden bg-canvas pt-20"
    >
      <div
        className="grid-blueprint pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 pb-4 pt-6 sm:px-6 md:pb-6 md:pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
        {/* Copy */}
        <div className="max-w-2xl">
          <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-forest">
            <span className="h-1.5 w-1.5 rounded-full bg-forest-bright" />
            {company.tagline} · {company.geography}
          </span>

          <h1
            className="animate-rise mt-6 font-display text-[length:var(--text-hero)] font-bold leading-[1.03] text-ink"
            style={{ animationDelay: "60ms" }}
          >
            The operational brain
            <br />
            of your <span className="text-forest">business.</span>
          </h1>

          <p
            className="animate-rise mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-body"
            style={{ animationDelay: "120ms" }}
          >
            {company.heroBody}
          </p>

          <div
            className="animate-rise mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "180ms" }}
          >
            <Cta href="/contact" variant="primary" className="px-7 py-3.5 text-base">
              Build Your System
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Cta>
            <Cta href="/products" variant="outline" className="px-6 py-3.5 text-base">
              See What We&rsquo;ve Built
            </Cta>
          </div>

          <dl
            className="animate-rise mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-7"
            style={{ animationDelay: "240ms" }}
          >
            {proofStats.slice(0, 3).map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 mt-1 max-w-[10rem] text-xs leading-snug text-muted">
                  {s.label}
                </dt>
                <dd className="order-1 font-display text-3xl font-bold tracking-tight text-ink">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual — real photograph on a forest plate */}
        <div className="animate-fade relative" style={{ animationDelay: "160ms" }}>
          {/* offset forest plate behind the photo */}
          <div
            className="absolute -bottom-4 -right-3 -top-4 left-8 rounded-[2rem] bg-forest/8"
            aria-hidden="true"
          />
          {img && (
            <div className="relative overflow-hidden rounded-[1.75rem] shadow-card-hover ring-1 ring-line">
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* floating proof chip */}
          <div className="absolute -bottom-5 left-2 flex items-center gap-3 rounded-2xl border border-line bg-paper/95 px-4 py-3 shadow-card backdrop-blur sm:left-4">
            <span className="font-display text-2xl font-bold tracking-tight text-forest">
              {proofStats[0].value}
            </span>
            <span className="max-w-[8.5rem] text-xs leading-snug text-muted">
              {proofStats[0].label}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

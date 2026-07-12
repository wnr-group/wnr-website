"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Cta } from "@/components/ui/Cta";
import { company, proofStats } from "@/content/company";

/* Variant B — full-bleed brand-film hero. A light, on-brand abstract loop fills
   the hero; the headline + CTAs sit on a near-white scrim on the left so the
   copy stays crisp and the site stays white-dominant.

   The clip only loads/plays when B is the live variant (so A visitors never
   download it) and stays paused on the poster frame under prefers-reduced-motion. */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const isB = document.documentElement.getAttribute("data-hero") === "B";
    if (!isB) return; // A is live — leave the clip unloaded (preload="none")

    const v = videoRef.current;
    if (!v) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return; // honour the OS setting — poster frame stays

    v.play().catch(() => {
      /* Autoplay blocked — the poster frame remains, which is a fine fallback. */
    });
  }, []);

  return (
    <section
      data-hero-variant="B"
      className="relative flex min-h-[88vh] items-center overflow-hidden bg-canvas pt-24"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster="/brand/hero-loop-poster.webp"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/brand/hero-loop.mp4" type="video/mp4" />
      </video>

      {/* Legibility scrim — keeps the left near-white so dark ink text reads
          cleanly, then fades to reveal the green lattice on the right. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-canvas via-canvas/80 to-canvas/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-canvas to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-5 sm:px-6">
        <div className="max-w-2xl">
          <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-forest backdrop-blur">
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
      </div>
    </section>
  );
}

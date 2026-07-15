"use client";

import { useEffect, useRef } from "react";

/* Full-bleed video banner hero.
   The clip stays paused on the poster frame under prefers-reduced-motion. */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
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
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-canvas pt-24">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster="/brand/hero-loop-poster.webp"
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/brand/wnr-sfx.mp4" type="video/mp4" />
      </video>

      {/* Smooth transition into the next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-canvas to-transparent"
        aria-hidden="true"
      />

      {/* Floating CTA pill button centered near the bottom of the hero video */}
      <div className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 sm:bottom-16">
        <a
          href="#contact"
          onClick={(e) => {
            const el =
              document.getElementById("contact-form-card") ||
              document.getElementById("contact");
            if (el) {
              e.preventDefault();
              const prefersReduced = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
              ).matches;
              el.scrollIntoView({
                behavior: prefersReduced ? "auto" : "smooth",
                block: "center",
              });
            }
          }}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(18,71,52,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          aria-label="Smooth scroll to contact form section"
        >
          Let&rsquo;s talk
        </a>
      </div>
    </section>
  );
}


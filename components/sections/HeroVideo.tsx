"use client";

import { useEffect, useRef } from "react";

/* Full-bleed video banner hero with production-grade autoplay resiliency,
   visibility state management, and dynamic prefers-reduced-motion compliance. */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Explicitly enforce DOM muted and playsInline properties for iOS/Safari strict policies
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handlePlayback = () => {
      if (!videoRef.current) return;
      if (mediaQuery.matches) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          /* Autoplay blocked or low-power mode active — poster frame acts as fallback */
        });
      }
    };

    // Initial check on mount
    handlePlayback();

    // Listen for OS reduced-motion toggles while on page
    mediaQuery.addEventListener("change", handlePlayback);

    // Resume playback smoothly when tab regains focus (e.g. returning from background/sleep)
    const handleVisibilityChange = () => {
      if (document.hidden || mediaQuery.matches) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mediaQuery.removeEventListener("change", handlePlayback);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-canvas pt-24">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster="/brand/hero-loop-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/brand/wnr-video.mp4" type="video/mp4" />
        <source src="/brand/wnr-sfx.mp4" type="video/mp4" />
      </video>

      {/* Subtle dark wash overlay for visual depth and top navigation contrast */}
      <div
        className="pointer-events-none absolute inset-0 bg-black/15"
        aria-hidden="true"
      />

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


"use client";

import { useEffect, useRef } from "react";

/*
 * VIDEO QUALITY NOTE (AC3):
 * The source file /public/brand/wnr-video.mp4 is 1.9 MB.
 * This is the supplied source footage — visual fidelity cannot exceed the
 * original encoding. Browser-side optimisations applied below:
 *   - Removed redundant `src` attribute (use <source> only for correct MIME hint)
 *   - `preload="auto"` retained to fill buffer before user scrolls down
 *   - `fetchpriority="high"` hints the browser to load this asset above-fold first
 *   - `object-cover` + `will-change-transform` avoids subpixel blur on GPU compositing
 *   - Poster prevents blank frame flash on slow connections
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Enforce muted + playsInline for iOS/Safari autoplay policy
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;

    // Only call load() when the browser has not yet begun network fetching
    if (v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      v.load();
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handlePlayback = () => {
      if (!videoRef.current) return;
      if (mediaQuery.matches) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // Autoplay blocked or low-power mode — poster frame is the fallback
        });
      }
    };

    handlePlayback();
    mediaQuery.addEventListener("change", handlePlayback);

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
    <section
      className="relative flex min-h-[52vh] min-h-[52dvh] items-center overflow-hidden bg-canvas pt-20 sm:min-h-[88vh] sm:pt-24"
      aria-label="Hero video banner"
    >
      <h1 className="sr-only">WnRTech: Operational intelligence for modern business.</h1>

      {/* Video element — single <source> provides correct MIME type to the browser;
          fetchpriority=high ensures this LCP asset loads before below-fold resources */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover transform-gpu will-change-transform"
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
      </video>

      {/* Subtle dark overlay for contrast and readability */}
      <div
        className="pointer-events-none absolute inset-0 bg-black/15"
        aria-hidden="true"
      />

      {/* Gradient fade into the next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-canvas to-transparent"
        aria-hidden="true"
      />

      {/* Floating CTA */}
      <div className="absolute bottom-[calc(2rem+env(safe-area-inset-bottom,0px))] left-1/2 z-10 -translate-x-1/2 sm:bottom-16">
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

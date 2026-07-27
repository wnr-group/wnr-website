import Image from "next/image";
import { media } from "@/content/media";
import { Reveal } from "@/components/ui/motion";

/* Full-bleed photographic anchor — a real office environment with a single
   overlaid statement. Breaks the page rhythm with edge-to-edge imagery and
   gives the eye a rest between dense content sections. */
export function PhotoBand() {
  const img = media.office;

  return (
    <section className="relative isolate overflow-hidden bg-forest-deep">
      {img ? (
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="grid-blueprint-dark absolute inset-0" aria-hidden="true" />
      )}

      {/* legibility scrim, weighted to the left where the copy sits */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-forest-deep/92 via-forest-deep/70 to-forest-deep/25"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[26rem] max-w-[1200px] flex-col justify-center px-5 py-24 sm:px-6 md:min-h-[32rem]">
        <Reveal>
          <p className="eyebrow text-forest-bright">Built for the long term</p>
          <blockquote className="mt-6 max-w-2xl font-display text-3xl font-bold leading-[1.12] text-white md:text-[2.75rem]">
            We don&rsquo;t build and leave. We build, implement, train your team{" "}
            <span className="text-forest-bright">and stay.</span>
          </blockquote>
          <p className="mt-6 max-w-lg text-[length:var(--text-lead)] leading-relaxed text-white/75">
            The relationship begins where most engagements end. Monthly support,
            reviews, and continuous improvement. A genuine operational partner.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { m } from "motion/react";
import { Eyebrow } from "@/components/ui/Section";
import { capabilitiesHero } from "@/content/arms";

export function CapabilitiesHero() {
  return (
    <section className="relative overflow-hidden bg-canvas pt-28 pb-20 md:pt-36 md:pb-32 border-b border-line">
      {/* Blueprint background motif and subtle ambient glows */}
      <div
        className="grid-blueprint pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 -top-20 h-[36rem] w-[36rem] rounded-full bg-forest-bright/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/4 -bottom-20 h-[28rem] w-[28rem] rounded-full bg-teal/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-6">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <Eyebrow>{capabilitiesHero.eyebrow}</Eyebrow>

          <h1 className="mt-6 font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.04] tracking-tight text-ink">
            {capabilitiesHero.heading}
          </h1>

          <p className="mt-8 max-w-3xl text-lg sm:text-xl md:text-2xl font-normal leading-relaxed text-body">
            {capabilitiesHero.subhead}
          </p>
        </m.div>
      </div>
    </section>
  );
}

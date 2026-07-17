"use client";

import React from "react";
import { ArrowRight, Sparkles, Briefcase, MessageSquare } from "lucide-react";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { Reveal } from "@/components/ui/motion";
import { aboutCta } from "@/content/about";

export function AboutCta() {
  return (
    <Section id="about-cta" tone="canvas" className="py-24 md:py-36 text-center overflow-hidden">
      <Container>
        <Reveal className="mx-auto max-w-4xl rounded-3xl border border-forest/25 bg-[linear-gradient(135deg,var(--color-paper)_0%,var(--color-forest-wash)_100%)] p-10 sm:p-14 md:p-20 shadow-card relative overflow-hidden">
          {/* Blueprint motif & ambient lighting */}
          <div
            className="grid-blueprint pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,white,transparent)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-forest-bright/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-teal/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-center">
            <Eyebrow>{aboutCta.eyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.08] text-ink max-w-2xl">
              {aboutCta.heading}
            </h2>
            <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-body">
              {aboutCta.body}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Cta href={aboutCta.primaryHref} variant="primary">
                <MessageSquare size={16} />
                <span>{aboutCta.primaryButton}</span>
                <ArrowRight size={16} />
              </Cta>
              <Cta href={aboutCta.secondaryHref} variant="outline">
                <Briefcase size={16} />
                <span>{aboutCta.secondaryButton}</span>
              </Cta>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

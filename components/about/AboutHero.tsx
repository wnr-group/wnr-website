"use client";

import React from "react";
import { ArrowRight, Sparkles, Layers, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { Reveal } from "@/components/ui/motion";
import { aboutHero } from "@/content/about";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-canvas pt-28 pb-20 md:pt-36 md:pb-28 border-b border-line">
      {/* Blueprint background grid motif */}
      <div
        className="grid-blueprint pointer-events-none absolute inset-0 opacity-65 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
        aria-hidden="true"
      />
      {/* Subtle glowing ambient spheres */}
      <div
        className="pointer-events-none absolute -right-32 top-12 h-96 w-96 rounded-full bg-forest-bright/10 blur-3xl animate-pulse duration-[8000ms]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-teal/10 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <Reveal y={14} delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest-wash/80 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase text-forest backdrop-blur-sm mb-6">
              <Sparkles size={13} className="text-forest-bright" />
              <span>{aboutHero.eyebrow}</span>
            </div>
          </Reveal>

          <Reveal y={20} delay={0.2}>
            <h1 className="font-display text-[length:var(--text-hero)] font-bold leading-[1.04] text-ink tracking-tight">
              We build the <span className="text-forest">operational brain</span> of your business.
            </h1>
          </Reveal>

          <Reveal y={20} delay={0.3}>
            <p className="mt-7 max-w-3xl text-lg sm:text-xl md:text-[1.25rem] leading-relaxed text-body font-normal">
              {aboutHero.lead}
            </p>
          </Reveal>

          <Reveal y={20} delay={0.4}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Cta href="/contact" variant="primary">
                Work With Us
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Cta>
              <Cta href="/capabilities" variant="outline">
                Explore Our Capabilities
              </Cta>
            </div>
          </Reveal>

          {/* Quick trust metrics / badges below CTA */}
          <Reveal y={24} delay={0.5}>
            <div className="mt-16 pt-8 border-t border-line/80 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full max-w-3xl text-left">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-lg bg-forest/10 p-2 text-forest shrink-0">
                  <Layers size={18} />
                </div>
                <div>
                  <div className="font-display text-sm font-bold text-ink">AI-Native Systems</div>
                  <div className="text-xs text-muted mt-0.5">Purpose-built workflows & platforms</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-lg bg-teal/10 p-2 text-teal shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="font-display text-sm font-bold text-ink">Long-Term Partner</div>
                  <div className="text-xs text-muted mt-0.5">We stay until full adoption</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-lg bg-amber/10 p-2 text-amber shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="font-display text-sm font-bold text-ink">Vertical SaaS Depth</div>
                  <div className="text-xs text-muted mt-0.5">EduOS · ArenaOS · Industry OS</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

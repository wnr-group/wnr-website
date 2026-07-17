"use client";

import { ArrowRight, Users2, ListChecks, Briefcase } from "lucide-react";
import { Eyebrow, Container } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { Reveal } from "@/components/ui/motion";
import { careersHero, hiringProcess, openings } from "@/content/careers";

/* Bespoke editorial hero for Careers — mirrors the AboutHero / CapabilitiesHero
   treatment already established on this branch (blueprint grid, ambient glow,
   staggered reveals) instead of the generic PageHero every other interior page
   uses, so the recruiting narrative opens with the same premium register the
   rest of the redesign carries through. Stats below the fold are pulled from
   real page content (team size, hiring steps, live openings) rather than
   invented numbers. */
export function CareersHero() {
  const openingsCount = openings.length;

  return (
    <section className="relative overflow-hidden bg-canvas pt-28 pb-20 md:pt-36 md:pb-28 border-b border-line">
      <div
        className="grid-blueprint pointer-events-none absolute inset-0 opacity-65 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-8 h-96 w-96 rounded-full bg-forest-bright/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-teal/10 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        <div className="relative z-10 max-w-3xl">
          <Reveal y={14} delay={0.1}>
            <Eyebrow>{careersHero.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal y={20} delay={0.2}>
            <h1 className="mt-6 font-display text-[length:var(--text-hero)] font-bold leading-[1.05] tracking-tight text-ink">
              {careersHero.heading}
            </h1>
          </Reveal>

          <Reveal y={20} delay={0.3}>
            <p className="mt-6 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-body">
              {careersHero.lead}
            </p>
          </Reveal>

          <Reveal y={20} delay={0.4}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Cta href="#openings" variant="primary">
                {careersHero.ctaLabel}
                <ArrowRight size={16} />
              </Cta>
              <Cta href="#hiring-process" variant="outline">
                See How We Hire
              </Cta>
            </div>
          </Reveal>

          <Reveal y={24} delay={0.5}>
            <div className="mt-16 grid grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <span className="mt-1 rounded-lg bg-forest/10 p-2 text-forest">
                  <Users2 size={18} />
                </span>
                <div>
                  <div className="font-display text-sm font-bold text-ink">23+ Team Members</div>
                  <div className="mt-0.5 text-xs text-muted">Engineers, strategists, operators</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 rounded-lg bg-teal/10 p-2 text-teal">
                  <ListChecks size={18} />
                </span>
                <div>
                  <div className="font-display text-sm font-bold text-ink">
                    {hiringProcess.steps.length}-Step Process
                  </div>
                  <div className="mt-0.5 text-xs text-muted">No black box, no ghosting</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 rounded-lg bg-amber/10 p-2 text-amber">
                  <Briefcase size={18} />
                </span>
                <div>
                  <div className="font-display text-sm font-bold text-ink">
                    {openingsCount > 0 ? `${openingsCount} Open Roles` : "Always Hiring"}
                  </div>
                  <div className="mt-0.5 text-xs text-muted">Across three operating arms</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

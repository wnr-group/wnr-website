import type { Metadata } from "next";
import { CapabilitiesHero } from "@/components/capabilities/CapabilitiesHero";
import { CapabilitiesArchitecture } from "@/components/capabilities/CapabilitiesArchitecture";
import { CapabilitiesArmSection } from "@/components/capabilities/CapabilitiesArmSection";
import { CapabilitiesWorkflow } from "@/components/capabilities/CapabilitiesWorkflow";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { Reveal } from "@/components/ui/motion";
import { capabilitiesCta } from "@/content/arms";

export const metadata: Metadata = {
  title: "Capabilities — Consulting, Systems & AI Labs",
  description:
    "Three operating arms that take a business from operational strategy to live system to intelligent automation.",
};

export default function CapabilitiesPage() {
  return (
    <>
      {/* 1. Hero Section */}
      <CapabilitiesHero />

      {/* 2. Signature Architecture Visualization */}
      <CapabilitiesArchitecture />

      {/* 3–5. Three Operating Arms (Consulting -> Systems -> AI Labs) */}
      <CapabilitiesArmSection />

      {/* 6. How The Arms Work Together Workflow */}
      <CapabilitiesWorkflow />

      {/* 7. Executive CTA Envelope */}
      <Section id="capabilities-cta" tone="canvas" className="py-24 md:py-36 text-center border-t border-line overflow-hidden">
        <Container>
          <Reveal className="mx-auto max-w-4xl rounded-3xl border border-forest/25 bg-[linear-gradient(135deg,var(--color-paper)_0%,var(--color-forest-wash)_100%)] p-10 sm:p-14 md:p-20 shadow-card relative overflow-hidden">
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
              <Eyebrow>NEXT STEPS</Eyebrow>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.08] text-ink">
                {capabilitiesCta.title}
              </h2>
              <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-body">
                {capabilitiesCta.body}
              </p>
              <div className="mt-9">
                <Cta href="/contact" variant="primary">
                  {capabilitiesCta.button}
                </Cta>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

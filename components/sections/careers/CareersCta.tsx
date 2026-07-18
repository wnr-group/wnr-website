import { ArrowRight, Briefcase } from "lucide-react";
import { Section, Container } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { Reveal } from "@/components/ui/motion";
import { careersCta } from "@/content/careers";

export function CareersCta() {
  return (
    <Section tone="canvas" className="overflow-hidden py-24 text-center md:py-36">
      <Container>
        <Reveal className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-forest/25 bg-[linear-gradient(135deg,var(--color-paper)_0%,var(--color-forest-wash)_100%)] p-10 shadow-card sm:p-14 md:p-20">
          <div
            className="grid-blueprint pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,white,transparent)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-forest-bright/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-teal/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="max-w-2xl font-display text-3xl font-bold leading-[1.08] text-ink sm:text-4xl md:text-5xl">
              {careersCta.heading}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body sm:text-xl">
              {careersCta.body}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Cta href="/careers/apply" variant="primary">
                {careersCta.ctaLabel}
                <ArrowRight size={16} />
              </Cta>
              <Cta href="#openings" variant="outline">
                <Briefcase size={16} />
                <span>View Open Roles</span>
              </Cta>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

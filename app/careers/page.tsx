import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { culture } from "@/content/sections";
import { company, proofStats } from "@/content/company";

export const metadata: Metadata = {
  title: "Careers — Build What's Next",
  description:
    "Join a team obsessed with how businesses actually work. We're 25+ engineers, strategists, and operators building vertical operating systems.",
};

const openings = [
  { role: "Senior Full-Stack Engineer", team: "WnR Systems", location: "Tamil Nadu / Remote" },
  { role: "Operations Consultant", team: "WnR Consulting", location: "Tamil Nadu" },
  { role: "AI/ML Engineer", team: "WnR AI Labs", location: "Remote, India" },
  { role: "Product Designer", team: "WnR Systems", location: "Tamil Nadu / Remote" },
];

export default function CareersPage() {
  return (
    <>
      <PageHero eyebrow={culture.eyebrow} title={culture.heading} lead={culture.intro}>
        <Cta href="#roles" variant="primary">
          See open roles
          <ArrowRight size={16} />
        </Cta>
      </PageHero>

      {/* How we work */}
      <Section tone="mist">
        <Eyebrow>How We Work</Eyebrow>
        <h2 className="mt-5 max-w-2xl font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
          Philosophy over personalities.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {culture.pillars.map((p) => (
            <article
              key={p.title}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-8"
            >
              <span className="h-1 w-10 rounded-full bg-forest" aria-hidden="true" />
              <h3 className="font-display text-xl font-semibold text-ink">{p.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-body">{p.body}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Open roles */}
      <Section id="roles" tone="canvas">
        <div className="max-w-2xl">
          <Eyebrow>Open Roles</Eyebrow>
          <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
            {culture.recruitCta}
          </h2>
        </div>

        <ul className="mt-10 flex flex-col gap-3">
          {openings.map((o) => (
            <li key={o.role}>
              <a
                href="/contact"
                className="group flex flex-col gap-2 rounded-2xl border border-line bg-paper px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-card sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <span className="font-display text-lg font-semibold text-ink">
                    {o.role}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {o.team} · {o.location}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
                  Apply
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-muted">
          Don&rsquo;t see your role? We&rsquo;re a team of {proofStats[2].value} and
          growing — tell us how you&rsquo;d make {company.name} better.
        </p>
      </Section>

      {/* CTA */}
      <Section tone="wash" className="text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
            We&rsquo;re building what&rsquo;s next. Want in?
          </h2>
          <div className="mt-9 flex justify-center">
            <Cta href="/contact" variant="primary" className="px-8 py-4 text-base">
              Get in Touch
              <ArrowRight size={18} />
            </Cta>
          </div>
        </div>
      </Section>
    </>
  );
}

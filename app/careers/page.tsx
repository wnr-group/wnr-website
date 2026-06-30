import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest px-5 pb-20 pt-32 text-cream sm:px-6 md:pb-24 md:pt-40">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1200px]">
          <span className="flex items-center gap-3 text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-gold">
            <span className="h-px w-8 bg-gold" />
            {culture.eyebrow}
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight text-cream md:text-6xl">
            {culture.heading}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/75">
            {culture.intro}
          </p>
        </div>
      </section>

      {/* How we work */}
      <Section tone="cream">
        <Eyebrow>How We Work</Eyebrow>
        <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold leading-tight text-forest md:text-4xl">
          Philosophy over personalities.
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
          {culture.pillars.map((p) => (
            <article key={p.title} className="flex flex-col gap-4 bg-paper p-8">
              <span className="h-0.5 w-10 bg-gold" aria-hidden="true" />
              <h3 className="font-display text-xl font-semibold text-forest">
                {p.title}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-muted">{p.body}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Open roles */}
      <Section tone="gold-soft">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <Eyebrow>Open Roles</Eyebrow>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-forest md:text-4xl">
              {culture.recruitCta}
            </h2>
          </div>
        </div>

        <ul className="mt-10 divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-paper">
          {openings.map((o) => (
            <li key={o.role}>
              <a
                href="/contact"
                className="group flex flex-col gap-2 px-6 py-5 transition-colors hover:bg-gold-soft sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <span className="font-display text-lg font-semibold text-forest">
                    {o.role}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {o.team} · {o.location}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                  Apply
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-muted">
          Don&rsquo;t see your role? We&rsquo;re a team of {proofStats[2].value}{" "}
          and growing — tell us how you&rsquo;d make {company.name} better.
        </p>
      </Section>

      {/* CTA */}
      <section className="bg-forest-deep px-5 py-24 text-center sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold leading-tight text-cream md:text-4xl">
            We&rsquo;re building what&rsquo;s next. Want in?
          </h2>
          <div className="mt-9 flex justify-center">
            <Cta href="/contact" variant="primary" className="px-8 py-4 text-base">
              Get in Touch
              <ArrowRight size={18} />
            </Cta>
          </div>
        </div>
      </section>
    </>
  );
}

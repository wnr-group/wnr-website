import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { WhyUs } from "@/components/sections/WhyUs";
import { Values } from "@/components/sections/Values";
import { company, proofStats } from "@/content/company";
import { culture } from "@/content/sections";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About — Building What's Next",
  description: company.mission,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About WnR Group"
        title={
          <>
            We understand the business <span className="text-forest">before we build the system.</span>
          </>
        }
        lead={culture.intro}
      >
        <Cta href="/contact" variant="primary">
          Work with us
          <ArrowRight size={16} />
        </Cta>
      </PageHero>

      {/* Mission / Vision / Core belief — staggered editorial cards */}
      <Section tone="canvas">
        <p className="eyebrow">Mission &amp; Vision</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { label: "Mission", body: company.mission },
            { label: "Vision", body: company.vision },
            { label: "Core belief", body: company.coreBelief },
          ].map((b, i) => (
            <div
              key={b.label}
              className={cn(
                "flex flex-col gap-3 rounded-3xl p-8",
                i === 1 ? "bg-forest text-white md:mt-8" : "bg-mist",
              )}
            >
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.14em]",
                  i === 1 ? "text-forest-bright" : "text-forest",
                )}
              >
                {b.label}
              </span>
              <p
                className={cn(
                  "text-[1.05rem] leading-relaxed",
                  i === 1 ? "text-white/85" : "text-body",
                )}
              >
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* From India to the world — full-width editorial with oversized geography */}
      <Section tone="mist">
        <div className="max-w-3xl">
          <p className="eyebrow">Built From India, For The World</p>
          <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.05] text-ink">
            {company.geography}
          </h2>
          <p className="mt-6 text-[length:var(--text-lead)] leading-relaxed text-body">
            {company.subTagline} We&rsquo;re {proofStats[2].value} engineers,
            strategists, and operators who believe the hard part was never the
            code — it&rsquo;s understanding the business well enough to build the
            system it truly needs.
          </p>
        </div>
        <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {proofStats.map((s) => (
            <div key={s.label} className="flex flex-col rounded-2xl bg-paper px-6 py-6">
              <dd className="order-1 font-display text-3xl font-bold tracking-tight text-forest">
                {s.value}
              </dd>
              <dt className="order-2 mt-2 text-xs leading-snug text-muted">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </Section>

      {/* How we work — staggered pillars, not identical cards */}
      <Section tone="canvas">
        <p className="eyebrow">How We Work</p>
        <h2 className="mt-5 max-w-2xl font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
          Philosophy over personalities.
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {culture.pillars.map((p, i) => (
            <article
              key={p.title}
              className={cn(
                "flex flex-col gap-4 rounded-3xl border border-line bg-paper p-8",
                i === 1 && "md:mt-10",
              )}
            >
              <span
                className="font-display text-3xl font-bold tabular-nums text-forest/25"
                aria-hidden="true"
              >
                0{i + 1}
              </span>
              <h3 className="font-display text-xl font-semibold text-ink">{p.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-body">{p.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <WhyUs />
      <Values tone="mist" />
    </>
  );
}

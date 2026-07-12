import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, Eyebrow } from "@/components/ui/Section";
import { work } from "@/content/sections";
import { cn } from "@/lib/utils";

const accentText: Record<string, string> = {
  forest: "text-forest-bright",
  teal: "text-teal",
  amber: "text-amber",
};

export const metadata: Metadata = {
  title: "Insights — Case Studies & Perspective",
  description:
    "Custom platforms and measurable outcomes across education, retail, and logistics — plus notes on building AI-native operational systems.",
};

const articles = [
  {
    tag: "Perspective",
    title: "Why implementation depth beats features",
    body: "The moat was never the code. It's understanding the business well enough to build the system it truly needs — and staying to make it stick.",
  },
  {
    tag: "AI-Native",
    title: "Embedding intelligence into everyday operations",
    body: "AI isn't an add-on. Here's how we design smart approvals, insights, and workflow optimisation into the system from day one.",
  },
  {
    tag: "Playbook",
    title: "Mapping a business before writing a line of code",
    body: "Our four-step method — Map, Build, Implement & Train, Partner — and why it starts on the operations floor, not the codebase.",
  },
];

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={
          <>
            Custom platforms. <span className="text-forest">Measurable outcomes.</span>
          </>
        }
        lead="Case studies from real deployments and our perspective on building AI-native operational systems."
      />

      {/* Case studies */}
      <Section tone="canvas">
        <Eyebrow>{work.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-2xl font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
          {work.heading}
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {work.cases.map((c) => (
            <article
              key={c.title}
              className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-7">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "text-xs font-bold uppercase tracking-[0.16em]",
                      accentText[c.accent],
                    )}
                  >
                    {c.tag}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-muted transition-colors group-hover:text-forest"
                  />
                </div>
                <h3 className="font-display text-lg font-semibold leading-snug text-ink">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed text-body">{c.body}</p>
                <p className="mt-auto border-t border-line pt-4 text-sm font-medium text-ink">
                  <span className={cn("font-semibold", accentText[c.accent])}>
                    Result ·{" "}
                  </span>
                  {c.result}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Perspective / newsletter feed */}
      <Section tone="mist">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="max-w-sm">
            <Eyebrow>Perspective</Eyebrow>
            <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
              Notes from the operations floor.
            </h2>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-body">
              A newsletter for operators and founders on turning complexity into
              clarity. No fluff — just what we learn building systems that stick.
            </p>
            <form
              className="mt-7 flex flex-col gap-3 sm:flex-row"
              aria-label="Subscribe to the WnR newsletter"
            >
              <input
                type="email"
                required
                placeholder="you@company.com"
                aria-label="Email address"
                className="w-full rounded-full border border-line bg-paper px-5 py-3 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/25"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
              >
                Subscribe
              </button>
            </form>
          </div>

          <ul className="flex flex-col gap-4">
            {articles.map((a) => (
              <li key={a.title}>
                <a
                  href="#"
                  className="group flex flex-col gap-2 rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                    {a.tag}
                  </span>
                  <h3 className="flex items-start justify-between gap-4 font-display text-xl font-semibold text-ink">
                    {a.title}
                    <ArrowUpRight
                      size={18}
                      className="mt-1 shrink-0 text-muted transition-all group-hover:translate-x-0.5 group-hover:text-forest"
                    />
                  </h3>
                  <p className="max-w-2xl text-[0.95rem] leading-relaxed text-body">
                    {a.body}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}

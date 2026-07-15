import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, Compass, Cpu } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { Approach } from "@/components/sections/Approach";
import { arms, divisions } from "@/content/arms";

export const metadata: Metadata = {
  title: "Capabilities — Systems, Consulting & AI Labs",
  description:
    "Three operating arms that take a business from operational strategy to live system to intelligent automation.",
};

const armMeta: Record<string, { icon: React.ElementType; points: string[] }> = {
  systems: {
    icon: Boxes,
    points: [
      "Custom ERP & operational platforms",
      "Web & mobile applications",
      "Multi-portal systems & dashboards",
      "Integrations across your existing tools",
    ],
  },
  consulting: {
    icon: Compass,
    points: [
      "Operations mapping & workflow audits",
      "Where-time-and-money-leaks analysis",
      "Operational strategy before software",
      "Implementation & team training",
    ],
  },
  "ai-labs": {
    icon: Cpu,
    points: [
      "AI-native automation & smart approvals",
      "LLM pipelines & operational intelligence",
      "Workflow optimisation from real data",
      "The intelligence layer across the portfolio",
    ],
  },
};

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow={divisions.eyebrow}
        title={
          <>
            One company. <span className="text-forest">Three operating arms.</span>
          </>
        }
        lead={divisions.intro}
      >
        <Cta href="/contact" variant="primary">
          Map your operations
          <ArrowRight size={16} />
        </Cta>
      </PageHero>

      {arms.map((arm, i) => {
        const meta = armMeta[arm.slug];
        const Icon = meta.icon;
        return (
          <Section
            key={arm.slug}
            id={arm.slug}
            tone={i % 2 === 0 ? "canvas" : "mist"}
          >
            {/* oversized ghost number + name header */}
            <div className="flex items-start gap-5 md:gap-8">
              <span
                className="font-display text-6xl font-bold leading-none tabular-nums text-forest/12 md:text-8xl"
                aria-hidden="true"
              >
                0{i + 1}
              </span>
              <div className="pt-1 md:pt-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-forest-wash text-forest">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <h2 className="mt-4 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
                  {arm.name}
                </h2>
                <p className="mt-5 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-body">
                  {arm.description}
                  {arm.flow && (
                    <span className="block mt-2 font-medium text-ink">
                      {arm.flow}
                    </span>
                  )}
                </p>
                {arm.products && arm.products.length > 0 && (
                  <p className="mt-3.5 max-w-2xl text-[length:var(--text-lead)] font-medium leading-relaxed text-forest">
                    <span>Products: </span>
                    {arm.products.map((prod, idx) => (
                      <React.Fragment key={prod.name}>
                        <Link
                          href={prod.href}
                          className="underline decoration-forest/60 underline-offset-4 hover:opacity-80 transition-opacity"
                        >
                          {prod.name}
                        </Link>
                        {idx < (arm.products?.length ?? 0) - 1 && (
                          <span className="mx-1.5 opacity-60">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </p>
                )}
              </div>
            </div>

            {/* capability points as a clean panel grid — no split, no divider */}
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {meta.points.map((p) => (
                <li
                  key={p}
                  className="flex flex-col gap-3 rounded-2xl border border-line bg-paper p-5"
                >
                  <ArrowRight size={16} className="shrink-0 text-forest" />
                  <span className="text-[0.9rem] font-medium leading-snug text-ink">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}

      <Approach tone="mist" priority />
    </>
  );
}

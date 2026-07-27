"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, Compass, Sparkles } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { arms } from "@/content/arms";

const armConfigMap: Record<
  string,
  {
    icon: React.ElementType;
    cardBg: string;
    focusRing: string;
    iconTileBg: string;
    iconTileHoverBg: string;
    arrowHoverBg: string;
    arrowText: string;
    productText: string;
  }
> = {
  systems: {
    icon: Layers,
    cardBg: "bg-[linear-gradient(135deg,var(--color-paper)_45%,var(--color-forest-wash)_100%)]",
    focusRing: "focus-visible:ring-forest",
    iconTileBg: "bg-gradient-to-br from-forest-wash/90 to-mist text-forest border border-line/60",
    iconTileHoverBg: "group-hover:from-forest group-hover:to-forest-deep group-hover:text-white group-hover:border-forest",
    arrowHoverBg: "group-hover:border-forest group-hover:bg-forest group-hover:text-white group-hover:translate-x-1",
    arrowText: "text-forest",
    productText: "text-forest decoration-forest/60",
  },
  consulting: {
    icon: Compass,
    cardBg: "bg-[linear-gradient(135deg,var(--color-paper)_45%,var(--color-teal-wash)_100%)]",
    focusRing: "focus-visible:ring-teal",
    iconTileBg: "bg-gradient-to-br from-teal-wash/90 to-mist text-teal border border-line/60",
    iconTileHoverBg: "group-hover:from-teal group-hover:to-teal group-hover:text-white group-hover:border-teal",
    arrowHoverBg: "group-hover:border-teal group-hover:bg-teal group-hover:text-white group-hover:translate-x-1",
    arrowText: "text-teal",
    productText: "text-teal decoration-teal/60",
  },
  "ai-labs": {
    icon: Sparkles,
    cardBg: "bg-[linear-gradient(135deg,var(--color-paper)_45%,var(--color-amber-wash)_100%)]",
    focusRing: "focus-visible:ring-amber",
    iconTileBg: "bg-gradient-to-br from-amber-wash/90 to-mist text-amber border border-line/60",
    iconTileHoverBg: "group-hover:from-amber group-hover:to-gold-ink group-hover:text-white group-hover:border-amber",
    arrowHoverBg: "group-hover:border-amber group-hover:bg-amber group-hover:text-white group-hover:translate-x-1",
    arrowText: "text-amber",
    productText: "text-amber decoration-amber/60",
  },
};

export function ThreeArmSection() {
  return (
    <Section
      id="three-arms"
      tone="canvas"
      aria-label="Our operational arms"
      className="py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left column: headline + intro (~42% desktop) */}
        <Reveal className="lg:col-span-5 flex flex-col justify-center" y={18} delay={0}>
          <Eyebrow>OUR OPERATIONAL ARMS</Eyebrow>
          <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
            The operational brain of your{" "}
            <span className="text-forest">business.</span>
          </h2>
          <p className="mt-6 text-[length:var(--text-lead)] leading-relaxed text-body">
            We build the operational brain of your business: custom platforms,
            AI-native workflows, and vertical SaaS products that replace
            scattered tools with one intelligent system. We build it, implement
            it, train your team, and stay.
          </p>
        </Reveal>

        {/* Right column: 3 stacked cards (~58% desktop) */}
        <Stagger className="lg:col-span-7 flex flex-col gap-4 sm:gap-5" stagger={0.12}>
          {arms.map((arm) => {
            const config = armConfigMap[arm.slug] ?? armConfigMap.systems;
            const Icon = config.icon;
            return (
              <StaggerItem key={arm.slug}>
                <Link
                  href={`/capabilities#${arm.slug}`}
                  className={[
                    "group relative flex flex-col justify-between gap-4 rounded-3xl border border-line",
                    "p-6 sm:p-7 md:p-8",
                    "transition-all duration-300 ease-out",
                    "hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                    config.cardBg,
                    config.focusRing,
                  ].join(" ")}
                  aria-label={`Learn about ${arm.name}`}
                >
                  {/* Card header row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Icon tile */}
                      <div
                        className={[
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                          "transition-all duration-300 ease-out",
                          config.iconTileBg,
                          config.iconTileHoverBg,
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5 stroke-[1.75]" />
                      </div>
                      {/* Arm name */}
                      <h3 className="font-display text-lg sm:text-xl font-bold leading-tight text-ink">
                        {arm.name}
                      </h3>
                    </div>

                    {/* Arrow button */}
                    <div
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        "border border-line bg-canvas",
                        "transition-all duration-300 ease-out",
                        config.arrowText,
                        config.arrowHoverBg,
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      <ArrowRight className="h-4 w-4 stroke-[2]" />
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-sm sm:text-[0.95rem] leading-relaxed text-body sm:pl-16">
                    {arm.summary}
                    {arm.flow && (
                      <span className="mt-1 block font-medium text-ink">
                        {arm.flow}
                      </span>
                    )}
                  </p>

                  {/* Product chips */}
                  {arm.products && arm.products.length > 0 && (
                    <div
                      className={`text-sm sm:text-[0.95rem] font-medium leading-relaxed sm:pl-16 ${config.productText}`}
                    >
                      <span>Products: </span>
                      {arm.products.map((prod, idx) => (
                        <React.Fragment key={prod.name}>
                          <span className="underline decoration-inherit underline-offset-4">
                            {prod.name}
                          </span>
                          {idx < (arm.products?.length ?? 0) - 1 && (
                            <span className="mx-1 opacity-60">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}

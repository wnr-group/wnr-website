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
      className="py-16 md:py-24 lg:py-28 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Headline & Paragraph (~42% desktop width) */}
        <Reveal className="lg:col-span-5 flex flex-col justify-center" y={18} delay={0}>
          <Eyebrow>OUR OPERATIONAL ARMS</Eyebrow>
          <h2 className="mt-4 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
            The operational brain of your <span className="text-forest">business.</span>
          </h2>
          <p className="mt-5 sm:mt-6 text-[length:var(--text-lead)] leading-relaxed text-body">
            We build the operational brain of your business — custom platforms, AI-native workflows, and vertical SaaS products that replace scattered tools with one intelligent system. We don&apos;t just build it. We implement it, train your team, and stay.
          </p>
        </Reveal>

        {/* Right Column: 3 Stacked Cards vertically (~58% desktop width) */}
        <Stagger className="lg:col-span-7 flex flex-col gap-4 sm:gap-5" stagger={0.12}>
          {arms.map((arm) => {
            const config = armConfigMap[arm.slug] || armConfigMap.systems;
            const Icon = config.icon;
            return (
              <StaggerItem key={arm.slug}>
                <Link
                  href={`/capabilities#${arm.slug}`}
                  className={`group relative flex flex-col justify-between gap-3 sm:gap-4 rounded-3xl border border-line p-6 sm:p-7 md:p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${config.cardBg} ${config.focusRing}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 sm:gap-4">
                      <div className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${config.iconTileBg} ${config.iconTileHoverBg}`}>
                        <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 stroke-[1.75]" aria-hidden="true" />
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                        {arm.name}
                      </h3>
                    </div>

                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-canvas transition-all duration-300 ${config.arrowText} ${config.arrowHoverBg}`}>
                      <ArrowRight className="h-4 w-4 stroke-[2]" aria-hidden="true" />
                    </div>
                  </div>

                  <p className="text-sm sm:text-[0.95rem] leading-relaxed text-body pl-0 sm:pl-16">
                    {arm.summary}
                    {arm.flow && (
                      <span className="block mt-1 font-medium text-ink">
                        {arm.flow}
                      </span>
                    )}
                  </p>
                  {arm.products && arm.products.length > 0 && (
                    <div className={`mt-2 text-sm sm:text-[0.95rem] font-medium leading-relaxed pl-0 sm:pl-16 ${config.productText}`}>
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

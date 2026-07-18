import React from "react";
import Image from "next/image";
import { Compass, Layers, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { arms } from "@/content/arms";
import { cn } from "@/lib/utils";

const armVisuals: Record<
  string,
  {
    icon: React.ElementType;
    accent: "teal" | "forest" | "amber";
    imageSrc: string;
    imageAlt: string;
    layout: "image-left" | "image-right" | "centered";
  }
> = {
  consulting: {
    icon: Compass,
    accent: "teal",
    imageSrc: "/brand/approach-workshop.webp",
    imageAlt: "WnR Consulting team auditing operational workflows in discovery workshop",
    layout: "image-left",
  },
  systems: {
    icon: Layers,
    accent: "forest",
    imageSrc: "/brand/build-systems.webp",
    imageAlt: "WnR Systems custom software and ERP architecture visualization",
    layout: "image-right",
  },
  "ai-labs": {
    icon: Sparkles,
    accent: "amber",
    imageSrc: "/brand/build-ai.webp",
    imageAlt: "WnR AI Labs intelligent automation and predictive analytics layer",
    layout: "centered",
  },
};

const orderedSlugs = ["consulting", "systems", "ai-labs"];

export function CapabilitiesArmSection() {
  return (
    <>
      {orderedSlugs.map((slug, index) => {
        const arm = arms.find((a) => a.slug === slug);
        if (!arm) return null;

        const visual = armVisuals[slug] || armVisuals.systems;
        const Icon = visual.icon;
        const label = arm.capabilitiesLabel ?? `ARM 0${index + 1}`;
        const title = arm.capabilitiesTitle ?? arm.name;
        const body = arm.capabilitiesBody ?? arm.description ?? arm.summary;
        const whatYouGet = arm.whatYouGet;
        const deliverables = arm.deliverables ?? [];

        const isCentered = visual.layout === "centered";
        const isImageRight = visual.layout === "image-right";

        return (
          <Section
            key={arm.slug}
            id={arm.slug}
            bleed
            tone={index % 2 === 0 ? "canvas" : "mist"}
            className="py-24 md:py-36 border-b border-line overflow-hidden"
          >
            <Container>
              {isCentered ? (
                /* Centered Composition (ARM 03: AI Labs) */
                <div className="flex flex-col items-center">
                  <Reveal className="text-center max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-wash text-amber">
                        <Icon size={22} strokeWidth={1.75} />
                      </span>
                      <Eyebrow>{label}</Eyebrow>
                    </div>

                    <h2 className="mt-2 font-display text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.06] text-ink">
                      {title}
                    </h2>

                    <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed text-body">
                      {body}
                    </p>

                    {whatYouGet && (
                      <div className="mt-8 max-w-3xl mx-auto text-left sm:text-center text-base sm:text-[1.05rem] font-medium leading-relaxed text-ink bg-amber-wash/50 border-l-4 sm:border-l-0 sm:border-t-4 border-amber p-6 rounded-2xl shadow-sm">
                        <span className="font-bold text-amber uppercase tracking-wider text-xs block mb-1">
                          What you get
                        </span>
                        {whatYouGet}
                      </div>
                    )}
                  </Reveal>

                  {/* Centered Editorial Imagery Banner */}
                  <Reveal className="w-full mt-12 md:mt-16" y={24}>
                    <div className="group relative aspect-[16/8] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-line shadow-card-hover bg-paper">
                      <Image
                        src={visual.imageSrc}
                        alt={visual.imageAlt}
                        fill
                        sizes="(min-width: 1200px) 1200px, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                      
                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                        <span className="px-3.5 py-1.5 rounded-full bg-paper/90 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-amber border border-line">
                          {arm.name}
                        </span>
                      </div>
                    </div>
                  </Reveal>
                </div>
              ) : (
                /* Split Editorial Composition (Image Left vs Image Right) */
                <div
                  className={cn(
                    "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center",
                    isImageRight && "lg:grid-flow-dense"
                  )}
                >
                  {/* Image Column (~5 cols) */}
                  <Reveal
                    className={cn(
                      "lg:col-span-5 w-full",
                      isImageRight && "lg:col-start-8"
                    )}
                    y={20}
                  >
                    <div className="group relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] w-full overflow-hidden rounded-3xl border border-line shadow-card-hover bg-paper">
                      <Image
                        src={visual.imageSrc}
                        alt={visual.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-500" />

                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                        <span
                          className={cn(
                            "px-3.5 py-1.5 rounded-full bg-paper/90 backdrop-blur-md text-xs font-semibold uppercase tracking-wider border border-line",
                            visual.accent === "teal" && "text-teal",
                            visual.accent === "forest" && "text-forest",
                            visual.accent === "amber" && "text-amber"
                          )}
                        >
                          {label} · {arm.name}
                        </span>
                      </div>
                    </div>
                  </Reveal>

                  {/* Content Column (~7 cols) */}
                  <Reveal
                    className={cn(
                      "lg:col-span-7 flex flex-col justify-center",
                      isImageRight && "lg:col-start-1"
                    )}
                    y={16}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={cn(
                          "inline-flex h-11 w-11 items-center justify-center rounded-xl",
                          visual.accent === "teal" && "bg-teal-wash text-teal",
                          visual.accent === "forest" && "bg-forest-wash text-forest",
                          visual.accent === "amber" && "bg-amber-wash text-amber"
                        )}
                      >
                        <Icon size={22} strokeWidth={1.75} />
                      </span>
                      <Eyebrow>{label}</Eyebrow>
                    </div>

                    <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.08] text-ink">
                      {title}
                    </h2>

                    <p className="mt-6 text-lg sm:text-xl leading-relaxed text-body">
                      {body}
                    </p>

                    {whatYouGet && (
                      <div
                        className={cn(
                          "mt-8 text-base sm:text-[1.02rem] font-medium leading-relaxed text-ink border-l-4 p-5 sm:p-6 rounded-r-2xl shadow-sm transition-all duration-300",
                          visual.accent === "teal" && "bg-teal-wash/60 border-teal",
                          visual.accent === "forest" && "bg-forest-wash/60 border-forest",
                          visual.accent === "amber" && "bg-amber-wash/60 border-amber"
                        )}
                      >
                        <span
                          className={cn(
                            "font-bold uppercase tracking-wider text-xs block mb-1",
                            visual.accent === "teal" && "text-teal",
                            visual.accent === "forest" && "text-forest",
                            visual.accent === "amber" && "text-amber"
                          )}
                        >
                          What you get
                        </span>
                        {whatYouGet}
                      </div>
                    )}
                  </Reveal>
                </div>
              )}

              {/* Deliverables Section (Shared by all 3 layouts) */}
              <div className="mt-14 md:mt-20 pt-10 border-t border-line/80">
                <Reveal className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                        CORE DELIVERABLES
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-ink mt-1">
                        What {arm.name} delivers
                      </h3>
                    </div>
                  </div>
                </Reveal>

                <Stagger className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
                  {deliverables.map((deliverable, dIdx) => (
                    <StaggerItem key={dIdx} className="h-full">
                      <div
                        className={cn(
                          "group flex flex-col justify-between h-full rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:border-line-strong hover:-translate-y-1 hover:shadow-card-hover",
                          visual.accent === "teal" && "hover:border-teal/50",
                          visual.accent === "forest" && "hover:border-forest/50",
                          visual.accent === "amber" && "hover:border-amber/50"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <span
                            className={cn(
                              "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-300",
                              visual.accent === "teal" && "bg-teal-wash text-teal group-hover:bg-teal group-hover:text-white",
                              visual.accent === "forest" && "bg-forest-wash text-forest group-hover:bg-forest group-hover:text-white",
                              visual.accent === "amber" && "bg-amber-wash text-amber group-hover:bg-amber group-hover:text-white"
                            )}
                          >
                            <CheckCircle2 size={16} strokeWidth={2} />
                          </span>
                          <span className="font-display text-xs font-bold tabular-nums text-muted opacity-60">
                            0{dIdx + 1}
                          </span>
                        </div>

                        <span className="text-[0.95rem] font-semibold leading-snug text-ink group-hover:text-forest transition-colors">
                          {deliverable}
                        </span>

                        <div className="mt-4 pt-3 border-t border-line/40 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowRight
                            size={14}
                            className={cn(
                              visual.accent === "teal" && "text-teal",
                              visual.accent === "forest" && "text-forest",
                              visual.accent === "amber" && "text-amber"
                            )}
                          />
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </Container>
          </Section>
        );
      })}
    </>
  );
}

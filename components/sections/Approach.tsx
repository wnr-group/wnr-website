import Image from "next/image";
import { Section, Container } from "@/components/ui/Section";
import { approach } from "@/content/sections";
import { cn } from "@/lib/utils";

/* Our approach — a real discovery-workshop photograph anchors the left; the
   four-step method reads as a connected vertical stepper on the right. The
   photo carries the vibrancy the old ghost-number band lacked. Defaults to a
   dark anchor band on the homepage; pass tone="mist" on pages that already
   end on a dark footer to avoid stacking two dark blocks. */
export function Approach({ tone = "forest-deep" }: { tone?: "forest-deep" | "mist" }) {
  const dark = tone === "forest-deep";

  return (
    <Section id="approach" tone={tone} bleed>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* discovery-workshop photograph */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card-hover ring-1 ring-black/5 sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image
                src={approach.image}
                alt={approach.imageAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <span
              className={cn(
                "absolute -bottom-4 left-5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-card",
                dark ? "bg-forest-bright text-forest-deep" : "bg-forest text-white",
              )}
            >
              We stay
            </span>
          </div>

          {/* method */}
          <div>
            <p className={cn("eyebrow", dark && "text-forest-bright")}>
              {approach.eyebrow}
            </p>
            <h2
              className={cn(
                "mt-5 max-w-xl font-display text-[length:var(--text-h2)] font-bold leading-[1.06]",
                dark ? "text-white" : "text-ink",
              )}
            >
              {approach.heading}
            </h2>
            <p
              className={cn(
                "mt-5 max-w-md text-[length:var(--text-lead)] leading-relaxed",
                dark ? "text-white/70" : "text-body",
              )}
            >
              {approach.intro}
            </p>

            <ol className="mt-10 flex flex-col">
              {approach.steps.map((step, i) => (
                <li
                  key={step.num}
                  className={cn(
                    "group relative flex gap-5 pb-8 last:pb-0",
                    // connecting line between step markers
                    i < approach.steps.length - 1 &&
                      "before:absolute before:left-[1.1875rem] before:top-10 before:h-[calc(100%-1.75rem)] before:w-px",
                    dark ? "before:bg-white/15" : "before:bg-line",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold tabular-nums ring-1",
                      dark
                        ? "bg-forest-bright/15 text-forest-bright ring-forest-bright/25"
                        : "bg-forest-wash text-forest ring-forest/15",
                    )}
                  >
                    {step.num}
                  </span>
                  <div className="pt-1">
                    <h3
                      className={cn(
                        "font-display text-lg font-semibold md:text-xl",
                        dark ? "text-white" : "text-ink",
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 max-w-lg text-[0.95rem] leading-relaxed",
                        dark ? "text-white/70" : "text-body",
                      )}
                    >
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { work } from "@/content/sections";
import { cn } from "@/lib/utils";

/* Category accent → label colour on the photo overlay. Rotating forest / teal
   / amber so the case grid isn't monotone green. */
const accentText: Record<string, string> = {
  forest: "text-forest-bright",
  teal: "text-teal",
  amber: "text-amber",
};

/* Selected work — Cognizant recipe: each case is a real photo with a dark
   gradient scrim, a small-caps category label, and the title overlaid on the
   image. One featured case gets a tall panel; the rest sit beside it. */
export function Work({ showLink = false }: { showLink?: boolean }) {
  const [featured, ...rest] = work.cases;

  return (
    <Section id="work" tone="mist">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="eyebrow">{work.eyebrow}</p>
          <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
            {work.heading}
          </h2>
        </div>
        {showLink && (
          <Link
            href="/insights"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-forest"
          >
            All insights
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        )}
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        {/* featured case — large photo panel */}
        <article className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl lg:min-h-[32rem]">
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/92 via-forest-deep/45 to-forest-deep/5" />
          <div className="relative p-8 md:p-10">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-[0.16em]",
                  accentText[featured.accent],
                )}
              >
                {featured.tag}
              </span>
              <ArrowUpRight
                size={22}
                className="text-white/70 transition-all group-hover:-translate-y-0.5 group-hover:text-white"
              />
            </div>
            <h3 className="mt-4 max-w-md font-display text-2xl font-semibold leading-snug text-white md:text-3xl">
              {featured.title}
            </h3>
            <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-white/80">
              {featured.body}
            </p>
            <p className="mt-5 border-t border-white/15 pt-4 text-[0.9rem] font-medium leading-relaxed text-white/90">
              <span className={cn("font-semibold", accentText[featured.accent])}>
                Result —{" "}
              </span>
              {featured.result}
            </p>
          </div>
        </article>

        {/* supporting cases — compact photo tiles */}
        <div className="flex flex-col gap-4">
          {rest.map((c) => (
            <article
              key={c.title}
              className="group relative flex min-h-[12rem] flex-1 flex-col justify-end overflow-hidden rounded-3xl"
            >
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/40 to-transparent" />
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-[0.7rem] font-bold uppercase tracking-[0.16em]",
                      accentText[c.accent],
                    )}
                  >
                    {c.tag}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-white/70 transition-all group-hover:-translate-y-0.5 group-hover:text-white"
                  />
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-white">
                  {c.title}
                </h3>
                <p className="mt-1.5 text-[0.85rem] leading-relaxed text-white/75">
                  {c.result}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}

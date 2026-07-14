import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/types/caseStudy";
import { CaseStudyVisual } from "./CaseStudyVisual";
import { CaseStudyOverlay } from "./CaseStudyOverlay";
import { CaseStudyCTA } from "./CaseStudyCTA";

interface CaseStudyCardProps {
  study: CaseStudy;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CaseStudyCard = React.memo(function CaseStudyCard({
  study,
  isActive,
  onClick,
  className,
}: CaseStudyCardProps) {
  return (
    <article
      onClick={onClick}
      className={cn(
        "group flex h-full w-full flex-col overflow-hidden rounded-3xl border bg-paper transition-all duration-300",
        isActive === true
          ? "border-line-strong shadow-card-hover"
          : isActive === false
            ? "border-line shadow-sm hover:border-line-strong"
            : "border-line hover:-translate-y-0.5 hover:shadow-card-hover",
        onClick && "cursor-pointer select-none",
        className
      )}
    >
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-mist">
        {study.image ? (
          <Image
            src={study.image}
            alt={`${study.title} interface`}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <CaseStudyVisual
            kind={study.visual}
            accent={study.accent}
            label={study.industryLabel}
            className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        )}
        <CaseStudyOverlay label={study.industryLabel} accent={study.accent} />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-7">
        <h4 className="font-display text-lg font-semibold leading-snug text-ink">
          {study.title}
        </h4>
        <p className="text-sm leading-relaxed text-body">{study.summary}</p>
        <ul className="flex flex-col gap-1.5">
          {study.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-2 text-[0.8125rem] leading-snug text-body"
            >
              <span
                className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-muted"
                aria-hidden="true"
              />
              {highlight}
            </li>
          ))}
        </ul>
        <CaseStudyCTA accent={study.accent} />
      </div>
    </article>
  );
});


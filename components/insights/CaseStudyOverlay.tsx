import { cn } from "@/lib/utils";
import type { CaseStudyAccent } from "@/types/caseStudy";

const badgeTone: Record<CaseStudyAccent, string> = {
  forest: "bg-forest-wash text-forest",
  teal: "bg-teal-wash text-teal",
  amber: "bg-amber-wash text-amber",
};

/**
 * Sits over the card image: a hairline-subtle gradient scrim (for legibility,
 * never a dark heavy wash) plus the industry badge that stands in for the
 * client name we never show.
 */
export function CaseStudyOverlay({
  label,
  accent,
}: {
  label: string;
  accent: CaseStudyAccent;
}) {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/12 via-transparent to-transparent opacity-80 transition-opacity duration-300 ease-out group-hover:opacity-100"
      />
      <span
        className={cn(
          "absolute left-4 top-4 rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] shadow-sm",
          badgeTone[accent],
        )}
      >
        {label}
      </span>
    </>
  );
}

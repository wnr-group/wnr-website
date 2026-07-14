import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseStudyAccent } from "@/types/caseStudy";

const accentText: Record<CaseStudyAccent, string> = {
  forest: "text-forest",
  teal: "text-teal",
  amber: "text-amber",
};

/**
 * Presentational only — no case study has a live detail page yet, so this
 * renders the CTA affordance without linking anywhere a visitor could 404.
 * `CaseStudy.slug` is already reserved for the real route once it exists.
 */
export function CaseStudyCTA({ accent }: { accent: CaseStudyAccent }) {
  return (
    <span
      className={cn(
        "mt-auto flex items-center gap-1.5 border-t border-line pt-4 text-sm font-semibold",
        accentText[accent],
      )}
    >
      View Solution
      <ArrowUpRight
        size={16}
        className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </span>
  );
}

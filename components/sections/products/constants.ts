// Shared motion + style constants for the interactive product list.
// EASE matches the codebase-wide easing curve (components/ui/motion.tsx,
// components/layout/Header.tsx) so this feature's transitions feel identical
// to the rest of the site.
export const EASE = [0.22, 1, 0.36, 1] as const;
export const TRANSITION_DURATION = 0.3;

export const accent: Record<
  string,
  { chip: string; dot: string; tagline: string }
> = {
  teal: {
    chip: "border-teal/20 bg-teal-wash text-teal",
    dot: "bg-teal",
    tagline: "text-teal",
  },
  amber: {
    chip: "border-amber/25 bg-amber-wash text-amber",
    dot: "bg-amber",
    tagline: "text-amber",
  },
};

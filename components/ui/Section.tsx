import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/motion";

type Tone = "canvas" | "mist" | "paper" | "forest" | "forest-deep" | "wash";

const tones: Record<Tone, string> = {
  canvas: "bg-canvas text-body",
  mist: "bg-mist text-body",
  paper: "bg-paper text-body",
  wash: "bg-forest-wash text-body",
  forest: "bg-forest text-white",
  "forest-deep": "bg-forest-deep text-white",
};

interface SectionProps {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  /** Remove the max-width container so children can span edge to edge. */
  bleed?: boolean;
  /** Fade-up the section content as it scrolls into view. On by default. */
  reveal?: boolean;
  /**
   * Viewport threshold that triggers the reveal (forwarded to Reveal's
   * `amount`). Defaults to a fraction (0.2) of the wrapped content's height —
   * fine for normal sections, but that fraction can exceed the viewport
   * height for very tall content and never fire. Pass `"some"` for sections
   * whose content height is unbounded/variable, so the reveal triggers as
   * soon as any part enters view instead of a fixed fraction of the whole.
   */
  revealAmount?: number | "some" | "all";
  /** Overrides the translateY (px) the section rises from on entry. Defaults to Reveal's own default (16). */
  revealY?: number;
  /** Overrides the reveal fade/rise duration in seconds. Defaults to Reveal's own default (0.55). */
  revealDuration?: number;
  children: React.ReactNode;
}

/**
 * Section wrapper — airy vertical rhythm and 1200px max content width.
 * scroll-mt offsets the sticky header for anchor links. Pass `bleed` for
 * full-width sections that manage their own inner layout.
 */
export function Section({
  id,
  tone = "canvas",
  className,
  containerClassName,
  bleed = false,
  reveal = true,
  revealAmount,
  revealY,
  revealDuration,
  children,
}: SectionProps) {
  const inner = bleed ? (
    children
  ) : (
    <div className={cn("mx-auto w-full max-w-[1200px]", containerClassName)}>
      {children}
    </div>
  );

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-20 md:py-28 lg:py-32",
        !bleed && "px-5 sm:px-6",
        tones[tone],
        className,
      )}
    >
      {reveal ? (
        <Reveal amount={revealAmount} y={revealY} duration={revealDuration}>
          {inner}
        </Reveal>
      ) : (
        inner
      )}
    </section>
  );
}

/** Constrains inner content to the site's 1200px column — for use inside bleed sections. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-6", className)}>
      {children}
    </div>
  );
}

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  onDark?: boolean;
}

/** Uppercase label with a leading rule — the consistent section opener. */
export function Eyebrow({ children, className, onDark = false }: EyebrowProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-3 text-[0.8125rem] font-semibold uppercase tracking-[0.14em]",
        onDark ? "text-white/70" : "text-forest",
        className,
      )}
    >
      <span
        className={cn("h-px w-8", onDark ? "bg-white/40" : "bg-forest")}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

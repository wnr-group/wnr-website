import { cn } from "@/lib/utils";

type Tone = "cream" | "forest" | "forest-deep" | "gold-soft" | "paper";

const tones: Record<Tone, string> = {
  cream: "bg-cream text-ink",
  forest: "bg-forest text-cream",
  "forest-deep": "bg-forest-deep text-cream",
  "gold-soft": "bg-gold-soft text-ink",
  paper: "bg-paper text-ink",
};

interface SectionProps {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

/**
 * Section wrapper enforcing the spec's vertical rhythm
 * (120–160px desktop / 72–96px mobile) and 1200px max content width.
 * scroll-mt offsets the sticky header for anchor links.
 */
export function Section({
  id,
  tone = "cream",
  className,
  containerClassName,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 px-5 py-20 sm:px-6 md:py-28 lg:py-36",
        tones[tone],
        className,
      )}
    >
      <div className={cn("mx-auto w-full max-w-[1200px]", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

/** Gold uppercase label with a leading rule — the consistent section opener. */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-3 text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-gold",
        className,
      )}
    >
      <span className="h-px w-8 bg-gold" aria-hidden="true" />
      {children}
    </span>
  );
}

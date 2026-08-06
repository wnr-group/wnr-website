import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "on-dark";

interface CtaProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  "aria-label"?: string;
  target?: string;
  rel?: string;
}

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

const variants: Record<Variant, string> = {
  // Deep-green fill, white text — the one primary action per view
  primary:
    "bg-forest text-white hover:bg-forest-deep hover:-translate-y-px shadow-[0_10px_28px_-14px_rgba(18,71,52,0.7)]",
  // Green outline on light — secondary
  outline: "border border-line-strong text-ink hover:border-forest hover:text-forest hover:bg-forest-wash/60",
  // Text-only link with arrow, on light
  ghost: "px-0 text-forest hover:text-forest-deep",
  // White fill on forest sections
  "on-dark":
    "bg-white text-forest-deep hover:bg-mist hover:-translate-y-px shadow-[0_10px_28px_-14px_rgba(0,0,0,0.5)] focus-visible:ring-white focus-visible:ring-offset-forest-deep",
};

export function Cta({
  href,
  children,
  variant = "primary",
  className,
  ...rest
}: CtaProps) {
  const cls = cn(base, variants[variant], className);
  if (href.startsWith("http")) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

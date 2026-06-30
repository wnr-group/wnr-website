import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "secondary-dark" | "ghost";

interface CtaProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  "aria-label"?: string;
}

const base =
  "group inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

const variants: Record<Variant, string> = {
  // Gold fill, ink text — the one primary action per section
  primary:
    "bg-gold text-forest-deep hover:bg-gold-ink hover:-translate-y-0.5 shadow-[0_10px_30px_-12px_rgba(201,162,75,0.65)]",
  // On light backgrounds: gold outline, ink text, fills faint on hover
  secondary: "border border-gold text-ink hover:bg-gold-soft",
  // On dark forest backgrounds: gold outline, gold text
  "secondary-dark": "border border-gold/50 text-gold hover:bg-gold/10",
  ghost: "px-0 text-gold hover:text-gold-ink",
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

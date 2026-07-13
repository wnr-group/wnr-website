import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { accent } from "./constants";
import type { ProductCardProps } from "./types";

/* One grid card. A real <button>, not a link — selecting a product no
   longer navigates, it opens the in-page ProductHero (see
   ProductsSection.tsx), so the semantics of "this activates something in
   place" call for a button rather than an anchor. Native <button> already
   gives Enter/Space activation and tab focus for free. */
export function ProductCard({ product, onSelect, registerTrigger }: ProductCardProps) {
  const a = accent[product.accent];

  return (
    <div role="listitem" className="h-full">
      <button
        type="button"
        ref={(el) => registerTrigger(product.slug, el)}
        onClick={() => onSelect(product)}
        aria-label={`View details for ${product.name}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-paper text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.art}
            alt={`${product.name} product artwork`}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-7">
          <span
            className={cn(
              "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              a.chip,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", a.dot)} />
            {product.label}
          </span>
          <h3 className="font-display text-xl font-bold text-ink">{product.name}</h3>
          <p className={cn("font-display text-base font-semibold", a.tagline)}>
            {product.tagline}
          </p>
          <p className="line-clamp-3 text-[0.95rem] leading-relaxed text-body">
            {product.oneLiner}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-forest">
            View details
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>
        </div>
      </button>
    </div>
  );
}

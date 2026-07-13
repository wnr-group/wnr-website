"use client";

// components/sections/products/ProductHero.tsx
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductContent } from "./ProductContent";
import { ProductActions } from "./ProductActions";
import { useFocusTrap } from "./hooks/useFocusTrap";
import { accent } from "./constants";
import type { ProductHeroProps } from "./types";

/* In-page replacement for the grid. tabIndex={-1} on the container makes it
   a valid programmatic focus target (useProductSelection focuses it on
   open) without adding it to the normal Tab order. useFocusTrap keeps
   Tab/Shift+Tab cycling inside this container while it's mounted. */
export function ProductHero({ product, onClose, heroRef }: ProductHeroProps) {
  useFocusTrap(heroRef, true);
  const a = accent[product.accent];

  return (
    <div
      ref={heroRef}
      role="region"
      aria-label={`${product.name} details`}
      tabIndex={-1}
      className="overflow-hidden rounded-3xl border border-line bg-paper shadow-card focus:outline-none"
    >
      <div className="flex items-center justify-between border-b border-line px-6 py-4 md:px-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to products"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-forest transition-colors hover:text-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <ArrowLeft size={16} />
          Back to products
        </button>
        <span
          className={cn(
            "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            a.chip,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", a.dot)} />
          {product.label}
        </span>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative min-h-[16rem] lg:min-h-[28rem]">
          <Image
            src={product.art}
            alt={`${product.name} product artwork`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-center gap-6 p-8 md:p-12">
          <div>
            <h3 className="font-display text-3xl font-bold text-ink md:text-[2.25rem]">
              {product.name}
            </h3>
            <p className={cn("mt-1 font-display text-lg font-semibold", a.tagline)}>
              {product.tagline}
            </p>
          </div>
          <ProductContent product={product} />
          <ProductActions product={product} />
        </div>
      </div>
    </div>
  );
}

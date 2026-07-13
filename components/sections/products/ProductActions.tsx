import { ArrowRight } from "lucide-react";
import { Cta } from "@/components/ui/Cta";
import type { ProductActionsProps } from "./types";

/* Primary CTA always leads to /contact (matches ProductDetail.tsx's
   convention exactly). Secondary CTA only makes sense because both current
   products already have a live detail page at product.href — if a future
   product has no detail page yet, leave href pointed at a real route rather
   than growing a conditional here; that's a content-authoring decision, not
   a UI one. */
export function ProductActions({ product }: ProductActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Cta href="/contact" variant="primary">
        {product.ctaLabel}
        <ArrowRight size={16} />
      </Cta>
      <Cta href={product.href} variant="outline">
        View Full Solution
      </Cta>
    </div>
  );
}

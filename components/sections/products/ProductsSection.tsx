"use client";

import { useProductSelection } from "./hooks/useProductSelection";
import { ProductGrid } from "./ProductGrid";
import { ProductHero } from "./ProductHero";
import { ProductTransition } from "./ProductTransition";
import type { Product } from "@/content/products";

/* Client-side orchestrator: owns which product (if any) is selected and
   swaps ProductGrid for ProductHero in place. No routing, no page reload —
   purely local state, matching the useState convention already used by
   components/layout/Header.tsx and components/ui/LeadForm.tsx. */
export function ProductsSection({ products }: { products: Product[] }) {
  const { selected, open, close, registerTrigger, heroRef } = useProductSelection();

  return (
    <ProductTransition activeKey={selected ? selected.slug : "grid"}>
      {selected ? (
        <ProductHero product={selected} onClose={close} heroRef={heroRef} />
      ) : (
        <ProductGrid products={products} onSelect={open} registerTrigger={registerTrigger} />
      )}
    </ProductTransition>
  );
}

"use client";

// components/sections/products/ProductGrid.tsx
import { ProductCard } from "./ProductCard";
import type { ProductGridProps } from "./types";

export function ProductGrid({ products, onSelect, registerTrigger }: ProductGridProps) {
  return (
    <div role="list" aria-label="Products" className="grid gap-5 sm:grid-cols-2">
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          onSelect={onSelect}
          registerTrigger={registerTrigger}
        />
      ))}
    </div>
  );
}

import type { Product } from "@/content/products";

export type { Product };

export type RegisterTrigger = (
  slug: string,
  el: HTMLButtonElement | null,
) => void;

export interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  registerTrigger: RegisterTrigger;
}

export interface ProductGridProps {
  products: Product[];
  onSelect: (product: Product) => void;
  registerTrigger: RegisterTrigger;
}

export interface ProductHeroProps {
  product: Product;
  onClose: () => void;
  heroRef: React.RefObject<HTMLDivElement | null>;
}

export interface ProductContentProps {
  product: Product;
}

export interface ProductActionsProps {
  product: Product;
}

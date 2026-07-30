import { Section } from "@/components/ui/Section";
import { products } from "@/content/products";
import dynamic from "next/dynamic";

const ProductsSection = dynamic(
  () =>
    import("@/components/sections/products/ProductsSection").then(
      (mod) => mod.ProductsSection
    ),
  { ssr: true }
);

/* Products — an interactive grid: click a card to open its full detail
   in place (ProductsSection), no navigation. */
export function Products({
  heading = "Vertical operating systems.",
}: {
  heading?: string;
}) {
  return (
    <Section id="products" tone="canvas">
      <div className="max-w-2xl">
        <p className="eyebrow">Our Products</p>
        <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
          {heading}
        </h2>
      </div>

      <div className="mt-14">
        <ProductsSection products={products} />
      </div>
    </Section>
  );
}

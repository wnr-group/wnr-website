import { Section } from "@/components/ui/Section";
import { products, futureProducts } from "@/content/products";
import dynamic from "next/dynamic";

const ProductsSection = dynamic(
  () =>
    import("@/components/sections/products/ProductsSection").then(
      (mod) => mod.ProductsSection
    ),
  { ssr: true }
);

/* Products — an interactive grid: click a card to open its full detail
   in place (ProductsSection), no navigation. Future products close the
   section as a quiet strip, unchanged from before. */
export function Products({
  heading = "Vertical operating systems, shipping today.",
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

      {/* future products — quiet closing strip */}
      <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-mist px-8 py-7 md:flex-row md:items-center md:justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">
          {futureProducts.heading}
        </h3>
        <ul className="flex flex-wrap gap-2.5">
          {futureProducts.list.map((p) => (
            <li
              key={p}
              className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm text-muted"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

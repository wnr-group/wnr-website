import { ArrowRight, Check } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { ProductMock } from "@/components/ui/ProductMock";
import { products, futureProducts } from "@/content/products";
import { cn } from "@/lib/utils";

const mockMetrics: Record<string, { label: string; value: string }[]> = {
  eduos: [
    { label: "Fees collected", value: "₹42.8L" },
    { label: "Attendance", value: "96%" },
    { label: "Active staff", value: "128" },
  ],
  arenaos: [
    { label: "Revenue today", value: "₹64,200" },
    { label: "Stations live", value: "38/40" },
    { label: "Avg session", value: "82m" },
  ],
};

/* Section 9 — Products. Each gets a full-width band: copy one side, product
   dashboard the other. Sides alternate for rhythm. Dark forest throughout. */
export function Products() {
  return (
    <Section id="products" tone="forest">
      <div className="max-w-2xl">
        <Eyebrow>Our Products</Eyebrow>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-cream md:text-[2.75rem]">
          Vertical operating systems, shipping today.
        </h2>
      </div>

      <div className="mt-16 flex flex-col gap-20 md:gap-28">
        {products.map((product, i) => {
          const flip = i % 2 === 1;
          return (
            <div
              key={product.slug}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              {/* copy */}
              <div className={cn(flip && "lg:order-2")}>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-gold">
                  {product.label}
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold text-cream md:text-3xl">
                  {product.name} — {product.tagline}
                </h3>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-cream/70">
                  {product.oneLiner}
                </p>
                {product.roi && (
                  <p className="mt-4 border-l-2 border-gold pl-4 text-[0.95rem] italic text-gold/90">
                    {product.roi}
                  </p>
                )}
                <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-cream/75">
                      <Check size={16} className="shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Cta href={product.href} variant="secondary-dark" className="mt-8">
                  {product.ctaLabel}
                  <ArrowRight size={16} />
                </Cta>
              </div>

              {/* dashboard mock */}
              <div className={cn(flip && "lg:order-1")}>
                <ProductMock name={product.name} metrics={mockMetrics[product.slug]} />
              </div>
            </div>
          );
        })}
      </div>

      {/* future products */}
      <div className="mt-24 border-t border-white/10 pt-12">
        <h3 className="font-display text-lg font-semibold text-cream/80">
          {futureProducts.heading}
        </h3>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {futureProducts.list.map((p) => (
            <li
              key={p}
              className="rounded-lg border border-dashed border-white/20 px-4 py-2.5 text-sm text-cream/45"
            >
              {p}
              <span className="ml-2 text-[10px] uppercase tracking-wide text-gold/60">
                Soon
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { products, futureProducts } from "@/content/products";
import { cn } from "@/lib/utils";

/* Per-product accent → chip + label styling. Teal for EduOS, amber for
   ArenaOS — tuned to each product's generated artwork so the cards carry
   colour beyond forest green. */
const accent: Record<
  string,
  { chip: string; dot: string; tagline: string }
> = {
  teal: {
    chip: "border-teal/20 bg-teal-wash text-teal",
    dot: "bg-teal",
    tagline: "text-teal",
  },
  amber: {
    chip: "border-amber/25 bg-amber-wash text-amber",
    dot: "bg-amber",
    tagline: "text-amber",
  },
};

/* Products — each a vibrant, image-led showcase card (Infosys Topaz/Cobalt
   style). Large branded product artwork sits opposite the copy on one raised
   white surface; panels alternate image side for rhythm. Future products
   close the section as a quiet strip. */
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

      <div className="mt-14 flex flex-col gap-6">
        {products.map((product, i) => {
          const a = accent[product.accent];
          const imageRight = i % 2 === 0;
          return (
            <article
              key={product.slug}
              className="grid items-stretch gap-0 overflow-hidden rounded-3xl border border-line bg-paper shadow-card lg:grid-cols-2"
            >
              {/* vibrant product artwork */}
              <div
                className={cn(
                  "relative min-h-[16rem] lg:min-h-[24rem]",
                  imageRight ? "lg:order-2" : "lg:order-1",
                )}
              >
                <Image
                  src={product.art}
                  alt={`${product.name} product artwork`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>

              {/* copy */}
              <div
                className={cn(
                  "flex flex-col justify-center p-8 md:p-12",
                  imageRight ? "lg:order-1" : "lg:order-2",
                )}
              >
                <span
                  className={cn(
                    "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                    a.chip,
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", a.dot)} />
                  {product.label}
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-ink md:text-[2rem]">
                  {product.name}
                </h3>
                <p className={cn("mt-1 font-display text-lg font-semibold", a.tagline)}>
                  {product.tagline}
                </p>
                <p className="mt-5 max-w-lg text-[1.02rem] leading-relaxed text-body">
                  {product.oneLiner}
                </p>
                {product.roi && (
                  <p className="mt-5 max-w-lg rounded-2xl bg-mist px-5 py-3.5 text-[0.9rem] leading-relaxed text-body">
                    {product.roi}
                  </p>
                )}
                <Cta href={product.href} variant="primary" className="mt-7 w-fit">
                  {product.ctaLabel}
                  <ArrowRight size={16} />
                </Cta>
              </div>
            </article>
          );
        })}
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

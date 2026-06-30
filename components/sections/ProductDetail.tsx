import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { ProductMock } from "@/components/ui/ProductMock";
import type { Product } from "@/content/products";

export function ProductDetail({
  product,
  mockMetrics,
  ctaHeading,
  ctaBody,
}: {
  product: Product;
  mockMetrics: { label: string; value: string }[];
  ctaHeading: string;
  ctaBody: string;
}) {
  const stats = [
    { label: "Target", value: product.target },
    { label: "Moat", value: product.moat },
    { label: product.revenueLabel, value: product.revenueValue },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest px-5 pb-20 pt-32 text-cream sm:px-6 md:pb-28 md:pt-40">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Link
              href="/#products"
              className="inline-flex items-center gap-1.5 text-sm text-cream/60 transition-colors hover:text-gold"
            >
              <ArrowLeft size={15} />
              All products
            </Link>
            <span className="mt-6 block text-xs font-bold uppercase tracking-[0.12em] text-gold">
              {product.label}
            </span>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-cream md:text-6xl">
              {product.name}
            </h1>
            <p className="mt-3 font-display text-xl font-semibold text-gold md:text-2xl">
              {product.tagline}
            </p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/75">
              {product.oneLiner}
            </p>
            <Cta href="/contact" variant="primary" className="mt-8">
              {product.ctaLabel}
              <ArrowRight size={16} />
            </Cta>
          </div>
          <ProductMock name={product.name} metrics={mockMetrics} />
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-hairline bg-cream px-5 py-14 sm:px-6">
        <dl className="mx-auto grid max-w-[1200px] gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-2 bg-cream p-7">
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-gold">
                {s.label}
              </dt>
              <dd className="font-display text-lg font-semibold leading-snug text-forest">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ROI callout */}
      {product.roi && (
        <Section tone="gold-soft" className="md:py-20">
          <p className="mx-auto max-w-3xl border-l-2 border-gold pl-6 font-display text-xl font-medium leading-snug text-forest md:text-2xl">
            {product.roi}
          </p>
        </Section>
      )}

      {/* Features */}
      <Section tone="cream">
        <Eyebrow>What {product.name} Does</Eyebrow>
        <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold leading-tight text-forest md:text-4xl">
          Built around how the business actually runs.
        </h2>
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-3 rounded-xl border border-hairline bg-paper px-5 py-4 text-[0.95rem] font-medium text-forest"
            >
              <Check size={18} className="shrink-0 text-gold" />
              {f}
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <section className="bg-forest-deep px-5 py-24 text-center sm:px-6 md:py-28">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold leading-tight text-cream md:text-4xl">
            {ctaHeading}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-cream/70">{ctaBody}</p>
          <div className="mt-9 flex justify-center">
            <Cta href="/contact" variant="primary" className="px-8 py-4 text-base">
              Let&rsquo;s Talk
              <ArrowRight size={18} />
            </Cta>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Cta } from "@/components/ui/Cta";
import type { Product } from "@/content/products";

export function ProductDetail({
  product,
  ctaHeading,
  ctaBody,
}: {
  product: Product;
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
      <PageHero
        eyebrow={product.label || undefined}
        title={product.name}
        lead={product.heroBody || product.oneLiner}
        aside={
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line shadow-card">
            <Image
              src={product.art}
              alt={`${product.name} product artwork`}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <p className="-mt-3 font-display text-xl font-semibold text-forest">
            {product.tagline}
          </p>
          {product.strapline && (
            <p className="-mt-4 font-display text-base font-semibold tracking-wide text-ink">
              {product.strapline}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <Cta href="/contact" variant="primary">
              {product.ctaLabel}
              <ArrowRight size={16} />
            </Cta>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-forest"
            >
              <ArrowLeft size={15} />
              All products
            </Link>
          </div>
        </div>
      </PageHero>

      {/* Stats — borderless cards, no vertical dividers */}
      <section className="bg-paper px-5 py-14 sm:px-6">
        <dl className="mx-auto grid max-w-[1200px] gap-4 md:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-2 rounded-2xl bg-mist px-6 py-6"
            >
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                {s.label}
              </dt>
              <dd className="font-display text-lg font-semibold leading-snug text-ink">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ROI callout — full panel, not a border-left rule */}
      {product.roi && (
        <Section tone="wash" className="md:py-20">
          <p className="mx-auto max-w-3xl text-center font-display text-xl font-medium leading-snug text-ink md:text-2xl">
            {product.roi}
          </p>
        </Section>
      )}

      {/* Features */}
      <Section tone="canvas">
        <Eyebrow>What {product.name} Does</Eyebrow>
        <h2 className="mt-5 max-w-2xl font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
          Built around how the business actually runs.
        </h2>
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-3 rounded-xl border border-line bg-paper px-5 py-4 text-[0.95rem] font-medium text-ink"
            >
              <Check size={18} className="shrink-0 text-forest" />
              {f}
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <Section tone="wash" className="text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
            {ctaHeading}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-body">{ctaBody}</p>
          <div className="mt-9 flex justify-center">
            <Cta href="/contact" variant="primary" className="px-8 py-4 text-base">
              Let&rsquo;s Talk
              <ArrowRight size={18} />
            </Cta>
          </div>
        </div>
      </Section>
    </>
  );
}

import { Check } from "lucide-react";
import type { ProductContentProps } from "./types";

/* Hero body: overview, problem/solution, key capabilities, industries,
   technology, business outcomes, and the same three stats ProductDetail.tsx
   already renders (target/moat/revenue) — reused, not duplicated. */
export function ProductContent({ product }: ProductContentProps) {
  const stats = [
    { label: "Target", value: product.target },
    { label: "Moat", value: product.moat },
    { label: product.revenueLabel, value: product.revenueValue },
  ];

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[1.02rem] leading-relaxed text-body">{product.overview}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
            The Problem
          </h4>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-body">
            {product.businessProblem}
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
            The Solution
          </h4>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-body">{product.solution}</p>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
          Key Capabilities
        </h4>
        <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {product.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2.5 text-[0.9rem] font-medium text-ink"
            >
              <Check size={16} className="shrink-0 text-forest" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
            Industries
          </h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {product.industries.map((industry) => (
              <li
                key={industry}
                className="rounded-full border border-line bg-mist px-3 py-1 text-xs font-medium text-body"
              >
                {industry}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
            Technology
          </h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {product.technology.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line bg-mist px-3 py-1 text-xs font-medium text-body"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {product.roi && (
        <div className="rounded-2xl bg-mist px-5 py-4">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
            Business Outcomes
          </h4>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-body">{product.roi}</p>
        </div>
      )}

      <dl className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-mist px-4 py-3.5">
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-forest">
              {stat.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold leading-snug text-ink">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

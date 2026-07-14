// components/sections/products/ProductGrid.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductGrid } from "./ProductGrid";
import type { Product } from "./types";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stripping fill prop before spreading onto native img
    const { fill: _fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element -- mock of next/image for test environment
    return <img alt={(rest.alt as string) ?? ""} {...rest} />;
  },
}));

const products: Product[] = [
  {
    slug: "eduos",
    name: "EduOS",
    label: "Live",
    tagline: "tagline",
    oneLiner: "one liner",
    features: [],
    href: "/products/eduos",
    ctaLabel: "Explore EduOS",
    art: "/brand/product-eduos.webp",
    accent: "teal",
    target: "t",
    moat: "m",
    revenueLabel: "Revenue",
    revenueValue: "v",
    overview: "o",
    businessProblem: "p",
    solution: "s",
    industries: [],
    technology: [],
  },
  {
    slug: "arenaos",
    name: "ArenaOS",
    label: "Live",
    tagline: "tagline",
    oneLiner: "one liner",
    features: [],
    href: "/products/arenaos",
    ctaLabel: "Explore ArenaOS",
    art: "/brand/product-arenaos.webp",
    accent: "amber",
    target: "t",
    moat: "m",
    revenueLabel: "Revenue",
    revenueValue: "v",
    overview: "o",
    businessProblem: "p",
    solution: "s",
    industries: [],
    technology: [],
  },
];

describe("ProductGrid", () => {
  it("renders one card per product and forwards onSelect", () => {
    const onSelect = vi.fn();
    render(
      <ProductGrid products={products} onSelect={onSelect} registerTrigger={() => {}} />,
    );
    expect(screen.getByText("EduOS")).toBeInTheDocument();
    expect(screen.getByText("ArenaOS")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /view details for arenaos/i }));
    expect(onSelect).toHaveBeenCalledWith(products[1]);
  });

  it("exposes a labelled list role for screen readers", () => {
    render(
      <ProductGrid products={products} onSelect={() => {}} registerTrigger={() => {}} />,
    );
    expect(screen.getByRole("list", { name: "Products" })).toBeInTheDocument();
  });
});

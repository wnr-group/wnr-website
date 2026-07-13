import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "./ProductCard";
import type { Product } from "./types";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill: _fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={(rest.alt as string) ?? ""} {...rest} />;
  },
}));

const product: Product = {
  slug: "eduos",
  name: "EduOS",
  label: "Live · Vertical SaaS",
  tagline: "The operating brain for schools.",
  oneLiner: "One liner.",
  features: [],
  href: "/products/eduos",
  ctaLabel: "Explore EduOS",
  art: "/brand/product-eduos.webp",
  accent: "teal",
  target: "target",
  moat: "moat",
  revenueLabel: "Revenue",
  revenueValue: "value",
  overview: "overview",
  businessProblem: "problem",
  solution: "solution",
  industries: [],
  technology: [],
};

describe("ProductCard", () => {
  it("renders the product name and calls onSelect when clicked", () => {
    const onSelect = vi.fn();
    render(
      <ProductCard
        product={product}
        onSelect={onSelect}
        registerTrigger={() => {}}
      />,
    );
    expect(screen.getByText("EduOS")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /view details for eduos/i }));
    expect(onSelect).toHaveBeenCalledWith(product);
  });

  it("registers its DOM node as the focus-restore trigger on mount", () => {
    const registerTrigger = vi.fn();
    render(
      <ProductCard
        product={product}
        onSelect={() => {}}
        registerTrigger={registerTrigger}
      />,
    );
    expect(registerTrigger).toHaveBeenCalledWith("eduos", expect.any(HTMLButtonElement));
  });
});

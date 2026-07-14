// components/sections/products/ProductsSection.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductsSection } from "./ProductsSection";
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
    features: ["Fee management"],
    href: "/products/eduos",
    ctaLabel: "Explore EduOS",
    art: "/brand/product-eduos.webp",
    accent: "teal",
    target: "target",
    moat: "moat",
    revenueLabel: "Revenue",
    revenueValue: "value",
    overview: "overview text",
    businessProblem: "problem text",
    solution: "solution text",
    industries: ["Schools"],
    technology: ["Cloud"],
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
    target: "target",
    moat: "moat",
    revenueLabel: "Revenue",
    revenueValue: "value",
    overview: "overview text",
    businessProblem: "problem text",
    solution: "solution text",
    industries: [],
    technology: [],
  },
];

describe("ProductsSection", () => {
  it("shows the grid first, opens the hero on card click, and returns to the grid on Back", async () => {
    render(<ProductsSection products={products} />);

    expect(screen.getByRole("list", { name: "Products" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /view details for eduos/i }));

    await waitFor(() =>
      expect(screen.getByRole("region", { name: "EduOS details" })).toBeInTheDocument(),
    );
    expect(screen.getByText("overview text")).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Products" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /back to products/i }));

    await waitFor(() =>
      expect(screen.getByRole("list", { name: "Products" })).toBeInTheDocument(),
    );
    expect(screen.queryByRole("region", { name: "EduOS details" })).not.toBeInTheDocument();
  });

  it("closes the hero on Escape", async () => {
    render(<ProductsSection products={products} />);
    fireEvent.click(screen.getByRole("button", { name: /view details for arenaos/i }));
    await waitFor(() =>
      expect(screen.getByRole("region", { name: "ArenaOS details" })).toBeInTheDocument(),
    );

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() =>
      expect(screen.getByRole("list", { name: "Products" })).toBeInTheDocument(),
    );
  });

  it("restores focus to the trigger card after closing the hero", async () => {
    render(<ProductsSection products={products} />);
    const trigger = screen.getByRole("button", { name: /view details for eduos/i });
    fireEvent.click(trigger);
    await waitFor(() =>
      expect(screen.getByRole("region", { name: "EduOS details" })).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /back to products/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /view details for eduos/i })).toHaveFocus(),
    );
  });

  it("never changes the URL when opening or closing the hero", async () => {
    const initialUrl = window.location.href;
    render(<ProductsSection products={products} />);
    fireEvent.click(screen.getByRole("button", { name: /view details for eduos/i }));
    await waitFor(() =>
      expect(screen.getByRole("region", { name: "EduOS details" })).toBeInTheDocument(),
    );
    expect(window.location.href).toBe(initialUrl);
    fireEvent.click(screen.getByRole("button", { name: /back to products/i }));
    await waitFor(() =>
      expect(screen.getByRole("list", { name: "Products" })).toBeInTheDocument(),
    );
    expect(window.location.href).toBe(initialUrl);
  });
});

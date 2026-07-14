import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useProductSelection } from "./useProductSelection";
import type { Product } from "../types";

const product: Product = {
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

describe("useProductSelection", () => {
  it("starts with nothing selected", () => {
    const { result } = renderHook(() => useProductSelection());
    expect(result.current.selected).toBeNull();
  });

  it("open() selects the product, close() clears it", () => {
    const { result } = renderHook(() => useProductSelection());
    act(() => result.current.open(product));
    expect(result.current.selected).toEqual(product);
    act(() => result.current.close());
    expect(result.current.selected).toBeNull();
  });

  it("closes on Escape when a product is selected", () => {
    const { result } = renderHook(() => useProductSelection());
    act(() => result.current.open(product));
    expect(result.current.selected).toEqual(product);
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(result.current.selected).toBeNull();
  });

  it("restores focus to the registered trigger button on close", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useProductSelection());
    const button = document.createElement("button");
    document.body.appendChild(button);
    const focusSpy = vi.spyOn(button, "focus");

    act(() => result.current.registerTrigger(product.slug, button));
    act(() => result.current.open(product));
    act(() => result.current.close());
    act(() => {
      vi.runAllTimers();
    });

    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(button);
    vi.useRealTimers();
  });
});

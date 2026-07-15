import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatsSection } from "./StatsSection";

// Mock motion/react hooks to test behavior reliably across states
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useInView: vi.fn().mockReturnValue(true),
    useReducedMotion: vi.fn().mockReturnValue(true), // default to reduced motion so exact terminal values render immediately
    animate: vi.fn().mockReturnValue({ stop: vi.fn() }),
  };
});

describe("StatsSection", () => {
  it("renders all 3 approved labels cleanly", () => {
    render(<StatsSection />);

    expect(screen.getByText("Clients served across industries")).toBeInTheDocument();
    expect(screen.getByText("Live vertical SaaS products (EduOS · ArenaOS)")).toBeInTheDocument();
    expect(screen.getByText("Engineers, sales & support")).toBeInTheDocument();
  });

  it("renders exact final figures when reduced motion is active or on initial load", () => {
    render(<StatsSection />);

    expect(screen.getByText("73+")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("25+")).toBeInTheDocument();
  });

  it("renders within the gradient-stat-wash container and has proper aria label", () => {
    const { container } = render(<StatsSection />);
    const section = container.querySelector("section#stats");

    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("gradient-stat-wash");
    expect(section).toHaveAttribute("aria-label", "Company impact metrics");
  });
});

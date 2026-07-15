import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CapabilitiesPage from "./page";

describe("CapabilitiesPage", () => {
  it("renders the page hero and the three operating arms", () => {
    render(<CapabilitiesPage />);

    // Check page hero title
    expect(screen.getByText(/One company\./i)).toBeInTheDocument();
    expect(screen.getByText(/Three operating arms\./i)).toBeInTheDocument();

    // Check the three operating arm headings
    expect(screen.getByRole("heading", { name: "WnR Systems" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "WnR Consulting" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "WnR AI Labs" })).toBeInTheDocument();
  });

  it("renders the Approach section right after the three operating arms", () => {
    const { container } = render(<CapabilitiesPage />);
    expect(screen.getByText("Our Approach")).toBeInTheDocument();
    expect(
      screen.getByText(/We don't start with code\. We start with your operations\./i)
    ).toBeInTheDocument();

    // Verify DOM order: section#approach sits after section#ai-labs without any intervening case-studies section
    const sections = Array.from(container.querySelectorAll("section"));
    const aiLabsIndex = sections.findIndex((sec) => sec.id === "ai-labs");
    const approachIndex = sections.findIndex((sec) => sec.id === "approach");
    const caseStudiesIndex = sections.findIndex((sec) => sec.id === "case-studies");

    expect(aiLabsIndex).toBeGreaterThanOrEqual(0);
    expect(approachIndex).toBe(aiLabsIndex + 1);
    expect(caseStudiesIndex).toBe(-1);
  });
});

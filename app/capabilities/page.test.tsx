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

  it("renders the exact Case Studies section mounted right after the arms and right before the Approach section", () => {
    const { container } = render(<CapabilitiesPage />);

    // Verify CaseStudiesSection header elements appear
    expect(screen.getByText("SELECTED WORK")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Custom platforms\.Measurable outcomes\./i })
    ).toBeInTheDocument();

    // Verify the exact 3 case studies are rendered on the Capabilities page
    expect(screen.getByText("Recruitment Management Platform")).toBeInTheDocument();
    expect(screen.getByText("AI-Powered Student Success Platform")).toBeInTheDocument();
    expect(screen.getByText("Hyperlocal Food Marketplace")).toBeInTheDocument();

    // Verify DOM order: section#case-studies sits after section#ai-labs and before section#approach
    const sections = Array.from(container.querySelectorAll("section"));
    const aiLabsIndex = sections.findIndex((sec) => sec.id === "ai-labs");
    const caseStudiesIndex = sections.findIndex((sec) => sec.id === "case-studies");
    const approachIndex = sections.findIndex((sec) => sec.id === "approach");

    expect(aiLabsIndex).toBeGreaterThanOrEqual(0);
    expect(caseStudiesIndex).toBeGreaterThan(aiLabsIndex);
    expect(approachIndex).toBeGreaterThan(caseStudiesIndex);
  });

  it("renders the Approach section right after Case Studies", () => {
    render(<CapabilitiesPage />);
    expect(screen.getByText("Our Approach")).toBeInTheDocument();
    expect(
      screen.getByText(/We don't start with code\. We start with your operations\./i)
    ).toBeInTheDocument();
  });
});

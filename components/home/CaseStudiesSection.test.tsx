import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CaseStudiesSection } from "./CaseStudiesSection";

describe("CaseStudiesSection", () => {
  it("renders the section header and all 3 asymmetric featured cards", () => {
    render(<CaseStudiesSection />);

    // Header checks
    expect(screen.getByText("SELECTED WORK")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Custom platforms.Measurable outcomes.");
    expect(screen.getByRole("link", { name: /all insights/i })).toBeInTheDocument();

    // Verify all 3 case study headlines render
    expect(screen.getByText("Recruitment Management Platform")).toBeInTheDocument();
    expect(screen.getByText("AI-Powered Student Success Platform")).toBeInTheDocument();
    expect(screen.getByText("Hyperlocal Food Marketplace")).toBeInTheDocument();
  });

  it("assigns the correct expected href destinations to each link", () => {
    const { container } = render(<CaseStudiesSection />);
    const links = Array.from(container.querySelectorAll("a"));

    expect(links).toHaveLength(4);

    // Header link "All insights" links directly to /insights
    expect(links[0].getAttribute("href")).toBe("/insights");

    // Cards 1, 2, and 3 link to /insights#case-studies
    expect(links[1].getAttribute("href")).toBe("/insights#case-studies");
    expect(links[2].getAttribute("href")).toBe("/insights#case-studies");
    expect(links[3].getAttribute("href")).toBe("/insights#case-studies");
  });

  it("renders the Result line only on the featured card", () => {
    render(<CaseStudiesSection />);

    // Check that "Result —" appears once (for the featured large card)
    const resultTags = screen.getAllByText(/Result —/i);
    expect(resultTags).toHaveLength(1);
    expect(
      screen.getByText(/~60% reduction in manual processes, faster recruiter coordination, data-driven placement insights\./i)
    ).toBeInTheDocument();
  });

  it("ensures every card image has descriptive, non-empty alt text", () => {
    const { container } = render(<CaseStudiesSection />);
    const images = Array.from(container.querySelectorAll("img"));

    expect(images).toHaveLength(3);
    images.forEach((img) => {
      const altText = img.getAttribute("alt");
      expect(altText).toBeTruthy();
      expect(altText?.trim().length).toBeGreaterThan(10);
    });
  });

  it("marks all decorative icons with aria-hidden=true", () => {
    const { container } = render(<CaseStudiesSection />);
    const decorativeIcons = Array.from(container.querySelectorAll("svg"));

    expect(decorativeIcons.length).toBeGreaterThanOrEqual(4);
    decorativeIcons.forEach((svg) => {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
    });
  });

  it("includes reduced-motion classes (motion-reduce:transition-none) on animated elements", () => {
    const { container } = render(<CaseStudiesSection />);
    const animatedElements = Array.from(
      container.querySelectorAll(".motion-reduce\\:transition-none")
    );

    expect(animatedElements.length).toBeGreaterThanOrEqual(3);
    animatedElements.forEach((el) => {
      expect(el.className).toContain("motion-reduce:transition-none");
      expect(el.className).toContain("motion-reduce:group-hover:transform-none");
    });
  });

  it("applies default id, tone, and className when rendered without props", () => {
    const { container } = render(<CaseStudiesSection />);
    const section = container.querySelector("section");
    expect(section?.getAttribute("id")).toBe("case-studies");
    expect(section?.className).toContain("bg-canvas");
    expect(section?.className).toContain("pt-2");
  });

  it("supports custom id, tone, and className overrides for safe reuse across pages like /capabilities", () => {
    const { container } = render(
      <CaseStudiesSection id="capabilities-case-studies" tone="mist" className="custom-spacing" />
    );
    const section = container.querySelector("section");
    expect(section?.getAttribute("id")).toBe("capabilities-case-studies");
    expect(section?.className).toContain("bg-mist");
    expect(section?.className).toContain("custom-spacing");
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThreeArmSection } from "./ThreeArmSection";

describe("ThreeArmSection", () => {
  it("renders the left column headline, eyebrow, and introductory paragraph", () => {
    render(<ThreeArmSection />);

    expect(screen.getByText("OUR OPERATIONAL ARMS")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "The operational brain of your business."
    );
    expect(
      screen.getByText(/We build the operational brain of your business/i)
    ).toBeInTheDocument();
  });

  it("renders all 3 cards with correct titles and descriptions", () => {
    render(<ThreeArmSection />);

    expect(screen.getByText("WnR Systems")).toBeInTheDocument();
    expect(
      screen.getByText(/Custom operational builds, ERPs, web platforms, mobile apps/i)
    ).toBeInTheDocument();

    expect(screen.getByText("WnR Consulting")).toBeInTheDocument();
    expect(
      screen.getByText(/Operational advisory\. Map workflows, identify losses/i)
    ).toBeInTheDocument();

    expect(screen.getByText("WnR AI Labs")).toBeInTheDocument();
    expect(
      screen.getByText(/Builds the AI and automation layer powering all products/i)
    ).toBeInTheDocument();
  });

  it("assigns correct href destinations to each card link", () => {
    const { container } = render(<ThreeArmSection />);
    const links = Array.from(container.querySelectorAll("a"));

    expect(links).toHaveLength(3);
    expect(links[0].getAttribute("href")).toBe("/capabilities#systems");
    expect(links[1].getAttribute("href")).toBe("/capabilities#consulting");
    expect(links[2].getAttribute("href")).toBe("/capabilities#ai-labs");
  });

  it("marks all decorative icons with aria-hidden=true", () => {
    const { container } = render(<ThreeArmSection />);
    const decorativeIcons = Array.from(container.querySelectorAll("svg"));

    expect(decorativeIcons.length).toBeGreaterThanOrEqual(6);
    decorativeIcons.forEach((svg) => {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
    });
  });
});

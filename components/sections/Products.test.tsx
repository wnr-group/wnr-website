import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Products } from "./Products";

describe("Products section", () => {
  it("does not render the future-products coming-soon strip", () => {
    render(<Products />);
    expect(screen.queryByText("More operating systems, coming soon.")).not.toBeInTheDocument();
    expect(screen.queryByText("Healthcare")).not.toBeInTheDocument();
    expect(screen.queryByText("Manufacturing")).not.toBeInTheDocument();
    expect(screen.queryByText("Retail")).not.toBeInTheDocument();
    expect(screen.queryByText("Construction")).not.toBeInTheDocument();
    expect(screen.queryByText("Hospitality")).not.toBeInTheDocument();
  });

  it("still renders the products heading and grid", async () => {
    render(<Products heading="Vertical operating systems, shipping today." />);
    expect(screen.getByText("Vertical operating systems, shipping today.")).toBeInTheDocument();
    expect(screen.getByText("Our Products")).toBeInTheDocument();
    // Verify a stable product card is rendered from the dynamic grid
    expect(await screen.findByText("ArenaOS")).toBeInTheDocument();
  });

  it("renders with the default heading when no heading prop is passed", () => {
    render(<Products />);
    expect(screen.getByText("Vertical operating systems.")).toBeInTheDocument();
  });
});

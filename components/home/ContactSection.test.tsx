import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { ContactSection } from "./ContactSection";

// Mock IntersectionObserver for Reveal motion component inside Section wrapper
beforeAll(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;
});

describe("ContactSection", () => {
  it("renders heading, eyebrow, and form elements properly", () => {
    render(<ContactSection />);
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Let’s talk about your operations\./i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Message/i })).toBeInTheDocument();
  });

  it("has the anchor id 'contact' for smooth scrolling from hero button", () => {
    const { container } = render(<ContactSection />);
    const section = container.querySelector("section#contact");
    expect(section).not.toBeNull();
    expect(section).toHaveClass("scroll-mt-24");
  });
});

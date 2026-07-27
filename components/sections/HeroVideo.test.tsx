import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { HeroVideo } from "./HeroVideo";

describe("HeroVideo", () => {
  beforeEach(() => {
    // Mock HTMLMediaElement prototype methods if needed in jsdom
    window.HTMLMediaElement.prototype.load = vi.fn();
    window.HTMLMediaElement.prototype.play = vi.fn().mockImplementation(() => Promise.resolve());
    window.HTMLMediaElement.prototype.pause = vi.fn();

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("renders the hero banner section with accessible screen reader heading", () => {
    render(<HeroVideo />);

    const section = screen.getByRole("region", { name: /hero video banner/i });
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("min-h-[52dvh]");
    expect(section).toHaveClass("sm:min-h-[88vh]");

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("WnRTech: Operational intelligence for modern business.");
    expect(heading).toHaveClass("sr-only");
  });

  it("configures HTML5 video element with correct source, poster, and playback flags", () => {
    const { container } = render(<HeroVideo />);

    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video?.getAttribute("poster")).toBe("/brand/hero-loop-poster.webp");
    expect(video?.getAttribute("preload")).toBe("auto");
    expect(video?.getAttribute("aria-hidden")).toBe("true");
    expect(video?.getAttribute("tabindex")).toBe("-1");

    const source = container.querySelector("source");
    expect(source).toBeInTheDocument();
    expect(source?.getAttribute("src")).toBe("/brand/wnr-video.mp4");
    expect(source?.getAttribute("type")).toBe("video/mp4");
  });

  it("renders decorative dark overlay and bottom gradient fade elements", () => {
    const { container } = render(<HeroVideo />);

    const decorativeDivs = container.querySelectorAll("div[aria-hidden='true']");
    expect(decorativeDivs.length).toBeGreaterThanOrEqual(2);
  });

  it("renders floating CTA link with correct href and aria-label", () => {
    render(<HeroVideo />);

    const ctaLink = screen.getByRole("link", { name: /smooth scroll to contact form section/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "#contact");
    expect(ctaLink).toHaveTextContent("Let’s talk");
  });

  it("handles CTA smooth scrolling when clicked and target element exists", () => {
    render(<HeroVideo />);

    const targetEl = document.createElement("div");
    targetEl.id = "contact";
    targetEl.scrollIntoView = vi.fn();
    document.body.appendChild(targetEl);

    const ctaLink = screen.getByRole("link", { name: /smooth scroll to contact form section/i });
    fireEvent.click(ctaLink);

    expect(targetEl.scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth", block: "center" })
    );

    document.body.removeChild(targetEl);
  });
});

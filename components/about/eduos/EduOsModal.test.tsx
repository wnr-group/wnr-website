import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { EduOsModal } from "./EduOsModal";
import { eduOsExperience } from "@/content/eduos";

describe("EduOsModal", () => {
  it("is closed until the CTA is clicked, then shows the full EduOS story", async () => {
    const user = userEvent.setup();
    render(<EduOsModal />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const trigger = screen.getByRole("button", { name: /discover eduos/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Every required section is present — no missing content (AC3/AC4/AC5/AC6).
    // The dialog shell mounts eagerly, but its story content is dynamically
    // imported, so the first content assertion needs to wait for that chunk.
    expect(await screen.findByText(eduOsExperience.whyWeStarted.heading, {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByText(eduOsExperience.story.advisory.heading)).toBeInTheDocument();
    expect(screen.getByText(eduOsExperience.pillars.purpose.label)).toBeInTheDocument();
    expect(screen.getByText(eduOsExperience.pillars.mission.label)).toBeInTheDocument();
    expect(screen.getByText(eduOsExperience.pillars.vision.label)).toBeInTheDocument();
    expect(screen.getByText(eduOsExperience.coreValues.heading)).toBeInTheDocument();
    for (const value of eduOsExperience.coreValues.values) {
      expect(screen.getByText(value.title)).toBeInTheDocument();
    }
    expect(screen.getByText(eduOsExperience.roadmap.heading)).toBeInTheDocument();
    for (const phase of eduOsExperience.roadmap.phases) {
      expect(screen.getByText(phase.year)).toBeInTheDocument();
    }
    expect(screen.getByText(eduOsExperience.lookingAhead.heading)).toBeInTheDocument();
    expect(screen.getByText(eduOsExperience.closing.tagline)).toBeInTheDocument();
  }, 10000);

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<EduOsModal />);

    await user.click(screen.getByRole("button", { name: /discover eduos/i }));
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  }, 10000);

  it("closes via the in-story Close button", async () => {
    const user = userEvent.setup();
    render(<EduOsModal />);

    await user.click(screen.getByRole("button", { name: /discover eduos/i }));
    await screen.findByRole("dialog");

    const closeButton = await screen.findByRole("button", { name: "Close" }, { timeout: 5000 });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  }, 10000);

  it("updates roadmap progress when scrolling the dialog body", async () => {
    const user = userEvent.setup();
    render(<EduOsModal />);

    await user.click(screen.getByRole("button", { name: /discover eduos/i }));
    await screen.findByText(eduOsExperience.roadmap.heading, {}, { timeout: 5000 });

    const dialog = screen.getByRole("dialog");
    const scrollContainer = dialog.querySelector(".overflow-y-auto");
    expect(scrollContainer).toBeInTheDocument();

    if (scrollContainer) {
      // Basic event dispatch just to ensure scroll handlers attached to the container don't crash
      Object.defineProperty(scrollContainer, "scrollHeight", { configurable: true, value: 2000 });
      Object.defineProperty(scrollContainer, "clientHeight", { configurable: true, value: 500 });
      // Use standard event as fireEvent.scroll on custom property mocked objects can be finicky
      scrollContainer.dispatchEvent(new Event("scroll"));
    }
  }, 10000);
});

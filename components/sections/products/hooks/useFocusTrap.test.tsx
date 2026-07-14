import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { useFocusTrap } from "./useFocusTrap";

function TrapHarness({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(containerRef, active);
  return (
    <div>
      <button>outside-before</button>
      <div ref={containerRef}>
        <button>first</button>
        <button>last</button>
      </div>
      <button>outside-after</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("wraps Tab from the last focusable element back to the first", async () => {
    const user = userEvent.setup();
    render(<TrapHarness active />);
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>("button"),
    );
    const last = buttons[2]!;
    const first = buttons[1]!;
    last.focus();
    await user.tab();
    expect(document.activeElement).toBe(first);
  });

  it("wraps Shift+Tab from the first focusable element back to the last", async () => {
    const user = userEvent.setup();
    render(<TrapHarness active />);
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>("button"),
    );
    const first = buttons[1]!;
    const last = buttons[2]!;
    first.focus();
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);
  });

  it("does nothing when inactive", async () => {
    const user = userEvent.setup();
    render(<TrapHarness active={false} />);
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>("button"),
    );
    const last = buttons[2]!;
    last.focus();
    await user.tab();
    expect(document.activeElement?.textContent).toBe("outside-after");
  });
});

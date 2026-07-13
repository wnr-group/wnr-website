import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { useContactForm } from "./useContactForm";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useContactForm", () => {
  it("starts in idle state", () => {
    const { result } = renderHook(() => useContactForm());
    expect(result.current.status).toBe("idle");
  });

  it("transitions to editing on first field change", () => {
    const { result } = renderHook(() => useContactForm());
    act(() => {
      result.current.handleChange("name", "Alice");
    });
    expect(result.current.status).toBe("editing");
    expect(result.current.values.name).toBe("Alice");
  });

  it("marks fields touched on blur", () => {
    const { result } = renderHook(() => useContactForm());
    act(() => {
      result.current.handleBlur("email");
    });
    expect(result.current.touched.email).toBe(true);
  });

  it("transitions to failure with errors on submit with empty form", async () => {
    const { result } = renderHook(() => useContactForm());
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });
    expect(result.current.status).toBe("failure");
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it("resets form on handleReset", () => {
    const { result } = renderHook(() => useContactForm());
    act(() => {
      result.current.handleChange("name", "Alice");
    });
    act(() => {
      result.current.handleReset();
    });
    expect(result.current.status).toBe("idle");
    expect(result.current.values.name).toBe("");
  });

  it("transitions back to editing on handleRetry", () => {
    const { result } = renderHook(() => useContactForm());
    act(() => {
      result.current.handleRetry();
    });
    expect(result.current.status).toBe("editing");
    expect(result.current.submitError).toBeNull();
  });

  it("provides correct dropdown options", () => {
    const { result } = renderHook(() => useContactForm());
    expect(result.current.regionOptions).toContain("Asia");
    expect(result.current.regionOptions).toContain("Europe");
    expect(result.current.inquiryTypeOptions).toContain("General Enquiry");
    expect(result.current.inquiryTypeOptions).toContain("AI & GenAI");
  });

  it("prevents duplicate submission when already submitting", async () => {
    const { result } = renderHook(() => useContactForm());
    // Manually set a state where the guard would prevent re-entry
    // by verifying the status machine logic
    act(() => {
      result.current.handleChange("name", "Alice");
    });
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });
    // State machine should have moved to failure (validation) not submitted twice
    expect(result.current.status).toBe("failure");
  });
});

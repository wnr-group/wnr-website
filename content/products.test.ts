import { describe, expect, it } from "vitest";
import { getProduct } from "@/content/products";

describe("ArenaOS content", () => {
  it("uses the updated target, moat, and revenue copy", () => {
    const arenaos = getProduct("arenaos");
    expect(arenaos).toBeDefined();
    expect(arenaos?.target).toBe("Gaming cafes with 10+ stations");
    expect(arenaos?.moat).toBe("India's first and only full gaming cafe OS");
    expect(arenaos?.revenueValue).toBe("Productised SaaS for chains across the globe");
  });

  it("leaves every other ArenaOS field unchanged", () => {
    const arenaos = getProduct("arenaos");
    expect(arenaos?.name).toBe("ArenaOS");
    expect(arenaos?.tagline).toBe("The operating system for booking-led businesses.");
    expect(arenaos?.revenueLabel).toBe("Pipeline");
    expect(arenaos?.accent).toBe("amber");
  });
});

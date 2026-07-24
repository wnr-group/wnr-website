# Infosys-Style Interactive Product List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current "click a product card → navigate to a detail page"
flow with an in-page grid-to-hero interaction: clicking a product card swaps the
grid for an in-page hero showing full product detail, with a Back button that
restores the grid — no page reload, no route change, no scroll jump.

**Architecture:** Decompose the existing single-file
`components/sections/Products.tsx` into a small component tree under
`components/sections/products/`. `Products.tsx` stays a Server Component
(unchanged import path, unchanged `heading` prop) that renders the section
chrome (eyebrow/heading/future-products strip) exactly as before, and delegates
the interactive part to a new Client Component, `ProductsSection`, which owns
`selected: Product | null` state and swaps between `ProductGrid` and
`ProductHero` via a shared `AnimatePresence` transition. All content the grid
and hero display comes from one extended `Product` model in
`content/products.ts` — no content is duplicated between the grid, the hero, and
the existing standalone product pages.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind
v4 (CSS-first theme, no config file), `motion` (`motion/react`, LazyMotion/`m.*`
convention already established), Vitest + React Testing Library (new — no test
runner currently exists in this repo).

## Global Constraints

- Do not modify: Header, Footer, Hero banner, Capabilities, AI Native, Case
  Studies, About, Careers, Contact Form, global theme/layout/navigation,
  existing product detail pages/routes (`app/products/eduos/page.tsx`,
  `app/products/arenaos/page.tsx`, `components/sections/ProductDetail.tsx`),
  SEO/metadata, analytics, APIs, CMS, Tailwind config, design tokens, global
  CSS, typography, or accessibility behavior outside the Products section.
- No new animation library — reuse `motion` (`motion/react`, the `m` primitive,
  `EASE = [0.22, 1, 0.36, 1]`) exactly as used in `components/ui/motion.tsx` and
  `components/layout/Header.tsx`.
- No page reload, no route change (`useRouter`/`window.location` are forbidden
  for the grid↔hero swap), no forced scroll (`scrollIntoView`/`window.scrollTo`
  are forbidden anywhere in this feature).
- Animation duration 250–350ms per phase, GPU transforms only
  (`opacity`/`transform`), must respect `prefers-reduced-motion` (already
  handled globally via `MotionConfig reducedMotion="user"` in
  `components/ui/motion.tsx` — no extra work needed, just don't bypass it).
- Strict TypeScript, no `any`, no dead/commented-out code.
- Single source of truth for product content: `content/products.ts`. The grid,
  the hero, and the existing detail pages all read from the same `Product`
  objects — never duplicate a piece of copy into two different fields with the
  same value.

## Audit Summary (Step 1 — completed, no code changes)

**Current architecture.** The "Products" section is one file,
`components/sections/Products.tsx`, mounted both on the homepage
(`app/page.tsx:19`, no `heading` prop) and on `app/products/page.tsx:31`
(`heading="Vertical operating systems, shipping today."`). It is a Server
Component. There is no separate `ProductCard` component today — each card is an
inline `<article>` rendered directly inside `products.map()` inside
`Products.tsx` (lines 46–108 of the current file), laid out as a wide
alternating 2-column "showcase panel" (`grid ... lg:grid-cols-2`, image
alternating left/right), not a grid of equal-sized cards. There is no
intermediate `ProductGrid` component.

**Current component tree:**

```
app/page.tsx
  └── Products (components/sections/Products.tsx)
        └── Section (components/ui/Section.tsx) — wraps content in <Reveal>, applies tone/padding
              └── products.map() → inline <article> showcase panel per product
                    └── Cta (components/ui/Cta.tsx) → next/link to /products/<slug>
```

**Current data flow.** `content/products.ts` exports a typed `Product[]`
(`products`) and a plain object `futureProducts` (a "coming soon" pill list, not
full `Product` records). `Products.tsx` imports `products` and `futureProducts`
directly (build-time static data, no fetch/CMS). `getProduct(slug)` is a lookup
helper used only by the two standalone detail pages.

**Current navigation flow.** Each card's CTA is a real `next/link` (via `Cta`)
to `product.href` (`/products/eduos`, `/products/arenaos`). Clicking navigates
away to a full detail page rendered by `components/sections/ProductDetail.tsx`,
which itself reads the same `Product` object plus two page-specific props
(`ctaHeading`, `ctaBody`). Those routes are hand-created static folders
(`app/products/eduos/page.tsx`, `app/products/arenaos/page.tsx`), not a dynamic
`[slug]` route — this plan does not touch that routing structure.

**Current risks / constraints carried into this plan:**

- `product.href` and the two detail routes must keep working unmodified (this
  plan reuses `product.href` as the hero's secondary "View Full Solution" link,
  pointing at the same still-live detail pages).
- The `accent: "teal" | "amber"` closed union and its `chip`/`dot`/`tagline`
  style lookup (currently inline in `Products.tsx:11-25`) is reused verbatim,
  moved into a new `constants.ts`.
- No test runner exists in the repo at all (`package.json` has no test script,
  no jest/vitest/testing-library/playwright/cypress dependency) — Task 1 below
  bootstraps Vitest + React Testing Library from scratch, since the spec's
  completion criteria require unit tests.
- Next.js 16 deprecates `next/image`'s `priority` prop in favor of `preload`
  (see
  `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`).
  `ProductDetail.tsx` still uses the old `priority` prop, but since
  `ProductDetail.tsx` is out of scope for this feature, it is left untouched.
  New code in this plan does not use either prop (Next.js 16 defaults the image to lazy loading. The hero image is below-the-fold and out of scope, so this behavior is correct without recommending either deprecated priority or preload props).

## Files

**Created:**

- `components/sections/products/constants.ts` — accent style map + shared motion
  constants
- `components/sections/products/types.ts` — local prop types for the new
  components
- `components/sections/products/hooks/useProductSelection.ts` — selection state,
  trigger-ref registry, focus restore, Escape-to-close
- `components/sections/products/hooks/useProductSelection.test.ts` — unit test
  for the hook
- `components/sections/products/hooks/useFocusTrap.ts` — Tab-cycle containment
  while the hero is open
- `components/sections/products/hooks/useFocusTrap.test.ts` — unit test for the
  hook
- `components/sections/products/ProductCard.tsx` — one grid card (now a
  `<button>`, not a link)
- `components/sections/products/ProductCard.test.tsx`
- `components/sections/products/ProductGrid.tsx` — renders `products.map()` of
  `ProductCard`
- `components/sections/products/ProductGrid.test.tsx`
- `components/sections/products/ProductContent.tsx` — hero body copy
  (overview/problem/solution/capabilities/industries/technology/outcomes/stats)
- `components/sections/products/ProductActions.tsx` — hero primary + secondary
  CTA
- `components/sections/products/ProductTransition.tsx` — shared
  `AnimatePresence` fade wrapper
- `components/sections/products/ProductHero.tsx` — assembles image + back
  button + `ProductContent` + `ProductActions`
- `components/sections/products/ProductsSection.tsx` — client orchestrator (owns
  state, swaps grid/hero)
- `components/sections/products/ProductsSection.test.tsx` — integration test
  (click → hero → back → grid, Escape, focus restore)
- `vitest.config.ts`, `vitest.setup.ts` — test runner configuration

**Modified:**

- `content/products.ts` — additive `Product` interface fields (`overview`,
  `businessProblem`, `solution`, `industries`, `technology`) + real content for
  `eduos`/`arenaos`. Existing fields (`slug`, `name`, `label`, `tagline`,
  `oneLiner`, `roi`, `features`, `href`, `ctaLabel`, `art`, `accent`, `target`,
  `moat`, `revenueLabel`, `revenueValue`) are untouched, so `ProductDetail.tsx`
  and the two detail pages keep compiling and rendering exactly as before.
- `components/sections/Products.tsx` — required for this feature: this is the
  exact file the spec asks to change the interaction of. Keeps its `Products`
  export name and `{ heading? }` prop signature (so `app/page.tsx` and
  `app/products/page.tsx` need zero changes), keeps the eyebrow/heading block
  and the "future products" closing strip verbatim, but replaces the inline card
  markup with `<ProductsSection products={products} />`.
- `package.json` — adds `"test": "vitest run"` script and test-only
  devDependencies.

**Untouched:** `app/page.tsx`, `app/products/page.tsx`,
`app/products/eduos/page.tsx`, `app/products/arenaos/page.tsx`,
`components/sections/ProductDetail.tsx`, `components/layout/Header.tsx`,
`components/layout/Footer.tsx`, `components/ui/Section.tsx`,
`components/ui/Cta.tsx`, `components/ui/motion.tsx`,
`components/ui/PageHero.tsx`, `app/globals.css`, all other sections/pages,
ESLint config, `tsconfig.json`.

## Data Model Decision — no separate `heroImage` field

The spec's example data shape lists a `heroImage` field. This plan does **not**
add one: both existing products have exactly one artwork asset (`product.art`),
and adding `heroImage` with the same value as `art` would itself be the
"duplicated data" the spec explicitly forbids. The hero reuses `product.art` for
its large image. If a product ever needs a distinct hero-resolution image, add
`heroImage?: string` to the `Product` interface then and fall back to `art` —
not needed today.

Similarly, "optional metrics" and "business outcomes" are **not** new fields —
the hero reuses the existing `target`/`moat`/`revenueLabel`/`revenueValue` trio
(the same three stats `ProductDetail.tsx` already renders) and the existing
`roi` string, so the grid, the hero, and the standalone detail pages all consume
identical data for those sections.

---

### Task 1: Bootstrap Vitest + React Testing Library

**Files:**

- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Test: (this task creates the test infra itself; verified by running an inline
  smoke test)

**Interfaces:**

- Produces: `vitest run` script, `@/*` path alias resolvable from test files,
  jsdom environment, `@testing-library/jest-dom` matchers globally available.

- [ ] **Step 1: Install test dependencies**

Run:

```bash
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Add the `test` script to `package.json`**

Modify `package.json` — change the `"scripts"` block from:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
},
```

to:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run"
},
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    environmentOptions: {
      jsdom: { pretendToBeVisual: true },
    },
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

- [ ] **Step 4: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Smoke-test the setup**

Create a throwaway file `vitest.smoke.test.ts` in the repo root:

```ts
import { describe, expect, it } from "vitest";

describe("vitest setup", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `npm run test` Expected: `1 passed` in the output.

Delete `vitest.smoke.test.ts` after confirming it passes — it was only there to
validate the config.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "chore: add vitest + react testing library for unit tests"
```

---

### Task 2: Extend the product data model

**Files:**

- Modify: `content/products.ts`

**Interfaces:**

- Produces: `Product` interface gains required fields `overview: string`,
  `businessProblem: string`, `solution: string`, `industries: string[]`,
  `technology: string[]`. All other fields and `getProduct(slug)` are unchanged,
  so `ProductDetail.tsx` and the two detail pages keep compiling.

- [ ] **Step 1: Replace the full content of `content/products.ts`**

```ts
// Section 9 — Products. Each vertical SaaS product gets a premium moment.

export interface Product {
  slug: string;
  name: string;
  label: string; // e.g. "LIVE · VERTICAL SAAS"
  tagline: string;
  oneLiner: string;
  roi?: string;
  features: string[];
  href: string;
  ctaLabel: string;
  art: string; // vibrant product-brand artwork (under /brand)
  accent: "teal" | "amber"; // secondary accent tuned to the art
  // Detail-page extras
  target: string;
  moat: string;
  revenueLabel: string;
  revenueValue: string;
  // In-page product hero extras
  overview: string;
  businessProblem: string;
  solution: string;
  industries: string[];
  technology: string[];
}

export const products: Product[] = [
  {
    slug: "eduos",
    name: "EduOS",
    label: "Live · Vertical SaaS",
    tagline: "The operating brain for schools.",
    oneLiner:
      "Fees, attendance, academics, staff operations, and parent communication — one platform replacing spreadsheets, registers, and four WhatsApp groups. Configured to each school's real workflows.",
    roi:
      "The ROI is concrete: an 800-student school loses around ₹9.6L a year in leaky systems. EduOS recovers it.",
    features: [
      "Fee management & collections",
      "Attendance tracking",
      "Parent communication portal",
      "Staff operations",
      "Academic workflows",
      "Admin dashboards",
    ],
    href: "/products/eduos",
    ctaLabel: "Explore EduOS",
    art: "/brand/product-eduos.webp",
    accent: "teal",
    target: "Schools with 300–2,000 students. South India + UAE.",
    moat:
      "Implementation depth + staff training + ongoing operational partnership.",
    revenueLabel: "SaaS Revenue",
    revenueValue: "₹1,000/month per school post-implementation",
    overview:
      "EduOS is the single operating system a school runs on — fees, attendance, academics, staff operations, and parent communication in one connected platform, configured to how the school actually works rather than forcing a generic template.",
    businessProblem:
      "Schools run fees, attendance, and parent communication across disconnected spreadsheets, paper registers, and ad-hoc WhatsApp groups. Nothing reconciles automatically, and the gaps leak revenue and staff hours every term.",
    solution:
      "EduOS unifies fee collection, attendance, academic workflows, staff operations, and parent communication into one implemented platform, configured against the school's real processes during onboarding rather than a one-size-fits-all setup.",
    industries: ["K-12 Schools", "Higher Education", "Coaching Institutes"],
    technology: [
      "Cloud-hosted platform",
      "Role-based admin dashboards",
      "Mobile parent portal",
      "Payment gateway integration",
    ],
  },
  {
    slug: "arenaos",
    name: "ArenaOS",
    label: "Live · Vertical SaaS",
    tagline: "The full business OS for gaming cafes.",
    oneLiner:
      "Billing tools tell you what you charged. ArenaOS tells you how your business is actually performing — station booking, real-time revenue, and operational BI in one system.",
    roi:
      "Station & session management · Real-time revenue tracking · Operational dashboards & BI · UPI and GST ready.",
    features: [
      "Station & session management",
      "Real-time revenue tracking",
      "Operational dashboards & BI",
      "UPI & GST ready",
      "Business intelligence",
    ],
    href: "/products/arenaos",
    ctaLabel: "Explore ArenaOS",
    art: "/brand/product-arenaos.webp",
    accent: "amber",
    target: "Gaming cafes with 10+ stations. India.",
    moat: "India's only full gaming cafe OS.",
    revenueLabel: "Pipeline",
    revenueValue: "Productised SaaS for chains across India",
    overview:
      "ArenaOS is the full business operating system for gaming cafes — station and session booking, real-time revenue tracking, and operational business intelligence in one system, in place of billing software that only records what was charged.",
    businessProblem:
      "Gaming cafe owners typically run on billing tools that log transactions but say nothing about station utilization, peak hours, or true business performance — decisions get made on gut feel, not data.",
    solution:
      "ArenaOS combines station and session management with real-time revenue tracking and operational dashboards, giving owners a live, accurate read on how the business is performing, with UPI and GST-ready billing built in.",
    industries: ["Gaming Cafes", "Esports Lounges", "Entertainment Centers"],
    technology: [
      "Cloud-hosted platform",
      "Real-time analytics dashboards",
      "UPI & GST-ready billing",
      "Station & session management engine",
    ],
  },
];

// "Coming soon" future products grid — portfolio ambition.
export const futureProducts = {
  eyebrow: "The Portfolio",
  heading: "More operating systems, coming soon.",
  list: [
    "Healthcare",
    "Manufacturing",
    "Retail",
    "Construction",
    "Hospitality",
  ],
};

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` Expected: no errors (the only consumers of `Product`
today are `Products.tsx` and `ProductDetail.tsx` / the two detail pages, none of
which use `satisfies`/exact-object checks that would reject the new required
fields on `products` array literals — the array literal above supplies every
field).

- [ ] **Step 3: Commit**

```bash
git add content/products.ts
git commit -m "feat: extend product data model with hero content fields"
```

---

### Task 3: Shared constants and types

**Files:**

- Create: `components/sections/products/constants.ts`
- Create: `components/sections/products/types.ts`

**Interfaces:**

- Consumes: `Product` from `@/content/products` (Task 2).
- Produces: `EASE`, `TRANSITION_DURATION`, `accent` (imported by every component
  in this feature); `ProductCardProps`, `ProductGridProps`, `ProductHeroProps`,
  `ProductContentProps`, `ProductActionsProps` (imported by their matching
  components).

- [ ] **Step 1: Create `components/sections/products/constants.ts`**

```ts
// Shared motion + style constants for the interactive product list.
// EASE matches the codebase-wide easing curve (components/ui/motion.tsx,
// components/layout/Header.tsx) so this feature's transitions feel identical
// to the rest of the site.
export const EASE = [0.22, 1, 0.36, 1] as const;
export const TRANSITION_DURATION = 0.3;

export const accent: Record<
  string,
  { chip: string; dot: string; tagline: string }
> = {
  teal: {
    chip: "border-teal/20 bg-teal-wash text-teal",
    dot: "bg-teal",
    tagline: "text-teal",
  },
  amber: {
    chip: "border-amber/25 bg-amber-wash text-amber",
    dot: "bg-amber",
    tagline: "text-amber",
  },
};
```

- [ ] **Step 2: Create `components/sections/products/types.ts`**

```ts
import type { Product } from "@/content/products";

export type { Product };

export type RegisterTrigger = (
  slug: string,
  el: HTMLButtonElement | null,
) => void;

export interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  registerTrigger: RegisterTrigger;
}

export interface ProductGridProps {
  products: Product[];
  onSelect: (product: Product) => void;
  registerTrigger: RegisterTrigger;
}

export interface ProductHeroProps {
  product: Product;
  onClose: () => void;
  heroRef: React.RefObject<HTMLDivElement | null>;
}

export interface ProductContentProps {
  product: Product;
}

export interface ProductActionsProps {
  product: Product;
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit` Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/products/constants.ts components/sections/products/types.ts
git commit -m "feat: add shared constants and types for product list feature"
```

---

### Task 4: `useProductSelection` hook

**Files:**

- Create: `components/sections/products/hooks/useProductSelection.ts`
- Test: `components/sections/products/hooks/useProductSelection.test.ts`

**Interfaces:**

- Consumes: `Product`, `RegisterTrigger` from `./types` (Task 3, one level up:
  `../types`).
- Produces:
  `useProductSelection(): { selected: Product | null; open: (product: Product) => void; close: () => void; registerTrigger: RegisterTrigger; heroRef: React.RefObject<HTMLDivElement | null> }`
  — consumed by `ProductsSection` (Task 12).

- [ ] **Step 1: Write the failing test**

```ts
// components/sections/products/hooks/useProductSelection.test.ts
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useProductSelection } from "./useProductSelection";
import type { Product } from "../types";

const product: Product = {
  slug: "eduos",
  name: "EduOS",
  label: "Live",
  tagline: "tagline",
  oneLiner: "one liner",
  features: [],
  href: "/products/eduos",
  ctaLabel: "Explore EduOS",
  art: "/brand/product-eduos.webp",
  accent: "teal",
  target: "target",
  moat: "moat",
  revenueLabel: "Revenue",
  revenueValue: "value",
  overview: "overview",
  businessProblem: "problem",
  solution: "solution",
  industries: [],
  technology: [],
};

describe("useProductSelection", () => {
  it("starts with nothing selected", () => {
    const { result } = renderHook(() => useProductSelection());
    expect(result.current.selected).toBeNull();
  });

  it("open() selects the product, close() clears it", () => {
    const { result } = renderHook(() => useProductSelection());
    act(() => result.current.open(product));
    expect(result.current.selected).toEqual(product);
    act(() => result.current.close());
    expect(result.current.selected).toBeNull();
  });

  it("closes on Escape when a product is selected", () => {
    const { result } = renderHook(() => useProductSelection());
    act(() => result.current.open(product));
    expect(result.current.selected).toEqual(product);
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(result.current.selected).toBeNull();
  });

  it("restores focus to the registered trigger button on close", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useProductSelection());
    const button = document.createElement("button");
    document.body.appendChild(button);
    const focusSpy = vi.spyOn(button, "focus");

    act(() => result.current.registerTrigger(product.slug, button));
    act(() => result.current.open(product));
    act(() => result.current.close());
    act(() => {
      vi.runAllTimers();
    });

    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(button);
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- useProductSelection` Expected: FAIL —
`Cannot find module './useProductSelection'`.

- [ ] **Step 3: Write the implementation**

```ts
// components/sections/products/hooks/useProductSelection.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product, RegisterTrigger } from "../types";

/* Owns which product's in-page hero is open. Restores keyboard focus to the
   card that opened the hero when it closes (WCAG focus-restoration), and
   closes on Escape. Focuses the hero only after it mounts following the grid exit,
   and restores focus to the trigger only after the hero exit completes. */
export function useProductSelection() {
  const [selected, setSelected] = useState<Product | null>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const heroRef = useRef<HTMLDivElement | null>(null);

  const registerTrigger: RegisterTrigger = useCallback((slug, el) => {
    if (el) {
      triggerRefs.current.set(slug, el);
    } else {
      triggerRefs.current.delete(slug);
    }
  }, []);

  const open = useCallback((product: Product) => {
    setSelected(product);
  }, []);

  const close = useCallback(() => {
    setSelected(null);
  }, []);

  // Called by the hero component when it enters
  const onHeroEnter = useCallback(() => {
    heroRef.current?.focus();
  }, []);

  // Called by the hero component when it finishes exiting
  const onHeroExit = useCallback((slug: string) => {
    const trigger = triggerRefs.current.get(slug);
    trigger?.focus();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, close]);

  return { selected, open, close, registerTrigger, heroRef, onHeroEnter, onHeroExit };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- useProductSelection` Expected: `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/sections/products/hooks/useProductSelection.ts components/sections/products/hooks/useProductSelection.test.ts
git commit -m "feat: add useProductSelection hook for in-page product hero state"
```

---

### Task 5: `useFocusTrap` hook

**Files:**

- Create: `components/sections/products/hooks/useFocusTrap.ts`
- Test: `components/sections/products/hooks/useFocusTrap.test.ts`

**Interfaces:**

- Produces:
  `useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, active: boolean): void`
  — consumed by `ProductHero` (Task 11).

- [ ] **Step 1: Write the failing test**

```ts
// components/sections/products/hooks/useFocusTrap.test.ts
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
    const first = screen.getByRole("button", { name: "first" });
    const last = screen.getByRole("button", { name: "last" });
    last.focus();
    await user.tab();
    expect(document.activeElement).toBe(first);
  });

  it("wraps Shift+Tab from the first focusable element back to the last", async () => {
    const user = userEvent.setup();
    render(<TrapHarness active />);
    const first = screen.getByRole("button", { name: "first" });
    const last = screen.getByRole("button", { name: "last" });
    first.focus();
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);
  });

  it("does nothing when inactive", async () => {
    const user = userEvent.setup();
    render(<TrapHarness active={false} />);
    const last = screen.getByRole("button", { name: "last" });
    last.focus();
    await user.tab();
    expect(document.activeElement?.textContent).toBe("outside-after");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- useFocusTrap` Expected: FAIL —
`Cannot find module './useFocusTrap'`.

- [ ] **Step 3: Write the implementation**

```ts
// components/sections/products/hooks/useFocusTrap.ts
"use client";

import { useEffect } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Contains Tab/Shift+Tab cycling within `containerRef` while `active` is
   true, mirroring standard dialog focus-trap behaviour. Used by
   ProductHero so keyboard users can't tab out of the open hero into the
   rest of the page (spec requirement: "Focus trap"). */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [containerRef, active]);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- useFocusTrap` Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/sections/products/hooks/useFocusTrap.ts components/sections/products/hooks/useFocusTrap.test.ts
git commit -m "feat: add useFocusTrap hook for product hero keyboard containment"
```

---

### Task 6: `ProductCard` component

**Files:**

- Create: `components/sections/products/ProductCard.tsx`
- Test: `components/sections/products/ProductCard.test.tsx`

**Interfaces:**

- Consumes: `ProductCardProps` from `./types` (Task 3); `accent` from
  `./constants` (Task 3).
- Produces:
  `ProductCard({ product, onSelect, registerTrigger }: ProductCardProps)` — a
  `<button>`-based card, consumed by `ProductGrid` (Task 7).

- [ ] **Step 1: Write the failing test**

```tsx
// components/sections/products/ProductCard.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "./ProductCard";
import type { Product } from "./types";

const product: Product = {
  slug: "eduos",
  name: "EduOS",
  label: "Live · Vertical SaaS",
  tagline: "The operating brain for schools.",
  oneLiner: "One liner.",
  features: [],
  href: "/products/eduos",
  ctaLabel: "Explore EduOS",
  art: "/brand/product-eduos.webp",
  accent: "teal",
  target: "target",
  moat: "moat",
  revenueLabel: "Revenue",
  revenueValue: "value",
  overview: "overview",
  businessProblem: "problem",
  solution: "solution",
  industries: [],
  technology: [],
};

describe("ProductCard", () => {
  it("renders the product name and calls onSelect when clicked", () => {
    const onSelect = vi.fn();
    render(
      <ProductCard
        product={product}
        onSelect={onSelect}
        registerTrigger={() => {}}
      />,
    );
    expect(screen.getByText("EduOS")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /view details for eduos/i }),
    );
    expect(onSelect).toHaveBeenCalledWith(product);
  });

  it("registers its DOM node as the focus-restore trigger on mount", () => {
    const registerTrigger = vi.fn();
    render(
      <ProductCard
        product={product}
        onSelect={() => {}}
        registerTrigger={registerTrigger}
      />,
    );
    expect(registerTrigger).toHaveBeenCalledWith(
      "eduos",
      expect.any(HTMLButtonElement),
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- ProductCard` Expected: FAIL —
`Cannot find module './ProductCard'`.

- [ ] **Step 3: Write the implementation**

```tsx
// components/sections/products/ProductCard.tsx
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { accent } from "./constants";
import type { ProductCardProps } from "./types";

/* One grid card. A real <button>, not a link — selecting a product no
   longer navigates, it opens the in-page ProductHero (see
   ProductsSection.tsx), so the semantics of "this activates something in
   place" call for a button rather than an anchor. Native <button> already
   gives Enter/Space activation and tab focus for free. */
export function ProductCard(
  { product, onSelect, registerTrigger }: ProductCardProps,
) {
  const a = accent[product.accent];

  return (
    <div role="listitem" className="h-full">
      <button
        type="button"
        ref={(el) => registerTrigger(product.slug, el)}
        onClick={() => onSelect(product)}
        aria-label={`View details for ${product.name}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-paper text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.art}
            alt={`${product.name} product artwork`}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-7">
          <span
            className={cn(
              "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              a.chip,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", a.dot)} />
            {product.label}
          </span>
          <h3 className="font-display text-xl font-bold text-ink">
            {product.name}
          </h3>
          <p className={cn("font-display text-base font-semibold", a.tagline)}>
            {product.tagline}
          </p>
          <p className="line-clamp-3 text-[0.95rem] leading-relaxed text-body">
            {product.oneLiner}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-forest">
            View details
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>
        </div>
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- ProductCard` Expected: `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/sections/products/ProductCard.tsx components/sections/products/ProductCard.test.tsx
git commit -m "feat: add ProductCard as an interactive button-based grid card"
```

---

### Task 7: `ProductGrid` component

**Files:**

- Create: `components/sections/products/ProductGrid.tsx`
- Test: `components/sections/products/ProductGrid.test.tsx`

**Interfaces:**

- Consumes: `ProductCard` (Task 6), `ProductGridProps` from `./types` (Task 3).
- Produces:
  `ProductGrid({ products, onSelect, registerTrigger }: ProductGridProps)` —
  consumed by `ProductsSection` (Task 12).

- [ ] **Step 1: Write the failing test**

```tsx
// components/sections/products/ProductGrid.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductGrid } from "./ProductGrid";
import type { Product } from "./types";

const products: Product[] = [
  {
    slug: "eduos",
    name: "EduOS",
    label: "Live",
    tagline: "tagline",
    oneLiner: "one liner",
    features: [],
    href: "/products/eduos",
    ctaLabel: "Explore EduOS",
    art: "/brand/product-eduos.webp",
    accent: "teal",
    target: "t",
    moat: "m",
    revenueLabel: "Revenue",
    revenueValue: "v",
    overview: "o",
    businessProblem: "p",
    solution: "s",
    industries: [],
    technology: [],
  },
  {
    slug: "arenaos",
    name: "ArenaOS",
    label: "Live",
    tagline: "tagline",
    oneLiner: "one liner",
    features: [],
    href: "/products/arenaos",
    ctaLabel: "Explore ArenaOS",
    art: "/brand/product-arenaos.webp",
    accent: "amber",
    target: "t",
    moat: "m",
    revenueLabel: "Revenue",
    revenueValue: "v",
    overview: "o",
    businessProblem: "p",
    solution: "s",
    industries: [],
    technology: [],
  },
];

describe("ProductGrid", () => {
  it("renders one card per product and forwards onSelect", () => {
    const onSelect = vi.fn();
    render(
      <ProductGrid
        products={products}
        onSelect={onSelect}
        registerTrigger={() => {}}
      />,
    );
    expect(screen.getByText("EduOS")).toBeInTheDocument();
    expect(screen.getByText("ArenaOS")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /view details for arenaos/i }),
    );
    expect(onSelect).toHaveBeenCalledWith(products[1]);
  });

  it("exposes a labelled list role for screen readers", () => {
    render(
      <ProductGrid
        products={products}
        onSelect={() => {}}
        registerTrigger={() => {}}
      />,
    );
    expect(screen.getByRole("list", { name: "Products" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- ProductGrid` Expected: FAIL —
`Cannot find module './ProductGrid'`.

- [ ] **Step 3: Write the implementation**

```tsx
// components/sections/products/ProductGrid.tsx
import { ProductCard } from "./ProductCard";
import type { ProductGridProps } from "./types";

export function ProductGrid(
  { products, onSelect, registerTrigger }: ProductGridProps,
) {
  return (
    <div
      role="list"
      aria-label="Products"
      className="grid gap-5 sm:grid-cols-2"
    >
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          onSelect={onSelect}
          registerTrigger={registerTrigger}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- ProductGrid` Expected: `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/sections/products/ProductGrid.tsx components/sections/products/ProductGrid.test.tsx
git commit -m "feat: add ProductGrid rendering ProductCard per product"
```

---

### Task 8: `ProductContent` component

**Files:**

- Create: `components/sections/products/ProductContent.tsx`

**Interfaces:**

- Consumes: `ProductContentProps` from `./types` (Task 3).
- Produces: `ProductContent({ product }: ProductContentProps)` — consumed by
  `ProductHero` (Task 11).

- [ ] **Step 1: Write the implementation**

No separate unit test for this task — it is pure presentation of already-typed
data with no interaction logic; it is exercised end-to-end by the
`ProductsSection` integration test in Task 12, which asserts its rendered text
is reachable after opening the hero.

```tsx
// components/sections/products/ProductContent.tsx
import { Check } from "lucide-react";
import type { ProductContentProps } from "./types";

/* Hero body: overview, problem/solution, key capabilities, industries,
   technology, business outcomes, and the same three stats ProductDetail.tsx
   already renders (target/moat/revenue) — reused, not duplicated. */
export function ProductContent({ product }: ProductContentProps) {
  const stats = [
    { label: "Target", value: product.target },
    { label: "Moat", value: product.moat },
    { label: product.revenueLabel, value: product.revenueValue },
  ];

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[1.02rem] leading-relaxed text-body">
        {product.overview}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
            The Problem
          </h4>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-body">
            {product.businessProblem}
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
            The Solution
          </h4>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-body">
            {product.solution}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
          Key Capabilities
        </h4>
        <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {product.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2.5 text-[0.9rem] font-medium text-ink"
            >
              <Check size={16} className="shrink-0 text-forest" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
            Industries
          </h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {product.industries.map((industry) => (
              <li
                key={industry}
                className="rounded-full border border-line bg-mist px-3 py-1 text-xs font-medium text-body"
              >
                {industry}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
            Technology
          </h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {product.technology.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line bg-mist px-3 py-1 text-xs font-medium text-body"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {product.roi && (
        <div className="rounded-2xl bg-mist px-5 py-4">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
            Business Outcomes
          </h4>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-body">
            {product.roi}
          </p>
        </div>
      )}

      <dl className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-mist px-4 py-3.5">
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-forest">
              {stat.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold leading-snug text-ink">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/products/ProductContent.tsx
git commit -m "feat: add ProductContent rendering full product hero body"
```

---

### Task 9: `ProductActions` component

**Files:**

- Create: `components/sections/products/ProductActions.tsx`

**Interfaces:**

- Consumes: `Cta` from `@/components/ui/Cta`; `ProductActionsProps` from
  `./types` (Task 3).
- Produces: `ProductActions({ product }: ProductActionsProps)` — consumed by
  `ProductHero` (Task 11).

- [ ] **Step 1: Write the implementation**

No standalone test — it is two `Cta` link invocations with static hrefs, covered
by the `ProductsSection` integration test asserting both links render with the
right `href`/label when the hero opens.

```tsx
// components/sections/products/ProductActions.tsx
import { ArrowRight } from "lucide-react";
import { Cta } from "@/components/ui/Cta";
import type { ProductActionsProps } from "./types";

/* Primary CTA always leads to /contact (matches ProductDetail.tsx's
   convention exactly). Secondary CTA only makes sense because both current
   products already have a live detail page at product.href — if a future
   product has no detail page yet, leave href pointed at a real route rather
   than growing a conditional here; that's a content-authoring decision, not
   a UI one. */
export function ProductActions({ product }: ProductActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Cta href="/contact" variant="primary">
        {product.ctaLabel}
        <ArrowRight size={16} />
      </Cta>
      <Cta href={product.href} variant="outline">
        View Full Solution
      </Cta>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/products/ProductActions.tsx
git commit -m "feat: add ProductActions with primary and secondary hero CTAs"
```

---

### Task 10: `ProductTransition` component

**Files:**

- Create: `components/sections/products/ProductTransition.tsx`

**Interfaces:**

- Consumes: `EASE`, `TRANSITION_DURATION` from `./constants` (Task 3);
  `AnimatePresence`, `m` from `motion/react`.
- Produces:
  `ProductTransition({ activeKey, children }: { activeKey: string; children: React.ReactNode })`
  — consumed by `ProductsSection` (Task 12).

- [ ] **Step 1: Write the implementation**

No standalone test — `motion`'s `AnimatePresence` timing is exercised through
real browser rendering, not jsdom; its role (grid fades out, then hero fades in,
and vice versa on Back) is verified in Task 12's integration test by asserting
the grid is gone and the hero is present after a click (and vice versa after
Back), and manually in Task 14's browser QA pass.

```tsx
// components/sections/products/ProductTransition.tsx
"use client";

import { AnimatePresence, m } from "motion/react";
import { EASE, TRANSITION_DURATION } from "./constants";

/* Sequential crossfade: whatever is currently mounted (grid or hero) fades
   and lifts out, THEN the next thing fades and lifts in — this is
   AnimatePresence's default mode="wait", chosen because the spec's animation
   sequence is explicitly sequential ("Grid Fade Out -> Hero Fade In"), not a
   simultaneous crossfade. Opacity + transform only (GPU), and
   prefers-reduced-motion is already handled globally by the
   MotionConfig reducedMotion="user" wrapper in components/ui/motion.tsx. */
export function ProductTransition({
  activeKey,
  children,
}: {
  activeKey: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={activeKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: TRANSITION_DURATION, ease: EASE }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/products/ProductTransition.tsx
git commit -m "feat: add ProductTransition shared grid/hero crossfade wrapper"
```

---

### Task 11: `ProductHero` component

**Files:**

- Create: `components/sections/products/ProductHero.tsx`

**Interfaces:**

- Consumes: `ProductContent` (Task 8), `ProductActions` (Task 9), `useFocusTrap`
  (Task 5), `accent` from `./constants` (Task 3), `ProductHeroProps` from
  `./types` (Task 3).
- Produces: `ProductHero({ product, onClose, heroRef }: ProductHeroProps)` —
  consumed by `ProductsSection` (Task 12).

- [ ] **Step 1: Write the implementation**

No standalone test — its two pieces of real logic (focus trap wiring, Back
button calling `onClose`) are exercised by the `ProductsSection` integration
test in Task 12, which is the natural seam for testing "does clicking Back
actually restore the grid."

```tsx
// components/sections/products/ProductHero.tsx
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductContent } from "./ProductContent";
import { ProductActions } from "./ProductActions";
import { useFocusTrap } from "./hooks/useFocusTrap";
import { accent } from "./constants";
import type { ProductHeroProps } from "./types";

/* In-page replacement for the grid. tabIndex={-1} on the container makes it
   a valid programmatic focus target (useProductSelection focuses it on
   open) without adding it to the normal Tab order. useFocusTrap keeps
   Tab/Shift+Tab cycling inside this container while it's mounted. */
export function ProductHero({ product, onClose, heroRef }: ProductHeroProps) {
  useFocusTrap(heroRef, true);
  const a = accent[product.accent];

  return (
    <div
      ref={heroRef}
      role="region"
      aria-label={`${product.name} details`}
      tabIndex={-1}
      className="overflow-hidden rounded-3xl border border-line bg-paper shadow-card focus:outline-none"
    >
      <div className="flex items-center justify-between border-b border-line px-6 py-4 md:px-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to products"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-forest transition-colors hover:text-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <ArrowLeft size={16} />
          Back to products
        </button>
        <span
          className={cn(
            "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            a.chip,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", a.dot)} />
          {product.label}
        </span>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative min-h-[16rem] lg:min-h-[28rem]">
          <Image
            src={product.art}
            alt={`${product.name} product artwork`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-6 p-8 md:p-12">
          <div>
            <h3 className="font-display text-3xl font-bold text-ink md:text-[2.25rem]">
              {product.name}
            </h3>
            <p
              className={cn(
                "mt-1 font-display text-lg font-semibold",
                a.tagline,
              )}
            >
              {product.tagline}
            </p>
          </div>
          <ProductContent product={product} />
          <ProductActions product={product} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/products/ProductHero.tsx
git commit -m "feat: add ProductHero assembling image, content, actions and back button"
```

---

### Task 12: `ProductsSection` orchestrator

**Files:**

- Create: `components/sections/products/ProductsSection.tsx`
- Test: `components/sections/products/ProductsSection.test.tsx`

**Interfaces:**

- Consumes: `useProductSelection` (Task 4), `ProductGrid` (Task 7),
  `ProductHero` (Task 11), `ProductTransition` (Task 10), `Product` from
  `@/content/products`.
- Produces: `ProductsSection({ products }: { products: Product[] })` — consumed
  by `Products.tsx` (Task 13).

- [ ] **Step 1: Write the failing test**

```tsx
// components/sections/products/ProductsSection.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductsSection } from "./ProductsSection";
import type { Product } from "./types";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill: _fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={(rest.alt as string) ?? ""} {...rest} />;
  },
}));

const products: Product[] = [
  {
    slug: "eduos",
    name: "EduOS",
    label: "Live",
    tagline: "tagline",
    oneLiner: "one liner",
    features: ["Fee management"],
    href: "/products/eduos",
    ctaLabel: "Explore EduOS",
    art: "/brand/product-eduos.webp",
    accent: "teal",
    target: "target",
    moat: "moat",
    revenueLabel: "Revenue",
    revenueValue: "value",
    overview: "overview text",
    businessProblem: "problem text",
    solution: "solution text",
    industries: ["Schools"],
    technology: ["Cloud"],
  },
  {
    slug: "arenaos",
    name: "ArenaOS",
    label: "Live",
    tagline: "tagline",
    oneLiner: "one liner",
    features: [],
    href: "/products/arenaos",
    ctaLabel: "Explore ArenaOS",
    art: "/brand/product-arenaos.webp",
    accent: "amber",
    target: "target",
    moat: "moat",
    revenueLabel: "Revenue",
    revenueValue: "value",
    overview: "overview text",
    businessProblem: "problem text",
    solution: "solution text",
    industries: [],
    technology: [],
  },
];

describe("ProductsSection", () => {
  it("shows the grid first, opens the hero on card click, and returns to the grid on Back", async () => {
    render(<ProductsSection products={products} />);

    expect(screen.getByRole("list", { name: "Products" })).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /view details for eduos/i }),
    );

    await waitFor(() =>
      expect(screen.getByRole("region", { name: "EduOS details" }))
        .toBeInTheDocument()
    );
    expect(screen.getByText("overview text")).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Products" })).not
      .toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /back to products/i }));

    await waitFor(() =>
      expect(screen.getByRole("list", { name: "Products" })).toBeInTheDocument()
    );
    expect(screen.queryByRole("region", { name: "EduOS details" })).not
      .toBeInTheDocument();
  });

  it("closes the hero on Escape", async () => {
    render(<ProductsSection products={products} />);
    fireEvent.click(
      screen.getByRole("button", { name: /view details for arenaos/i }),
    );
    await waitFor(() =>
      expect(screen.getByRole("region", { name: "ArenaOS details" }))
        .toBeInTheDocument()
    );

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() =>
      expect(screen.getByRole("list", { name: "Products" })).toBeInTheDocument()
    );
  });

  it("restores focus to the trigger card after closing the hero", async () => {
    render(<ProductsSection products={products} />);
    const trigger = screen.getByRole("button", {
      name: /view details for eduos/i,
    });
    fireEvent.click(trigger);
    await waitFor(() =>
      expect(screen.getByRole("region", { name: "EduOS details" }))
        .toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: /back to products/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /view details for eduos/i }))
        .toHaveFocus()
    );
  });

  it("never changes the URL when opening or closing the hero", async () => {
    const initialUrl = window.location.href;
    render(<ProductsSection products={products} />);
    fireEvent.click(
      screen.getByRole("button", { name: /view details for eduos/i }),
    );
    await waitFor(() =>
      expect(screen.getByRole("region", { name: "EduOS details" }))
        .toBeInTheDocument()
    );
    expect(window.location.href).toBe(initialUrl);
    fireEvent.click(screen.getByRole("button", { name: /back to products/i }));
    await waitFor(() =>
      expect(screen.getByRole("list", { name: "Products" })).toBeInTheDocument()
    );
    expect(window.location.href).toBe(initialUrl);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- ProductsSection` Expected: FAIL —
`Cannot find module './ProductsSection'`.

- [ ] **Step 3: Write the implementation**

```tsx
// components/sections/products/ProductsSection.tsx
"use client";

import { useProductSelection } from "./hooks/useProductSelection";
import { ProductGrid } from "./ProductGrid";
import { ProductHero } from "./ProductHero";
import { ProductTransition } from "./ProductTransition";
import type { Product } from "@/content/products";

/* Client-side orchestrator: owns which product (if any) is selected and
   swaps ProductGrid for ProductHero in place. No routing, no page reload —
   purely local state, matching the useState convention already used by
   components/layout/Header.tsx and components/ui/LeadForm.tsx. */
export function ProductsSection({ products }: { products: Product[] }) {
  const { selected, open, close, registerTrigger, heroRef } =
    useProductSelection();

  return (
    <ProductTransition activeKey={selected ? selected.slug : "grid"}>
      {selected
        ? <ProductHero product={selected} onClose={close} heroRef={heroRef} />
        : (
          <ProductGrid
            products={products}
            onSelect={open}
            registerTrigger={registerTrigger}
          />
        )}
    </ProductTransition>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- ProductsSection` Expected: `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/sections/products/ProductsSection.tsx components/sections/products/ProductsSection.test.tsx
git commit -m "feat: add ProductsSection orchestrating grid/hero swap"
```

---

### Task 13: Wire `ProductsSection` into `Products.tsx`

**Files:**

- Modify: `components/sections/Products.tsx`

**Interfaces:**

- Consumes: `ProductsSection` (Task 12), `products`/`futureProducts` from
  `@/content/products` (Task 2).
- Produces: `Products({ heading }: { heading?: string })` — unchanged signature,
  still imported by `app/page.tsx` and `app/products/page.tsx` with zero changes
  to either file.

- [ ] **Step 1: Replace the full content of `components/sections/Products.tsx`**

```tsx
import { Section } from "@/components/ui/Section";
import { futureProducts, products } from "@/content/products";
import { ProductsSection } from "@/components/sections/products/ProductsSection";

/* Products — an interactive grid: click a card to open its full detail
   in place (ProductsSection), no navigation. Future products close the
   section as a quiet strip, unchanged from before. */
export function Products({
  heading = "Vertical operating systems, shipping today.",
}: {
  heading?: string;
}) {
  return (
    <Section id="products" tone="canvas">
      <div className="max-w-2xl">
        <p className="eyebrow">Our Products</p>
        <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
          {heading}
        </h2>
      </div>

      <div className="mt-14">
        <ProductsSection products={products} />
      </div>

      {/* future products — quiet closing strip */}
      <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-mist px-8 py-7 md:flex-row md:items-center md:justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">
          {futureProducts.heading}
        </h3>
        <ul className="flex flex-wrap gap-2.5">
          {futureProducts.list.map((p) => (
            <li
              key={p}
              className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm text-muted"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` Expected: no errors.

- [ ] **Step 3: Run the full test suite**

Run: `npm run test` Expected: all tests from Tasks 1–12 still pass (no
regressions from wiring).

- [ ] **Step 4: Commit**

```bash
git add components/sections/Products.tsx
git commit -m "feat: wire ProductsSection into Products, replacing inline card markup"
```

---

### Task 14: Full verification pass

**Files:** none (verification only — this task runs commands and does a manual
browser pass; if anything fails, fix the minimal offending code in its owning
task's file and re-run this task from Step 1).

**Interfaces:** none.

- [ ] **Step 1: TypeScript**

Run: `npx tsc --noEmit` Expected: no errors.

- [ ] **Step 2: Lint**

Run: `npm run lint` Expected: no errors. If `ProductsSection.test.tsx`'s
`next/image` mock triggers `@next/next/no-img-element`, the inline
`// eslint-disable-next-line @next/next/no-img-element` in that test file
(already included in Task 12, Step 1) suppresses it — confirm the disable
comment is directly above the `<img>` line.

- [ ] **Step 3: Unit tests**

Run: `npm run test` Expected: all tests pass (Tasks 1, 4, 5, 6, 7, 12 — 15 tests
total across `useProductSelection.test.ts`, `useFocusTrap.test.ts`,
`ProductCard.test.tsx`, `ProductGrid.test.tsx`, `ProductsSection.test.tsx`).

- [ ] **Step 4: Production build**

Run: `npm run build` Expected: build succeeds with no type or lint errors
surfaced during the build step, and no warnings about the new files.

- [ ] **Step 5: Manual browser QA — golden path**

Run: `npm run dev`, open `http://localhost:3000`.

Verify, scrolling to the Products section:

- Grid renders two equal-height cards (EduOS, ArenaOS), responsive: single
  column on a narrow/mobile viewport, two columns from `sm` (640px) up.
- Click the EduOS card: grid fades out, hero fades in showing EduOS's image,
  overview, problem/solution, key capabilities, industries, technology, business
  outcomes (ROI text), the three stats, and both CTAs ("Explore EduOS" →
  `/contact`, "View Full Solution" → `/products/eduos`). No URL change (check
  the address bar), no scroll jump (the top of the Products section stays in the
  same place), no full page reload (check the Network tab shows no
  navigation/document request).
- Click "Back to products": hero fades out, grid fades back in. Keyboard focus
  lands back on the EduOS card (visible focus ring).
- Repeat for ArenaOS.

- [ ] **Step 6: Manual browser QA — keyboard and accessibility**

- Tab from the page's start into the Products section; confirm each card is
  reachable and shows a visible focus ring.
- Press Enter on a focused card: hero opens (same as click).
- Press Space on a focused card: hero opens.
- With the hero open, press Tab repeatedly: focus cycles only among the hero's
  focusable elements (Back button, both CTAs) and never lands on Header/Footer
  links while doing so — confirms the focus trap.
- With the hero open, press Escape: hero closes, grid returns, focus restored to
  the originating card.
- Run the browser's built-in accessibility inspector (or axe DevTools if
  installed) against the Products section in both grid and hero states — confirm
  no new violations (contrast, missing labels, focus order) are introduced.

- [ ] **Step 7: Manual browser QA — responsive**

Using DevTools device toolbar, check the Products section at: 375px (mobile),
768px (tablet), 1024px (laptop), 1440px (desktop). Confirm: no horizontal
overflow, no broken spacing, hero image and content reflow to single column
below `lg` (1024px), grid stays 1-column below `sm` (640px) and 2-column above
it.

- [ ] **Step 8: Regression pass**

With `npm run dev` still running, visit each of the following and confirm it
renders exactly as before this change (no visual or functional difference):

- `/` — Header, Hero, HeroVideo, Problem, WhatWeBuild, Approach, PhotoBand,
  Industries, Work sections all unchanged; only the Products section between
  Approach and PhotoBand shows the new grid/hero interaction.
- `/products` — page hero unchanged, Products section shows the same new
  grid/hero interaction with the custom heading.
- `/products/eduos` and `/products/arenaos` — unchanged detail pages, still
  reachable directly by URL and via the hero's "View Full Solution" link and the
  Header's dropdown links.
- `/contact` — unchanged, still reachable via the hero's primary CTA.
- Toggle the mobile menu (Header hamburger) — unchanged.
- Open DevTools Console while performing the full golden-path flow (Step 5) —
  zero errors, zero React hydration-mismatch warnings.

- [ ] **Step 9: Commit (only if Steps 1–8 required fixes)**

If any step above required a fix, stage exactly the changed files and commit:

```bash
git add -A
git commit -m "fix: address verification findings in interactive product list"
```

If no fixes were needed, skip this step — there is nothing to commit.

---

## Completion Criteria

This feature is complete only when every item below is true. If any item fails,
explain the failure, fix only the minimal required code in the owning task's
file, re-run that task's verification, then re-run Task 14 in full before
marking complete.

- [ ] Audit completed (see Audit Summary above)
- [ ] Architecture documented (see Architecture / Files sections above)
- [ ] Code implemented (Tasks 1–13)
- [ ] TypeScript passes (Task 14, Step 1)
- [ ] ESLint passes (Task 14, Step 2)
- [ ] Production build passes (Task 14, Step 4)
- [ ] Accessibility verified (Task 14, Step 6)
- [ ] Responsive verified (Task 14, Step 7)
- [ ] Keyboard verified (Task 14, Step 6)
- [ ] Animation verified (Task 14, Step 5 — sequential fade, 250–350ms, GPU
      transforms only)
- [ ] Unit tests pass (Task 14, Step 3)
- [ ] Regression testing completed (Task 14, Step 8)
- [ ] No console errors or hydration warnings (Task 14, Step 8)
- [ ] No layout shift, no scroll jump (Task 14, Step 5)
- [ ] Focus restoration verified (Task 14, Step 6)
- [ ] Existing product pages still work (Task 14, Step 8)
- [ ] No routing changes (Task 14, Step 5 — URL unchanged during grid↔hero swap)

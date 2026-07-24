# About Us Content & Motion Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply every content, alignment, and animation change requested in `docs/WnR_About_Us.docx` (plus the EduOS copy in `docs/Edu Os.docx`) to the live `/about` page, without touching any other route, shared component default, or existing animation elsewhere on the site.

**Architecture:** `/about` (`app/about/page.tsx`) renders 10 section components from `components/about/*.tsx`, all sourced from the single copy file `content/about.ts`. Motion comes from three shared primitives in `components/ui/motion.tsx` (`Reveal`, `Stagger`, `StaggerItem`), which `components/ui/Section.tsx` wraps automatically. This plan edits `content/about.ts` for copy, adds two new *optional* props to the shared motion primitives (default-preserving, so every other page that uses `Reveal`/`Section` is unaffected), and applies consistent Tailwind hover/animation utility classes directly in the About components (the project has no shared `Card` component — hover treatment is copy-pasted Tailwind per component today, and this plan follows that existing pattern rather than introducing a new abstraction).

**Tech Stack:** Next.js 16 (App Router) · React 19 · `motion` (Motion for React, imported as `motion/react`) · Tailwind CSS v4 (CSS-first config in `app/globals.css`, no `tailwind.config.js`) · TypeScript · Vitest/ESLint for verification. No GSAP is present or required — every requested animation is achievable with the existing `motion` primitives.

## Source-of-Truth Documents

- `docs/WnR_About_Us.docx` — the client's change-request document (12 pages, 5 embedded reference screenshots + 1 embedded EduOS sub-document).
- `docs/Edu Os.docx` — standalone EduOS "About / Mission / Vision / Purpose / Core Values / Roadmap" document, confirmed byte-identical in content to the object embedded inside `WnR_About_Us.docx`.

## Global Constraints

- **Scope is `/about` only.** Do not modify any other route, any other page's copy, or the *default* behavior of any shared component. `components/ui/motion.tsx` and `components/ui/Section.tsx` are used site-wide (home, capabilities, careers, contact) — any prop added to them must be optional and default to today's exact values so every other call site renders byte-for-byte identically.
- **Hyphen/dash rule (resolved with user):** replace only dash-as-punctuation — em dashes (`—`), en dashes used as clause separators, and standalone `" - "` title separators — with a comma. Do **not** touch hyphens inside compound words (`long-term`, `13-year-old`, `operating-system`, `AI-native`, `industry-specific`) or numeric ranges (`2025–2026`). Every dash edit in this plan is called out individually; do not "clean up" any dash not explicitly listed.
- **EduOS section scope (resolved with user):** only `components/about/AboutEduOsAnchor.tsx`'s narrative copy (via `content/about.ts::aboutEduOsAnchor`) is rewritten, using the About/Mission/Vision/Purpose/Core-Values material from `docs/Edu Os.docx`. The section's JSX structure, length (5 paragraphs + bold callout + closing line + 4-step progression banner), and visual design are preserved exactly. The EduOS 2027–2030 roadmap in that document is explicitly **not** used anywhere — `components/about/AboutRoadmap.tsx` (WnR's own "Where We're Going" roadmap) is only touched for the one Horizon Three copy/footer change specified later in this plan, unrelated to EduOS's roadmap.
- **Awards reference layout (resolved with user):** build the doc's reference screenshot (`image2.png`: arrow affordance on each recognition card + a new 4-item trust-badge strip below the grid) into `AboutAwards.tsx`.
- **Animation targets, exactly as specified in the doc:**
  - Section-level entry (the whole section fading/rising into view): opacity 0→1, translateY 40px→0, duration 700–900ms. This plan uses 800ms (the midpoint) via new optional `revealY`/`revealDuration` props on `Section`.
  - Within-section sequential choreography (heading → paragraph → cards → button): 100ms stagger between elements. This is a **separate, already-implemented** layer using the existing per-instance `<Reveal delay={...}>` props with smaller y-offsets (14–24px) and the existing default 550ms duration — that is intentional, faster inner choreography nested inside the slower macro section-entry, not a gap to fix. Only delay increments that are not already ~100ms apart get adjusted.
  - Card hover: translateY(-6px) (`hover:-translate-y-1.5` in Tailwind's spacing scale = 6px exactly), increased shadow (`hover:shadow-card-hover`, an existing utility in `app/globals.css`), and a highlighted border — applied consistently to every card in every About section (today it's inconsistent: some cards have no border-hover or use -4px/-2px lift).
  - Icon hover scale 1 → 1.08 (`group-hover:scale-[1.08]`) — applied to the two icon badges that sit inside genuinely interactive hover cards (Mission/Vision). Not applied to purely decorative/static badge icons (Hero trust row), to avoid unrequested UX changes on non-interactive elements.
  - Arrow slide on hover (`group-hover:translate-x-1`) — applied to the Hero primary CTA's arrow and the new Awards recognition-card arrows.
  - Animated underline (no shared component exists site-wide) — implemented locally on the Awards recognition-card titles via a `after:` pseudo-element width-reveal, the only clickable-feeling text on this page.
  - Gradients/glow/parallax on large illustrations — already present (Hero ambient blur spheres, ChaosToClarity's drifting/path-draw diagram, WhatWeBelieve/EduOsAnchor radial glows). No changes required; verified in the QA task.
  - Animated number counters for stats — audited and **not applicable**: the About page has no standalone numeric stat tiles today (no "50+", "1M" style tile), so there is nothing to attach `hooks/useCountUp.ts` to. This is called out explicitly as N/A in the final QA task rather than silently skipped.
- **One documented text decision:** the doc's new "What We Believe" paragraph reads *"...Understanding a business isn't. Our advantage isn't writing code—it's..."* — the middle clause is a broken sentence fragment in the source document. This plan uses the paragraph with that fragment omitted (everything else verbatim, dash converted to comma per the global rule) rather than guessing what it should say. Flagged again at Task 6.
- **One documented mapping decision:** the source document's raw paragraph order (extracted in `document.xml`) places *"Left side card - Businesses don't fail from lack of effort—they fail from disconnected systems..."* and *"Alignment – 'Justify'"* physically adjacent to the Awards section's reference screenshot (`image1.png`), which would suggest they describe the Awards left card. They do not: that copy is about operational systems consolidation (WhatsApp/Excel/software), not awards/culture, and the identical text reappears later in the document directly beneath `image3.png` — the *current* screenshot of the "Why We Exist" section — confirming its actual target. Word's floating/anchored images do not always serialize in visual reading order, which is why the same annotation appears to sit near two different screenshots. This plan therefore applies "Businesses don't fail..." and "Alignment – Justify" to `aboutWhyWeExist` / `AboutChaosToClarity.tsx` (Tasks 5, 10) and *not* to `AboutAwards.tsx`. The Awards section's own copy changes (Task 4) come from the document's later, unambiguous "Right side" / Redex / Testio paragraphs instead.
- **Already satisfied, no change needed:** (1) "Buttons should have smooth background, border, and text transitions" — `components/ui/Cta.tsx`'s shared `base` class already applies `transition-all duration-200` to every variant; this plan does not touch `Cta.tsx`'s own styling, only wraps its `ArrowRight` icon children in about-page-specific hover classes (Task 3, Task 11). (2) "Hero animation: headline → subheading → CTA → illustration" — `AboutHero.tsx` already sequences exactly this via 5 staggered `<Reveal delay={0.1..0.5}>` blocks (eyebrow → h1 → lead → CTA row → trust-badge row), each exactly 100ms apart; the trust-badge row is the closest existing element to an "illustration" slot (there is no dedicated illustration/image asset in the current Hero design, and adding one is outside this document's scope). Verified, not modified, in Task 16.
- **Verification tooling available in this repo:** `npx tsc --noEmit` (typecheck), `npm run lint` (ESLint), `npm run dev` (manual/visual check — no automated component tests exist for `components/about/*`, and none are added by this plan since these are content/styling changes, not new logic).

---

## Task 1: `Reveal` — add optional `duration` prop

**Files:**
- Modify: `components/ui/motion.tsx:25-52`

**Interfaces:**
- Produces: `Reveal({ children, className?, y?=16, delay?=0, amount?=0.2, duration?=0.55, onViewportEnter? })` — new `duration` prop, defaults to the exact current hardcoded value so every existing call site (site-wide) is unaffected.

- [ ] **Step 1: Add the `duration` prop**

In `components/ui/motion.tsx`, replace the `Reveal` function:

```tsx
export function Reveal({
  children,
  className,
  y = 16,
  delay = 0,
  amount = 0.2,
  onViewportEnter,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  amount?: number | "some" | "all";
  onViewportEnter?: () => void;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      onViewportEnter={onViewportEnter}
    >
      {children}
    </m.div>
  );
}
```

with:

```tsx
export function Reveal({
  children,
  className,
  y = 16,
  delay = 0,
  amount = 0.2,
  duration = 0.55,
  onViewportEnter,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  amount?: number | "some" | "all";
  duration?: number;
  onViewportEnter?: () => void;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, ease: EASE, delay }}
      onViewportEnter={onViewportEnter}
    >
      {children}
    </m.div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors (the change is a backward-compatible optional prop).

- [ ] **Step 3: Verify no other call site changed behavior**

Run: `grep -rn "<Reveal" components/ --include=*.tsx -l`
Expected: lists every file using `Reveal`; none of them pass a `duration` prop yet (confirm by re-running with `grep -rn "duration=" $(grep -rln "<Reveal" components --include=*.tsx)` — no matches outside this task). This proves every existing usage still gets the default 0.55s.

- [ ] **Step 4: Commit**

```bash
git add components/ui/motion.tsx
git commit -m "feat(motion): add optional duration prop to Reveal"
```

---

## Task 2: `Section` — add optional `revealY` / `revealDuration` props

**Files:**
- Modify: `components/ui/Section.tsx:15-72`

**Interfaces:**
- Consumes: `Reveal` from Task 1 (`y`, `duration` props).
- Produces: `Section({ ..., revealY?: number, revealDuration?: number })` — forwarded to the internal `Reveal`. Both default to `undefined`, which lets `Reveal`'s own defaults (`y=16`, `duration=0.55`) apply unchanged.

- [ ] **Step 1: Add the two props to `SectionProps` and forward them**

In `components/ui/Section.tsx`, replace:

```tsx
interface SectionProps {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  /** Remove the max-width container so children can span edge to edge. */
  bleed?: boolean;
  /** Fade-up the section content as it scrolls into view. On by default. */
  reveal?: boolean;
  /**
   * Viewport threshold that triggers the reveal (forwarded to Reveal's
   * `amount`). Defaults to a fraction (0.2) of the wrapped content's height —
   * fine for normal sections, but that fraction can exceed the viewport
   * height for very tall content and never fire. Pass `"some"` for sections
   * whose content height is unbounded/variable, so the reveal triggers as
   * soon as any part enters view instead of a fixed fraction of the whole.
   */
  revealAmount?: number | "some" | "all";
  children: React.ReactNode;
}
```

with:

```tsx
interface SectionProps {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  /** Remove the max-width container so children can span edge to edge. */
  bleed?: boolean;
  /** Fade-up the section content as it scrolls into view. On by default. */
  reveal?: boolean;
  /**
   * Viewport threshold that triggers the reveal (forwarded to Reveal's
   * `amount`). Defaults to a fraction (0.2) of the wrapped content's height —
   * fine for normal sections, but that fraction can exceed the viewport
   * height for very tall content and never fire. Pass `"some"` for sections
   * whose content height is unbounded/variable, so the reveal triggers as
   * soon as any part enters view instead of a fixed fraction of the whole.
   */
  revealAmount?: number | "some" | "all";
  /** Overrides the translateY (px) the section rises from on entry. Defaults to Reveal's own default (16). */
  revealY?: number;
  /** Overrides the reveal fade/rise duration in seconds. Defaults to Reveal's own default (0.55). */
  revealDuration?: number;
  children: React.ReactNode;
}
```

Then replace:

```tsx
export function Section({
  id,
  tone = "canvas",
  className,
  containerClassName,
  bleed = false,
  reveal = true,
  revealAmount,
  children,
}: SectionProps) {
```

with:

```tsx
export function Section({
  id,
  tone = "canvas",
  className,
  containerClassName,
  bleed = false,
  reveal = true,
  revealAmount,
  revealY,
  revealDuration,
  children,
}: SectionProps) {
```

And replace:

```tsx
      {reveal ? <Reveal amount={revealAmount}>{inner}</Reveal> : inner}
```

with:

```tsx
      {reveal ? (
        <Reveal amount={revealAmount} y={revealY} duration={revealDuration}>
          {inner}
        </Reveal>
      ) : (
        inner
      )}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Verify no other page passes these props yet**

Run: `grep -rn "revealY=\|revealDuration=" components/ app/ --include=*.tsx`
Expected: no matches (confirms this is a pure addition with zero behavior change outside `/about`, until Task 3 adds usages).

- [ ] **Step 4: Commit**

```bash
git add components/ui/Section.tsx
git commit -m "feat(motion): add optional revealY/revealDuration props to Section"
```

---

## Task 3: Apply the 40px/800ms section-entry timing across About + Hero CTA arrow-slide

**Files:**
- Modify: `components/about/AboutAwards.tsx:14`
- Modify: `components/about/AboutChaosToClarity.tsx:27`
- Modify: `components/about/AboutMissionVision.tsx:12`
- Modify: `components/about/AboutWhatWeBelieve.tsx:11-15`
- Modify: `components/about/AboutHowWeWork.tsx:12`
- Modify: `components/about/AboutInsideWnr.tsx:12`
- Modify: `components/about/AboutRoadmap.tsx:15`
- Modify: `components/about/AboutEduOsAnchor.tsx:14-18`
- Modify: `components/about/AboutCta.tsx:12`
- Modify: `components/about/AboutHero.tsx:51-54`

**Interfaces:**
- Consumes: `Section`'s `revealY`/`revealDuration` props from Task 2.

- [ ] **Step 1: `AboutAwards.tsx`** — replace:

```tsx
    <Section id="awards" tone="canvas" className="py-20 md:py-28 border-b border-line overflow-hidden">
```

with:

```tsx
    <Section id="awards" tone="canvas" revealY={40} revealDuration={0.8} className="py-20 md:py-28 border-b border-line overflow-hidden">
```

- [ ] **Step 2: `AboutChaosToClarity.tsx`** — replace:

```tsx
    <Section id="why-we-exist" tone="canvas" className="py-24 md:py-36 border-b border-line overflow-hidden">
```

with:

```tsx
    <Section id="why-we-exist" tone="canvas" revealY={40} revealDuration={0.8} className="py-24 md:py-36 border-b border-line overflow-hidden">
```

- [ ] **Step 3: `AboutMissionVision.tsx`** — replace:

```tsx
    <Section id="mission-vision" tone="mist" className="py-24 md:py-36 border-b border-line overflow-hidden">
```

with:

```tsx
    <Section id="mission-vision" tone="mist" revealY={40} revealDuration={0.8} className="py-24 md:py-36 border-b border-line overflow-hidden">
```

- [ ] **Step 4: `AboutWhatWeBelieve.tsx`** — replace:

```tsx
    <Section
      id="what-we-believe"
      bleed
      className="relative py-32 md:py-48 bg-[#0e1a13] text-white overflow-hidden border-b border-line/10"
    >
```

with:

```tsx
    <Section
      id="what-we-believe"
      bleed
      revealY={40}
      revealDuration={0.8}
      className="relative py-32 md:py-48 bg-[#0e1a13] text-white overflow-hidden border-b border-line/10"
    >
```

- [ ] **Step 5: `AboutHowWeWork.tsx`** — replace:

```tsx
    <Section id="how-we-work" tone="canvas" className="py-24 md:py-36 border-b border-line overflow-hidden">
```

with:

```tsx
    <Section id="how-we-work" tone="canvas" revealY={40} revealDuration={0.8} className="py-24 md:py-36 border-b border-line overflow-hidden">
```

- [ ] **Step 6: `AboutInsideWnr.tsx`** — replace:

```tsx
    <Section id="inside-wnr" bleed className="py-24 md:py-36 bg-[#0e1a13] text-white overflow-hidden border-b border-line/10">
```

with:

```tsx
    <Section id="inside-wnr" bleed revealY={40} revealDuration={0.8} className="py-24 md:py-36 bg-[#0e1a13] text-white overflow-hidden border-b border-line/10">
```

- [ ] **Step 7: `AboutRoadmap.tsx`** — replace:

```tsx
    <Section id="roadmap" tone="canvas" className="py-24 md:py-36 border-b border-line overflow-hidden">
```

with:

```tsx
    <Section id="roadmap" tone="canvas" revealY={40} revealDuration={0.8} className="py-24 md:py-36 border-b border-line overflow-hidden">
```

- [ ] **Step 8: `AboutEduOsAnchor.tsx`** — replace:

```tsx
    <Section
      id="eduos-2040-anchor"
      bleed
      className="relative py-32 md:py-48 bg-[#0b2e20] text-white overflow-hidden border-b border-line/10 shadow-2xl"
    >
```

with:

```tsx
    <Section
      id="eduos-2040-anchor"
      bleed
      revealY={40}
      revealDuration={0.8}
      className="relative py-32 md:py-48 bg-[#0b2e20] text-white overflow-hidden border-b border-line/10 shadow-2xl"
    >
```

- [ ] **Step 9: `AboutCta.tsx`** — replace:

```tsx
    <Section id="about-cta" tone="canvas" className="py-24 md:py-36 text-center overflow-hidden">
```

with:

```tsx
    <Section id="about-cta" tone="canvas" revealY={40} revealDuration={0.8} className="py-24 md:py-36 text-center overflow-hidden">
```

- [ ] **Step 10: `AboutHero.tsx`** — arrow slide-on-hover on the primary CTA (the doc's "arrows should slide a few pixels on hover" rule; `Cta`'s base class already includes `group`, so a `group-hover:` on the icon works without touching the shared `Cta` component). Replace:

```tsx
              <Cta href="/contact" variant="primary">
                Work With Us
                <ArrowRight size={16} />
              </Cta>
```

with:

```tsx
              <Cta href="/contact" variant="primary">
                Work With Us
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Cta>
```

- [ ] **Step 11: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 12: Verify every About Section now carries the new props**

Run: `grep -c "revealY={40} revealDuration={0.8}" components/about/*.tsx`
Expected: `1` for each of `AboutAwards.tsx`, `AboutChaosToClarity.tsx`, `AboutCta.tsx`, `AboutHowWeWork.tsx`, `AboutInsideWnr.tsx`, `AboutMissionVision.tsx`, `AboutRoadmap.tsx` (7 files with the props on one line), and confirm `AboutWhatWeBelieve.tsx` / `AboutEduOsAnchor.tsx` contain `revealY={40}` and `revealDuration={0.8}` (split across lines, so check separately): `grep -c "revealY={40}" components/about/AboutWhatWeBelieve.tsx components/about/AboutEduOsAnchor.tsx` → `1` each.

- [ ] **Step 13: Commit**

```bash
git add components/about/AboutAwards.tsx components/about/AboutChaosToClarity.tsx components/about/AboutMissionVision.tsx components/about/AboutWhatWeBelieve.tsx components/about/AboutHowWeWork.tsx components/about/AboutInsideWnr.tsx components/about/AboutRoadmap.tsx components/about/AboutEduOsAnchor.tsx components/about/AboutCta.tsx components/about/AboutHero.tsx
git commit -m "feat(about): apply 40px/800ms section-entry timing and hero CTA arrow-slide"
```

---

## Task 4: `content/about.ts` — Awards copy + new trust-badge strip data

**Files:**
- Modify: `content/about.ts:27-41`

**Interfaces:**
- Produces: `aboutAwards.recognitions[0].description`, `aboutAwards.recognitions[1].title`, `aboutAwards.recognitions[1].description` (updated strings), and a new `aboutAwards.trustPoints: { icon: "Crown" | "Target" | "ShieldCheck" | "Globe"; title: string; description: string }[]` array consumed by Task 11.

- [ ] **Step 1: Update the two recognition cards and add `trustPoints`**

In `content/about.ts`, replace:

```ts
  recognitions: [
    {
      badge: "People & Culture",
      title: "Redex People Power Award",
      description: "Recognized for building an engineering culture obsessed with business workflows and long-term client outcomes.",
      year: "2025–2026",
    },
    {
      badge: "Partnership Excellence",
      title: "Official Technology Partner — Testio",
      description: "Trusted enterprise integration and quality assurance partnership across high-performance software systems.",
      year: "Certified Partner",
    },
  ],
};
```

with:

```ts
  recognitions: [
    {
      badge: "People & Culture",
      title: "Redex People Power Award",
      description: "Recognized for building an engineering culture focused on business outcomes and long-term relationship.",
      year: "2025–2026",
    },
    {
      badge: "Partnership Excellence",
      title: "Official Technology Partner, Testio",
      description: "Trusted technology partner for enterprise software systems.",
      year: "Certified Partner",
    },
  ],
  trustPoints: [
    { icon: "Crown" as const, title: "People First", description: "Culture built on trust, growth, and ownership." },
    { icon: "Target" as const, title: "Outcome Driven", description: "We focus on real business outcomes that matter." },
    { icon: "ShieldCheck" as const, title: "Trusted by Clients", description: "Long-term partnerships built on results." },
    { icon: "Globe" as const, title: "Excellence Certified", description: "Recognitions that reflect our commitment to quality." },
  ],
};
```

> Note: `year: "2025–2026"` keeps its en dash — that's a date range, not clause punctuation, and is explicitly excluded by the Global Constraints hyphen rule.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (this file has no consumer of `trustPoints` yet — Task 11 adds it — so the new array is simply unused-but-valid until then; TypeScript does not error on unused object literal properties).

- [ ] **Step 3: Verify the exact strings landed**

Run: `grep -n "long-term relationship\.\"\|Official Technology Partner, Testio\|Trusted technology partner for enterprise software systems\|People First\|Outcome Driven\|Trusted by Clients\|Excellence Certified" content/about.ts`
Expected: 6 matching lines (one per string above).

- [ ] **Step 4: Commit**

```bash
git add content/about.ts
git commit -m "content(about): update awards recognition copy, add trust-badge strip data"
```

---

## Task 5: `content/about.ts` — "Why We Exist" heading + paragraph

**Files:**
- Modify: `content/about.ts:44-49`

**Interfaces:**
- Produces: `aboutWhyWeExist.heading`, `aboutWhyWeExist.paragraphs[0]` (updated strings). `AboutChaosToClarity.tsx` (Task 10) reads `paragraphs` but has the heading hardcoded in JSX — Task 10 updates that JSX to match this new heading.

- [ ] **Step 1: Replace the heading and paragraph**

In `content/about.ts`, replace:

```ts
export const aboutWhyWeExist = {
  eyebrow: "WHY WE EXIST",
  heading: "Businesses don't fail from lack of effort. They drown in complexity.",
  paragraphs: [
    "Growing businesses run on WhatsApp threads, Excel sheets, emails, and disconnected software. As teams grow, information scatters, decisions slow down, and no one has a single source of truth. The effort is there. The system isn't. We started WnR to build the system.",
  ],
```

with:

```ts
export const aboutWhyWeExist = {
  eyebrow: "WHY WE EXIST",
  heading: "Businesses don't fail from lack of effort, they fail from disconnected systems.",
  paragraphs: [
    "When WhatsApp, Excel, emails, and scattered software become the operating model, growth slows. WnR was built to bring everything together into one intelligent system.",
  ],
```

(`chaosTools` and `claritySystem` below stay unchanged — the doc doesn't touch the chaos/clarity checklist card.)

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Verify**

Run: `grep -n "they fail from disconnected systems\|WnR was built to bring everything together" content/about.ts`
Expected: 2 matches.

- [ ] **Step 4: Commit**

```bash
git add content/about.ts
git commit -m "content(about): update Why We Exist heading and paragraph"
```

---

## Task 6: `content/about.ts` — "What We Believe" heading + body

**Files:**
- Modify: `content/about.ts:74-78`

**Interfaces:**
- Produces: `aboutWhatWeBelieve.heading`, `aboutWhatWeBelieve.body` (updated strings), consumed directly by `AboutWhatWeBelieve.tsx` (no component edit needed — it already reads these fields, not hardcoded JSX).

- [ ] **Step 1: Replace heading and body**

In `content/about.ts`, replace:

```ts
export const aboutWhatWeBelieve = {
  eyebrow: "WHAT WE BELIEVE",
  heading: "The long-term moat is not coding.",
  body: "It's workflow understanding, implementation depth, and the depth of customer relationships. Anyone can write software. Almost nobody takes the time to understand how a business actually runs — and then stays to make sure the system works.",
};
```

with:

```ts
export const aboutWhatWeBelieve = {
  eyebrow: "WHAT WE BELIEVE",
  heading: "The moat AI can't automate.",
  body: "The future doesn't belong to those who write the best code alone. Our advantage isn't writing code, it's understanding workflows, solving real operational problems, and staying until the solution delivers results.",
};
```

> Documented decision (see Global Constraints): the source document's draft body was *"The future doesn't belong to those who write the best code alone. Understanding a business isn't. Our advantage isn't writing code—it's..."* — the second sentence is an incomplete fragment in the source. It is omitted here; every other word is verbatim from the document, with the one em dash converted to a comma per the global rule.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Verify**

Run: `grep -n "The moat AI can't automate\|Our advantage isn't writing code, it's understanding workflows" content/about.ts`
Expected: 2 matches.

- [ ] **Step 4: Commit**

```bash
git add content/about.ts
git commit -m "content(about): replace What We Believe heading and body"
```

---

## Task 7: `content/about.ts` — "Where We're Going" dash fixes + Horizon Three copy

**Files:**
- Modify: `content/about.ts:130-171`

**Interfaces:**
- Produces: `aboutWhereWeAreGoing.intro[0]`, `horizons[0].paragraphs[0]`, `horizons[1].paragraphs[0]`, `horizons[2].paragraphs` (updated strings), consumed by `AboutRoadmap.tsx` (Task 12 updates the one piece of hardcoded JSX that duplicates `horizons[2].paragraphs[2]`).

- [ ] **Step 1: Fix the intro dash**

Replace:

```ts
  intro: [
    "Every system we build teaches us something about how an industry actually works. We productise that understanding. Then we do it again, in a new industry — and the whole portfolio gets smarter.",
    "That's the compounding engine behind everything below.",
  ],
```

with:

```ts
  intro: [
    "Every system we build teaches us something about how an industry actually works. We productise that understanding. Then we do it again, in a new industry, and the whole portfolio gets smarter.",
    "That's the compounding engine behind everything below.",
  ],
```

- [ ] **Step 2: Fix the Horizon One dash**

Replace:

```ts
      paragraphs: [
        "EduOS is the operating brain for schools — fees, attendance, academics, staff, and parents in one system. ArenaOS runs booking-led venues, from gaming cafes to courts and studios, turning billing into real operational intelligence.",
        "Both are live, both are learning, and both are getting sharper every term they run.",
      ],
      badge: "Active & Learning",
      accent: "forest",
```

with:

```ts
      paragraphs: [
        "EduOS is the operating brain for schools, fees, attendance, academics, staff, and parents in one system. ArenaOS runs booking-led venues, from gaming cafes to courts and studios, turning billing into real operational intelligence.",
        "Both are live, both are learning, and both are getting sharper every term they run.",
      ],
      badge: "Active & Learning",
      accent: "forest",
```

- [ ] **Step 3: Fix the Horizon Two dash**

Replace:

```ts
      paragraphs: [
        "This year we launch our third product — our most ambitious yet, and the first time we take our operating-system thinking beyond the businesses we serve, and into the way people move things across a city.",
        "Same philosophy: understand the operation deeply, build the system it truly needs, then stay. Different scale entirely.",
        "More soon.",
      ],
```

with:

```ts
      paragraphs: [
        "This year we launch our third product, our most ambitious yet, and the first time we take our operating-system thinking beyond the businesses we serve, and into the way people move things across a city.",
        "Same philosophy: understand the operation deeply, build the system it truly needs, then stay. Different scale entirely.",
        "More soon.",
      ],
```

(`operating-system` keeps its hyphen — compound word, not clause punctuation.)

- [ ] **Step 4: Replace Horizon Three's paragraphs with the doc's updated industry copy**

Replace:

```ts
      paragraphs: [
        "Healthcare. Retail. Manufacturing. Hospitality. Construction. Every sector where businesses still run on spreadsheets, WhatsApp groups, and instinct — and deserve better.",
        "We enter an industry only when we understand it deeply enough to productise it. That's slower than raising and spraying. It's also why our products work.",
        "Tamil Nadu → India → Europe.",
      ],
      badge: "Long-Term Vision",
      accent: "amber",
```

with:

```ts
      paragraphs: [
        "From healthcare and retail to manufacturing, hospitality, education, logistics, and financial services, every industry deserves systems built for the way it actually operates.",
        "We don't expand into sectors, we earn the right to serve them. By deeply understanding business workflows, we create industry-specific platforms that scale across organizations, regions, and global markets.",
        "From Neighbourhoods to Nations.",
      ],
      badge: "Long-Term Vision",
      accent: "amber",
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`

- [ ] **Step 6: Verify**

Run: `grep -n "and the whole portfolio gets smarter\|operating brain for schools, fees\|launch our third product, our most ambitious\|From healthcare and retail\|we earn the right to serve them\|From Neighbourhoods to Nations" content/about.ts`
Expected: 6 matches. Also run `grep -n "Tamil Nadu" content/about.ts` — expected: **no matches** in this file (it will still appear in `AboutRoadmap.tsx` until Task 12).

- [ ] **Step 7: Commit**

```bash
git add content/about.ts
git commit -m "content(about): fix roadmap dash punctuation, replace Horizon Three industry copy"
```

---

## Task 8: `content/about.ts` — EduOS Anchor full rewrite

**Files:**
- Modify: `content/about.ts:174-187`

**Interfaces:**
- Produces: `aboutEduOsAnchor.eyebrow`, `.heading`, `.paragraphs` (5 items), `.closingBold` (updated strings). `.title` and `.progression` are unchanged. Consumed directly by `AboutEduOsAnchor.tsx` — no component edit needed, per the user's decision to preserve that component's structure exactly.

- [ ] **Step 1: Replace the section content**

In `content/about.ts`, replace:

```ts
// 10. The 2040 Anchor (EduOS)
export const aboutEduOsAnchor = {
  eyebrow: "THE 2040 ANCHOR — EduOS",
  title: "THE LONG VIEW",
  heading: "By 2040, no student's future will be decided by incomplete information.",
  paragraphs: [
    "Today, EduOS runs a school's operations. That's the beginning, not the ambition.",
    "Every year EduOS runs, it builds a deeper understanding of how each student actually learns — not just marks, but patterns, strengths, participation, and growth over time. Multiply that across thousands of students and a decade of real outcomes, and something becomes possible that has never existed in Indian education: evidence where there was only instinct.",
    "A teacher who sees a student struggling in week three, not month three. A parent who understands their child beyond a report card. A 13-year-old who discovers a strength nobody noticed — and a path nobody thought to suggest.",
    "Not an algorithm that decides a child's future. An intelligence that makes sure nobody's future is decided by what the system failed to see.",
    "That's what we mean by a lifetime companion. And it's why we're building EduOS now, patiently, one school at a time — because the intelligence of 2040 is made of the data, trust, and understanding we earn today.",
  ],
  closingBold: "Beyond School. Beyond Marks. Beyond Tomorrow.",
  progression: ["Data", "Intelligence", "Action", "Success"],
};
```

with:

```ts
// 10. The 2040 Anchor (EduOS)
export const aboutEduOsAnchor = {
  eyebrow: "A WNR ADVISORY INITIATIVE, EduOS",
  title: "THE LONG VIEW",
  heading: "Education is not about managing schools. It is about empowering students.",
  paragraphs: [
    "EduOS was founded on a simple yet powerful belief: every student has the potential to succeed when they are understood, encouraged, and guided in the right direction.",
    "Our mission is to empower 1 Million students by 2030 by helping schools, teachers, and parents understand every learner beyond marks, enabling each student to discover their strengths and reach their fullest potential.",
    "Our vision is to create the world's most trusted student intelligence ecosystem, where every learner's educational journey is understood, supported, and celebrated from the first day of school through graduation.",
    "Every decision begins with one question: will this improve the educational experience of students?",
    "EduOS exists to bridge this gap. More than a platform, EduOS is designed to be a trusted companion throughout a student's educational journey.",
  ],
  closingBold: "Empowering Every Student. Enabling Every School. Inspiring Every Future.",
  progression: ["Data", "Intelligence", "Action", "Success"],
};
```

> Sourced from `docs/Edu Os.docx`: paragraph 1 = "About Us" section (lines 4–5 of the extracted doc), paragraph 2 = "Our Mission" (lines 27–28), paragraph 3 = "Our Vision" (lines 29–30), paragraph 4 (bold callout, unchanged index) = "Our Core Values → Student First" (lines 32–34), paragraph 5 = "About Us" closing (lines 8–9). `closingBold` = the document's own closing tagline (line 94). `eyebrow` replaces the now-inaccurate "2040" framing (the new copy targets 2030, per the Mission statement) with the document's own "A WnR Advisory Initiative" line (line 95), dash converted to comma. `progression` (`Data → Intelligence → Action → Success`) has no replacement in the source document, so per the user's "preserve everything else" instruction it is left unchanged.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Verify**

Run: `grep -n "A WNR ADVISORY INITIATIVE, EduOS\|Education is not about managing schools\|empower 1 Million students by 2030\|world's most trusted student intelligence ecosystem\|Empowering Every Student. Enabling Every School. Inspiring Every Future" content/about.ts`
Expected: 5 matches. Also confirm the old copy is gone: `grep -n "By 2040, no student" content/about.ts` → no matches.

- [ ] **Step 4: Commit**

```bash
git add content/about.ts
git commit -m "content(about): rewrite EduOS anchor section from docs/Edu Os.docx"
```

---

## Task 9: `content/about.ts` — remaining global dash-to-comma fixes

**Files:**
- Modify: `content/about.ts:15` (`aboutHero.lead`)
- Modify: `content/about.ts:64` (`aboutMission.heading`)
- Modify: `content/about.ts:93` (`aboutHowWeWork.principles[1].body`)
- Modify: `content/about.ts:112` (`aboutInsideWnr.body`)
- Modify: `content/about.ts:120` (`aboutInsideWnr.culturePillars[1].body`)

**Interfaces:**
- Produces: updated strings on the fields above; no shape/type changes.

- [ ] **Step 1: `aboutHero.lead`** — replace:

```ts
  lead: "WnR Group is an information technology and services company. We build intelligent operational systems — custom platforms, AI-enabled workflows, and vertical SaaS products — for schools, gaming businesses, and modern enterprises.",
```

with:

```ts
  lead: "WnR Group is an information technology and services company. We build intelligent operational systems, custom platforms, AI-enabled workflows, and vertical SaaS products, for schools, gaming businesses, and modern enterprises.",
```

- [ ] **Step 2: `aboutMission.heading`** — replace:

```ts
  heading: "To become the most trusted AI-native operational intelligence company — helping businesses transform complexity into clarity.",
```

with:

```ts
  heading: "To become the most trusted AI-native operational intelligence company, helping businesses transform complexity into clarity.",
```

(`AI-native` keeps its hyphen — compound word.)

- [ ] **Step 3: `aboutHowWeWork.principles[1].body`** — replace:

```ts
      body: "We measure ourselves in time saved and money recovered — not features shipped. The work isn't done at deployment; it's done when it's adopted.",
```

with:

```ts
      body: "We measure ourselves in time saved and money recovered, not features shipped. The work isn't done at deployment; it's done when it's adopted.",
```

- [ ] **Step 4: `aboutInsideWnr.body`** — replace:

```ts
  body: "We're 23+ engineers, strategists, and operators who believe the hard part was never the code — it's understanding the business well enough to build the system it truly needs. That belief shapes how we hire, how we build, and how we stay.",
```

with:

```ts
  body: "We're 23+ engineers, strategists, and operators who believe the hard part was never the code, it's understanding the business well enough to build the system it truly needs. That belief shapes how we hire, how we build, and how we stay.",
```

- [ ] **Step 5: `aboutInsideWnr.culturePillars[1].body`** — replace:

```ts
      body: "We measure ourselves in time saved and money recovered — not features shipped. The work isn't done at deployment; it's done when it's adopted.",
```

with:

```ts
      body: "We measure ourselves in time saved and money recovered, not features shipped. The work isn't done at deployment; it's done when it's adopted.",
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`

- [ ] **Step 7: Verify no stray clause-dashes remain in this file**

Run: `grep -n " — \| – " content/about.ts`
Expected: **no matches** (every remaining en/em dash in the file — if any — must be inside a compound word or the `"2025–2026"` date range, neither of which has surrounding spaces, so this grep pattern correctly catches only clause-punctuation dashes).

- [ ] **Step 8: Commit**

```bash
git add content/about.ts
git commit -m "content(about): convert remaining clause-dashes to commas"
```

---

## Task 10: `AboutChaosToClarity.tsx` — heading, justified paragraph, caption dash

**Files:**
- Modify: `components/about/AboutChaosToClarity.tsx:34-41`
- Modify: `components/about/AboutChaosToClarity.tsx:462-465`

**Interfaces:**
- Consumes: `content/about.ts::aboutWhyWeExist` (updated in Task 5).

- [ ] **Step 1: Update the hardcoded H2 to match the new heading, keeping the same two-clause color-split styling**

Replace:

```tsx
            <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.05] text-ink">
              Businesses don&apos;t fail from lack of effort.{" "}
              <span className="text-forest">They drown in complexity.</span>
            </h2>
            {aboutWhyWeExist.paragraphs.map((p, i) => (
              <p key={i} className="mt-6 text-[length:var(--text-lead)] leading-relaxed text-body">
                {p}
              </p>
            ))}
```

with:

```tsx
            <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.05] text-ink">
              Businesses don&apos;t fail from lack of effort,{" "}
              <span className="text-forest">they fail from disconnected systems.</span>
            </h2>
            {aboutWhyWeExist.paragraphs.map((p, i) => (
              <p key={i} className="mt-6 text-[length:var(--text-lead)] leading-relaxed text-body text-justify">
                {p}
              </p>
            ))}
```

(The `text-justify` class is the doc's "Alignment – Justify" instruction, scoped to this left-column paragraph.)

- [ ] **Step 2: Fix the bottom caption's clause dash**

Replace:

```tsx
                {isClarity
                  ? "Every tool synchronized into one intelligent operating system — removing silos and accelerating decisions."
                  : "Disconnected software forces manual coordination, scattering critical business intelligence across six isolated channels."}
```

with:

```tsx
                {isClarity
                  ? "Every tool synchronized into one intelligent operating system, removing silos and accelerating decisions."
                  : "Disconnected software forces manual coordination, scattering critical business intelligence across six isolated channels."}
```

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`

- [ ] **Step 4: Verify**

Run: `grep -n "they fail from disconnected systems\|text-justify\|operating system, removing silos" components/about/AboutChaosToClarity.tsx`
Expected: 3 matches.

- [ ] **Step 5: Commit**

```bash
git add components/about/AboutChaosToClarity.tsx
git commit -m "feat(about): update Why We Exist heading, justify paragraph, fix caption dash"
```

---

## Task 11: `AboutAwards.tsx` — card hover consistency, arrow + underline, trust-badge strip

**Files:**
- Modify: `components/about/AboutAwards.tsx`

**Interfaces:**
- Consumes: `content/about.ts::aboutAwards.trustPoints` (added in Task 4).

- [ ] **Step 1: Add the new icon imports**

Replace:

```tsx
import { Award, CheckCircle2, Star, Trophy } from "lucide-react";
```

with:

```tsx
import { Award, ArrowRight, CheckCircle2, Crown, Globe, ShieldCheck, Star, Target, Trophy } from "lucide-react";
```

- [ ] **Step 2: Add an icon lookup map for `trustPoints`, right after the imports**

Replace:

```tsx
export function AboutAwards() {
  const { featuredAward, recognitions } = aboutAwards;
```

with:

```tsx
const trustIcons = { Crown, Target, ShieldCheck, Globe } as const;

export function AboutAwards() {
  const { featuredAward, recognitions, trustPoints } = aboutAwards;
```

- [ ] **Step 3: Standardize the featured card's hover lift and add a gold border highlight**

Replace:

```tsx
            <div className={cn("group relative h-full rounded-3xl border border-line bg-paper p-8 sm:p-12 shadow-card transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-card-hover hover:-translate-y-1")}>
```

with:

```tsx
            <div className={cn("group relative h-full rounded-3xl border border-line bg-paper p-8 sm:p-12 shadow-card transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-card-hover hover:-translate-y-1.5 hover:border-[#c9a24b]/50")}>
```

- [ ] **Step 4: Standardize the recognition cards' hover, add the animated-underline title and the slide-in arrow**

Replace:

```tsx
              <Reveal key={rec.title} y={16} delay={0.2 + index * 0.1}>
                <div className={cn("group rounded-3xl border border-line bg-paper p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 hover:border-forest/40")}>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-wider text-forest">
                      <Award size={13} className="text-forest-bright" />
                      {rec.badge}
                    </span>
                    <span className="font-display text-xs font-bold text-muted bg-canvas px-2.5 py-1 rounded-md border border-line">
                      {rec.year}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink group-hover:text-forest transition-colors">
                    {rec.title}
                  </h3>
                  <p className="mt-2 text-sm text-body leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </Reveal>
```

with:

```tsx
              <Reveal key={rec.title} y={16} delay={0.2 + index * 0.1}>
                <div className={cn("group rounded-3xl border border-line bg-paper p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 hover:border-forest/40")}>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-wider text-forest">
                      <Award size={13} className="text-forest-bright" />
                      {rec.badge}
                    </span>
                    <span className="font-display text-xs font-bold text-muted bg-canvas px-2.5 py-1 rounded-md border border-line">
                      {rec.year}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink group-hover:text-forest transition-colors">
                    <span className="relative inline-block after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-forest after:transition-all after:duration-300 group-hover:after:w-full">
                      {rec.title}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm text-body leading-relaxed">
                    {rec.description}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <ArrowRight
                      size={16}
                      className="text-forest transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Reveal>
```

- [ ] **Step 5: Add the new trust-badge strip below the grid**

Replace:

```tsx
          </div>
        </div>
      </Container>
    </Section>
  );
}
```

with:

```tsx
          </div>
        </div>

        {/* Trust-badge strip: reference layout from docs/WnR_About_Us.docx */}
        <Reveal className="mt-8" delay={0.3}>
          <div className="rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {trustPoints.map((point) => {
                const Icon = trustIcons[point.icon];
                return (
                  <div key={point.title} className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-forest/10 p-2 text-forest shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="font-display text-sm font-bold text-ink">{point.title}</div>
                      <div className="text-xs text-muted mt-0.5">{point.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 6: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors (the `trustIcons` lookup is fully typed via `as const` on both the content array's `icon` field, from Task 4, and this map).

- [ ] **Step 7: Verify**

Run: `grep -n "trustIcons\|hover:-translate-y-1.5\|group-hover:after:w-full\|group-hover:translate-x-1" components/about/AboutAwards.tsx`
Expected: at least 5 matches across the icon map, both card hover states, the underline, and the arrow.

- [ ] **Step 8: Commit**

```bash
git add components/about/AboutAwards.tsx
git commit -m "feat(about): awards card hover consistency, animated underline/arrow, trust-badge strip"
```

---

## Task 12: `AboutRoadmap.tsx` — footer strip copy, card hover consistency

**Files:**
- Modify: `components/about/AboutRoadmap.tsx:55-61`
- Modify: `components/about/AboutRoadmap.tsx:115-121`

**Interfaces:**
- Consumes: `content/about.ts::aboutWhereWeAreGoing.horizons[2]` (updated in Task 7).

- [ ] **Step 1: Standardize card hover lift and add a per-accent border highlight**

Replace:

```tsx
                  <div
                    className={cn(
                      "rounded-3xl border p-8 sm:p-12 shadow-card transition-all duration-300 hover:shadow-xl relative overflow-hidden",
                      isFirst && "border-forest/30 bg-[linear-gradient(135deg,var(--color-paper)_0%,var(--color-forest-wash)_100%)]",
                      isSecond && "border-teal/30 bg-[linear-gradient(135deg,var(--color-paper)_0%,var(--color-teal-wash)_100%)]",
                      isThird && "border-[#c9a24b]/40 bg-[linear-gradient(135deg,#124734_0%,#0e1a13_100%)] text-white"
                    )}
                  >
```

with:

```tsx
                  <div
                    className={cn(
                      "rounded-3xl border p-8 sm:p-12 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 relative overflow-hidden",
                      isFirst && "border-forest/30 bg-[linear-gradient(135deg,var(--color-paper)_0%,var(--color-forest-wash)_100%)] hover:border-forest/50",
                      isSecond && "border-teal/30 bg-[linear-gradient(135deg,var(--color-paper)_0%,var(--color-teal-wash)_100%)] hover:border-teal/50",
                      isThird && "border-[#c9a24b]/40 bg-[linear-gradient(135deg,#124734_0%,#0e1a13_100%)] text-white hover:border-[#c9a24b]/60"
                    )}
                  >
```

- [ ] **Step 2: Replace the hardcoded "Tamil Nadu → India → Europe" footer strip with the doc's new geographic line**

Replace:

```tsx
                    {isThird && (
                      <div className="relative z-10 mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#c9a24b]">
                        <span>Compounding Geographic Scale</span>
                        <span className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          Tamil Nadu <ArrowRight size={14} /> India <ArrowRight size={14} /> Europe
                        </span>
                      </div>
                    )}
```

with:

```tsx
                    {isThird && (
                      <div className="relative z-10 mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#c9a24b]">
                        <span>Compounding Geographic Scale</span>
                        <span className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          Neighbourhoods <ArrowRight size={14} /> Nations
                        </span>
                      </div>
                    )}
```

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`

- [ ] **Step 4: Verify**

Run: `grep -n "hover:-translate-y-1.5\|Neighbourhoods <ArrowRight" components/about/AboutRoadmap.tsx`
Expected: 2 matches. Also: `grep -n "Tamil Nadu" components/about/AboutRoadmap.tsx` → no matches.

- [ ] **Step 5: Commit**

```bash
git add components/about/AboutRoadmap.tsx
git commit -m "feat(about): roadmap card hover consistency, update geographic footer copy"
```

---

## Task 13: `AboutMissionVision.tsx` — card hover consistency + icon scale

**Files:**
- Modify: `components/about/AboutMissionVision.tsx:17-27`
- Modify: `components/about/AboutMissionVision.tsx:44-59`

- [ ] **Step 1: Mission card — lift, border highlight, icon scale**

Replace:

```tsx
            <div className={cn("group relative h-full flex flex-col justify-between rounded-3xl border border-line bg-paper p-8 sm:p-12 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1")}>
              <div
                className="grid-blueprint pointer-events-none absolute inset-0 opacity-20"
                aria-hidden="true"
              />
              <div>
                <div className="flex items-center justify-between gap-4 pb-8 border-b border-line">
                  <Eyebrow>{aboutMission.eyebrow}</Eyebrow>
                  <div className="rounded-xl bg-forest-wash p-3 text-forest group-hover:bg-forest group-hover:text-white transition-colors duration-300">
                    <Compass size={22} />
                  </div>
                </div>
```

with:

```tsx
            <div className={cn("group relative h-full flex flex-col justify-between rounded-3xl border border-line bg-paper p-8 sm:p-12 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 hover:border-forest/40")}>
              <div
                className="grid-blueprint pointer-events-none absolute inset-0 opacity-20"
                aria-hidden="true"
              />
              <div>
                <div className="flex items-center justify-between gap-4 pb-8 border-b border-line">
                  <Eyebrow>{aboutMission.eyebrow}</Eyebrow>
                  <div className="rounded-xl bg-forest-wash p-3 text-forest group-hover:bg-forest group-hover:text-white transition-all duration-300 group-hover:scale-[1.08]">
                    <Compass size={22} />
                  </div>
                </div>
```

- [ ] **Step 2: Vision card — lift, border highlight, icon scale**

Replace:

```tsx
            <div className={cn("group relative h-full flex flex-col justify-between rounded-3xl border border-forest/30 bg-[linear-gradient(135deg,var(--color-forest)_0%,var(--color-forest-deep)_100%)] p-8 sm:p-12 text-white shadow-card transition-all duration-300 overflow-hidden hover:shadow-card-hover hover:-translate-y-1")}>
```

with:

```tsx
            <div className={cn("group relative h-full flex flex-col justify-between rounded-3xl border border-forest/30 bg-[linear-gradient(135deg,var(--color-forest)_0%,var(--color-forest-deep)_100%)] p-8 sm:p-12 text-white shadow-card transition-all duration-300 overflow-hidden hover:shadow-card-hover hover:-translate-y-1.5 hover:border-forest-bright/50")}>
```

Then replace:

```tsx
                  <div className="rounded-xl bg-white/10 p-3 text-white backdrop-blur-sm group-hover:bg-white group-hover:text-forest transition-colors duration-300">
                    <Eye size={22} />
                  </div>
```

with:

```tsx
                  <div className="rounded-xl bg-white/10 p-3 text-white backdrop-blur-sm group-hover:bg-white group-hover:text-forest transition-all duration-300 group-hover:scale-[1.08]">
                    <Eye size={22} />
                  </div>
```

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`

- [ ] **Step 4: Verify**

Run: `grep -n "hover:-translate-y-1.5\|group-hover:scale-\[1.08\]" components/about/AboutMissionVision.tsx`
Expected: 4 matches (2 cards × lift + icon-scale, noting the lift only appears once per card while scale appears once per card — expect at least 2 for translate and 2 for scale).

- [ ] **Step 5: Commit**

```bash
git add components/about/AboutMissionVision.tsx
git commit -m "feat(about): mission/vision card hover consistency and icon scale"
```

---

## Task 14: `AboutHowWeWork.tsx` — card hover consistency

**Files:**
- Modify: `components/about/AboutHowWeWork.tsx:44`
- Modify: `components/about/AboutHowWeWork.tsx:77`

- [ ] **Step 1: Desktop card — add missing lift and border highlight**

Replace:

```tsx
                <div className={cn("rounded-3xl border border-line bg-paper p-7 shadow-sm transition-all duration-300 hover:shadow-card-hover w-full flex-1 flex flex-col justify-start text-left")}>
```

with:

```tsx
                <div className={cn("rounded-3xl border border-line bg-paper p-7 shadow-sm transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 hover:border-forest/40 w-full flex-1 flex flex-col justify-start text-left")}>
```

- [ ] **Step 2: Mobile/tablet card — standardize shadow, add lift and border highlight**

Replace:

```tsx
              <div className={cn("rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-card")}>
```

with:

```tsx
              <div className={cn("rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 hover:border-forest/40")}>
```

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`

- [ ] **Step 4: Verify**

Run: `grep -n "hover:-translate-y-1.5" components/about/AboutHowWeWork.tsx`
Expected: 2 matches.

- [ ] **Step 5: Commit**

```bash
git add components/about/AboutHowWeWork.tsx
git commit -m "feat(about): how-we-work card hover consistency"
```

---

## Task 15: `AboutInsideWnr.tsx` — pillar card hover consistency

**Files:**
- Modify: `components/about/AboutInsideWnr.tsx:32`

- [ ] **Step 1: Add lift and shadow to the culture-pillar cards**

Replace:

```tsx
              <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]">
```

with:

```tsx
              <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-white/20 hover:bg-white/[0.07]">
```

- [ ] **Step 2: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`

- [ ] **Step 3: Verify**

Run: `grep -n "hover:-translate-y-1.5" components/about/AboutInsideWnr.tsx`
Expected: 1 match.

- [ ] **Step 4: Commit**

```bash
git add components/about/AboutInsideWnr.tsx
git commit -m "feat(about): culture-pillar card hover consistency"
```

---

## Task 16: Full verification & QA pass

**Files:** none (verification only).

- [ ] **Step 1: Full typecheck, lint, and build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all three succeed with zero errors/warnings. A successful `next build` also proves no hydration-breaking server/client mismatch was introduced (`AboutAwards.tsx`, `AboutChaosToClarity.tsx`, etc. are all `"use client"` components with no `Date.now()`/`Math.random()`/browser-only reads added by this plan, so no new hydration risk exists, but the build is the objective check).

- [ ] **Step 2: Confirm the diff is scoped to `/about`**

Run: `git diff main --stat` (or `git diff <starting-commit> --stat` if not yet merged)
Expected: every changed file is one of: `components/ui/motion.tsx`, `components/ui/Section.tsx`, `content/about.ts`, or a file under `components/about/`. No file under `app/` other than nothing (page.tsx itself is untouched), no file under `components/home/`, `components/capabilities/`, `components/careers/`, `components/layout/`, etc.

- [ ] **Step 3: Confirm no dash regressions and no leftover old copy**

Run:
```bash
grep -n " — \| – " content/about.ts components/about/*.tsx
grep -n "By 2040, no student\|Tamil Nadu\|The long-term moat is not coding\|Businesses don't fail from lack of effort\. They drown" content/about.ts components/about/*.tsx
```
Expected: the first command matches nothing (all clause-dashes converted); the second command matches nothing (all superseded copy fully replaced). Note the second pattern intentionally matches the *old* heading's exact punctuation (". They drown") so it won't false-positive on the new heading, which uses a comma instead of a period at that position.

- [ ] **Step 4: Visual/manual check across breakpoints**

Run: `npm run dev`, then open `http://localhost:3000/about` and check at minimum 375px, 768px, 1024px, 1440px widths (browser devtools device toolbar):
- No horizontal overflow/clipping in the Awards grid (7/5 split → stacks to 1 column below `lg`) or the new trust-badge strip (`grid-cols-2 lg:grid-cols-4`).
- Awards recognition card titles show an underline sweep on hover; trailing arrow slides right on hover.
- All cards across every section lift ~6px with a visible border-color change and deeper shadow on hover.
- Mission/Vision icon badges scale up slightly on hover.
- Hero primary CTA's arrow slides right on hover.
- EduOS section renders the new heading/paragraphs/closing line with no leftover "2040" mention anywhere in that section.
- Roadmap's Horizon Three card footer reads "Neighbourhoods → Nations", not "Tamil Nadu → India → Europe".
- Browser console has zero errors/warnings (React hydration warnings would appear here).

- [ ] **Step 5: Reduced-motion check**

In devtools, enable "Emulate CSS prefers-reduced-motion: reduce" (or OS-level setting) and reload `/about`. Expected: per the existing `MotionProvider`'s `reducedMotion="user"` config and the global CSS media query in `app/globals.css:267-277`, all transform-based reveal/hover animations collapse to near-instant while content remains fully visible and readable — this plan does not change that mechanism, only the y/duration values it interpolates from, so behavior here should be unchanged from before this plan.

- [ ] **Step 6: Record the one explicit N/A**

Confirm and note (no code change needed): the About page has no standalone numeric stat tile today, so the doc's "animated triggers for numbers loading for all the stats" requirement has no applicable target on this page. `hooks/useCountUp.ts` remains available, unmodified, for a future content addition if one is requested.

- [ ] **Step 7: Final commit (if Step 4/5 surfaced any fixups)**

If any visual check in Steps 4–5 required a fix, make the minimal correction, re-run Steps 1–3, then:

```bash
git add -A
git commit -m "fix(about): visual QA fixups"
```

If no fixups were needed, this step is skipped — the work is already fully committed by Tasks 1–15.

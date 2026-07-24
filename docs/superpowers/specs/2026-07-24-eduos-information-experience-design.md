# EduOS Information Experience — Design Spec

**Date:** 2026-07-24
**Status:** Awaiting approval
**Requested by:** manager requirement, relayed via `/ui-ux-pro-max` prompt

## Goal

Add a prominent CTA on the About Us page ("Discover EduOS") that opens a premium, fullscreen, animated modal telling the complete EduOS story — mission, vision, purpose, core values, roadmap — sourced verbatim from `docs/Edu Os.docx`. Must be fully isolated: no other page, section, or shared component's default behavior changes.

## Source of truth

`docs/Edu Os.docx`, extracted in full (95 lines, every sentence accounted for). Structure in the doc:

1. About Us (hero tagline + founding belief + "bridge the gap" paragraphs)
2. A Wing of WnR Advisory (Wisdom and Results philosophy)
3. Why We Started EduOS
4. Our Purpose
5. Our Mission
6. Our Vision
7. Our Core Values (5: Student First, Trust Through Responsibility, Empower Educators, Continuous Growth, Innovation with Purpose)
8. Looking Ahead
9. EduOS Roadmap: 2027, 2028, 2029, 2030, Beyond 2030 (each with a Focus line + milestone bullets; 2030 hits the "1 Million students" mission)
10. Closing tagline + "A WnR Advisory Initiative"

**Rule:** nothing invented, nothing summarized away. Every sentence above must appear somewhere in the modal (this is what AC3 "no missing sections" means in practice).

## Why existing code changes the plan

The brief asked for GSAP + Framer Motion, but this project only has `motion` (Framer Motion v12, imported as `motion/react`) — no GSAP dependency exists anywhere in `package.json`. `components/ui/motion.tsx` explicitly restricts to `LazyMotion`'s `domAnimation` feature set for bundle discipline. I'm following the project's actual stack rather than introducing a second animation library, which the brief's own "Use Framer Motion" line supports.

Second, `components/ui/dialog.tsx` wraps `@base-ui/react/dialog`, which — with default `modal={true}` — already provides focus trap, ESC-to-close, outside-click-to-close, body scroll lock, and scroll restore, with zero custom code. It also exposes `data-open` / `data-closed` / `data-starting-style` / `data-ending-style` attributes specifically for CSS-driven enter/exit transitions. This covers AC6–AC10 for free and is safer than hand-rolling a11y behavior.

Existing patterns I'm reusing rather than reinventing:

| Requirement | Existing implementation | Where |
|---|---|---|
| Fade-up / stagger reveals | `Reveal`, `Stagger`, `StaggerItem` | `components/ui/motion.tsx` |
| Scroll-progress timeline fill, alternating card reveals | `useScroll` + `useTransform` + `useMotionValueEvent` rail pattern | `components/sections/careers/HiringProcess.tsx` (pattern reused, file untouched) |
| Count-up numbers (50,000 → 1,000,000) | `useCountUp` hook, already reduced-motion-safe | `hooks/useCountUp.ts` (used as-is, unmodified) |
| Reduced-motion handling | `useReducedMotion()` from `motion/react`, used throughout the site | consistent with `HiringProcess.tsx`, `WhyUsCoverflow.tsx`, etc. |

## Content → section mapping

| Modal section | Doc source | Notes |
|---|---|---|
| Hero | "About Us" title + tagline + founding belief | Opens the modal; not the page CTA itself |
| Story | Bridge-the-gap paragraphs + "A Wing of WnR Advisory" | The Advisory sub-section isn't in the brief's suggested flow but exists in the doc, so it lives here rather than being dropped |
| Why EduOS Exists | "Why We Started EduOS" | Verbatim |
| Purpose / Mission / Vision | "Our Purpose", "Our Mission", "Our Vision" | Three cards; Purpose also isn't in the brief's suggested flow, included here |
| Core Values | "Our Core Values" (5 items) | Animated card grid, hover lift |
| Roadmap | "EduOS Roadmap" 2027→Beyond 2030 | Scroll-filling vertical timeline, alternating cards, count-up milestones |
| Future | "Looking Ahead" | Placed after Roadmap per the brief's requested flow order (doc places it before Roadmap; order doesn't affect verbatim-ness) |
| Closing | Final commitment line + tagline + "A WnR Advisory Initiative" | Ends with a close/CTA |

## Scope note on a prior decision

`docs/superpowers/plans/2026-07-24-about-us-content-refresh.md` (an earlier, already-applied plan) deliberately kept EduOS's own 2027–2030 roadmap **off** the About page itself, to avoid it being confused with WnR's own "Where We're Going" roadmap section. That decision was about the page's static content. This modal is a separate, clearly-labeled, opt-in surface — it doesn't reopen or conflict with that decision, just extends EduOS content into new isolated UI the earlier plan never considered.

## Architecture

**New files:**
- `content/eduos.ts` — all copy above, typed, isolated from `content/about.ts` (no existing exports touched)
- `components/about/eduos/EduOsModal.tsx` — dialog shell (Root/Trigger/Backdrop/Popup), trigger button, Hero + Story + Why sections
- `components/about/eduos/EduOsMissionVision.tsx` — Purpose/Mission/Vision cards
- `components/about/eduos/EduOsCoreValues.tsx` — 5-card grid
- `components/about/eduos/EduOsRoadmap.tsx` — scroll-animated timeline
- `components/about/eduos/EduOsClosing.tsx` — Looking Ahead + closing tagline
- `components/about/eduos/EduOsModal.test.tsx` — trigger opens/closes, content renders, ESC closes (mirrors existing `dialog.test.tsx` pattern)

**Edited files:**
- `components/about/AboutEduOsAnchor.tsx` — add one CTA button ("Discover EduOS") below the existing progression banner, wired to the new modal. This is the **only** existing file touched.

**Untouched (explicitly):** navigation, footer, every other About section, `dialog.tsx`, `Cta.tsx`, `motion.tsx`, `Section.tsx`, routing, SEO, global CSS, theme.

## Modal mechanics

- Trigger: locally-styled `<button>` (base-ui `DialogTrigger`) — gold/forest themed to match `AboutEduOsAnchor`'s existing dark cinematic section, since `Cta.tsx` is `href`-only (Link-based) and can't be reused for a modal trigger without changing its contract.
- Shell: `DialogPrimitive.Root` (`modal` default `true` → focus trap + scroll lock free), `Backdrop` (blurred glassmorphism that is fullscreen), `Popup` sized `90vw` / `90vh` (retains visible margins), rounded corners, soft shadow.
- Open/close animation: CSS transitions keyed to Base UI's `data-starting-style` / `data-open` / `data-ending-style` attributes (opacity + scale), respecting `motion-reduce:`. No AnimatePresence needed — Base UI manages mount/unmount timing itself.
- Internal scroll: the Popup is the scroll container; `Reveal`/`Stagger`/`whileInView` work correctly inside it (IntersectionObserver clips through nested scroll containers by default, confirmed against the existing `HiringProcess.tsx` sibling pattern).
- Close: header close button + ESC + outside-click, all via Base UI defaults.

## Verification plan

- `npx tsc --noEmit` and `npm run lint` — no errors
- New Vitest test (`EduOsModal.test.tsx`) — trigger opens modal, all major headings present (Hero, A Wing of WnR Advisory, Why EduOS Exists, Our Purpose, Our Mission, Our Vision, Our Core Values, Roadmap years, Looking Ahead, Closing tagline), ESC closes. This prevents any required mapped source section from being omitted.
- Manual dev-server pass: desktop/tablet/mobile viewport check, keyboard-only navigation through the modal, `prefers-reduced-motion` toggle check
- Confirm `git diff` touches only the files listed above — nothing else in the repo changes

## Explicitly out of scope

- No changes to `AboutRoadmap.tsx` (WnR's own roadmap) beyond what's already applied by the unrelated in-flight content-refresh work
- No GSAP dependency added
- No changes to global modal (`dialog.tsx`) behavior — new modal is a sibling, not a modification

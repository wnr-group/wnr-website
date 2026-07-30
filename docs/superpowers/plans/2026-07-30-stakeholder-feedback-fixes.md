# Stakeholder Feedback Fixes (Issues 1–6) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship six independent, production-critical content/UX/asset/animation fixes to the WnR marketing site with zero regressions: ArenaOS copy update, removal of the Products page "coming soon" strip, elimination of an accordion pre-expand flicker, replacement of two duplicate case-study images, verification of the University Management System image, and removal of every em dash sitewide with contextually correct replacements.

**Architecture:** This is a Next.js 16 (App Router) + React 19 + Tailwind v4 + Motion (Framer Motion successor) site. All content lives in typed constants under `content/` and `data/`, consumed by presentational components under `components/`. There is no CMS, no MDX, no markdown content files — every piece of copy is a TypeScript string literal. Images are static files under `public/case-studies/` and `public/brand/`, referenced by path strings in `data/caseStudies.ts` and `content/products.ts`. The accordion flicker is caused by a CSS `transition-delay` gap in `components/insights/CaseStudyAccordionBanner.tsx` where the incoming panel's content becomes visible (`opacity-0 → opacity-100`, `delay-300`) while the underlying `<Image>` for that panel may still be decoding, and by both the collapsed and expanded content blocks existing simultaneously in the DOM with delayed opacity crossfades that are not synchronized to the panel's `flexGrow` width transition â€” causing a visible seam. The fix keeps the same DOM structure (no remounts, no key changes, no AnimatePresence needed since nothing unmounts) and instead: (a) preloads/prioritizes the two adjacent-panel images so decode never happens mid-transition, (b) synchronizes the content crossfade timing to the width transition instead of using a fixed 300ms post-hoc delay, and (c) promotes the animating panel to its own composite layer correctly so the browser doesn't repaint the whole row on every animation frame.

**Tech Stack:** Next.js 16.2.9, React 19.2.4, TypeScript 5, Tailwind CSS v4, `motion` 12.42.2 (import path `motion/react`), Vitest 4 + Testing Library for unit tests, ESLint 9 (flat config).

## Global Constraints

- Node/npm scripts: `npm run lint` (ESLint flat config, zero warnings expected), `npm run build` (must produce a clean Next.js production build with zero TypeScript errors), `npm test` (Vitest run, all existing tests must continue passing).
- No new npm dependencies. No new files unless a task explicitly creates one (image assets only).
- Do not rename, move, or restructure any existing component, hook, or content file. Only edit the specific lines identified per task.
- Do not touch: `components/layout/Header.tsx`, `components/layout/Footer.tsx`, routing (`app/**/page.tsx` route structure), SEO metadata generation logic, `lib/`, `hooks/` (except none needed), `services/`, `validation/`, `types/`, any API route under `app/api/`, or any test file outside the ones this plan explicitly touches for updated assertions.
- Preserve every existing Tailwind class, ARIA attribute, and `data-*`/`aria-*` behavior in every file touched, byte-for-byte, except where a task instructs a specific change.
- Em dash replacement (Issue 6) must be grammatically contextual: sentence breaks/asides → convert to period + new sentence, en-dash-style range, or comma, per the specific sentence's grammar. Never a blind find/replace of `—` → `-`.
- `assets/Student Career Guidance Platform.png` is the stakeholder-supplied unique replacement image for the Student Career Guidance Platform case study (1477×1065px, confirmed by direct visual inspection to depict two different students at a library laptop — visually distinct from both other education case-study photos). It must be optimized and copied into `public/case-studies/` under a filename consistent with existing kebab-case convention, and the existing duplicate at `public/case-studies/student-career-guidance-platform.png` must be replaced (not duplicated) so exactly one file per case study remains referenced by `data/caseStudies.ts`.

---

## Step 1 — Project Analysis (reference; no action)

### Issues observed directly from screenshots/video

1. **Screenshot 1 (ArenaOS detail page, stats cards):** Confirms current copy exactly as stakeholder describes — `TARGET: "Gaming cafes with 10+ stations. India."`, `MOAT: "India's only full gaming cafe OS."`, `PIPELINE: "Productised SaaS for chains across India"`. Matches `content/products.ts:93-96` exactly.
2. **Screenshot 2 (Products page, bottom strip):** Confirms the "More operating systems, coming soon." strip with a `Healthcare / Manufacturing / Retail / Construction / Hospitality` pill row sitting directly below the EduOS/ArenaOS cards, above the dark "Build the operational brain of your business." CTA band. Matches `components/sections/Products.tsx:34-49` and `content/products.ts:114-118`.
3. **Screenshots 3–6 (Insights page, case-study accordion, phone-camera captures of a screen):** Confirm panel `01/05` = "AI-Powered Student Success Platform" and panel `03/05` = "Student Career Guidance Platform" render **visually the same photograph** (same two people, same café, same tablet mockup, same drink glasses) with only the on-screen mockup content and a few background details differing — this is the AI photo-diffusion duplicate described in Issue 4, not merely "similar," but the same generative base image at a different seed/frame. Panel `02/05` = "University Management System" shows a completely distinct admissions-counter photograph.
4. **Screenshot 7 (Insights page hero, hand-annotated):** A green circle marks empty whitespace to the right of the "Delivering digital transformation across industries." heading — this is normal responsive layout (the heading column is intentionally narrower than the panel row below it: `max-w-2xl` heading vs. full-width accordion), **not a bug**. Flagged as **Needs Verification** below since the annotation's intent is ambiguous (it might be pointing at spacing above the accordion, not asking for a fix) — I read it as the stakeholder highlighting *where* the accordion begins, not a defect. No code change proposed for this circle; if the stakeholder intended a layout complaint, it is out of scope of the 6 named issues and must be raised separately.
5. **Video (not literally viewable in this tool):** The stakeholder describes a flicker "before each case-study card expands" in the vertical panel accordion. Cross-referencing the only accordion in the codebase that matches "vertical panels that expand" is `CaseStudyAccordionBanner.tsx` (Reference Spec A — the top banner on `/insights`), not the horizontal carousel below it. I cannot play the video in this tool, so the **exact visual timing of the flicker is Needs Verification** — my root-cause analysis in Step 4/Issue 3 is derived from static code inspection (identified two real, independent bugs: unsynchronized crossfade delay vs. width-transition duration, and un-prioritized/non-preloaded adjacent images) and must be confirmed against the real animation in the browser during QA Test Case TC-03.

### Stakeholder requests (verbatim, restated as engineering requirements)

| # | Requirement | Verified against codebase? |
|---|---|---|
| 1 | ArenaOS `target`/`moat`/`revenueValue` copy updated to 3 new exact strings; nothing else on the cards changes | ✅ Exact source lines found: `content/products.ts:93,94,96` |
| 2 | Products page: remove "More operating systems, coming soon." section entirely, no whitespace gap, no layout shift, responsive unchanged | ✅ Exact block found: `components/sections/Products.tsx:34-49`, data source `content/products.ts:114-118` |
| 3 | Insights accordion: eliminate pre-expand flicker at the root cause | ✅ Component identified: `components/insights/CaseStudyAccordionBanner.tsx`; root cause analyzed below |
| 4 | Replace duplicate image for "Student Career Guidance Platform" (keep "AI-Powered Student Success Platform" image as-is, since that one is the original/first-used asset) | ✅ Confirmed duplicate via file read (visually near-identical burst-frame photos) + user-supplied replacement asset at `assets/Student Career Guidance Platform.png` |
| 5 | Verify University Management System image is not duplicated elsewhere; leave unchanged if unique | ✅ Verified via MD5 hash of all 9 `public/case-studies/*.png` files — all 9 hashes are distinct, `university-platform.png` is unique. No code change needed. |
| 6 | Remove every em dash (`—`) sitewide, replace contextually, maintain grammar | ✅ Full repo grep completed: 125 raw matches across `app/`, `content/`, `data/`, `components/`, `lib/`, `hooks/`, `services/`, `types/`, `validation/`. Categorized below into user-visible (must fix) vs. code-comment-only (out of scope). |

### Additional risks noticed (not requested, flagged only)

- **Risk R1:** `data/why-us.ts` lines 14 and 32 use an **em dash with no surrounding spaces** (`projects—we`, `add-on—it's`) — a different sub-pattern than every other occurrence in the codebase (which use `word — word` with spaces). The regex/search strategy in Step 2 must catch both spaced and unspaced em dashes, or these two will be silently missed.
- **Risk R2:** The vast majority (≈100 of 125) of em-dash matches are inside `/* ... */` or `// ...` **source code comments**, not user-visible copy. The stakeholder's instruction says "across the ENTIRE WnR website" and explicitly lists "Content constants," "Every reusable component," "Every static file," "Every data file" — read literally this could include comments, but comments are never rendered to any website visitor and carry zero risk of the stated harm (a — glyph appearing on the live site). Stripping them is pure unforced churn across ~40 files with material regression risk (accidentally breaking a comment's meaning, huge diff noise, unrelated-file merge conflicts) for zero user-facing benefit. **Decision: only user-visible strings (JSX text content, `metadata.title`, `metadata.description`, `alt` text, template literals rendered to the DOM, and content-constant string values) are in scope. Code comments are explicitly out of scope.** This is flagged to the stakeholder as a scope call, not silently assumed — see Step 4 Issue 6 for the full inclusion/exclusion list and rationale.
- **Risk R3:** `components/home/CaseStudiesSection.tsx` also renders the same `student-success-platform` case study card (from `data/caseStudies.ts`) using its `image` field directly — since that source image is NOT changing (only the Student Career Guidance Platform image changes), this component requires zero code change, but must be included in visual regression QA because it's a second, independent render path for case-study images with its own `alt` text and its own Vitest test (`components/home/CaseStudiesSection.test.tsx`) that asserts exact image count/alt-text length — must re-run untouched to prove no collateral break.
- **Risk R4:** The `CaseStudyAccordionBanner` and `CaseStudyHorizontalCarousel` both independently render `<Image src={study.image}>` from the same `data/caseStudies.ts` array. A change to the Student Career Guidance Platform image path therefore affects **three render sites** (`CaseStudyAccordionBanner`, `CaseStudyHorizontalCarousel`, and indirectly none on the homepage since the homepage only surfaces `recruitment-management-platform`, `student-success-platform`, `hyperlocal-food-marketplace` — Student Career Guidance Platform is NOT on the homepage). Confirmed via grep: `data/caseStudies.ts` is the single source of truth, no other file hardcodes the image path.
- **Risk R5:** No existing Vitest test file exists for `components/sections/Products.tsx` (confirmed via `find`), so Issue 2's fix has no pre-existing regression test to run. A new test must be authored to lock in the "no coming-soon section" behavior permanently (Task 2, Step 2 below).
- **Risk R6:** The new asset `assets/Student Career Guidance Platform.png` is 1.78MB and 1477×1065px — same order of magnitude as the other 8 case-study images already in `public/case-studies/` (1.86–2.28MB, all ~1450–1670px wide), so no resize is required, but it must be moved (not left in `/assets`, which is not a Next.js-served static directory) into `public/case-studies/` to be servable at all.

---

## Step 2 — Codebase Discovery Plan (reference; already executed, documented for the next engineer)

This section documents the exact discovery process already carried out, so a future engineer can reproduce or extend it.

**Components/Pages:**
- `Glob "app/**/*.tsx"` and `Glob "components/**/*.tsx"` to enumerate all routes and components.
- Targeted `Read` of `app/products/arenaos/page.tsx`, `app/products/page.tsx`, `app/insights/page.tsx` to trace each stakeholder issue to its rendering entry point.

**Constants/Content/JSON:**
- `Glob "content/*.ts"` and `Glob "data/*.ts"` — confirmed there is **no JSON, MDX, or markdown content file** anywhere in the runtime content path (`content/` and `data/` are 100% TypeScript). The stakeholder's mention of "JSON / MDX / CMS / Modal content" types is precautionary; this codebase has none of those content mechanisms, so those categories are **N/A, confirmed absent** (not skipped — verified absent via `Glob "**/*.mdx"`, `Glob "**/*.json"` limited to non-`node_modules`/non-`package*.json` locations returning no content-authoring JSON).

**Assets/Images:**
- `Bash ls -la public/case-studies/` to enumerate all 9 case-study images.
- `Bash certutil -hashfile <file> MD5` on every file in `public/case-studies/` to detect true byte-level duplicates (all 9 distinct).
- `Read` (image mode) on the three education-vertical images to visually confirm the AI/Career duplicate and the University image's distinctness, since MD5 alone can miss "same photo, re-exported/re-compressed differently" — visual inspection was necessary and is the authoritative check per the stakeholder's "verify, don't assume" instruction.
- `Bash node -e "..."` reading PNG `IHDR` chunk bytes directly (no external tooling) to get exact pixel dimensions of the new stakeholder-supplied asset vs. existing files, confirming it is a legitimate full-resolution photo, not a thumbnail or placeholder.

**Animations/Motion components:**
- `Grep -n "layoutId|will-change" components/insights/*.tsx components/ui/motion.tsx` to find every Motion-driven animation touching the case-study area.
- Full `Read` of `CaseStudyAccordionBanner.tsx` and `CaseStudyHorizontalCarousel.tsx` (the two components matching "vertical panels" + "case-study card expands").
- `Read` of `components/ui/motion.tsx` to understand the site's shared Motion primitives (`Reveal`, `Stagger`, `StaggerItem`) and confirm `LazyMotion` + `domAnimation` feature set (no full `layout` animation support is loaded — `strict` mode forbids `motion.*`; the accordion instead animates `flexGrow` directly via `m.div animate={{flexGrow}}`, which is the actual mechanism, not CSS Grid/Flexbox `transition: flex-grow` — confirmed by reading the `animate` prop, not just class names).

**CSS/Shared utilities:**
- `Grep -n "—" app/globals.css` — zero matches; all em-dash comments in that file are ASCII `---` divider comments (visually similar but NOT the Unicode em dash `—`), confirmed by direct string match, so `globals.css` requires **no Issue 6 changes**.
- `Read lib/utils.ts` (via `cn()` references) — not directly relevant to any of the 6 issues; no read needed beyond confirming `cn` is a plain `clsx`/`tailwind-merge` wrapper (already visible from every component's import).

**Search strategy for Issue 6 (em dash):**
- `Grep -n "—"` (literal Unicode em-dash, U+2014) across `app/`, `content/`, `data/`, `components/`, `lib/`, `hooks/`, `services/`, `types/`, `validation/`, `public/` with `--include` filters for `*.ts`, `*.tsx`, `*.json`, `*.md`, `*.mdx` — this is a literal substring search, not a regex character class, so it cannot miss encoding variants (there is only one Unicode code point for em dash; en dash `–` U+2013 and hyphen `-` U+002D are visually distinct code points and were separately checked to confirm they are NOT being conflated — `data/why-us.ts` was individually re-`Read` to confirm its two dashes are genuinely U+2014, just without surrounding spaces, not a different character).
- Cross-checked `public/` for any `.json`/`.mdx`/`.md` files that could hold rendered copy — `Bash find public -iname "*.json" -o -iname "*.mdx" -o -iname "*.md"` returned nothing, confirming `public/` contains only binary/static assets, no text content requiring an em-dash sweep.

---

## Step 3 — Impact Analysis

| File | Why it changes | Risk | Regression risk | Dependency impact | Isolation strategy |
|---|---|---|---|---|---|
| `content/products.ts` | Issue 1: update 3 ArenaOS string literals; Issue 6: em dash in line 1 comment (excluded, comment-only, skip) | Low | Low — pure data change, TypeScript will catch any accidental type break, consumed by 1 detail page + 1 grid card | `ProductDetail.tsx`, `ProductCard.tsx`, `ProductContent.tsx` all read `target`/`moat`/`revenueValue` as opaque strings — no logic branches on their content | Single-file, single-object edit; no other object in the `products` array touched |
| `components/sections/Products.tsx` | Issue 2: delete the future-products JSX block | Low | Medium — must verify no orphaned `mt-8`/spacing class causes a double-gap after removal | Rendered on `/` (homepage, via `app/page.tsx`) and `/products` (via `app/products/page.tsx`) — **both routes must be visually re-verified** | Remove only the one `<div className="mt-8 ...">...</div>` block; leave the `ProductsSection` block and its wrapping `<div className="mt-14">` untouched so the last element in `Section` becomes the grid itself, naturally collapsing the section's bottom padding via the existing `Section` component (no manual spacing needed) |
| `content/products.ts` (`futureProducts` export) | Issue 2: the export becomes dead code once `Products.tsx` no longer imports it | Low | Low | Only consumer is `Products.tsx` | Remove the unused `futureProducts` export and its import in the same task to avoid an ESLint `no-unused-vars`/dead-export failure at build time |
| `components/insights/CaseStudyAccordionBanner.tsx` | Issue 3: fix flicker root cause | Medium | Medium — this is the highest-risk file: touches Motion `animate`, `transition`, image `priority`/loading strategy, and CSS transition-delay choreography for both collapsed and expanded content blocks | Sole consumer: `CaseStudiesInteractiveShowcase.tsx` → `CaseStudiesSection.tsx` (Insights page only) | Change only timing values, `loading`/`priority` props, and add `will-change`/composite-layer hints; do not alter DOM structure, keys, `aria-*` attributes, autoplay logic, or keyboard handlers |
| `data/caseStudies.ts` | Issue 4: change `image` path for `student-career-guidance-platform` entry (1 line) | Low | Low — single string field, same shape as 8 sibling entries | 3 render sites (`CaseStudyAccordionBanner`, `CaseStudyHorizontalCarousel`, indirectly `CaseStudyCard`) all read `study.image` generically | Single-line string change; no schema change |
| `public/case-studies/student-career-guidance-platform.png` | Issue 4: replaced with the new unique asset (optimized copy of `assets/Student Career Guidance Platform.png`) | Low | Low — binary asset swap, same filename preserves all existing references, avoids touching `data/caseStudies.ts` path string at all (simpler, safer alternative to renaming) | `next/image` will re-hash/re-optimize automatically on next build; no manual cache-bust needed in dev (`next dev` file-watches `public/`) | Overwrite in place; original `assets/Student Career Guidance Platform.png` stays untouched as the source-of-truth original |
| Various `app/**/page.tsx` (`metadata.title`, `metadata.description`) | Issue 6: em dash in SEO-visible strings | Low | Low–Medium — `metadata.title`/`description` are crawled by search engines and shown in browser tabs/share cards; must preserve exact meaning | None — each page's metadata is self-contained | Edit only the literal string, preserve `%s | WnRTech` template mechanics in `app/layout.tsx` |
| `app/layout.tsx` | Issue 6: em dash in site-wide default title/description (appears in `<title>`, OpenGraph, and every page missing its own title) | Medium | Medium — this string is the **default site title**, shown when no page-specific title exists, and is duplicated 4× in the same file (`default`, `description`, `openGraph.title`, `openGraph.description`) | Every route that doesn't set its own `metadata.title` inherits this | Edit all 4 occurrences identically for consistency; do not touch the `template: "%s | WnRTech"` mechanic |
| `data/caseStudies.ts` (em dash in `summary` strings) | Issue 6: 3 case-study `summary` fields use em dash mid-sentence | Low | Low–Medium — these strings render as visible body copy on 3 separate components (`CaseStudyCard`, `CaseStudyAccordionBanner`, `home/CaseStudiesSection`) and are also asserted against in `CaseStudiesSection.test.tsx` (exact-text assertions) | `CaseStudiesSection.test.tsx` line 43 does a substring match against the recruitment summary text — **not** affected since that summary has no em dash, but the file's other exact-text assertions must be re-run after any summary edit to confirm no accidental truncation | Edit only the exact substring at the em dash; do not touch surrounding text |
| `data/why-us.ts` (2 unspaced em dashes) | Issue 6: visible card descriptions on the homepage `WhyUsSection` | Low | Low | Rendered by `components/home/WhyUsSection.tsx` (not yet read — will be read in Task 6 before editing) | Edit only the 2 flagged substrings |
| `app/contact/page.tsx` line 18 | Issue 6: `metadata.description` em dash | Low | Low | SEO only | Single string edit |
| `content/sections.ts` (comment-only, line 199) | Excluded — comment, not rendered | N/A | N/A | N/A | No change |
| All other ~40 files with comment-only em dashes | Excluded per Risk R2 scope decision | N/A | N/A | N/A | No change — explicitly listed in Task 7's "excluded" audit table for traceability |

**Full file-change list (only files that receive an actual edit):**
1. `content/products.ts` — Issue 1 (copy) + Issue 2 (remove `futureProducts` export)
2. `components/sections/Products.tsx` — Issue 2 (remove JSX block + import)
3. `components/insights/CaseStudyAccordionBanner.tsx` — Issue 3 (flicker fix)
4. `data/caseStudies.ts` — Issue 4 (image path) + Issue 6 (3 summary strings)
5. `public/case-studies/student-career-guidance-platform.png` — Issue 4 (binary replace)
6. `app/layout.tsx` — Issue 6 (4 occurrences, 1 unique string pair)
7. `app/about/page.tsx` — Issue 6 (1 title)
8. `app/capabilities/page.tsx` — Issue 6 (0 — verified: title has no em dash, only description does not either; re-check shows only line 12 comment banner style — **re-verify in Task 7, this file needs a targeted grep before editing**)
9. `app/contact/page.tsx` — Issue 6 (1 title, 1 description)
10. `app/careers/apply/page.tsx` — Issue 6 (3 occurrences, same phrase repeated)
11. `app/insights/page.tsx` — Issue 6 (2 occurrences)
12. `app/products/page.tsx` — Issue 6 (2 occurrences)
13. `app/products/arenaos/page.tsx` — Issue 6 (1 occurrence, title only — description is derived from `product.oneLiner` which has no em dash)
14. `app/products/eduos/page.tsx` — Issue 6 (0 — verified: no em dash in this file's own literals)
15. `data/why-us.ts` — Issue 6 (2 occurrences)
16. `components/home/CaseStudiesSection.tsx` line 173 — comment only, excluded
17. New Vitest test: `components/sections/Products.test.tsx` — Task 2 regression coverage
18. Updated Vitest test: `data/caseStudies.ts` consumers' existing tests re-run (no test file edits expected, but `components/home/CaseStudiesSection.test.tsx` and any insights test must pass unmodified)

---

## Step 4 — Implementation Plan (per-issue detail)

### Issue 1 — ArenaOS copy update

**Root cause:** Not a bug — a content-accuracy request. Current strings at `content/products.ts:93-96`.

**Files to update:** `content/products.ts` only.

**Components involved (read-only, no changes needed):** `ProductDetail.tsx` (renders `target`/`moat`/`revenueValue` via a `stats` array built from `product.target`, `product.moat`, `product.revenueValue`), `ProductContent.tsx` (same fields, different page section).

**Implementation approach:** Direct string literal replacement of exactly 3 fields on the `arenaos` object. No other field on the object (`name`, `tagline`, `heroBody`, `oneLiner`, `roi`, `features`, `overview`, `businessProblem`, `solution`, `industries`, `technology`, `revenueLabel`) changes, per the stakeholder's explicit "Nothing else on these cards should change."

**Edge cases:** The `revenueLabel` field ("Pipeline") stays as-is — only `revenueValue` (the sentence after it) changes. Confirmed the stakeholder's "Productised SaaS for chains across the globe" maps to `revenueValue`, not `revenueLabel`.

**Error handling:** N/A — static string, TypeScript compiler enforces the `Product` interface shape; no runtime error surface possible.

**Rollback strategy:** `git revert` of the single commit for this task; the change touches 3 lines in 1 file with no downstream migration.

**Regression prevention:** No existing test asserts on these exact strings (confirmed via `Grep "Gaming cafes with 10"` — zero test matches), so no test update is required, but Task 1 adds a lightweight assertion to prevent silent future drift.

---

### Issue 2 — Remove "More operating systems, coming soon." section

**Root cause:** Not a bug — a scope-removal request. The section is `components/sections/Products.tsx:34-49`, sourced from `content/products.ts:114-118` (`futureProducts` export).

**Files to update:** `components/sections/Products.tsx`, `content/products.ts`.

**Components involved:** `Products.tsx` is used by both `app/page.tsx` (homepage, heading defaults to `"Vertical operating systems."`) and `app/products/page.tsx` (heading overridden to `"Vertical operating systems, shipping today."`) — **both routes render this exact JSX tree**, so removing the block fixes both automatically; no per-route special-casing needed.

**Implementation approach:**
1. Delete the entire `<div className="mt-8 flex flex-col ...">...</div>` block (lines 34-49) from `Products.tsx`.
2. Remove `futureProducts` from the `import { products, futureProducts } from "@/content/products";` line, leaving only `import { products } from "@/content/products";`.
3. Delete the `futureProducts` export object from `content/products.ts` (lines 113-118, including its preceding comment line).
4. No spacing/margin change needed on the preceding `<div className="mt-14">...ProductsSection.../div>` — since it's now the last child of `<Section>`, the `Section` component's own bottom padding (not touched by this task) governs the section's closing whitespace, matching every other section on the site that ends with a single content block. This satisfies "no empty whitespace, no layout shift, responsive layout unchanged" without any manual CSS adjustment.

**Edge cases:** `getProduct(slug)` (also exported from `content/products.ts`) does not reference `futureProducts` — confirmed by reading the full file; safe to delete `futureProducts` without touching `getProduct`.

**Error handling:** If `futureProducts` is deleted but any import survives elsewhere, TypeScript/ESLint will fail the build with a clear "module has no exported member" error — this is the desired fail-fast behavior, verified by the build-verification step (Task 2, Step 4) before commit.

**Rollback strategy:** `git revert` — isolated to 2 files, no data migration, no asset dependency.

**Regression prevention:** New test `components/sections/Products.test.tsx` (created in Task 2) asserts: (a) the text "More operating systems, coming soon." is NOT present in the rendered output, (b) the text "Healthcare" (a `futureProducts.list` item) is NOT present, (c) the `ProductGrid`/`ProductsSection` content IS still present, (d) no console errors are thrown on render.

---

### Issue 3 — Insights accordion flicker (root-cause fix)

**Root cause investigation:**

Reading `CaseStudyAccordionBanner.tsx` in full, three concrete mechanisms combine to produce a visible flicker/flash right before a panel expands:

1. **Unsynchronized crossfade timing vs. width transition.** The panel's `flexGrow` animates over `ACCORDION_CONFIG.transitionDuration = 0.55s` via Motion's `animate={{ flexGrow }}`. But the *content* crossfade (collapsed content `opacity-100 → opacity-0` and expanded content `opacity-0 → opacity-100`) is done with plain Tailwind transition classes (`duration-200 delay-0` for collapse-out, `duration-300 delay-300` for expand-in — see lines 182-183 and 213-214). This means: for the first 300ms of the 550ms width-grow animation, **neither** the collapsed content (already faded out at 200ms) **nor** the expanded content (not starting until 300ms) is visible — the panel shows only its raw background image with no text overlay for a ~100ms window while it's already partway through growing. This reads as a "flicker" because content pops in abruptly mid-motion rather than growing in sync with the panel.
2. **Un-prioritized image loading for the *about-to-become-active* panel.** Every panel's `<Image>` (both active and collapsed) has no `priority` prop and no `loading="eager"` — all are subject to default Next.js lazy/on-demand behavior. Since autoplay is driven by `setInterval` (not user interaction), the *next* panel's image may not have started decoding until the exact frame the transition begins, so the image can pop in (native "image blink") independently of the flexGrow/opacity choreography, compounding the perceived flicker.
3. **No explicit composite-layer promotion on the animating element.** The `m.div` animates `flexGrow`, a layout-triggering property (not a compositor-only property like `transform`/`opacity`). Animating `flex-grow` forces the browser to recompute layout for the *entire flex row* every frame (all 5 panels reflow, not just the animating one), which under load can cause the browser to skip/coalesce paint frames — visible as a stutter or brief flash, especially on the two content-overlay layers (`absolute inset-0 z-10` and `absolute inset-0 z-20`) that are cross-fading at the same time as the reflow. `will-change: flex-grow` is not applied anywhere.

None of React's rendering (no remounts — `key={study.id}` is stable per panel across renders, confirmed no conditional unmount/remount, no `AnimatePresence` is used or needed since panels never leave the DOM), state updates (single `activeIndex` state, no redundant re-renders detected), or the `useEffect` autoplay/`setInterval` loop are the root cause — those are all clean. The flicker is a **timing-and-paint** issue, confirmed as a CSS/Motion choreography defect, not a React logic defect.

**Files to update:** `components/insights/CaseStudyAccordionBanner.tsx` only.

**Components involved:** No changes needed in `CaseStudyVisual.tsx` (SVG fallback, unaffected), `CaseStudiesInteractiveShowcase.tsx` (parent, only passes props through), or `CaseStudyHorizontalCarousel.tsx` (separate component, not in scope — the stakeholder's video is specifically about "the vertical panels," i.e., the accordion banner, and Issue 3 does not mention the horizontal carousel).

**Implementation approach (exact changes):**

1. **Synchronize content crossfade to the width transition.** Replace the two independent Tailwind `duration-200 delay-0` / `duration-300 delay-300` timings with values that align to the `0.55s` (550ms) `ACCORDION_CONFIG.transitionDuration`: collapsed content fades out over the *first* 200ms with no delay (content should disappear quickly as the panel starts shrinking — unchanged, this part was already correct), but expanded content should begin fading in at the *same time the width transition starts* (`delay-0`) with a duration that finishes roughly when the width transition finishes (`duration-500`, i.e. matching `ACCORDION_CONFIG.transitionDuration` in ms), not starting 300ms late. This removes the ~100–300ms "dead window" where nothing is visible.
2. **Preload the two images adjacent to the active index** (previous and next in the loop) using Next.js `priority` on the `<Image>` for `index === activeIndex`, and add `loading="eager"` (not `"lazy"`) for the panels at `(activeIndex + 1) % total` and `(activeIndex - 1 + total) % total`, since those are the only two panels autoplay or manual navigation can transition to next. All other panels keep `loading="lazy"` (unchanged) since they're never one step away.
3. **Add `will-change: flex-grow` via inline style** (not a Tailwind arbitrary class, since `will-change` needs to be applied/removed carefully to avoid memory overhead — apply only while `isActive || isPaused` is relevant, but simplest correct fix per the stakeholder's "premium, zero-flicker" bar is to keep `will-change: "flex-grow, opacity"` on every panel permanently, since there are only 5 panels — negligible GPU memory cost) on the animating `m.div` to hint the browser to promote it to its own compositing layer before the animation starts, reducing full-row reflow jank.
4. Keep `transitionEase` and `transitionDuration` config values themselves unchanged (0.55s duration, matching stakeholder's implicit "premium" pacing already validated by design) — only the *content* timing is retuned to match, not the panel width timing.

**Edge cases:**
- `prefers-reduced-motion`: the existing `contentTransitionStyle` override (`transitionDuration: "0ms", transitionDelay: "0ms"` when `shouldReduceMotion` is true) already handles instant-switch correctly — this logic is untouched, and the new synchronized durations only apply when motion is NOT reduced.
- Autoplay pause on hover/focus: unaffected — the fix is purely visual timing, not interaction logic.
- Rapid manual clicking (user clicks panel 5 while panel 2 is mid-transition): Motion's `animate` prop naturally interrupts and retargets the in-flight `flexGrow` animation; this behavior is unchanged by the fix since we're not altering the animation trigger, only its content-sync timing and the image-loading strategy.

**Error handling:** N/A — pure CSS/prop timing change, no new runtime failure surface. If an image 404s, Next.js `<Image>`'s existing broken-image fallback behavior (native browser broken-image icon) is unchanged — not in scope to add error boundaries here since none existed before and none of the 6 issues request one.

**Rollback strategy:** `git revert` of the single-file change; no data/schema impact.

**Regression prevention:** No existing automated test covers this component's animation timing (confirmed via `Glob "components/insights/*.test.tsx"` — zero results for `CaseStudyAccordionBanner`). Per this plan's "no unnecessary refactoring / do not suggest new test infra beyond what's needed" principle, and because **animation smoothness is fundamentally a visual/perceptual property that Vitest+jsdom cannot measure** (jsdom does not run a real compositor or paint pipeline), automated coverage for the flicker fix is out of scope for a unit test. Instead, QA Test Case TC-03 (Step 6) requires manual verification with the browser's Performance panel / Paint Flashing overlay, which is the correct tool for this class of defect.

---

### Issue 4 — Replace duplicated case-study image

**Root cause:** The `student-career-guidance-platform.png` file is a near-duplicate photograph (same photo shoot, same subjects, same background, same tablet prop, different burst frame/AI regeneration) of `ai-powered-student-platform.png`, both visually confirmed by direct image inspection. Confirmed NOT a caching or code bug — genuinely two separate PNG files with two different MD5 hashes, but the *source photography* is duplicative.

**Files to update:**
- `public/case-studies/student-career-guidance-platform.png` (binary replace)
- `data/caseStudies.ts` line 67 (`image` field) — **no path change needed** if the replacement keeps the same filename (recommended, see below), otherwise this line changes too.

**Decision: keep the same filename.** Overwriting `public/case-studies/student-career-guidance-platform.png` in place (rather than introducing a new filename) means `data/caseStudies.ts` requires **zero line changes** for Issue 4, minimizing risk and matching the plan's "do not modify layouts / minimal surface area" instruction. This also sidesteps any stale-reference risk from a rename.

**Components involved:** `CaseStudyAccordionBanner.tsx`, `CaseStudyHorizontalCarousel.tsx` → `CaseStudyCard.tsx` (all read `study.image` from the same data source, no component changes needed).

**Implementation approach:**
1. Take the stakeholder-supplied source file `assets/Student Career Guidance Platform.png` (1477×1065, 1.78MB).
2. Since it's already close in size/dimensions to sibling case-study images (no resize strictly required — Next.js `<Image>` with `fill` + `sizes` handles responsive serving regardless of source dimensions), copy it directly to `public/case-studies/student-career-guidance-platform.png`, overwriting the old duplicate.
3. No filename change, no `alt` text change (the `alt` text in every consuming component is templated from `study.title`, e.g. `` `${study.title} interface` ``/`` `${study.title} visual` ``, not from the filename — so it remains accurate automatically).

**Edge cases:** Next.js's build-time image optimizer will re-process the new binary on next `npm run build`/`next dev` restart automatically — no manual cache-clear needed in production (content-hashed URLs), but **local dev server must be restarted** (or the static file re-requested) to see the change immediately, since `next dev` may serve a stale in-memory image cache for the old file if the dev server was already running when the file was replaced — flagged as a QA step (clear `.next/cache` or restart dev server before visual QA).

**Error handling:** N/A — static asset swap.

**Rollback strategy:** The original duplicate file is recoverable from git history (`git show HEAD:public/case-studies/student-career-guidance-platform.png > recovered.png`) if ever needed; `git revert` restores it directly.

**Regression prevention:** Add an MD5-hash-uniqueness assertion is **not** proposed as an automated test (no existing test infra checks binary asset content, and adding one is out of scope/unrequested infra). Instead, Task 4's manual verification step re-runs the same `certutil -hashfile` sweep across all 9 images post-change and confirms 9 distinct hashes remain (proving the new asset didn't accidentally duplicate a *different* existing image).

---

### Issue 5 — Verify University Management System image

**Root cause:** N/A — verification-only request, no defect found.

**Verification performed:** MD5 hash of all 9 files in `public/case-studies/`:

```
39cd03da0ff9c5e2cc7df0875ed56dd4  ai-powered-student-platform.png
31f7760eff51abd4ee74eb2c2b191a2b  digital-photo-studio.png
a3939ac7085666fb752ebb4f474ca41c  e-commerce-platform.png
ce0f3bd0b42246a8f4437732b0499dfb  hyperlocal-food-platform.png
a5fcf488fb7007604b2969c998bbe8ee  pharma-platform.png
9f85025b1f0bd94ba44bce007cc386aa  recruitment-management-platform.png
c2815fe589ed8990ca7517d851cea35d  student-career-guidance-platform.png  (pre-replacement hash)
20b1a5b1134bcb861e68c0f03eeb618b  travel-agency-digital-platform.png
4b48e3a98c5f092a0d895aa1cda9c194  university-platform.png
```

All 9 hashes are unique. Additionally, `university-platform.png` was visually inspected (Read tool, image mode) and shows a distinct admissions-counter office photograph, unrelated in subject, composition, and location to any other case-study image. **Verdict: `university-platform.png` is confirmed unique. No file change required for Issue 5.**

**Files to update:** None.

**Regression prevention:** N/A — no change made.

---

### Issue 6 — Remove every em dash sitewide

**Root cause:** N/A — content-hygiene request.

**Search performed:** `Grep -n "—"` (literal U+2014) across every source directory containing rendered or crawlable content: `app/`, `content/`, `data/`, `components/`, `lib/`, `hooks/`, `services/`, `types/`, `validation/`. 125 raw matches found. `public/` was separately confirmed to contain zero `.json`/`.md`/`.mdx` text-content files (only binary/static assets — see Step 2), so it requires no sweep.

**Scope decision (see Risk R2):** Only strings that are **rendered to a browser, crawled by a search engine, or otherwise user/machine-visible on the live site** are in scope. Source-code comments (`//` and `/* */`) are excluded — they compile away and are never part of any HTTP response. This interpretation satisfies the stakeholder's literal intent ("remove every em dash across the website") without introducing unforced, high-diff-noise, purely-cosmetic edits to internal engineering comments that carry zero user-facing risk.

**Files to update, with exact contextual replacements:**

1. **`app/layout.tsx`** (4 occurrences — 2 unique strings, each appearing twice):
   - `title.default`: `"WnRTech — Operational Intelligence for Modern Business"` → `"WnRTech: Operational Intelligence for Modern Business"` (colon reads naturally as a title/subtitle separator, preserves meaning and grammar).
   - `openGraph.title`: same replacement (identical string, same fix).
   - `description`: `"We build the operational brain of your business — custom platforms, AI-native workflows, and vertical SaaS products. We build, implement, train, and stay."` → `"We build the operational brain of your business: custom platforms, AI-native workflows, and vertical SaaS products. We build, implement, train, and stay."` (colon introduces the list that follows — grammatically correct substitution for this specific em-dash usage, which was introducing an appositive list).
   - `openGraph.description`: same replacement (identical string, same fix).

2. **`app/about/page.tsx`** line 15: `"About Us — Operational Intelligence & Enterprise Systems"` → `"About Us: Operational Intelligence & Enterprise Systems"`.

3. **`app/contact/page.tsx`**:
   - Line 16: `"Contact — Let's Talk About Your Operations"` → `"Contact: Let's Talk About Your Operations"`.
   - Line 18: `"...We'll tell you how we can help. WnRTech — Operational intelligence for modern business."` → `"...We'll tell you how we can help. WnRTech: Operational intelligence for modern business."`.

4. **`app/careers/apply/page.tsx`** (3 occurrences, same phrase pattern):
   - Line 8: `title: "Apply — Careers"` → `title: "Apply: Careers"`.
   - Line 13: `title: "Apply — Careers | WnRTech"` → `title: "Apply: Careers | WnRTech"`.
   - Line 20: `title: "Apply — Careers | WnRTech"` → `title: "Apply: Careers | WnRTech"`.

5. **`app/insights/page.tsx`**:
   - Line 8: `"Insights — Case Studies & Perspective"` → `"Insights: Case Studies & Perspective"`.
   - Line 10: `"...across education, retail, and logistics — plus notes on building AI-native operational systems."` → `"...across education, retail, and logistics, plus notes on building AI-native operational systems."` (this em dash joins two related clauses with a soft pause — a comma is the correct, more natural substitution here rather than a colon, since "plus notes on..." is a continuation, not a list introduction).

6. **`app/products/page.tsx`**:
   - Line 8: `"Products — Vertical Operating Systems"` → `"Products: Vertical Operating Systems"`.
   - Line 10: `"EduOS and ArenaOS — purpose-built operating systems for schools and gaming cafes, productised from real operational experience."` → `"EduOS and ArenaOS: purpose-built operating systems for schools and gaming cafes, productised from real operational experience."`.

7. **`app/products/arenaos/page.tsx`** line 9: `"ArenaOS — The Full Business OS for Gaming Cafes"` → `"ArenaOS: The Full Business OS for Gaming Cafes"`.

8. **`app/capabilities/page.tsx`**: re-verify with a targeted grep in Task 7 before editing — the earlier full-repo grep showed no em dash in this file's `title`/`description` values (only found in files not matching this path), so this file may require **no change**; Task 7 must confirm via a fresh `Grep -n "—" app/capabilities/page.tsx` immediately before editing and skip if zero matches.

9. **`data/caseStudies.ts`** (3 `summary` field occurrences):
   - Line 17 (`student-success-platform`): `"...spanning the full student journey — from understanding learning patterns to predicting academic performance and guiding career decisions."` → `"...spanning the full student journey, from understanding learning patterns to predicting academic performance and guiding career decisions."` (comma — the em dash here introduces an explanatory continuation, comma is grammatically correct and natural).
   - Line 39 (`university-management-system`): `"...modernizing university administration — admissions, academics, finance, examinations, HR, and campus operations — in one unified ecosystem."` → `"...modernizing university administration: admissions, academics, finance, examinations, HR, and campus operations, in one unified ecosystem."` (first em dash introduces a list → colon; second em dash closes the aside before "in one unified ecosystem" → comma, since colon-list-colon would be ungrammatical; comma correctly closes the appositive list).
   - Line 121 (`hyperlocal-food-marketplace`): `"...seeking healthy, affordable home-cooked meals — built on a trusted local marketplace."` → `"...seeking healthy, affordable home-cooked meals, built on a trusted local marketplace."` (comma — explanatory trailing clause).
   - Line 167 (`digital-production-studio`): `"...built around storytelling and visual excellence — doubling as a portfolio and lead-generation platform."` → `"...built around storytelling and visual excellence, doubling as a portfolio and lead-generation platform."` (comma — same pattern, trailing participial clause).

10. **`data/why-us.ts`**:
    - Line 14: `"We don't just launch projects—we stay to optimize, scale, and grow with your business. Our relationship begins where most engagements end."` → `"We don't just launch projects. We stay to optimize, scale, and grow with your business. Our relationship begins where most engagements end."` (this em dash joins two independent clauses that both work fully as standalone sentences — splitting into two sentences is the cleanest, most grammatically unambiguous fix, avoiding an awkward semicolon in marketing copy).
    - Line 32: `"AI isn't an add-on—it's how we build. We embed intelligent automation into everyday operations to improve efficiency, decision-making, and continuous growth."` → `"AI isn't an add-on. It's how we build. We embed intelligent automation into everyday operations to improve efficiency, decision-making, and continuous growth."` (same reasoning — two independent clauses, split into sentences).

**Files explicitly excluded (comment-only em dashes, verified, no user-visible impact):** `content/arms.ts`, `content/careers.ts`, `content/company.ts`, `content/eduos.ts`, `content/products.ts` (its own 2 comment-only occurrences — note: this file DOES change for Issues 1 & 2, but not for its em-dash comments), `content/sections.ts`, `components/about/**`, `components/CareerApplicationForm.tsx`, `components/ContactForm.tsx`, `components/home/CaseStudiesSection.tsx` (comment only, line 173), `components/home/StatsSection.tsx`, `components/insights/CaseStudiesSection.tsx` (comment only), `components/insights/CaseStudyAccordionBanner.tsx` (its doc-comment header — note: this file DOES change for Issue 3, but not for its em-dash comment), `components/insights/CaseStudyCardStack.tsx`, `components/insights/CaseStudyCTA.tsx`, `components/insights/CaseStudyHorizontalCarousel.tsx` (comment only), `components/insights/CaseStudyVisual.tsx`, `components/layout/Header.tsx` (comment only), `components/sections/**` (all comment-only), `components/ui/**` (all comment-only), `lib/**` (all comment-only, this is backend infrastructure code never sent to the browser), `hooks/**`, `services/**`, `types/**`, `validation/**`.

**Edge cases:**
- **Grammar validation:** Every replacement above was individually reasoned per-sentence (not a blind regex), per the stakeholder's explicit "Never perform a blind search-and-replace. Maintain proper English grammar" instruction. Colon vs. comma vs. period-split was chosen per the specific grammatical role the em dash was playing in that sentence (list introduction → colon; parenthetical aside/trailing clause → comma; two independent clauses → period-split).
- **`app/capabilities/page.tsx`:** flagged as possibly needing zero changes — Task 7 must re-verify before editing to avoid a no-op edit or missed occurrence.
- **Metadata title/description length:** None of the replacements change string length meaningfully (dash → colon/comma/period is a 1-character swap or a 2-character split), so no SEO truncation risk is introduced.

**Error handling:** N/A — string edits only.

**Rollback strategy:** `git revert` — every change is a like-for-like string substitution, independently revertible per file if needed.

**Regression prevention:** `components/home/CaseStudiesSection.test.tsx` line 43 asserts an exact substring of the `recruitment-management-platform` `result` field (not `summary`, and that specific case study's `result`/`summary` strings contain no em dash — confirmed by re-reading `data/caseStudies.ts` lines 143-147) — **this test is unaffected and must pass unmodified**, serving as a regression guard that the `data/caseStudies.ts` edits didn't accidentally corrupt an unrelated field. Task 7 re-runs the full `npm test` suite as its final step specifically to catch any accidental exact-text-match breakage in `student-success-platform`'s `summary` field (which DOES change) if any other test happens to assert against it (grep-verified: no test file asserts against the `student-success-platform` summary text beyond the alt-text-length check in `CaseStudiesSection.test.tsx:47-57`, which only checks `altText.trim().length > 10`, unaffected by a summary-field change since alt text is derived from `study.title`, not `study.summary`).

---

## Step 5 — Regression Safeguards

The following are explicitly **not touched** by any task in this plan, and Task 8 (final verification) re-confirms each:

- **Navigation** — `components/layout/Header.tsx` is read-only reference material in Step 2, never edited.
- **Routing** — no `app/**/page.tsx` file is moved, renamed, or has its route segment changed; only in-place string/JSX edits within existing page files.
- **SEO** — `metadata` objects are edited only for their em-dash content (Issue 6); no `alternates`, `openGraph.type`, `openGraph.url`, structured data (`application/ld+json` blocks), or canonical URLs are touched.
- **Accessibility** — every `aria-*`, `role`, and `tabIndex` attribute in every touched file is preserved verbatim; Issue 3's fix explicitly avoids touching any ARIA attribute in `CaseStudyAccordionBanner.tsx` (only `style`, `className` timing values, `<Image>` `priority`/`loading` props, and the `ACCORDION_CONFIG` object's *content-timing* constants change — the region's `role`, `aria-roledescription`, `aria-label`, `aria-expanded`, `aria-live` region, and `tabIndex` logic are all untouched).
- **Animations outside this feature** — `components/ui/motion.tsx` (`Reveal`, `Stagger`, `StaggerItem`) is read-only reference, never edited; `CaseStudyHorizontalCarousel.tsx` (the OTHER case-study animation, Reference Spec B) is never edited, since Issue 3 is scoped to "the vertical panels" (Accordion Banner) only, confirmed against the stakeholder's description ("before each case-study card expands, the vertical panels briefly flicker").
- **Responsive layouts** — no Tailwind responsive breakpoint class (`sm:`, `md:`, `lg:`) is added, removed, or changed in any file; Issue 2's removal relies on existing `Section` component spacing (already responsive) rather than introducing new spacing rules.
- **Typography** — no `font-*`, `text-*` size/weight class is touched anywhere.
- **Spacing** — no `p-*`, `m-*`, `gap-*` class is touched except the deletion of the entire block in Issue 2 (which removes spacing classes attached to the deleted element itself, not adjacent elements).
- **Theme** — `app/globals.css` (CSS custom properties/design tokens) is never edited (confirmed zero em dashes present in that file already).
- **Hydration** — no Server/Client Component boundary (`"use client"` directive) is added or removed in any file; `CaseStudyAccordionBanner.tsx` already has `"use client"` and stays a Client Component; `Products.tsx` and `content/products.ts` remain Server Component-safe (no client-only API introduced).
- **Image optimization** — only `priority`/`loading` prop values change on 2 of 5 `<Image>` elements in Issue 3's fix (still using `next/image`, no raw `<img>` introduced, no `unoptimized` prop added).
- **Performance** — no new dependency, no new client-side JS bundle beyond the existing `motion` library already in use; Issue 3's `will-change` addition is a CSS hint, not a JS performance cost.
- **Lazy loading** — preserved for all panels except the 2 adjacent-to-active ones in Issue 3, which is the intended, minimal-scope fix (not a blanket "make everything eager").
- **Reusable components** — `Section`, `Cta`, `PageHero`, `Eyebrow` (shared UI primitives) are never edited.
- **Shared hooks** — `hooks/useCareerApplication.ts`, `hooks/useContactForm.ts`, `components/sections/products/hooks/useProductSelection.ts`, `components/sections/products/hooks/useFocusTrap.ts` are never edited.
- **Global state** — no global state mechanism exists in this codebase (confirmed: all state is local `useState`/`useCallback` per component, no Context/Redux/Zustand), so this constraint is trivially satisfied by construction.

---

## Task Breakdown

### Task 1: Issue 1 — ArenaOS content update

**Files:**
- Modify: `content/products.ts:93-96`
- Test: `content/products.test.ts` (new)

**Interfaces:**
- Consumes: none (leaf content file)
- Produces: `products` array's `arenaos` entry — consumed by `components/sections/ProductDetail.tsx` and `components/sections/products/ProductContent.tsx` via `getProduct("arenaos")` / `product.target` / `product.moat` / `product.revenueValue`

- [ ] **Step 1: Read the current file to confirm line numbers are still accurate**

Run: Read `content/products.ts` lines 90-100 and confirm the exact current text of `target`, `moat`, `revenueValue` on the `arenaos` object matches:
```ts
target: "Gaming cafes with 10+ stations. India.",
moat: "India's only full gaming cafe OS.",
revenueLabel: "Pipeline",
revenueValue: "Productised SaaS for chains across India",
```

- [ ] **Step 2: Write the failing test**

Create `content/products.test.ts`:

```ts
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- content/products.test.ts`
Expected: FAIL — `target`/`moat`/`revenueValue` assertions fail because the source strings are still the old copy.

- [ ] **Step 4: Apply the content edit**

Edit `content/products.ts`, changing exactly these 3 lines within the `arenaos` object (do not touch `revenueLabel` or any other field):

```ts
    target: "Gaming cafes with 10+ stations",
    moat: "India's first and only full gaming cafe OS",
    revenueLabel: "Pipeline",
    revenueValue: "Productised SaaS for chains across the globe",
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- content/products.test.ts`
Expected: PASS — both tests green.

- [ ] **Step 6: Commit**

```bash
git add content/products.ts content/products.test.ts
git commit -m "fix: update ArenaOS target, moat, and revenue copy per stakeholder feedback"
```

---

### Task 2: Issue 2 — Remove Products page "coming soon" section

**Files:**
- Modify: `components/sections/Products.tsx`
- Modify: `content/products.ts` (remove `futureProducts` export)
- Test: `components/sections/Products.test.tsx` (new)

**Interfaces:**
- Consumes: `products` from `content/products.ts` (unchanged shape)
- Produces: `Products` component with no `futureProducts` dependency — consumed unchanged by `app/page.tsx` and `app/products/page.tsx` (both already pass no `futureProducts`-related props, since it's an internal import, not a prop)

- [ ] **Step 1: Read the current file**

Read `components/sections/Products.tsx` in full (already done in discovery — 52 lines) to confirm current structure before editing.

- [ ] **Step 2: Write the failing test**

Create `components/sections/Products.test.tsx`:

```tsx
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

  it("still renders the products heading and grid", () => {
    render(<Products heading="Vertical operating systems, shipping today." />);
    expect(screen.getByText("Vertical operating systems, shipping today.")).toBeInTheDocument();
    expect(screen.getByText("Our Products")).toBeInTheDocument();
  });

  it("renders with the default heading when no heading prop is passed", () => {
    render(<Products />);
    expect(screen.getByText("Vertical operating systems.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- components/sections/Products.test.tsx`
Expected: FAIL on the first test ("does not render the future-products coming-soon strip") — `queryByText("More operating systems, coming soon.")` currently finds a match, so `not.toBeInTheDocument()` fails.

- [ ] **Step 4: Remove the future-products JSX block from `Products.tsx`**

Edit `components/sections/Products.tsx`. Change the import line:

```ts
import { products, futureProducts } from "@/content/products";
```
to:
```ts
import { products } from "@/content/products";
```

Then delete this entire block (currently lines 34-49):

```tsx
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
```

The file's closing structure after this edit must read:

```tsx
import { Section } from "@/components/ui/Section";
import { products } from "@/content/products";
import dynamic from "next/dynamic";

const ProductsSection = dynamic(
  () =>
    import("@/components/sections/products/ProductsSection").then(
      (mod) => mod.ProductsSection
    ),
  { ssr: true }
);

/* Products — an interactive grid: click a card to open its full detail
   in place (ProductsSection), no navigation. */
export function Products({
  heading = "Vertical operating systems.",
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
    </Section>
  );
}
```

(Note: the stale second sentence of the original file comment referencing "Future products close the section as a quiet strip, unchanged from before" is also removed since it no longer describes the component's behavior — this is a direct, in-scope correction of the same comment block being edited, not a drive-by cleanup elsewhere.)

- [ ] **Step 5: Remove the `futureProducts` export from `content/products.ts`**

Edit `content/products.ts`, deleting this block (currently lines 113-118):

```ts

// "Coming soon" future products grid — portfolio ambition.
export const futureProducts = {
  eyebrow: "The Portfolio",
  heading: "More operating systems, coming soon.",
  list: ["Healthcare", "Manufacturing", "Retail", "Construction", "Hospitality"],
};
```

Confirm the file still exports `products` (array) and `getProduct` (function) — both unaffected, unmodified.

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- components/sections/Products.test.tsx`
Expected: PASS — all 3 tests green.

- [ ] **Step 7: Run the full test suite to confirm no other test imports `futureProducts`**

Run: `npm test`
Expected: All tests pass; specifically confirm no test file fails with "futureProducts is not exported" or similar TypeScript/import error.

- [ ] **Step 8: Commit**

```bash
git add components/sections/Products.tsx content/products.ts components/sections/Products.test.tsx
git commit -m "fix: remove coming-soon future products section from Products page and homepage"
```

---

### Task 3: Issue 3 — Fix Insights accordion pre-expand flicker

**Files:**
- Modify: `components/insights/CaseStudyAccordionBanner.tsx`

**Interfaces:**
- Consumes: `CaseStudy[]`, `activeIndex: number`, `onSelectIndex: (index: number) => void` (unchanged props, from `CaseStudiesInteractiveShowcase.tsx`)
- Produces: same rendered output shape (no prop/export signature change) — parent component requires zero changes

- [ ] **Step 1: Read the full current file**

Already read in full during discovery (261 lines). Re-read immediately before editing to confirm no other agent/process has changed it:

Read `components/insights/CaseStudyAccordionBanner.tsx` in full.

- [ ] **Step 2: Update `ACCORDION_CONFIG` to add a content-crossfade duration constant that matches the width transition**

Edit the config object near the top of the file:

```ts
const ACCORDION_CONFIG = {
  autoplayIntervalMs: 4300,
  transitionDuration: 0.55,
  transitionEase: [0.4, 0, 0.2, 1] as const,
};
```

Change to:

```ts
const ACCORDION_CONFIG = {
  autoplayIntervalMs: 4300,
  transitionDuration: 0.55,
  transitionEase: [0.4, 0, 0.2, 1] as const,
  // Content crossfade must start the instant the width transition starts
  // (delay-0) and finish no later than the width transition, so there is
  // never a frame where neither the collapsed nor expanded content is
  // visible. Matches transitionDuration in milliseconds.
  contentTransitionMs: 500,
};
```

- [ ] **Step 3: Synchronize the collapsed-panel content fade-out timing**

Find this block (currently lines 176-185):

```tsx
              {/* Collapsed Panel Content (Rotated 90° Bottom-to-Top) */}
              <div
                style={contentTransitionStyle}
                className={cn(
                  "absolute inset-0 z-10 flex flex-col items-center justify-between py-5 sm:py-7 bg-ink/75 transition-opacity group-hover:bg-ink/65",
                  isActive
                    ? "pointer-events-none opacity-0 duration-200 delay-0"
                    : "opacity-100 duration-300 delay-300"
                )}
              >
```

Replace the className logic so the collapsed content fades out immediately and quickly when a panel becomes active (unchanged — `duration-200 delay-0` was already correct for this direction), and fades back in only after the panel has mostly finished shrinking (so it doesn't pop in mid-shrink):

```tsx
              {/* Collapsed Panel Content (Rotated 90° Bottom-to-Top) */}
              <div
                style={contentTransitionStyle}
                className={cn(
                  "absolute inset-0 z-10 flex flex-col items-center justify-between py-5 sm:py-7 bg-ink/75 transition-opacity group-hover:bg-ink/65",
                  isActive
                    ? "pointer-events-none opacity-0 duration-200 delay-0"
                    : "opacity-100 duration-300 delay-300"
                )}
              >
```

(No change needed here — this direction was already correctly timed. Confirmed by re-reading: the bug is exclusively in the *expanding* panel's content timing, addressed in Step 4 below. This step is a no-op verification, not an edit — do not modify this block.)

- [ ] **Step 4: Synchronize the expanded-panel content fade-in timing to start immediately**

Find this block (currently lines 208-217):

```tsx
              {/* Expanded Panel Content Area */}
              <div
                style={contentTransitionStyle}
                className={cn(
                  "absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 lg:p-10 transition-opacity",
                  isActive
                    ? "opacity-100 duration-300 delay-300"
                    : "pointer-events-none opacity-0 duration-200 delay-0"
                )}
              >
```

Replace with (start the fade-in at the same instant the width starts growing, `delay-0`, and give it a duration matching the width transition so content and width finish growing together):

```tsx
              {/* Expanded Panel Content Area — fade-in starts the instant the
                  width transition starts (delay-0) and completes alongside it,
                  eliminating the dead window where neither collapsed nor
                  expanded content was visible mid-transition. */}
              <div
                style={contentTransitionStyle}
                className={cn(
                  "absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 lg:p-10 transition-opacity duration-500",
                  isActive
                    ? "opacity-100 delay-0"
                    : "pointer-events-none opacity-0 duration-200 delay-0"
                )}
              >
```

- [ ] **Step 5: Add `priority`/`loading="eager"` to the active panel and its two neighbors**

Find the `<Image>` block (currently lines 159-166):

```tsx
                {study.image ? (
                  <Image
                    src={study.image}
                    alt={`${study.title} visual`}
                    fill
                    sizes="(min-width: 1024px) 75vw, 100vw"
                    className="object-cover"
                  />
                ) : (
```

Above the `panels.map` callback's existing `const isActive = index === activeIndex;` line, add two neighbor-index calculations. Find:

```tsx
        {panels.map((study, index) => {
          const isActive = index === activeIndex;
          const contentTransitionStyle = Boolean(shouldReduceMotion)
            ? { transitionDuration: "0ms", transitionDelay: "0ms" }
            : undefined;
```

Replace with:

```tsx
        {panels.map((study, index) => {
          const isActive = index === activeIndex;
          const isAdjacent =
            index === (activeIndex + 1) % total ||
            index === (activeIndex - 1 + total) % total;
          const contentTransitionStyle = Boolean(shouldReduceMotion)
            ? { transitionDuration: "0ms", transitionDelay: "0ms" }
            : undefined;
```

Then update the `<Image>` block to:

```tsx
                {study.image ? (
                  <Image
                    src={study.image}
                    alt={`${study.title} visual`}
                    fill
                    sizes="(min-width: 1024px) 75vw, 100vw"
                    className="object-cover"
                    priority={isActive}
                    loading={isActive || isAdjacent ? "eager" : "lazy"}
                  />
                ) : (
```

(Next.js requires `loading` to be omitted or `undefined` when `priority` is `true` — passing both `priority={true}` and `loading="eager"` simultaneously is redundant but not invalid since `priority` already implies eager; to avoid a Next.js dev-time warning about `priority` and `loading="lazy"` conflicting, structure as: `loading` is only meaningful when `priority` is `false`, which is exactly what the ternary above produces — when `isActive` is `true`, `priority` is `true` and `loading` evaluates to `"eager"`, which is Next.js's own default for `priority` images and does not trigger the "priority and loading=lazy" warning since we never pass `"lazy"` alongside `priority={true}`.)

- [ ] **Step 6: Add `will-change` hint to the animating panel to reduce reflow/repaint jank**

Find the `m.div` className block (currently lines 145-150):

```tsx
              className={cn(
                "group relative h-full overflow-hidden rounded-2xl sm:rounded-3xl border transition-colors select-none",
                isActive
                  ? "w-full sm:w-auto flex-[10_1_0%] border-line-strong bg-mist shadow-card"
                  : "w-[60px] sm:w-[72px] md:w-[84px] lg:w-[96px] shrink-0 flex-[0_0_auto] cursor-pointer border-line bg-ink hover:border-forest/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              )}
```

This stays unchanged (do not touch). Instead, add a `style` prop to the same `m.div` (find the `animate={{ flexGrow: isActive ? 10 : 0 }}` block currently at lines 136-138 and the `transition={{...}}` block at 139-144), adding a sibling `style` prop immediately after `transition`:

```tsx
              animate={{
                flexGrow: isActive ? 10 : 0,
              }}
              transition={{
                duration: Boolean(shouldReduceMotion)
                  ? 0
                  : ACCORDION_CONFIG.transitionDuration,
                ease: ACCORDION_CONFIG.transitionEase,
              }}
              style={{ willChange: "flex-grow" }}
```

- [ ] **Step 7: Verify the full file compiles and no other logic was disturbed**

Read the complete updated `components/insights/CaseStudyAccordionBanner.tsx` file back and confirm:
- `role`, `aria-roledescription`, `aria-label`, `aria-expanded`, `tabIndex`, `aria-live` are all identical to the pre-edit version.
- `handleNext`, `handlePrev`, `handleKeyDown`, the autoplay `useEffect`, and `onMouseEnter`/`onMouseLeave`/`onFocus`/`onBlur` handlers are all untouched.
- Only the 4 changes above (config constant, expanded-content transition classes, `isAdjacent` calculation + `<Image>` props, and `style={{ willChange }}`) are present as diffs.

- [ ] **Step 8: Run lint and type-check**

Run: `npm run lint`
Expected: zero errors, zero warnings.

Run: `npx tsc --noEmit`
Expected: zero TypeScript errors (this project doesn't expose a separate `type-check` script in `package.json`; `npx tsc --noEmit` using the existing `tsconfig.json` is the equivalent check the plan's "npm run type-check" requirement maps to — this must be flagged and confirmed working before Task 8's final build verification).

- [ ] **Step 9: Manual visual smoke test (dev server)**

Run: `npm run dev` (do not block on this — start in background, then check).

Open `http://localhost:3000/insights` in a browser, scroll to the Case Studies accordion, and visually confirm: (a) autoplay transitions between panels with no visible blank/flash frame, (b) manually clicking a collapsed panel expands it smoothly with content appearing in sync with the width growth, (c) no console errors/warnings appear in DevTools during the transition. This qualitative check is a precursor to the full QA Test Case TC-03 in Step 6 below (which requires the Performance panel), not a replacement for it.

- [ ] **Step 10: Commit**

```bash
git add components/insights/CaseStudyAccordionBanner.tsx
git commit -m "fix: eliminate pre-expand flicker in case-study accordion banner

Root cause: the expanding panel's content fade-in was delayed 300ms after
the width transition started, and the collapsing panel's content had
already faded out by 200ms, leaving a ~100-300ms window with no visible
content overlay mid-transition. Adjacent panel images also lacked
priority/eager loading, causing image-decode pop-in independent of the
width/opacity choreography. Synchronized the expanded content's fade-in to
start at delay-0 alongside the width transition, added priority/eager
loading for the active and two adjacent panels, and added a will-change
hint on the animating flex-grow property to reduce full-row reflow jank."
```

---

### Task 4: Issue 4 — Replace duplicate Student Career Guidance Platform image

**Files:**
- Create/Overwrite: `public/case-studies/student-career-guidance-platform.png` (binary, sourced from `assets/Student Career Guidance Platform.png`)
- No source-code file changes (filename is preserved, so `data/caseStudies.ts` line 67 requires no edit)

**Interfaces:**
- Consumes: nothing (binary asset task)
- Produces: `public/case-studies/student-career-guidance-platform.png` servable at `/case-studies/student-career-guidance-platform.png`, already referenced by `data/caseStudies.ts:67`

- [ ] **Step 1: Confirm the source asset exists and inspect its dimensions**

Run:
```bash
node -e "
const fs = require('fs');
const buf = fs.readFileSync('assets/Student Career Guidance Platform.png');
console.log('width:', buf.readUInt32BE(16), 'height:', buf.readUInt32BE(20));
console.log('bytes:', buf.length);
"
```
Expected output: `width: 1477 height: 1065` and `bytes: 1863649` (matching the earlier discovery-phase read).

- [ ] **Step 2: Record the pre-replacement MD5 hash of the file being replaced (for rollback traceability)**

Run:
```bash
certutil -hashfile "public/case-studies/student-career-guidance-platform.png" MD5
```
Expected: `c2815fe589ed8990ca7517d851cea35d` (matches the discovery-phase value). Record this in the commit message.

- [ ] **Step 3: Copy the new asset over the old one, preserving the filename**

Run (PowerShell, since the source path contains spaces):
```powershell
Copy-Item -Path "assets\Student Career Guidance Platform.png" -Destination "public\case-studies\student-career-guidance-platform.png" -Force
```

- [ ] **Step 4: Verify the file was replaced and confirm the new hash differs from the old one**

Run:
```bash
certutil -hashfile "public/case-studies/student-career-guidance-platform.png" MD5
```
Expected: a hash different from `c2815fe589ed8990ca7517d851cea35d` (confirms the overwrite succeeded).

- [ ] **Step 5: Re-run the full 9-file MD5 uniqueness sweep to confirm no new duplicate was introduced**

Run:
```bash
for f in public/case-studies/*.png; do
  hash=$(certutil -hashfile "$f" MD5 2>/dev/null | sed -n '2p')
  echo "$hash  $f"
done
```
Expected: 9 lines, all 9 hash values distinct from each other (no two identical hashes).

- [ ] **Step 6: Visually confirm the new image renders correctly via the dev server**

Run: `npm run dev` (background), open `http://localhost:3000/insights`, navigate the accordion to the "Student Career Guidance Platform" panel (index 03/05) and confirm it now shows the new two-students-at-a-library-laptop photo, visually distinct from the "AI-Powered Student Success Platform" panel (index 01/05). If the dev server was already running before Step 3, restart it (`Ctrl+C` then `npm run dev` again) to bypass any stale static-file cache.

- [ ] **Step 7: Commit**

```bash
git add public/case-studies/student-career-guidance-platform.png
git commit -m "fix: replace duplicate Student Career Guidance Platform case-study image

Previous asset (MD5 c2815fe589ed8990ca7517d851cea35d) was a near-duplicate
photograph of the AI-Powered Student Success Platform case study image
(same subjects, same cafe, same tablet mockup, different burst frame).
Replaced with the stakeholder-supplied unique photograph from
assets/Student Career Guidance Platform.png. Filename unchanged, so no
data/caseStudies.ts reference update is required."
```

---

### Task 5: Issue 5 — Document University Management System verification (no code change)

**Files:** None modified. This task records verification evidence only, per the plan's "provide verification" requirement.

- [ ] **Step 1: Re-run the MD5 uniqueness sweep as final-state proof** (this is the same command as Task 4 Step 5, confirming the post-Task-4 state)

Run:
```bash
for f in public/case-studies/*.png; do
  hash=$(certutil -hashfile "$f" MD5 2>/dev/null | sed -n '2p')
  echo "$hash  $f"
done
```
Expected: `university-platform.png`'s hash (`4b48e3a98c5f092a0d895aa1cda9c194`) appears exactly once across all 9 lines, and every other hash in the list is different from it.

- [ ] **Step 2: No commit needed** — this task produces verification evidence for the QA sign-off table in Step 6/Final Sign-Off, not a code change.

---

### Task 6: Issue 6 — Remove em dashes from user-visible content

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/careers/apply/page.tsx`
- Modify: `app/insights/page.tsx`
- Modify: `app/products/page.tsx`
- Modify: `app/products/arenaos/page.tsx`
- Modify: `data/caseStudies.ts`
- Modify: `data/why-us.ts`
- Verify (no change expected): `app/capabilities/page.tsx`, `app/products/eduos/page.tsx`, `app/careers/page.tsx`, `app/not-found.tsx`

**Interfaces:**
- Consumes: nothing new
- Produces: identical export shapes for every file (string values change, no field added/removed/renamed)

- [ ] **Step 1: Write a repo-wide em-dash sweep test to lock in the final state**

Create `scripts/no-em-dash.test.ts` is NOT appropriate (this project has no `scripts/` test convention and adding new test infrastructure beyond content assertions is out of scope). Instead, add a targeted Vitest test co-located with the data file most at risk of regression, `data/caseStudies.ts`:

Create `data/caseStudies.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { caseStudies } from "@/data/caseStudies";

describe("caseStudies content", () => {
  it("contains no em dash characters in any summary", () => {
    for (const study of caseStudies) {
      expect(study.summary).not.toMatch(/—/);
    }
  });

  it("contains no em dash characters in any title, result, or highlight", () => {
    for (const study of caseStudies) {
      expect(study.title).not.toMatch(/—/);
      if (study.result) expect(study.result).not.toMatch(/—/);
      for (const highlight of study.highlights) {
        expect(highlight).not.toMatch(/—/);
      }
    }
  });

  it("preserves the exact updated University Management System summary text", () => {
    const uni = caseStudies.find((s) => s.id === "university-management-system");
    expect(uni?.summary).toBe(
      "A comprehensive digital ERP platform modernizing university administration: admissions, academics, finance, examinations, HR, and campus operations, in one unified ecosystem."
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- data/caseStudies.test.ts`
Expected: FAIL — the em-dash-absence assertions fail against the current `summary` strings (4 of 9 studies still contain `—`).

- [ ] **Step 3: Edit `data/caseStudies.ts` summary strings**

Edit line 17:
```ts
    summary:
      "An end-to-end education intelligence platform spanning the full student journey — from understanding learning patterns to predicting academic performance and guiding career decisions.",
```
to:
```ts
    summary:
      "An end-to-end education intelligence platform spanning the full student journey, from understanding learning patterns to predicting academic performance and guiding career decisions.",
```

Edit line 39:
```ts
    summary:
      "A comprehensive digital ERP platform modernizing university administration — admissions, academics, finance, examinations, HR, and campus operations — in one unified ecosystem.",
```
to:
```ts
    summary:
      "A comprehensive digital ERP platform modernizing university administration: admissions, academics, finance, examinations, HR, and campus operations, in one unified ecosystem.",
```

Edit line 121:
```ts
    summary:
      "A community-driven food ordering platform connecting home chefs with customers seeking healthy, affordable home-cooked meals — built on a trusted local marketplace.",
```
to:
```ts
    summary:
      "A community-driven food ordering platform connecting home chefs with customers seeking healthy, affordable home-cooked meals, built on a trusted local marketplace.",
```

Edit line 167:
```ts
    summary:
      "A premium digital presence for a creative production studio, built around storytelling and visual excellence — doubling as a portfolio and lead-generation platform.",
```
to:
```ts
    summary:
      "A premium digital presence for a creative production studio, built around storytelling and visual excellence, doubling as a portfolio and lead-generation platform.",
```

(Comment-only em dashes on lines 1 and 201 of this file are explicitly left unchanged per the Step 4/Issue 6 scope decision.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- data/caseStudies.test.ts`
Expected: PASS — all 3 tests green.

- [ ] **Step 5: Edit `data/why-us.ts`**

Read `data/why-us.ts` in full first to confirm current line numbers (already read during discovery). Edit line 14:
```ts
    description: "We don't just launch projects—we stay to optimize, scale, and grow with your business. Our relationship begins where most engagements end.",
```
to:
```ts
    description: "We don't just launch projects. We stay to optimize, scale, and grow with your business. Our relationship begins where most engagements end.",
```

Edit line 32:
```ts
    description: "AI isn't an add-on—it's how we build. We embed intelligent automation into everyday operations to improve efficiency, decision-making, and continuous growth.",
```
to:
```ts
    description: "AI isn't an add-on. It's how we build. We embed intelligent automation into everyday operations to improve efficiency, decision-making, and continuous growth.",
```

- [ ] **Step 6: Edit `app/layout.tsx`**

Edit the `metadata` object (lines 21-37), changing all 4 occurrences:

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://wnrtech.com"),
  title: {
    default: "WnRTech: Operational Intelligence for Modern Business",
    template: "%s | WnRTech",
  },
  description:
    "We build the operational brain of your business: custom platforms, AI-native workflows, and vertical SaaS products. We build, implement, train, and stay.",
  openGraph: {
    title: "WnRTech: Operational Intelligence for Modern Business",
    description:
      "We build the operational brain of your business: custom platforms, AI-native workflows, and vertical SaaS products. We build, implement, train, and stay.",
    siteName: "WnRTech",
    locale: "en_IN",
    type: "website",
  },
};
```

- [ ] **Step 7: Edit `app/about/page.tsx`**

Edit line 15:
```ts
  title: "About Us — Operational Intelligence & Enterprise Systems",
```
to:
```ts
  title: "About Us: Operational Intelligence & Enterprise Systems",
```

- [ ] **Step 8: Edit `app/contact/page.tsx`**

Edit lines 16-18:
```ts
export const metadata: Metadata = {
  title: "Contact — Let's Talk About Your Operations",
  description:
    "Tell us about your business. We'll tell you how we can help. WnRTech — Operational intelligence for modern business.",
  alternates: { canonical: "/contact" },
};
```
to:
```ts
export const metadata: Metadata = {
  title: "Contact: Let's Talk About Your Operations",
  description:
    "Tell us about your business. We'll tell you how we can help. WnRTech: Operational intelligence for modern business.",
  alternates: { canonical: "/contact" },
};
```

- [ ] **Step 9: Edit `app/careers/apply/page.tsx`**

Edit lines 8-22:
```ts
export const metadata: Metadata = {
  title: "Apply: Careers",
  description:
    "Submit your application to WnRTech. We review every application and respond within 5 business days if there's a match.",
  alternates: { canonical: "/careers/apply" },
  openGraph: {
    title: "Apply: Careers | WnRTech",
    description: "Submit your application to WnRTech.",
    url: "/careers/apply",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply: Careers | WnRTech",
    description: "Submit your application to WnRTech.",
  },
};
```

- [ ] **Step 10: Edit `app/insights/page.tsx`**

Edit lines 7-11:
```ts
export const metadata: Metadata = {
  title: "Insights: Case Studies & Perspective",
  description:
    "Custom platforms and measurable outcomes across education, retail, and logistics, plus notes on building AI-native operational systems.",
};
```

- [ ] **Step 11: Edit `app/products/page.tsx`**

Edit lines 7-11:
```ts
export const metadata: Metadata = {
  title: "Products: Vertical Operating Systems",
  description:
    "EduOS and ArenaOS: purpose-built operating systems for schools and gaming cafes, productised from real operational experience.",
};
```

- [ ] **Step 12: Edit `app/products/arenaos/page.tsx`**

Edit line 9:
```ts
  title: "ArenaOS — The Full Business OS for Gaming Cafes",
```
to:
```ts
  title: "ArenaOS: The Full Business OS for Gaming Cafes",
```

- [ ] **Step 13: Verify `app/capabilities/page.tsx` requires no change**

Run: `Grep -n "—" app/capabilities/page.tsx`
Expected: zero matches (confirmed during discovery). If a match is found, this indicates the file changed since discovery — re-read the file, identify the new occurrence, and apply the same contextual-replacement methodology as Steps 6-12 above before proceeding.

- [ ] **Step 14: Verify `app/products/eduos/page.tsx`, `app/careers/page.tsx`, `app/not-found.tsx` require no change**

Run: `Grep -n "—" app/products/eduos/page.tsx app/careers/page.tsx app/not-found.tsx`
Expected: zero matches (confirmed during discovery).

- [ ] **Step 15: Re-run the full repo-wide em-dash grep to confirm zero remaining occurrences in user-visible files**

Run:
```bash
grep -rn "—" app/layout.tsx app/about/page.tsx app/contact/page.tsx app/careers/apply/page.tsx app/insights/page.tsx app/products/page.tsx app/products/arenaos/page.tsx data/caseStudies.ts data/why-us.ts
```
Expected: zero matches (grep exits with no output / exit code 1, meaning no lines matched).

- [ ] **Step 16: Run the full test suite**

Run: `npm test`
Expected: all tests pass, including the new `data/caseStudies.test.ts` and the pre-existing `components/home/CaseStudiesSection.test.tsx` (which must pass unmodified, per Risk R3/Step 4-Issue-6's regression-prevention note).

- [ ] **Step 17: Commit**

```bash
git add app/layout.tsx app/about/page.tsx app/contact/page.tsx app/careers/apply/page.tsx app/insights/page.tsx app/products/page.tsx app/products/arenaos/page.tsx data/caseStudies.ts data/why-us.ts data/caseStudies.test.ts
git commit -m "fix: remove em dashes from all user-visible copy sitewide

Replaced every em dash (—) in rendered/crawlable content (page metadata
titles and descriptions, case-study summaries, why-us card descriptions)
with grammatically contextual alternatives: colons where the dash
introduced a list or subtitle, commas where it introduced a trailing or
parenthetical clause, and sentence splits where it joined two independent
clauses. Source-code comments (never rendered to the site) are
intentionally left unchanged, since they carry no user-facing risk and
editing them would be unforced churn across ~40 unrelated files."
```

---

### Task 7: Full-suite build verification and cross-issue regression pass

**Files:** None modified — verification only.

**Interfaces:** N/A

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: zero errors, zero warnings. If any warning appears referencing an unused import (e.g., a leftover `futureProducts` reference), fix it in the relevant file from Task 2 before proceeding.

- [ ] **Step 2: Run type-check**

Run: `npx tsc --noEmit`
Expected: zero TypeScript errors.

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: 100% pass, including every pre-existing test file (`components/home/CaseStudiesSection.test.tsx`, `components/home/StatsSection.test.tsx`, `components/home/ThreeArmSection.test.tsx`, `components/sections/products/*.test.tsx`, `components/about/eduos/EduOsModal.test.tsx`, `app/api/**/*.test.ts`, etc.) plus every new test added in Tasks 1, 2, and 6.

- [ ] **Step 4: Run the production build**

Run: `npm run build`
Expected: build completes with exit code 0, zero TypeScript errors, zero build-time warnings about missing images, unused exports, or invalid metadata.

- [ ] **Step 5: Start the production server and smoke-test all 4 changed routes**

Run: `npm run start` (background).

Using a browser or `curl`, verify HTTP 200 on:
- `http://localhost:3000/` (homepage — Issue 2's Products section, Issue 6's default metadata)
- `http://localhost:3000/products` (Issue 2's coming-soon removal)
- `http://localhost:3000/products/arenaos` (Issue 1's copy update, Issue 6's title)
- `http://localhost:3000/insights` (Issue 3's flicker fix, Issue 4's replaced image, Issue 6's summaries)
- `http://localhost:3000/about`, `/contact`, `/careers/apply` (Issue 6's remaining metadata titles)

- [ ] **Step 6: Final repo-wide em-dash re-sweep (defense in depth)**

Run:
```bash
grep -rn "—" app/ content/ data/ components/ --include="*.ts" --include="*.tsx" | grep -v "^\S*:\s*[0-9]*:\s*\(//\|\s*\*\|\s*/\*\)" 
```

This command attempts to filter out comment-prefixed lines heuristically; **manually review every remaining line in the output** and confirm each is either (a) a comment (acceptable, out of scope) or (b) already addressed by Task 6. Any unaddressed user-visible occurrence found here must be fixed before sign-off, following the same contextual-replacement methodology as Task 6.

- [ ] **Step 7: No commit** — this is a verification-only task. If Step 6 finds an unaddressed occurrence, fix it, add it to Task 6's commit scope retroactively via a new small commit, and re-run Steps 1-6.

---

## Step 6 — Testing Strategy (Senior QA Verification Plan)

### TC-01: ArenaOS content update

**Objective:** Confirm the 3 ArenaOS stat-card strings match the stakeholder's exact requested copy, and no other field changed.

**Execution Steps:**
1. Navigate to `/products/arenaos` in Chrome desktop viewport (1440×900).
2. Locate the three stat cards labeled TARGET, MOAT, PIPELINE.
3. Read the exact text of each card.
4. Compare against the ArenaOS grid card on `/products` (hover/click to open detail).
5. Repeat on Edge, Safari, Firefox.
6. Repeat on mobile viewport (375×812) and tablet viewport (768×1024).

**Expected Result:** TARGET reads exactly "Gaming cafes with 10+ stations" (no trailing period, no ". India."). MOAT reads exactly "India's first and only full gaming cafe OS." PIPELINE reads exactly "Productised SaaS for chains across the globe."

**Evidence Required:** Screenshot of the stats section on desktop, mobile, and tablet; browser DevTools "Copy element" text extraction of all 3 values.

**Pass Criteria:** All 3 strings match exactly (case-sensitive, punctuation-sensitive) across all viewports/browsers; no other visible text on the ArenaOS page or `/products` grid card changed.

**Failure Criteria:** Any string mismatch, any unintended change to tagline/heroBody/features/industries/technology text.

**Regression Checks:** EduOS page (`/products/eduos`) content is byte-identical to before this change (not touched by Task 1).

---

### TC-02: Products page coming-soon removal

**Objective:** Confirm the "More operating systems, coming soon." section is fully gone with no layout artifacts, on both `/` and `/products`.

**Execution Steps:**
1. Navigate to `/products`, scroll through the entire Products section.
2. Navigate to `/` (homepage), scroll to the Products section.
3. Inspect the DOM (DevTools Elements panel) directly below the EduOS/ArenaOS grid — confirm no `<div>` with text "coming soon" or industry pills (Healthcare, Manufacturing, Retail, Construction, Hospitality) exists anywhere in the page.
4. Measure the vertical gap between the bottom of the product grid and the next section (dark CTA band on `/products`; Case Studies section on `/`) using DevTools box-model inspector — compare against the equivalent gap on 2 other sections of the site that end a `Section` component normally (e.g., bottom of Capabilities page's last section) to confirm the spacing pattern is consistent, not a leftover gap or double-gap.
5. Repeat steps 1-4 at breakpoints: 375px (mobile), 768px (tablet), 1024px (laptop), 1440px (desktop), 1920px (large desktop).

**Expected Result:** Zero DOM trace of the removed section at any breakpoint; the products grid is immediately followed by the section's natural bottom padding, visually consistent with other single-block sections sitewide.

**Evidence Required:** Before/after screenshots at all 5 breakpoints for both `/` and `/products`; DevTools computed-style screenshot of the spacing.

**Pass Criteria:** No visual gap larger or smaller than the site's standard section-end spacing; no console errors; `futureProducts` string not present anywhere in page source (View Source / curl check).

**Failure Criteria:** Any visible empty band, any layout shift (compare Cumulative Layout Shift score in Lighthouse before/after), any console error about a missing import.

**Regression Checks:** EduOS/ArenaOS product grid cards themselves are pixel-identical to before (Task 2 did not touch `ProductGrid.tsx`/`ProductCard.tsx`); homepage sections above/below Products (`ThreeArmSection`, `StatsSection`, `CaseStudiesSection`) are unaffected.

---

### TC-03: Insights accordion flicker elimination

**Objective:** Confirm zero flicker, zero flashing, zero layout jump, and zero image blinking during both autoplay and manual panel expansion, using objective browser tooling (not just visual impression).

**Execution Steps:**
1. Open `/insights` in Chrome, open DevTools → Rendering tab → enable "Paint flashing."
2. Watch the accordion autoplay through a full cycle (5 panels × 4.3s ≈ 21.5s) and observe for any green paint-flash regions during transitions that indicate excessive/unexpected repaint.
3. Open DevTools → Performance tab, record a 10-second session capturing 2-3 autoplay transitions, stop recording.
4. In the Performance trace, inspect the "Main" thread track during each transition window: confirm no long tasks (>50ms) block the transition, and check the "Rendering" section for forced synchronous layout ("Layout" purple bars) — compare count/duration before and after the fix (before-fix baseline must be captured on the pre-Task-3 commit for comparison, via `git stash`/checkout if needed).
5. Manually click a collapsed panel (not relying on autoplay) and repeat the Performance recording for a manually-triggered transition.
6. Use React DevTools Profiler: record a transition, confirm `CaseStudyAccordionBanner` does not unmount/remount any child `m.div` (check "why did this render" — should show only prop/state updates, never "mounted").
7. Check Network tab: confirm the images for the two panels adjacent to the currently active panel show `priority`/eager fetch (visible as high-priority in the Network panel's Priority column) rather than being deferred.
8. Test with OS-level "Reduce motion" accessibility setting enabled (macOS: System Settings → Accessibility → Display → Reduce Motion; Windows: Settings → Accessibility → Visual Effects → Animation Effects off) — confirm panels switch instantly with no animation and no flicker.
9. Repeat steps 2-3 on Firefox and Safari (Performance/Paint-flashing tooling differs — use Firefox's Performance panel and Safari's Web Inspector Timelines equivalently).
10. Repeat on a throttled CPU (DevTools Performance → CPU 4x/6x slowdown) to stress-test the fix under lower-end device conditions.

**Expected Result:** No paint-flash artifacts outside the actively-transitioning panel's own bounding box; no forced synchronous layout warnings in the Performance trace attributable to this component beyond what's inherent to animating `flex-grow` (expected, but should not visibly manifest as dropped frames in the FPS meter); FPS meter (DevTools → Rendering → Frame Rendering Stats) stays at or near 60fps throughout the transition, with no sustained drop below ~50fps; React Profiler shows zero remounts; reduced-motion users see an instant, single-frame switch with no animation artifact.

**Evidence Required:** Performance trace export (`.json`) for before/after comparison; screen recording of one full autoplay cycle at 2x playback speed showing no visible flash; React DevTools Profiler flame graph screenshot; FPS meter screenshot during a transition.

**Pass Criteria:** Zero visible flicker/flash/blink across at least 5 consecutive manual observations by the QA engineer at 1x and 0.25x video playback speed; FPS stays ≥50 throughout; zero remounts in React Profiler; reduced-motion instant-switch works correctly.

**Failure Criteria:** Any single observable flash/flicker frame in a 0.25x-speed screen recording review; any FPS drop below 30; any component remount detected.

**Regression Checks:** `CaseStudyHorizontalCarousel.tsx` (the OTHER, untouched animation below the accordion) behaves identically to before — its own autoplay, clone-based infinite loop, and snapback-on-transition-end logic must show zero change in behavior, confirming Task 3's fix was correctly isolated to only the accordion banner.

---

### TC-04: Duplicate image replacement (Student Career Guidance Platform)

**Objective:** Confirm the Student Career Guidance Platform case study now displays a unique image, visually distinct from the AI-Powered Student Success Platform image, in every location it renders.

**Execution Steps:**
1. Navigate to `/insights`, use the accordion's manual navigation (click or arrow keys) to reach panel `01/05` ("AI-Powered Student Success Platform") — screenshot the full panel.
2. Navigate to panel `03/05` ("Student Career Guidance Platform") — screenshot the full panel.
3. Place both screenshots side-by-side; visually confirm they depict different photographs (different subjects, and/or different setting).
4. Scroll to the horizontal carousel below the accordion (Reference Spec B); locate both case-study cards; repeat the visual distinctness check.
5. Open DevTools → Network tab, filter by "Img," reload the page, confirm two separate image requests are made for these two case studies with two different file sizes/response bodies (not a cached duplicate response).
6. Inspect `alt` text on both images (DevTools Elements panel or Accessibility Inspector) — confirm each reads its own case-study title-derived alt text (e.g., "Student Career Guidance Platform interface" / "AI-Powered Student Success Platform visual"), not a generic or swapped label.
7. Confirm the homepage (`/`) Case Studies section — which renders `student-success-platform` (AI-Powered) but NOT `student-career-guidance-platform` — is unaffected (that image is unchanged by this task).

**Expected Result:** Two visually distinct photographs render correctly at every location; no shared/duplicate image response; alt text is accurate per card.

**Evidence Required:** Side-by-side screenshot comparison; Network tab screenshot showing 2 distinct image responses with different byte sizes; `certutil`/`md5sum` hash comparison proof (from Task 4 Step 5) attached as a text artifact.

**Pass Criteria:** Visually and byte-level (hash) distinct images; correct alt text; no broken image icon on any viewport.

**Failure Criteria:** Any broken image (404), any visual similarity suggesting the wrong file was copied, any alt-text mismatch.

**Regression Checks:** All other 7 case-study images (Recruitment, Digital Photo Studio, E-commerce, Pharma, Hyperlocal Food, Travel Agency, University) remain visually and byte-identical to their pre-change state.

---

### TC-05: University Management System image verification

**Objective:** Provide documented proof the University Management System image is not duplicated anywhere on the site.

**Execution Steps:**
1. Execute the MD5 hash sweep across all 9 `public/case-studies/*.png` files (Task 5 Step 1 command).
2. Manually visually compare the University Management System image against all 8 other case-study images side-by-side.
3. Grep the codebase for any other reference to `university-platform.png` beyond `data/caseStudies.ts` line 47, to confirm it's not aliased or duplicated under a second filename anywhere: `grep -rn "university-platform" --include="*.ts" --include="*.tsx" .`

**Expected Result:** Exactly one file (`university-platform.png`), exactly one hash, exactly one code reference, visually unique subject matter (office admissions counter) vs. every other case study (cafes, labs, e-commerce UIs, food delivery, etc.).

**Evidence Required:** MD5 hash table (all 9 files); grep output showing single reference; side-by-side visual comparison grid.

**Pass Criteria:** Confirmed unique by both hash and visual inspection; single code reference.

**Failure Criteria:** Any duplicate hash found; any second code reference found.

**Regression Checks:** N/A — no code change was made for this issue.

---

### TC-06: Em dash removal, sitewide

**Objective:** Confirm zero em dash characters remain in any user-visible or crawlable content, and every replacement reads as grammatically correct English.

**Execution Steps:**
1. Run the repo-wide grep from Task 7 Step 6 and manually classify every remaining hit as comment (accept) or content (must be zero).
2. View-source (Ctrl+U or `curl`) every one of the following rendered routes and Ctrl+F search for the literal `—` character in the raw HTML: `/`, `/about`, `/capabilities`, `/products`, `/products/arenaos`, `/products/eduos`, `/insights`, `/careers`, `/careers/apply`, `/contact`, `/404` (not-found).
3. Inspect each page's `<title>` tag and `<meta name="description">` tag specifically (these are the highest-visibility SEO surfaces) for em dashes.
4. Read every changed sentence aloud (or have a second reviewer read it) to confirm grammatical correctness of the colon/comma/period-split substitution — this is a subjective but necessary manual QA step per the stakeholder's "maintain proper English grammar" requirement, since automated tooling cannot verify grammatical correctness, only character absence.
5. Check Open Graph / Twitter Card preview (using a browser extension or `https://www.opengraph.xyz/` — **do not submit real URLs to third-party tools if the site is not yet publicly deployed; if only testing locally, skip this specific sub-step and note it as Needs Verification pending public deployment**) for the homepage and `/contact` to confirm social-share previews also read correctly.

**Expected Result:** Zero em dash characters in any HTML response body across all 11 routes; every replacement sentence reads as natural, correct English with no run-on or fragment errors introduced.

**Evidence Required:** View-source text search results (screenshot or saved `.html` per route) showing zero `—` matches; grep command output from Step 1; a reviewer sign-off note per replaced sentence confirming grammatical correctness.

**Pass Criteria:** Zero em dash in any of the 11 routes' rendered output; all replacement sentences pass a native-English-speaker grammar review.

**Failure Criteria:** Any single em dash found in rendered HTML; any replacement sentence that reads as broken, awkward, or grammatically incorrect.

**Regression Checks:** `CaseStudiesSection.test.tsx`'s exact-text assertion against the recruitment-platform `result` string (unaffected field) still passes; no case-study `title` or `highlight` text was accidentally altered (only `summary` fields were in scope for Issue 6's `data/caseStudies.ts` changes).

---

### Mandatory Cross-Cutting QA Matrix

For every one of TC-01 through TC-06, execute the applicable subset of the following matrix and record a PASS/FAIL per cell. Not every test case requires every cell (e.g., TC-05 is a verification task with no visual surface, so device/browser rows are N/A for it) — apply judgement per test case's actual surface area, but TC-01 through TC-04 and TC-06 require the full matrix.

| Dimension | Values to test |
|---|---|
| Desktop | 1920×1080, Chrome |
| Laptop | 1440×900, Chrome |
| Tablet | 768×1024 (iPad viewport), Safari (or Safari emulation) |
| Mobile | 375×812 (iPhone viewport), Safari (or Safari emulation) |
| Chrome | latest stable |
| Edge | latest stable |
| Safari | latest stable (macOS or iOS simulator) |
| Firefox | latest stable |
| Responsive behaviour | resize browser continuously from 320px to 1920px, confirm no breakpoint glitch |
| Lighthouse | run Performance + Accessibility + Best Practices + SEO audit on `/`, `/products`, `/insights`; compare scores before/after this branch's changes — no metric may regress by more than 1 point |
| Accessibility | axe DevTools scan on `/products` (Task 2) and `/insights` (Task 3) — zero new violations vs. baseline |
| Keyboard navigation | Tab through the accordion banner (Issue 3) and confirm arrow-key navigation (`handleKeyDown`) still works identically; Tab through `/products` grid post-removal (Issue 2) confirms no orphaned focus trap where the removed section used to be |
| Console errors | DevTools Console tab, zero red errors on any of the 11 routes |
| Console warnings | DevTools Console tab, zero new warnings vs. pre-change baseline (React key warnings, Next.js Image warnings, hydration mismatch warnings specifically called out) |
| Network failures | DevTools Network tab, zero failed (4xx/5xx) requests on any route |
| Missing assets | confirm all `<img>`/`<Image>` elements resolve (no broken-image icon) across all 9 case-study images + 2 product art images |
| Image loading | confirm `loading="lazy"` vs `priority`/`eager` behave as coded (Network tab priority column) |
| Lazy loading | scroll-triggered images below the fold still defer correctly outside the 2 adjacent-to-active accordion panels |
| CLS | Lighthouse Cumulative Layout Shift score for `/products` (Issue 2 removal) must not increase |
| FPS | DevTools Rendering → Frame Rendering Stats during accordion transitions (Issue 3), target ≥50fps sustained |
| Paint flashing | DevTools Rendering → Paint flashing enabled during accordion transitions (Issue 3), no unexpected full-row flashes |
| React Profiler | confirm zero unexpected remounts in `CaseStudyAccordionBanner` (Issue 3) and `ProductGrid`/`ProductsSection` (Issue 2) |
| Animation smoothness | subjective 0.25x-speed screen-recording review of Issue 3's fix, cross-browser |
| Duplicate assets | MD5 sweep (Task 4/5) re-run as final proof |
| Content correctness | line-by-line diff of every stakeholder-requested string against the live rendered page (Issues 1, 2, 6) |
| Typography | visual diff — confirm no font-size/weight/family change anywhere (regression guard, nothing in this plan touches typography) |
| Spacing | visual diff — confirm no padding/margin change outside Issue 2's intentional removal |
| Visual regression | full-page screenshot diff of all 11 routes, before-branch vs. after-branch, at 1440px and 375px widths |

---

## Build Verification (must all succeed before this ticket can leave IN PROGRESS)

- [ ] `npm run lint` — zero errors, zero warnings
- [ ] `npx tsc --noEmit` (this repo's equivalent of `npm run type-check`, since no dedicated script exists in `package.json` — confirmed by reading `package.json`'s `scripts` block, which only defines `dev`, `build`, `start`, `lint`, `test`) — zero TypeScript errors
- [ ] `npm run build` — production build succeeds, exit code 0
- [ ] `npm run start` + manual route smoke test (Task 7 Step 5) — all 11 routes return HTTP 200, zero console errors, zero console warnings
- [ ] Zero failed network requests on any of the 11 routes (DevTools Network tab, full page load)
- [ ] Zero missing images (all 9 case-study images + 2 product art images resolve)
- [ ] Zero hydration mismatch warnings in the browser console on any route (React 19's hydration error overlay must not appear)
- [ ] Zero new accessibility violations (axe DevTools scan) on `/products` and `/insights` vs. a pre-change baseline scan
- [ ] Zero Lighthouse regressions >1 point on Performance, Accessibility, Best Practices, or SEO for `/`, `/products`, `/insights` vs. a pre-change baseline run

---

## Final Sign-Off — Production Readiness Checklist

| Acceptance Criterion | Status | Required Evidence |
|---|---|---|
| Issue 1: ArenaOS copy matches exactly | BLOCKED — pending execution | TC-01 screenshots + text extraction across 4 browsers × 3 viewports |
| Issue 2: Coming-soon section removed, no layout shift | BLOCKED — pending execution | TC-02 before/after screenshots at 5 breakpoints + CLS Lighthouse score + DOM/source verification |
| Issue 3: Accordion flicker eliminated at root cause | BLOCKED — pending execution | TC-03 Performance trace, Paint-flashing recording, React Profiler screenshot, FPS meter reading, cross-browser video review |
| Issue 4: Duplicate case-study image replaced | BLOCKED — pending execution | TC-04 side-by-side screenshots, MD5 hash diff, Network tab distinct-response proof |
| Issue 5: University Management System image verified unique | BLOCKED — pending execution | TC-05 MD5 hash table + single-code-reference grep output (verification evidence gathered during planning is preliminary; must be re-confirmed post-Task-4 as the final-state proof, since Task 4 changes a sibling file in the same directory) |
| Issue 6: Zero em dashes in user-visible content, grammar preserved | BLOCKED — pending execution | TC-06 view-source search across 11 routes + grammar reviewer sign-off |
| Build verification: lint/type-check/build clean | BLOCKED — pending execution | CI or local terminal output of all 3 commands with exit code 0 |
| No regressions: navigation, routing, SEO, a11y, animations, responsive, typography, spacing, theme, hydration, image optimization, performance, lazy loading, reusable components, shared hooks, global state | BLOCKED — pending execution | Full cross-cutting QA matrix results, before/after Lighthouse comparison, visual regression screenshot diff |

**Overall ticket status: IN PROGRESS.**

Per the stakeholder's explicit instruction — "If even one Acceptance Criterion lacks evidence, the overall ticket status MUST remain IN PROGRESS or BLOCKED. Do not assume anything." — this plan document itself is pre-execution: it contains verified codebase evidence (file contents, hashes, image inspection) gathered during planning, but the actual code edits, test runs, and QA matrix have not yet been executed. Every row above will flip to PASS only after its corresponding task and test case are actually run and their evidence attached. No row may be marked PASS from planning-stage analysis alone.

---

## Self-Review Notes (author's own pre-handoff check)

- **Spec coverage:** All 6 issues have a dedicated task (Tasks 1-6) plus a cross-cutting verification task (Task 7). Every stakeholder sub-requirement (e.g., Issue 2's "no empty whitespace / no layout shift / responsive unchanged") is mapped to a specific QA test case (TC-02) and evidence requirement.
- **Placeholder scan:** No "TBD"/"add error handling"/"similar to Task N" patterns present — every code block is the literal exact diff to apply, every test has real assertions, every command is copy-pasteable.
- **Type consistency:** `Product` interface fields (`target`, `moat`, `revenueValue`, `revenueLabel`) referenced identically across Tasks 1 and the Impact Analysis table. `CaseStudy` fields (`summary`, `title`, `result`, `highlights`, `image`) referenced identically across Tasks 4, 6, and the test files. `ACCORDION_CONFIG` object shape is extended (not renamed) in Task 3, preserving `autoplayIntervalMs`/`transitionDuration`/`transitionEase` exactly as consumed elsewhere in the same file.
- **Scope guard applied:** Explicitly excluded ~40 files' worth of comment-only em dashes with documented rationale (Risk R2), preventing unforced high-diff-noise churn while still satisfying the stakeholder's actual concern (no em dash visible on the live website).

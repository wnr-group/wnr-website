# Careers Page + Let's Talk Contact Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/careers` into a full recruiting page (two-column hero, why-work-with-us, benefits, culture, hiring process, data-driven job openings with an accessible resume-upload flow) and rebuild the existing `/contact` ("Let's Talk") page's form into a production-grade lead form (typed service layer, server-validated API route, rate limiting, retry/timeout, toasts) — without touching any other page, route, or shared primitive beyond the additive ones this plan creates.

**Architecture:** Two mostly-independent feature slices that share three new generic UI primitives (`components/ui/select.tsx`, `components/ui/toast.tsx`, `components/ui/dialog.tsx`, all thin wrappers around the `@base-ui/react` primitives already installed) and one validation/rate-limit layer under `lib/`. Both features follow the existing `components/sections/<feature>/` decomposition established by `components/sections/products/` (small files, a `types.ts`, hooks split out, one Vitest per logic-bearing file). Both new API routes (`app/api/contact/route.ts`, `app/api/careers/resume/route.ts`) are the first Route Handlers in this repo; each is a thin, request-parsing wrapper around the same pure validators used client-side, so server validation is real, not decorative. Careers' "Apply" links and "no openings" fallback route into the same Let's Talk form via a `?inquiry=careers&role=...` query string, so there is exactly one lead-capture surface in the app, not two.

**Tech Stack:** Next.js 16 (App Router, Route Handlers, `NextRequest`/`NextResponse`), React 19, TypeScript (strict), Tailwind v4 (CSS-first theme, no config file), `@base-ui/react` (already installed — `select`, `toast`, `dialog` primitives, used here for the first time; `button` is already wrapped this way in `components/ui/button.tsx`), `motion` (`motion/react`, existing `Reveal`/`Stagger` from `components/ui/motion.tsx` — reused, not replaced), Vitest + React Testing Library (test runner already bootstrapped by the prior Products feature).

## Global Constraints

- Do not modify: Header, Footer, Hero, HeroVideo, Problem, WhatWeBuild, Approach, Products (any file under `components/sections/products/`), PhotoBand, Industries, Work, Values, WhyUs, root layout/template, `app/about/page.tsx`, `app/capabilities/page.tsx`, `app/insights/page.tsx`, `app/products/**`, global theme/design tokens (`app/globals.css`), Tailwind config, ESLint config, `tsconfig.json`, `vitest.config.ts`, `vitest.setup.ts`.
- No new npm dependencies. `@base-ui/react` (select, toast, dialog), `lucide-react`, `motion`, `clsx`/`tailwind-merge` are already installed and cover every interactive-primitive need in this plan (drag-and-drop and file upload use native browser APIs — `DataTransfer`, `XMLHttpRequest`, `FormData` — no library).
- Strict TypeScript, no `any`, no dead/commented-out code, no placeholder `TODO`s left in shipped code.
- Reuse existing design tokens and components exactly as established: `Section`/`Eyebrow`/`Container` (`components/ui/Section.tsx`), `PageHero` (`components/ui/PageHero.tsx`), `Cta` (`components/ui/Cta.tsx`), `cn` (`lib/utils.ts`), the `EASE = [0.22, 1, 0.36, 1]` motion curve, and the existing color/spacing scale (`--color-forest`, `--color-ink`, `--color-body`, `--color-line`, `rounded-2xl`/`rounded-3xl` card radii, `Section`'s `py-20 md:py-28 lg:py-32` rhythm). Do not introduce new colors, spacing values, or a second card style.
- New `next/image` usage must use `loading="lazy"` (never the deprecated `priority` prop — this Next.js version renamed it to `preload`; existing pre-existing files that still use `priority` are out of scope and left untouched).
- Every new interactive component must be keyboard-operable, have visible focus states (`focus-visible:ring-2 focus-visible:ring-forest`), and correct ARIA (label association, `aria-invalid`, `aria-describedby`, `role="alert"` for inline errors). Respect `prefers-reduced-motion` — already handled globally by `MotionConfig reducedMotion="user"` in `components/ui/motion.tsx`; don't bypass it with raw CSS transitions longer than what reduced-motion users should see (keep any new transitions on transform/opacity, 150–350ms).
- Single source of truth: form field validation logic lives in `lib/validation.ts` and is called identically by the client hook and the API route (never re-implement a regex in two places). Same for file validation (`lib/file-validation.ts`).
- No secrets, no new environment variables. There is no email/CRM/ATS/object-storage integration configured anywhere in this repo (confirmed by audit below) — both new API routes validate and rate-limit fully, then hand off at one clearly labeled boundary (a `console.info` log for the contact route, a write to `os.tmpdir()` for the resume route). This is not a placeholder for missing plan content — it is the real, working behavior of this deployment today, documented so the next engineer knows exactly where to wire a real CRM/ATS.

## Audit Summary (completed, no code changes)

**Routing today.** `/careers` (`app/careers/page.tsx`) and `/contact` (`app/contact/page.tsx`) both already exist and render. The header's "Let's Talk" CTA and the footer's "Get in Touch" CTA both already point at `/contact` — so "Let's Talk page" in the spec **is** `app/contact/page.tsx`; there is no second page to create. Both pages are Server Components today; `/contact` renders a client form component (`components/ui/LeadForm.tsx`, `"use client"`), `/careers` is fully static (no client components).

**Current contact form.** `components/ui/LeadForm.tsx` is a self-contained `"use client"` component: plain `useState<boolean>` for a `sent` flag, native HTML5 `required`/`type="email"` validation only, `onSubmit` calls `e.preventDefault(); setSent(true)` — **no network call at all** (its own comment says "UI only for now — no backend"). Fields today: name*, business (optional), email*, phone (optional), need/message* (required, this plan renames to "message" and makes it optional per the new field spec). This plan replaces it entirely with `components/sections/contact/ContactForm.tsx` (real submission, new field set) and deletes `LeadForm.tsx` (fully superseded, not left as dead code).

**Current careers page.** `app/careers/page.tsx` inlines: a `PageHero` (no `aside` image), a "How We Work" block using `culture.pillars` from `content/sections.ts` (identical content block is also inlined separately in `app/about/page.tsx` — that duplication already exists today and is out of scope; this plan does not touch `app/about/page.tsx`), an inline `openings` array of `{ role, team, location }` rendered as plain anchor rows (not a card component, not typed as a shared `Job` interface, no department/employment-type/experience/description fields), and a closing CTA section. There is no resume upload anywhere in the codebase today.

**No backend infrastructure exists yet.** `find app -iname "route.ts"` and `find . -iname "api"` (outside `node_modules`) return nothing — there are zero Route Handlers in this repo today. There is no database, no email/CRM SDK, no cloud storage SDK, and no environment variable beyond what Next.js provides by default. `app/api/contact/route.ts` and `app/api/careers/resume/route.ts` (this plan) are the first backend code in the project.

**`@base-ui/react` (already a dependency) ships `select`, `toast`, and `dialog` primitives** (confirmed via `node_modules/@base-ui/react/{select,toast,dialog}`), unused anywhere in the codebase today except `button` (wrapped in `components/ui/button.tsx`, generated via the `shadcn` CLI per `components.json`'s `"style": "base-nova"`). This plan hand-writes thin wrappers for `select`/`toast`/`dialog` in the same style as the existing `button.tsx`, rather than invoking the `shadcn` CLI (which needs network access to a registry and is not reliable in an offline/sandboxed execution environment) — the wrapper code in this plan was written directly against the installed package's type declarations (`node_modules/@base-ui/react/select/**/*.d.ts`, `.../toast/**/*.d.ts`, `.../dialog/**/*.d.ts`), so it does not depend on that registry being reachable.

**Risk flag for the executing engineer:** the exact Base UI data-attribute names used for style hooks in this plan (`data-[popup-open]`, `data-[placeholder]`, `data-[highlighted]`, `data-[starting-style]`, `data-[ending-style]`) are written from the installed package's documented conventions but were not runtime-verified against a live browser in this planning pass (no dev server was run during planning). Task 5, 6, and 7 each include a Vitest test that exercises real interaction (open a select with the keyboard, fire a toast, open/close a dialog) specifically so a wrong attribute name fails a test immediately instead of silently shipping a visually-broken control. If a test in those tasks fails on a styling assertion only (not a behavior assertion), check `node_modules/@base-ui/react/<component>/**/*.d.ts` and the rendered DOM (`screen.debug()`) for the actual attribute name and correct the `className` selector — do not change the primitive's behavior to work around it.

**Employment type note:** `Job.employmentType` is a closed union (`"Full-time" | "Part-time" | "Contract" | "Internship"`) mapped to schema.org's `JobPosting.employmentType` enum (`FULL_TIME`/`PART_TIME`/`CONTRACTOR`/`INTERN`) via a small local `Record` in `app/careers/page.tsx` (Task 21) — not a generic string transform, since `"Contract"` → `"CONTRACTOR"` and `"Internship"` → `"INTERN"` aren't derivable by case/punctuation rules alone.

## Files

**Created:**
- `content/careers.ts` — `Job` interface, hero/why-work-with-us/benefits/hiring-process/CTA copy, `openings: Job[]`, `resumeConfig`
- `content/contact.ts` — `SelectOption` interface, `regions`, `inquiryTypes`
- `lib/validation.ts` + `lib/validation.test.ts` — shared field validators, `sanitizeText`, `escapeHtml`
- `lib/file-validation.ts` + `lib/file-validation.test.ts` — resume file meta + magic-byte signature validators
- `lib/rate-limit.ts` + `lib/rate-limit.test.ts` — in-memory fixed-window limiter
- `components/ui/select.tsx` + `components/ui/select.test.tsx` — reusable Base UI Select wrapper
- `components/ui/toast.tsx` + `components/ui/toast.test.tsx` — reusable Base UI Toast provider/viewport wrapper
- `components/ui/dialog.tsx` + `components/ui/dialog.test.tsx` — reusable Base UI Dialog wrapper
- `services/contact.ts` + `services/contact.test.ts` — typed contact-form API client (fetch, timeout, abort)
- `app/api/contact/route.ts` + `app/api/contact/route.test.ts` — contact form Route Handler
- `components/sections/contact/types.ts`
- `components/sections/contact/FormField.tsx` + `.test.tsx`
- `components/sections/contact/hooks/useContactForm.ts` + `.test.ts`
- `components/sections/contact/ContactForm.tsx` + `.test.tsx`
- `services/careers.ts` + `services/careers.test.ts` — typed resume-upload API client (XHR, progress, abort)
- `app/api/careers/resume/route.ts` + `app/api/careers/resume/route.test.ts` — resume upload Route Handler
- `components/sections/careers/types.ts`
- `components/sections/careers/JobCard.tsx` + `.test.tsx`
- `components/sections/careers/JobList.tsx` + `.test.tsx`
- `components/sections/careers/ResumeUpload.tsx` + `.test.tsx`
- `components/sections/careers/ResumeDialog.tsx` + `.test.tsx`
- `components/sections/careers/WhyWorkWithUs.tsx`
- `components/sections/careers/Benefits.tsx`
- `components/sections/careers/Culture.tsx`
- `components/sections/careers/HiringProcess.tsx`

**Modified:**
- `content/media.ts` — additive `careers` image entry
- `app/contact/page.tsx` — swaps `LeadForm` for `ContactForm` (in a `Suspense` boundary), adds per-page metadata (OG/Twitter/canonical) + `ContactPage` JSON-LD
- `app/careers/page.tsx` — full rebuild: `PageHero` with `aside` image, `WhyWorkWithUs`, `Benefits`, `Culture`, `HiringProcess`, `JobList`-driven openings section, closing CTA, per-page metadata + `JobPosting` JSON-LD

**Deleted:**
- `components/ui/LeadForm.tsx` — fully superseded by `components/sections/contact/ContactForm.tsx`

**Untouched:** everything not listed above, including `app/page.tsx`, `app/about/page.tsx`, `app/products/**`, `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `components/sections/products/**`, `components/ui/{button,Cta,Section,PageHero,Logo,motion}.tsx`, `content/{sections,company,products,arms}.ts`, `app/globals.css`, `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `vitest.setup.ts`.

---

### Task 1: Content modules for both features

**Files:**
- Create: `content/careers.ts`
- Create: `content/contact.ts`
- Modify: `content/media.ts`

**Interfaces:**
- Produces: `Job`, `careersHero`, `whyWorkWithUs`, `benefits`, `hiringProcess`, `openings: Job[]`, `noOpeningsCopy`, `careersCta`, `resumeConfig` (from `content/careers.ts`); `SelectOption`, `regions: SelectOption[]`, `inquiryTypes: SelectOption[]` (from `content/contact.ts`); `media.careers: BrandImage` (added to the existing `media` export).

- [ ] **Step 1: Create `content/careers.ts`**

```ts
// Careers page content — hero, why-work-with-us, benefits, hiring process,
// current openings, and resume-upload configuration. Culture content is
// intentionally reused from content/sections.ts's `culture` export (same
// pillars already used elsewhere) rather than duplicated here.

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
  experience: string;
  description: string;
}

export const careersHero = {
  eyebrow: "Careers",
  heading: "Build your future with WnR Group.",
  lead: "We're 25+ engineers, strategists, and operators building the operating systems businesses actually run on. Come build what's next with us.",
  ctaLabel: "Explore Opportunities",
};

export interface CareersReason {
  title: string;
  body: string;
  icon: "growth" | "impact" | "team";
}

export const whyWorkWithUs = {
  eyebrow: "Why Work With WnR",
  heading: "Real ownership, from day one.",
  intro:
    "You won't be a cog in a delivery machine. Every engineer, consultant, and designer here owns outcomes — not just tickets.",
  reasons: [
    {
      title: "Ship what you build",
      body: "No hand-off to a separate delivery team — you scope it, build it, implement it with the client, and see the outcome land.",
      icon: "growth",
    },
    {
      title: "Work that compounds",
      body: "Every engagement feeds the product portfolio. What you learn on one client's workflow makes EduOS and ArenaOS smarter.",
      icon: "impact",
    },
    {
      title: "A small, senior team",
      body: "25+ people, no layers of management between you and the decision. You'll work directly with the founders and the client.",
      icon: "team",
    },
  ] satisfies CareersReason[],
};

export interface Benefit {
  title: string;
  body: string;
  icon: "health" | "flexibility" | "growth" | "compensation" | "tools" | "culture";
}

export const benefits = {
  eyebrow: "Benefits",
  heading: "What you get.",
  items: [
    {
      title: "Health coverage",
      body: "Group health insurance for you and your family from day one.",
      icon: "health",
    },
    {
      title: "Flexible hours",
      body: "Remote-friendly roles and flexible schedules built around outcomes, not desk time.",
      icon: "flexibility",
    },
    {
      title: "Learning budget",
      body: "An annual budget for courses, books, and conferences — your growth compounds ours.",
      icon: "growth",
    },
    {
      title: "Competitive pay",
      body: "Salary benchmarked against the market, reviewed every year, no negotiation games.",
      icon: "compensation",
    },
    {
      title: "Modern tooling",
      body: "The laptop and stack you need to do your best work, no fighting procurement for it.",
      icon: "tools",
    },
    {
      title: "A real team",
      body: "Small enough that everyone knows your name, senior enough that you'll learn something every week.",
      icon: "culture",
    },
  ] satisfies Benefit[],
};

export interface HiringStep {
  num: string;
  title: string;
  body: string;
}

export const hiringProcess = {
  eyebrow: "Hiring Process",
  heading: "How we hire.",
  intro: "Four steps, no black box. We move fast and tell you where you stand at every stage.",
  steps: [
    { num: "01", title: "Apply", body: "Send your resume against a role — or submit it speculatively if nothing's open yet." },
    { num: "02", title: "Screen", body: "A 30-minute call with our team to understand your background and what you're looking for." },
    { num: "03", title: "Interview", body: "A working session on real problems from our client engagements — no whiteboard trivia." },
    { num: "04", title: "Offer", body: "We move fast on a decision and make an offer within days of your final interview." },
  ] satisfies HiringStep[],
};

export const openings: Job[] = [
  {
    id: "senior-fullstack-engineer",
    title: "Senior Full-Stack Engineer",
    department: "WnR Systems",
    location: "Tamil Nadu / Remote",
    employmentType: "Full-time",
    experience: "4-7 years",
    description:
      "Own features end-to-end across our client platforms and vertical SaaS products — from data model to deployed UI.",
  },
  {
    id: "operations-consultant",
    title: "Operations Consultant",
    department: "WnR Consulting",
    location: "Tamil Nadu",
    employmentType: "Full-time",
    experience: "3-5 years",
    description:
      "Map client workflows on-site, identify where time and money leak, and design the operational strategy our engineers build against.",
  },
  {
    id: "ai-ml-engineer",
    title: "AI/ML Engineer",
    department: "WnR AI Labs",
    location: "Remote, India",
    employmentType: "Full-time",
    experience: "2-5 years",
    description:
      "Build the automation and intelligence layer that ships inside every WnR product — from workflow copilots to operational forecasting.",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    department: "WnR Systems",
    location: "Tamil Nadu / Remote",
    employmentType: "Full-time",
    experience: "3-6 years",
    description:
      "Design the interfaces real operators use every day — dense, fast, and built around how the workflow actually happens.",
  },
];

export const noOpeningsCopy = {
  heading: "No current openings.",
  body: "We are always looking for exceptional talent.",
  ctaLabel: "Submit Resume",
};

export const careersCta = {
  heading: "We're building what's next. Want in?",
  body: "Don't see your role? Tell us how you'd make WnR Group better.",
  ctaLabel: "Get in Touch",
};

export const resumeConfig = {
  acceptedExtensions: [".pdf", ".doc", ".docx"] as const,
  acceptedMimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ] as const,
  maxSizeBytes: 4 * 1024 * 1024,
};
```

- [ ] **Step 2: Create `content/contact.ts`**

```ts
// Contact ("Let's Talk") form content — dropdown option sets. `value` is a
// stable machine key sent to the API and used in query-string deep links
// (e.g. Careers' "Apply" links use inquiryType value "careers"); `label` is
// the copy shown to the user.

export interface SelectOption {
  value: string;
  label: string;
}

export const regions: SelectOption[] = [
  { value: "tamil-nadu", label: "Tamil Nadu" },
  { value: "south-india", label: "South India" },
  { value: "rest-of-india", label: "Rest of India" },
  { value: "middle-east", label: "Middle East / UAE" },
  { value: "europe", label: "Europe" },
  { value: "other", label: "Other" },
];

export const inquiryTypes: SelectOption[] = [
  { value: "custom-software", label: "Custom Software & Systems" },
  { value: "ai-workflows", label: "AI-Native Workflows" },
  { value: "vertical-saas", label: "Vertical SaaS Products (EduOS / ArenaOS)" },
  { value: "consulting", label: "Consulting & Operations Strategy" },
  { value: "careers", label: "Careers" },
  { value: "partnership", label: "Partnership" },
  { value: "general", label: "General Inquiry" },
];
```

- [ ] **Step 3: Add the `careers` entry to `content/media.ts`**

Modify `content/media.ts` — add a new key to the existing `media` object (do not change `hero` or `office`):

```ts
export const media: Record<string, BrandImage | null> = {
  hero: {
    src: "/brand/photo-team.webp",
    alt: "Two WnR colleagues reviewing a live operational dashboard together in a bright office",
    width: 1920,
    height: 1086,
  },
  office: {
    src: "/brand/photo-office.webp",
    alt: "A calm, modern WnR workspace — glass meeting rooms, warm wood, forest-green furniture and daylight",
    width: 1920,
    height: 1086,
  },
  careers: {
    src: "/brand/photo-office.webp",
    alt: "A calm, modern WnR workspace where new hires build their career — glass meeting rooms, warm wood, forest-green furniture and daylight",
    width: 1920,
    height: 1086,
  },
};
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add content/careers.ts content/contact.ts content/media.ts
git commit -m "feat: add content modules for careers and contact form features"
```

---

### Task 2: Shared field validation (`lib/validation.ts`)

**Files:**
- Create: `lib/validation.ts`
- Test: `lib/validation.test.ts`

**Interfaces:**
- Consumes: nothing (pure module).
- Produces: `ContactFormInput` interface, `ContactFormErrors` type, `validateName`, `validateEmail`, `validatePhone`, `validateOrganization`, `validateMessage`, `validateRegion`, `validateInquiryType`, `validateContactForm(input, options)`, `isValid(errors)`, `sanitizeText`, `escapeHtml` — imported by `app/api/contact/route.ts` (Task 9) and `components/sections/contact/hooks/useContactForm.ts` (Task 11), so client and server run the exact same checks.

- [ ] **Step 1: Write the failing test — `lib/validation.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateOrganization,
  validateMessage,
  validateRegion,
  validateInquiryType,
  validateContactForm,
  isValid,
  sanitizeText,
  escapeHtml,
  type ContactFormInput,
} from "./validation";

const REGION_VALUES = ["tamil-nadu", "other"];
const INQUIRY_VALUES = ["careers", "general"];

describe("validateName", () => {
  it("rejects empty", () => {
    expect(validateName("")).toMatch(/required/i);
  });
  it("rejects too short", () => {
    expect(validateName("A")).toMatch(/at least/i);
  });
  it("rejects too long", () => {
    expect(validateName("A".repeat(81))).toMatch(/under 80/i);
  });
  it("rejects digits/symbols", () => {
    expect(validateName("John123")).toMatch(/invalid characters/i);
  });
  it("accepts a normal name", () => {
    expect(validateName("Anaïs O'Brien-Smith")).toBeNull();
  });
});

describe("validateEmail", () => {
  it("rejects empty", () => {
    expect(validateEmail("")).toMatch(/required/i);
  });
  it("rejects missing @", () => {
    expect(validateEmail("not-an-email")).toMatch(/valid email/i);
  });
  it("rejects missing domain dot", () => {
    expect(validateEmail("a@b")).toMatch(/valid email/i);
  });
  it("accepts a normal email", () => {
    expect(validateEmail("person@company.com")).toBeNull();
  });
});

describe("validatePhone", () => {
  it("rejects empty", () => {
    expect(validatePhone("")).toMatch(/required/i);
  });
  it("rejects letters", () => {
    expect(validatePhone("call-me-maybe")).toMatch(/valid international/i);
  });
  it("accepts E.164 with plus", () => {
    expect(validatePhone("+919876543210")).toBeNull();
  });
  it("accepts formatted local numbers by stripping separators", () => {
    expect(validatePhone("(987) 654-3210")).toBeNull();
  });
});

describe("validateOrganization", () => {
  it("rejects empty", () => {
    expect(validateOrganization("")).toMatch(/required/i);
  });
  it("accepts a normal org name", () => {
    expect(validateOrganization("Acme Pvt Ltd")).toBeNull();
  });
});

describe("validateMessage", () => {
  it("is optional — empty is valid", () => {
    expect(validateMessage("")).toBeNull();
  });
  it("rejects a too-short non-empty message", () => {
    expect(validateMessage("hi")).toMatch(/at least/i);
  });
  it("rejects a too-long message", () => {
    expect(validateMessage("a".repeat(2001))).toMatch(/under 2000/i);
  });
  it("accepts a reasonable message", () => {
    expect(validateMessage("We'd like to talk about a custom platform.")).toBeNull();
  });
});

describe("validateRegion / validateInquiryType", () => {
  it("rejects empty region", () => {
    expect(validateRegion("", REGION_VALUES)).toMatch(/select a region/i);
  });
  it("rejects a region not in the option set", () => {
    expect(validateRegion("mars", REGION_VALUES)).toMatch(/valid region/i);
  });
  it("accepts a listed region", () => {
    expect(validateRegion("tamil-nadu", REGION_VALUES)).toBeNull();
  });
  it("rejects empty inquiry type", () => {
    expect(validateInquiryType("", INQUIRY_VALUES)).toMatch(/select an inquiry/i);
  });
  it("accepts a listed inquiry type", () => {
    expect(validateInquiryType("careers", INQUIRY_VALUES)).toBeNull();
  });
});

describe("validateContactForm / isValid", () => {
  const validInput: ContactFormInput = {
    name: "Anaïs Rao",
    email: "anais@company.com",
    organization: "Acme Pvt Ltd",
    phone: "+919876543210",
    region: "tamil-nadu",
    inquiryType: "general",
    message: "",
  };

  it("returns no errors for fully valid input", () => {
    const errors = validateContactForm(validInput, {
      regionValues: REGION_VALUES,
      inquiryTypeValues: INQUIRY_VALUES,
    });
    expect(isValid(errors)).toBe(true);
  });

  it("collects one error per invalid field", () => {
    const errors = validateContactForm(
      { ...validInput, name: "", email: "bad", region: "" },
      { regionValues: REGION_VALUES, inquiryTypeValues: INQUIRY_VALUES },
    );
    expect(isValid(errors)).toBe(false);
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.region).toBeTruthy();
    expect(errors.organization).toBeUndefined();
  });
});

describe("sanitizeText", () => {
  it("trims whitespace", () => {
    expect(sanitizeText("  hello  ")).toBe("hello");
  });
  it("strips control characters but keeps normal punctuation", () => {
    expect(sanitizeText("a < b && b > c ")).toBe("a < b && b > c");
  });
});

describe("escapeHtml", () => {
  it("escapes HTML-significant characters", () => {
    expect(escapeHtml(`<script>alert('x')</script> & "quoted"`)).toBe(
      "&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt; &amp; &quot;quoted&quot;",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- validation`
Expected: FAIL — `Cannot find module './validation'` (the module doesn't exist yet).

- [ ] **Step 3: Create `lib/validation.ts`**

```ts
// Shared, dependency-free form validation. Called identically from the
// client hook (components/sections/contact/hooks/useContactForm.ts) and the
// server route (app/api/contact/route.ts) so the server never trusts a
// client-only check.

export interface ContactFormInput {
  name: string;
  email: string;
  organization: string;
  phone: string;
  region: string;
  inquiryType: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormInput, string>>;

// Practical RFC 5322 subset: permissive local part, a domain with at least
// one dot — the same shape browsers use for <input type="email">.
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// E.164-shaped: optional leading +, first digit 1-9, 7 to 14 more digits.
const PHONE_RE = /^\+?[1-9]\d{7,14}$/;

const NAME_RE = /^[\p{L}\p{M}' .-]+$/u;

export function validateName(value: string): string | null {
  const v = value.trim();
  if (!v) return "Name is required.";
  if (v.length < 2) return "Name must be at least 2 characters.";
  if (v.length > 80) return "Name must be under 80 characters.";
  if (!NAME_RE.test(v)) return "Name contains invalid characters.";
  return null;
}

export function validateEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return "Email is required.";
  if (v.length > 254) return "Email is too long.";
  if (!EMAIL_RE.test(v)) return "Enter a valid email address.";
  return null;
}

export function validatePhone(value: string): string | null {
  const v = value.trim().replace(/[\s()-]/g, "");
  if (!v) return "Contact number is required.";
  if (!PHONE_RE.test(v)) return "Enter a valid international phone number.";
  return null;
}

export function validateOrganization(value: string): string | null {
  const v = value.trim();
  if (!v) return "Organization is required.";
  if (v.length < 2) return "Organization must be at least 2 characters.";
  if (v.length > 120) return "Organization must be under 120 characters.";
  return null;
}

export function validateMessage(value: string): string | null {
  const v = value.trim();
  if (!v) return null; // optional field
  if (v.length < 10) return "Message must be at least 10 characters.";
  if (v.length > 2000) return "Message must be under 2000 characters.";
  return null;
}

export function validateRegion(value: string, options: readonly string[]): string | null {
  if (!value) return "Select a region.";
  if (!options.includes(value)) return "Select a valid region.";
  return null;
}

export function validateInquiryType(value: string, options: readonly string[]): string | null {
  if (!value) return "Select an inquiry type.";
  if (!options.includes(value)) return "Select a valid inquiry type.";
  return null;
}

export function validateContactForm(
  input: ContactFormInput,
  options: { regionValues: readonly string[]; inquiryTypeValues: readonly string[] },
): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const name = validateName(input.name);
  if (name) errors.name = name;
  const email = validateEmail(input.email);
  if (email) errors.email = email;
  const organization = validateOrganization(input.organization);
  if (organization) errors.organization = organization;
  const phone = validatePhone(input.phone);
  if (phone) errors.phone = phone;
  const region = validateRegion(input.region, options.regionValues);
  if (region) errors.region = region;
  const inquiryType = validateInquiryType(input.inquiryType, options.inquiryTypeValues);
  if (inquiryType) errors.inquiryType = inquiryType;
  const message = validateMessage(input.message);
  if (message) errors.message = message;
  return errors;
}

export function isValid(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length === 0;
}

// Removes control characters (a real injection vector into logs/headers)
// and trims. Does not strip legitimate punctuation like `<`/`>` typed as
// prose — encoding for HTML output is `escapeHtml`'s job, not this one's.
export function sanitizeText(value: string): string {
  const withoutControlChars = Array.from(value)
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      const isC0 = code < 32;
      const isDel = code === 127;
      return !isC0 && !isDel;
    })
    .join("");
  return withoutControlChars.trim();
}

const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

// Escapes text at the output boundary (e.g. before logging or forwarding to
// a future HTML-rendering sink) so it can never be interpreted as markup.
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch]);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- validation`
Expected: PASS, all cases green.

- [ ] **Step 5: Commit**

```bash
git add lib/validation.ts lib/validation.test.ts
git commit -m "feat: add shared contact form validation module"
```

---

### Task 3: Resume file validation (`lib/file-validation.ts`)

**Files:**
- Create: `lib/file-validation.ts`
- Test: `lib/file-validation.test.ts`

**Interfaces:**
- Consumes: nothing (pure module).
- Produces: `FileValidationOptions` interface, `getExtension(filename)`, `validateFileMeta(file, options)`, `validateFileSignature(bytes, extension)` — `validateFileMeta` is used both client-side (`components/sections/careers/ResumeUpload.tsx`, Task 18) and server-side (`app/api/careers/resume/route.ts`, Task 15); `validateFileSignature` is server-only (needs the actual file bytes, which the browser doesn't hand over for a meta-only check).

- [ ] **Step 1: Write the failing test — `lib/file-validation.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { getExtension, validateFileMeta, validateFileSignature } from "./file-validation";

const options = {
  maxSizeBytes: 4 * 1024 * 1024,
  acceptedExtensions: [".pdf", ".doc", ".docx"] as const,
  acceptedMimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ] as const,
};

describe("getExtension", () => {
  it("returns the lowercased extension", () => {
    expect(getExtension("Resume.PDF")).toBe(".pdf");
  });
  it("returns an empty string when there is no extension", () => {
    expect(getExtension("resume")).toBe("");
  });
});

describe("validateFileMeta", () => {
  it("rejects an empty file", () => {
    const error = validateFileMeta({ name: "resume.pdf", size: 0, type: "application/pdf" }, options);
    expect(error).toMatch(/empty/i);
  });

  it("rejects a file over the size limit", () => {
    const error = validateFileMeta(
      { name: "resume.pdf", size: options.maxSizeBytes + 1, type: "application/pdf" },
      options,
    );
    expect(error).toMatch(/4MB/);
  });

  it("rejects an unsupported extension", () => {
    const error = validateFileMeta({ name: "resume.exe", size: 1000, type: "" }, options);
    expect(error).toMatch(/PDF, DOC, and DOCX/i);
  });

  it("rejects a mismatched reported MIME type", () => {
    const error = validateFileMeta(
      { name: "resume.pdf", size: 1000, type: "application/x-msdownload" },
      options,
    );
    expect(error).toMatch(/PDF, DOC, and DOCX/i);
  });

  it("accepts a well-formed pdf with no reported MIME type", () => {
    expect(validateFileMeta({ name: "resume.pdf", size: 1000, type: "" }, options)).toBeNull();
  });

  it("accepts a well-formed docx", () => {
    const type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    expect(validateFileMeta({ name: "resume.docx", size: 1000, type }, options)).toBeNull();
  });
});

describe("validateFileSignature", () => {
  it("accepts real PDF magic bytes", () => {
    const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
    expect(validateFileSignature(bytes, ".pdf")).toBeNull();
  });

  it("rejects a .pdf-named file whose bytes don't match the PDF signature", () => {
    const bytes = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
    expect(validateFileSignature(bytes, ".pdf")).toMatch(/does not match/i);
  });

  it("accepts a real legacy .doc (OLE compound file) signature", () => {
    const bytes = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    expect(validateFileSignature(bytes, ".doc")).toBeNull();
  });

  it("accepts a real .docx (ZIP) signature", () => {
    const bytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
    expect(validateFileSignature(bytes, ".docx")).toBeNull();
  });

  it("rejects a renamed Windows executable regardless of claimed extension", () => {
    const bytes = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00]);
    expect(validateFileSignature(bytes, ".pdf")).toMatch(/executable/i);
  });

  it("rejects a renamed shell script", () => {
    const bytes = new Uint8Array([0x23, 0x21, 0x2f, 0x62, 0x69, 0x6e]);
    expect(validateFileSignature(bytes, ".docx")).toMatch(/executable/i);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- file-validation`
Expected: FAIL — `Cannot find module './file-validation'`.

- [ ] **Step 3: Create `lib/file-validation.ts`**

```ts
// Resume upload validation. `validateFileMeta` runs on both the browser
// (fast feedback before uploading) and the server (never trust the client).
// `validateFileSignature` is server-only: it inspects the actual file bytes,
// which is the only thing an attacker can't spoof without also breaking the
// file format itself — unlike the filename extension or the browser-reported
// MIME type, both of which are just labels the client sends along.

export interface FileValidationOptions {
  maxSizeBytes: number;
  acceptedExtensions: readonly string[];
  acceptedMimeTypes: readonly string[];
}

export interface FileMeta {
  name: string;
  size: number;
  type: string;
}

export function getExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx === -1 ? "" : filename.slice(idx).toLowerCase();
}

export function validateFileMeta(file: FileMeta, options: FileValidationOptions): string | null {
  if (file.size <= 0) return "File is empty.";
  if (file.size > options.maxSizeBytes) {
    const mb = Math.round(options.maxSizeBytes / (1024 * 1024));
    return `File must be under ${mb}MB.`;
  }
  const extension = getExtension(file.name);
  if (!options.acceptedExtensions.includes(extension)) {
    return "Only PDF, DOC, and DOCX files are accepted.";
  }
  if (file.type && !options.acceptedMimeTypes.includes(file.type)) {
    return "Only PDF, DOC, and DOCX files are accepted.";
  }
  return null;
}

interface Signature {
  extension: string;
  matches: (bytes: Uint8Array) => boolean;
}

const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46, 0x2d]; // "%PDF-"
const DOC_SIGNATURE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]; // OLE compound file
const DOCX_ZIP_MARKERS = [0x03, 0x05, 0x07]; // PK local-file / empty-archive / spanned-archive markers

function startsWith(bytes: Uint8Array, prefix: number[]): boolean {
  if (bytes.length < prefix.length) return false;
  return prefix.every((value, i) => bytes[i] === value);
}

const SIGNATURES: Signature[] = [
  { extension: ".pdf", matches: (bytes) => startsWith(bytes, PDF_SIGNATURE) },
  { extension: ".doc", matches: (bytes) => startsWith(bytes, DOC_SIGNATURE) },
  {
    extension: ".docx",
    matches: (bytes) =>
      bytes.length >= 4 &&
      bytes[0] === 0x50 &&
      bytes[1] === 0x4b &&
      DOCX_ZIP_MARKERS.includes(bytes[2]) &&
      (bytes[3] === 0x04 || bytes[3] === 0x06 || bytes[3] === 0x08),
  },
];

const DANGEROUS_SIGNATURES: { name: string; matches: (bytes: Uint8Array) => boolean }[] = [
  { name: "Windows executable", matches: (bytes) => startsWith(bytes, [0x4d, 0x5a]) },
  { name: "ELF executable", matches: (bytes) => startsWith(bytes, [0x7f, 0x45, 0x4c, 0x46]) },
  { name: "script", matches: (bytes) => startsWith(bytes, [0x23, 0x21]) }, // "#!" shebang
];

export function validateFileSignature(bytes: Uint8Array, extension: string): string | null {
  const dangerous = DANGEROUS_SIGNATURES.find((sig) => sig.matches(bytes));
  if (dangerous) return `File content looks like an executable or script and was rejected.`;

  const signature = SIGNATURES.find((sig) => sig.extension === extension);
  if (!signature) return "Unsupported file type.";
  if (!signature.matches(bytes)) return "File content does not match its extension.";
  return null;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- file-validation`
Expected: PASS, all cases green.

- [ ] **Step 5: Commit**

```bash
git add lib/file-validation.ts lib/file-validation.test.ts
git commit -m "feat: add resume file validation (size, extension, magic-byte signature)"
```

---

### Task 4: In-memory rate limiter (`lib/rate-limit.ts`)

**Files:**
- Create: `lib/rate-limit.ts`
- Test: `lib/rate-limit.test.ts`

**Interfaces:**
- Consumes: nothing (pure module, uses `Date.now()`).
- Produces: `RateLimitOptions`, `RateLimitResult`, `rateLimit(key, options)` — used by `app/api/contact/route.ts` (Task 9) and `app/api/careers/resume/route.ts` (Task 15), each keyed by `` `${routeName}:${ip}` `` so the two routes don't share one bucket per IP.

- [ ] **Step 1: Write the failing test — `lib/rate-limit.test.ts`**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { rateLimit } from "./rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit", () => {
    const key = `test-key-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      const result = rateLimit(key, { limit: 3, windowMs: 60_000 });
      expect(result.allowed).toBe(true);
    }
  });

  it("blocks the request after the limit is reached within the window", () => {
    const key = `test-key-${Math.random()}`;
    rateLimit(key, { limit: 2, windowMs: 60_000 });
    rateLimit(key, { limit: 2, windowMs: 60_000 });
    const blocked = rateLimit(key, { limit: 2, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("resets the window after it elapses", () => {
    const key = `test-key-${Math.random()}`;
    rateLimit(key, { limit: 1, windowMs: 60_000 });
    const blocked = rateLimit(key, { limit: 1, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);

    vi.setSystemTime(new Date("2026-01-01T00:01:01Z"));
    const afterWindow = rateLimit(key, { limit: 1, windowMs: 60_000 });
    expect(afterWindow.allowed).toBe(true);
  });

  it("tracks independent keys separately", () => {
    const keyA = `a-${Math.random()}`;
    const keyB = `b-${Math.random()}`;
    rateLimit(keyA, { limit: 1, windowMs: 60_000 });
    const blockedA = rateLimit(keyA, { limit: 1, windowMs: 60_000 });
    const firstB = rateLimit(keyB, { limit: 1, windowMs: 60_000 });
    expect(blockedA.allowed).toBe(false);
    expect(firstB.allowed).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- rate-limit`
Expected: FAIL — `Cannot find module './rate-limit'`.

- [ ] **Step 3: Create `lib/rate-limit.ts`**

```ts
// In-memory, per-process fixed-window rate limiter. Correct for a single
// Node.js server instance. A multi-instance deployment needs a shared store
// (e.g. Redis) behind the same `rateLimit(key, options)` signature — swap
// the `buckets` Map below for that store without touching any call site.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.limit - 1, retryAfterMs: 0 };
  }

  if (existing.count >= options.limit) {
    return { allowed: false, remaining: 0, retryAfterMs: existing.resetAt - now };
  }

  existing.count += 1;
  return { allowed: true, remaining: options.limit - existing.count, retryAfterMs: 0 };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- rate-limit`
Expected: PASS, all cases green.

- [ ] **Step 5: Commit**

```bash
git add lib/rate-limit.ts lib/rate-limit.test.ts
git commit -m "feat: add in-memory rate limiter for form/upload API routes"
```

---

### Task 5: Reusable `Select` primitive (`components/ui/select.tsx`)

**Files:**
- Create: `components/ui/select.tsx`
- Test: `components/ui/select.test.tsx`

**Interfaces:**
- Consumes: `@base-ui/react/select` (installed dependency, confirmed present at `node_modules/@base-ui/react/select`), `cn` from `lib/utils.ts`.
- Produces: `SelectOption` type, `Select` component with props `{ id?, name?, options: SelectOption[], placeholder?, value?, defaultValue?, onValueChange?, required?, disabled?, "aria-invalid"?, "aria-describedby"? }` — used by `components/sections/contact/ContactForm.tsx` (Task 12) for the Region and Inquiry Type dropdowns.

- [ ] **Step 1: Write the failing test — `components/ui/select.test.tsx`**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./select";

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];

describe("Select", () => {
  it("shows the placeholder when nothing is selected", () => {
    render(<Select options={options} placeholder="Choose one" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Choose one");
  });

  it("opens the popup and selects an option by keyboard", async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} placeholder="Choose one" onValueChange={onValueChange} />);

    const trigger = screen.getByRole("combobox");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });

    const optionB = await screen.findByRole("option", { name: "Option B" });
    fireEvent.click(optionB);

    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("associates a label via the given id", () => {
    render(
      <>
        <label htmlFor="region">Region</label>
        <Select id="region" options={options} placeholder="Choose one" />
      </>,
    );
    expect(screen.getByLabelText("Region")).toBe(screen.getByRole("combobox"));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- select`
Expected: FAIL — `Cannot find module './select'`.

- [ ] **Step 3: Create `components/ui/select.tsx`**

```tsx
"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  id?: string;
  name?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

const triggerBase =
  "flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-paper px-4 py-3 text-left text-[0.95rem] text-ink transition-colors focus-visible:border-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/25 data-[popup-open]:border-forest aria-invalid:border-destructive";

export function Select({
  id,
  name,
  options,
  placeholder = "Select...",
  value,
  defaultValue,
  onValueChange,
  required,
  disabled,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: SelectProps) {
  return (
    <SelectPrimitive.Root<string>
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next)}
      required={required}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        id={id}
        className={triggerBase}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      >
        <SelectPrimitive.Value
          placeholder={placeholder}
          className="truncate text-ink data-[placeholder]:text-muted/70"
        />
        <SelectPrimitive.Icon className="shrink-0 text-muted">
          <ChevronDown size={16} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner sideOffset={8} className="z-50">
          <SelectPrimitive.Popup className="max-h-72 overflow-auto rounded-xl border border-line bg-paper p-1.5 shadow-card-hover">
            <SelectPrimitive.List>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[0.9rem] text-ink outline-none data-[highlighted]:bg-forest-wash data-[highlighted]:text-forest"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="text-forest">
                    <Check size={15} />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- select`
Expected: PASS. If the keyboard-open test fails because `Enter` doesn't open the popup on a plain `focus()` + `fireEvent.keyDown`, try `fireEvent.click(trigger)` to open it instead (Base UI's Select opens on trigger press by default; keyboard-open-on-Enter requires the trigger to be the `document.activeElement`, which jsdom's `.focus()` should provide, but confirm with `screen.debug()` if it doesn't) — this is exactly the kind of Base UI interaction detail flagged in the plan's Audit Summary; fix the test's interaction method, not the component's behavior, if the two disagree.

- [ ] **Step 5: Commit**

```bash
git add components/ui/select.tsx components/ui/select.test.tsx
git commit -m "feat: add reusable Select primitive wrapping Base UI Select"
```

---

### Task 6: Reusable `Toast` primitive (`components/ui/toast.tsx`)

**Files:**
- Create: `components/ui/toast.tsx`
- Test: `components/ui/toast.test.tsx`

**Interfaces:**
- Consumes: `@base-ui/react/toast` (installed dependency, confirmed present at `node_modules/@base-ui/react/toast`), `cn` from `lib/utils.ts`.
- Produces: `ToastProvider`, `useToastManager`, `Toaster` — used by `components/sections/contact/ContactForm.tsx` (Task 12) to show success/error/retry notifications after a submit.

- [ ] **Step 1: Write the failing test — `components/ui/toast.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { ToastProvider, Toaster, useToastManager } from "./toast";

function TriggerToast({ onReady }: { onReady: (add: ReturnType<typeof useToastManager>["add"]) => void }) {
  const { add } = useToastManager();
  onReady(add);
  return null;
}

describe("Toaster", () => {
  it("renders a toast's title, description, and lets it be dismissed", async () => {
    let add: ReturnType<typeof useToastManager>["add"] = () => "";

    render(
      <ToastProvider>
        <TriggerToast onReady={(fn) => (add = fn)} />
        <Toaster />
      </ToastProvider>,
    );

    act(() => {
      add({ type: "success", title: "Message sent", description: "We'll be in touch soon." });
    });

    expect(await screen.findByText("Message sent")).toBeInTheDocument();
    expect(screen.getByText("We'll be in touch soon.")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /dismiss notification/i });
    await act(async () => {
      closeButton.click();
    });
  });

  it("renders a retry action button when actionProps is provided", async () => {
    let add: ReturnType<typeof useToastManager>["add"] = () => "";
    const onRetry = vi.fn();

    render(
      <ToastProvider>
        <TriggerToast onReady={(fn) => (add = fn)} />
        <Toaster />
      </ToastProvider>,
    );

    act(() => {
      add({
        type: "error",
        title: "Couldn't send",
        description: "Network error.",
        actionProps: { children: "Retry", onClick: onRetry },
      });
    });

    const retryButton = await screen.findByRole("button", { name: "Retry" });
    retryButton.click();
    expect(onRetry).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- toast`
Expected: FAIL — `Cannot find module './toast'`.

- [ ] **Step 3: Create `components/ui/toast.tsx`**

```tsx
"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const ToastProvider = ToastPrimitive.Provider;
export const useToastManager = ToastPrimitive.useToastManager;

const typeStyles: Record<string, string> = {
  success: "border-forest/25 bg-forest-wash",
  error: "border-destructive/30 bg-mist",
};

export function Toaster() {
  const { toasts } = useToastManager();

  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:bottom-6 sm:right-6">
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            toast={toast}
            className={cn(
              "relative flex flex-col gap-1 rounded-2xl border p-4 shadow-card-hover",
              typeStyles[toast.type ?? "success"] ?? "border-line bg-paper",
            )}
          >
            <ToastPrimitive.Title className="pr-6 font-display text-sm font-semibold text-ink">
              {toast.title}
            </ToastPrimitive.Title>
            <ToastPrimitive.Description className="pr-6 text-sm text-body">
              {toast.description}
            </ToastPrimitive.Description>
            {toast.actionProps && (
              <button
                type="button"
                className="mt-1 w-fit text-sm font-semibold text-forest hover:text-forest-deep"
                {...toast.actionProps}
              />
            )}
            <ToastPrimitive.Close
              aria-label="Dismiss notification"
              className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-mist hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
            >
              <X size={14} />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- toast`
Expected: PASS. Per the Audit Summary's risk flag: if `Toaster` doesn't render outside of a `ToastPrimitive.Portal`'s target in jsdom, confirm `@testing-library/react`'s `render` can see portaled content (it can, by default, since portals still attach to `document.body`) — if the test still can't find the toast, run with `screen.debug(document.body)` to see what actually rendered.

- [ ] **Step 5: Commit**

```bash
git add components/ui/toast.tsx components/ui/toast.test.tsx
git commit -m "feat: add reusable Toast primitive wrapping Base UI Toast"
```

---

### Task 7: Reusable `Dialog` primitive (`components/ui/dialog.tsx`)

**Files:**
- Create: `components/ui/dialog.tsx`
- Test: `components/ui/dialog.test.tsx`

**Interfaces:**
- Consumes: `@base-ui/react/dialog` (installed dependency, confirmed present at `node_modules/@base-ui/react/dialog`), `cn` from `lib/utils.ts`.
- Produces: `Dialog` (root), `DialogTrigger`, `DialogContent` (`{ title, description?, children, className? }`) — used by `components/sections/careers/ResumeDialog.tsx` (Task 19) to host the resume upload form.

- [ ] **Step 1: Write the failing test — `components/ui/dialog.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Dialog, DialogTrigger, DialogContent } from "./dialog";

describe("Dialog", () => {
  it("opens on trigger click, shows title/description/children, and closes", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent title="Submit your resume" description="We review every resume.">
          <p>Dialog body content</p>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByText("Submit your resume")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(await screen.findByText("Submit your resume")).toBeInTheDocument();
    expect(screen.getByText("We review every resume.")).toBeInTheDocument();
    expect(screen.getByText("Dialog body content")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close dialog/i }));
    expect(screen.queryByText("Submit your resume")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- dialog`
Expected: FAIL — `Cannot find module './dialog'`.

- [ ] **Step 3: Create `components/ui/dialog.tsx`**

```tsx
"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" />
      <DialogPrimitive.Popup
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-line bg-paper p-6 shadow-card-hover focus:outline-none sm:p-8",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <DialogPrimitive.Title className="font-display text-xl font-bold text-ink">
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="mt-1.5 text-sm text-body">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close
            aria-label="Close dialog"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-mist hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
          >
            <X size={16} />
          </DialogPrimitive.Close>
        </div>
        <div className="mt-6">{children}</div>
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- dialog`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/dialog.tsx components/ui/dialog.test.tsx
git commit -m "feat: add reusable Dialog primitive wrapping Base UI Dialog"
```

---

### Task 8: Contact form API client (`services/contact.ts`)

**Files:**
- Create: `services/contact.ts`
- Test: `services/contact.test.ts`

**Interfaces:**
- Consumes: nothing beyond the global `fetch`/`AbortController` (mocked in tests).
- Produces: `ContactFormPayload`, `ContactSubmitResult` (`ContactSubmitSuccess | ContactSubmitFailure`), `submitContactForm(payload, options?)` — used by `components/sections/contact/hooks/useContactForm.ts` (Task 11). No component ever calls `fetch` directly (spec requirement: "No fetch inside component").

- [ ] **Step 1: Write the failing test — `services/contact.test.ts`**

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { submitContactForm, type ContactFormPayload } from "./contact";

const payload: ContactFormPayload = {
  name: "Anaïs Rao",
  email: "anais@company.com",
  organization: "Acme Pvt Ltd",
  phone: "+919876543210",
  region: "tamil-nadu",
  inquiryType: "general",
  message: "",
};

describe("submitContactForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("returns ok on a 200 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true, message: "Message received." }), { status: 200 }),
      ),
    );

    const result = await submitContactForm(payload);
    expect(result).toEqual({ ok: true, message: "Message received." });
  });

  it("returns a validation failure with field errors on a 400 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ok: false,
            message: "Please correct the highlighted fields.",
            fieldErrors: { email: "Enter a valid email address." },
          }),
          { status: 400 },
        ),
      ),
    );

    const result = await submitContactForm(payload);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe("validation");
      expect(result.fieldErrors?.email).toMatch(/valid email/i);
    }
  });

  it("returns a rate_limited failure on a 429 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: false, message: "Too many requests." }), { status: 429 }),
      ),
    );

    const result = await submitContactForm(payload);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("rate_limited");
  });

  it("returns a server failure on a 500 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false }), { status: 500 })),
    );

    const result = await submitContactForm(payload);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("server");
  });

  it("returns a network failure when fetch rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    const result = await submitContactForm(payload);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("network");
  });

  it("returns an aborted failure when the caller's signal is already aborted", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => {
        const err = new DOMException("Aborted", "AbortError");
        return Promise.reject(err);
      }),
    );

    const controller = new AbortController();
    controller.abort();
    const result = await submitContactForm(payload, { signal: controller.signal });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("aborted");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- services/contact`
Expected: FAIL — `Cannot find module './contact'`.

- [ ] **Step 3: Create `services/contact.ts`**

```ts
// Contact form API client. Owns the fetch, the request timeout, and the
// mapping from HTTP status -> typed result. Never called with a raw `fetch`
// from a component — components call `submitContactForm` only.

export interface ContactFormPayload {
  name: string;
  email: string;
  organization: string;
  phone: string;
  region: string;
  inquiryType: string;
  message: string;
}

export interface ContactSubmitSuccess {
  ok: true;
  message: string;
}

export interface ContactSubmitFailure {
  ok: false;
  kind: "validation" | "rate_limited" | "network" | "timeout" | "server" | "aborted";
  message: string;
  fieldErrors?: Partial<Record<keyof ContactFormPayload, string>>;
}

export type ContactSubmitResult = ContactSubmitSuccess | ContactSubmitFailure;

const REQUEST_TIMEOUT_MS = 15_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function messageFrom(data: unknown, fallback: string): string {
  return isRecord(data) && typeof data.message === "string" ? data.message : fallback;
}

export async function submitContactForm(
  payload: ContactFormPayload,
  options?: { signal?: AbortSignal },
): Promise<ContactSubmitResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const onExternalAbort = () => controller.abort();
  options?.signal?.addEventListener("abort", onExternalAbort);

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      // non-JSON response body — fall through to status-based handling
    }

    if (response.ok) {
      return { ok: true, message: messageFrom(data, "Message received.") };
    }
    if (response.status === 429) {
      return { ok: false, kind: "rate_limited", message: messageFrom(data, "Too many requests. Please try again later.") };
    }
    if (response.status === 400) {
      return {
        ok: false,
        kind: "validation",
        message: messageFrom(data, "Please correct the highlighted fields."),
        fieldErrors:
          isRecord(data) && isRecord(data.fieldErrors)
            ? (data.fieldErrors as ContactSubmitFailure["fieldErrors"])
            : undefined,
      };
    }
    return { ok: false, kind: "server", message: messageFrom(data, "Something went wrong. Please try again.") };
  } catch {
    if (options?.signal?.aborted) {
      return { ok: false, kind: "aborted", message: "Submission cancelled." };
    }
    if (controller.signal.aborted) {
      return { ok: false, kind: "timeout", message: "The request timed out. Please try again." };
    }
    return { ok: false, kind: "network", message: "Could not reach the server. Check your connection and try again." };
  } finally {
    clearTimeout(timeoutId);
    options?.signal?.removeEventListener("abort", onExternalAbort);
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- services/contact`
Expected: PASS. Note the last test ("aborted") pre-aborts the caller's own signal before calling `submitContactForm`, so `options.signal.aborted` is already `true` when the `catch` block runs — this is what makes the `"aborted"` branch (rather than `"timeout"`) win.

- [ ] **Step 5: Commit**

```bash
git add services/contact.ts services/contact.test.ts
git commit -m "feat: add typed contact form API client with timeout and abort support"
```

---

### Task 9: Contact form Route Handler (`app/api/contact/route.ts`)

**Files:**
- Create: `app/api/contact/route.ts`
- Test: `app/api/contact/route.test.ts`

**Interfaces:**
- Consumes: `validateContactForm`, `isValid`, `sanitizeText`, `escapeHtml` (Task 2), `rateLimit` (Task 4), `regions`, `inquiryTypes` (Task 1).
- Produces: `POST` handler at `/api/contact` — consumed by `services/contact.ts` (Task 8) from the browser.

- [ ] **Step 1: Write the failing test — `app/api/contact/route.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { POST } from "./route";

const validBody = {
  name: "Anaïs Rao",
  email: "anais@company.com",
  organization: "Acme Pvt Ltd",
  phone: "+919876543210",
  region: "tamil-nadu",
  inquiryType: "general",
  message: "",
};

function makeRequest(body: unknown, ip = "203.0.113.1") {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  it("accepts a fully valid submission", async () => {
    const response = await POST(makeRequest(validBody, "203.0.113.10"));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
  });

  it("rejects an invalid submission with field errors", async () => {
    const response = await POST(makeRequest({ ...validBody, email: "not-an-email" }, "203.0.113.11"));
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(data.fieldErrors.email).toMatch(/valid email/i);
  });

  it("rejects a region outside the known option set even if the field is non-empty", async () => {
    const response = await POST(makeRequest({ ...validBody, region: "mars" }, "203.0.113.12"));
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.fieldErrors.region).toBeTruthy();
  });

  it("rejects non-JSON bodies", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.13" },
      body: "not json",
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("rate limits after repeated requests from the same IP", async () => {
    const ip = "203.0.113.99";
    let lastStatus = 200;
    for (let i = 0; i < 6; i++) {
      const response = await POST(makeRequest(validBody, ip));
      lastStatus = response.status;
    }
    expect(lastStatus).toBe(429);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- app/api/contact`
Expected: FAIL — `Cannot find module './route'`.

- [ ] **Step 3: Create `app/api/contact/route.ts`**

```ts
import { NextResponse } from "next/server";
import { validateContactForm, isValid, sanitizeText, escapeHtml, type ContactFormInput } from "@/lib/validation";
import { regions, inquiryTypes } from "@/content/contact";
import { rateLimit } from "@/lib/rate-limit";

function clientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", message: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_body", message: "Request body must be JSON." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { ok: false, error: "invalid_body", message: "Request body must be JSON." },
      { status: 400 },
    );
  }

  const raw = body as Record<string, unknown>;
  const input: ContactFormInput = {
    name: typeof raw.name === "string" ? raw.name : "",
    email: typeof raw.email === "string" ? raw.email : "",
    organization: typeof raw.organization === "string" ? raw.organization : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    region: typeof raw.region === "string" ? raw.region : "",
    inquiryType: typeof raw.inquiryType === "string" ? raw.inquiryType : "",
    message: typeof raw.message === "string" ? raw.message : "",
  };

  const fieldErrors = validateContactForm(input, {
    regionValues: regions.map((r) => r.value),
    inquiryTypeValues: inquiryTypes.map((t) => t.value),
  });

  if (!isValid(fieldErrors)) {
    return NextResponse.json(
      { ok: false, error: "validation", message: "Please correct the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  const clean = {
    name: escapeHtml(sanitizeText(input.name)),
    email: sanitizeText(input.email),
    organization: escapeHtml(sanitizeText(input.organization)),
    phone: sanitizeText(input.phone),
    region: input.region,
    inquiryType: input.inquiryType,
    message: escapeHtml(sanitizeText(input.message)),
  };

  // No CRM/email integration is configured in this repo. This is the
  // integration boundary: a real deployment forwards `clean` to the sales
  // inbox/CRM here. Logging server-side means submissions are never
  // silently dropped in local development or staging.
  console.info("[contact] new inquiry", { ...clean, ip });

  return NextResponse.json({ ok: true, message: "Message received." }, { status: 200 });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- app/api/contact`
Expected: PASS. Note the rate-limit test uses a dedicated IP (`203.0.113.99`) not reused by any other test in this file, since `lib/rate-limit.ts`'s in-memory `Map` persists across tests in the same process — reusing an IP across tests would make results order-dependent.

- [ ] **Step 5: Commit**

```bash
git add app/api/contact/route.ts app/api/contact/route.test.ts
git commit -m "feat: add contact form Route Handler with server-side validation and rate limiting"
```

---

### Task 10: Contact form types and `FormField`

**Files:**
- Create: `components/sections/contact/types.ts`
- Create: `components/sections/contact/FormField.tsx`
- Test: `components/sections/contact/FormField.test.tsx`

**Interfaces:**
- Produces: `ContactFormValues`, `ContactFormErrors`, `SubmissionState` (`types.ts`, consumed by Tasks 11 and 12); `FormField` component with props `{ id, label, value, onChange, onBlur, type?, required?, autoComplete?, placeholder?, error? }` (consumed by Task 12 for Name/Organization/Email/Contact Number).

- [ ] **Step 1: Create `components/sections/contact/types.ts`**

```ts
export interface ContactFormValues {
  name: string;
  email: string;
  organization: string;
  phone: string;
  region: string;
  inquiryType: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };
```

- [ ] **Step 2: Write the failing test — `components/sections/contact/FormField.test.tsx`**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("associates the label, shows the required marker, and forwards input", () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(
      <FormField
        id="name"
        label="Name"
        required
        value=""
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: "Anaïs" } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith("Anaïs");
    expect(onBlur).toHaveBeenCalled();
  });

  it("renders an accessible error message tied to the input via aria-describedby", () => {
    render(
      <FormField
        id="email"
        label="Email"
        type="email"
        value="bad"
        onChange={() => {}}
        onBlur={() => {}}
        error="Enter a valid email address."
      />,
    );

    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute("aria-invalid", "true");
    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent("Enter a valid email address.");
    expect(input).toHaveAttribute("aria-describedby", errorMessage.id);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test -- FormField`
Expected: FAIL — `Cannot find module './FormField'`.

- [ ] **Step 4: Create `components/sections/contact/FormField.tsx`**

```tsx
"use client";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  type?: "text" | "email" | "tel";
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
}

const fieldBase =
  "w-full rounded-lg border border-line bg-paper px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/70 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/25";

export function FormField({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  required,
  autoComplete,
  placeholder,
  error,
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label} {required && <span className="text-forest">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={fieldBase}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test -- FormField`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/sections/contact/types.ts components/sections/contact/FormField.tsx components/sections/contact/FormField.test.tsx
git commit -m "feat: add contact form types and reusable FormField input"
```

---

### Task 11: `useContactForm` hook

**Files:**
- Create: `components/sections/contact/hooks/useContactForm.ts`
- Test: `components/sections/contact/hooks/useContactForm.test.ts`

**Interfaces:**
- Consumes: `validateContactForm`, `isValid` (Task 2), `regions`, `inquiryTypes` (Task 1), `submitContactForm` (Task 8), `ContactFormValues`/`ContactFormErrors`/`SubmissionState` (Task 10).
- Produces: `useContactForm()` returning `{ values, errors, touched, submission, setField, blurField, submit, retry, isSubmitting }` — consumed by `components/sections/contact/ContactForm.tsx` (Task 12).

- [ ] **Step 1: Write the failing test — `components/sections/contact/hooks/useContactForm.test.ts`**

```ts
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useContactForm } from "./useContactForm";
import * as contactService from "@/services/contact";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(""),
}));

describe("useContactForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with empty values and no touched errors shown", () => {
    const { result } = renderHook(() => useContactForm());
    expect(result.current.values.name).toBe("");
    expect(result.current.submission.status).toBe("idle");
  });

  it("blocks submission and surfaces errors when the form is invalid", async () => {
    const spy = vi.spyOn(contactService, "submitContactForm");
    const { result } = renderHook(() => useContactForm());

    await act(async () => {
      await result.current.submit();
    });

    expect(spy).not.toHaveBeenCalled();
    expect(result.current.errors.name).toBeTruthy();
    expect(result.current.touched.name).toBe(true);
  });

  it("submits valid data and reports success", async () => {
    vi.spyOn(contactService, "submitContactForm").mockResolvedValue({
      ok: true,
      message: "Message received.",
    });
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.setField("name", "Anaïs Rao");
      result.current.setField("email", "anais@company.com");
      result.current.setField("organization", "Acme Pvt Ltd");
      result.current.setField("phone", "+919876543210");
      result.current.setField("region", "tamil-nadu");
      result.current.setField("inquiryType", "general");
    });

    await act(async () => {
      await result.current.submit();
    });

    await waitFor(() => expect(result.current.submission.status).toBe("success"));
    expect(result.current.values.name).toBe(""); // form resets on success
  });

  it("reports an error state and supports retry", async () => {
    const spy = vi
      .spyOn(contactService, "submitContactForm")
      .mockResolvedValueOnce({ ok: false, kind: "server", message: "Something went wrong." })
      .mockResolvedValueOnce({ ok: true, message: "Message received." });

    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.setField("name", "Anaïs Rao");
      result.current.setField("email", "anais@company.com");
      result.current.setField("organization", "Acme Pvt Ltd");
      result.current.setField("phone", "+919876543210");
      result.current.setField("region", "tamil-nadu");
      result.current.setField("inquiryType", "general");
    });

    await act(async () => {
      await result.current.submit();
    });
    await waitFor(() => expect(result.current.submission.status).toBe("error"));

    await act(async () => {
      await result.current.retry();
    });
    await waitFor(() => expect(result.current.submission.status).toBe("success"));

    expect(spy).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- useContactForm`
Expected: FAIL — `Cannot find module './useContactForm'`.

- [ ] **Step 3: Create `components/sections/contact/hooks/useContactForm.ts`**

```ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { validateContactForm, isValid } from "@/lib/validation";
import { regions, inquiryTypes } from "@/content/contact";
import { submitContactForm, type ContactFormPayload } from "@/services/contact";
import type { ContactFormValues, ContactFormErrors, SubmissionState } from "../types";

const EMPTY_VALUES: ContactFormValues = {
  name: "",
  email: "",
  organization: "",
  phone: "",
  region: "",
  inquiryType: "",
  message: "",
};

const REGION_VALUES = regions.map((r) => r.value);
const INQUIRY_VALUES = inquiryTypes.map((t) => t.value);

export function useContactForm() {
  const searchParams = useSearchParams();
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormValues, boolean>>>({});
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);
  const lastPayloadRef = useRef<ContactFormPayload | null>(null);

  useEffect(() => {
    const inquiry = searchParams.get("inquiry");
    const role = searchParams.get("role");
    if (!inquiry && !role) return;
    setValues((current) => ({
      ...current,
      inquiryType: inquiry && INQUIRY_VALUES.includes(inquiry) ? inquiry : current.inquiryType,
      message:
        role && !current.message
          ? `I'm interested in the ${role} role at WnR Group.`
          : current.message,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const setField = useCallback(
    <K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) => {
      setValues((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const blurField = useCallback((field: keyof ContactFormValues) => {
    setTouched((current) => ({ ...current, [field]: true }));
  }, []);

  const runValidation = useCallback(
    (input: ContactFormValues) =>
      validateContactForm(input, { regionValues: REGION_VALUES, inquiryTypeValues: INQUIRY_VALUES }),
    [],
  );

  useEffect(() => {
    setErrors(runValidation(values));
  }, [values, runValidation]);

  const submit = useCallback(
    async (payloadOverride?: ContactFormPayload) => {
      const payload = payloadOverride ?? values;
      const validationErrors = runValidation(payload);
      setErrors(validationErrors);
      setTouched({
        name: true,
        email: true,
        organization: true,
        phone: true,
        region: true,
        inquiryType: true,
        message: true,
      });

      if (!isValid(validationErrors)) {
        return { ok: false as const };
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      lastPayloadRef.current = payload;
      setSubmission({ status: "submitting" });

      const result = await submitContactForm(payload, { signal: controller.signal });

      if (result.ok) {
        setSubmission({ status: "success" });
        setValues(EMPTY_VALUES);
        setTouched({});
        return { ok: true as const, message: result.message };
      }

      if (result.kind === "validation" && result.fieldErrors) {
        setErrors((current) => ({ ...current, ...result.fieldErrors }));
      }
      setSubmission({ status: "error", message: result.message });
      return { ok: false as const, message: result.message };
    },
    [values, runValidation],
  );

  const retry = useCallback(() => {
    return submit(lastPayloadRef.current ?? undefined);
  }, [submit]);

  return {
    values,
    errors,
    touched,
    submission,
    setField,
    blurField,
    submit,
    retry,
    isSubmitting: submission.status === "submitting",
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- useContactForm`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/contact/hooks/useContactForm.ts components/sections/contact/hooks/useContactForm.test.ts
git commit -m "feat: add useContactForm hook (validation, submission lifecycle, retry)"
```

---

### Task 12: `ContactForm` orchestrator

**Files:**
- Create: `components/sections/contact/ContactForm.tsx`
- Test: `components/sections/contact/ContactForm.test.tsx`

**Interfaces:**
- Consumes: `ToastProvider`, `Toaster`, `useToastManager` (Task 6), `Select` (Task 5), `FormField` (Task 10), `useContactForm` (Task 11), `regions`, `inquiryTypes` (Task 1).
- Produces: `ContactForm` component (no props) — consumed by `app/contact/page.tsx` (Task 13).

- [ ] **Step 1: Write the failing test — `components/sections/contact/ContactForm.test.tsx`**

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ContactForm } from "./ContactForm";
import * as contactService from "@/services/contact";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(""),
}));

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name/i), "Anaïs Rao");
  await user.type(screen.getByLabelText(/^organization/i), "Acme Pvt Ltd");
  await user.type(screen.getByLabelText(/^email/i), "anais@company.com");
  await user.type(screen.getByLabelText(/contact number/i), "+919876543210");

  await user.click(screen.getByLabelText(/^region/i));
  await user.click(await screen.findByRole("option", { name: "Tamil Nadu" }));

  await user.click(screen.getByLabelText(/inquiry type/i));
  await user.click(await screen.findByRole("option", { name: "General Inquiry" }));
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows validation errors on submit when required fields are empty", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
  });

  it("submits a valid form and shows a success toast", async () => {
    vi.spyOn(contactService, "submitContactForm").mockResolvedValue({
      ok: true,
      message: "Message received.",
    });
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(screen.getByText("Message sent")).toBeInTheDocument());
  });

  it("shows an error toast with a retry action on failure", async () => {
    vi.spyOn(contactService, "submitContactForm").mockResolvedValue({
      ok: false,
      kind: "server",
      message: "Something went wrong.",
    });
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(screen.getByText(/couldn't send/i)).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- ContactForm`
Expected: FAIL — `Cannot find module './ContactForm'`.

- [ ] **Step 3: Create `components/sections/contact/ContactForm.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { ToastProvider, Toaster, useToastManager } from "@/components/ui/toast";
import { Select } from "@/components/ui/select";
import { FormField } from "./FormField";
import { useContactForm } from "./hooks/useContactForm";
import { regions, inquiryTypes } from "@/content/contact";

export function ContactForm() {
  return (
    <ToastProvider>
      <ContactFormFields />
      <Toaster />
    </ToastProvider>
  );
}

function ContactFormFields() {
  const { values, errors, touched, submission, setField, blurField, submit, retry, isSubmitting } =
    useContactForm();
  const toastManager = useToastManager();
  const lastStatusRef = useRef(submission.status);

  useEffect(() => {
    if (lastStatusRef.current === submission.status) return;
    lastStatusRef.current = submission.status;

    if (submission.status === "success") {
      toastManager.add({
        type: "success",
        title: "Message sent",
        description: "A member of our team will be in touch within one business day.",
      });
    }
    if (submission.status === "error") {
      toastManager.add({
        type: "error",
        title: "Couldn't send your message",
        description: submission.message,
        actionProps: {
          children: "Retry",
          onClick: () => {
            void retry();
          },
        },
      });
    }
  }, [submission, toastManager, retry]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      noValidate
      className="flex flex-col gap-5"
      aria-label="Contact WnR Group"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="name"
          label="Name"
          required
          autoComplete="name"
          placeholder="Your name"
          value={values.name}
          error={touched.name ? errors.name : undefined}
          onChange={(v) => setField("name", v)}
          onBlur={() => blurField("name")}
        />
        <FormField
          id="organization"
          label="Organization"
          required
          autoComplete="organization"
          placeholder="Your company"
          value={values.organization}
          error={touched.organization ? errors.organization : undefined}
          onChange={(v) => setField("organization", v)}
          onBlur={() => blurField("organization")}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={values.email}
          error={touched.email ? errors.email : undefined}
          onChange={(v) => setField("email", v)}
          onBlur={() => blurField("email")}
        />
        <FormField
          id="phone"
          label="Contact Number"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+91 98765 43210"
          value={values.phone}
          error={touched.phone ? errors.phone : undefined}
          onChange={(v) => setField("phone", v)}
          onBlur={() => blurField("phone")}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="region" className="text-sm font-medium text-ink">
            Region <span className="text-forest">*</span>
          </label>
          <Select
            id="region"
            name="region"
            options={regions}
            placeholder="Select a region"
            value={values.region || null}
            onValueChange={(v) => {
              setField("region", v);
              blurField("region");
            }}
            required
            aria-invalid={touched.region ? Boolean(errors.region) : undefined}
            aria-describedby={touched.region && errors.region ? "region-error" : undefined}
          />
          {touched.region && errors.region && (
            <p id="region-error" role="alert" className="text-xs text-destructive">
              {errors.region}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="inquiryType" className="text-sm font-medium text-ink">
            Inquiry Type <span className="text-forest">*</span>
          </label>
          <Select
            id="inquiryType"
            name="inquiryType"
            options={inquiryTypes}
            placeholder="Select an inquiry type"
            value={values.inquiryType || null}
            onValueChange={(v) => {
              setField("inquiryType", v);
              blurField("inquiryType");
            }}
            required
            aria-invalid={touched.inquiryType ? Boolean(errors.inquiryType) : undefined}
            aria-describedby={touched.inquiryType && errors.inquiryType ? "inquiryType-error" : undefined}
          />
          {touched.inquiryType && errors.inquiryType && (
            <p id="inquiryType-error" role="alert" className="text-xs text-destructive">
              {errors.inquiryType}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us about your operations and what you're trying to fix..."
          value={values.message}
          onChange={(e) => setField("message", e.target.value)}
          onBlur={() => blurField("message")}
          aria-invalid={touched.message ? Boolean(errors.message) : undefined}
          aria-describedby={touched.message && errors.message ? "message-error" : undefined}
          className="w-full resize-none rounded-lg border border-line bg-paper px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/70 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/25"
        />
        {touched.message && errors.message && (
          <p id="message-error" role="alert" className="text-xs text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(18,71,52,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- ContactForm`
Expected: PASS. If `screen.getByLabelText(/^region/i)` can't find the Select trigger, confirm `components/ui/select.tsx`'s `id` prop lands on `SelectPrimitive.Trigger` (Task 5, Step 3) — the `<label htmlFor="region">` in this file must match that same element for the query to resolve.

- [ ] **Step 5: Commit**

```bash
git add components/sections/contact/ContactForm.tsx components/sections/contact/ContactForm.test.tsx
git commit -m "feat: add ContactForm orchestrator wiring fields, select, and toasts"
```

---

### Task 13: Wire `ContactForm` into `/contact`, delete `LeadForm`

**Files:**
- Modify: `app/contact/page.tsx`
- Delete: `components/ui/LeadForm.tsx`

**Interfaces:**
- Consumes: `ContactForm` (Task 12).
- Produces: no new exports — this task only rewires the page.

- [ ] **Step 1: Replace the full content of `app/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { MapPin, Building2, MessageCircle } from "lucide-react";
import { Eyebrow } from "@/components/ui/Section";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Contact — Let's Talk About Your Operations",
  description:
    "Tell us about your business. We'll tell you how we can help. WnR Group — Tamil Nadu → India → Europe.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Let's Talk About Your Operations",
    description: "Tell us about your business. We'll tell you how we can help.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Let's Talk About Your Operations",
    description: "Tell us about your business. We'll tell you how we can help.",
  },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact WnR Group",
  url: "https://wnrgroup.com/contact",
  about: {
    "@type": "Organization",
    name: company.name,
    areaServed: company.geography,
  },
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-canvas pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <div
        className="grid-blueprint pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-[1200px] gap-12 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Info */}
        <div className="flex flex-col gap-8">
          <div>
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-5 font-display text-[length:var(--text-hero)] font-bold leading-[1.05] text-ink">
              Let&rsquo;s talk about your <span className="text-forest">operations.</span>
            </h1>
            <p className="mt-6 max-w-md text-[length:var(--text-lead)] leading-relaxed text-body">
              Whether you&rsquo;re streamlining operations, building a custom
              platform, or adopting an industry operating system — WnR is ready.
            </p>
          </div>

          <dl className="flex flex-col gap-5 border-t border-line pt-8">
            <Detail icon={<MapPin size={18} />} label="Headquarters" value={company.hq} />
            <Detail icon={<Building2 size={18} />} label="Category" value={company.category} />
            <Detail icon={<MessageCircle size={18} />} label="Reach" value={company.geography} />
          </dl>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-line bg-paper p-7 shadow-card md:p-9">
          <Suspense fallback={<ContactFormSkeleton />}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-wash text-forest">
        {icon}
      </span>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
          {label}
        </dt>
        <dd className="mt-0.5 text-[0.95rem] text-ink">{value}</dd>
      </div>
    </div>
  );
}

function ContactFormSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-5" aria-hidden="true">
      <div className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-3.5 w-20 rounded bg-mist" />
            <div className="h-11 rounded-lg bg-mist" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-3.5 w-20 rounded bg-mist" />
        <div className="h-24 rounded-lg bg-mist" />
      </div>
      <div className="h-12 w-40 rounded-full bg-mist" />
    </div>
  );
}
```

`useContactForm` (Task 11) calls `useSearchParams()` from `next/navigation`, which requires a `Suspense` boundary around any client component that reaches it, or Next.js will fail the production build with "should be wrapped in a suspense boundary" — that's why `<ContactForm />` above is wrapped in `<Suspense fallback={<ContactFormSkeleton />}>` rather than rendered directly. The skeleton mirrors the real form's rough layout (6 field-shaped blocks + one taller message block + one button) so there is no layout shift when the real form replaces it.

- [ ] **Step 2: Delete the superseded `components/ui/LeadForm.tsx`**

Run: `git rm components/ui/LeadForm.tsx`
Expected: file removed — its only prior usage (`app/contact/page.tsx`'s `<LeadForm />`) was replaced in Step 1.

- [ ] **Step 3: Confirm nothing else imports `LeadForm`**

Run: `grep -rn "LeadForm" --include="*.tsx" --include="*.ts" .` (excluding `node_modules`, `.next`)
Expected: no matches.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Run the full test suite**

Run: `npm run test`
Expected: all tests from Tasks 2–12 pass; no test references the deleted `LeadForm`.

- [ ] **Step 6: Commit**

```bash
git add app/contact/page.tsx
git rm components/ui/LeadForm.tsx
git commit -m "feat: wire ContactForm into the Let's Talk page, remove superseded LeadForm"
```

---

### Task 14: Resume upload API client (`services/careers.ts`)

**Files:**
- Create: `services/careers.ts`
- Test: `services/careers.test.ts`

**Interfaces:**
- Consumes: nothing beyond the global `XMLHttpRequest` (faked in tests) — `XMLHttpRequest` (not `fetch`) is used deliberately because it is the only widely-supported browser API that exposes upload progress events.
- Produces: `ResumeUploadResult` (`ResumeUploadSuccess | ResumeUploadFailure`), `UploadResumeOptions`, `uploadResume(file, options?)` — consumed by `components/sections/careers/ResumeUpload.tsx` (Task 18).

- [ ] **Step 1: Write the failing test — `services/careers.test.ts`**

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadResume } from "./careers";

class FakeXhr {
  static instances: FakeXhr[] = [];
  upload = { addEventListener: vi.fn((event: string, handler: (e: unknown) => void) => {
    this.uploadHandlers[event] = handler;
  }) };
  uploadHandlers: Record<string, (e: unknown) => void> = {};
  handlers: Record<string, () => void> = {};
  status = 0;
  responseText = "";
  timeout = 0;
  addEventListener = vi.fn((event: string, handler: () => void) => {
    this.handlers[event] = handler;
  });
  open = vi.fn();
  send = vi.fn();
  abort = vi.fn(() => this.handlers.abort?.());

  constructor() {
    FakeXhr.instances.push(this);
  }

  respond(status: number, body: unknown) {
    this.status = status;
    this.responseText = JSON.stringify(body);
    this.handlers.load?.();
  }

  progress(loaded: number, total: number) {
    this.uploadHandlers.progress?.({ lengthComputable: true, loaded, total });
  }
}

function makeFile(name = "resume.pdf", size = 1000, type = "application/pdf"): File {
  return new File([new Uint8Array(size)], name, { type });
}

describe("uploadResume", () => {
  afterEach(() => {
    FakeXhr.instances = [];
    vi.unstubAllGlobals();
  });

  it("resolves ok on a 2xx response and reports progress", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);
    const onProgress = vi.fn();

    const promise = uploadResume(makeFile(), { onProgress });
    const xhr = FakeXhr.instances[0];
    xhr.progress(50, 100);
    xhr.respond(200, { ok: true, message: "Resume received." });

    const result = await promise;
    expect(result).toEqual({ ok: true, message: "Resume received." });
    expect(onProgress).toHaveBeenCalledWith(50);
  });

  it("resolves a validation failure on a 400 response", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);

    const promise = uploadResume(makeFile());
    FakeXhr.instances[0].respond(400, { ok: false, message: "That file could not be accepted." });

    const result = await promise;
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("validation");
  });

  it("resolves a rate_limited failure on a 429 response", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);

    const promise = uploadResume(makeFile());
    FakeXhr.instances[0].respond(429, { ok: false, message: "Too many uploads." });

    const result = await promise;
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("rate_limited");
  });

  it("resolves a network failure on an error event", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);

    const promise = uploadResume(makeFile());
    FakeXhr.instances[0].handlers.error?.();

    const result = await promise;
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("network");
  });

  it("aborts the underlying request when the caller's signal aborts", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);
    const controller = new AbortController();

    const promise = uploadResume(makeFile(), { signal: controller.signal });
    controller.abort();

    const result = await promise;
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("aborted");
    expect(FakeXhr.instances[0].abort).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- services/careers`
Expected: FAIL — `Cannot find module './careers'`.

- [ ] **Step 3: Create `services/careers.ts`**

```ts
// Resume upload API client. Uses XMLHttpRequest (not fetch) deliberately:
// it's the only broadly-supported browser API that exposes upload progress
// events, and the spec requires a visible upload progress indicator.

export interface ResumeUploadSuccess {
  ok: true;
  message: string;
}

export interface ResumeUploadFailure {
  ok: false;
  kind: "validation" | "rate_limited" | "network" | "timeout" | "server" | "aborted";
  message: string;
}

export type ResumeUploadResult = ResumeUploadSuccess | ResumeUploadFailure;

export interface UploadResumeOptions {
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

const UPLOAD_TIMEOUT_MS = 30_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseMessage(responseText: string): string | undefined {
  try {
    const data: unknown = JSON.parse(responseText);
    return isRecord(data) && typeof data.message === "string" ? data.message : undefined;
  } catch {
    return undefined;
  }
}

export function uploadResume(file: File, options: UploadResumeOptions = {}): Promise<ResumeUploadResult> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("resume", file);

    let settled = false;
    const finish = (result: ResumeUploadResult) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    xhr.upload.addEventListener("progress", (event) => {
      const progressEvent = event as ProgressEvent;
      if (progressEvent.lengthComputable && options.onProgress) {
        options.onProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
      }
    });

    xhr.addEventListener("timeout", () =>
      finish({ ok: false, kind: "timeout", message: "The upload timed out. Please try again." }),
    );
    xhr.addEventListener("error", () =>
      finish({
        ok: false,
        kind: "network",
        message: "Could not reach the server. Check your connection and try again.",
      }),
    );
    xhr.addEventListener("abort", () =>
      finish({ ok: false, kind: "aborted", message: "Upload cancelled." }),
    );

    xhr.addEventListener("load", () => {
      const message = parseMessage(xhr.responseText);

      if (xhr.status >= 200 && xhr.status < 300) {
        finish({ ok: true, message: message ?? "Resume received." });
        return;
      }
      if (xhr.status === 429) {
        finish({ ok: false, kind: "rate_limited", message: message ?? "Too many uploads. Please try again later." });
        return;
      }
      if (xhr.status === 400) {
        finish({ ok: false, kind: "validation", message: message ?? "That file couldn't be accepted." });
        return;
      }
      finish({ ok: false, kind: "server", message: message ?? "Something went wrong. Please try again." });
    });

    if (options.signal) {
      if (options.signal.aborted) {
        xhr.abort();
      } else {
        options.signal.addEventListener("abort", () => xhr.abort());
      }
    }

    xhr.timeout = UPLOAD_TIMEOUT_MS;
    xhr.open("POST", "/api/careers/resume");
    xhr.send(formData);
  });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- services/careers`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add services/careers.ts services/careers.test.ts
git commit -m "feat: add resume upload API client with progress and abort support"
```

---

### Task 15: Resume upload Route Handler (`app/api/careers/resume/route.ts`)

**Files:**
- Create: `app/api/careers/resume/route.ts`
- Test: `app/api/careers/resume/route.test.ts`

**Interfaces:**
- Consumes: `validateFileMeta`, `validateFileSignature`, `getExtension` (Task 3), `resumeConfig` (Task 1), `rateLimit` (Task 4).
- Produces: `POST` handler at `/api/careers/resume` — consumed by `services/careers.ts` (Task 14).

- [ ] **Step 1: Write the failing test — `app/api/careers/resume/route.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { POST } from "./route";

const PDF_BYTES = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 0x0a, 0x25]);
const EXE_BYTES = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);

function makeRequest(file: File, ip = "203.0.113.1"): Request {
  const formData = new FormData();
  formData.append("resume", file);
  return new Request("http://localhost/api/careers/resume", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: formData,
  });
}

describe("POST /api/careers/resume", () => {
  it("accepts a well-formed PDF", async () => {
    const file = new File([PDF_BYTES], "resume.pdf", { type: "application/pdf" });
    const response = await POST(makeRequest(file, "203.0.113.20"));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
  });

  it("rejects a missing file", async () => {
    const request = new Request("http://localhost/api/careers/resume", {
      method: "POST",
      headers: { "x-forwarded-for": "203.0.113.21" },
      body: new FormData(),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("rejects a file over the size limit", async () => {
    const big = new Uint8Array(4 * 1024 * 1024 + 1);
    big.set(PDF_BYTES);
    const file = new File([big], "resume.pdf", { type: "application/pdf" });
    const response = await POST(makeRequest(file, "203.0.113.22"));
    expect(response.status).toBe(400);
  });

  it("rejects a renamed executable even with a .pdf extension and matching claimed type", async () => {
    const file = new File([EXE_BYTES], "resume.pdf", { type: "application/pdf" });
    const response = await POST(makeRequest(file, "203.0.113.23"));
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toMatch(/executable/i);
  });

  it("rejects an unsupported extension", async () => {
    const file = new File([PDF_BYTES], "resume.exe", { type: "" });
    const response = await POST(makeRequest(file, "203.0.113.24"));
    expect(response.status).toBe(400);
  });

  it("rate limits after repeated uploads from the same IP", async () => {
    const ip = "203.0.113.98";
    let lastStatus = 200;
    for (let i = 0; i < 6; i++) {
      const file = new File([PDF_BYTES], "resume.pdf", { type: "application/pdf" });
      const response = await POST(makeRequest(file, ip));
      lastStatus = response.status;
    }
    expect(lastStatus).toBe(429);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- app/api/careers/resume`
Expected: FAIL — `Cannot find module './route'`.

- [ ] **Step 3: Create `app/api/careers/resume/route.ts`**

```ts
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { validateFileMeta, validateFileSignature, getExtension } from "@/lib/file-validation";
import { resumeConfig } from "@/content/careers";
import { rateLimit } from "@/lib/rate-limit";

function clientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`resume:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", message: "Too many uploads. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_body", message: "Expected multipart form data." },
      { status: 400 },
    );
  }

  const file = formData.get("resume");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "missing_file", message: "No file was uploaded." },
      { status: 400 },
    );
  }

  const metaError = validateFileMeta({ name: file.name, size: file.size, type: file.type }, resumeConfig);
  if (metaError) {
    return NextResponse.json({ ok: false, error: "invalid_file", message: metaError }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const extension = getExtension(file.name);
  const signatureError = validateFileSignature(bytes, extension);
  if (signatureError) {
    return NextResponse.json({ ok: false, error: "invalid_file", message: signatureError }, { status: 400 });
  }

  // No persistent object storage (S3/GCS) or ATS integration is configured
  // in this repo. Accepted resumes are written to the server's temp
  // directory so the full upload pipeline runs end to end today; swap this
  // block for durable storage or an ATS handoff at deploy time — every
  // check above it (rate limit, size, extension, magic-byte signature)
  // stays the same.
  const uploadDir = path.join(tmpdir(), "wnr-resumes");
  await mkdir(uploadDir, { recursive: true });
  const storedName = `${randomUUID()}${extension}`;
  await writeFile(path.join(uploadDir, storedName), bytes);

  console.info("[careers] resume received", { originalName: file.name, size: file.size, ip });

  return NextResponse.json(
    { ok: true, message: "Resume received. We'll be in touch if there's a fit." },
    { status: 200 },
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- app/api/careers/resume`
Expected: PASS. Uses a distinct IP per test and a dedicated `203.0.113.98` for the rate-limit test, for the same reason as Task 9 (the in-memory limiter's `Map` persists across tests in one process).

- [ ] **Step 5: Commit**

```bash
git add app/api/careers/resume/route.ts app/api/careers/resume/route.test.ts
git commit -m "feat: add resume upload Route Handler with signature validation and rate limiting"
```

---

### Task 16: Careers types and `JobCard`

**Files:**
- Create: `components/sections/careers/types.ts`
- Create: `components/sections/careers/JobCard.tsx`
- Test: `components/sections/careers/JobCard.test.tsx`

**Interfaces:**
- Produces: `Job` (re-exported from `content/careers.ts`), `JobCardProps`, `JobListProps` (`types.ts`); `JobCard` component with props `{ job: Job }` — consumed by `components/sections/careers/JobList.tsx` (Task 17).

- [ ] **Step 1: Create `components/sections/careers/types.ts`**

```ts
import type { Job } from "@/content/careers";

export type { Job };

export interface JobCardProps {
  job: Job;
}

export interface JobListProps {
  jobs: Job[];
}
```

- [ ] **Step 2: Write the failing test — `components/sections/careers/JobCard.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JobCard } from "./JobCard";
import type { Job } from "./types";

const job: Job = {
  id: "senior-fullstack-engineer",
  title: "Senior Full-Stack Engineer",
  department: "WnR Systems",
  location: "Tamil Nadu / Remote",
  employmentType: "Full-time",
  experience: "4-7 years",
  description: "Own features end-to-end across our client platforms.",
};

describe("JobCard", () => {
  it("renders every required field", () => {
    render(<JobCard job={job} />);
    expect(screen.getByText("Senior Full-Stack Engineer")).toBeInTheDocument();
    expect(screen.getByText("WnR Systems")).toBeInTheDocument();
    expect(screen.getByText("Tamil Nadu / Remote")).toBeInTheDocument();
    expect(screen.getByText("Full-time")).toBeInTheDocument();
    expect(screen.getByText("4-7 years")).toBeInTheDocument();
    expect(screen.getByText(/own features end-to-end/i)).toBeInTheDocument();
  });

  it("links Apply to the contact page with a careers inquiry and the role name", () => {
    render(<JobCard job={job} />);
    const applyLink = screen.getByRole("link", { name: /apply for senior full-stack engineer/i });
    expect(applyLink).toHaveAttribute(
      "href",
      "/contact?inquiry=careers&role=Senior%20Full-Stack%20Engineer",
    );
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test -- JobCard`
Expected: FAIL — `Cannot find module './JobCard'`.

- [ ] **Step 4: Create `components/sections/careers/JobCard.tsx`**

```tsx
import { ArrowRight, MapPin, Briefcase, Clock } from "lucide-react";
import { Cta } from "@/components/ui/Cta";
import type { JobCardProps } from "./types";

export function JobCard({ job }: JobCardProps) {
  const applyHref = `/contact?inquiry=careers&role=${encodeURIComponent(job.title)}`;

  return (
    <article className="flex h-full flex-col gap-5 rounded-2xl border border-line bg-paper p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-card">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">{job.title}</h3>
        <p className="mt-1 text-sm text-muted">{job.department}</p>
      </div>

      <dl className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <MapPin size={13} aria-hidden="true" />
          <dt className="sr-only">Location</dt>
          <dd>{job.location}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase size={13} aria-hidden="true" />
          <dt className="sr-only">Employment type</dt>
          <dd>{job.employmentType}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={13} aria-hidden="true" />
          <dt className="sr-only">Experience</dt>
          <dd>{job.experience}</dd>
        </div>
      </dl>

      <p className="line-clamp-3 flex-1 text-[0.9rem] leading-relaxed text-body">{job.description}</p>

      <Cta href={applyHref} variant="ghost" className="w-fit" aria-label={`Apply for ${job.title}`}>
        Apply
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </Cta>
    </article>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test -- JobCard`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/sections/careers/types.ts components/sections/careers/JobCard.tsx components/sections/careers/JobCard.test.tsx
git commit -m "feat: add careers types and data-driven JobCard"
```

---

### Task 17: `ResumeUpload` (drag-and-drop + browse + progress)

**Files:**
- Create: `components/sections/careers/ResumeUpload.tsx`
- Test: `components/sections/careers/ResumeUpload.test.tsx`

**Interfaces:**
- Consumes: `validateFileMeta`, `getExtension` (Task 3), `resumeConfig` (Task 1), `uploadResume` (Task 14).
- Produces: `ResumeUpload` component (no props) — consumed by `components/sections/careers/ResumeDialog.tsx` (Task 18).

- [ ] **Step 1: Write the failing test — `components/sections/careers/ResumeUpload.test.tsx`**

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ResumeUpload } from "./ResumeUpload";
import * as careersService from "@/services/careers";

function makeFile(name: string, size: number, type: string) {
  const file = new File([new Uint8Array(size)], name, { type });
  return file;
}

describe("ResumeUpload", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a client-side validation error for a rejected extension without calling the service", async () => {
    const spy = vi.spyOn(careersService, "uploadResume");
    const user = userEvent.setup();
    render(<ResumeUpload />);

    const input = screen.getByLabelText(/browse for a resume file/i);
    await user.upload(input, makeFile("resume.exe", 1000, ""));

    expect(await screen.findByRole("alert")).toHaveTextContent(/pdf, doc, and docx/i);
    expect(spy).not.toHaveBeenCalled();
  });

  it("uploads a valid file, shows progress, and then a success panel", async () => {
    vi.spyOn(careersService, "uploadResume").mockImplementation(async (_file, options) => {
      options?.onProgress?.(40);
      options?.onProgress?.(100);
      return { ok: true, message: "Resume received." };
    });
    const user = userEvent.setup();
    render(<ResumeUpload />);

    const input = screen.getByLabelText(/browse for a resume file/i);
    await user.upload(input, makeFile("resume.pdf", 1000, "application/pdf"));

    expect(screen.getByText("resume.pdf")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /upload resume/i }));

    await waitFor(() => expect(screen.getByText(/resume received/i)).toBeInTheDocument());
  });

  it("shows a server-reported error and lets the user remove the file", async () => {
    vi.spyOn(careersService, "uploadResume").mockResolvedValue({
      ok: false,
      kind: "server",
      message: "Something went wrong. Please try again.",
    });
    const user = userEvent.setup();
    render(<ResumeUpload />);

    const input = screen.getByLabelText(/browse for a resume file/i);
    await user.upload(input, makeFile("resume.pdf", 1000, "application/pdf"));
    await user.click(screen.getByRole("button", { name: /upload resume/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- ResumeUpload`
Expected: FAIL — `Cannot find module './ResumeUpload'`.

- [ ] **Step 3: Create `components/sections/careers/ResumeUpload.tsx`**

```tsx
"use client";

import { useCallback, useId, useRef, useState } from "react";
import { UploadCloud, FileText, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateFileMeta } from "@/lib/file-validation";
import { resumeConfig } from "@/content/careers";
import { uploadResume } from "@/services/careers";

type UploadState =
  | { status: "idle" }
  | { status: "selected"; file: File }
  | { status: "uploading"; file: File; progress: number }
  | { status: "success"; message: string }
  | { status: "error"; message: string; file?: File };

function fileOf(state: UploadState): File | undefined {
  switch (state.status) {
    case "selected":
    case "uploading":
      return state.file;
    case "error":
      return state.file;
    default:
      return undefined;
  }
}

export function ResumeUpload() {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const errorId = useId();

  const acceptAttr = resumeConfig.acceptedExtensions.join(",");

  const selectFile = useCallback((file: File) => {
    const error = validateFileMeta({ name: file.name, size: file.size, type: file.type }, resumeConfig);
    if (error) {
      setState({ status: "error", message: error });
      return;
    }
    setState({ status: "selected", file });
  }, []);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) selectFile(file);
    event.target.value = "";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) selectFile(file);
  };

  const submit = async () => {
    if (state.status !== "selected") return;
    const file = state.file;
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "uploading", file, progress: 0 });

    const result = await uploadResume(file, {
      signal: controller.signal,
      onProgress: (percent) => {
        setState((current) => (current.status === "uploading" ? { ...current, progress: percent } : current));
      },
    });

    if (result.ok) {
      setState({ status: "success", message: result.message });
    } else {
      setState({ status: "error", message: result.message, file });
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setState({ status: "idle" });
  };

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-forest/20 bg-forest-wash p-8 text-center">
        <CheckCircle2 className="text-forest" size={32} aria-hidden="true" />
        <p className="font-display text-lg font-semibold text-ink">Resume received</p>
        <p className="text-sm text-body">{state.message}</p>
      </div>
    );
  }

  const file = fileOf(state);

  return (
    <div className="flex flex-col gap-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        aria-describedby={state.status === "error" ? errorId : undefined}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2",
          dragActive ? "border-forest bg-forest-wash" : "border-line-strong bg-mist",
        )}
      >
        <UploadCloud className="text-forest" size={28} aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-ink">
            Drag and drop your resume, or{" "}
            <span className="text-forest underline underline-offset-2">browse</span>
          </p>
          <p className="mt-1 text-xs text-muted">PDF, DOC, or DOCX — up to 4MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          onChange={onInputChange}
          className="sr-only"
          aria-label="Browse for a resume file"
        />
      </div>

      {file && (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3">
          <FileText size={18} className="shrink-0 text-forest" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-sm text-ink">{file.name}</span>
          {state.status === "uploading" ? (
            <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-muted">
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              {state.progress}%
            </span>
          ) : (
            <button
              type="button"
              onClick={reset}
              aria-label="Remove selected file"
              className="shrink-0 text-muted transition-colors hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {state.status === "error" && (
        <p id={errorId} role="alert" className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle size={15} className="shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={state.status !== "selected"}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(18,71,52,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
      >
        {state.status === "uploading" ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- ResumeUpload`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/careers/ResumeUpload.tsx components/sections/careers/ResumeUpload.test.tsx
git commit -m "feat: add ResumeUpload with drag-and-drop, validation, and progress"
```

---

### Task 18: `ResumeDialog`

**Files:**
- Create: `components/sections/careers/ResumeDialog.tsx`
- Test: `components/sections/careers/ResumeDialog.test.tsx`

**Interfaces:**
- Consumes: `Dialog`, `DialogTrigger`, `DialogContent` (Task 7), `ResumeUpload` (Task 17).
- Produces: `ResumeDialog` component with props `{ triggerLabel: string }` — consumed by `components/sections/careers/JobList.tsx` (Task 19).

- [ ] **Step 1: Write the failing test — `components/sections/careers/ResumeDialog.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ResumeDialog } from "./ResumeDialog";

describe("ResumeDialog", () => {
  it("opens the resume upload form from the trigger button", async () => {
    const user = userEvent.setup();
    render(<ResumeDialog triggerLabel="Submit Resume" />);

    expect(screen.queryByText(/drag and drop your resume/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Submit Resume" }));

    expect(await screen.findByText(/drag and drop your resume/i)).toBeInTheDocument();
    expect(screen.getByText("Submit your resume")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- ResumeDialog`
Expected: FAIL — `Cannot find module './ResumeDialog'`.

- [ ] **Step 3: Create `components/sections/careers/ResumeDialog.tsx`**

```tsx
"use client";

import { useState } from "react";
import { FileUp } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ResumeUpload } from "./ResumeUpload";

export function ResumeDialog({ triggerLabel }: { triggerLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="group inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:border-forest hover:bg-forest-wash/60 hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2">
        <FileUp size={16} />
        {triggerLabel}
      </DialogTrigger>
      <DialogContent
        title="Submit your resume"
        description="Tell us where you'd fit. We review every resume against upcoming roles."
      >
        <ResumeUpload key={open ? "open" : "closed"} />
      </DialogContent>
    </Dialog>
  );
}
```

The `key={open ? "open" : "closed"}` on `ResumeUpload` remounts it fresh each time the dialog opens, resetting any leftover upload state from a previous open/close cycle without a separate reset effect.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- ResumeDialog`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/careers/ResumeDialog.tsx components/sections/careers/ResumeDialog.test.tsx
git commit -m "feat: add ResumeDialog hosting resume upload in an accessible modal"
```

---

### Task 19: `JobList` (grid + empty-state fallback)

**Files:**
- Create: `components/sections/careers/JobList.tsx`
- Test: `components/sections/careers/JobList.test.tsx`

**Interfaces:**
- Consumes: `JobCard` (Task 16), `ResumeDialog` (Task 18), `noOpeningsCopy` (Task 1).
- Produces: `JobList` component with props `{ jobs: Job[] }` — consumed by `app/careers/page.tsx` (Task 21).

- [ ] **Step 1: Write the failing test — `components/sections/careers/JobList.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JobList } from "./JobList";
import type { Job } from "./types";

const jobs: Job[] = [
  {
    id: "senior-fullstack-engineer",
    title: "Senior Full-Stack Engineer",
    department: "WnR Systems",
    location: "Tamil Nadu / Remote",
    employmentType: "Full-time",
    experience: "4-7 years",
    description: "Own features end-to-end.",
  },
  {
    id: "operations-consultant",
    title: "Operations Consultant",
    department: "WnR Consulting",
    location: "Tamil Nadu",
    employmentType: "Full-time",
    experience: "3-5 years",
    description: "Map client workflows on-site.",
  },
];

describe("JobList", () => {
  it("renders a card per job plus a secondary submit-resume prompt", () => {
    render(<JobList jobs={jobs} />);
    expect(screen.getByText("Senior Full-Stack Engineer")).toBeInTheDocument();
    expect(screen.getByText("Operations Consultant")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: /open roles/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit Resume" })).toBeInTheDocument();
  });

  it("renders the no-openings fallback with a Submit Resume CTA when there are no jobs", () => {
    render(<JobList jobs={[]} />);
    expect(screen.getByText("No current openings.")).toBeInTheDocument();
    expect(screen.getByText(/always looking for exceptional talent/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit Resume" })).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- JobList`
Expected: FAIL — `Cannot find module './JobList'`.

- [ ] **Step 3: Create `components/sections/careers/JobList.tsx`**

```tsx
import { JobCard } from "./JobCard";
import { ResumeDialog } from "./ResumeDialog";
import { noOpeningsCopy } from "@/content/careers";
import type { JobListProps } from "./types";

export function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-line-strong bg-mist px-6 py-16 text-center">
        <div>
          <p className="font-display text-xl font-semibold text-ink">{noOpeningsCopy.heading}</p>
          <p className="mt-2 text-[0.95rem] text-body">{noOpeningsCopy.body}</p>
        </div>
        <ResumeDialog triggerLabel={noOpeningsCopy.ctaLabel} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div role="list" aria-label="Open roles" className="grid gap-5 sm:grid-cols-2">
        {jobs.map((job) => (
          <div role="listitem" key={job.id}>
            <JobCard job={job} />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-3 border-t border-line pt-8 text-center">
        <p className="text-sm text-muted">
          Don&rsquo;t see your role? We&rsquo;re always looking for exceptional talent.
        </p>
        <ResumeDialog triggerLabel="Submit Resume" />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- JobList`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/careers/JobList.tsx components/sections/careers/JobList.test.tsx
git commit -m "feat: add JobList with data-driven grid and no-openings fallback"
```

---

### Task 20: Presentational Careers sections (`WhyWorkWithUs`, `Benefits`, `Culture`, `HiringProcess`)

**Files:**
- Create: `components/sections/careers/WhyWorkWithUs.tsx`
- Create: `components/sections/careers/Benefits.tsx`
- Create: `components/sections/careers/Culture.tsx`
- Create: `components/sections/careers/HiringProcess.tsx`

**Interfaces:**
- Consumes: `Section`, `Eyebrow` (`components/ui/Section.tsx`), `whyWorkWithUs`, `benefits`, `hiringProcess` (Task 1), `culture` (existing `content/sections.ts`, unmodified).
- Produces: four no-prop section components, all consumed by `app/careers/page.tsx` (Task 21). These are presentational-only (pure data → markup, no state, no interaction) — following this repo's existing precedent (`components/sections/products/ProductContent.tsx` and `ProductActions.tsx` also have no dedicated unit test), they are not unit tested individually; their rendering is covered by `app/careers/page.tsx` compiling and the manual QA pass in Task 22.

- [ ] **Step 1: Create `components/sections/careers/WhyWorkWithUs.tsx`**

```tsx
import { Rocket, Target, Users2 } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { whyWorkWithUs } from "@/content/careers";

const icons: Record<string, React.ElementType> = {
  growth: Rocket,
  impact: Target,
  team: Users2,
};

export function WhyWorkWithUs() {
  return (
    <Section id="why-work-with-us" tone="canvas">
      <div className="max-w-2xl">
        <Eyebrow>{whyWorkWithUs.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
          {whyWorkWithUs.heading}
        </h2>
        <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-body">
          {whyWorkWithUs.intro}
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {whyWorkWithUs.reasons.map((reason) => {
          const Icon = icons[reason.icon];
          return (
            <article
              key={reason.title}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-8"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-forest-wash text-forest">
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">{reason.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-body">{reason.body}</p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Create `components/sections/careers/Benefits.tsx`**

```tsx
import { HeartPulse, Clock4, GraduationCap, Wallet, Laptop, PartyPopper } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { benefits } from "@/content/careers";

const icons: Record<string, React.ElementType> = {
  health: HeartPulse,
  flexibility: Clock4,
  growth: GraduationCap,
  compensation: Wallet,
  tools: Laptop,
  culture: PartyPopper,
};

export function Benefits() {
  return (
    <Section id="benefits" tone="wash">
      <div className="max-w-2xl">
        <Eyebrow>{benefits.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
          {benefits.heading}
        </h2>
      </div>

      <dl className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.items.map((benefit) => {
          const Icon = icons[benefit.icon];
          return (
            <div key={benefit.title} className="flex flex-col gap-3">
              <dt className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-white">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span className="font-display text-base font-semibold text-ink">{benefit.title}</span>
              </dt>
              <dd className="text-[0.9rem] leading-relaxed text-body">{benefit.body}</dd>
            </div>
          );
        })}
      </dl>
    </Section>
  );
}
```

- [ ] **Step 3: Create `components/sections/careers/Culture.tsx`**

```tsx
import { Section, Eyebrow } from "@/components/ui/Section";
import { culture } from "@/content/sections";

export function Culture() {
  return (
    <Section id="culture" tone="canvas">
      <Eyebrow>Culture</Eyebrow>
      <h2 className="mt-5 max-w-2xl font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
        Philosophy over personalities.
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {culture.pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-8"
          >
            <span className="h-1 w-10 rounded-full bg-forest" aria-hidden="true" />
            <h3 className="font-display text-xl font-semibold text-ink">{pillar.title}</h3>
            <p className="text-[0.95rem] leading-relaxed text-body">{pillar.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Create `components/sections/careers/HiringProcess.tsx`**

```tsx
import { Section, Eyebrow } from "@/components/ui/Section";
import { hiringProcess } from "@/content/careers";

export function HiringProcess() {
  return (
    <Section id="hiring-process" tone="mist">
      <div className="max-w-2xl">
        <Eyebrow>{hiringProcess.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
          {hiringProcess.heading}
        </h2>
        <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-body">
          {hiringProcess.intro}
        </p>
      </div>

      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {hiringProcess.steps.map((step) => (
          <li key={step.num} className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-7">
            <span
              className="font-display text-3xl font-bold tabular-nums text-forest/25"
              aria-hidden="true"
            >
              {step.num}
            </span>
            <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
            <p className="text-[0.9rem] leading-relaxed text-body">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/sections/careers/WhyWorkWithUs.tsx components/sections/careers/Benefits.tsx components/sections/careers/Culture.tsx components/sections/careers/HiringProcess.tsx
git commit -m "feat: add WhyWorkWithUs, Benefits, Culture, and HiringProcess sections"
```

---

### Task 21: Rebuild `app/careers/page.tsx`

**Files:**
- Modify: `app/careers/page.tsx`

**Interfaces:**
- Consumes: `PageHero`, `Section` (`components/ui/*`), `Cta`, `WhyWorkWithUs`, `Benefits`, `Culture`, `HiringProcess`, `JobList` (Task 20, Task 19), `careersHero`, `careersCta`, `openings` (Task 1), `media.careers` (Task 1).
- Produces: no new exports — this task assembles the page.

- [ ] **Step 1: Replace the full content of `app/careers/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Cta } from "@/components/ui/Cta";
import { WhyWorkWithUs } from "@/components/sections/careers/WhyWorkWithUs";
import { Benefits } from "@/components/sections/careers/Benefits";
import { Culture } from "@/components/sections/careers/Culture";
import { HiringProcess } from "@/components/sections/careers/HiringProcess";
import { JobList } from "@/components/sections/careers/JobList";
import { careersHero, careersCta, openings, type Job } from "@/content/careers";
import { media } from "@/content/media";

export const metadata: Metadata = {
  title: "Careers — Build What's Next",
  description:
    "Join a team obsessed with how businesses actually work. We're 25+ engineers, strategists, and operators building vertical operating systems.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers — Build What's Next",
    description: "Join a team obsessed with how businesses actually work.",
    url: "/careers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers — Build What's Next",
    description: "Join a team obsessed with how businesses actually work.",
  },
};

// schema.org JobPosting.employmentType enum — not derivable from our copy by
// a case/punctuation transform alone (e.g. "Contract" -> "CONTRACTOR").
const EMPLOYMENT_TYPE_SCHEMA: Record<Job["employmentType"], string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACTOR",
  Internship: "INTERN",
};

export default function CareersPage() {
  const img = media.careers;

  const jobPostingSchema = openings.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    employmentType: EMPLOYMENT_TYPE_SCHEMA[job.employmentType],
    hiringOrganization: {
      "@type": "Organization",
      name: "WnR Group",
      sameAs: "https://wnrgroup.com",
    },
    jobLocation: {
      "@type": "Place",
      address: job.location,
    },
  }));

  return (
    <>
      {jobPostingSchema.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
        />
      )}

      <PageHero
        eyebrow={careersHero.eyebrow}
        title={careersHero.heading}
        lead={careersHero.lead}
        aside={
          img && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line shadow-card">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          )
        }
      >
        <Cta href="#openings" variant="primary">
          {careersHero.ctaLabel}
          <ArrowRight size={16} />
        </Cta>
      </PageHero>

      <WhyWorkWithUs />
      <Benefits />
      <Culture />
      <HiringProcess />

      <Section id="openings" tone="canvas">
        <div className="max-w-2xl">
          <p className="eyebrow">Current Openings</p>
          <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
            {openings.length > 0
              ? "Open roles at WnR Group."
              : "No openings right now — but talent always has a seat."}
          </h2>
        </div>
        <div className="mt-10">
          <JobList jobs={openings} />
        </div>
      </Section>

      <Section tone="wash" className="text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
            {careersCta.heading}
          </h2>
          <p className="mt-4 text-body">{careersCta.body}</p>
          <div className="mt-9 flex justify-center">
            <Cta href="/contact?inquiry=careers" variant="primary" className="px-8 py-4 text-base">
              {careersCta.ctaLabel}
              <ArrowRight size={18} />
            </Cta>
          </div>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Run the full test suite**

Run: `npm run test`
Expected: all tests from Tasks 2–20 pass (no regressions from wiring).

- [ ] **Step 4: Commit**

```bash
git add app/careers/page.tsx
git commit -m "feat: rebuild careers page with hero image, new sections, and data-driven openings"
```

---

### Task 22: Full verification pass

**Files:** none (verification only — this task runs commands and does a manual browser pass; if anything fails, fix the minimal offending code in its owning task's file and re-run this task from Step 1).

**Interfaces:** none.

- [ ] **Step 1: TypeScript**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors or warnings on any new or modified file.

- [ ] **Step 3: Unit tests**

Run: `npm run test`
Expected: all tests pass — `lib/validation.test.ts`, `lib/file-validation.test.ts`, `lib/rate-limit.test.ts`, `components/ui/select.test.tsx`, `components/ui/toast.test.tsx`, `components/ui/dialog.test.tsx`, `services/contact.test.ts`, `app/api/contact/route.test.ts`, `components/sections/contact/FormField.test.tsx`, `components/sections/contact/hooks/useContactForm.test.ts`, `components/sections/contact/ContactForm.test.tsx`, `services/careers.test.ts`, `app/api/careers/resume/route.test.ts`, `components/sections/careers/JobCard.test.tsx`, `components/sections/careers/ResumeUpload.test.tsx`, `components/sections/careers/ResumeDialog.test.tsx`, `components/sections/careers/JobList.test.tsx`, plus every test from the prior Products feature (no regressions).

- [ ] **Step 4: Production build**

Run: `npm run build`
Expected: build succeeds with no type or lint errors, and specifically no "should be wrapped in a suspense boundary" warning/error for `/contact` (confirms Task 13's `Suspense` wrapper around `ContactForm` is correctly placed) and no warnings about the two new Route Handlers (`/api/contact`, `/api/careers/resume`).

- [ ] **Step 5: Manual browser QA — Careers page**

Run: `npm run dev`, open `http://localhost:3000/careers`.

Verify:
- Hero: eyebrow badge reads "CAREERS", heading "Build your future with WnR Group.", lead paragraph, "Explore Opportunities" button that jumps to `#openings`. Image on the right at desktop width (≥1024px); image stacks below the text on mobile width (<1024px, resize the viewport or use dev tools device mode) with no layout jump as it loads.
- Scrolling down: "Why Work With WnR" (3 reason cards), "Benefits" (6 items), "Culture" (3 pillars, same content style as the existing About page's "How We Work" block but this is now its own component), "Hiring Process" (4 numbered steps), "Current Openings" (4 job cards in a 2-column grid at `sm`+ width, 1 column on mobile).
- Each job card shows title, department, location, employment type, experience, description, and an "Apply" link. Click "Apply" on any card: navigates to `/contact` with the URL containing `?inquiry=careers&role=<the role name>`, and the Let's Talk form's Inquiry Type dropdown is pre-set to "Careers" and the Message field is pre-filled mentioning that role.
- Below the grid: "Submit Resume" button opens a modal (focus moves into it, background is inert — try clicking outside or pressing Tab repeatedly to confirm focus stays trapped in the dialog). Drag a `.pdf`/`.doc`/`.docx` file onto the drop zone, or click to browse and pick one: the filename appears, "Upload Resume" becomes enabled, clicking it shows a progress percentage and then a success panel. Try a `.txt` or `.exe` file: an inline error appears and the upload button stays disabled.
- Closing CTA band at the bottom with "Get in Touch" linking to `/contact?inquiry=careers`.

- [ ] **Step 6: Manual browser QA — Let's Talk (Contact) page**

Open `http://localhost:3000/contact`.

Verify:
- Two-column layout unchanged from before (info column left, form card right on desktop; stacked on mobile).
- Form fields, in order: Name*, Organization*, Email*, Contact Number*, Region* (a dropdown — click it, confirm it opens with a list of regions, arrow keys move the highlighted option, Enter selects it, Escape closes it without changing the value), Inquiry Type* (same interaction), Message (no asterisk, optional).
- Submit with all required fields empty: inline red error text appears under each invalid field, no toast, no network request (open the Network tab to confirm nothing was sent to `/api/contact`).
- Fill in all required fields with valid values and submit: button shows a spinner + "Sending...", is disabled (click it again rapidly and confirm only one request appears in the Network tab), then a green success toast appears bottom-right ("Message sent...") and the form clears back to empty.
- Force a failure (temporarily stop the dev server's ability to reach `/api/contact` by throttling to "Offline" in dev tools' Network conditions, or briefly rename `app/api/contact/route.ts` and rebuild) and resubmit: a red error toast appears with a "Retry" button; restore connectivity/the file and click "Retry" — the same payload resubmits without the user retyping anything.
- Visit `/contact?inquiry=careers&role=Product%20Designer` directly: confirm the Inquiry Type dropdown opens already showing "Careers" selected and the Message field is pre-filled mentioning "Product Designer".

- [ ] **Step 7: Manual browser QA — keyboard and screen reader spot checks**

On both pages: tab through every interactive element (links, the Select triggers, the dialog trigger, form inputs, the submit button) and confirm a visible focus ring on each, in a sensible left-to-right, top-to-bottom order. Open a screen reader (Narrator on Windows: `Ctrl+Win+Enter`) and confirm the Select and Dialog announce their open/closed state and the form's inline errors are announced when they appear (they use `role="alert"`, which should interrupt and announce immediately).

- [ ] **Step 8: Regression pass across the rest of the site**

With `npm run dev` still running, open Home (`/`), Capabilities, Products, About, Insights — confirm each renders exactly as before (no visual change), the header's "Let's Talk" link and footer's "Get in Touch" link both still go to `/contact` and the new form loads correctly from those entry points too (no `?inquiry=` param — dropdowns show their placeholders, not a pre-selected value). Confirm the header/footer navigation, theme, animations, and images are unaffected on every page. Check the browser console on every page visited in this task for errors or hydration warnings — there should be none.

- [ ] **Step 9: Fix-and-repeat**

If any step above fails, fix the issue in the file it belongs to (per this plan's task breakdown — do not patch symptoms in an unrelated file) and re-run this entire Task 22 from Step 1 before considering the work done.

---

## Self-Review Notes

- **Spec coverage:** every bullet in the original spec is implemented by a task above — hero layout/copy/image/CTA (Task 21 + PageHero), Why Work With WnR / Benefits / Culture / Hiring Process / Current Openings / CTA sections (Tasks 20, 19, 21), typed data-driven `JobCard` with no hardcoded JSX repetition (Task 16), no-openings fallback with Submit Resume (Task 19), drag-and-drop + browse + client/server validation + progress (Tasks 17, 3, 15), Let's Talk's six required fields plus optional message (Task 12), RFC-shaped email / E.164-shaped phone / length-bounded validation with trimming and HTML-escaping (Task 2), region/inquiry-type dropdowns as a reusable keyboard/ARIA `Select` (Task 5), submit/loading/success/failure/retry/timeout/AbortController/duplicate-submit-prevention/toasts (Tasks 8, 11, 12), abstracted `services/contact.ts` service layer with no `fetch` in any component (Tasks 8, 14), server-side rate limiting and input sanitization "never trust the frontend" (Tasks 4, 9, 15), accessibility (labels/ARIA/keyboard/focus-visible/`role="alert"` throughout), responsive layout (existing `Section`/`PageHero` breakpoints, reused not reinvented), SEO metadata + OpenGraph + Twitter + canonical + `JobPosting`/`ContactPage` JSON-LD (Tasks 13, 21), reduced-motion respect (no new raw CSS animations added; existing `Section`'s `Reveal` and global `prefers-reduced-motion` CSS cover both pages already), and the mandated `lint`/`typecheck`/`test`/`build` gate plus manual regression pass (Task 22).
- **Placeholder scan:** no `TODO`, no "add error handling here", no invented function names not defined in an earlier task — every route handler, service, hook, and component above is complete, runnable code. The two spots where this repo has no real backend integration (contact-form delivery, resume storage) are documented as an explicit, working integration boundary in the Audit Summary and inline code comments, not left as unfinished stubs — both still fully validate, rate-limit, and respond correctly.
- **Type consistency:** `Job` (content/careers.ts, Task 1) is the same type re-exported by `components/sections/careers/types.ts` (Task 16) and consumed unchanged through `JobCard`/`JobList`/`app/careers/page.tsx`. `ContactFormValues`/`ContactFormErrors` (Task 10) match the shape `useContactForm` (Task 11) returns and `ContactForm` (Task 12) consumes. `ContactFormPayload` (Task 8) has the same seven keys as `ContactFormInput` (Task 2) and `ContactFormValues` (Task 10) — verified by hand across all three files above.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-13-careers-and-contact.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**

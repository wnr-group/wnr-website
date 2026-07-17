"use client";

import { useRef, useState } from "react";
import {
  m,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { hiringProcess, type HiringStep } from "@/content/careers";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const steps = hiringProcess.steps;

/* A live "signal" travels the length of the process as the visitor scrolls,
   lighting up each stage as it arrives — chosen over a generic curved roadmap
   because it extends WnR's own blueprint/schematic visual language (the gold
   accent already reserved for rare premium moments, see Approach.tsx) instead
   of importing a look from Google/Apple/Linear wholesale. Reduced-motion users
   get the plain numbered list with no animated signal — no scroll-tied motion
   to fall back on gracefully, so it's simplest to just not attempt one. */
export function HiringProcess() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.8", "end 0.4"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(latest * steps.length)));
    setActiveStep((prev) => (prev === next ? prev : next));
  });

  return (
    <Section id="hiring-process" tone="mist" className="overflow-hidden" revealAmount="some">
      <div className="max-w-2xl">
        <Eyebrow>{hiringProcess.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
          {hiringProcess.heading}
        </h2>
        <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-body">
          {hiringProcess.intro}
        </p>
      </div>

      <div ref={trackRef}>
        {/* Vertical signal — below lg */}
        <div className="relative mt-12 lg:hidden">
          <div
            className="sticky top-24 z-10 mb-8 inline-flex items-center gap-2 rounded-full border border-line-strong bg-paper/90 px-4 py-2 text-xs font-semibold text-ink shadow-card backdrop-blur"
            aria-live="polite"
          >
            Step {activeStep + 1} of {steps.length}
          </div>

          <ol className="flex flex-col">
            {steps.map((step, i) => (
              <li
                key={step.num}
                aria-current={i === activeStep ? "step" : undefined}
                className="relative flex gap-5 pb-10 last:pb-0"
              >
                {i < steps.length - 1 && (
                  <div
                    className="absolute left-6 top-12 h-[calc(100%-1.5rem)] w-px overflow-hidden"
                    aria-hidden="true"
                  >
                    <VerticalFill index={i} total={steps.length} progress={scrollYProgress} />
                  </div>
                )}
                <StepNode index={i} total={steps.length} num={step.num} progress={scrollYProgress} />
                <StepCard step={step} index={i} className="lg:mt-0" />
              </li>
            ))}
          </ol>
        </div>

        {/* Horizontal signal rail — lg and up */}
        <div className="relative mt-16 hidden lg:block">
          <div className="relative grid grid-cols-4">
            <div
              className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-6 h-[2px] -translate-y-1/2 bg-line-strong"
              aria-hidden="true"
            >
              <HorizontalFill progress={scrollYProgress} />
              <SignalDot progress={scrollYProgress} />
            </div>
            {steps.map((step, i) => (
              <div key={step.num} className="flex justify-center">
                <StepNode index={i} total={steps.length} num={step.num} progress={scrollYProgress} />
              </div>
            ))}
          </div>

          <ol className="mt-8 grid grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <li key={step.num} aria-current={i === activeStep ? "step" : undefined}>
                <StepCard step={step} index={i} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

function StepNode({
  index,
  total,
  num,
  progress,
}: {
  index: number;
  total: number;
  num: string;
  progress: MotionValue<number>;
}) {
  const shouldReduceMotion = useReducedMotion();
  const start = index / total;
  const fill = useTransform(progress, [start, start + 0.14], [0, 1]);

  return (
    <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper shadow-sm ring-2 ring-gold/50">
      <m.span
        className="absolute inset-0 rounded-full bg-gold"
        style={{ opacity: shouldReduceMotion ? 0 : fill }}
        aria-hidden="true"
      />
      <span className="relative font-display text-sm font-bold tabular-nums text-forest-deep">
        {num}
      </span>
    </span>
  );
}

function VerticalFill({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const shouldReduceMotion = useReducedMotion();
  const start = index / total;
  const end = (index + 1) / total;
  const fill = useTransform(progress, [start, end], [0, 1]);

  return (
    <m.div
      className="absolute inset-x-0 top-0 h-full origin-top bg-gold"
      style={{ scaleY: shouldReduceMotion ? 0 : fill }}
      aria-hidden="true"
    />
  );
}

function HorizontalFill({ progress }: { progress: MotionValue<number> }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <m.div
      className="absolute inset-y-0 left-0 h-full origin-left bg-gold"
      style={{ scaleX: shouldReduceMotion ? 0 : progress }}
    />
  );
}

function SignalDot({ progress }: { progress: MotionValue<number> }) {
  const shouldReduceMotion = useReducedMotion();
  const left = useTransform(progress, [0, 1], ["0%", "100%"]);

  if (shouldReduceMotion) return null;

  return (
    <m.span
      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_14px_3px_rgba(201,162,75,0.55)]"
      style={{ left }}
      aria-hidden="true"
    />
  );
}

function StepCard({
  step,
  index,
  className,
}: {
  step: HiringStep;
  index: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.05 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
      }}
      className={cn(
        "group relative mt-6 overflow-hidden rounded-2xl border border-line bg-paper p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-card-hover",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, var(--color-gold) 16%, transparent), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="relative">
        <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-body">{step.body}</p>
      </div>
    </m.div>
  );
}

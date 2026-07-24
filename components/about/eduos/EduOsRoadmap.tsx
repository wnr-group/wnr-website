"use client";

import { useRef } from "react";
import {
  m,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { CircleCheck } from "lucide-react";
import { eduOsExperience, type EduOsRoadmapPhase } from "@/content/eduos";
import { Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** "EduOS Roadmap" — animated vertical timeline (2027 → Beyond 2030), verbatim
 *  milestones from docs/Edu Os.docx. The scroll-fill spine and per-node reveal
 *  reuse the same useScroll/useTransform choreography already proven in
 *  components/sections/careers/HiringProcess.tsx (pattern only — that file is
 *  untouched). Count-up numbers reuse hooks/useCountUp.ts unmodified. */
export function EduOsRoadmap({ scrollContainerRef }: { scrollContainerRef: React.RefObject<HTMLDivElement | null> }) {
  const { roadmap } = eduOsExperience;
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: trackRef,
    offset: ["start 0.85", "end 0.6"],
  });

  return (
    <div className="mx-auto mt-24 max-w-5xl sm:mt-32">
      <Reveal amount={0.4} className="max-w-2xl">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{roadmap.heading}</h2>
        <p className="mt-2 font-display text-sm font-semibold uppercase tracking-wide text-[#c9a24b]">
          {roadmap.subheading}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">{roadmap.intro}</p>
      </Reveal>

      <div ref={trackRef} className="relative mt-14">
        <div className="absolute left-4 top-1 bottom-1 w-0.5 -translate-x-1/2 bg-white/10 lg:left-1/2">
          <TimelineFill progress={scrollYProgress} />
        </div>

        <div className="flex flex-col gap-12 lg:gap-16">
          {roadmap.phases.map((phase, i) => (
            <PhaseRow
              key={phase.year}
              phase={phase}
              index={i}
              total={roadmap.phases.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineFill({ progress }: { progress: MotionValue<number> }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <m.div
      className="absolute inset-x-0 top-0 h-full origin-top bg-[linear-gradient(to_bottom,#c9a24b,#a6822f)]"
      style={{ scaleY: shouldReduceMotion ? 1 : progress }}
      aria-hidden="true"
    />
  );
}

function PhaseRow({
  phase,
  index,
  total,
  progress,
}: {
  phase: EduOsRoadmapPhase;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const isRight = index % 2 === 1;

  return (
    <div className="relative pl-12 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:pl-0">
      <PhaseNode index={index} total={total} progress={progress} />
      <div className={cn(isRight ? "lg:col-start-2" : "lg:col-start-1 lg:row-start-1")}>
        <PhaseCard phase={phase} />
      </div>
    </div>
  );
}

function PhaseNode({
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
  const fill = useTransform(progress, [start, start + 0.5 / total], [0, 1]);

  return (
    <div className="absolute left-4 top-1 z-10 -translate-x-1/2 lg:left-1/2">
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0b2e20] bg-[#0e1a13] ring-2 ring-[#c9a24b]/30">
        <m.span
          className="absolute inset-[3px] rounded-full bg-[#c9a24b]"
          style={{
            scale: shouldReduceMotion ? 1 : fill,
            opacity: shouldReduceMotion ? 1 : fill,
          }}
          aria-hidden="true"
        />
      </span>
    </div>
  );
}

function PhaseCard({ phase }: { phase: EduOsRoadmapPhase }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24b]/40 hover:bg-white/[0.06] sm:p-7"
    >
      <span className="font-display text-2xl font-extrabold tabular-nums text-[#c9a24b]">{phase.year}</span>
      <h3 className="mt-1 font-display text-lg font-bold text-white sm:text-xl">{phase.title}</h3>

      {phase.focus && (
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/50">
          Focus: {phase.focus}
        </p>
      )}

      {phase.milestones && (
        <ul className="mt-4 space-y-2">
          {phase.milestones.map((milestone, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-white/75">
              <CircleCheck size={14} className="mt-0.5 shrink-0 text-[#c9a24b]" aria-hidden="true" />
              <span>{milestone}</span>
            </li>
          ))}
        </ul>
      )}

      {phase.paragraphs && (
        <div className="mt-4 space-y-3">
          {phase.paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-white/75 sm:text-base">
              {p}
            </p>
          ))}
        </div>
      )}
    </m.div>
  );
}

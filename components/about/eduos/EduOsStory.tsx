"use client";

import { eduOsExperience } from "@/content/eduos";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { EduOsMissionVision } from "./EduOsMissionVision";
import { EduOsCoreValues } from "./EduOsCoreValues";
import { EduOsRoadmap } from "./EduOsRoadmap";
import { EduOsClosing } from "./EduOsClosing";

/* The full EduOS narrative — everything from the Hero through the Closing
   tagline, verbatim from docs/Edu Os.docx. Rendered inside EduOsModal.tsx's
   Popup scroll container; dynamically imported from there so none of this
   (or the roadmap's scroll-progress logic) enters the About page's initial
   bundle. */
export function EduOsStory({ onClose }: { onClose: () => void }) {
  const { hero, story, whyWeStarted } = eduOsExperience;

  return (
    <>
      {/* Hero */}
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Reveal y={20} delay={0.05}>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">{hero.kicker}</span>
        </Reveal>
        <Reveal y={26} delay={0.15}>
          <h1 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
            {hero.heading.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
        </Reveal>
        <Reveal y={20} delay={0.25} className="mt-8 max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#c9a24b]">{hero.beliefLead}</p>
          <p className="mt-3 text-lg leading-relaxed text-white/85 sm:text-xl">{hero.belief}</p>
        </Reveal>
      </div>

      {/* Story + Why gap */}
      <div className="mx-auto mt-24 max-w-3xl text-left sm:mt-32">
        <Reveal amount={0.3}>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{story.heading}</h2>
        </Reveal>
        <Stagger className="mt-6 space-y-5" stagger={0.08}>
          {story.paragraphs.map((p, i) => (
            <StaggerItem key={i}>
              <p className="text-base leading-relaxed text-white/80 sm:text-lg">{p}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal amount={0.3} className="mt-14 rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:p-10">
          <h3 className="font-display text-lg font-bold text-[#c9a24b] sm:text-xl">{story.advisory.heading}</h3>
          <div className="mt-5 space-y-4">
            {story.advisory.paragraphs.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-white/75 sm:text-base">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-24 max-w-3xl text-left sm:mt-32">
        <Reveal amount={0.3}>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{whyWeStarted.heading}</h2>
        </Reveal>
        <Stagger className="mt-6 space-y-5" stagger={0.08}>
          {whyWeStarted.paragraphs.map((p, i) => (
            <StaggerItem key={i}>
              <p className="text-base leading-relaxed text-white/80 sm:text-lg">{p}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <EduOsMissionVision />
      <EduOsCoreValues />
      <EduOsRoadmap />
      <EduOsClosing onClose={onClose} />
    </>
  );
}

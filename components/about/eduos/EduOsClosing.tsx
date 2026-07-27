"use client";

import { eduOsExperience } from "@/content/eduos";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

/** "Looking Ahead" + the document's closing commitment and tagline, verbatim
 *  from docs/Edu Os.docx. Ends the story with a way back to the page. */
export function EduOsClosing({ onClose }: { onClose: () => void }) {
  const { lookingAhead, closing } = eduOsExperience;

  return (
    <div className="mx-auto mt-24 max-w-3xl text-center sm:mt-32">
      <Reveal amount={0.4}>
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{lookingAhead.heading}</h2>
      </Reveal>
      <Stagger className="mt-6 space-y-5 text-left" stagger={0.08}>
        {lookingAhead.paragraphs.map((p, i) => (
          <StaggerItem key={i}>
            <p className="text-base leading-relaxed text-white/80 sm:text-lg">{p}</p>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal amount={0.4} className="mt-20 border-t border-white/10 pt-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-white/50">{closing.commitmentLead}</p>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
          {closing.commitment}
        </p>
      </Reveal>

      <Reveal amount={0.4} className="mt-14">
        <div className="font-display text-xs font-extrabold uppercase tracking-[0.3em] text-[#c9a24b]">
          {closing.wordmark}
        </div>
        <p className="mt-4 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {closing.tagline}
        </p>
        <p className="mt-3 text-sm text-white/50">{closing.attribution}</p>
      </Reveal>

      <Reveal amount={0.4} className="mt-14 pb-2">
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9a24b]/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24b] active:scale-[0.98]",
          )}
        >
          Close
        </button>
      </Reveal>
    </div>
  );
}

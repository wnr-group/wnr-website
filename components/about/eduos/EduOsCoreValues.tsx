"use client";

import { GraduationCap, Lightbulb, ShieldCheck, Sprout, Target } from "lucide-react";
import { eduOsExperience, type EduOsCoreValue } from "@/content/eduos";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

const valueIcons: Record<EduOsCoreValue["icon"], typeof Target> = {
  Target,
  ShieldCheck,
  GraduationCap,
  Sprout,
  Lightbulb,
};

/** "Our Core Values" — 5 premium hover-lift cards, verbatim from
 *  docs/Edu Os.docx's "Our Core Values" section. */
export function EduOsCoreValues() {
  const { coreValues } = eduOsExperience;

  return (
    <div className="mx-auto mt-24 max-w-5xl sm:mt-32">
      <Reveal amount={0.4}>
        <h2 className="text-center font-display text-2xl font-bold text-white sm:text-3xl">
          {coreValues.heading}
        </h2>
      </Reveal>

      <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
        {coreValues.values.map((value) => {
          const Icon = valueIcons[value.icon];
          return (
            <StaggerItem key={value.title}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c9a24b]/40 hover:bg-white/[0.06] hover:shadow-[0_20px_50px_-24px_rgba(201,162,75,0.4)] sm:p-7">
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(160px circle at 20% 0%, color-mix(in oklab, var(--color-gold) 14%, transparent), transparent 70%)",
                  }}
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a24b]/15 text-[#c9a24b] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-white">{value.title}</h3>
                  <div className="mt-2.5 space-y-2">
                    {value.body.map((p, i) => (
                      <p key={i} className="text-sm leading-relaxed text-white/70">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}

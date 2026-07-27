"use client";

import { Compass, Target, Telescope } from "lucide-react";
import { eduOsExperience } from "@/content/eduos";
import { Stagger, StaggerItem } from "@/components/ui/motion";

const pillarIcons = { purpose: Compass, mission: Target, vision: Telescope };

/** Purpose / Mission / Vision — three premium cards, verbatim from
 *  docs/Edu Os.docx's "Our Purpose", "Our Mission", "Our Vision" sections. */
export function EduOsMissionVision() {
  const { pillars } = eduOsExperience;
  const items = [
    { key: "purpose" as const, ...pillars.purpose },
    { key: "mission" as const, ...pillars.mission },
    { key: "vision" as const, ...pillars.vision },
  ];

  return (
    <div className="mx-auto mt-24 max-w-5xl sm:mt-32">
      <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-3" stagger={0.12}>
        {items.map((item) => {
          const Icon = pillarIcons[item.key];
          return (
            <StaggerItem key={item.key}>
              <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c9a24b]/40 hover:bg-white/[0.06] hover:shadow-[0_20px_50px_-24px_rgba(201,162,75,0.4)] sm:p-8">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c9a24b]/15 text-[#c9a24b] transition-transform duration-300 group-hover:scale-110">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-white">{item.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-[0.95rem]">{item.body}</p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}

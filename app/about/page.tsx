import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutAwards } from "@/components/about/AboutAwards";
import { AboutChaosToClarity } from "@/components/about/AboutChaosToClarity";
import { AboutMissionVision } from "@/components/about/AboutMissionVision";
import { AboutWhatWeBelieve } from "@/components/about/AboutWhatWeBelieve";
import { AboutHowWeWork } from "@/components/about/AboutHowWeWork";
import { AboutInsideWnr } from "@/components/about/AboutInsideWnr";
import { AboutRoadmap } from "@/components/about/AboutRoadmap";
import { AboutEduOsAnchor } from "@/components/about/AboutEduOsAnchor";
import { AboutCta } from "@/components/about/AboutCta";
import { aboutHero } from "@/content/about";

export const metadata: Metadata = {
  title: "About Us — Operational Intelligence & Enterprise Systems",
  description: aboutHero.lead,
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Hero */}
      <AboutHero />

      {/* 2. Awards & Recognition */}
      <AboutAwards />

      {/* 3. Why WNR Exists (Chaos -> Clarity) */}
      <AboutChaosToClarity />

      {/* 4. Mission & 5. Vision */}
      <AboutMissionVision />

      {/* 6. What We Believe (Full-width dark section) */}
      <AboutWhatWeBelieve />

      {/* 7. How We Work (Four principles) */}
      <AboutHowWeWork />

      {/* 8. Inside WNR (Team & culture without faces) */}
      <AboutInsideWnr />

      {/* 9. Where We're Going (Three Horizon Roadmap) */}
      <AboutRoadmap />

      {/* 10. The 2040 Anchor — EduOS (Full-width cinematic dark band) */}
      <AboutEduOsAnchor />

      {/* 11. CTA */}
      <AboutCta />
    </main>
  );
}

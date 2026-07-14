"use client";

import React, { useState, useCallback } from "react";
import type { CaseStudy } from "@/types/caseStudy";
import { CaseStudyAccordionBanner } from "./CaseStudyAccordionBanner";
import { CaseStudyHorizontalCarousel } from "./CaseStudyHorizontalCarousel";

interface CaseStudiesInteractiveShowcaseProps {
  studies: CaseStudy[];
}

/**
 * Client orchestrator connecting the Case Study Accordion Banner (top) with the
 * Horizontal Auto-Scroll Case Study Cards (bottom) via shared `activeIndex` state.
 */
export function CaseStudiesInteractiveShowcase({
  studies,
}: CaseStudiesInteractiveShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelectIndex = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (!studies || studies.length === 0) return null;

  return (
    <div className="mt-14 flex flex-col gap-16 sm:mt-16 sm:gap-20">
      {/* Top Case Study Accordion Banner */}
      <CaseStudyAccordionBanner
        studies={studies}
        activeIndex={activeIndex}
        onSelectIndex={handleSelectIndex}
      />

      {/* Bottom Horizontal Auto-Scroll Case Study Cards */}
      <div className="border-t border-line pt-12 sm:pt-16">
        <CaseStudyHorizontalCarousel
          studies={studies}
          activeIndex={activeIndex}
          onSelectIndex={handleSelectIndex}
        />
      </div>
    </div>
  );
}

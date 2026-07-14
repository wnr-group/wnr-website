import { Section, Eyebrow } from "@/components/ui/Section";
import { caseStudies, caseStudyIndustryGroups } from "@/data/caseStudies";
import dynamic from "next/dynamic";

const CaseStudiesInteractiveShowcase = dynamic(
  () =>
    import("./CaseStudiesInteractiveShowcase").then(
      (mod) => mod.CaseStudiesInteractiveShowcase
    ),
  { ssr: true }
);

/**
 * The Insights page's "Case Studies" section — case studies grouped by
 * industry, each identified by solution category only (no client names,
 * logos, or confidential detail). Content is sourced from the WnR case
 * studies collateral; see /data/caseStudies.ts.
 */
export function CaseStudiesSection() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: caseStudyIndustryGroups.flatMap((group) =>
      group.studies.map((study) => ({
        "@type": "CreativeWork",
        name: study.title,
        about: study.industryLabel,
        description: study.summary,
      })),
    ),
  };

  return (
    <Section id="case-studies" tone="canvas" revealAmount="some">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Eyebrow>Case Studies</Eyebrow>
      <h2 className="mt-5 max-w-2xl font-display text-[length:var(--text-h2)] font-bold leading-[1.08] text-ink">
        Delivering digital transformation across industries.
      </h2>
      <p className="mt-6 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-body">
        Custom platforms across education, commerce, and enterprise — grouped
        by the industries we serve.
      </p>

      <CaseStudiesInteractiveShowcase studies={caseStudies} />
    </Section>
  );
}



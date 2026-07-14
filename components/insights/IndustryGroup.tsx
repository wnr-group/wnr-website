import { Stagger, StaggerItem } from "@/components/ui/motion";
import type { CaseStudyIndustryGroup } from "@/types/caseStudy";
import { CaseStudyCard } from "./CaseStudyCard";

export function IndustryGroup({ group }: { group: CaseStudyIndustryGroup }) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-ink">{group.name}</h3>
      <Stagger className="mt-6 grid gap-5 sm:grid-cols-2">
        {group.studies.map((study) => (
          <StaggerItem key={study.id}>
            <CaseStudyCard study={study} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

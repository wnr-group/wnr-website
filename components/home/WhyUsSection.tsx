import { Section } from "@/components/ui/Section";
import dynamic from "next/dynamic";

const WhyUsCoverflow = dynamic(
  () => import("./WhyUsCoverflow").then((mod) => mod.WhyUsCoverflow),
  { ssr: true }
);

export function WhyUsSection() {
  return (
    <Section id="why-us" tone="canvas" className="pt-4 md:pt-6 lg:pt-8 overflow-hidden">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <p className="eyebrow">WHY US</p>
        <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.06] text-ink">
          The principles that drive every solution we build
        </h2>
        <p className="mt-6 text-[length:var(--text-lead)] leading-relaxed text-body max-w-xl">
          Technology alone doesn&rsquo;t create transformation.
          <br />
          The partnership behind it does.
        </p>
      </div>

      <WhyUsCoverflow />
    </Section>
  );
}


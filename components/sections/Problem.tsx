import { Section, Eyebrow } from "@/components/ui/Section";
import { ScatterToSystem } from "@/components/ui/ScatterToSystem";
import { problem } from "@/content/sections";

/* Section 3 — The problem. Light section; the animation carries the weight,
   copy stays tight (~30 words on screen). */
export function Problem() {
  return (
    <Section id="problem" tone="cream">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl">
          <Eyebrow>{problem.eyebrow}</Eyebrow>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-forest md:text-[2.75rem]">
            Businesses don&rsquo;t fail from lack of effort.{" "}
            <span className="text-gold">They drown in complexity.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{problem.body}</p>
        </div>

        <div className="lg:pl-8">
          <ScatterToSystem items={problem.scatter} />
        </div>
      </div>
    </Section>
  );
}

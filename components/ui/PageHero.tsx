import { Eyebrow } from "@/components/ui/Section";

/* Consistent interior-page hero — white, blueprint texture, left-aligned.
   Big headline + lead. Optional right-hand slot for a visual. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  aside,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-canvas pt-18">
      <div
        className="grid-blueprint pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 -top-10 h-[28rem] w-[28rem] rounded-full bg-forest-bright/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className={
          aside
            ? "relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr]"
            : "relative mx-auto max-w-[1200px] px-5 py-16 sm:px-6 md:py-24"
        }
      >
        <div className={aside ? "max-w-2xl" : "max-w-3xl"}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 font-display text-[length:var(--text-hero)] font-bold leading-[1.05] text-ink">
            {title}
          </h1>
          {lead && (
            <p className="mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-body">
              {lead}
            </p>
          )}
          {children && <div className="mt-9">{children}</div>}
        </div>
        {aside && <div className="animate-fade">{aside}</div>}
      </div>
    </section>
  );
}

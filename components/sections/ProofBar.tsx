import { proofStats, recognition } from "@/content/company";

/* Section 2 — Proof bar. Grounds the abstract hero in evidence immediately.
   Deliberately NOT four identical metric cards: one oversized anchor stat,
   the rest as a typographic row, on a cream breath after the dark hero. */
export function ProofBar() {
  const [anchor, ...rest] = proofStats;

  return (
    <section className="border-b border-hairline bg-cream px-5 py-14 sm:px-6 md:py-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
          {/* Anchor stat */}
          <div className="md:col-span-4">
            <p className="font-display text-6xl font-bold leading-none tracking-tight text-forest md:text-7xl">
              {anchor.value}
            </p>
            <p className="mt-3 max-w-[14rem] text-sm font-medium text-muted">
              {anchor.label}
            </p>
          </div>

          {/* Remaining stats */}
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-3 md:col-span-8">
            {rest.map((s) => (
              <div key={s.label} className="flex flex-col gap-1 bg-cream px-6 py-7">
                <dt className="order-2 text-sm text-muted">{s.label}</dt>
                <dd className="order-1 font-display text-4xl font-bold tracking-tight text-forest">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* recognition row */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hairline pt-6 text-sm text-muted">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-gold">
            Recognised
          </span>
          {recognition.map((r) => (
            <span key={r} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-gold" />
              {r}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

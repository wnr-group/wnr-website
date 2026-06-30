import { cn } from "@/lib/utils";

/* Lightweight, on-brand placeholder for a product dashboard screenshot.
   Used until real EduOS / ArenaOS screenshots are supplied (spec §9). */
export function ProductMock({
  name,
  metrics,
  className,
}: {
  name: string;
  metrics: { label: string; value: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-forest-2/40 shadow-[0_40px_80px_-32px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-gold/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-gold/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-gold/15" />
        <span className="ml-2 text-xs font-medium text-cream/55">{name} · Dashboard</span>
      </div>
      <div className="grid grid-cols-3 gap-px bg-white/5">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-1 bg-forest-deep/60 p-4">
            <span className="text-[10px] uppercase tracking-wide text-gold/80">
              {m.label}
            </span>
            <span className="font-display text-lg font-bold tabular-nums text-cream">
              {m.value}
            </span>
          </div>
        ))}
      </div>
      {/* faux chart + rows */}
      <div className="space-y-2.5 p-4">
        <div className="flex h-16 items-end gap-1.5">
          {[40, 62, 48, 78, 70, 90, 84].map((h, i) => (
            <div
              key={i}
              className={cn("flex-1 rounded-sm", i === 5 ? "bg-gold" : "bg-gold/30")}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        {[0, 1, 2].map((r) => (
          <div key={r} className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-gold/50" />
            <span className="h-2 flex-1 rounded-full bg-white/10" />
            <span className="h-2 w-10 rounded-full bg-white/15" />
          </div>
        ))}
      </div>
    </div>
  );
}

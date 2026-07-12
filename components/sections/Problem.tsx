import {
  MessageCircle,
  Table2,
  Mail,
  FileText,
  ClipboardCheck,
  Unplug,
  ChevronDown,
  Check,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { problem } from "@/content/sections";

/* The scattered status quo. Muted, distinct colours make each tool read as a
   real, separate thing — the "chaos" that funnels into one system below.
   (The varied colour lives only here, in the problem state; the resolution
   card stays pure forest.) */
const tools = [
  { label: "WhatsApp threads", icon: MessageCircle, color: "#3aa76d" },
  { label: "Excel sheets", icon: Table2, color: "#1f8a70" },
  { label: "Email chains", icon: Mail, color: "#3b76c4" },
  { label: "Paper files", icon: FileText, color: "#b8791f" },
  { label: "Manual approvals", icon: ClipboardCheck, color: "#c0563b" },
  { label: "Disconnected apps", icon: Unplug, color: "#7a6cc4" },
];

const unified = ["Operations", "Approvals", "Reporting", "Communication"];

/* Why we exist — a large editorial statement paired with a chaos→clarity
   visual: the messy scattered tools collapse (via the funnel chevron) into one
   calm forest "source of truth" card. Replaces the old floating-pills split. */
export function Problem() {
  return (
    <Section tone="canvas" className="pt-4 md:pt-6 lg:pt-8">
      <p className="eyebrow">{problem.eyebrow}</p>

      <div className="mt-8 grid items-center gap-x-16 gap-y-12 lg:grid-cols-[1fr_1.05fr]">
        {/* statement */}
        <div>
          <h2 className="max-w-[15ch] font-display text-[length:var(--text-h2)] font-bold leading-[1.04] text-ink">
            Businesses don&rsquo;t fail from lack of effort. They drown in{" "}
            <span className="text-forest">complexity.</span>
          </h2>
          <p className="mt-7 max-w-md text-[length:var(--text-lead)] leading-relaxed text-body">
            {problem.body}
          </p>
        </div>

        {/* chaos → clarity */}
        <div className="relative mx-auto w-full max-w-md">
          {/* the scattered status quo */}
          <div className="rounded-3xl border border-line bg-mist/70 p-6 md:p-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-line-strong" aria-hidden="true" />
              How the work happens today
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {tools.map((t, i) => (
                <div
                  key={t.label}
                  className="flex items-center gap-2.5 rounded-xl border border-line bg-paper px-3.5 py-2.5"
                  style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.8}deg)` }}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${t.color}1a`, color: t.color }}
                    aria-hidden="true"
                  >
                    <t.icon size={15} strokeWidth={2} />
                  </span>
                  <span className="text-[0.8rem] font-medium leading-tight text-body">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* funnel */}
          <div
            className="relative z-10 mx-auto -my-3.5 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper shadow-card"
            aria-hidden="true"
          >
            <ChevronDown size={20} className="text-forest" strokeWidth={2.4} />
          </div>

          {/* the resolution */}
          <div className="rounded-3xl bg-forest p-6 text-white shadow-card md:p-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-forest-bright">
              <Check size={15} strokeWidth={2.6} aria-hidden="true" />
              One intelligent system
            </div>
            <p className="mt-4 font-display text-xl font-semibold leading-snug md:text-2xl">
              One source of truth.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {unified.map((u) => (
                <div key={u} className="flex items-center gap-2 text-[0.85rem] text-white/85">
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/15"
                    aria-hidden="true"
                  >
                    <Check size={11} strokeWidth={3} className="text-forest-bright" />
                  </span>
                  {u}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

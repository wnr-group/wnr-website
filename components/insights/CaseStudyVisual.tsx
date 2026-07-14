import { cn } from "@/lib/utils";
import type { CaseStudyAccent, CaseStudyVisualKind } from "@/types/caseStudy";

/**
 * Generic, industry-appropriate UI mockups rendered as inline SVG — used when
 * a case study has no real product screenshot yet (see `CaseStudy.image`).
 * Built entirely from the existing brand tokens (no new colors, no assets,
 * no network requests), so swapping in a real screenshot later is a one-line
 * change in CaseStudyCard with no layout or data-model impact.
 */

const ACCENT_VAR: Record<CaseStudyAccent, string> = {
  forest: "var(--color-forest)",
  teal: "var(--color-teal)",
  amber: "var(--color-amber)",
};

const ACCENT_WASH_VAR: Record<CaseStudyAccent, string> = {
  forest: "var(--color-forest-wash)",
  teal: "var(--color-teal-wash)",
  amber: "var(--color-amber-wash)",
};

const CHROME = "var(--color-line)";
const CHROME_SOFT = "var(--color-mist)";
const MUTED = "var(--color-muted-soft)";
const SURFACE = "var(--color-paper)";

/** Traffic-light dots + a title pill — the shared "window" chrome for every mockup. */
function TopBar({ label }: { label: string }) {
  return (
    <g>
      <rect x={0} y={0} width={400} height={30} fill={CHROME_SOFT} />
      <circle cx={16} cy={15} r={3.5} fill={MUTED} opacity={0.6} />
      <circle cx={28} cy={15} r={3.5} fill={MUTED} opacity={0.6} />
      <circle cx={40} cy={15} r={3.5} fill={MUTED} opacity={0.6} />
      <rect x={58} y={9} width={90} height={12} rx={6} fill={SURFACE} />
      <text x={70} y={18} fontSize={7} fill="var(--color-muted)" fontFamily="sans-serif">
        {label}
      </text>
      <line x1={0} y1={30} x2={400} y2={30} stroke={CHROME} strokeWidth={1} />
    </g>
  );
}

/** Left icon rail — 4 nav rows, one active in the section accent. */
function Sidebar({ accent, active = 1 }: { accent: CaseStudyAccent; active?: number }) {
  return (
    <g>
      <rect x={0} y={30} width={56} height={220} fill={SURFACE} />
      <line x1={56} y1={30} x2={56} y2={250} stroke={CHROME} strokeWidth={1} />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={16}
          y={52 + i * 34}
          width={24}
          height={24}
          rx={7}
          fill={i === active ? ACCENT_VAR[accent] : CHROME_SOFT}
          opacity={i === active ? 1 : 0.8}
        />
      ))}
    </g>
  );
}

function StatTiles({ accent, x }: { accent: CaseStudyAccent; x: number }) {
  const widths = [34, 50, 26];
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${x + i * 96}, 42)`}>
          <rect width={84} height={54} rx={10} fill={SURFACE} stroke={CHROME} />
          <rect x={12} y={12} width={widths[i]} height={8} rx={4} fill={ACCENT_VAR[accent]} />
          <rect x={12} y={30} width={50} height={6} rx={3} fill={CHROME} />
        </g>
      ))}
    </g>
  );
}

function LineChart({ accent, x, y, w, h }: { accent: CaseStudyAccent; x: number; y: number; w: number; h: number }) {
  const pts = [0.7, 0.5, 0.62, 0.34, 0.42, 0.2, 0.3];
  const step = w / (pts.length - 1);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${i * step},${h * p}`).join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={w} height={h + 24} rx={10} fill={SURFACE} stroke={CHROME} />
      <g transform="translate(14,10)">
        <path d={area} fill={ACCENT_WASH_VAR[accent]} />
        <path d={path} fill="none" stroke={ACCENT_VAR[accent]} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

function TableRows({ accent, x, y, w }: { accent: CaseStudyAccent; x: number; y: number; w: number }) {
  const rows = [0.9, 0.7, 0.8, 0.6];
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={w} height={22} fill={CHROME_SOFT} rx={6} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={16 + i * (w / 3)} y={8} width={w / 3 - 24} height={6} rx={3} fill={MUTED} />
      ))}
      {rows.map((r, i) => (
        <g key={i} transform={`translate(0, ${30 + i * 26})`}>
          <rect width={w} height={20} rx={6} fill={i % 2 ? SURFACE : "transparent"} />
          <circle cx={14} cy={10} r={4} fill={i === 0 ? ACCENT_VAR[accent] : CHROME} />
          {[0, 1, 2].map((c) => (
            <rect key={c} x={30 + c * (w / 3)} y={7} width={(w / 3 - 30) * r} height={6} rx={3} fill={CHROME} />
          ))}
        </g>
      ))}
    </g>
  );
}

function ProgressRing({ accent, cx, cy, pct, label }: { accent: CaseStudyAccent; cx: number; cy: number; pct: number; label: string }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r={r} fill="none" stroke={CHROME} strokeWidth={6} />
      <circle
        r={r}
        fill="none"
        stroke={ACCENT_VAR[accent]}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform="rotate(-90)"
      />
      <text y={4} textAnchor="middle" fontSize={9} fontFamily="sans-serif" fill="var(--color-muted)">
        {label}
      </text>
    </g>
  );
}

function ProductGrid({ accent, x, y }: { accent: CaseStudyAccent; x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <g key={i} transform={`translate(${col * 108}, ${row * 98})`}>
            <rect width={96} height={68} rx={8} fill={CHROME_SOFT} />
            <rect x={8} y={78} width={50} height={6} rx={3} fill={CHROME} />
            <rect x={8} y={88} width={28} height={7} rx={3} fill={ACCENT_VAR[accent]} />
          </g>
        );
      })}
    </g>
  );
}

function ListRowsWithThumb({ accent, x, y, w }: { accent: CaseStudyAccent; x: number; y: number; w: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(0, ${i * 40})`}>
          <rect width={w} height={32} rx={8} fill={i % 2 ? CHROME_SOFT : "transparent"} />
          <rect x={8} y={6} width={20} height={20} rx={5} fill={ACCENT_WASH_VAR[accent]} />
          <rect x={38} y={10} width={w * 0.35} height={6} rx={3} fill={CHROME} />
          <rect x={38} y={20} width={w * 0.18} height={5} rx={2.5} fill={MUTED} />
          <rect x={w - 46} y={12} width={34} height={9} rx={4.5} fill={ACCENT_VAR[accent]} opacity={0.85} />
        </g>
      ))}
    </g>
  );
}

function VendorList({ accent, x, y, w }: { accent: CaseStudyAccent; x: number; y: number; w: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0, ${i * 46})`}>
          <rect width={w} height={38} rx={10} fill={SURFACE} stroke={CHROME} />
          <circle cx={22} cy={19} r={11} fill={ACCENT_WASH_VAR[accent]} />
          <rect x={42} y={10} width={w * 0.3} height={6} rx={3} fill={CHROME} />
          {[0, 1, 2, 3, 4].map((s) => (
            <circle key={s} cx={42 + s * 8} cy={26} r={2.2} fill={ACCENT_VAR[accent]} opacity={0.8} />
          ))}
          <rect x={w - 54} y={12} width={40} height={14} rx={7} fill={ACCENT_VAR[accent]} />
        </g>
      ))}
    </g>
  );
}

function Kanban({ accent, x, y }: { accent: CaseStudyAccent; x: number; y: number }) {
  const cols = [2, 3, 1];
  return (
    <g transform={`translate(${x},${y})`}>
      {cols.map((count, ci) => (
        <g key={ci} transform={`translate(${ci * 116}, 0)`}>
          <rect width={104} height={190} rx={10} fill={CHROME_SOFT} />
          <rect x={10} y={10} width={44} height={7} rx={3.5} fill={ci === 1 ? ACCENT_VAR[accent] : CHROME} />
          {Array.from({ length: count }).map((_, ri) => (
            <g key={ri} transform={`translate(10, ${28 + ri * 52})`}>
              <rect width={84} height={42} rx={8} fill={SURFACE} stroke={CHROME} />
              <circle cx={16} cy={16} r={7} fill={ACCENT_WASH_VAR[accent]} />
              <rect x={30} y={11} width={40} height={5} rx={2.5} fill={CHROME} />
              <rect x={30} y={21} width={26} height={5} rx={2.5} fill={MUTED} />
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

function MediaMasonry({ x, y }: { x: number; y: number }) {
  const heights = [110, 70, 90, 60, 100, 78];
  return (
    <g transform={`translate(${x},${y})`}>
      {[0, 1, 2].map((col) => {
        const items = heights.filter((_, i) => i % 3 === col);
        let cursor = 0;
        return (
          <g key={col} transform={`translate(${col * 108}, 0)`}>
            {items.map((h, i) => {
              const yPos = cursor;
              cursor += h + 8;
              return <rect key={i} y={yPos} width={98} height={h} rx={8} fill={CHROME_SOFT} />;
            })}
          </g>
        );
      })}
    </g>
  );
}

function TravelCards({ accent, x, y }: { accent: CaseStudyAccent; x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${i * 172}, 0)`}>
          <rect width={160} height={130} rx={12} fill={CHROME_SOFT} />
          <rect x={10} y={10} width={54} height={20} rx={10} fill={ACCENT_VAR[accent]} />
          <rect x={10} y={96} width={90} height={7} rx={3.5} fill={SURFACE} opacity={0.9} />
          <rect x={10} y={110} width={54} height={6} rx={3} fill={SURFACE} opacity={0.7} />
        </g>
      ))}
    </g>
  );
}

export function CaseStudyVisual({
  kind,
  accent,
  label,
  className,
}: {
  kind: CaseStudyVisualKind;
  accent: CaseStudyAccent;
  label: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 250"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`Generic UI mockup representing the ${label} solution`}
    >
      <rect width={400} height={250} fill={SURFACE} />
      <TopBar label={label} />

      {kind === "student-analytics" && (
        <>
          <Sidebar accent={accent} active={0} />
          <StatTiles accent={accent} x={70} />
          <LineChart accent={accent} x={70} y={104} w={276} h={98} />
        </>
      )}

      {kind === "university-erp" && (
        <>
          <Sidebar accent={accent} active={2} />
          <TableRows accent={accent} x={72} y={44} w={296} />
        </>
      )}

      {kind === "career-guidance" && (
        <>
          <Sidebar accent={accent} active={3} />
          <ProgressRing accent={accent} cx={122} cy={100} pct={0.72} label="72%" />
          <ProgressRing accent={accent} cx={202} cy={100} pct={0.48} label="48%" />
          <ProgressRing accent={accent} cx={282} cy={100} pct={0.85} label="85%" />
          <TableRows accent={accent} x={72} y={150} w={296} />
        </>
      )}

      {kind === "fashion-commerce" && <ProductGrid accent={accent} x={16} y={46} />}

      {kind === "pharma-commerce" && <ListRowsWithThumb accent={accent} x={16} y={46} w={368} />}

      {kind === "food-marketplace" && <VendorList accent={accent} x={16} y={46} w={368} />}

      {kind === "recruitment-ats" && <Kanban accent={accent} x={22} y={46} />}

      {kind === "production-portfolio" && <MediaMasonry x={16} y={44} />}

      {kind === "travel-booking" && <TravelCards accent={accent} x={16} y={46} />}
    </svg>
  );
}

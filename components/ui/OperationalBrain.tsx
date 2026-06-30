"use client";

/* The "operational brain": business departments drifting and linking into one
   connected system — the literal picture of the hero headline. Pure SVG/CSS,
   slow and low-contrast so it never competes with the text. Motion is driven by
   CSS keyframes (wnr-drift / wnr-draw) which halt under prefers-reduced-motion. */

const NODES = [
  { id: "ops", label: "Operations", x: 50, y: 28, dx: "6px", dy: "-8px" },
  { id: "fin", label: "Finance", x: 22, y: 20, dx: "-7px", dy: "6px" },
  { id: "hr", label: "HR", x: 80, y: 24, dx: "8px", dy: "7px" },
  { id: "sales", label: "Sales", x: 26, y: 70, dx: "7px", dy: "-6px" },
  { id: "mgmt", label: "Management", x: 76, y: 72, dx: "-6px", dy: "-7px" },
];

// Every department links to the centre (Operations) — one connected system.
const LINKS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 3],
  [2, 4],
];

export function OperationalBrain() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* connective lines */}
      <g stroke="#C9A24B" strokeWidth="0.18" strokeOpacity="0.5">
        {LINKS.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            strokeDasharray="1.5 1.5"
            style={{
              animation: `wnr-draw ${10 + i * 1.5}s linear infinite`,
              ["--dash" as string]: "60",
            }}
          />
        ))}
      </g>

      {/* department nodes */}
      {NODES.map((n, i) => (
        <g
          key={n.id}
          style={{
            animation: `wnr-drift ${9 + i * 1.3}s ease-in-out infinite`,
            ["--dx" as string]: n.dx,
            ["--dy" as string]: n.dy,
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        >
          <circle cx={n.x} cy={n.y} r="1.1" fill="#C9A24B" fillOpacity="0.9" />
          <circle cx={n.x} cy={n.y} r="2.4" fill="none" stroke="#C9A24B" strokeOpacity="0.3" strokeWidth="0.15" />
          <text
            x={n.x}
            y={n.y - 3.4}
            textAnchor="middle"
            fontSize="2"
            fill="#F8F6F0"
            fillOpacity="0.5"
            fontFamily="var(--font-body)"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

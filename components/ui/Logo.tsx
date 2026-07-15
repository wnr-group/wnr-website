interface LogoProps {
  className?: string;
  light?: boolean; // true = for dark forest sections (wordmark in white)
  showWordmark?: boolean;
}

/**
 * WnR Group logo — a forest-green ring with a forward "›" motif (what's next),
 * paired with the wordmark. Inline SVG so it recolors per section.
 * Default renders for LIGHT backgrounds (green mark, ink wordmark).
 */
export function Logo({
  className = "",
  light = false,
  showWordmark = true,
}: LogoProps) {
  const mark = light ? "#FFFFFF" : "#124734";
  const wordColor = light ? "#FFFFFF" : "#0E1A13";
  const subColor = light ? "rgba(255,255,255,0.6)" : "#66716A";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-9 w-9 shrink-0"
        aria-hidden="true"
      >
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="11"
          stroke={mark}
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />
        <rect
          x="7.5"
          y="7.5"
          width="25"
          height="25"
          rx="7"
          fill={mark}
          fillOpacity={light ? "0.12" : "0.08"}
        />
        {/* forward bracket — "what's next" */}
        <path
          d="M16 13.5 L25 20 L16 26.5"
          stroke={mark}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className="font-display text-lg font-bold tracking-tight"
            style={{ color: wordColor }}
          >
            WnR Tech
          </span>
          <span
            className="text-[10px] font-medium uppercase tracking-[0.18em]"
            style={{ color: subColor }}
          >
            Wisdom &amp; Results
          </span>
        </span>
      )}
    </span>
  );
}

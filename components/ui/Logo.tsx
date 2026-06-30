interface LogoProps {
  className?: string;
  light?: boolean; // true = for dark forest sections (wordmark in cream)
  showWordmark?: boolean;
}

/**
 * WnR Group logo — a gold circular mark with a forward "›" motif (what's next),
 * paired with the wordmark. Inline SVG so it recolors per section.
 */
export function Logo({
  className = "",
  light = true,
  showWordmark = true,
}: LogoProps) {
  const wordColor = light ? "#F8F6F0" : "#0E3B2E";
  const subColor = light ? "rgba(248,246,240,0.55)" : "#5A6660";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-9 w-9 shrink-0"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="19" stroke="#C9A24B" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="14.5" fill="#C9A24B" fillOpacity="0.1" />
        {/* forward bracket — "what's next" */}
        <path
          d="M15 13 L24 20 L15 27"
          stroke="#C9A24B"
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
            WnR Group
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

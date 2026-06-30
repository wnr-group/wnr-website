"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  Sheet,
  Mail,
  FileText,
  CheckSquare,
  LayoutGrid,
} from "lucide-react";

/* Scattered tools (chaos) that resolve into one connected platform (clarity)
   when the section scrolls into view. Shown not told. Resolves immediately
   if the user prefers reduced motion. */

const ICONS = [MessageCircle, Sheet, Mail, FileText, CheckSquare, LayoutGrid];

// Scattered positions (chaos) → tidy grid slots (clarity), in %.
const SCATTER = [
  { x: 8, y: 6, r: -12 },
  { x: 64, y: 0, r: 9 },
  { x: 30, y: 30, r: -5 },
  { x: 78, y: 40, r: 14 },
  { x: 2, y: 58, r: 7 },
  { x: 52, y: 66, r: -10 },
];
const GRID = [
  { x: 8, y: 18 },
  { x: 40, y: 18 },
  { x: 72, y: 18 },
  { x: 8, y: 56 },
  { x: 40, y: 56 },
  { x: 72, y: 56 },
];

export function ScatterToSystem({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setResolved(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setResolved(true);
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-square w-full overflow-hidden rounded-2xl border border-hairline bg-paper p-2 shadow-[0_30px_60px_-32px_rgba(14,59,46,0.25)]"
    >
      {/* unifying frame appears as it resolves */}
      <div
        className="absolute inset-4 rounded-xl border-2 border-dashed border-gold/40 transition-opacity duration-700"
        style={{ opacity: resolved ? 1 : 0 }}
      />
      <div
        className="absolute left-1/2 top-[10%] -translate-x-1/2 rounded-full bg-forest px-3 py-1 text-[11px] font-semibold text-cream transition-all duration-700"
        style={{ opacity: resolved ? 1 : 0, transform: `translateX(-50%) translateY(${resolved ? 0 : -8}px)` }}
      >
        One connected system
      </div>

      {items.slice(0, 6).map((label, i) => {
        const Icon = ICONS[i % ICONS.length];
        const from = SCATTER[i];
        const to = GRID[i];
        const pos = resolved ? to : from;
        const rot = resolved ? 0 : from.r;
        return (
          <div
            key={label}
            className="absolute flex w-[26%] flex-col items-center gap-1.5 rounded-lg border border-hairline bg-cream px-2 py-3 text-center shadow-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `rotate(${rot}deg)`,
              transitionDelay: `${i * 70}ms`,
            }}
          >
            <Icon
              size={18}
              className={resolved ? "text-gold" : "text-muted"}
              strokeWidth={1.75}
            />
            <span className="text-[10px] font-medium leading-tight text-forest">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { TrendingUp, Activity, Users, Trophy } from "lucide-react";

/* -------------------------------------------------------------------------
   MIS Dashboard — the centrepiece.
   Phase 1: front-end-only mock. Numbers sit on believable ranges and tick
   on a slow loop with smooth easing so it reads as "alive", never random.
   Static seed values render on the server; animation starts after mount
   (avoids hydration mismatch). All motion halts under prefers-reduced-motion.
   ------------------------------------------------------------------------- */

// 7-day revenue trend (₹ thousands) — believable, gently rising.
const SEED_TREND = [182, 196, 174, 211, 224, 207, 238];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

export function MisDashboard() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // Live-ish values. Seeded so SSR + first client render match.
  const [revenue, setRevenue] = useState(248_600);
  const [sessions, setSessions] = useState(1_284);
  const [adoption, setAdoption] = useState(86);
  const [trend, setTrend] = useState<number[]>(SEED_TREND);
  const [, force] = useReducer((x) => x + 1, 0);

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    if (reduced) return;

    let revAccum = 248_600;
    let lastTick = 0;

    const loop = (t: number) => {
      // Revenue ticks up every ~2.4s by a believable ₹600–1400.
      if (t - lastTick > 2400) {
        lastTick = t;
        revAccum += 600 + Math.floor(Math.random() * 800);
        setRevenue(revAccum);
        // Sessions drift within a tight live band.
        setSessions((s) => {
          const next = s + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 4));
          return Math.min(1_340, Math.max(1_240, next));
        });
        // Adoption creeps toward target, never past 94.
        setAdoption((a) => Math.min(94, a + (Math.random() > 0.4 ? 1 : 0)));
        // Nudge the latest trend bar so the strip breathes.
        setTrend((prev) => {
          const next = [...prev];
          next[next.length - 1] = Math.min(
            252,
            Math.max(220, next[next.length - 1] + (Math.random() > 0.5 ? 3 : -2)),
          );
          return next;
        });
      }
      force();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  // Build the gold revenue line-chart path from the trend.
  const W = 280;
  const H = 80;
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const pts = trend.map((v, i) => {
    const x = (i / (trend.length - 1)) * W;
    const y = H - ((v - min) / (max - min || 1)) * (H - 12) - 6;
    return [x, y] as const;
  });
  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;

  // Adoption ring geometry.
  const R = 30;
  const C = 2 * Math.PI * R;
  const ringOffset = C - (adoption / 100) * C;

  return (
    <div className="relative">
      {/* device frame */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-forest-2/40 shadow-[0_40px_80px_-32px_rgba(0,0,0,0.6)] backdrop-blur-sm">
        {/* frame chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gold/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold/15" />
          <span className="ml-3 flex items-center gap-2 text-xs font-medium text-cream/55">
            <span className="relative flex h-2 w-2">
              {!reduced && mounted && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            WnR MIS · Live
          </span>
        </div>

        {/* tiles */}
        <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-4">
          {/* Revenue */}
          <Tile className="col-span-2">
            <TileHead icon={<TrendingUp size={15} />} label="Revenue · today" />
            <p className="font-display text-2xl font-bold tabular-nums text-cream md:text-3xl">
              {inr(revenue)}
            </p>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mt-2 h-14 w-full"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="rev-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#C9A24B" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#C9A24B" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#rev-fill)" />
              <path
                d={linePath}
                fill="none"
                stroke="#C9A24B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {pts.length > 0 && (
                <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill="#C9A24B" />
              )}
            </svg>
          </Tile>

          {/* Operations */}
          <Tile>
            <TileHead icon={<Activity size={15} />} label="Active sessions" />
            <p className="font-display text-2xl font-bold tabular-nums text-cream md:text-3xl">
              {sessions.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-cream/45">across 41 deployments</p>
          </Tile>

          {/* Adoption ring */}
          <Tile>
            <TileHead icon={<Users size={15} />} label="Adoption" />
            <div className="mt-1 flex items-center gap-3">
              <svg viewBox="0 0 72 72" className="h-16 w-16 -rotate-90" aria-hidden="true">
                <circle cx="36" cy="36" r={R} fill="none" stroke="rgba(248,246,240,0.12)" strokeWidth="6" />
                <circle
                  cx="36"
                  cy="36"
                  r={R}
                  fill="none"
                  stroke="#C9A24B"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={mounted ? ringOffset : C}
                  style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)" }}
                />
              </svg>
              <div>
                <p className="font-display text-2xl font-bold tabular-nums text-cream">
                  {adoption}%
                </p>
                <p className="text-xs text-cream/45">to target</p>
              </div>
            </div>
          </Tile>

          {/* Performance callout */}
          <Tile className="col-span-2 sm:col-span-4">
            <TileHead icon={<Trophy size={15} />} label="Top performer" />
            <p className="text-sm leading-relaxed text-cream/85">
              <span className="font-semibold text-gold">Coimbatore branch</span> leads
              this week — <span className="tabular-nums">+18%</span> revenue, fastest
              session turnover, highest staff adoption.
            </p>
          </Tile>
        </div>

        {/* 7-day trend strip */}
        <div className="border-t border-white/10 px-5 py-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-cream/55">7-day revenue trend</span>
            <span className="text-xs tabular-nums text-emerald-400">▲ 12.4%</span>
          </div>
          <div className="flex h-12 items-end gap-1.5">
            {trend.map((v, i) => {
              const h = ((v - min) / (max - min || 1)) * 100;
              const isLast = i === trend.length - 1;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-9 w-full items-end">
                    <div
                      className={`w-full rounded-sm ${isLast ? "bg-gold" : "bg-gold/35"}`}
                      style={{
                        height: `${Math.max(12, h)}%`,
                        transition: "height 700ms cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-cream/35">{DAYS[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tile({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col bg-forest-deep/60 p-5 ${className}`}>{children}</div>
  );
}

function TileHead({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gold/80">
      <span className="text-gold">{icon}</span>
      {label}
    </span>
  );
}

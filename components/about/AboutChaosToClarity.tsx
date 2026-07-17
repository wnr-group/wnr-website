"use client";

import React, { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  FileSpreadsheet,
  Mail,
  Layers,
  Database,
  Workflow,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/motion";
import { aboutWhyWeExist } from "@/content/about";
import { cn } from "@/lib/utils";

export function AboutChaosToClarity() {
  // Allow user to toggle or observe the transformation from Chaos to Clarity
  const [isClarity, setIsClarity] = useState(true);

  return (
    <Section id="why-we-exist" tone="canvas" className="py-24 md:py-36 border-b border-line overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Exact Story Copy */}
          <Reveal className="lg:col-span-5 flex flex-col items-start" delay={0.1}>
            <Eyebrow>{aboutWhyWeExist.eyebrow}</Eyebrow>
            <h2 className="mt-5 font-display text-[length:var(--text-h2)] font-bold leading-[1.05] text-ink">
              Businesses don&apos;t fail from lack of effort.{" "}
              <span className="text-forest">They drown in complexity.</span>
            </h2>
            {aboutWhyWeExist.paragraphs.map((p, i) => (
              <p key={i} className="mt-6 text-[length:var(--text-lead)] leading-relaxed text-body">
                {p}
              </p>
            ))}

            {/* Exact Chaos vs Clarity Checklist from content/about.ts */}
            <div className="mt-8 w-full rounded-2xl border border-line bg-mist p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-muted mb-3 flex items-center justify-between">
                <span>Operational Friction points</span>
                <span className="text-[10px] text-forest font-semibold">Transforming to {aboutWhyWeExist.claritySystem}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-medium text-body">
                {aboutWhyWeExist.chaosTools.map((tool) => (
                  <div key={tool} className="flex items-center gap-2 py-1">
                    <span className={cn("h-1.5 w-1.5 rounded-full", isClarity ? "bg-forest" : "bg-[#b8791f]")} />
                    <span className={cn(isClarity && "text-ink font-semibold")}>{tool}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive State Control Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-3xl sm:rounded-full border border-line bg-mist p-1.5 shadow-inner">
              <button
                type="button"
                aria-pressed={!isClarity}
                onClick={() => setIsClarity(false)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer",
                  !isClarity
                    ? "bg-[#b8791f] text-white shadow-md scale-105"
                    : "text-muted hover:text-ink"
                )}
              >
                <AlertCircle size={14} />
                <span>Chaos (Old Way)</span>
              </button>
              <button
                type="button"
                aria-pressed={isClarity}
                onClick={() => setIsClarity(true)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer",
                  isClarity
                    ? "bg-forest text-white shadow-md scale-105"
                    : "text-muted hover:text-ink"
                )}
              >
                <Sparkles size={14} />
                <span>Clarity (WnR System)</span>
              </button>
            </div>
          </Reveal>

          {/* Right Column: Animated Chaos vs Clarity Node Diagram */}
          <Reveal className="lg:col-span-7 w-full" delay={0.2}>
            <div className="relative w-full rounded-3xl border border-line bg-paper p-6 sm:p-12 shadow-card overflow-hidden min-h-[480px] sm:min-h-[520px] flex flex-col items-center justify-center">
              {/* Background Blueprint Grid */}
              <div
                className={cn(
                  "grid-blueprint pointer-events-none absolute inset-0 transition-opacity duration-700",
                  isClarity ? "opacity-60" : "opacity-25"
                )}
                aria-hidden="true"
              />

              {/* Status Header inside diagram */}
              <div className="absolute top-5 sm:top-6 left-5 sm:left-6 right-5 sm:right-6 flex flex-wrap items-center justify-between gap-3 z-20">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "h-3 w-3 rounded-full animate-pulse transition-colors duration-500",
                      isClarity ? "bg-forest-bright" : "bg-[#b8791f]"
                    )}
                  />
                  <span className="font-display text-[11px] sm:text-xs font-bold uppercase tracking-widest text-muted">
                    {isClarity ? "Status: Unified Brain" : "Status: Scattered Tools"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsClarity(!isClarity)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-deep transition-colors bg-forest-wash px-3 py-1.5 rounded-full border border-forest/20 cursor-pointer"
                >
                  <RefreshCw size={12} className={cn("transition-transform duration-500", isClarity && "rotate-180")} />
                  <span>Switch State</span>
                </button>
              </div>

              {/* Diagram Canvas */}
              <div className="relative w-full max-w-xl min-h-[380px] sm:min-h-[360px] aspect-[16/11] my-10 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!isClarity ? (
                    /* CHAOS STATE: Scattered disconnected nodes representing all 6 tools */
                    <m.div
                      key="chaos"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {/* Broken red/amber friction lines */}
                      <svg viewBox="0 0 512 360" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                        <line x1="18%" y1="18%" x2="78%" y2="78%" stroke="#b8791f" strokeWidth="1.5" strokeDasharray="4 4" />
                        <line x1="82%" y1="18%" x2="28%" y2="78%" stroke="#b8791f" strokeWidth="1.5" strokeDasharray="4 4" />
                        <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#b8791f" strokeWidth="1.5" strokeDasharray="4 4" />
                      </svg>

                      {/* Top Left: WhatsApp threads */}
                      <m.div
                        animate={{ y: [-4, 6, -4], x: [-3, 3, -3] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute top-[2%] left-[1%] sm:left-[3%] flex flex-col items-center gap-1 rounded-xl sm:rounded-2xl border border-[#b8791f]/40 bg-[#f7efe0] p-2 sm:p-3 shadow-md text-center max-w-[105px] sm:max-w-[130px] z-10"
                      >
                        <MessageSquare size={18} className="text-[#b8791f]" />
                        <span className="font-display text-[10px] sm:text-xs font-bold text-ink leading-tight">WhatsApp Threads</span>
                      </m.div>

                      {/* Top Right: Excel sheets */}
                      <m.div
                        animate={{ y: [5, -5, 5], x: [3, -3, 3] }}
                        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                        className="absolute top-[2%] right-[1%] sm:right-[3%] flex flex-col items-center gap-1 rounded-xl sm:rounded-2xl border border-[#b8791f]/40 bg-[#f7efe0] p-2 sm:p-3 shadow-md text-center max-w-[105px] sm:max-w-[130px] z-10"
                      >
                        <FileSpreadsheet size={18} className="text-[#b8791f]" />
                        <span className="font-display text-[10px] sm:text-xs font-bold text-ink leading-tight">Excel Sheets</span>
                      </m.div>

                      {/* Mid Left: Scattered emails */}
                      <m.div
                        animate={{ y: [-5, 4, -5] }}
                        transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
                        className="absolute top-[40%] left-[0%] sm:left-[2%] flex flex-col items-center gap-1 rounded-xl sm:rounded-2xl border border-[#b8791f]/40 bg-[#f7efe0] p-2 sm:p-3 shadow-md text-center max-w-[105px] sm:max-w-[130px] z-10"
                      >
                        <Mail size={18} className="text-[#b8791f]" />
                        <span className="font-display text-[10px] sm:text-xs font-bold text-ink leading-tight">Scattered Emails</span>
                      </m.div>

                      {/* Mid Right: Disconnected software */}
                      <m.div
                        animate={{ y: [4, -4, 4] }}
                        transition={{ repeat: Infinity, duration: 4.1, ease: "easeInOut" }}
                        className="absolute top-[40%] right-[0%] sm:right-[2%] flex flex-col items-center gap-1 rounded-xl sm:rounded-2xl border border-[#b8791f]/40 bg-[#f7efe0] p-2 sm:p-3 shadow-md text-center max-w-[105px] sm:max-w-[130px] z-10"
                      >
                        <Layers size={18} className="text-[#b8791f]" />
                        <span className="font-display text-[10px] sm:text-xs font-bold text-ink leading-tight">Disconnected Software</span>
                      </m.div>

                      {/* Bottom Left: Siloed databases */}
                      <m.div
                        animate={{ y: [-6, 4, -6] }}
                        transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
                        className="absolute bottom-[2%] left-[4%] sm:left-[8%] flex flex-col items-center gap-1 rounded-xl sm:rounded-2xl border border-[#b8791f]/40 bg-[#f7efe0] p-2 sm:p-3 shadow-md text-center max-w-[105px] sm:max-w-[130px] z-10"
                      >
                        <Database size={18} className="text-[#b8791f]" />
                        <span className="font-display text-[10px] sm:text-xs font-bold text-ink leading-tight">Siloed Databases</span>
                      </m.div>

                      {/* Bottom Right: Manual approval chains */}
                      <m.div
                        animate={{ y: [6, -4, 6] }}
                        transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
                        className="absolute bottom-[2%] right-[4%] sm:right-[8%] flex flex-col items-center gap-1 rounded-xl sm:rounded-2xl border border-[#b8791f]/40 bg-[#f7efe0] p-2 sm:p-3 shadow-md text-center max-w-[105px] sm:max-w-[130px] z-10"
                      >
                        <Workflow size={18} className="text-[#b8791f]" />
                        <span className="font-display text-[10px] sm:text-xs font-bold text-ink leading-tight">Manual Approvals</span>
                      </m.div>

                      {/* Friction indicator center badge */}
                      <div className="z-20 rounded-full border-2 border-dashed border-[#b8791f] bg-paper px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg text-center flex flex-col items-center max-w-[180px] sm:max-w-xs">
                        <AlertCircle size={22} className="text-[#b8791f] animate-bounce" />
                        <span className="font-display text-xs font-black uppercase tracking-wider text-ink mt-1">
                          No Single Truth
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-muted">Decisions slow down</span>
                      </div>
                    </m.div>
                  ) : (
                    /* CLARITY STATE: Connected operational brain connecting all 6 dimensions */
                    <m.div
                      key="clarity"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {/* Animated green connector lines flowing into center from 6 directions */}
                      <svg viewBox="0 0 512 360" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        <m.path
                          d="M 90 50 L 256 180"
                          stroke="var(--color-forest)"
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                        <m.path
                          d="M 420 50 L 256 180"
                          stroke="var(--color-forest)"
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.08 }}
                        />
                        <m.path
                          d="M 60 180 L 256 180"
                          stroke="var(--color-forest)"
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.16 }}
                        />
                        <m.path
                          d="M 452 180 L 256 180"
                          stroke="var(--color-forest)"
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.24 }}
                        />
                        <m.path
                          d="M 110 310 L 256 180"
                          stroke="var(--color-forest)"
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.32 }}
                        />
                        <m.path
                          d="M 400 310 L 256 180"
                          stroke="var(--color-forest)"
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        />
                      </svg>

                      {/* Harmonized input nodes */}
                      <div className="absolute top-[4%] left-[2%] sm:left-[5%] flex items-center gap-2 rounded-xl sm:rounded-2xl border border-forest/30 bg-forest-wash px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-sm text-left z-10">
                        <div className="rounded-lg bg-forest text-white p-1">
                          <MessageSquare size={13} />
                        </div>
                        <span className="font-display text-[10px] sm:text-xs font-bold text-ink">Unified Chat</span>
                      </div>

                      <div className="absolute top-[4%] right-[2%] sm:right-[5%] flex items-center gap-2 rounded-xl sm:rounded-2xl border border-forest/30 bg-forest-wash px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-sm text-left z-10">
                        <div className="rounded-lg bg-forest text-white p-1">
                          <FileSpreadsheet size={13} />
                        </div>
                        <span className="font-display text-[10px] sm:text-xs font-bold text-ink">Live Tables</span>
                      </div>

                      <div className="absolute top-[42%] left-[0%] sm:left-[2%] flex items-center gap-2 rounded-xl sm:rounded-2xl border border-forest/30 bg-forest-wash px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-sm text-left z-10">
                        <div className="rounded-lg bg-forest text-white p-1">
                          <Mail size={13} />
                        </div>
                        <span className="font-display text-[10px] sm:text-xs font-bold text-ink">Automated Alerts</span>
                      </div>

                      <div className="absolute top-[42%] right-[0%] sm:right-[2%] flex items-center gap-2 rounded-xl sm:rounded-2xl border border-forest/30 bg-forest-wash px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-sm text-left z-10">
                        <div className="rounded-lg bg-forest text-white p-1">
                          <Layers size={13} />
                        </div>
                        <span className="font-display text-[10px] sm:text-xs font-bold text-ink">Connected APIs</span>
                      </div>

                      <div className="absolute bottom-[4%] left-[4%] sm:left-[8%] flex items-center gap-2 rounded-xl sm:rounded-2xl border border-forest/30 bg-forest-wash px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-sm text-left z-10">
                        <div className="rounded-lg bg-forest text-white p-1">
                          <Database size={13} />
                        </div>
                        <span className="font-display text-[10px] sm:text-xs font-bold text-ink">Single Database</span>
                      </div>

                      <div className="absolute bottom-[4%] right-[4%] sm:right-[8%] flex items-center gap-2 rounded-xl sm:rounded-2xl border border-forest/30 bg-forest-wash px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-sm text-left z-10">
                        <div className="rounded-lg bg-forest text-white p-1">
                          <Workflow size={13} />
                        </div>
                        <span className="font-display text-[10px] sm:text-xs font-bold text-ink">Smart Approvals</span>
                      </div>

                      {/* Central Operational Brain Node */}
                      <m.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="z-20 flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-forest bg-[linear-gradient(135deg,var(--color-forest)_0%,var(--color-forest-deep)_100%)] px-5 sm:px-8 py-4 sm:py-6 text-white shadow-xl text-center max-w-[200px] sm:max-w-xs"
                      >
                        <div className="inline-flex items-center justify-center rounded-full bg-white/20 p-2.5 mb-2">
                          <Sparkles size={24} className="text-forest-bright" />
                        </div>
                        <span className="font-display text-base sm:text-lg font-black tracking-tight">
                          WnR Operational Brain
                        </span>
                        <span className="text-xs uppercase tracking-widest text-forest-wash font-medium mt-1">
                          {aboutWhyWeExist.claritySystem}
                        </span>
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-forest-bright/30 px-3 py-1 text-[11px] font-semibold text-white">
                          <CheckCircle2 size={13} />
                          <span>Real-Time Clarity</span>
                        </div>
                      </m.div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom caption */}
              <div className="text-center text-xs text-muted max-w-md">
                {isClarity
                  ? "Every tool synchronized into one intelligent operating system — removing silos and accelerating decisions."
                  : "Disconnected software forces manual coordination, scattering critical business intelligence across six isolated channels."}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

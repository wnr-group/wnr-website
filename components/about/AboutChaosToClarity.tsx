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
  ArrowRight,
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

            {/* Interactive State Control Pills */}
            <div className="mt-8 flex items-center gap-2 rounded-full border border-line bg-mist p-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => setIsClarity(false)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300",
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
                onClick={() => setIsClarity(true)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300",
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
            <div className="relative w-full rounded-3xl border border-line bg-paper p-8 sm:p-12 shadow-card overflow-hidden min-h-[460px] flex flex-col items-center justify-center">
              {/* Background Blueprint Grid */}
              <div
                className={cn(
                  "grid-blueprint pointer-events-none absolute inset-0 transition-opacity duration-700",
                  isClarity ? "opacity-60" : "opacity-25"
                )}
                aria-hidden="true"
              />

              {/* Status Header inside diagram */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "h-3 w-3 rounded-full animate-pulse transition-colors duration-500",
                      isClarity ? "bg-forest-bright" : "bg-[#b8791f]"
                    )}
                  />
                  <span className="font-display text-xs font-bold uppercase tracking-widest text-muted">
                    {isClarity ? "System Status: Unified Brain" : "System Status: Scattered Tools"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsClarity(!isClarity)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-deep transition-colors bg-forest-wash px-3 py-1.5 rounded-full border border-forest/20"
                >
                  <RefreshCw size={12} className={cn("transition-transform duration-500", isClarity && "rotate-180")} />
                  <span>Switch State</span>
                </button>
              </div>

              {/* Diagram Canvas */}
              <div className="relative w-full max-w-lg h-80 my-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!isClarity ? (
                    /* CHAOS STATE: Scattered disconnected nodes */
                    <m.div
                      key="chaos"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {/* Broken red/amber friction lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                        <line x1="20%" y1="25%" x2="75%" y2="70%" stroke="#b8791f" strokeWidth="1.5" strokeDasharray="4 4" />
                        <line x1="80%" y1="25%" x2="30%" y2="75%" stroke="#b8791f" strokeWidth="1.5" strokeDasharray="4 4" />
                        <line x1="50%" y1="15%" x2="50%" y2="85%" stroke="#b8791f" strokeWidth="1.5" strokeDasharray="4 4" />
                      </svg>

                      {/* Floating disconnected tool nodes */}
                      <m.div
                        animate={{ y: [-4, 6, -4], x: [-3, 3, -3] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute top-4 left-6 flex flex-col items-center gap-1.5 rounded-2xl border border-[#b8791f]/40 bg-[#f7efe0] p-4 shadow-md text-center max-w-[140px]"
                      >
                        <MessageSquare size={22} className="text-[#b8791f]" />
                        <span className="font-display text-xs font-bold text-ink">WhatsApp Threads</span>
                        <span className="text-[10px] text-[#b8791f] font-semibold">Siloed chats</span>
                      </m.div>

                      <m.div
                        animate={{ y: [5, -5, 5], x: [3, -3, 3] }}
                        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                        className="absolute top-4 right-6 flex flex-col items-center gap-1.5 rounded-2xl border border-[#b8791f]/40 bg-[#f7efe0] p-4 shadow-md text-center max-w-[140px]"
                      >
                        <FileSpreadsheet size={22} className="text-[#b8791f]" />
                        <span className="font-display text-xs font-bold text-ink">Excel Sheets</span>
                        <span className="text-[10px] text-[#b8791f] font-semibold">Version chaos</span>
                      </m.div>

                      <m.div
                        animate={{ y: [-6, 4, -6] }}
                        transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
                        className="absolute bottom-6 left-12 flex flex-col items-center gap-1.5 rounded-2xl border border-[#b8791f]/40 bg-[#f7efe0] p-4 shadow-md text-center max-w-[140px]"
                      >
                        <Mail size={22} className="text-[#b8791f]" />
                        <span className="font-display text-xs font-bold text-ink">Scattered Emails</span>
                        <span className="text-[10px] text-[#b8791f] font-semibold">Lost requests</span>
                      </m.div>

                      <m.div
                        animate={{ y: [6, -4, 6] }}
                        transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
                        className="absolute bottom-6 right-12 flex flex-col items-center gap-1.5 rounded-2xl border border-[#b8791f]/40 bg-[#f7efe0] p-4 shadow-md text-center max-w-[140px]"
                      >
                        <Database size={22} className="text-[#b8791f]" />
                        <span className="font-display text-xs font-bold text-ink">Isolated Tools</span>
                        <span className="text-[10px] text-[#b8791f] font-semibold">No sync</span>
                      </m.div>

                      {/* Friction indicator center badge */}
                      <div className="z-10 rounded-full border-2 border-dashed border-[#b8791f] bg-paper px-6 py-3 shadow-lg text-center flex flex-col items-center">
                        <AlertCircle size={24} className="text-[#b8791f] animate-bounce" />
                        <span className="font-display text-xs font-black uppercase tracking-wider text-ink mt-1">
                          No Single Truth
                        </span>
                        <span className="text-[11px] text-muted">Decisions slow down</span>
                      </div>
                    </m.div>
                  ) : (
                    /* CLARITY STATE: Connected operational brain */
                    <m.div
                      key="clarity"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {/* Animated green connector lines flowing into center */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        <m.path
                          d="M 90 60 L 256 160"
                          stroke="var(--color-forest)"
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <m.path
                          d="M 420 60 L 256 160"
                          stroke="var(--color-forest)"
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                        />
                        <m.path
                          d="M 120 260 L 256 160"
                          stroke="var(--color-forest)"
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        />
                        <m.path
                          d="M 390 260 L 256 160"
                          stroke="var(--color-forest)"
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        />
                      </svg>

                      {/* Harmonized input nodes */}
                      <div className="absolute top-4 left-6 flex items-center gap-2.5 rounded-2xl border border-forest/30 bg-forest-wash px-3.5 py-2.5 shadow-sm text-left">
                        <div className="rounded-lg bg-forest text-white p-1.5">
                          <MessageSquare size={16} />
                        </div>
                        <span className="font-display text-xs font-bold text-ink">Communication</span>
                      </div>

                      <div className="absolute top-4 right-6 flex items-center gap-2.5 rounded-2xl border border-forest/30 bg-forest-wash px-3.5 py-2.5 shadow-sm text-left">
                        <div className="rounded-lg bg-forest text-white p-1.5">
                          <FileSpreadsheet size={16} />
                        </div>
                        <span className="font-display text-xs font-bold text-ink">Structured Data</span>
                      </div>

                      <div className="absolute bottom-6 left-12 flex items-center gap-2.5 rounded-2xl border border-forest/30 bg-forest-wash px-3.5 py-2.5 shadow-sm text-left">
                        <div className="rounded-lg bg-forest text-white p-1.5">
                          <Workflow size={16} />
                        </div>
                        <span className="font-display text-xs font-bold text-ink">Workflows</span>
                      </div>

                      <div className="absolute bottom-6 right-12 flex items-center gap-2.5 rounded-2xl border border-forest/30 bg-forest-wash px-3.5 py-2.5 shadow-sm text-left">
                        <div className="rounded-lg bg-forest text-white p-1.5">
                          <Database size={16} />
                        </div>
                        <span className="font-display text-xs font-bold text-ink">Live Analytics</span>
                      </div>

                      {/* Central Operational Brain Node */}
                      <m.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="z-20 flex flex-col items-center justify-center rounded-3xl border-2 border-forest bg-[linear-gradient(135deg,var(--color-forest)_0%,var(--color-forest-deep)_100%)] px-8 py-6 text-white shadow-xl text-center max-w-xs"
                      >
                        <div className="inline-flex items-center justify-center rounded-full bg-white/20 p-2.5 mb-2">
                          <Sparkles size={24} className="text-forest-bright" />
                        </div>
                        <span className="font-display text-base sm:text-lg font-black tracking-tight">
                          WnR Operational Brain
                        </span>
                        <span className="text-xs uppercase tracking-widest text-forest-wash font-medium mt-1">
                          Single Source of Truth
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
                  : "Disconnected software forces manual coordination, scattering critical business intelligence."}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Sparkles, X } from "lucide-react";
import { eduOsExperience } from "@/content/eduos";
import { cn } from "@/lib/utils";

/* Only the story content (Hero through Closing — all the text, the roadmap's
   scroll-progress logic, every subsection) is dynamically imported, and only
   mounted after the first open. Root/Trigger/Backdrop/Popup/header below are
   cheap chrome and stay eager, matching Base UI's normal co-located
   Root+Trigger pattern (the same one components/sections/careers/ResumeDialog.tsx
   already uses successfully) — that's what gives the dialog correct focus
   trap/ESC/outside-click wiring for free. An earlier version tried to keep the
   Trigger detached from a lazily-mounted Root via Dialog.createHandle(); that
   left the dialog never actually opening, because the Trigger's own open
   signal fired before Root existed in the tree to receive it. */
const EduOsStory = dynamic(() => import("./EduOsStory").then((mod) => mod.EduOsStory), {
  ssr: false,
});

/** Premium CTA + modal shell that presents the full EduOS storytelling
 *  experience. Lives inside AboutEduOsAnchor; fully self-contained and
 *  isolated from every other About-page section and from the shared
 *  components/ui/dialog.tsx (that component is a fixed small centered card,
 *  unsuited to this 90vw/90vh immersive layout, so this builds directly on
 *  the same @base-ui/react/dialog primitives instead of extending it). */
export function EduOsModal({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setEverOpened(true);
      }}
    >
      <DialogPrimitive.Trigger
        className={cn(
          "group inline-flex items-center justify-center gap-2.5 rounded-full bg-[linear-gradient(135deg,#c9a24b_0%,#a6822f_100%)] px-7 py-3.5 text-sm font-semibold tracking-tight text-ink shadow-[0_14px_32px_-14px_rgba(201,162,75,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-14px_rgba(201,162,75,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2e20] active:scale-[0.98]",
          className,
        )}
      >
        <Sparkles size={16} className="transition-transform duration-300 group-hover:rotate-12" />
        Discover EduOS
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md opacity-0 transition-opacity duration-300 ease-out data-[open]:opacity-100 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none" />
        <DialogPrimitive.Popup className="fixed left-1/2 top-1/2 z-[100] flex h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 scale-95 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(165deg,#0b2e20_0%,#0e1a13_60%,#0a1911_100%)] opacity-0 shadow-2xl transition-[opacity,transform] duration-300 ease-out focus:outline-none data-[open]:scale-100 data-[open]:opacity-100 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 motion-reduce:transition-none sm:rounded-[2rem]">
          {/* Ambient decoration — mirrors AboutEduOsAnchor's cinematic language, kept local to this component */}
          <div
            className="grid-blueprint pointer-events-none absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_top,white,transparent_75%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(31,122,84,0.35)_0%,transparent_70%)] blur-3xl"
            aria-hidden="true"
          />

          {/* Sticky header: compact brand mark + close */}
          <div className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-black/20 px-5 py-4 backdrop-blur-md sm:px-8">
            <div>
              <DialogPrimitive.Title className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-[#c9a24b]">
                {eduOsExperience.closing.wordmark}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-0.5 text-xs text-white/50">
                {eduOsExperience.eyebrow}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              aria-label="Close EduOS story"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24b]"
            >
              <X size={18} />
            </DialogPrimitive.Close>
          </div>

          {/* Scrollable story — lazy-loaded, only mounted after first open */}
          <div ref={scrollContainerRef} className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-5 py-14 sm:px-10 sm:py-20 lg:px-16">
            {everOpened && <EduOsStory onClose={() => setOpen(false)} scrollContainerRef={scrollContainerRef} />}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

"use client";

import { m } from "motion/react";

/* Page-transition wrapper. Templates remount on every route change (unlike
   layouts), so this fades + rises each page in on navigation and first load.
   Enter-only — App Router can't cleanly hold the outgoing tree without router
   hacks, and a crisp enter reads better on a clean corporate site than a laggy
   exit. reducedMotion (set in MotionProvider) drops the rise for those users. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}

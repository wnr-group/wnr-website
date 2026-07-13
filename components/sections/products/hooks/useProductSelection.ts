"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product, RegisterTrigger } from "../types";

/* Owns which product's in-page hero is open. Restores keyboard focus to the
   card that opened the hero when it closes (WCAG focus-restoration), and
   closes on Escape. Uses requestAnimationFrame instead of focusing
   synchronously so focus moves after the exit transition has started
   rendering, matching how components/layout/Header.tsx sequences its own
   AnimatePresence exit. */
export function useProductSelection() {
  const [selected, setSelected] = useState<Product | null>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const heroRef = useRef<HTMLDivElement | null>(null);

  const registerTrigger: RegisterTrigger = useCallback((slug, el) => {
    if (el) {
      triggerRefs.current.set(slug, el);
    } else {
      triggerRefs.current.delete(slug);
    }
  }, []);

  const open = useCallback((product: Product) => {
    setSelected(product);
  }, []);

  const close = useCallback(() => {
    setSelected((current) => {
      if (current) {
        const trigger = triggerRefs.current.get(current.slug);
        requestAnimationFrame(() => trigger?.focus());
      }
      return null;
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, close]);

  useEffect(() => {
    if (!selected) return;
    const id = requestAnimationFrame(() => heroRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [selected]);

  return { selected, open, close, registerTrigger, heroRef };
}

"use client";

import { useEffect } from "react";

let activeLocks = 0;

// Counted so the tour and the lightbox on top of it can both hold the lock without the second
// one unlocking the page when it closes. The body gets the scrollbar's width back as padding so
// the page underneath doesn't jump sideways, while fixed overlays still span the full window
// exactly like the reference.
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    if (activeLocks++ === 0) {
      const scrollbarWidth = window.innerWidth - root.clientWidth;
      root.style.overflow = "hidden";
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      if (--activeLocks === 0) {
        root.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    };
  }, [active]);
}

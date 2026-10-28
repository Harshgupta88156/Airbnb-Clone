"use client";

import { useEffect, useState } from "react";

// Keeps an overlay mounted long enough to play its exit transition. Entry transitions come
// from CSS `@starting-style`, so there is nothing to orchestrate on open.
export function usePresence(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open);

  // Adjusting state during render (instead of in an effect) mounts the overlay in the same
  // commit that flips `open`, so there is no empty frame before the entry transition.
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open || !mounted) return;
    const timer = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(timer);
  }, [open, mounted, exitMs]);

  return { mounted, exiting: mounted && !open };
}

// Script-driven scrolls ignore the CSS reduced-motion override, so each call site asks here.
export function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

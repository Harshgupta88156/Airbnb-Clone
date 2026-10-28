"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "wishlist:mirashya-ug10";
const CHANGE_EVENT = "wishlist-change";

// Fallback for when storage is blocked (private mode, strict cookie settings): the heart still
// works for the current page view, it just isn't remembered.
let savedInMemory = false;

function readSaved(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return savedInMemory;
  }
}

function writeSaved(saved: boolean) {
  try {
    if (saved) window.localStorage.setItem(STORAGE_KEY, "1");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    savedInMemory = saved;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function useWishlist() {
  // The server renders "not saved"; the stored value takes over right after hydration.
  const isSaved = useSyncExternalStore(subscribe, readSaved, () => false);

  const toggle = useCallback(() => {
    const next = !readSaved();
    writeSaved(next);
    return next;
  }, []);

  return { isSaved, toggle };
}

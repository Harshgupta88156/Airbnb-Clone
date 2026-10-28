"use client";

import { useCallback } from "react";
import { useToast } from "@/components/ui/Toast";
import { useWishlist } from "@/hooks/useWishlist";

// Share and Save appear both in the title row and in the photo tour header; they share state
// and the same confirmation toasts.
export function useShareAndSave() {
  const notify = useToast();
  const { isSaved, toggle } = useWishlist();

  const share = useCallback(() => notify("Share options"), [notify]);
  const toggleSave = useCallback(() => {
    notify(toggle() ? "Saved to wishlist" : "Removed from wishlist");
  }, [notify, toggle]);

  return { isSaved, share, toggleSave };
}

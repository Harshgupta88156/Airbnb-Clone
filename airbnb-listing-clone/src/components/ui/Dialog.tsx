"use client";

import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  label: string;
  // False while the exit transition plays: focus and inertness are released immediately so
  // the page is usable again even though the overlay is still fading out.
  active: boolean;
  onClose: () => void;
  initialFocus?: RefObject<HTMLElement | null>;
  children: ReactNode;
}

// Dialogs can stack (the lightbox opens over the tour, and a shared link opens both at once), so
// inertness is recomputed from one stack instead of each dialog saving and restoring it: only the
// top dialog stays interactive, and only elements this module made inert are ever released.
const openDialogs: HTMLElement[] = [];
const madeInert = new Set<HTMLElement>();

function syncInertness() {
  const top = openDialogs.at(-1);
  for (const element of document.body.children) {
    if (!(element instanceof HTMLElement) || element.hasAttribute("data-dialog-exempt")) continue;
    const shouldBeInert = top !== undefined && element !== top;
    if (shouldBeInert && !element.inert) {
      element.inert = true;
      madeInert.add(element);
    } else if (!shouldBeInert && madeInert.has(element)) {
      element.inert = false;
      madeInert.delete(element);
    }
  }
}

// The reference leaves focus behind the overlay and lets Tab wander into the page underneath.
// This dialog fixes that: focus moves in, the rest of the document goes inert, Tab wraps, and
// focus goes back to whatever opened it.
export function Dialog({
  label,
  active,
  onClose,
  initialFocus,
  children,
  onKeyDown,
  ...rest
}: DialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  useBodyScrollLock(active);

  useEffect(() => {
    const dialog = ref.current;
    if (!active || !dialog) return;

    const returnFocusTo =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    openDialogs.push(dialog);
    syncInertness();
    (initialFocus?.current ?? dialog).focus({ preventScroll: true });

    return () => {
      const position = openDialogs.indexOf(dialog);
      if (position !== -1) openDialogs.splice(position, 1);
      syncInertness();
      if (returnFocusTo?.isConnected) returnFocusTo.focus({ preventScroll: true });
    };
  }, [active, initialFocus]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !ref.current) return;

    const focusable = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (el) => el.getClientRects().length > 0,
    );
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>,
    document.body,
  );
}

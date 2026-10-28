"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./Toast.module.css";

// Measured on the reference: the toast stays up ~1.6s, then eases out over 200ms.
const VISIBLE_MS = 1600;
const EXIT_MS = 200;

type Notify = (message: string) => void;

const ToastContext = createContext<Notify>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

interface ToastState {
  id: number;
  message: string;
  leaving: boolean;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const nextId = useRef(0);

  const notify = useCallback<Notify>((message) => {
    nextId.current += 1;
    setToast({ id: nextId.current, message, leaving: false });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(
      () => (toast.leaving ? setToast(null) : setToast({ ...toast, leaving: true })),
      toast.leaving ? EXIT_MS : VISIBLE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      {/* Rendered once and kept mounted so screen readers reliably pick up changes. */}
      <div className={styles.region} aria-live="polite" role="status" data-dialog-exempt="">
        {toast && (
          <div key={toast.id} className={styles.toast} data-leaving={toast.leaving || undefined}>
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

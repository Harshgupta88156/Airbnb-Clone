"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { allPhotos } from "@/data/listing";

// URL contract copied from the reference so deep links behave the same:
//   ?modal=PHOTO_TOUR_SCROLLABLE                  → photo tour
//   ?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1004   → lightbox on the 5th photo
const MODAL_VALUE = "PHOTO_TOUR_SCROLLABLE";
const ITEM_OFFSET = 1000;
const URL_CHANGE_EVENT = "gallery:urlchange";

type HistoryMarker = "tour" | "photo";

interface GalleryContextValue {
  isTourOpen: boolean;
  activePhotoIndex: number | null;
  focusPhotoId: string | null;
  openTour: (photoId?: string) => void;
  closeTour: () => void;
  openPhoto: (index: number) => void;
  showPhoto: (index: number) => void;
  closePhoto: () => void;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) throw new Error("useGallery must be used inside <GalleryProvider>");
  return context;
}

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_CHANGE_EVENT, onChange);
  };
}

function galleryUrl(photoIndex?: number) {
  const url = new URL(window.location.href);
  url.searchParams.delete("modal");
  url.searchParams.delete("modalItem");
  if (photoIndex !== undefined) {
    url.searchParams.set("modal", MODAL_VALUE);
    if (photoIndex >= 0) url.searchParams.set("modalItem", String(ITEM_OFFSET + photoIndex));
  }
  return url;
}

// Next.js wraps pushState/replaceState and keeps its own router state alongside ours.
function writeHistory(mode: "push" | "replace", url: URL, marker: HistoryMarker | null) {
  const state = { gallery: marker };
  if (mode === "push") window.history.pushState(state, "", url);
  else window.history.replaceState(state, "", url);
  window.dispatchEvent(new Event(URL_CHANGE_EVENT));
}

const currentMarker = (): HistoryMarker | null => window.history.state?.gallery ?? null;

export function GalleryProvider({ children }: { children: ReactNode }) {
  // Server render and hydration always start closed; a deep link opens right after.
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  const [focusPhotoId, setFocusPhotoId] = useState<string | null>(null);

  const { isTourOpen, activePhotoIndex } = useMemo(() => {
    const params = new URLSearchParams(search);
    const tourOpen = params.get("modal") === MODAL_VALUE;
    const item = Number(params.get("modalItem"));
    const index = item - ITEM_OFFSET;
    const validIndex =
      tourOpen &&
      params.has("modalItem") &&
      Number.isInteger(index) &&
      index >= 0 &&
      index < allPhotos.length;
    return { isTourOpen: tourOpen, activePhotoIndex: validIndex ? index : null };
  }, [search]);

  const openTour = useCallback((photoId?: string) => {
    setFocusPhotoId(photoId ?? null);
    writeHistory("push", galleryUrl(-1), "tour");
  }, []);

  const closeTour = useCallback(() => {
    // Going back keeps the history stack honest; a deep-linked tour has nothing to go back to.
    if (currentMarker() === "tour") window.history.back();
    else writeHistory("replace", galleryUrl(), null);
  }, []);

  const openPhoto = useCallback((index: number) => {
    writeHistory("push", galleryUrl(index), "photo");
  }, []);

  const showPhoto = useCallback((index: number) => {
    writeHistory("replace", galleryUrl(index), currentMarker());
  }, []);

  const closePhoto = useCallback(() => {
    if (currentMarker() === "photo") window.history.back();
    else writeHistory("replace", galleryUrl(-1), null);
  }, []);

  const value = useMemo(
    () => ({
      isTourOpen,
      activePhotoIndex,
      focusPhotoId,
      openTour,
      closeTour,
      openPhoto,
      showPhoto,
      closePhoto,
    }),
    [
      isTourOpen,
      activePhotoIndex,
      focusPhotoId,
      openTour,
      closeTour,
      openPhoto,
      showPhoto,
      closePhoto,
    ],
  );

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
}

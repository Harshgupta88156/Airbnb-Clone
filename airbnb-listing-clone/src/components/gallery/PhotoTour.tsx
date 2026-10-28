"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { allPhotos, listing } from "@/data/listing";
import { Dialog } from "@/components/ui/Dialog";
import { ArrowBackIcon, HeartIcon, ShareIcon } from "@/components/ui/icons";
import { usePresence } from "@/hooks/usePresence";
import { preferredScrollBehavior } from "@/lib/motion";
import { useShareAndSave } from "@/components/listing/useShareAndSave";
import { useGallery } from "./GalleryProvider";
import { tourRows } from "./tourRows";
import styles from "./PhotoTour.module.css";

const EXIT_MS = 300;
// Where a photo lands (from the top of the scroll area) when the tour opens on it.
const FOCUS_OFFSET = 40;

const photoIndex = new Map(allPhotos.map((photo, index) => [photo.id, index]));

export function PhotoTour() {
  const { isTourOpen, focusPhotoId, closeTour, openPhoto } = useGallery();
  const { mounted, exiting } = usePresence(isTourOpen, EXIT_MS);
  const { isSaved, share, toggleSave } = useShareAndSave();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!mounted || !focusPhotoId || !scrollerRef.current) return;
    const target = scrollerRef.current.querySelector<HTMLElement>(
      `[data-photo-id="${focusPhotoId}"]`,
    );
    if (target) scrollerRef.current.scrollTop = target.offsetTop - FOCUS_OFFSET;
  }, [mounted, focusPhotoId]);

  if (!mounted) return null;

  function scrollToRoom(roomId: string) {
    const section = scrollerRef.current?.querySelector<HTMLElement>(`#tour-${roomId}`);
    section?.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
  }

  return (
    <Dialog
      label="Photo tour"
      active={!exiting}
      onClose={closeTour}
      initialFocus={backButtonRef}
      className={styles.tour}
      data-exiting={exiting || undefined}
    >
      <header className={styles.header}>
        <button
          ref={backButtonRef}
          type="button"
          className={styles.iconButton}
          aria-label="Back"
          onClick={closeTour}
        >
          <ArrowBackIcon />
        </button>
        <h2 className={styles.title}>Photo tour</h2>
        <div className={styles.headerActions}>
          <button type="button" className={styles.iconButton} aria-label="Share" onClick={share}>
            <ShareIcon size={18} />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={isSaved ? "Remove from wishlist" : "Save"}
            aria-pressed={isSaved}
            onClick={toggleSave}
          >
            <HeartIcon size={18} filled={isSaved} />
          </button>
        </div>
      </header>

      <div ref={scrollerRef} className={styles.scroller}>
        <div className={styles.content}>
          <nav className={styles.rooms} aria-label="Photo categories">
            {listing.rooms.map((room) => (
              <button
                key={room.id}
                type="button"
                className={styles.roomLink}
                onClick={() => scrollToRoom(room.id)}
              >
                <span className={styles.roomThumb}>
                  <Image
                    src={room.photos[0].src}
                    alt=""
                    fill
                    sizes="112px"
                    className={styles.cover}
                  />
                </span>
                <span className={styles.roomLabel}>{room.name}</span>
              </button>
            ))}
          </nav>

          {listing.rooms.map((room) => (
            <section
              key={room.id}
              id={`tour-${room.id}`}
              className={styles.room}
              aria-labelledby={`tour-${room.id}-title`}
            >
              <div className={styles.roomInfo}>
                <h3 id={`tour-${room.id}-title`} className={styles.roomTitle}>
                  {room.name}
                </h3>
                {room.features.length > 0 && (
                  <p className={styles.roomFeatures}>{room.features.join(" · ")}</p>
                )}
              </div>

              <div className={styles.roomPhotos}>
                {tourRows(room.photos).map((row) =>
                  row.photos.map((photo) => {
                    const index = photoIndex.get(photo.id) ?? 0;
                    return (
                      <button
                        key={photo.id}
                        type="button"
                        data-photo-id={photo.id}
                        className={row.kind === "full" ? styles.photoFull : styles.photoHalf}
                        aria-label={`${room.name}, photo ${index + 1} of ${allPhotos.length}`}
                        onClick={() => openPhoto(index)}
                      >
                        <Image
                          src={photo.src}
                          alt=""
                          fill
                          sizes={row.kind === "full" ? "458px" : "223px"}
                          quality={90}
                          className={styles.cover}
                        />
                      </button>
                    );
                  }),
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Dialog>
  );
}

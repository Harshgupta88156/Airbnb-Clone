"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { allPhotos } from "@/data/listing";
import { Dialog } from "@/components/ui/Dialog";
import { ArrowBackIcon, ArrowForwardIcon, CloseIcon, GridDotsIcon } from "@/components/ui/icons";
import { usePresence } from "@/hooks/usePresence";
import { useGallery } from "./GalleryProvider";
import styles from "./Lightbox.module.css";

const EXIT_MS = 250;

export function Lightbox() {
  const { activePhotoIndex, showPhoto, closePhoto } = useGallery();
  const { mounted, exiting } = usePresence(activePhotoIndex !== null, EXIT_MS);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Keep showing the last photo while the viewer fades out.
  const [index, setIndex] = useState(activePhotoIndex ?? 0);
  if (activePhotoIndex !== null && activePhotoIndex !== index) setIndex(activePhotoIndex);

  if (!mounted) return null;

  const photo = allPhotos[index];
  const isFirst = index === 0;
  const isLast = index === allPhotos.length - 1;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft" && !isFirst) {
      event.preventDefault();
      showPhoto(index - 1);
    } else if (event.key === "ArrowRight" && !isLast) {
      event.preventDefault();
      showPhoto(index + 1);
    }
  }

  return (
    <Dialog
      label="Photo viewer"
      active={!exiting}
      onClose={closePhoto}
      initialFocus={closeButtonRef}
      onKeyDown={handleKeyDown}
      className={styles.viewer}
      data-exiting={exiting || undefined}
    >
      <div className={styles.bar}>
        <button
          type="button"
          className={styles.barButton}
          aria-label="Show all photos"
          onClick={closePhoto}
        >
          <GridDotsIcon size={18} />
        </button>
        <h2 className={styles.title}>{photo.room}</h2>
        <div className={styles.barEnd}>
          <p className={styles.counter} aria-live="polite" aria-atomic="true">
            {index + 1} of {allPhotos.length}
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.barButton}
            aria-label="Close"
            onClick={closePhoto}
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <button
        type="button"
        className={`${styles.arrow} ${styles.previous}`}
        aria-label="Previous"
        disabled={isFirst}
        onClick={() => showPhoto(index - 1)}
      >
        <ArrowBackIcon weight={4} />
      </button>

      <figure className={styles.stage}>
        {/* Keyed by photo so the swap is instant, exactly like the reference. */}
        <Image
          key={photo.id}
          src={photo.src}
          alt={`${photo.room}, photo ${index + 1} of ${allPhotos.length}`}
          width={photo.width}
          height={photo.height}
          sizes="(min-aspect-ratio: 4/3) 75vw, 90vw"
          quality={90}
          preload
          className={styles.image}
        />
      </figure>

      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        aria-label="Next"
        disabled={isLast}
        onClick={() => showPhoto(index + 1)}
      >
        <ArrowForwardIcon weight={4} />
      </button>
    </Dialog>
  );
}

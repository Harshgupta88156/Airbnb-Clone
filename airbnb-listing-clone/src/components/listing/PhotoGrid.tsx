"use client";

import Image from "next/image";
import type { Photo } from "@/types/listing";
import { useGallery } from "@/components/gallery/GalleryProvider";
import { GridDotsIcon } from "@/components/ui/icons";
import styles from "./PhotoGrid.module.css";

export function PhotoGrid({ photos, totalPhotos }: { photos: Photo[]; totalPhotos: number }) {
  const { openTour } = useGallery();

  return (
    <section className={styles.grid} aria-label="Photos of this place">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          className={index === 0 ? styles.lead : styles.tile}
          aria-label={`Open the photo tour at ${photo.room}`}
          onClick={() => openTour(photo.id)}
        >
          <Image
            src={photo.src}
            alt=""
            fill
            quality={90}
            preload={index === 0}
            sizes={
              index === 0 ? "(max-width: 1127px) 50vw, 560px" : "(max-width: 1127px) 25vw, 272px"
            }
            className={styles.image}
          />
        </button>
      ))}
      <button type="button" className={styles.showAll} onClick={() => openTour()}>
        <GridDotsIcon size={15} />
        Show all photos
        <span className="visually-hidden">({totalPhotos})</span>
      </button>
    </section>
  );
}

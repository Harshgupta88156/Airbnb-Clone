"use client";

import { useRef, useState } from "react";
import type { Amenity, AmenityGroup } from "@/types/listing";
import { Dialog } from "@/components/ui/Dialog";
import { CloseIcon, Glyph } from "@/components/ui/icons";
import { usePresence } from "@/hooks/usePresence";
import buttons from "@/components/ui/buttons.module.css";
import section from "./section.module.css";
import styles from "./Amenities.module.css";

interface AmenitiesProps {
  preview: Amenity[];
  groups: AmenityGroup[];
  total: number;
}

function AmenityLabel({ amenity }: { amenity: Amenity }) {
  return amenity.unavailable ? (
    <>
      <del className={styles.unavailable}>{amenity.label}</del>
      <span className="visually-hidden"> (not available)</span>
    </>
  ) : (
    <span>{amenity.label}</span>
  );
}

export function Amenities({ preview, groups, total }: AmenitiesProps) {
  const [open, setOpen] = useState(false);
  const { mounted, exiting } = usePresence(open, 250);
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <section
      id="amenities"
      tabIndex={-1}
      className={section.block}
      aria-labelledby="amenities-heading"
    >
      <h2 id="amenities-heading" className={`${section.heading} ${section.headingSpacing}`}>
        What this place offers
      </h2>
      <ul className={styles.preview}>
        {preview.map((amenity) => (
          <li key={amenity.label} className={styles.previewItem}>
            <Glyph name={amenity.icon} />
            <AmenityLabel amenity={amenity} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`${buttons.outlined} ${styles.showAll}`}
        onClick={() => setOpen(true)}
      >
        Show all {total} amenities
      </button>

      {mounted && (
        <Dialog
          label="What this place offers"
          active={!exiting}
          onClose={() => setOpen(false)}
          initialFocus={closeRef}
          className={styles.overlay}
          data-exiting={exiting || undefined}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className={styles.panel}>
            <div className={styles.panelBar}>
              <button
                ref={closeRef}
                type="button"
                className={styles.close}
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
            {/* Scrolls on its own, so it needs to be reachable for arrow-key scrolling. */}
            <div className={styles.panelBody} tabIndex={0}>
              <h2 className={styles.panelTitle}>What this place offers</h2>
              {groups.map((group) => (
                <section key={group.title} className={styles.group}>
                  <h3 className={styles.groupTitle}>{group.title}</h3>
                  <ul>
                    {group.amenities.map((amenity) => (
                      <li key={amenity.label} className={styles.groupItem}>
                        <Glyph name={amenity.icon} />
                        <AmenityLabel amenity={amenity} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </Dialog>
      )}
    </section>
  );
}

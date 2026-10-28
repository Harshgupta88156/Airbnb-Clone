import type { Listing } from "@/types/listing";
import {
  ChevronRightIcon,
  MapPinHouseIcon,
  MapSearchIcon,
  MinusIcon,
  PlusIcon,
} from "@/components/ui/icons";
import buttons from "@/components/ui/buttons.module.css";
import section from "@/components/listing/section.module.css";
import styles from "./Location.module.css";

// The map is a drawn stand-in (sea, land, street grid, parks) rather than live tiles, like the
// reference. Its controls are present for fidelity but, as there, don't do anything yet.
export function Location({ location }: { location: Listing["location"] }) {
  return (
    <section
      id="location"
      tabIndex={-1}
      className={section.wide}
      aria-labelledby="location-heading"
    >
      <h2 id="location-heading" className={section.heading}>
        Where you’ll be
      </h2>
      <p className={styles.place}>{location.label}</p>

      <div className={styles.map}>
        <div
          className={styles.canvas}
          role="img"
          aria-label={`Map of ${location.label}. The pin marks the approximate area.`}
        >
          <span className={`${styles.park} ${styles.parkNorth}`} />
          <span className={`${styles.park} ${styles.parkSouth}`} />
          <span className={styles.pin}>
            <MapPinHouseIcon />
          </span>
        </div>
        <button type="button" className={styles.search} aria-label="Search this area">
          <MapSearchIcon />
        </button>
        <div className={styles.zoom}>
          <button type="button" className={styles.zoomButton} aria-label="Zoom in">
            <PlusIcon />
          </button>
          <button type="button" className={styles.zoomButton} aria-label="Zoom out">
            <MinusIcon />
          </button>
        </div>
      </div>

      <p className={styles.note}>Exact location will be provided after booking.</p>

      <h3 className={styles.subheading}>Neighbourhood highlights</h3>
      <p className={styles.neighbourhood}>{location.neighbourhood}</p>
      <button type="button" className={`${buttons.chevronLink} ${styles.more}`}>
        <span>Show more</span>
        <ChevronRightIcon size={14} />
      </button>
    </section>
  );
}

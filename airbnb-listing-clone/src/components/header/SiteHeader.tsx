import Image from "next/image";
import { AirbnbLogo, GlobeIcon, MenuIcon, SearchGlyph } from "@/components/ui/icons";
import { PlaceholderLink } from "@/components/ui/PlaceholderLink";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <PlaceholderLink className={styles.logo} aria-label="Airbnb homepage">
          <AirbnbLogo />
        </PlaceholderLink>

        <div role="search" className={styles.search} aria-label="Search stays">
          <button type="button" className={styles.searchSegment}>
            <Image
              src="/images/ui/searchbar-house.png"
              alt=""
              width={48}
              height={48}
              className={styles.searchHouse}
              preload
            />
            Anywhere
          </button>
          <span className={styles.searchDivider} aria-hidden="true" />
          <button type="button" className={styles.searchSegment}>
            Anytime
          </button>
          <span className={styles.searchDivider} aria-hidden="true" />
          <button type="button" className={`${styles.searchSegment} ${styles.searchPlaceholder}`}>
            Add guests
          </button>
          <button type="button" className={styles.searchButton} aria-label="Search">
            <SearchGlyph />
          </button>
        </div>

        <nav className={styles.actions} aria-label="Account">
          <PlaceholderLink className={styles.hostLink}>Become a host</PlaceholderLink>
          <button
            type="button"
            className={styles.roundButton}
            aria-label="Choose a language and currency"
          >
            <GlobeIcon />
          </button>
          <button type="button" className={styles.roundButton} aria-label="Main navigation menu">
            <MenuIcon />
          </button>
        </nav>
      </div>
    </header>
  );
}

import Image from "next/image";
import type { Listing } from "@/types/listing";
import { Glyph, LaurelIcon } from "@/components/ui/icons";
import { StarRow } from "@/components/ui/StarRow";
import section from "./section.module.css";
import styles from "./Overview.module.css";

export function Overview({ listing }: { listing: Listing }) {
  const { host, rating } = listing;

  return (
    <>
      <div className={styles.summary}>
        <h2 className={section.heading}>{listing.headline}</h2>
        <p className={styles.capacity}>{listing.capacity.join(" · ")}</p>
      </div>

      <div className={styles.favourite}>
        <div className={styles.badge}>
          <LaurelIcon />
          <span className={styles.badgeLabel}>
            Guest
            <br />
            favourite
          </span>
          <LaurelIcon mirrored />
        </div>
        <p className={styles.favouriteBlurb}>{listing.guestFavouriteBlurb}</p>
        <div className={styles.favouriteStats}>
          <div className={styles.stat}>
            <span className={styles.statValue} aria-label={`Rated ${rating.score} out of 5`}>
              {rating.score}
            </span>
            <StarRow />
          </div>
          <span className={styles.statDivider} aria-hidden="true" />
          <a className={styles.stat} href="#reviews">
            <span className={styles.statValue}>{rating.reviewCount}</span>
            <span className={styles.statCaption}>Reviews</span>
          </a>
        </div>
      </div>

      <div className={styles.host}>
        <Image src={host.avatar} alt="" width={46} height={46} className={styles.hostAvatar} />
        <div>
          <p className={styles.hostName}>Hosted by {host.name}</p>
          <p className={styles.hostTenure}>{host.yearsHosting} years hosting</p>
        </div>
      </div>

      <ul className={`${section.block} ${styles.highlights}`}>
        {listing.highlights.map((highlight) => (
          <li key={highlight.title} className={styles.highlight}>
            <Glyph name={highlight.icon} />
            <div>
              <p className={styles.highlightTitle}>{highlight.title}</p>
              <p className={styles.highlightText}>{highlight.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

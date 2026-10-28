import Image from "next/image";
import type { Listing } from "@/types/listing";
import { Glyph } from "@/components/ui/icons";
import buttons from "@/components/ui/buttons.module.css";
import section from "@/components/listing/section.module.css";
import { ReviewCard } from "./ReviewCard";
import styles from "./Reviews.module.css";

export function Reviews({ listing }: { listing: Listing }) {
  const { reviews, rating } = listing;

  return (
    <section id="reviews" tabIndex={-1} className={section.wide} aria-labelledby="reviews-heading">
      <div className={styles.summary}>
        <div className={styles.score}>
          <Image
            src="/images/ui/laurel-left.png"
            alt=""
            width={240}
            height={365}
            className={styles.laurel}
          />
          <p className={styles.bigRating} aria-label={`Rated ${rating.score} out of 5`}>
            {rating.score}
          </p>
          <Image
            src="/images/ui/laurel-right.png"
            alt=""
            width={240}
            height={365}
            className={styles.laurel}
          />
        </div>
        <h2 id="reviews-heading" className={styles.title}>
          Guest favourite
        </h2>
        <p className={styles.blurb}>{reviews.blurb}</p>
        <button type="button" className={`${buttons.link} ${styles.howItWorks}`}>
          How reviews work
        </button>
      </div>

      <div className={styles.ratings}>
        <div className={`${styles.ratingColumn} ${styles.overall}`}>
          <p className={styles.ratingLabel}>Overall rating</p>
          <ol className={styles.distribution} aria-label="Rating distribution">
            {reviews.distribution.map((share, i) => (
              <li key={i} className={styles.distributionRow}>
                <span className={styles.distributionStar}>{5 - i}</span>
                <span className={styles.bar}>
                  <span className={styles.barFill} style={{ width: `${share * 100}%` }} />
                </span>
                <span className="visually-hidden">{Math.round(share * 100)}% of reviews</span>
              </li>
            ))}
          </ol>
        </div>
        {reviews.categories.map((category) => (
          <div key={category.label} className={styles.ratingColumn}>
            <p className={styles.ratingLabel}>{category.label}</p>
            <p className={styles.ratingValue}>{category.score}</p>
            <Glyph name={category.icon} size={32} className={styles.ratingIcon} />
          </div>
        ))}
      </div>

      <ul className={styles.tags} aria-label="What guests mention">
        {reviews.tags.map((tag) => (
          <li key={tag.label}>
            <button type="button" className={styles.tag}>
              <Image src={tag.image} alt="" width={20} height={20} />
              <span className={styles.tagLabel}>{tag.label}</span>
              <span className={styles.tagCount}>{tag.count}</span>
            </button>
          </li>
        ))}
      </ul>

      <ul className={styles.list}>
        {reviews.featured.map((review) => (
          <li key={review.author.name}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>

      <button type="button" className={buttons.outlined}>
        Show all {rating.reviewCount} reviews
      </button>
    </section>
  );
}

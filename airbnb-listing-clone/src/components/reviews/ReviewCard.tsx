"use client";

import { useId, useState } from "react";
import type { Review } from "@/types/listing";
import { Avatar } from "@/components/ui/Avatar";
import { StarRow } from "@/components/ui/StarRow";
import buttons from "@/components/ui/buttons.module.css";
import styles from "./ReviewCard.module.css";

// The reference offers "Show more" on longer reviews even when they happen to fit in four lines,
// so the toggle follows length rather than measured overflow.
const LONG_REVIEW = 200;

export function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const textId = useId();
  const isLong = review.text.length > LONG_REVIEW;

  return (
    <article className={styles.review}>
      <header className={styles.author}>
        <Avatar person={review.author} size={42} />
        <div>
          <h3 className={styles.name}>{review.author.name}</h3>
          <p className={styles.meta}>{review.memberFor}</p>
        </div>
      </header>
      <p className={styles.rating}>
        <StarRow gap={1} />
        <span className="visually-hidden">Rated 5 out of 5,</span>
        <span aria-hidden="true">·</span>
        <span>{review.postedAt}</span>
      </p>
      <p id={textId} className={styles.text} data-clamped={(isLong && !expanded) || undefined}>
        {review.text}
      </p>
      {isLong && (
        <button
          type="button"
          className={`${buttons.link} ${styles.toggle}`}
          aria-expanded={expanded}
          aria-controls={textId}
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </article>
  );
}

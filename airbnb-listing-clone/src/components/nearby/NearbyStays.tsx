"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { NearbyStay } from "@/types/listing";
import { preferredScrollBehavior } from "@/lib/motion";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@/components/ui/icons";
import section from "@/components/listing/section.module.css";
import styles from "./NearbyStays.module.css";

// Must match the track's column gap: one "page" is the visible width plus the gap after it,
// so every page starts flush with a card.
const CARD_GAP = 20;

interface PagerState {
  page: number;
  pageCount: number;
  atStart: boolean;
  atEnd: boolean;
}

function readPager(track: HTMLElement): PagerState {
  const pageWidth = track.clientWidth + CARD_GAP;
  const maxScroll = track.scrollWidth - track.clientWidth;
  const pageCount = Math.max(1, Math.ceil((track.scrollWidth + CARD_GAP) / pageWidth));
  // Sub-pixel scroll positions never quite reach the max, hence the 1px slack.
  const atEnd = track.scrollLeft >= maxScroll - 1;
  return {
    page: atEnd ? pageCount : Math.round(track.scrollLeft / pageWidth) + 1,
    pageCount,
    atStart: track.scrollLeft <= 1,
    atEnd,
  };
}

export function NearbyStays({ stays }: { stays: NearbyStay[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  // The server can't measure, so it assumes the desktop track (five cards a page);
  // the effect below corrects that as soon as the track is laid out.
  const [pager, setPager] = useState<PagerState>(() => ({
    page: 1,
    pageCount: Math.ceil(stays.length / 5),
    atStart: true,
    atEnd: stays.length <= 5,
  }));

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const sync = () => {
      const next = readPager(track);
      setPager((current) =>
        current.page === next.page &&
        current.pageCount === next.pageCount &&
        current.atStart === next.atStart &&
        current.atEnd === next.atEnd
          ? current
          : next,
      );
    };
    sync();
    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(track);
    track.addEventListener("scroll", sync, { passive: true });
    return () => {
      resizeObserver.disconnect();
      track.removeEventListener("scroll", sync);
    };
  }, []);

  function turnPage(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * (track.clientWidth + CARD_GAP),
      behavior: preferredScrollBehavior(),
    });
  }

  return (
    <section className={section.wide} aria-labelledby="nearby-heading">
      <div className={styles.header}>
        <h2 id="nearby-heading" className={section.heading}>
          More stays nearby
        </h2>
        <div className={styles.pager}>
          <p className={styles.counter}>
            <span className="visually-hidden">Page </span>
            {pager.page} / {pager.pageCount}
          </p>
          <button
            type="button"
            className={styles.pageButton}
            aria-label="Previous stays"
            disabled={pager.atStart}
            onClick={() => turnPage(-1)}
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            className={styles.pageButton}
            aria-label="Next stays"
            disabled={pager.atEnd}
            onClick={() => turnPage(1)}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      {/* Focusable so keyboard users can also scroll the row with the arrow keys. */}
      <ul ref={trackRef} className={styles.track} tabIndex={0} aria-labelledby="nearby-heading">
        {stays.map((stay) => (
          <li key={stay.title} className={styles.stay}>
            <Image
              src={stay.image}
              alt=""
              width={208}
              height={208}
              sizes="208px"
              className={styles.photo}
            />
            <h3 className={styles.title}>{stay.title}</h3>
            <p className={styles.price}>
              {stay.totalPrice}
              <span className={styles.rating}>
                <StarIcon />
                <span className="visually-hidden">Rated</span> {stay.rating}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

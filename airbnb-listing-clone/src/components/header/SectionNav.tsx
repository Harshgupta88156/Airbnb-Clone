"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { listing } from "@/data/listing";
import { formatPrice, pluralize } from "@/lib/format";
import { preferredScrollBehavior } from "@/lib/motion";
import { StarIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";
import { useBooking } from "@/components/booking/BookingProvider";
import { ReserveButton } from "@/components/booking/ReserveButton";
import styles from "./SectionNav.module.css";

const SECTIONS = [
  { id: "photos", label: "Photos" },
  { id: "amenities", label: "Amenities" },
  { id: "reviews", label: "Reviews" },
  { id: "location", label: "Location" },
];

// Measured on the reference: the bar slides in once the photo grid's bottom edge passes 40px
// from the top, a section becomes current when its top is within 120px, and jumping to a
// section parks it 80px down so the bar doesn't cover its heading.
const REVEAL_AFTER = 40;
const CURRENT_WITHIN = 120;
const JUMP_OFFSET = 80;

export function SectionNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentId, setCurrentId] = useState(SECTIONS[0].id);
  const { nights, total } = useBooking();
  const notify = useToast();
  const { rating } = listing;

  useEffect(() => {
    const photos = document.getElementById("photos");
    if (!photos) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setIsVisible(!entry.isIntersecting && entry.boundingClientRect.bottom < REVEAL_AFTER),
      { rootMargin: `-${REVEAL_AFTER}px 0px 0px 0px` },
    );
    observer.observe(photos);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const findCurrent = () => {
      frame = 0;
      let current = SECTIONS[0].id;
      for (const { id } of SECTIONS) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= CURRENT_WITHIN) current = id;
      }
      setCurrentId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(findCurrent);
    };
    findCurrent();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function jumpTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    // Scroll by hand instead of following the hash so the offset matches the reference and the
    // URL (which carries the photo tour state) stays untouched.
    event.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - JUMP_OFFSET,
      behavior: preferredScrollBehavior(),
    });
    // Keyboard users continue from the section they jumped to, not from the top bar.
    target.focus({ preventScroll: true });
  }

  return (
    <div className={styles.bar} data-visible={isVisible || undefined} inert={!isVisible}>
      <div className={styles.inner}>
        <nav aria-label="Listing sections" className={styles.tabs}>
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={styles.tab}
              aria-current={currentId === id ? "true" : undefined}
              onClick={(event) => jumpTo(event, id)}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className={styles.booking}>
          <div className={styles.summary}>
            {total !== null ? (
              <p className={styles.priceLine}>
                <span className={styles.price}>{formatPrice(total, listing.booking.currency)}</span>{" "}
                for {pluralize(nights, "night")}
              </p>
            ) : (
              <p className={styles.priceLine}>
                <span className={styles.price}>Add dates for prices</span>
              </p>
            )}
            <p className={styles.ratingLine}>
              <StarIcon size={11} />
              <span className="visually-hidden">Rated</span> {rating.score} · {rating.reviewCount}{" "}
              reviews
            </p>
          </div>
          <ReserveButton
            className={styles.reserve}
            onClick={() => notify("You won't be charged yet")}
          />
        </div>
      </div>
    </div>
  );
}

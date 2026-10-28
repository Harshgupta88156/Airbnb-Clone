"use client";

import Image from "next/image";
import { listing } from "@/data/listing";
import { addDays, formatDayMonth, formatInputDate } from "@/lib/dates";
import { formatPrice, pluralize } from "@/lib/format";
import { ChevronDownIcon, FlagIcon } from "@/components/ui/icons";
import { PlaceholderLink } from "@/components/ui/PlaceholderLink";
import { useToast } from "@/components/ui/Toast";
import buttons from "@/components/ui/buttons.module.css";
import { ReserveButton } from "./ReserveButton";
import { useBooking } from "./BookingProvider";
import styles from "./BookingSidebar.module.css";

export function BookingSidebar() {
  const { checkIn, checkOut, nights, total } = useBooking();
  const notify = useToast();
  const { currency, guests } = listing.booking;

  return (
    <div className={styles.sticky}>
      <div className={styles.discount}>
        <Image src="/images/ui/discount.svg" alt="" width={32} height={32} />
        <p className={styles.discountText}>
          Get 10% off your next stay.
          <br />
          <PlaceholderLink className={buttons.link}>Terms apply</PlaceholderLink>
        </p>
        <button type="button" className={`${buttons.subtle} ${styles.claim}`}>
          claim
        </button>
      </div>

      <div className={styles.card}>
        <p className={styles.price}>
          {total !== null ? (
            <>
              <span className={styles.amount}>{formatPrice(total, currency)}</span>{" "}
              <span className={styles.priceSuffix}>for {pluralize(nights, "night")}</span>
            </>
          ) : (
            <span className={styles.amount}>Add dates for prices</span>
          )}
        </p>

        <div className={styles.fields}>
          <div className={styles.dates}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Check-in</span>
              <span className={styles.fieldValue}>
                {checkIn ? formatInputDate(checkIn) : "Add date"}
              </span>
            </div>
            <div className={`${styles.field} ${styles.fieldDivided}`}>
              <span className={styles.fieldLabel}>Checkout</span>
              <span className={styles.fieldValue}>
                {checkOut ? formatInputDate(checkOut) : "Add date"}
              </span>
            </div>
          </div>
          <div className={styles.guests}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Guests</span>
              <span className={styles.fieldValue}>{guests}</span>
            </div>
            <ChevronDownIcon className={styles.guestsChevron} />
          </div>
        </div>

        {checkIn && (
          <p className={styles.cancellation}>
            Free cancellation before <strong>{formatDayMonth(addDays(checkIn, -1))}</strong>
          </p>
        )}

        <ReserveButton
          className={styles.reserve}
          onClick={() => notify("You won't be charged yet")}
        />
        <p className={styles.note}>You won&apos;t be charged yet</p>
      </div>

      <p className={styles.report}>
        <FlagIcon />
        <PlaceholderLink className={styles.reportLink}>Report this listing</PlaceholderLink>
      </p>
    </div>
  );
}

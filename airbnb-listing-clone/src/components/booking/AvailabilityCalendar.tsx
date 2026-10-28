"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { listing } from "@/data/listing";
import {
  addDays,
  dayOfMonth,
  formatFullDate,
  formatMonthTitle,
  formatShortDate,
  monthGrid,
  monthOf,
  shiftMonth,
  type IsoDate,
  type MonthRef,
} from "@/lib/dates";
import { pluralize } from "@/lib/format";
import { ChevronLeftIcon, ChevronRightIcon, KeyboardIcon } from "@/components/ui/icons";
import buttons from "@/components/ui/buttons.module.css";
import section from "@/components/listing/section.module.css";
import { useBooking } from "./BookingProvider";
import styles from "./AvailabilityCalendar.module.css";

const WEEKDAYS = [
  ["S", "Sunday"],
  ["M", "Monday"],
  ["T", "Tuesday"],
  ["W", "Wednesday"],
  ["T", "Thursday"],
  ["F", "Friday"],
  ["S", "Saturday"],
] as const;

const DEFAULT_MONTH = monthOf(listing.booking.defaultStay.checkIn);
// One month of look-back keeps the "previous" arrow live on first render, as on the reference.
const FIRST_MONTH = shiftMonth(DEFAULT_MONTH, -1);
const MONTHS_AHEAD = 12;

const KEY_STEPS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

function monthIndex(ref: MonthRef) {
  return (ref.year - FIRST_MONTH.year) * 12 + (ref.month - FIRST_MONTH.month);
}

export function AvailabilityCalendar() {
  const { checkIn, checkOut, nights, isUnavailable, canCheckOutOn, selectDate, clearDates } =
    useBooking();
  const [visibleMonth, setVisibleMonth] = useState<MonthRef>(DEFAULT_MONTH);
  const [focusedDate, setFocusedDate] = useState<IsoDate>(
    checkIn ?? listing.booking.defaultStay.checkIn,
  );
  const gridRef = useRef<HTMLDivElement>(null);

  const months = [visibleMonth, shiftMonth(visibleMonth, 1)];
  const offset = monthIndex(visibleMonth);
  // Roving tabindex: exactly one day is reachable with Tab, even after paging months away.
  const focusedOffset = monthIndex(monthOf(focusedDate));
  const tabbableDate =
    focusedOffset === offset || focusedOffset === offset + 1
      ? focusedDate
      : `${visibleMonth.year}-${String(visibleMonth.month + 1).padStart(2, "0")}-01`;

  const heading =
    nights > 0
      ? `${pluralize(nights, "night")} in ${listing.booking.location}`
      : checkIn
        ? "Select checkout date"
        : "Select check-in date";
  const subheading =
    checkIn && checkOut
      ? `${formatShortDate(checkIn)} - ${formatShortDate(checkOut)}`
      : checkIn
        ? "Minimum stay: 1 night"
        : "Add your travel dates for exact pricing";

  function moveFocus(date: IsoDate) {
    const target = monthOf(date);
    const index = monthIndex(target);
    if (index < 0 || index > MONTHS_AHEAD) return;
    if (index < offset) setVisibleMonth(target);
    if (index > offset + 1) setVisibleMonth(shiftMonth(target, -1));
    setFocusedDate(date);
    // The button may only exist after the month switch renders.
    requestAnimationFrame(() =>
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)?.focus(),
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, date: IsoDate) {
    const step = KEY_STEPS[event.key];
    if (step === undefined) return;
    event.preventDefault();
    moveFocus(addDays(date, step));
  }

  function dayState(date: IsoDate) {
    if (date === checkIn) return checkOut ? "start" : "single";
    if (date === checkOut) return "end";
    if (checkIn && checkOut && date > checkIn && date < checkOut) return "between";
    return undefined;
  }

  function dayLabel(date: IsoDate, disabled: boolean) {
    const full = formatFullDate(date);
    if (disabled) return `${full}, not available`;
    if (date === checkIn) return `${full}, check-in date`;
    if (date === checkOut) return `${full}, checkout date`;
    return `Choose ${full} as ${checkIn && !checkOut && date > checkIn ? "checkout" : "check-in"} date`;
  }

  return (
    <section className={section.block} aria-labelledby="calendar-heading">
      <h2 id="calendar-heading" className={styles.heading}>
        {heading}
      </h2>
      <p className={styles.subheading}>{subheading}</p>

      <div ref={gridRef} className={styles.months}>
        <button
          type="button"
          className={`${styles.monthNav} ${styles.monthNavPrevious}`}
          aria-label="Previous month"
          disabled={offset <= 0}
          onClick={() => setVisibleMonth(shiftMonth(visibleMonth, -1))}
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          className={`${styles.monthNav} ${styles.monthNavNext}`}
          aria-label="Next month"
          disabled={offset >= MONTHS_AHEAD - 1}
          onClick={() => setVisibleMonth(shiftMonth(visibleMonth, 1))}
        >
          <ChevronRightIcon />
        </button>

        {months.map((month) => (
          <div key={`${month.year}-${month.month}`} className={styles.month}>
            <h3 className={styles.monthTitle} aria-live="polite">
              {formatMonthTitle(month)}
            </h3>
            <table className={styles.grid} role="grid" aria-label={formatMonthTitle(month)}>
              <thead>
                <tr>
                  {WEEKDAYS.map(([short, long]) => (
                    <th key={long} scope="col" abbr={long} className={styles.weekday}>
                      {short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthGrid(month).map((week, row) => (
                  <tr key={row}>
                    {week.map((date, column) => {
                      if (!date) return <td key={column} />;
                      const unavailable = isUnavailable(date) && !canCheckOutOn(date);
                      const state = dayState(date);
                      return (
                        <td key={date} className={styles.cell} data-state={state}>
                          <button
                            type="button"
                            data-date={date}
                            className={styles.day}
                            tabIndex={date === tabbableDate ? 0 : -1}
                            aria-disabled={unavailable || undefined}
                            aria-pressed={
                              state === "start" || state === "end" || state === "single"
                            }
                            aria-label={dayLabel(date, unavailable)}
                            onClick={() => {
                              setFocusedDate(date);
                              if (!unavailable) selectDate(date);
                            }}
                            onKeyDown={(event) => handleKeyDown(event, date)}
                          >
                            {dayOfMonth(date)}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <span className={styles.keyboardHint} aria-hidden="true">
          <KeyboardIcon />
        </span>
        <button type="button" className={`${buttons.link} ${styles.clear}`} onClick={clearDates}>
          Clear dates
        </button>
      </div>
    </section>
  );
}

"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { listing } from "@/data/listing";
import { addDays, nightsBetween, type IsoDate } from "@/lib/dates";

const { defaultStay, totalForStay, unavailable } = listing.booking;
const nightlyRate = totalForStay / nightsBetween(defaultStay.checkIn, defaultStay.checkOut);
const unavailableNights = new Set(unavailable);

interface BookingContextValue {
  checkIn: IsoDate | null;
  checkOut: IsoDate | null;
  nights: number;
  total: number | null;
  isUnavailable: (date: IsoDate) => boolean;
  canCheckOutOn: (date: IsoDate) => boolean;
  selectDate: (date: IsoDate) => void;
  clearDates: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used inside <BookingProvider>");
  return context;
}

function rangeIsFree(checkIn: IsoDate, checkOut: IsoDate) {
  for (let night = checkIn; night < checkOut; night = addDays(night, 1)) {
    if (unavailableNights.has(night)) return false;
  }
  return true;
}

// The reference renders a fixed 18–23 Oct stay and ignores clicks. Here the calendar works:
// the stay starts on the reference's dates and the total scales with the nightly rate.
export function BookingProvider({ children }: { children: ReactNode }) {
  const [checkIn, setCheckIn] = useState<IsoDate | null>(defaultStay.checkIn);
  const [checkOut, setCheckOut] = useState<IsoDate | null>(defaultStay.checkOut);

  const isUnavailable = useCallback((date: IsoDate) => unavailableNights.has(date), []);

  const canCheckOutOn = useCallback(
    (date: IsoDate) =>
      checkIn !== null && checkOut === null && date > checkIn && rangeIsFree(checkIn, date),
    [checkIn, checkOut],
  );

  const selectDate = useCallback(
    (date: IsoDate) => {
      if (canCheckOutOn(date)) {
        setCheckOut(date);
        return;
      }
      if (unavailableNights.has(date)) return;
      setCheckIn(date);
      setCheckOut(null);
    },
    [canCheckOutOn],
  );

  const clearDates = useCallback(() => {
    setCheckIn(null);
    setCheckOut(null);
  }, []);

  const value = useMemo(() => {
    const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
    return {
      checkIn,
      checkOut,
      nights,
      total: nights > 0 ? Math.round(nightlyRate * nights) : null,
      isUnavailable,
      canCheckOutOn,
      selectDate,
      clearDates,
    };
  }, [checkIn, checkOut, isUnavailable, canCheckOutOn, selectDate, clearDates]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

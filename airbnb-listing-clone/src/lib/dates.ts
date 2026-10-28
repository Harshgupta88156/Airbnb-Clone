// Calendar dates are plain "YYYY-MM-DD" strings and all arithmetic happens in UTC, so a stay
// never shifts by a day because of the visitor's time zone or DST.
export type IsoDate = string;

const DAY_MS = 86_400_000;

export function toUtc(date: IsoDate): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function fromUtc(ms: number): IsoDate {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(date: IsoDate, days: number): IsoDate {
  return fromUtc(toUtc(date) + days * DAY_MS);
}

export function nightsBetween(checkIn: IsoDate, checkOut: IsoDate): number {
  return Math.round((toUtc(checkOut) - toUtc(checkIn)) / DAY_MS);
}

export interface MonthRef {
  year: number;
  month: number; // 0-based, like Date
}

export function monthOf(date: IsoDate): MonthRef {
  const d = new Date(toUtc(date));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
}

export function shiftMonth({ year, month }: MonthRef, delta: number): MonthRef {
  const d = new Date(Date.UTC(year, month + delta, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
}

// Sunday-first weeks; leading/trailing blanks are null so the grid stays 7 columns wide.
export function monthGrid({ year, month }: MonthRef): (IsoDate | null)[][] {
  const first = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (IsoDate | null)[] = Array(first.getUTCDay()).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(fromUtc(Date.UTC(year, month, day)));
  }
  while (cells.length % 7) cells.push(null);
  const weeks: (IsoDate | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...options });

const monthTitle = fmt({ month: "long", year: "numeric" });
const shortDate = fmt({ day: "numeric", month: "short", year: "numeric" });
const dayMonth = fmt({ day: "numeric", month: "long" });
const fullDate = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const formatMonthTitle = (ref: MonthRef) =>
  monthTitle.format(Date.UTC(ref.year, ref.month, 1));
export const formatShortDate = (date: IsoDate) => shortDate.format(toUtc(date));
export const formatDayMonth = (date: IsoDate) => dayMonth.format(toUtc(date));
export const formatFullDate = (date: IsoDate) => fullDate.format(toUtc(date));

// Booking inputs use the US-style numeric format, exactly like the reference.
export function formatInputDate(date: IsoDate): string {
  const [y, m, d] = date.split("-");
  return `${m}/${d}/${y}`;
}

export function dayOfMonth(date: IsoDate): number {
  return Number(date.slice(8, 10));
}

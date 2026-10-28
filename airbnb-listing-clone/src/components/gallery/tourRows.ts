import type { Photo } from "@/types/listing";

export type TourRow = { kind: "full"; photos: [Photo] } | { kind: "pair"; photos: [Photo, Photo] };

// Each room lays out in repeating groups of three — one full-width photo, then a pair.
// Leftovers follow the same idea: one photo goes full width, two become a pair.
export function tourRows(photos: Photo[]): TourRow[] {
  const rows: TourRow[] = [];
  let i = 0;
  while (i < photos.length) {
    const remaining = photos.length - i;
    if (remaining === 2) {
      rows.push({ kind: "pair", photos: [photos[i], photos[i + 1]] });
      i += 2;
      continue;
    }
    rows.push({ kind: "full", photos: [photos[i]] });
    if (remaining >= 3) rows.push({ kind: "pair", photos: [photos[i + 1], photos[i + 2]] });
    i += remaining >= 3 ? 3 : 1;
  }
  return rows;
}

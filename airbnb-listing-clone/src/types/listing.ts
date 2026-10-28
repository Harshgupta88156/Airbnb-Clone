import type { GlyphName } from "@/components/ui/icons/glyphs";

export interface Photo {
  id: string;
  src: string;
  width: number;
  height: number;
  room: string;
}

export interface PhotoRoom {
  id: string;
  name: string;
  features: string[];
  photos: Photo[];
}

export interface Amenity {
  label: string;
  icon: GlyphName;
  unavailable?: boolean;
}

export interface AmenityGroup {
  title: string;
  amenities: Amenity[];
}

export interface Highlight {
  icon: GlyphName;
  title: string;
  description: string;
}

export type AvatarTone = "peach" | "lavender" | "rose" | "sky";

export interface Person {
  name: string;
  avatar?: string;
  // People without a photo get Airbnb's initial-on-pastel avatar.
  tone?: AvatarTone;
}

export interface Review {
  author: Person;
  memberFor: string;
  postedAt: string;
  text: string;
}

export interface RatingCategory {
  label: string;
  score: string;
  icon: GlyphName;
}

export interface ReviewTag {
  label: string;
  count: number;
  image: string;
}

export interface SleepingSpace {
  room: string;
  beds: string;
  photo: Photo;
}

export interface NearbyStay {
  title: string;
  totalPrice: string;
  rating: string;
  image: string;
}

export interface ThingsToKnowGroup {
  title: string;
  icon: GlyphName;
  lines: string[];
}

export interface StayDates {
  checkIn: string;
  checkOut: string;
}

export interface Listing {
  title: string;
  documentTitle: string;
  headline: string;
  capacity: string[];
  rating: { score: string; reviewCount: number };
  guestFavouriteBlurb: string;
  host: {
    name: string;
    avatar: string;
    yearsHosting: number;
    reviewCount: string;
    rating: string;
    facts: { icon: GlyphName; text: string }[];
    coHosts: Person[];
    responseRate: string;
    responseTime: string;
  };
  highlights: Highlight[];
  description: string;
  sleeping: SleepingSpace[];
  amenityPreview: Amenity[];
  amenityGroups: AmenityGroup[];
  amenityCount: number;
  rooms: PhotoRoom[];
  heroPhotoIds: string[];
  booking: {
    currency: string;
    totalForStay: number;
    defaultStay: StayDates;
    guests: string;
    freeCancellationBefore: string;
    location: string;
    // Nights that are already booked; the calendar strikes them through.
    unavailable: string[];
  };
  reviews: {
    blurb: string;
    distribution: number[];
    categories: RatingCategory[];
    tags: ReviewTag[];
    featured: Review[];
  };
  location: {
    label: string;
    neighbourhood: string;
  };
  thingsToKnow: ThingsToKnowGroup[];
  nearbyStays: NearbyStay[];
}

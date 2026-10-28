import { allPhotos, heroPhotos, listing } from "@/data/listing";
import { ToastProvider } from "@/components/ui/Toast";
import { GalleryProvider } from "@/components/gallery/GalleryProvider";
import { PhotoTour } from "@/components/gallery/PhotoTour";
import { Lightbox } from "@/components/gallery/Lightbox";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { BookingSidebar } from "@/components/booking/BookingSidebar";
import { AvailabilityCalendar } from "@/components/booking/AvailabilityCalendar";
import { SiteHeader } from "@/components/header/SiteHeader";
import { SectionNav } from "@/components/header/SectionNav";
import { ListingTitle } from "@/components/listing/ListingTitle";
import { PhotoGrid } from "@/components/listing/PhotoGrid";
import { Overview } from "@/components/listing/Overview";
import { Description } from "@/components/listing/Description";
import { Sleeping } from "@/components/listing/Sleeping";
import { Amenities } from "@/components/listing/Amenities";
import { ThingsToKnow } from "@/components/listing/ThingsToKnow";
import { Reviews } from "@/components/reviews/Reviews";
import { Location } from "@/components/location/Location";
import { MeetYourHost } from "@/components/host/MeetYourHost";
import { NearbyStays } from "@/components/nearby/NearbyStays";
import styles from "./page.module.css";

// Providers render no markup, so everything below lands directly in <body>. The dialogs rely on
// that: they make the other top-level elements inert while open, and the toast region opts out.
export default function ListingPage() {
  return (
    <ToastProvider>
      <GalleryProvider>
        <BookingProvider>
          <a href="#main" className={styles.skipLink}>
            Skip to content
          </a>
          <SiteHeader />
          <SectionNav />

          <main id="main" tabIndex={-1} className={styles.page}>
            <div id="photos" tabIndex={-1}>
              <ListingTitle title={listing.title} />
              <PhotoGrid photos={heroPhotos} totalPhotos={allPhotos.length} />
            </div>

            <div className={styles.columns}>
              <div>
                <Overview listing={listing} />
                <Description text={listing.description} />
                <Sleeping spaces={listing.sleeping} />
                <Amenities
                  preview={listing.amenityPreview}
                  groups={listing.amenityGroups}
                  total={listing.amenityCount}
                />
                <AvailabilityCalendar />
              </div>
              <aside aria-label="Book this place">
                <BookingSidebar />
              </aside>
            </div>

            <Reviews listing={listing} />
            <Location location={listing.location} />
            <MeetYourHost host={listing.host} />
            <ThingsToKnow groups={listing.thingsToKnow} />
            <NearbyStays stays={listing.nearbyStays} />
          </main>

          <PhotoTour />
          <Lightbox />
        </BookingProvider>
      </GalleryProvider>
    </ToastProvider>
  );
}

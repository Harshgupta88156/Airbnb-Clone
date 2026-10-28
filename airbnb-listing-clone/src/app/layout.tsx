import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { listing } from "@/data/listing";
import "./globals.css";

const cereal = localFont({
  src: "./fonts/AirbnbCerealVF.woff2",
  weight: "200 900",
  display: "swap",
  variable: "--font-cereal",
});

export const metadata: Metadata = {
  title: listing.documentTitle,
  description: `${listing.headline}. ${listing.capacity.join(" · ")}.`,
  // A UI study, not a real listing: keep it out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={cereal.variable}>
      <body>{children}</body>
    </html>
  );
}

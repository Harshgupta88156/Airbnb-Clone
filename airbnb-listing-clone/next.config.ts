import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Listing photos are the whole point of the page, so they get a higher
    // quality tier than the 75 default. Everything else stays at 75.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

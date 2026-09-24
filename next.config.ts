import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hero photos are the largest bytes on the page; AVIF roughly halves them.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.fancode.com"], // ✅ allow fancode images
  },
};

export default nextConfig;

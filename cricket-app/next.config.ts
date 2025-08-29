import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.cricket.com",
      },
      {
        protocol: "https",
        hostname: "images.fancode.com",
      },
    ],
  },
};

export default nextConfig;

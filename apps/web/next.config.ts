import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow connections from Docker host
  allowedDevOrigins: ["http://localhost:3000"],

  // Allow external images from Unsplash (used in seed data)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

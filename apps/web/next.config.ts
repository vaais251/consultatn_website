import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow connections from Docker host
  allowedDevOrigins: ["http://localhost:3000"],
};

export default nextConfig;

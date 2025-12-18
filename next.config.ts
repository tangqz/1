
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true, // Simpler for static exports or standalone if needed, though not strictly required
  },
};

export default nextConfig;

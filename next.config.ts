import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "uploadthing.com" },
      { hostname: "*.ufs.sh" },
    ],
  },
};

export default nextConfig;

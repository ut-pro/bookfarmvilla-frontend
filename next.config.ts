import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "jsdom",
    "@exodus/bytes",
    "html-encoding-sniffer",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
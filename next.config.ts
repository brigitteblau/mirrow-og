import type { NextConfig } from "next";

const pocketbaseUrl = process.env.POCKETBASE_URL
  ? new URL(process.env.POCKETBASE_URL)
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: pocketbaseUrl
      ? [
          {
            protocol: pocketbaseUrl.protocol.replace(":", "") as "http" | "https",
            hostname: pocketbaseUrl.hostname,
            pathname: "/api/files/**",
          },
        ]
      : [],
  },
};

export default nextConfig;

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
  // Las páginas cambian de representación según `Accept` (HTML o Markdown,
  // ver src/proxy.ts), así que los caches tienen que distinguirlas.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Vary", value: "Accept" }],
      },
    ];
  },
};

export default nextConfig;

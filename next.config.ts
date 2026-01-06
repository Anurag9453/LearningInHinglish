import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Avoid Turbopack picking the wrong workspace root when multiple lockfiles exist.
  turbopack: {
    root: process.cwd(),
  },
  // Optimize images for better performance
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.svgrepo.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/api/catalog/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.wondertravelegypt.com",
        pathname: "/storage/**",
      },
    ],
    domains: ["images.unsplash.com", "flagcdn.com"],
  },
};

export default nextConfig;

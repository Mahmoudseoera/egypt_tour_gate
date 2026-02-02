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
      {
        protocol: 'https',
        hostname: '**', 
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    domains: ["images.unsplash.com", "flagcdn.com", "localhost"],
  },
};

export default nextConfig;

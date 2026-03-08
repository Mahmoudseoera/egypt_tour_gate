/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    domains: [
      "images.unsplash.com",
      "plus.unsplash.com", 
      "flagcdn.com",
      "localhost",
      "127.0.0.1",
      "www.wondertravelegypt.com",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",             // مهم جدًا
        pathname: "/uploads/**",  // المسار اللي الصورة موجودة فيه
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.wondertravelegypt.com",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
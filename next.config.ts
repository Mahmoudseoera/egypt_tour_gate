import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    domains: [
      "images.unsplash.com",
      "plus.unsplash.com", 
      "flagcdn.com",
      "localhost",
      "127.0.0.1",
      "www.egypttoursgate.com",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",             
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.egypttoursgate.com",
        pathname: "/storage/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

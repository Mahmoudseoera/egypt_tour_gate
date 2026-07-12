import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {

images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: 'plus.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: 'flagcdn.com',
    },
    {
      protocol: 'http',
      hostname: '127.0.0.1',
      port: '8000',
      pathname: '/uploads/**',
    },
    {
      protocol: 'http',
      hostname: 'localhost',
      pathname: '/uploads/**',
    },
     {
      protocol: 'https',
      hostname: 'www.egypttoursgate.com',
      pathname: '/uploads/**',
    },
    {
      protocol: 'https',
      hostname: 'www.egypttoursgate.com',
      pathname: '/storage/**',
    },
        {
      protocol: 'https',
      hostname: 'www.egypttoursgate.com',
      pathname: '/**',
    },
  ],
}
};

export default withNextIntl(nextConfig);

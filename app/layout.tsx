import type { Metadata } from 'next';
import '@/styles/globals.css';
import { montserrat } from './[locale]/fonts';
import Analytics, { GoogleTagManagerNoScript } from '@/components/seo/analytics';
import { buildSeoMetadata, DEFAULT_SEO_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  ...buildSeoMetadata({
    title: 'Egypt Tours: Best Vacations, Trips, and Tours to Egypt',
    description:
      'Egypt Tours from all countries are made for you. Visit Egypt, explore Egypt trips, enjoy Nile cruises, and discover the Egypt Pyramids.',
    keywords:
      'Egypt tours, Egypt trips, Egypt vacations, Egypt travel, tours to Egypt, Egypt holidays, Nile cruises',
    path: '/',
    image: DEFAULT_SEO_IMAGE,
  }),
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/assets/images/favicon.ico',
    shortcut: '/assets/images/favicon.ico',
    apple: '/assets/images/egypt-tour-gate-logo.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.egypttoursgate.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link
          rel="preload"
          as="image"
          href="/assets/images/egypt-tour-gate-logo.png"
          fetchPriority="high"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
          integrity="sha512-..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body suppressHydrationWarning className={`${montserrat.variable} antialiased`}>
        <GoogleTagManagerNoScript />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import '@/styles/globals.css';
import { montserrat } from './[locale]/fonts';
import Analytics, { GoogleTagManagerNoScript } from '@/components/seo/analytics';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import { getLocale } from 'next-intl/server';
import WebVitalsReporter from '@/components/seo/web-vitals';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Egypt Tours: Best Vacations, Trips, and Tours to Egypt',
    template: '%s | Egypt Tours Gate',
  },
  description:
    'Egypt Tours from all countries are made for you. Visit Egypt, explore Egypt trips, enjoy Nile cruises, and discover the Egypt Pyramids.',
  keywords:
    'Egypt tours, Egypt trips, Egypt vacations, Egypt travel, tours to Egypt, Egypt holidays, Nile cruises',
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.egypttoursgate.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
      </head>
      <body suppressHydrationWarning className={`${montserrat.variable} antialiased`}>
        <GoogleTagManagerNoScript />
        {children}
        <WebVitalsReporter />
        <Analytics />
      </body>
    </html>
  );
}

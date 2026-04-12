import type { Metadata } from "next";
import { Toaster } from 'sonner';
import {setRequestLocale} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import ScrollToTop from  "@/components/layout/scrollTop"
import MobileFooter from "@/components/layout/MobileFooter";
import WhatsappIcon from "@/components/layout/Whatsapp-icon";
import GlobalSeoSchema from "@/components/seo/global-seo-schema";
import {routing} from '@/lib/i18n/routing';
import { montserrat } from "./fonts";
 
type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};
 export const metadata: Metadata = {
  title: {
    default: "Egypt Tour Gate",
    template: "%s | Egypt Tour Gate",
  },
  icons: {
    icon: '/assets/images/favicon.ico', 
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
  },
  description: "Discover Egypt with the best tours & Nile cruises",
  metadataBase: new URL("https://www.egypttoursgate.com/"),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  // Enable static rendering
  setRequestLocale(locale);
 
  return (
    <>
      
          <html  suppressHydrationWarning>
      <head>
      <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
          integrity="sha512-..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body suppressHydrationWarning className={`${montserrat.variable} antialiased`}>
        <GlobalSeoSchema />
        <Navbar />
        {children}
        <ScrollToTop />
        <MobileFooter />
        <WhatsappIcon />
        <Footer />
                {/* Sonner Toaster */}
                <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>

    </>
  );
}
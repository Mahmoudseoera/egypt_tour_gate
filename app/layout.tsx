import type { Metadata } from "next";
import { headers } from "next/headers";
import { Toaster } from 'sonner';
import { montserrat } from "./fonts";
import Navbar from "../components/layout/navbar"
import Footer from "../components/layout/footer"
import ScrollToTop from  "../components/layout/scrollTop"
import MobileFooter from "../components/layout/MobileFooter";
import WhatsappIcon from "../components/layout/Whatsapp-icon";
import GlobalSeoSchema from "@/components/seo/global-seo-schema";
import { DEFAULT_LOCALE, isSupportedLocale } from "@/lib/i18n/config";

import "../styles/globals.css";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localeHeader = (await headers()).get("x-locale");
  const htmlLang = localeHeader && isSupportedLocale(localeHeader) ? localeHeader : DEFAULT_LOCALE;

  return (
    <html lang={htmlLang} suppressHydrationWarning>
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
  );
}

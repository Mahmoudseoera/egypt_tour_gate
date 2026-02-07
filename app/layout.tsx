import type { Metadata } from "next";
import { Toaster } from 'sonner';
import { montserrat } from "./fonts";
import Navbar from "../components/layout/navbar"
import Footer from "../components/layout/footer"
import ScrollToTop from  "../components/layout/scrollTop"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
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
        <Navbar />
        {children}
        <ScrollToTop />
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

import type {Metadata} from 'next';
import '@/styles/globals.css';
import {montserrat} from './[locale]/fonts';

export const metadata: Metadata = {
  title: {
    default: 'Egypt Tour Gate',
    template: '%s | Egypt Tour Gate'
  },
  icons: {
    icon: '/assets/images/favicon.ico',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png'
  },
  description: 'Discover Egypt with the best tours & Nile cruises',
  metadataBase: new URL('https://www.egypttoursgate.com/')
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en' suppressHydrationWarning>
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
        {children}
      </body>
    </html>
  );
}

import { Toaster } from 'sonner';
import {setRequestLocale} from 'next-intl/server';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import ScrollToTop from '@/components/layout/scrollTop';
import MobileFooter from '@/components/layout/MobileFooter';
import WhatsappIcon from '@/components/layout/Whatsapp-icon';
import GlobalSeoSchema from '@/components/seo/global-seo-schema';
import {routing} from '@/lib/i18n/routing';
 
type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider locale={locale}>
      <GlobalSeoSchema />
      <Navbar />
      {children}
      <ScrollToTop />
      <MobileFooter />
      <WhatsappIcon />
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </NextIntlClientProvider>
  );
}

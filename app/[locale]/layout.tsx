import type { Metadata } from "next";
import { Toaster } from 'sonner';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from "next-intl/server";
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import ScrollToTop from '@/components/layout/scrollTop';
import MobileFooter from '@/components/layout/MobileFooter';
import WhatsappIcon from '@/components/layout/Whatsapp-icon';
import GlobalSeoSchema from '@/components/seo/global-seo-schema';
import RouteProgress from '@/components/layout/route-progress';
import { routing } from '@/lib/i18n/routing';
// import { fetchTranslationMessages } from '@/lib/api/translation';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);


  // Fetch messages directly using the locale from params — this guarantees
  // we always get the correct locale's translations, bypassing getMessages()
  // which depends on next-intl's async storage context (unreliable in layouts).
  const messages = await getMessages();
  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
      <GlobalSeoSchema />
      <RouteProgress />
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

import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Toaster } from 'sonner';
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/layout/scrollTop";
import MobileFooter from "@/components/layout/MobileFooter";
import WhatsappIcon from "@/components/layout/Whatsapp-icon";
import GlobalSeoSchema from "@/components/seo/global-seo-schema";
import { isSupportedLocale } from "@/lib/i18n/routing";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
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

import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";
// app/أي-فولدر/page.tsx
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildSeoMetadata({
    title: "Egypt Tours Gate FAQs",
    description:
      "Find answers to frequently asked questions about Egypt Tours Gate tours, bookings, payments, private trips, and travel services.",
    path: "/faq",
    locale,
    noIndex: false,
  });
}

export default function Page() {
  return <div>Placeholder page</div>;
}

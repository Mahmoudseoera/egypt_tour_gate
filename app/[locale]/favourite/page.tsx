// app/[locale]/favourite/page.tsx
// Renders all tours the user has hearted.
// Pure client component — reads directly from localStorage via useFavourites.

"use client";

import { Heart, Trash2, ArrowLeft, PackageOpen } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useFavourites } from "@/lib/hooks/useFavourites";
import SecondTourCard from "@/components/tour/second-tour-card";

export default function FavouritePage() {
  const { favourites, clear } = useFavourites();
  const locale = useLocale();

  // Build a locale-aware path (respects `localePrefix: 'as-needed'`)
  const localePath = (path: string) =>
    locale === "en" ? path : `/${locale}${path}`;

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (favourites.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <PackageOpen size={40} className="text-red-300" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--second-color)] mb-2">
          No favourites yet
        </h1>
        <p className="text-gray-500 max-w-md mb-8">
          Tap the{" "}
          <Heart
            size={16}
            className="inline -mt-0.5 text-red-400 fill-red-400"
          />{" "}
          icon on any tour to save it here for quick access later.
        </p>
        <Link
          href={localePath("/")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90"
          style={{ background: "var(--second-color)" }}
        >
          <ArrowLeft size={18} />
          Explore Tours
        </Link>
      </main>
    );
  }

  // ── Filled state ─────────────────────────────────────────────────────────────
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Heart size={20} className="text-red-500 fill-red-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--second-color)]">
              My Favourites
            </h1>
          </div>
          <p className="text-gray-500 text-sm pl-[52px]">
            {favourites.length} {favourites.length === 1 ? "tour" : "tours"} saved
          </p>
        </div>

        <div className="flex items-center gap-3 pl-[52px] sm:pl-0">
          <Link
            href={localePath("/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-[var(--second-color)] hover:text-[var(--second-color)] transition"
          >
            <ArrowLeft size={16} />
            Browse more
          </Link>

          <button
            onClick={clear}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            <Trash2 size={16} />
            Clear all
          </button>
        </div>
      </div>

      {/* ── Decorative divider (matches home page style) ── */}
      <span className="relative block h-1 w-40 bg-gradient-to-r from-[var(--second-color)] via-[var(--main-color)] to-[var(--second-color)] mb-10 rounded-md
        before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
        before:w-4 before:h-4 before:bg-[url('/assets/images/pryamids-2.svg')] before:bg-contain before:bg-no-repeat before:z-20
        after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2
        after:w-[26px] after:h-[26px] after:bg-white after:rounded-full after:z-0"
      />

      {/* ── Tour grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {favourites.map((tour) => (
          <SecondTourCard
            key={tour.id}
            id={tour.id}
            image={tour.image}
            title={tour.title}
            description={tour.description}
            price={tour.price}
            rating={5}
            duration={tour.duration}
            location={tour.location}
            slug={tour.slug}
            categorySlug={tour.categorySlug}
            subcategorySlug={tour.subcategorySlug}
          />
        ))}
      </div>

    </main>
  );
}

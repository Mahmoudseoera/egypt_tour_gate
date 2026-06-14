// egypt_tour_gate/components/home/blog-section.tsx

"use client";
import { ArrowRight, User, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Article, ArticlesSection } from "@/lib/api/homeTypes";
import FallbackImage from "@/components/shared/fallback-image";

interface TravelBlogSectionProps {
  /** Full articles section from the home API (includes title + description). */
  articlesSection?: ArticlesSection | null;
  /** Convenience shortcut — ignored when articlesSection is provided. */
  apiArticles?: Article[];
}

interface DisplayPost {
  slug: string;
  categorySlug: string;
  image: string;
  title: string;
  smallDesc: string;
  author: string;
  publishedAt: string;
}

export default function TravelBlogSection({
  articlesSection,
  apiArticles = [],
}: TravelBlogSectionProps) {
  // ── Dynamic section heading with fallbacks ──────────────────────────────
  const heading =
    articlesSection?.title?.trim() || "Explore Latest Articles";
  const subheading =
    articlesSection?.description?.trim() ||
    "Discover breathtaking locations around the world and create unforgettable memories";
    console.log("blog subheading", articlesSection?.description)
  // ── Resolve articles: prefer articlesSection.articles, fall back to apiArticles
  const rawArticles =
    articlesSection?.articles?.length
      ? articlesSection.articles
      : apiArticles;

  // ── Map API articles → display posts ───────────────────────────────────
  const blogPosts: DisplayPost[] = rawArticles.slice(0, 6).map((a) => ({
    slug: a.slug,
    categorySlug: a.blog_category.slug,
    image: a.media.image,
    title: a.name,
    smallDesc: a.small_desc,
    author: a.author || "Egypt Tours Gate",
    publishedAt: a.date,
  }));

  // ── Date helper ─────────────────────────────────────────────────────────
  function getDateParts(raw: string): { day: string; month: string } {
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const d = new Date(raw);
      return {
        day: String(d.getDate()),
        month: d.toLocaleDateString("en-US", { month: "short" }),
      };
    }
    const parts = raw.split(" ");
    return { day: parts[0] ?? "—", month: parts[1] ?? "—" };
  }

  return (
    <div className="py-20 px-4 md:px-8 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto">

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--second-color)] mb-4">
            {heading}
          </h2>
          <span className="relative block h-1 w-40 mb-6 bg-gradient-to-r from-[var(--second-color)] via-[var(--main-color)] to-[var(--second-color)] mx-auto rounded-md before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:bg-[url('/assets/images/pryamids-2.svg')] before:bg-contain before:bg-no-repeat before:z-20 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[26px] after:h-[26px] after:bg-[var(--main-grey)] after:rounded-full after:z-0" />
          <p className="text-lg text-[var(--black-color)] opacity-70 max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {blogPosts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left Column — 3 small cards ───────────────────────────── */}
            <div className="flex flex-col gap-6 h-full">
              {blogPosts.slice(0, 3).map((post, index) => {
                const { day, month } = getDateParts(post.publishedAt);
                const href = `/blogs/${post.categorySlug}/${post.slug}`;
                return (
                  <Link
                    key={post.slug}
                    href={href}
                    className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex-1"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${(index + 1) * 0.1}s both`,
                    }}
                  >
                    <div className="flex items-stretch gap-0 p-4 h-full">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-30 h-30 min-h-[96px] rounded-2xl overflow-hidden relative self-stretch">
                        <FallbackImage
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          title={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="96px"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 px-4 flex flex-col justify-center gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[var(--main-color)] flex-shrink-0" />
                          <span className="text-[var(--main-color)] font-bold text-xs truncate">
                            {post.author}
                          </span>
                        </div>
                        <h6 className="text-[var(--second-color)] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[var(--main-color)] transition-colors duration-300">
                          {post.title}
                        </h6>
                        {post.smallDesc && (
                          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                            {post.smallDesc}
                          </p>
                        )}
                      </div>

                      {/* Date badge */}
                      <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-sm self-center min-w-[52px]">
                        <div className="bg-white border-b-2 border-[var(--main-color)] text-center px-2.5 py-1.5">
                          <div className="text-[var(--second-color)] text-lg font-bold leading-none">
                            {day}
                          </div>
                        </div>
                        <div className="bg-[var(--second-color)] text-center px-2.5 py-1">
                          <div className="text-white text-[10px] font-medium">
                            {month}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ── Middle Column — large featured card ───────────────────── */}
            {blogPosts[3] &&
              (() => {
                const post = blogPosts[3];
                const { day, month } = getDateParts(post.publishedAt);
                return (
                  <Link
                    href={`/blogs/${post.categorySlug}/${post.slug}`}
                    className="group rounded-3xl overflow-hidden shadow-md hover:shadow-2xl relative min-h-[600px] transition-all duration-300 hover:-translate-y-2"
                    style={{ animation: "fadeInUp 0.6s ease-out 0.4s both" }}
                  >
                    <div className="absolute inset-0">
                      <FallbackImage
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-end p-8">
                      <div className="inline-block rounded-xl overflow-hidden shadow-lg mb-4 w-fit">
                        <div className="bg-white border-b-2 border-[var(--main-color)] text-center px-4 py-2">
                          <div className="text-[var(--second-color)] text-2xl font-bold leading-none">{day}</div>
                        </div>
                        <div className="bg-[var(--second-color)] text-center px-4 py-2">
                          <div className="text-white text-xs font-medium">{month}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-[var(--main-color)]" />
                        <span className="text-[var(--main-color)] font-bold text-sm">{post.author}</span>
                      </div>
                      <h4 className="text-white font-semibold text-xl leading-snug mb-2 group-hover:text-[var(--main-color)] transition-colors duration-300">
                        {post.title}
                      </h4>
                      {post.smallDesc && (
                        <p className="text-white/70 text-sm leading-relaxed line-clamp-2">{post.smallDesc}</p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[var(--main-color)] text-sm font-bold group-hover:gap-3 transition-all duration-300">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                );
              })()}

            {/* ── Right Column — small card + large card ────────────────── */}
            <div className="flex flex-col gap-6 h-full">
              {blogPosts[4] &&
                (() => {
                  const post = blogPosts[4];
                  const { day, month } = getDateParts(post.publishedAt);
                  return (
                    <Link
                      href={`/blogs/${post.categorySlug}/${post.slug}`}
                      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                      style={{ animation: "fadeInUp 0.6s ease-out 0.5s both" }}
                    >
                      <div className="flex items-stretch gap-0 p-4">
                        <div className="flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden relative">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="96px"
                          />
                        </div>
                        <div className="flex-1 min-w-0 px-4 flex flex-col justify-center gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[var(--main-color)] flex-shrink-0" />
                            <span className="text-[var(--main-color)] font-bold text-xs truncate">{post.author}</span>
                          </div>
                          <h4 className="text-[var(--second-color)] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[var(--main-color)] transition-colors duration-300">
                            {post.title}
                          </h4>
                          {post.smallDesc && (
                            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{post.smallDesc}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-sm self-center min-w-[52px]">
                          <div className="bg-white border-b-2 border-[var(--main-color)] text-center px-2.5 py-1.5">
                            <div className="text-[var(--second-color)] text-lg font-bold leading-none">{day}</div>
                          </div>
                          <div className="bg-[var(--second-color)] text-center px-2.5 py-1">
                            <div className="text-white text-[10px] font-medium">{month}</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })()}

              {blogPosts[5] &&
                (() => {
                  const post = blogPosts[5];
                  const { day, month } = getDateParts(post.publishedAt);
                  return (
                    <Link
                      href={`/blogs/${post.categorySlug}/${post.slug}`}
                      className="group rounded-3xl overflow-hidden shadow-md hover:shadow-2xl relative flex-1 min-h-[400px] transition-all duration-300 hover:-translate-y-2"
                      style={{ animation: "fadeInUp 0.6s ease-out 0.6s both" }}
                    >
                      <div className="absolute inset-0">
                        <FallbackImage
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
                      </div>
                      <div className="relative z-10 h-full flex flex-col justify-between p-8">
                        <div className="self-end rounded-xl overflow-hidden shadow-lg w-fit">
                          <div className="bg-white text-center px-5 py-3 border-b-2 border-[var(--main-color)]">
                            <div className="text-[var(--second-color)] text-3xl font-bold leading-none">{day}</div>
                          </div>
                          <div className="bg-[var(--main-color)] text-center px-5 py-2">
                            <div className="text-[var(--second-color)] text-sm font-bold">{month}</div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-[var(--main-color)]" />
                            <span className="text-[var(--main-color)] font-bold text-sm">By {post.author}</span>
                          </div>
                          <h4 className="text-white font-bold text-xl leading-tight mb-2 group-hover:text-[var(--main-color)] transition-colors duration-300">
                            {post.title}
                          </h4>
                          {post.smallDesc && (
                            <p className="text-white/70 text-sm leading-relaxed line-clamp-2">{post.smallDesc}</p>
                          )}
                          <span className="mt-3 inline-flex items-center gap-1.5 text-[var(--main-color)] text-sm font-bold group-hover:gap-3 transition-all duration-300">
                            Read More <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })()}
            </div>
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <div className="mt-12 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg text-white shadow-lg bg-[var(--main-color)] hover:bg-[var(--second-color)] transition-all duration-300 hover:scale-105 group"
          >
            <BookOpen className="w-5 h-5" />
            <span>Explore All Articles</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

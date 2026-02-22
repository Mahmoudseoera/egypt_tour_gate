"use client";

import { ArrowRight, User, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getLatestPosts } from "@/lib/api/blogData";

export default function ImprovedBlogSection() {
  // Get the 6 latest blog posts from mockup data
  const blogPosts = getLatestPosts(6);

  return (
    <div className="py-20 px-4 md:px-8 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--second-color)] mb-4">
            Explore Latest Articles
          </h2>
          <span className="relative block h-1 w-40 mb-6 bg-gradient-to-r from-[var(--second-color)] via-[var(--main-color)] to-[var(--second-color)] mx-auto rounded-md before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:bg-[url('/assets/images/pryamids-2.svg')] before:bg-contain before:bg-no-repeat before:z-20 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[26px] after:h-[26px] after:bg-[var(--main-grey)] after:rounded-full after:z-0" />
          <p className="text-lg text-[var(--black-color)] opacity-70 max-w-2xl mx-auto">
            Discover breathtaking locations around the world and create
            unforgettable memories
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 3 Small Cards */}
          <div className="flex flex-col gap-6 h-full">
            {blogPosts.slice(0, 3).map((post, index) => (
              <Link
                href={`/blogs/${post.categorySlug}/${post.slug}`}
                key={post.slug}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex-1"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${(index + 1) * 0.1}s both`,
                }}
              >
                <div className="flex items-center gap-4 p-4 h-full">
                  {/* Image */}
                  <div className="flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden relative">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="96px"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-[var(--main-color)] flex-shrink-0" />
                      <h4 className="text-[var(--main-color)] font-bold text-sm truncate">
                        {post.author.name}
                      </h4>
                    </div>
                    <p className="text-[var(--second-color)] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[var(--main-color)] transition-colors duration-300">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Date Badge */}
                  <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-sm min-w-[60px]">
                    <div className="bg-white border-b-2 border-[var(--main-color)] text-center px-3 py-2">
                      <div className="text-[var(--second-color)] text-xl font-bold leading-none">
                        {new Date(post.publishedAt).getDate()}
                      </div>
                    </div>
                    <div className="bg-[var(--second-color)] text-center px-3 py-1">
                      <div className="text-white text-xs font-medium">
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          { month: "short" }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Middle Column - Medium Card */}
          <Link
            href={`/blogs/${blogPosts[3]?.categorySlug}/${blogPosts[3]?.slug}`}
            className="group rounded-3xl overflow-hidden shadow-md hover:shadow-2xl relative min-h-[600px] transition-all duration-300 hover:-translate-y-2"
            style={{ animation: "fadeInUp 0.6s ease-out 0.4s both" }}
          >
            <div className="absolute inset-0">
              <Image
                src={blogPosts[3]?.image || "/placeholder.svg"}
                alt={blogPosts[3]?.title || "Blog post"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-end p-8">
              {/* Date Badge */}
              <div className="inline-block rounded-xl overflow-hidden shadow-lg mb-4 w-fit">
                <div className="bg-white border-b-2 border-[var(--main-color)] text-center px-4 py-2">
                  <div className="text-[var(--second-color)] text-2xl font-bold leading-none">
                    {new Date(blogPosts[3]?.publishedAt || "").getDate()}
                  </div>
                </div>
                <div className="bg-[var(--second-color)] text-center px-4 py-2">
                  <div className="text-white text-xs font-medium">
                    {new Date(blogPosts[3]?.publishedAt || "").toLocaleDateString(
                      "en-US",
                      { month: "short" }
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-[var(--main-color)]" />
                <h4 className="text-[var(--main-color)] font-bold text-lg">
                  {blogPosts[3]?.author.name}
                </h4>
              </div>
              <p className="text-white font-semibold text-xl leading-snug mb-2 group-hover:text-[var(--main-color)] transition-colors duration-300">
                {blogPosts[3]?.title}
              </p>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Clock className="w-4 h-4" />
                <span>{blogPosts[3]?.readTime}</span>
              </div>
            </div>
          </Link>

          {/* Right Column - Small Card + Large Featured */}
          <div className="flex flex-col gap-6 h-full">
            {/* Small Card */}
            <Link
              href={`/blogs/${blogPosts[4]?.categorySlug}/${blogPosts[4]?.slug}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              style={{ animation: "fadeInUp 0.6s ease-out 0.5s both" }}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Image */}
                <div className="flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden relative">
                  <Image
                    src={blogPosts[4]?.image || "/placeholder.svg"}
                    alt={blogPosts[4]?.title || "Blog post"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="96px"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[var(--main-color)] flex-shrink-0" />
                    <h4 className="text-[var(--main-color)] font-bold text-sm truncate">
                      {blogPosts[4]?.author.name}
                    </h4>
                  </div>
                  <p className="text-[var(--second-color)] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[var(--main-color)] transition-colors duration-300">
                    {blogPosts[4]?.title}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{blogPosts[4]?.readTime}</span>
                  </div>
                </div>

                {/* Date Badge */}
                <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-sm min-w-[60px]">
                  <div className="bg-white border-b-2 border-[var(--main-color)] text-center px-3 py-2">
                    <div className="text-[var(--second-color)] text-xl font-bold leading-none">
                      {new Date(blogPosts[4]?.publishedAt || "").getDate()}
                    </div>
                  </div>
                  <div className="bg-[var(--second-color)] text-center px-3 py-1">
                    <div className="text-white text-xs font-medium">
                      {new Date(blogPosts[4]?.publishedAt || "").toLocaleDateString(
                        "en-US",
                        { month: "short" }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Large Featured Card */}
            <Link
              href={`/blogs/${blogPosts[5]?.categorySlug}/${blogPosts[5]?.slug}`}
              className="group rounded-3xl overflow-hidden shadow-md hover:shadow-2xl relative flex-1 min-h-[400px] transition-all duration-300 hover:-translate-y-2"
              style={{ animation: "fadeInUp 0.6s ease-out 0.6s both" }}
            >
              <div className="absolute inset-0">
                <Image
                  src={blogPosts[5]?.image || "/placeholder.svg"}
                  alt={blogPosts[5]?.title || "Blog post"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between p-8">
                {/* Date Badge - Top Right */}
                <div className="self-end rounded-xl overflow-hidden shadow-lg w-fit">
                  <div className="bg-white text-center px-5 py-3 border-b-2 border-[var(--main-color)]">
                    <div className="text-[var(--second-color)] text-3xl font-bold leading-none">
                      {new Date(blogPosts[5]?.publishedAt || "").getDate()}
                    </div>
                  </div>
                  <div className="bg-[var(--main-color)] text-center px-5 py-2">
                    <div className="text-[var(--second-color)] text-sm font-bold">
                      {new Date(blogPosts[5]?.publishedAt || "").toLocaleDateString(
                        "en-US",
                        { month: "short" }
                      )}
                    </div>
                  </div>
                </div>

                {/* Content - Bottom */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-[var(--main-color)]" />
                    <h4 className="text-[var(--main-color)] font-bold text-base">
                      By {blogPosts[5]?.author.name}
                    </h4>
                  </div>
                  <p className="text-white font-bold text-2xl leading-tight mb-2 group-hover:text-[var(--main-color)] transition-colors duration-300">
                    {blogPosts[5]?.title}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Clock className="w-4 h-4" />
                    <span>{blogPosts[5]?.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg text-white shadow-lg bg-[var(--main-color)] hover:bg-[var(--second-color)] transition-all duration-300 hover:scale-105 group"
          >
            <span>Explore All Articles</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Clock, User } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import FallbackImage from "@/components/shared/fallback-image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Minimal shape needed — mirror what page.tsx already has in relatedPosts
export interface RelatedPost {
  slug: string;
  title: string;
  image: string;
  imageAlt?: string;
  date: string;
  content: string;
  categorySlug: string;
  author: { name: string };
}

interface Props {
  posts: RelatedPost[];
}

export default function RelatedPostsSlider({ posts }: Props) {
  const isSlider = posts.length > 4;

  if (isSlider) {
    return (
      <Swiper
        modules={[Navigation]}
        navigation
        loop
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 10 },
          576: { slidesPerView: 2, spaceBetween: 15 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
        }}
      >
        {posts.map((relatedPost) => (
          <SwiperSlide key={relatedPost.slug}>
            <PostCard post={relatedPost} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {posts.map((relatedPost) => (
        <PostCard key={relatedPost.slug} post={relatedPost} />
      ))}
    </div>
  );
}

function PostCard({ post }: { post: RelatedPost }) {
  return (
    <Link
      href={`/blogs/${post.categorySlug}/${post.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 block h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <FallbackImage
          src={post.image}
          alt={post.imageAlt || post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="flex gap-2 mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4"/>
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-[var(--main-color)]" />
            <span className="text-gray-600">{post.author.name}</span>
          </div>
        </div>
        <h3 className="font-bold text-lg text-[var(--second-color)] group-hover:text-[var(--main-color)] transition-colors line-clamp-2 mb-3">
          {post.title}
        </h3>
        <div className="text-sm leading-relaxed line-clamp-4 blog-content">
          <p>{post.content}</p>
        </div>
      </div>
    </Link>
  );
}
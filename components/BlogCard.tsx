import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/api/blogData";

/**
 * BLOG CARD COMPONENT
 * Reusable card component for displaying blog posts
 * Props:
 * - post: Blog post data
 * - categorySlug: Category slug for the link URL
 */

interface BlogCardProps {
  post: BlogPost;
  categorySlug: string;
}

export default function BlogCard({ post, categorySlug }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Post Image with Link - Next.js Image component for optimization */}
      <Link href={`/blogs/${categorySlug}/${post.slug}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            width={400}
            height={250}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Gradient Overlay on Hover - Adds visual depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>

      {/* Post Content Container - Flex grow to push footer to bottom */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Post Title with Link */}
        <Link href={`/blogs/${categorySlug}/${post.slug}`}>
          <h3 className="text-xl font-bold mb-3 text-[#272262] hover:text-[#e3b75e] transition-colors line-clamp-2 min-h-[3.5rem]">
            {post.title}
          </h3>
        </Link>

        {/* Post Excerpt - Limited to 3 lines */}
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed min-h-[4.5rem]">
          {post.excerpt}
        </p>

        {/* Spacer to push footer to bottom */}
        <div className="flex-grow"></div>

        {/* Post Meta - Author and Read Time */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
          {/* Author Info with Icon */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
            <span className="font-medium text-[#272262]">{post.author}</span>
          </div>

          {/* Read Time */}
          <span className="text-gray-500">{post.readTime}</span>
        </div>

        {/* Read More Link with Arrow Animation */}
        <Link 
          href={`/blogs/${categorySlug}/${post.slug}`}
          className="inline-flex items-center gap-2 text-[#e3b75e] font-semibold hover:gap-3 transition-all duration-300"
        >
          <span>Read More</span>
          {/* Animated Arrow Icon */}
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </article>
  );
}
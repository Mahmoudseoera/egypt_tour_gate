
/* Blog post details page  
   Route: /blogs/[subCategorySlug]/[blogslug]/page.tsx
   Displays all top-level blog categories in a grid layout  */
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getCategoryBySlug, getRelatedPosts } from  '../../../../lib/api/blogData';
import Breadcrumb from '@/components/layout/breadcrumb';
import ReactMarkdown from 'react-markdown';

interface BlogPostPageProps {
  params: Promise<{
    subCategorySlug: string;
    blogslug: string;
    
  }>;
}

interface TableOfContentItem {
  id: number;
  title: string;
}

const tableOfContents: TableOfContentItem[] = [
  { id: 1, title: "What is the Sphinx?" },
  { id: 2, title: "The Historical of the Sphinx" },
  { id: 3, title: "Who Constructed the Sphinx?" },
  { id: 4, title: "How was the Sphinx built?" },
  { id: 5, title: "What is the Sphinx's Secret?" },
  { id: 6, title: "Conclusion" }
]

const defaultCategories: Category[] = [
  { name: "Travel", count: 12 },
  { name: "Guide", count: 10 },
  { name: "Rental", count: 14 },
  { name: "Adventure", count: 16 },
  { name: "Vacation", count: 20 },
  { name: "Tips", count: 15 }
];
const cats =  defaultCategories;
export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{
      subCategorySlug: string;
      blogslug: string;
    }>;
  }
): Promise<Metadata> {
  const { blogslug } = await params;

  const post = getPostBySlug(blogslug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Egypt Travel Blog`,
    description: post.excerpt,
  };
}



export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { blogslug, subCategorySlug } = await params;

  const post = getPostBySlug(blogslug);
  const category = getCategoryBySlug(subCategorySlug);

  if (!post || !category) {
    notFound();
  }


  const relatedPosts = getRelatedPosts(post, 3);

  return (
    <div className="min-h-screen bg-grey-light">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blogs', href: '/blogs' },
          { label: category.title, href: `/blogs/${subCategorySlug}`},
          { label: post.title, href: `/blogs/${subCategorySlug}/${blogslug}`}
        ]}
      />

      {/* Article Header */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="article-head">
           {/* Category Badge */}
           <Link 
                    href={`/blogs/${subCategorySlug}`}
                    className="inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-bold mb-6 transition-colors"
                  >
                    <span>{category.icon}</span>
                    <span>{category.title}</span>
                  </Link>

                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6 leading-tight">
                    {post.title}
                  </h1>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-navy flex items-center justify-center text-white font-bold text-lg">
                        {post.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{post.author.name}</p>
                        <p className="text-sm text-gray-500">Author</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{post.readTime}</span>
                    </div>
                  </div>

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <article>
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  {/* Featured Image Placeholder */}
                  <div className="relative h-96 bg-gradient-to-br from-navy/10 to-gold/10 rounded-2xl mb-12 overflow-hidden">
                    {/* <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-32 h-32 text-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div> */}
                    <Image 
                    src={post.image}
                    alt={post.title}
                    fill
                    className="w-full h-full object-cover"
                    />
                  </div>
             {/* Table of Contents */}
            <div className="mb-12 border border-[var(--main-color)] rounded-xl overflow-hidden bg-white shadow-md">
              <div className="w-full px-6 py-4 flex items-center justify-between bg-[var(--main-grey)] hover:bg-gray-100 transition-colors">
              <h2 className="text-lg font-bold text-[var(--second-color)]">
                  In this article:
                </h2>
              </div>
              <div 
                className={`overflow-hidden transition-all duration-300`}
              >
                <div className="px-6 py-4 bg-white">
                  <ol className="space-y-2">
                    {tableOfContents.map((item) => (
                      <li key={item.id} className="group">
                        <a 
                          href={`#section-${item.id}`}
                          className="flex items-start gap-3 text-[var(--black-color)] hover:text-[var(--main-color)] transition-colors py-1"
                        >
                          <span className="text-[var(--main-color)] font-semibold min-w-[20px] text-sm">
                            {item.id}.
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform duration-200 text-sm">
                            {item.title}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
                  {/* Article Content */}
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-4xl font-bold text-navy mt-12 mb-6" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-3xl font-bold text-navy mt-10 mb-5" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-navy mt-8 mb-4" {...props} />,
                        h4: ({node, ...props}) => <h4 className="text-xl font-bold text-navy mt-6 mb-3" {...props} />,
                        p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-6" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700" {...props} />,
                        li: ({node, ...props}) => <li className="ml-4" {...props} />,
                        a: ({node, ...props}) => <a className="text-gold hover:text-navy font-semibold underline transition-colors" {...props} />,
                        blockquote: ({node, ...props}) => (
                          <blockquote className="border-l-4 border-gold pl-6 py-2 my-6 italic text-gray-600 bg-grey-light rounded-r" {...props} />
                        ),
                        strong: ({node, ...props}) => <strong className="font-bold text-navy" {...props} />,
                        code: ({node, ...props}) => <code className="bg-grey-light px-2 py-1 rounded text-sm font-mono text-navy" {...props} />,
                      }}
                    >
                      {post.content}
                    </ReactMarkdown>
                  </div>

                  {/* Tags */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-navy mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-3">
                      {post.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="bg-white border-2 border-gold text-navy px-4 py-2 rounded-full text-sm font-semibold hover:bg-gold hover:text-white transition-colors cursor-default"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Share Section */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-navy mb-4">Share This Article</h3>
                    <div className="flex gap-4">
                      <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877f2] hover:bg-[#1877f2]/90 text-white transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </button>
                      <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1da1f2] hover:bg-[#1da1f2]/90 text-white transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </button>
                      <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0077b5] hover:bg-[#0077b5]/90 text-white transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4">
            <div className="sticky top-10 space-y-8">
              
              {/* Categories Widget */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-[var(--main-grey)] border-b border-gray-200">
                  <h3 className="text-lg font-bold text-[var(--second-color)] flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--main-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Categories
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {cats.map((category, index) => (
                      <li key={index}>
                        <a 
                          href={`/category/${category.name.toLowerCase()}`}
                          className="flex items-center justify-between text-[var(--black-color)] hover:text-[var(--main-color)] transition-colors group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {category.name}
                          </span>
                          <span className="text-gray-500 text-sm">({category.count})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Related Posts Widget 
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-[var(--main-grey)] border-b border-gray-200">
                  <h3 className="text-lg font-bold text-[var(--second-color)] flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--main-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    Related Posts
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {relPosts.map((relPost) => (
                      <li key={relPost.id} className="group">
                        <a href={`/blog/${relPost.id}`} className="flex gap-3">
                          <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden">
                            <Image 
                              width={100}
                              height={80}
                              src={relPost.image} 
                              alt={relPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-[var(--black-color)] group-hover:text-[var(--main-color)] transition-colors line-clamp-2 mb-1">
                              {relPost.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span>{relPost.author}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{relPost.date}</span>
                              </div>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>*/}

            </div>
          </div>
        </div>
      </div>


      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-navy mb-8">Related Articles</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.slug}
                    className="group bg-grey-light rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <Link href={`/blogs/${relatedPost.categorySlug}/${relatedPost.slug}`}>
                      <div className="relative h-48 bg-gradient-to-br from-navy/20 to-gold/20">
                        {/* <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-16 h-16 text-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div> */}
                        <Image 
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        height={200}
                        width={400}
                        className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center text-gold font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                          <span>Read more</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-navy via-[#3d3586] to-navy">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Inspired by This Guide?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Let us help you plan the perfect Egyptian adventure tailored to your interests
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-gold hover:bg-gold/90 text-navy px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
              >
                Start Planning Your Trip
              </Link>
              <Link
                href={`/blogs/${subCategorySlug}`}
                className="inline-block bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full font-bold text-lg transition-all"
              >
                More {category.title} Articles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

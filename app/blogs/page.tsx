import {blogCategories, getBlogPostsByCategory} from "@/lib/api/blogData";
import Image from "next/image";
import Link from "next/link";
export default function Page() {
    return (
      <section className="blogs-page py-16 md:py-24 relative overflow-hidden bg-[#f9f9f9]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 right-20 w-8 h-8 bg-teal-300 rounded-full"></div>
        <div className="absolute bottom-32 left-16 w-6 h-6 bg-teal-400 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 text-teal-400 text-3xl opacity-40">+</div>
        
        {/* Dotted Path */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-20">
          <path d="M 100 50 Q 400 150, 800 100" stroke="#5eabc7" strokeWidth="2" strokeDasharray="6,10" fill="none"/>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Decorative Top Bar */}
          <div className="w-20 h-1.5 mx-auto mb-6 bg-[#e3b75e]"></div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#272262]">
            Blog Categories
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam natus temporibus iure, 
            quisquam assumenda consequatur ducimus dolorum eaque cum aliquam ipsa necessitatibus 
            perferendis, beatae deleniti ex illo est. Fugit, architecto?
          </p>
        </div>

        {/* Blog Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
          {blogCategories.map((category) => (
            <div 
              key={category.slug}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative before:absolute before:bottom-0 before:left-0 before:w-full before:h-1.5 before:bg-[#e3b75e] before:z-10"
            >
              {/* Image with Link */}
              <Link href={`/blogs/${category.slug}`} className="block relative overflow-hidden">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image 
                    src={category.image} 
                    alt={category.name} 
                    title={category.slug} 
                    width={400} 
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>

              {/* Content */}
              <div className="p-6 pb-8">
                {/* Title with Link - Fixed Height */}
                <Link href={`/blogs/${category.slug}`}>
                  <h2 className="text-2xl font-bold mb-3 transition-colors duration-300 hover:opacity-80 text-[#272262] h-16 line-clamp-2">
                    {category.name}
                  </h2>
                </Link>

                {/* Description - Fixed Height */}
                <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 h-20">
                  {category.description}
                </p>

                {/* CTA Button with Link */}
                <Link href={`/blogs/${category.slug}`}>
                  <button className="group/btn w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 bg-[#272262]">
                    <span>Explore Articles</span>
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover/btn:translate-x-1"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    );
}

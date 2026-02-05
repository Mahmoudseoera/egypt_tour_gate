import Link from "next/link";

/**
 * BREADCRUMB COMPONENT
 * Shows hierarchical navigation path for blog pages
 * Props:
 * - items: Array of breadcrumb items with name and slug
 * - currentPage: Optional current page name (not linked)
 */

interface BreadcrumbItem {
  name: string;
  slug: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPage?: string;
}

export default function Breadcrumb({ items, currentPage }: BreadcrumbProps) {
  return (
    <nav className="mb-8 flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
      {/* Home/All Categories Link */}
      <Link 
        href="/blogs" 
        className="text-gray-600 hover:text-[#e3b75e] transition-colors font-medium"
      >
        All Categories
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <div key={item.slug} className="flex items-center gap-2">
          {/* Separator */}
          <span className="text-gray-400">/</span>
          
          {/* Last item or has currentPage - no link */}
          {index === items.length - 1 && !currentPage ? (
            <span className="text-[#272262] font-semibold">
              {item.name}
            </span>
          ) : (
            <Link 
              href={`/blogs/${item.slug}`}
              className="text-gray-600 hover:text-[#e3b75e] transition-colors font-medium"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}

      {/* Current Page (if provided) */}
      {currentPage && (
        <div className="flex items-center gap-2">
          <span className="text-gray-400">/</span>
          <span className="text-[#272262] font-semibold">
            {currentPage}
          </span>
        </div>
      )}
    </nav>
  );
}
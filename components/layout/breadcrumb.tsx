import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-600 overflow-x-auto scrollbar-thin whitespace-nowrap">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <li key={`${item.href}-${index}`} className="flex items-center gap-2 min-w-max w-auto">
                  {index > 0 && <span className="text-gray-400">/</span>}

                  {isLast ? (
                    <span className="text-[var(--second-color)] font-medium truncate max-w-xs">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-[var(--main-color)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}

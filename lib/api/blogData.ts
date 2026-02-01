/* ==============================
   TYPES
================================ */

export type BlogCategory = {
    id: number;
    name: string;
    slug: string;
    parentSlug: string | null;
  };
  
  export type BlogPost = {
    id: number;
    title: string;
    slug: string;
    categorySlug: string;
    excerpt: string;
    content: string;
    image: string;
    date: string;
  };
  
  /* ==============================
     BLOG CATEGORIES (TREE)
  ================================ */
  
  export const blogCategories: BlogCategory[] = [
    {
      id: 1,
      name: "Egypt Travel",
      slug: "egypt-travel",
      parentSlug: null,
    },
    {
      id: 2,
      name: "Luxury Travel",
      slug: "luxury-travel",
      parentSlug: "egypt-travel",
    },
    {
      id: 3,
      name: "Budget Travel",
      slug: "budget-travel",
      parentSlug: "egypt-travel",
    },
    {
      id: 4,
      name: "Cairo Travel",
      slug: "cairo-travel",
      parentSlug: "luxury-travel",
    },
  ];
  
  /* ==============================
     BLOG POSTS
  ================================ */
  
  export const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Best Luxury Hotels in Cairo",
      slug: "best-luxury-hotels-in-cairo",
      categorySlug: "cairo-travel",
      excerpt: "Discover the finest luxury hotels in Cairo...",
      content: "Full article content here...",
      image: "/images/blogs/cairo-luxury.jpg",
      date: "2026-01-10",
    },
    {
      id: 2,
      title: "How to Travel Egypt on a Budget",
      slug: "travel-egypt-on-budget",
      categorySlug: "budget-travel",
      excerpt: "Tips to explore Egypt with low cost...",
      content: "Full article content here...",
      image: "/images/blogs/budget-egypt.jpg",
      date: "2026-01-05",
    },
  ];
  
  /* ==============================
     HELPERS (READY FOR API LATER)
  ================================ */
  
  // get category by slug
  export const getBlogCategoryBySlug = (slug: string) =>
    blogCategories.find((cat) => cat.slug === slug);
  
  // get sub categories
  export const getBlogSubCategories = (parentSlug: string) =>
    blogCategories.filter((cat) => cat.parentSlug === parentSlug);
  
  // get posts by category (including children)
  export const getBlogPostsByCategory = (categorySlug: string) => {
    const childCategories = blogCategories
      .filter((cat) => cat.parentSlug === categorySlug)
      .map((cat) => cat.slug);
  
    return blogPosts.filter(
      (post) =>
        post.categorySlug === categorySlug ||
        childCategories.includes(post.categorySlug)
    );
  };
  
  // get post by slug
  export const getBlogPostBySlug = (slug: string) =>
    blogPosts.find((post) => post.slug === slug);
  
  // breadcrumb builder
  export const buildBlogBreadcrumb = (categorySlug: string) => {
    const breadcrumb = [];
  
    let current = blogCategories.find(
      (cat) => cat.slug === categorySlug
    );
  
    while (current) {
      breadcrumb.unshift({
        name: current.name,
        slug: current.slug,
      });
  
      current = current.parentSlug
        ? blogCategories.find(
            (cat) => cat.slug === current.parentSlug
          )
        : null;
    }
  
    return breadcrumb;
  };
  
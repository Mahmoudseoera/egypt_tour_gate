/* ==============================
   TYPES
================================ */

export type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  parentSlug: string | null;
  description: string;
  image: string;
  postCount: number;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  categorySlug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorAvatar: string;
  readTime: string;
  tags: string[];
  date: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  relatedPosts: number[];
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
      description: "Explore everything about travel and tourism in Egypt, from the Pyramids to the Red Sea beaches. Your comprehensive guide to Egypt's most beautiful destinations.",
      image: "/assets/images/blogs/blog-img1.jpg",
      postCount: 25,
    },
    {
      id: 2,
      name: "Luxury Travel",
      slug: "luxury-travel",
      parentSlug: "egypt-travel",
      description: "Luxury travel experiences in the best hotels, restaurants, and resorts across Egypt.",
      image: "/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp",
      postCount: 8,
    },
    {
      id: 3,
      name: "Budget Travel",
      slug: "budget-travel",
      parentSlug: "egypt-travel",
      description: "Tips and tricks for traveling on a low budget without compromising the amazing experience. Discover Egypt at minimal costs.",
      image: "/assets/images/blogs/camel front of giza pyramids.jpg",
      postCount: 12,
    },
    {
      id: 4,
      name: "Cairo Tourism",
      slug: "cairo-travel",
      parentSlug: "luxury-travel",
      description: "Everything you need to know about tourism in Cairo: hotels, landmarks, restaurants, and entertainment activities.",
      image: "/assets/images/blogs/A-wonderful-picture-of-a-tourist-in-front-of-the-pyramids-webp.webp",
      postCount: 15,
    },
    {
      id: 5,
      name: "Alexandria Tourism",
      slug: "alexandria-travel",
      parentSlug: "luxury-travel",
      description: "Exploring the Bride of the Mediterranean: its beaches, palaces, and famous restaurants.",
      image: "/assets/images/blogs/The-front-façade-of-Karnak-Temple-webp.webp",
      postCount: 7,
    },
    {
      id: 6,
      name: "Religious Tourism",
      slug: "religious-tourism",
      parentSlug: "egypt-travel",
      description: "Visits to historical religious sites in Egypt: churches, mosques, and monasteries.",
      image: "/assets/images/blogs/Philae-Temple-Island-from-the-top-webp.webp",
      postCount: 5,
    },
    {
      id: 7,
      name: "Adventure & Sports",
      slug: "adventure-sports",
      parentSlug: "egypt-travel",
      description: "Adventure activities and water/land sports across various regions of Egypt.",
      image: "/assets/images/blogs/adventure-sports.jpg",
      postCount: 9,
    },
    {
      id: 8,
      name: "Egyptian Cuisine",
      slug: "egyptian-cuisine",
      parentSlug: null,
      description: "Discover the most delicious traditional and contemporary Egyptian foods and the best restaurants to try them.",
      image: "/assets/images/blogs/guide-pictures_0052_Image-webp.webp",
      postCount: 6,
    },
    {
      id: 9,
      name: "Historical Sites",
      slug: "historical-sites",
      parentSlug: "egypt-travel",
      description: "Exploring ancient Egyptian monuments, temples, and archaeological sites across the country.",
      image: "/assets/images/blogs/A-wonderful-picture-of-a-tourist-in-front-of-the-pyramids-webp.webp",
      postCount: 18,
    },
    {
      id: 10,
      name: "Nile Cruises",
      slug: "nile-cruises",
      parentSlug: "luxury-travel",
      description: "Everything about Nile River cruises from Luxor to Aswan, including luxury ships and booking tips.",
      image: "/assets/images/blogs/Zeg1JAMgqWlSUwDLVY9yXLVQcUXhG6EQZPfCcjT4.jpg",
      postCount: 7,
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
   BLOG POSTS WITH DETAILS
================================ */

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
  
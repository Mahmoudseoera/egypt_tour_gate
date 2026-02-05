/* ==============================
   TYPES - Type definitions for blog structure
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
  date: string;
  readTime: string; // Added for better UX
};

/* ==============================
   BLOG CATEGORIES (HIERARCHICAL TREE STRUCTURE)
   Parent categories have parentSlug: null
   Child categories reference their parent via parentSlug
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
   BLOG POSTS - Complete mock data for all categories
================================ */

export const blogPosts: BlogPost[] = [
  // Cairo Travel Posts (luxury-travel > cairo-travel)
  {
    id: 1,
    title: "Best Luxury Hotels in Cairo",
    slug: "best-luxury-hotels-in-cairo",
    categorySlug: "cairo-travel",
    excerpt: "Discover the finest luxury hotels in Cairo offering world-class amenities, stunning Nile views, and Egyptian hospitality.",
    content: `
      <h2>Introduction</h2>
      <p>Cairo, the vibrant capital of Egypt, is home to some of the world's most luxurious hotels. Whether you're visiting the Pyramids or exploring the bustling markets, these hotels offer the perfect retreat.</p>
      
      <h2>Top Luxury Hotels</h2>
      <h3>1. Four Seasons Cairo at Nile Plaza</h3>
      <p>Located on the banks of the Nile, this hotel offers stunning river views and exceptional service.</p>
      
      <h3>2. The Nile Ritz-Carlton</h3>
      <p>A historic landmark combining classic elegance with modern luxury.</p>
      
      <h2>Conclusion</h2>
      <p>These luxury hotels ensure your Cairo experience is unforgettable.</p>
    `,
    image: "/assets/images/blogs/cairo-luxury.jpg",
    date: "2026-01-10",
    author: "Mirna Khalil",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Top 10 Restaurants in Cairo",
    slug: "top-10-restaurants-cairo",
    categorySlug: "cairo-travel",
    excerpt: "Experience the best dining Cairo has to offer, from traditional Egyptian cuisine to international flavors.",
    content: `
      <h2>Cairo's Culinary Scene</h2>
      <p>Cairo's restaurant scene is as diverse as the city itself. Here are the top 10 restaurants you must try.</p>
      
      <h3>1. Sequoia</h3>
      <p>Mediterranean cuisine with stunning Nile views.</p>
      
      <h3>2. Abou El Sid</h3>
      <p>Authentic Egyptian cuisine in a traditional setting.</p>
    `,
    image: "/assets/images/blogs/cairo-restaurants.jpg",
    date: "2026-01-15",
    author: "Ahmed Hassan",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Cairo Nightlife Guide",
    slug: "cairo-nightlife-guide",
    categorySlug: "cairo-travel",
    excerpt: "Explore Cairo after dark with our comprehensive nightlife guide featuring the best bars, clubs, and entertainment.",
    content: `
      <h2>Cairo After Dark</h2>
      <p>When the sun sets, Cairo comes alive with a vibrant nightlife scene.</p>
    `,
    image: "/assets/images/blogs/cairo-nightlife.jpg",
    date: "2026-01-20",
    author: "Mirna Khalil",
    readTime: "6 min read",
  },

  // Budget Travel Posts
  {
    id: 4,
    title: "How to Travel Egypt on a Budget",
    slug: "travel-egypt-on-budget",
    categorySlug: "budget-travel",
    excerpt: "Complete guide to exploring Egypt without breaking the bank. Tips, tricks, and budget-friendly recommendations.",
    content: `
      <h2>Budget Travel Tips</h2>
      <p>Egypt can be explored on any budget. Here's how to make the most of your trip without overspending.</p>
      
      <h3>Accommodation</h3>
      <p>Hostels and budget hotels offer great value, especially in Cairo and Luxor.</p>
      
      <h3>Transportation</h3>
      <p>Use local buses and trains instead of private taxis.</p>
    `,
    image: "/assets/images/blogs/budget-egypt.jpg",
    date: "2026-01-05",
    author: "Ali Mohamed",
    readTime: "8 min read",
  },
  {
    id: 5,
    title: "Cheap Eats in Egypt: Street Food Guide",
    slug: "cheap-eats-egypt-street-food",
    categorySlug: "budget-travel",
    excerpt: "Discover delicious and affordable street food across Egypt, from koshari to ful medames.",
    content: `
      <h2>Egyptian Street Food</h2>
      <p>Street food in Egypt is not only delicious but incredibly affordable.</p>
    `,
    image: "/assets/images/blogs/street-food.jpg",
    date: "2026-01-08",
    author: "Sara Ibrahim",
    readTime: "5 min read",
  },

  // Alexandria Travel Posts
  {
    id: 6,
    title: "Alexandria Beach Guide: Best Beaches to Visit",
    slug: "alexandria-beach-guide",
    categorySlug: "alexandria-travel",
    excerpt: "From Montaza to Stanley Beach, discover the best beaches in Alexandria for swimming and relaxation.",
    content: `
      <h2>Alexandria's Beautiful Beaches</h2>
      <p>The Mediterranean coastline offers stunning beaches perfect for summer relaxation.</p>
    `,
    image: "/assets/images/blogs/alexandria-beach.jpg",
    date: "2026-01-12",
    author: "Layla Fawzy",
    readTime: "6 min read",
  },
  {
    id: 7,
    title: "Historical Landmarks of Alexandria",
    slug: "historical-landmarks-alexandria",
    categorySlug: "alexandria-travel",
    excerpt: "Explore the rich history of Alexandria through its ancient landmarks and museums.",
    content: `
      <h2>Alexandria's Heritage</h2>
      <p>From the Bibliotheca Alexandrina to Qaitbay Citadel, Alexandria is rich in history.</p>
    `,
    image: "/assets/images/blogs/alexandria-history.jpg",
    date: "2026-01-18",
    author: "Omar Saeed",
    readTime: "7 min read",
  },

  // Religious Tourism Posts
  {
    id: 8,
    title: "Coptic Cairo: A Journey Through Christian History",
    slug: "coptic-cairo-christian-history",
    categorySlug: "religious-tourism",
    excerpt: "Visit ancient churches and monasteries in Coptic Cairo, one of Egypt's most important Christian heritage sites.",
    content: `
      <h2>Coptic Cairo</h2>
      <p>Explore the spiritual heart of Christian Egypt with its ancient churches and monasteries.</p>
    `,
    image: "/assets/images/blogs/coptic-cairo.jpg",
    date: "2026-01-14",
    author: "Mina Ishaq",
    readTime: "6 min read",
  },
  {
    id: 9,
    title: "Islamic Cairo: Mosques and Monuments",
    slug: "islamic-cairo-mosques-monuments",
    categorySlug: "religious-tourism",
    excerpt: "Discover the magnificent mosques and Islamic architecture of historic Cairo.",
    content: `
      <h2>Islamic Cairo</h2>
      <p>The mosques of Cairo represent some of the finest Islamic architecture in the world.</p>
    `,
    image: "/assets/images/blogs/islamic-cairo.jpg",
    date: "2026-01-16",
    author: "Youssef Kamal",
    readTime: "8 min read",
  },

  // Adventure & Sports Posts
  {
    id: 10,
    title: "Diving in the Red Sea: Complete Guide",
    slug: "diving-red-sea-complete-guide",
    categorySlug: "adventure-sports",
    excerpt: "Everything you need to know about diving in the Red Sea, from best spots to equipment rental.",
    content: `
      <h2>Red Sea Diving</h2>
      <p>The Red Sea offers some of the world's best diving experiences with vibrant coral reefs.</p>
    `,
    image: "/assets/images/blogs/red-sea-diving.jpg",
    date: "2026-01-11",
    author: "Karim Adel",
    readTime: "10 min read",
  },
  {
    id: 11,
    title: "Desert Safari Adventures in Egypt",
    slug: "desert-safari-adventures-egypt",
    categorySlug: "adventure-sports",
    excerpt: "Experience the thrill of desert safaris, quad biking, and camping under the stars.",
    content: `
      <h2>Desert Adventures</h2>
      <p>Egypt's deserts offer endless opportunities for adventure and exploration.</p>
    `,
    image: "/assets/images/blogs/desert-safari.jpg",
    date: "2026-01-13",
    author: "Hossam Youssef",
    readTime: "7 min read",
  },

  // Egyptian Cuisine Posts
  {
    id: 12,
    title: "Traditional Egyptian Dishes You Must Try",
    slug: "traditional-egyptian-dishes",
    categorySlug: "egyptian-cuisine",
    excerpt: "From koshari to mahshi, discover the most beloved traditional Egyptian dishes.",
    content: `
      <h2>Egyptian Cuisine</h2>
      <p>Egyptian food is a delicious blend of Mediterranean and Middle Eastern flavors.</p>
    `,
    image: "/assets/images/blogs/egyptian-food.jpg",
    date: "2026-01-09",
    author: "Nadia Mostafa",
    readTime: "6 min read",
  },
  {
    id: 13,
    title: "Best Egyptian Desserts and Sweets",
    slug: "best-egyptian-desserts-sweets",
    categorySlug: "egyptian-cuisine",
    excerpt: "Indulge in Egypt's sweetest treats, from basbousa to konafa.",
    content: `
      <h2>Egyptian Sweets</h2>
      <p>No trip to Egypt is complete without trying these traditional desserts.</p>
    `,
    image: "/assets/images/blogs/egyptian-desserts.jpg",
    date: "2026-01-17",
    author: "Hala Mahmoud",
    readTime: "5 min read",
  },

  // Historical Sites Posts
  {
    id: 14,
    title: "Complete Guide to Visiting the Pyramids of Giza",
    slug: "guide-visiting-pyramids-giza",
    categorySlug: "historical-sites",
    excerpt: "Everything you need to know before visiting Egypt's most iconic monuments.",
    content: `
      <h2>The Great Pyramids</h2>
      <p>The Pyramids of Giza are one of the Seven Wonders of the Ancient World.</p>
    `,
    image: "/assets/images/blogs/pyramids-guide.jpg",
    date: "2026-01-07",
    author: "Mohamed Amin",
    readTime: "9 min read",
  },
  {
    id: 15,
    title: "Luxor Temples: Valley of the Kings Guide",
    slug: "luxor-temples-valley-kings-guide",
    categorySlug: "historical-sites",
    excerpt: "Explore the magnificent temples and tombs of ancient Thebes in Luxor.",
    content: `
      <h2>Luxor's Ancient Treasures</h2>
      <p>Luxor is an open-air museum of ancient Egyptian civilization.</p>
    `,
    image: "/assets/images/blogs/luxor-temples.jpg",
    date: "2026-01-19",
    author: "Zahi Mostafa",
    readTime: "10 min read",
  },

  // Nile Cruises Posts
  {
    id: 16,
    title: "Best Nile Cruise Ships: Luxury vs Budget",
    slug: "best-nile-cruise-ships",
    categorySlug: "nile-cruises",
    excerpt: "Compare the best Nile cruise ships and find the perfect one for your Egypt adventure.",
    content: `
      <h2>Nile Cruises</h2>
      <p>A Nile cruise is the ultimate way to experience Egypt's ancient wonders.</p>
    `,
    image: "/assets/images/blogs/nile-cruise.jpg",
    date: "2026-01-21",
    author: "Amira Hassan",
    readTime: "8 min read",
  },
  {
    id: 17,
    title: "Nile Cruise Itinerary: Luxor to Aswan",
    slug: "nile-cruise-itinerary-luxor-aswan",
    categorySlug: "nile-cruises",
    excerpt: "Day-by-day guide to the classic Luxor to Aswan Nile cruise route.",
    content: `
      <h2>Cruise Itinerary</h2>
      <p>This itinerary covers all the must-see stops between Luxor and Aswan.</p>
    `,
    image: "/assets/images/blogs/cruise-itinerary.jpg",
    date: "2026-01-22",
    author: "Rami Farouk",
    readTime: "7 min read",
  },

  // Additional posts for parent categories
  {
    id: 18,
    title: "Ultimate Egypt Travel Guide 2026",
    slug: "ultimate-egypt-travel-guide-2026",
    categorySlug: "egypt-travel",
    excerpt: "Complete travel guide covering everything you need to know about visiting Egypt in 2026.",
    content: `
      <h2>Welcome to Egypt</h2>
      <p>This comprehensive guide covers all aspects of traveling in Egypt.</p>
    `,
    image: "/assets/images/blogs/egypt-guide.jpg",
    date: "2026-01-01",
    author: "Travel Egypt Team",
    readTime: "15 min read",
  },
  {
    id: 19,
    title: "When is the Best Time to Visit Egypt?",
    slug: "best-time-visit-egypt",
    categorySlug: "egypt-travel",
    excerpt: "Find out the ideal months to visit Egypt based on weather, crowds, and prices.",
    content: `
      <h2>Egypt's Seasons</h2>
      <p>Egypt has a desert climate with distinct high and low seasons for tourism.</p>
    `,
    image: "/assets/images/blogs/best-time-egypt.jpg",
    date: "2026-01-03",
    author: "Climate Egypt",
    readTime: "6 min read",
  },
  {
    id: 20,
    title: "Egyptian Coffee Culture: A Deep Dive",
    slug: "egyptian-coffee-culture",
    categorySlug: "egyptian-cuisine",
    excerpt: "Explore Egypt's rich coffee tradition and the best cafes to experience it.",
    content: `
      <h2>Coffee in Egypt</h2>
      <p>Egyptian coffee culture is an integral part of daily life and social gatherings.</p>
    `,
    image: "/assets/images/blogs/egyptian-coffee.jpg",
    date: "2026-01-23",
    author: "Cafe Cairo",
    readTime: "5 min read",
  },
];

/* ==============================
   HELPER FUNCTIONS
================================ */

/**
 * Get a single category by its slug
 */
export const getBlogCategoryBySlug = (slug: string): BlogCategory | undefined => {
  return blogCategories.find((cat) => cat.slug === slug);
};

/**
 * Get all direct child categories of a parent category
 */
export const getBlogSubCategories = (parentSlug: string): BlogCategory[] => {
  return blogCategories.filter((cat) => cat.parentSlug === parentSlug);
};

/**
 * Get all posts belonging to a category (including posts from child categories)
 */
export const getBlogPostsByCategory = (categorySlug: string): BlogPost[] => {
  // Get all child category slugs
  const childCategories = blogCategories
    .filter((cat) => cat.parentSlug === categorySlug)
    .map((cat) => cat.slug);

  // Return posts from this category and all child categories
  return blogPosts.filter(
    (post) =>
      post.categorySlug === categorySlug ||
      childCategories.includes(post.categorySlug)
  );
};

/**
 * Get a single blog post by its slug
 */
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.slug === slug);
};

/**
 * Build breadcrumb trail for a category (for navigation)
 * Returns array from root to current category
 */
export const buildBlogBreadcrumb = (categorySlug: string): Array<{ name: string; slug: string }> => {
  const breadcrumb: Array<{ name: string; slug: string }> = [];

  let current = blogCategories.find((cat) => cat.slug === categorySlug);

  // Walk up the category tree
  while (current) {
    breadcrumb.unshift({
      name: current.name,
      slug: current.slug,
    });

    const parentSlug = current?.parentSlug;
    current = parentSlug
      ? blogCategories.find((cat) => cat.slug === parentSlug)
      : undefined;
  }

  return breadcrumb;
};

/**
 * Find category by slug - searches all levels
 */
export const findBlogCategoryBySlug = (slug: string): BlogCategory | null => {
  return blogCategories.find((cat) => cat.slug === slug) || null;
};

/**
 * Get all top-level categories (parent categories with no parent)
 */
export const getTopLevelCategories = (): BlogCategory[] => {
  return blogCategories.filter((cat) => cat.parentSlug === null);
};

/**
 * Get category hierarchy path as string
 * Example: "Egypt Travel > Luxury Travel > Cairo Tourism"
 */
export const getCategoryPath = (categorySlug: string): string => {
  const breadcrumb = buildBlogBreadcrumb(categorySlug);
  return breadcrumb.map((item) => item.name).join(" > ");
};

/**
 * Check if a category has child categories
 */
export const hasSubCategories = (categorySlug: string): boolean => {
  return blogCategories.some((cat) => cat.parentSlug === categorySlug);
};

/**
 * Get related posts (from same category, excluding current post)
 */
export const getRelatedPosts = (currentPostSlug: string, limit: number = 3): BlogPost[] => {
  const currentPost = getBlogPostBySlug(currentPostSlug);
  if (!currentPost) return [];

  return blogPosts
    .filter(
      (post) =>
        post.categorySlug === currentPost.categorySlug &&
        post.slug !== currentPostSlug
    )
    .slice(0, limit);
};

/**
 * Get recent posts across all categories
 */
export const getRecentPosts = (limit: number = 5): BlogPost[] => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};
import {
  getBlogCategoryBySlug,
  getBlogPostsByCategory,
} from "@/lib/api/blogData";

const category = getBlogCategoryBySlug(params.categorySlug);
const posts = getBlogPostsByCategory(params.categorySlug);
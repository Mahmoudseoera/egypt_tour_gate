// ─── Home Page API Types ────────────────────────────────────────────────────

export interface SliderItem {
    title: string;
    media: {
      image_url: string;
      image_title: string;
      image_alt: string;
    };
    media2:{
      image_url: string;
      image_title: string;
      image_alt: string;
    };
    link: string | null;
    button_text: string | null;
    lang_id: number;
    description: string;
  }
  
  export interface AboutSection {
    about_sub_title: string;
    about_title: string;
    about_desc: string;
    about_img: string;
    about_img_title: string;
    about_img_alt: string;
    about_link: string;
    about_date: string;
    about_title2: string;
  }
  
  export interface TourMedia {
    image: string;
    title: string;
    alt: string;
  }
  
  export interface TourSubCategory {
    subCategorySlug: string;
    categorySlug: string;
  }
  
  export interface ApiTour {
    id: number;
    name: string;
    slug: string;
    small_desc: string;
    price_after_discount: number;
    city: string;
    duration_type: string;
    duration: number;
    media: TourMedia;
    subCategory: TourSubCategory;
  }
  
  export interface FirstToursSection {
    title: string;
    description: string;
    tours: ApiTour[];
  }

  export interface SecondToursSection {
    title: string;
    description: string;
    tours: ApiTour[];
  }

  /** Matches API `media` for tag categories (some responses use `image`, others `image_url`). */
  export interface TagCategoryMedia {
    image?: string;
    image_url?: string;
    title?: string;
    alt?: string;
  }
  
  export interface TagCategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    media?: TagCategoryMedia;
  }
  
  export interface TagCategoriesSection {
    title: string;
    description: string;
    tag_categories: TagCategory[];
  }
  
export interface WhyChooseItem {
  img: string;
  title?: string;
  desc?: string;
}
export interface WhyChooseSection {
  title: string;
  description: string;
  why_choose: {
    section1: WhyChooseItem;
    section2: WhyChooseItem;
    section3: WhyChooseItem;
    section4: WhyChooseItem;
    section5: WhyChooseItem;
    section6: WhyChooseItem;
  };
}
  
  export interface ReviewMedia {
    image: string;
    title: string;
  }
  
  export interface Review {
    id: number;
    name: string;
    role?: string;
    description: string;
    quote?: string;
    media: ReviewMedia;
  }
  
  export interface ReviewsSection {
    title: string;
    description: string;
    reviews: Review[];
  }
  
  export interface ArticleMedia {
    image: string;
    title: string;
    alt: string;
  }
  
  export interface ArticleBlogCategory {
    name: string;
    slug: string;
  }
  
  export interface Article {
    id: number;
    name: string;
    small_desc: string;
    slug: string;
    date: string;
    author: string;
    media: ArticleMedia;
    blog_category: ArticleBlogCategory;
  }
  
  export interface ArticlesSection {
    title: string;
    description: string;
    articles: Article[];
  }
  
  export interface Faq {
    title: string;
    answer: string;
  }
  
  export interface FaqSection {
    title: string;
    description: string;
    faqs: Faq[];
  }

  export interface Partner {
    id: number;
    image: string;
    img_title: string;
    img_alt: string;
  }

  export interface PartnersSection {
    partners: Partner[]; 
  }

export interface PageSeoScripts {
  home_page_scripts?: string;
  about_page_scripts?: string;
  contact_page_scripts?: string;
  favourites_page_scripts?: string;
  blog_page_scripts?: string;
  faq_page_scripts?: string;
  tailormade_page_scripts?: string;
}

export interface HomeSections {
  sliders_section: SliderItem[];
  about_section: AboutSection;
  first_tours_section: FirstToursSection;
  tag_categories_section: TagCategoriesSection;
  why_choose_section: WhyChooseSection;
  reviews_section: ReviewsSection;
  second_tours_section: SecondToursSection;
  articles_section: ArticlesSection;
  faq_section: FaqSection;
  partners_section: PartnersSection;
  seo: PageSeoScripts; // ← was missing; this is where every static page's SEO html actually lives
}
  export interface HomeApiResponse {
    success: boolean;
    data: {
      sections: HomeSections;
    };
    message: string;
  }

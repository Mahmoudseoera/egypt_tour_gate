/** Localized display name (e.g. en, pt) */
export interface LocalizedName {
  en: string;
  pt: string;
}

/** City within a category */
export interface CategoryCity {
  id: number;
  slug: string;
  name: LocalizedName;
}

/** Tour category (day tours, packages, cruises) */
export interface Category {
  id: number;
  type: string;
  slug: string;
  name: LocalizedName;
  cities?: CategoryCity[];
}

/** Day tour item */
export interface Tour {
  id: number;
  title: string;
  slug: string;
  category?: string;
  location: string;
  city?: string;
  duration: string;
  price_from: number;
  image?: string;
  short_description?: string;
  highlights?: string[];
  reviewCount?: number;
  description?: string;
  route?: string[];
  rating?: number;
}
/** Tour package item */
export interface TourPackage {
  id: number;
  title: string;
  slug: string;
  location: string;
  category?: string;
  duration: string;
  price_from: number;
  rating: number;
  image?: string;
  includes?: string[];
  reviewCount?: number;
  description?: string;
  route?: string[];
}

/** Nile Cruise item */
export interface NileCruise {
  id: number;
  title: string;
  slug: string;
  duration: string;
  location: string;
  price_from: number;
  rating: number;
  reviewCount?: number;
  description?: string;
  route?: string[];
  image?: string;
}
/** Root categories data (categories, tours, packages, nile_cruises) */
export interface CategoriesData {
  categories: Category[];
  tours: Tour[];
  packages: TourPackage[];
  nile_cruises: NileCruise[];
}

const categoriesData: CategoriesData = {
  categories: [
    {
      id: 2,
      type: "day_tours",
      slug: "egypt-day-tours",
      name: {
        en: "Egypt Day Tours",
        pt: "Egito: excursões de um dia"
      },
      cities: [
        {
          id: 1,
          slug: "cairo",
          name: { en: "Cairo", pt: "Cairo" }
        },
        {
          id: 2,
          slug: "luxor",
          name: { en: "Luxor", pt: "Luxor" }
        },
        {
          id: 3,
          slug: "hurghada",
          name: { en: "Hurghada", pt: "Hurghada" }
        },
        {
          id: 7,
          slug: "aswan",
          name: { en: "Aswan", pt: "Assuão" }
        }
      ]
    },
    {
      id: 3,
      type: "packages",
      slug: "egypt-tour-packages",
      name: {
        en: "Egypt Tour Packages",
        pt: "Pacotes para o Egito"
      }
    },
    {
      id: 4,
      type: "cruises",
      slug: "nile-cruises",
      name: {
        en: "Nile Cruises",
        pt: "Cruzeiros no Nilo"
      }
    }
  ],
  tours: [
    {
      id: 101,
      title: "Giza Pyramids & Sphinx Tour",
      slug: "giza-pyramids-sphinx-tour",
      duration: "1 Day",
      location: "Cairo",
      price_from: 75,
      rating: 4.8,
      reviewCount: 120,
      description: "Explore the Great Pyramids of Giza and the Sphinx with a professional Egyptologist.",
      route: ["Giza", "Sphinx"],
      image: "/assets/images/tours/106896752__MG_7633-final_Pompeys_Pillar-webp.webp"
    },
    {
      id: 102,
      title: "Valley of the Kings Tour",
      slug: "valley-of-the-kings-tour",
      duration: "1 Day",
      location: "Luxor",
      price_from: 85,
      rating: 4.9,
      reviewCount: 98,
      description: "Visit the royal tombs of ancient Egypt in Luxor's West Bank.",
      route: ["Valley of the Kings"],
      image: "/assets/images/tours/camel front of giza pyramids.jpg"
    },
    {
      id: 103,
      title: "Hurghada Desert Safari",
      slug: "hurghada-desert-safari",
      duration: "6 Hours",
      location: "Hurghada",
      price_from: 55,
      rating: 4.7,
      reviewCount: 76,
      description: "Enjoy an adventurous desert safari experience in Hurghada.",
      route: ["Hurghada Desert"],
      image: "/assets/images/tours/Pyramids-in-Egypt-webp.webp"
    },
    {
      id: 104,
      title: "Alexandria Day Tour from Cairo",
      slug: "alexandria-day-tour-from-cairo",
      duration: "1 Day",
      location: "Alexandria",
      price_from: 95,
      rating: 4.6,
      reviewCount: 64,
      description: "Discover Alexandria highlights including the Library and Citadel.",
      route: ["Library of Alexandria", "Citadel of Qaitbay"],
      image: "/assets/images/tours/Pyramids-in-Egypt-webp.webp"
    },
    {
      id: 105,
      title: "Aswan Nubian Village Tour",
      slug: "aswan-nubian-village-tour",
      duration: "4 Hours",
      location: "Aswan",
      price_from: 45,
      rating: 4.8,
      reviewCount: 89,
      description: "Visit the colorful Nubian village and learn about local culture.",
      route: ["Nubian Village"],
      image: "/assets/images/tours/9-Days-Marsa-Alam-Holiday-With-A-Tour-To-Pyramids-And-Old-Cairo-Egypt-Tours-Portal-webp.webp"
    },
    {
      id: 106,
      title: "Islamic & Coptic Cairo Tour",
      slug: "islamic-coptic-cairo-tour",
      duration: "1 Day",
      location: "Cairo",
      price_from: 70,
      rating: 4.7,
      reviewCount: 73,
      description: "Explore Islamic and Coptic landmarks in historic Cairo.",
      route: ["Coptic Cairo", "Islamic Cairo"],
      image: "/assets/images/tours/49-webp.webp"
    }
  ],
  
  
  packages: [
    {
      id: 201,
      title: "Classic Egypt 7 Days",
      slug: "classic-egypt-7-days",
      duration: "7 Days / 6 Nights",
      location: "Egypt",
      price_from: 899,
      rating: 4.9,
      reviewCount: 142,
      description: "A classic journey covering Cairo, Luxor, and Aswan.",
      route: ["Cairo", "Luxor", "Aswan"],
      image: "/assets/images/tours/Pyramids-in-Egypt-webp.webp"
    },
    {
      id: 202,
      title: "Egypt Highlights 10 Days",
      slug: "egypt-highlights-10-days",
      duration: "10 Days / 9 Nights",
      location: "Egypt",
      price_from: 1299,
      rating: 5,
      reviewCount: 87,
      description: "Discover Egypt’s top highlights in a complete 10-day experience.",
      route: ["Cairo", "Luxor", "Aswan"],
      image: "/assets/images/tours/Egypt Budget Tours-webp.webp"
    },
    {
      id: 203,
      title: "Luxury Egypt Vacation 12 Days",
      slug: "luxury-egypt-vacation-12-days",
      duration: "12 Days / 11 Nights",
      location: "Egypt",
      price_from: 2199,
      rating: 4.9,
      reviewCount: 56,
      description: "A premium luxury vacation including Nile Cruise and Red Sea.",
      route: ["Cairo", "Nile Cruise", "Red Sea"],
      image: "/assets/images/tours/Cairo day tours in Egypt-webp.webp"
    },
    {
      id: 204,
      title: "Budget Egypt Tour 5 Days",
      slug: "budget-egypt-tour-5-days",
      duration: "5 Days / 4 Nights",
      location: "Egypt",
      price_from: 499,
      rating: 4.5,
      reviewCount: 61,
      description: "Affordable Egypt tour covering essential attractions.",
      route: ["Cairo", "Giza"],
      image: "/assets/images/tours/blAWfq0nhc7yGL3wf2z3Od9pyZuHpNUkcgmumO0H.webp"
    }
  ],
  
  
  nile_cruises: [
    {
      id: 301,
      title: "Luxor to Aswan Nile Cruise",
      slug: "luxor-aswan-nile-cruise",
      duration: "4 Days / 3 Nights",
      location: "Upper Egypt",
      price_from: 650,
      rating: 4.8,
      reviewCount: 190,
      description: "Classic Nile cruise sailing from Luxor to Aswan.",
      route: ["Luxor", "Edfu", "Kom Ombo", "Aswan"],
      image: "/assets/images/tours/Cairo day tours in Egypt-webp.webp"
    },
    {
      id: 302,
      title: "Lake Nasser Cruise",
      slug: "lake-nasser-cruise",
      duration: "5 Days / 4 Nights",
      location: "Aswan",
      price_from: 850,
      rating: 4.6,
      reviewCount: 74,
      description: "A unique cruise experience across Lake Nasser.",
      route: ["Aswan", "Abu Simbel"],
      image: "/assets/images/tours/great-pyramid-webp.webp"
    },
    {
      id: 303,
      title: "Luxury Nile Cruise 5 Stars",
      slug: "luxury-nile-cruise-5-stars",
      duration: "5 Days / 4 Nights",
      location: "Upper Egypt",
      price_from: 1200,
      rating: 4.9,
      reviewCount: 112,
      description: "Five-star luxury Nile cruise with premium services.",
      route: ["Luxor", "Esna", "Edfu", "Aswan"],
      image: "/assets/images/tours/Pyramids-in-Egypt-webp.webp"
    },
    {
      id: 304,
      title: "Short Nile Cruise Experience",
      slug: "short-nile-cruise-experience",
      duration: "3 Days / 2 Nights",
      location: "Cairo",
      price_from: 450,
      rating: 4.8,
      reviewCount: 234,
      description: "Experience breathtaking views and relaxing Nile sailing.",
      route: ["Aswan", "Kom Ombo"],
      image: "/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp"
    }
  ]
  

};

export default categoriesData;

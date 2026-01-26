export type Tour = {
    id: number;
    slug: string;
    categorySlug: string;
    title: string;
    description: string;
    shortDescription: string;
    price: number;
    image: string;
  };
  
  export const tours: Tour[] = [
    {
      id: 1,
      slug: "amazing-egypt",
      categorySlug: "classic-tours",
      title: "Amazing Egypt Tour",
      shortDescription: "Discover the beauty of Egypt in 7 days.",
      description:
        "Full tour details: Cairo, Luxor, Aswan, Nile cruise, hotels, meals, guides...",
      price: 500,
      image: "/images/tour-01.jpg",
    },
  ];
  
  export const  secondTours = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      title: 'Mountain Adventure in the Alps',
      description:
        'Experience breathtaking views and challenging hiking trails in the heart of the Swiss Alps.',
      price: 1299,
      rating: 4.8,
      reviewCount: 234,
      duration: '7 Days',
      location: 'Switzerland',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
      title: 'Tropical Paradise Beach Tour',
      description:
        'Relax on pristine beaches, snorkel in crystal clear waters, and enjoy island culture.',
      price: 899,
      rating: 4.9,
      reviewCount: 512,
      duration: '5 Days',
      location: 'Maldives',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=300&fit=crop',
      title: 'Historic Cities Walking Tour',
      description:
        'Explore centuries of history, architecture, and culture in Europes most iconic cities.',
      price: 1599,
      rating: 4.7,
      reviewCount: 189,
      duration: '10 Days',
      location: 'Italy & Spain',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      title: 'Safari Expedition Africa',
      description:
        'Witness incredible wildlife and landscape photography opportunities in the African savanna.',
      price: 2499,
      rating: 5,
      reviewCount: 156,
      duration: '8 Days',
      location: 'Kenya',
    },
  ];
  export type TravelCategory = {
    id: number;
    slug: string;
    title: string;
    description: string;
    image: string;
    toursCount: number;
  };
  
  export const travelCategories: TravelCategory[] = [
    {
      id: 1,
      slug: "classic-tours",
      title: "Classic Tours",
      description: "Explore Egypt’s iconic landmarks like Cairo, Luxor, and Aswan.",
      image: "/images/categories/classic-tours.jpg",
      toursCount: 12,
    },
    {
      id: 2,
      slug: "nile-cruises",
      title: "Nile Cruises",
      description: "Luxury Nile cruises between Luxor and Aswan.",
      image: "/images/categories/nile-cruises.jpg",
      toursCount: 8,
    },
    {
      id: 3,
      slug: "desert-adventures",
      title: "Desert Adventures",
      description: "Safari trips and desert experiences in Egypt’s oases.",
      image: "/images/categories/desert-adventures.jpg",
      toursCount: 5,
    },
    {
      id: 4,
      slug: "family-tours",
      title: "Family Tours",
      description: "Fun and safe tours designed especially for families.",
      image: "/images/categories/family-tours.jpg",
      toursCount: 6,
    },
  ];
  
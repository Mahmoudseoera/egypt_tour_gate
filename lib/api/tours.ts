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
      image: "/assets/images/tours/9-Days-Marsa-Alam-Holiday-With-A-Tour-To-Pyramids-And-Old-Cairo-Egypt-Tours-Portal-webp.webp",
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
      image: "/assets/images/tours/106896752__MG_7633-final_Pompeys_Pillar-webp.webp",
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
      image: "/assets/images/tours/camel front of giza pyramids.jpg",
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
      image: "/assets/images/tours/Pyramids-in-Egypt-webp.webp",
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


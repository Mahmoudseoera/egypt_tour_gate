'use client';
import LightGallery from "lightgallery/react";

// styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";

// plugins
import lgZoom from "lightgallery/plugins/zoom"; 
import { useState , useRef  } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, MapPin, Clock, Users, Calendar, Star, Check } from 'lucide-react';

// Types
interface Tour {
  id: string;
  title: string;
  image: string;
  price: number;
  duration: string;
  rating: number;
  reviews: number;
}

interface Article {
  id: string;
  title: string;
  image: string;
}

interface PriceRow {
  category: string;
  price: number;
}

export default function TourDetailsClient() {
  const [activeDay, setActiveDay] = useState<number | null>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nationality: '',
    countryCode: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    childAge: '',
    message: ''
  });

  const lightGalleryRef = useRef<any>(null);

  // Sample data
  const tourImages = [
    'https://images.unsplash.com/photo-1761839257845-9283b7d1b933?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8',
    '/assets/images/tours/9-Days-Marsa-Alam-Holiday-With-A-Tour-To-Pyramids-And-Old-Cairo-Egypt-Tours-Portal-webp.webp',
    '/assets/images/tours/9-Days-Marsa-Alam-Holiday-With-A-Tour-To-Pyramids-And-Old-Cairo-Egypt-Tours-Portal-webp.webp',
    '/assets/images/tours/9-Days-Marsa-Alam-Holiday-With-A-Tour-To-Pyramids-And-Old-Cairo-Egypt-Tours-Portal-webp.webp',
    '/assets/images/tours/9-Days-Marsa-Alam-Holiday-With-A-Tour-To-Pyramids-And-Old-Cairo-Egypt-Tours-Portal-webp.webp',
    '/assets/images/tours/9-Days-Marsa-Alam-Holiday-With-A-Tour-To-Pyramids-And-Old-Cairo-Egypt-Tours-Portal-webp.webp',
  ];

  const highlights = [
    'Visit the iconic Pyramids of Giza and the Sphinx',
    'Explore the treasures of Tutankhamun in the Egyptian Museum',
    'Walk through ancient history in the temples of Luxor and Karnak',
    'Cruise along the legendary Nile River',
    'Professional English-speaking Egyptologist guide'
  ];

  const itinerary = [
    {
      day: 1,
      title: 'Cairo Arrival',
      description: 'Arrive at Cairo International Airport. Meet and greet by our representative. Transfer to your hotel. Overnight in Cairo.'
    },
    {
      day: 2,
      title: 'Pyramids & Egyptian Museum',
      description: 'Visit the Great Pyramids of Giza, the Sphinx, and the Valley Temple. Afternoon visit to the Egyptian Museum to see the treasures of Tutankhamun.'
    },
    {
      day: 3,
      title: 'Fly to Luxor - Nile Cruise',
      description: 'Flight to Luxor. Visit Karnak Temple and Luxor Temple. Board your Nile cruise ship. Dinner and overnight on board.'
    },
    {
      day: 4,
      title: 'Valley of the Kings',
      description: 'Visit the West Bank including Valley of the Kings, Hatshepsut Temple, and Colossi of Memnon. Sail to Edfu.'
    },
    {
      day: 5,
      title: 'Edfu & Kom Ombo',
      description: 'Visit Edfu Temple dedicated to Horus. Sail to Kom Ombo. Visit the unique double temple. Continue sailing to Aswan.'
    }
  ];

  const priceTable: PriceRow[] = [
    { category: 'Solo Traveler', price: 1450 },
    { category: '2-3 Persons', price: 950 },
    { category: '4-6 Persons', price: 850 },
    { category: '7-10 Persons', price: 750 },
    { category: 'Child (6-11 years)', price: 425 }
  ];

  const included = [
    'Accommodation in 5-star hotels',
    'All transfers in private air-conditioned vehicle',
    'Domestic flight tickets',
    'Professional Egyptologist guide',
    'All entrance fees to mentioned sites',
    'Meals as mentioned in itinerary'
  ];

  const excluded = [
    'International flights',
    'Entry visa to Egypt',
    'Personal expenses',
    'Tipping',
    'Optional tours'
  ];

  const relatedTours: Tour[] = [
    {
      id: '1',
      title: 'Cairo & Alexandria Discovery',
      image: '/images/tours/cairo-alexandria.jpg',
      price: 599,
      duration: '4 Days',
      rating: 4.8,
      reviews: 245
    },
    {
      id: '2',
      title: 'Luxor & Aswan Highlights',
      image: '/images/tours/luxor-aswan.jpg',
      price: 899,
      duration: '5 Days',
      rating: 4.9,
      reviews: 312
    },
    {
      id: '3',
      title: 'Red Sea Adventure',
      image: '/images/tours/red-sea.jpg',
      price: 450,
      duration: '3 Days',
      rating: 4.7,
      reviews: 189
    }
  ];

  const relatedArticles: Article[] = [
    {
      id: '1',
      title: 'Luxury tourism boom in Egypt',
      image: '/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp'
    },
    {
      id: '2',
      title: 'Covid-rules for traveling from USA to Egypt',
      image: '/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp'
    },
    {
      id: '3',
      title: 'Luxor Temple',
      image: '/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp'
    }
  ];

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (field: 'adults' | 'children', increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] + (increment ? 1 : -1))
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to thank you page
    window.location.href = '/thank-you';
  };

  const openLightbox = (index: number) => {
    if (lightGalleryRef.current) {
      lightGalleryRef.current.openGallery(index);
    }
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedImageIndex(prev => (prev === 0 ? tourImages.length - 1 : prev - 1));
    } else {
      setSelectedImageIndex(prev => (prev === tourImages.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="min-h-screen bg-main-grey">
    
      {/* Hero Section with Gallery */}
      <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden">
        <div className="grid grid-cols-4 grid-rows-2 gap-1 h-full md:gap-2">
          {/* Main large image */}
          <div 
            className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer rounded-xl group overflow-hidden bg-no-repeat bg-cover"
            onClick={() => openLightbox(0)}   style={{
              backgroundImage: `url(${tourImages[0]})`,
            }}
          >
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
            <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400" /> */}
            
            <span className="absolute bottom-4 left-4 text-white font-semibold text-lg z-20">
              View Gallery ({tourImages.length})
            </span>
          </div>
          
        {/* Smaller grid images */}
        {[1, 2, 3, 4].map((imageIndex) => (
          <div
            key={imageIndex}
            className="relative rounded-xl cursor-pointer group overflow-hidden hidden md:block w-full h-full bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${tourImages[imageIndex]})`,
            }}
            onClick={() => openLightbox(imageIndex)}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
          </div>
        ))}

        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content - Main Tour Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tour Header */}
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-semibold">
                  <Star className="w-4 h-4 fill-current" />
                  4.5 (128 reviews)
                </span>
                <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  Cairo, Luxor, Aswan
                </span>
                <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
                  <Clock className="w-4 h-4" />
                  5 Days / 4 Nights
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4">
                5-Day Egypt Discovery Tour: Cairo, Luxor & Nile Cruise
              </h1>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                Experience the wonders of ancient Egypt on this comprehensive 5-day tour. Visit the iconic Pyramids of Giza, 
                explore magnificent temples in Luxor, and cruise along the legendary Nile River. Perfect for first-time visitors 
                who want to see Egypt&apos;s greatest highlights in comfort and style.
              </p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">Highlights</h2>
              <ul className="space-y-3">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">Itinerary</h2>
              <div className="space-y-4">
  {itinerary.map((day) => {
    const isOpen = activeDay === day.day;

    return (
      <div
        key={day.day}
        className="border border-gray-200 rounded-lg overflow-hidden"
      >
        {/* Header */}
        <button
          type="button"
          onClick={() =>
            setActiveDay(isOpen ? null : day.day)
          }
          className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
        >
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {day.day}
          </div>

          <h3 className="flex-1 text-lg font-bold text-navy">
            {day.title}
          </h3>

          <span
            className={`transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>

        {/* Body */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="p-4 text-gray-700 leading-relaxed border-t">
              {day.description}
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>

            </div>

            {/* Price Table */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">Pricing</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gold">
                      <th className="text-left py-4 px-4 text-navy font-bold">Category</th>
                      <th className="text-right py-4 px-4 text-navy font-bold">Price per Person</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceTable.map((row, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-gray-700">{row.category}</td>
                        <td className="py-4 px-4 text-right font-bold text-gold text-lg">
                          ${row.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Prices are subject to availability and may vary during peak seasons. 
                  Contact us for group discounts and special offers.
                </p>
              </div>
            </div>

            {/* Included & Excluded */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                  <Check className="w-6 h-6 text-green-600" />
                  What&apos; s Included
                </h3>
                <ul className="space-y-2">
                  {included.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                  <X className="w-6 h-6 text-red-600" />
                  Whats Excluded
                </h3>
                <ul className="space-y-2">
                  {excluded.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden ">
              <div className="bg-gold text-white text-center py-4 px-6">
                <h3 className="text-xl font-bold">Check Availability</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all bg-blue-50/30"
                    placeholder="Mahmoud Abozeid"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all bg-blue-50/30"
                    placeholder="M.abozeid7@gmail.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nationality</label>
                  <select
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all bg-blue-50/30 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Nationality</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country Code</label>
                    <input
                      type="text"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all bg-blue-50/30"
                      placeholder="Egypt (+20)"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all bg-blue-50/30"
                      placeholder="1155131838"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check In</label>
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all bg-blue-50/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check Out</label>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all bg-blue-50/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Adults</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleNumberChange('adults', false)}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-semibold">{formData.adults}</span>
                      <button
                        type="button"
                        onClick={() => handleNumberChange('adults', true)}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Children</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleNumberChange('children', false)}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-semibold">{formData.children}</span>
                      <button
                        type="button"
                        onClick={() => handleNumberChange('children', true)}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {formData.children > 0 && (
                  <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Child Age</label>
                  <input
                    type="text"
                    name="childAge"
                    value={formData.childAge}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all bg-blue-50/30"
                    placeholder="e.g., 5, 8"
                  />
                </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all bg-blue-50/30 resize-none"
                    placeholder="Any special requests or questions..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold/90 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  REQUEST THIS TRIP
                </button>
              </form>
            </div>

            {/* Contact Box */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center border-t-4 border-gold">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gold" />
              </div>
              <p className="text-gray-600 mb-3">info@egypttoursgate.com</p>
              <a 
                href="tel:+201110008407" 
                className="text-2xl font-bold text-navy mb-4 block hover:text-gold transition-colors"
              >
                +201110008407
              </a>
              <a
                href="https://wa.me/201110008407"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 font-semibold mb-6 hover:text-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <button className="w-full bg-gold hover:bg-gold/90 text-white font-bold py-3 px-6 rounded-lg transition-all">
                CUSTOMIZE YOUR TRIP
              </button>
            </div>

            {/* Related Articles */}
{/* Related Articles */}
<div className="bg-white rounded-lg shadow-lg overflow-hidden">
  <div className="bg-gold text-white text-center py-4 px-6">
    <h3 className="text-xl font-bold">Related Articles</h3>
  </div>

  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
    {relatedArticles.map((article) => (
      <a
        key={article.id}
        href={`/articles/${article.id}`}
        className="group flex flex-col sm:flex-row lg:flex-row gap-4
        rounded-lg overflow-hidden border border-gray-200
        hover:shadow-md transition-all"
      >
        {/* Image */}
        <div className="relative w-full sm:w-32 lg:w-32 h-48 sm:h-32 flex-shrink-0">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-3 flex items-center">
          <h4 className="text-sm md:text-base font-semibold text-navy group-hover:text-gold transition-colors line-clamp-2">
            {article.title}
          </h4>
        </div>
      </a>
    ))}
  </div>
</div>

          </div>
        </div>

        {/* Related Tours */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">You May Also Like</h2>
            <p className="text-gray-600">Discover more amazing Egypt tours</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTours.map((tour) => (
              <a
                key={tour.id}
                href={`/tours/${tour.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 group"
              >
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-stone-300 to-stone-400">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 text-gold">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">{tour.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm">({tour.reviews} reviews)</span>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                    {tour.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{tour.duration}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">From</div>
                      <div className="text-2xl font-bold text-gold">${tour.price}</div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gold transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={() => navigateLightbox('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gold transition-colors z-10"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>
          
          <button
            onClick={() => navigateLightbox('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gold transition-colors z-10"
          >
            <ChevronRight className="w-12 h-12" />
          </button>
          
          <div className="relative w-full max-w-6xl h-full max-h-[90vh] flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-amber-300 to-stone-400 rounded-lg" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-semibold">
              {selectedImageIndex + 1} / {tourImages.length}
            </div>
          </div>
        </div>
      )}
      {/* Hidden LightGallery */}
<LightGallery
  onInit={(detail) => {
    lightGalleryRef.current = detail.instance;
  }}
  speed={500}
  plugins={[lgZoom]}
  dynamic
  dynamicEl={tourImages.map((img) => ({
    src: img,
    thumb: img,
  }))}
/>
    </div>
  );
}

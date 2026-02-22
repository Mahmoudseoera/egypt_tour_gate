'use client';

import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import lgZoom from "lightgallery/plugins/zoom";
import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import { useState, useRef, useEffect, useCallback } from 'react';
import { tourDetailsSchema, type TourDetailsFormData } from '@/lib/validations/tour-details.schema';
import Image from 'next/image';
import {
  X, ChevronLeft, ChevronRight, MapPin, Clock, Users,
  Calendar, Star, Check, Phone, Mail, MessageCircle,
  BookOpen, ArrowRight, Baby
} from 'lucide-react';

/* ─── Flatpickr (loaded dynamically to avoid SSR issues) ─── */
let flatpickrLoaded = false;
let fpModule: typeof import('flatpickr').default | null = null;

async function getFlatpickr() {
  if (!flatpickrLoaded) {
    const mod = await import('flatpickr');
    await import('flatpickr/dist/flatpickr.min.css' as string);
    fpModule = mod.default;
    flatpickrLoaded = true;
  }
  return fpModule!;
}

/* ─── Types ─── */
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
  date: string;       // ← added for requirement 5
  readTime: string;
}

interface PriceRow {
  category: string;
  price: number;
}

/* ─── Input shared classes ─── */
const inputCls =
  "w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--second-color)] focus:border-transparent outline-none transition-all bg-white text-sm text-gray-800 placeholder-gray-400";
const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide";
const errorCls = "mt-1 text-xs text-red-500 font-medium";

export default function TourDetailsClient() {
  const [activeDay, setActiveDay] = useState<number | null>(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  /* ── Form state ── */
  const [formData, setFormData] = useState<Omit<TourDetailsFormData, 'childAges'> & { childAges: string[] }>({
    name: '',
    email: '',
    nationality: '',
    countryCode: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    childAges: [],
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  /* Flatpickr refs */
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);
  const fpCheckIn = useRef<FlatpickrInstance | null>(null);
  const fpCheckOut = useRef<FlatpickrInstance | null>(null);

  const lightGalleryRef = useRef<any>(null);

  /* ── Init flatpickr ── */
  useEffect(() => {
    let destroyed = false;
    getFlatpickr().then((fp) => {
      if (destroyed) return;
      const today = new Date();

      fpCheckIn.current = fp(checkInRef.current!, {
        minDate: today,
        dateFormat: 'Y-m-d',
        altInput: true,
        altFormat: 'D, M J Y',
        disableMobile: false,
        onChange: ([date]) => {
          if (!date) return;
          const iso = date.toISOString().slice(0, 10);
          setFormData((p) => ({ ...p, checkIn: iso }));
          setFieldErrors((p) => { const n = { ...p }; delete n.checkIn; return n; });
          if (fpCheckOut.current) {
            fpCheckOut.current.set('minDate', date);
          }
        },
      });

      fpCheckOut.current = fp(checkOutRef.current!, {
        minDate: today,
        dateFormat: 'Y-m-d',
        altInput: true,
        altFormat: 'D, M J Y',
        disableMobile: false,
        onChange: ([date]) => {
          if (!date) return;
          const iso = date.toISOString().slice(0, 10);
          setFormData((p) => ({ ...p, checkOut: iso }));
          setFieldErrors((p) => { const n = { ...p }; delete n.checkOut; return n; });
        },
      });
    });

    return () => {
      destroyed = true;
      fpCheckIn.current?.destroy();
      fpCheckOut.current?.destroy();
    };
  }, []);

  /* ── Data ── */
  const tourImages = [
    '/assets/images/tours/9-Days-Marsa-Alam-Holiday-With-A-Tour-To-Pyramids-And-Old-Cairo-Egypt-Tours-Portal-webp.webp',
    '/assets/images/tours/great-pyramid-webp.webp',
    '/assets/images/tours/106896752__MG_7633-final_Pompeys_Pillar-webp.webp',
    '/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp',
    '/assets/images/tours/49-webp.webp',
    '/assets/images/tours/106896752__MG_7633-final_Pompeys_Pillar-webp.webp',
  ];

  const highlights = [
    'Visit the iconic Pyramids of Giza and the Sphinx',
    'Explore the treasures of Tutankhamun in the Egyptian Museum',
    'Walk through ancient history in the temples of Luxor and Karnak',
    'Cruise along the legendary Nile River',
    'Professional English-speaking Egyptologist guide',
  ];

  const itinerary = [
    { day: 1, title: 'Cairo Arrival', description: 'Arrive at Cairo International Airport. Meet and greet by our representative. Transfer to your hotel. Overnight in Cairo.' },
    { day: 2, title: 'Pyramids & Egyptian Museum', description: 'Visit the Great Pyramids of Giza, the Sphinx, and the Valley Temple. Afternoon visit to the Egyptian Museum to see the treasures of Tutankhamun.' },
    { day: 3, title: 'Fly to Luxor - Nile Cruise', description: 'Flight to Luxor. Visit Karnak Temple and Luxor Temple. Board your Nile cruise ship. Dinner and overnight on board.' },
    { day: 4, title: 'Valley of the Kings', description: 'Visit the West Bank including Valley of the Kings, Hatshepsut Temple, and Colossi of Memnon. Sail to Edfu.' },
    { day: 5, title: 'Edfu & Kom Ombo', description: 'Visit Edfu Temple dedicated to Horus. Sail to Kom Ombo. Visit the unique double temple. Continue sailing to Aswan.' },
  ];

  const priceTable: PriceRow[] = [
    { category: 'Solo Traveler', price: 1450 },
    { category: '2-3 Persons', price: 950 },
    { category: '4-6 Persons', price: 850 },
    { category: '7-10 Persons', price: 750 },
    { category: 'Child (6-11 years)', price: 425 },
  ];

  const included = [
    'Accommodation in 5-star hotels',
    'All transfers in private air-conditioned vehicle',
    'Domestic flight tickets',
    'Professional Egyptologist guide',
    'All entrance fees to mentioned sites',
    'Meals as mentioned in itinerary',
  ];

  const excluded = [
    'International flights',
    'Entry visa to Egypt',
    'Personal expenses',
    'Tipping',
    'Optional tours',
  ];

  const relatedTours: Tour[] = [
    { id: '1', title: 'Cairo & Alexandria Discovery', image: '/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp', price: 599, duration: '4 Days', rating: 4.8, reviews: 245 },
    { id: '2', title: 'Luxor & Aswan Highlights', image: '/assets/images/tours/49-webp.webp', price: 899, duration: '5 Days', rating: 4.9, reviews: 312 },
    { id: '3', title: 'Red Sea Adventure', image: '/assets/images/tours/106896752__MG_7633-final_Pompeys_Pillar-webp.webp', price: 450, duration: '3 Days', rating: 4.7, reviews: 189 },
  ];

  /* ── Articles now include date + readTime (requirement 5) ── */
  const relatedArticles: Article[] = [
    { id: '1', title: 'Luxury tourism boom in Egypt', image: '/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp', date: 'June 14, 2024', readTime: '5 min read' },
    { id: '2', title: 'Covid-rules for traveling from USA to Egypt', image: '/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp', date: 'May 28, 2024', readTime: '7 min read' },
    { id: '3', title: 'Luxor Temple: A Complete Visitor Guide', image: '/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp', date: 'April 10, 2024', readTime: '9 min read' },
  ];

  /* ── Handlers ── */
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setFieldErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  }, []);

  const handleNumberChange = useCallback((field: 'adults' | 'children', increment: boolean) => {
    setFormData((prev) => {
      const min = field === 'adults' ? 1 : 0;
      const next = Math.min(20, Math.max(min, prev[field] + (increment ? 1 : -1)));
      /* When children changes, resize childAges array */
      if (field === 'children') {
        const prevAges = prev.childAges;
        const newAges =
          next > prevAges.length
            ? [...prevAges, ...Array(next - prevAges.length).fill('')]
            : prevAges.slice(0, next);
        return { ...prev, children: next, childAges: newAges };
      }
      return { ...prev, [field]: next };
    });
    setFieldErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  }, []);

  /* Update individual child age by index */
  const handleChildAgeChange = useCallback((index: number, value: string) => {
    setFormData((p) => {
      const ages = [...p.childAges];
      ages[index] = value;
      return { ...p, childAges: ages };
    });
    setFieldErrors((p) => { const n = { ...p }; delete n[`childAge_${index}`]; delete n.childAges; return n; });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = tourDetailsSchema.safeParse(formData);

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('_') || 'form';
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setFieldErrors(nextErrors);
      /* Scroll to first error */
      const firstErrEl = document.querySelector('[data-field-error]');
      firstErrEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setFieldErrors({});
    setSubmitted(true);
    window.location.href = '/thank-you';
  };

  const openLightbox = (index: number) => {
    if (lightGalleryRef.current) {
      lightGalleryRef.current.openGallery(index);
    }
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    setSelectedImageIndex((prev) =>
      direction === 'prev'
        ? prev === 0 ? tourImages.length - 1 : prev - 1
        : prev === tourImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      {/* ── Flatpickr theme override + sidebar polish ── */}
      <style>{`
        /* Flatpickr calendar theming */
        .flatpickr-calendar {
          border-radius: 14px !important;
          box-shadow: 0 20px 60px rgba(39,34,98,.18) !important;
          font-family: inherit !important;
          border: none !important;
        }
        .flatpickr-day.selected,
        .flatpickr-day.selected:hover {
          background: var(--second-color) !important;
          border-color: var(--second-color) !important;
        }
        .flatpickr-day:hover {
          background: var(--main-color) !important;
          border-color: var(--main-color) !important;
          color: #fff !important;
        }
        .flatpickr-day.inRange {
          background: rgba(227,183,94,.18) !important;
          border-color: rgba(227,183,94,.18) !important;
        }
        .flatpickr-months .flatpickr-month,
        .flatpickr-current-month { background: var(--second-color) !important; color: #fff !important; border-radius: 14px 14px 0 0 !important; }
        .flatpickr-weekday { color: var(--second-color) !important; font-weight: 700 !important; }
        .numInputWrapper span:hover { background: var(--main-color) !important; }
        .flatpickr-input[readonly] { cursor: pointer; }
        .flatpickr-input.active { border-color: var(--second-color) !important; }

        /* Sidebar refinements (requirement 4) */
        .sidebar-form-header {
          background: linear-gradient(135deg, var(--second-color) 0%, #3d3586 100%);
        }
        .sidebar-contact-header {
          background: linear-gradient(135deg, #1a1a2e 0%, var(--second-color) 100%);
        }
        .sidebar-articles-header {
          background: linear-gradient(135deg, var(--second-color) 0%, #2d2566 100%);
        }
        .counter-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all .2s;
          font-size: 18px;
          line-height: 1;
          color: #555;
          cursor: pointer;
          background: white;
          flex-shrink: 0;
        }
        .counter-btn:hover {
          border-color: var(--second-color);
          color: var(--second-color);
          background: rgba(39,34,98,.06);
        }
        .counter-btn:disabled {
          opacity: .4;
          cursor: not-allowed;
        }
        .child-age-input {
          animation: slideIn .22s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Strip native date picker icon so flatpickr altInput looks clean */
        input[data-fp] { display: none !important; }
      `}</style>

    <div className="min-h-screen">

      {/* ── Hero Gallery ── */}
      <section className="relative w-full h-[320px] sm:h-[420px] md:h-[550px] overflow-hidden">
        <div className="grid grid-cols-4 grid-rows-2 gap-1 h-full md:gap-2">
          {/* Main image */}
          <div
            className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer rounded-xl group overflow-hidden bg-center bg-cover bg-no-repeat"
            onClick={() => openLightbox(0)}
            style={{ backgroundImage: `url(${tourImages[0]})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 group-hover:from-black/65 transition-all duration-300" />
            <span className="absolute bottom-4 left-4 text-white font-semibold text-base z-20 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              View Gallery ({tourImages.length})
            </span>
          </div>

          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="relative rounded-xl cursor-pointer group overflow-hidden hidden md:block w-full h-full bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${tourImages[i]})` }}
              onClick={() => openLightbox(i)}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Main Layout ── */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ════════════════════════════════════════
              LEFT — Main Content
          ════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-8">

            {/* Tour meta badges */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--main-color)]/10 text-[var(--main-color)] rounded-full text-sm font-semibold">
                  <Star className="w-4 h-4 fill-current" /> 4.5 (128 reviews)
                </span>
                <span className="inline-flex items-center gap-1.5 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 text-[var(--second-color)]" /> Cairo, Luxor, Aswan
                </span>
                <span className="inline-flex items-center gap-1.5 text-gray-500 text-sm">
                  <Clock className="w-4 h-4 text-[var(--second-color)]" /> 5 Days / 4 Nights
                </span>
              </div>
              <p className="text-gray-600 text-base leading-relaxed">
                Experience the wonders of ancient Egypt on this comprehensive 5-day tour. Visit the iconic Pyramids of Giza,
                explore magnificent temples in Luxor, and cruise along the legendary Nile River. Perfect for first-time visitors
                who want to see Egypt&apos;s greatest highlights in comfort and style.
              </p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[var(--second-color)] mb-5">Highlights</h2>
              <ul className="space-y-3">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[var(--main-color)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[var(--main-color)]" />
                    </span>
                    <span className="text-gray-700 text-sm leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[var(--second-color)] mb-5">Itinerary</h2>
              <div className="space-y-3">
                {itinerary.map((day) => {
                  const isOpen = activeDay === day.day;
                  return (
                    <div key={day.day} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setActiveDay(isOpen ? null : day.day)}
                        className="w-full flex items-center gap-3 p-4 bg-gray-50/70 hover:bg-gray-100 transition-colors text-left"
                      >
                        <div className="w-9 h-9 bg-[var(--second-color)] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {day.day}
                        </div>
                        <h3 className="flex-1 text-base font-semibold text-[var(--second-color)]">{day.title}</h3>
                        <span className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                      </button>
                      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <div className="p-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">{day.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[var(--second-color)] mb-5">Pricing</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--second-color)] text-white">
                      <th className="text-left py-3 px-5 text-sm font-semibold">Category</th>
                      <th className="text-right py-3 px-5 text-sm font-semibold">Price / Person</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceTable.map((row, i) => (
                      <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} hover:bg-[var(--main-color)]/5 transition-colors`}>
                        <td className="py-3.5 px-5 text-gray-700 text-sm">{row.category}</td>
                        <td className="py-3.5 px-5 text-right font-bold text-[var(--second-color)]">${row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Prices are subject to availability and may vary during peak seasons.
                  Contact us for group discounts and special offers.
                </p>
              </div>
            </div>

            {/* Included / Excluded */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[var(--second-color)] mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </span>
                  What&apos;s Included
                </h3>
                <ul className="space-y-2">
                  {included.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[var(--second-color)] mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-red-500" />
                  </span>
                  What&apos;s Excluded
                </h3>
                <ul className="space-y-2">
                  {excluded.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                      <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════
              RIGHT SIDEBAR
          ════════════════════════════════════════ */}
          <div className="lg:col-span-1 space-y-5">

            {/* ── Booking Form ── */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Header — navy gradient (req 4: no all-gold header) */}
              <div className="sidebar-form-header px-6 py-4 text-center">
                <h3 className="text-lg font-bold text-white tracking-wide">Check Availability</h3>
                <p className="text-white/70 text-xs mt-0.5">Fill in your details to request this trip</p>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4" noValidate>

                {/* Name */}
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                    className={`${inputCls} ${fieldErrors.name ? 'border-red-400 focus:ring-red-300' : ''}`}
                    placeholder="Mahmoud Abozeid" />
                  {fieldErrors.name && <p className={errorCls} data-field-error>{fieldErrors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className={`${inputCls} ${fieldErrors.email ? 'border-red-400 focus:ring-red-300' : ''}`}
                    placeholder="you@email.com" />
                  {fieldErrors.email && <p className={errorCls} data-field-error>{fieldErrors.email}</p>}
                </div>

                {/* Nationality */}
                <div>
                  <label className={labelCls}>Nationality</label>
                  <select name="nationality" value={formData.nationality} onChange={handleInputChange}
                    className={`${inputCls} appearance-none cursor-pointer ${fieldErrors.nationality ? 'border-red-400' : ''}`}>
                    <option value="">Select nationality…</option>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Canada">Canada</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Greece">Greece</option>
                    <option value="Hungary">Hungary</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran">Iran</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Japan">Japan</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Libya">Libya</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palestine">Palestine</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Romania">Romania</option>
                    <option value="Russia">Russia</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan">Sudan</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syria">Syria</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="UAE">UAE</option>
                    <option value="Uganda">Uganda</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United States">United States</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                  </select>
                  {fieldErrors.nationality && <p className={errorCls} data-field-error>{fieldErrors.nationality}</p>}
                </div>

                {/* Country Code + Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Code</label>
                    <input type="text" name="countryCode" value={formData.countryCode} onChange={handleInputChange}
                      className={`${inputCls} ${fieldErrors.countryCode ? 'border-red-400' : ''}`}
                      placeholder="+20" />
                    {fieldErrors.countryCode && <p className={errorCls} data-field-error>{fieldErrors.countryCode}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                      className={`${inputCls} ${fieldErrors.phone ? 'border-red-400' : ''}`}
                      placeholder="1155131838" />
                    {fieldErrors.phone && <p className={errorCls} data-field-error>{fieldErrors.phone}</p>}
                  </div>
                </div>

                {/* Check In / Check Out — flatpickr (req 3) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Check In</label>
                    <div className="relative">
                      <input
                        ref={checkInRef}
                        data-fp
                        readOnly
                        placeholder="Select date"
                        className={`${inputCls} pr-9 ${fieldErrors.checkIn ? 'border-red-400' : ''}`}
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {fieldErrors.checkIn && <p className={errorCls} data-field-error>{fieldErrors.checkIn}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Check Out</label>
                    <div className="relative">
                      <input
                        ref={checkOutRef}
                        data-fp
                        readOnly
                        placeholder="Select date"
                        className={`${inputCls} pr-9 ${fieldErrors.checkOut ? 'border-red-400' : ''}`}
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {fieldErrors.checkOut && <p className={errorCls} data-field-error>{fieldErrors.checkOut}</p>}
                  </div>
                </div>

                {/* Adults + Children counters */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Adults */}
                  <div>
                    <label className={labelCls}>Adults</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-2 border border-gray-200">
                      <button type="button" className="counter-btn" onClick={() => handleNumberChange('adults', false)} disabled={formData.adults <= 1}>−</button>
                      <span className="flex-1 text-center font-bold text-[var(--second-color)] text-sm">{formData.adults}</span>
                      <button type="button" className="counter-btn" onClick={() => handleNumberChange('adults', true)} disabled={formData.adults >= 20}>+</button>
                    </div>
                    {fieldErrors.adults && <p className={errorCls}>{fieldErrors.adults}</p>}
                  </div>

                  {/* Children */}
                  <div>
                    <label className={labelCls}>Children</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-2 border border-gray-200">
                      <button type="button" className="counter-btn" onClick={() => handleNumberChange('children', false)} disabled={formData.children <= 0}>−</button>
                      <span className="flex-1 text-center font-bold text-[var(--second-color)] text-sm">{formData.children}</span>
                      <button type="button" className="counter-btn" onClick={() => handleNumberChange('children', true)} disabled={formData.children >= 20}>+</button>
                    </div>
                    {fieldErrors.children && <p className={errorCls}>{fieldErrors.children}</p>}
                  </div>
                </div>

                {/* Dynamic child age inputs (req 2) */}
                {formData.children > 0 && (
                  <div className="space-y-2.5">
                    <label className={`${labelCls} flex items-center gap-1.5`}>
                      <Baby className="w-3.5 h-3.5 text-[var(--second-color)]" />
                      Child Ages (0–17)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: formData.children }).map((_, i) => (
                        <div key={i} className="child-age-input">
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              max={17}
                              value={formData.childAges[i] ?? ''}
                              onChange={(e) => handleChildAgeChange(i, e.target.value)}
                              className={`${inputCls} pl-7 ${fieldErrors[`childAges_${i}`] ? 'border-red-400' : ''}`}
                              placeholder={`Child ${i + 1}`}
                            />
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
                              {i + 1}
                            </span>
                          </div>
                          {fieldErrors[`childAges_${i}`] && (
                            <p className={errorCls} data-field-error>{fieldErrors[`childAges_${i}`]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    {fieldErrors.childAges && (
                      <p className={errorCls} data-field-error>{fieldErrors.childAges}</p>
                    )}
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className={labelCls}>Message (optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className={`${inputCls} resize-none ${fieldErrors.message ? 'border-red-400' : ''}`}
                    placeholder="Any special requests or questions…"
                  />
                  {fieldErrors.message && <p className={errorCls} data-field-error>{fieldErrors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full bg-[var(--second-color)] hover:bg-[#1e1a5e] text-white font-bold py-3.5 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-60 flex items-center justify-center gap-2 text-sm tracking-wider"
                >
                  REQUEST THIS TRIP <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* ── Contact Box (req 4: navy instead of gold) ── */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="sidebar-contact-header px-6 py-4 text-center">
                <p className="text-white/80 text-xs uppercase tracking-widest mb-1">Need Help?</p>
                <h3 className="text-base font-bold text-white">Talk to Our Team</h3>
              </div>
              <div className="p-5 space-y-3">
                <a href="mailto:info@egypttoursgate.com"
                  className="flex items-center gap-3 text-gray-600 hover:text-[var(--second-color)] transition-colors text-sm group">
                  <span className="w-9 h-9 rounded-full bg-[var(--second-color)]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--second-color)]/15 transition-colors">
                    <Mail className="w-4 h-4 text-[var(--second-color)]" />
                  </span>
                  info@egypttoursgate.com
                </a>
                <a href="tel:+201110008407"
                  className="flex items-center gap-3 text-gray-700 hover:text-[var(--second-color)] transition-colors group">
                  <span className="w-9 h-9 rounded-full bg-[var(--second-color)]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--second-color)]/15 transition-colors">
                    <Phone className="w-4 h-4 text-[var(--second-color)]" />
                  </span>
                  <span className="text-lg font-bold">+201110008407</span>
                </a>
                <a href="https://wa.me/201110008407" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-green-600 hover:text-green-700 transition-colors font-semibold text-sm group">
                  <span className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                  </span>
                  WhatsApp Chat
                </a>
                <button className="w-full mt-2 bg-[var(--second-color)] hover:bg-[#1e1a5e] text-white font-semibold py-2.5 px-6 rounded-xl transition-all text-sm">
                  CUSTOMIZE YOUR TRIP
                </button>
              </div>
            </div>

            {/* ── Related Articles (req 4 + req 5: date + readTime) ── */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="sidebar-articles-header px-6 py-4 text-center">
                <h3 className="text-base font-bold text-white">Related Articles</h3>
              </div>
              <div className="p-4 space-y-3">
                {relatedArticles.map((article) => (
                  <a key={article.id} href={`/articles/${article.id}`}
                    className="group flex gap-3 rounded-xl overflow-hidden border border-gray-100 hover:border-[var(--second-color)]/30 hover:shadow-md transition-all p-2">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    {/* Text */}
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="text-xs font-semibold text-[var(--second-color)] group-hover:text-[var(--main-color)] transition-colors line-clamp-2 leading-tight mb-1">
                        {article.title}
                      </h4>
                      {/* Date + read time — requirement 5 */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />{article.date}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />{article.readTime}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>{/* end sidebar */}
        </div>{/* end grid */}

        {/* ── Related Tours ── */}
        <div className="mt-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--second-color)] mb-2">You May Also Like</h2>
            <p className="text-gray-500 text-sm">Discover more amazing Egypt tours</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTours.map((tour) => (
              <a key={tour.id} href={`/tours/${tour.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 group border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <Image src={tour.image} alt={tour.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 fill-[var(--main-color)] text-[var(--main-color)]" />
                    <span className="text-sm font-semibold text-gray-700">{tour.rating}</span>
                    <span className="text-gray-400 text-xs">({tour.reviews} reviews)</span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--second-color)] mb-3 group-hover:text-[var(--main-color)] transition-colors leading-snug">
                    {tour.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Clock className="w-3.5 h-3.5" />{tour.duration}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">From</div>
                      <div className="text-xl font-bold text-[var(--second-color)]">${tour.price}</div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>{/* end container */}

      {/* ── Custom Lightbox ── */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-4 right-4 text-white hover:text-[var(--main-color)] transition-colors z-10">
            <X className="w-8 h-8" />
          </button>
          <button onClick={() => navigateLightbox('prev')} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--main-color)] transition-colors z-10">
            <ChevronLeft className="w-12 h-12" />
          </button>
          <button onClick={() => navigateLightbox('next')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--main-color)] transition-colors z-10">
            <ChevronRight className="w-12 h-12" />
          </button>
          <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-amber-300 to-stone-400 rounded-lg" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full">
              {selectedImageIndex + 1} / {tourImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Hidden LightGallery */}
      <LightGallery
        onInit={(detail) => { lightGalleryRef.current = detail.instance; }}
        speed={500}
        plugins={[lgZoom]}
        dynamic
        dynamicEl={tourImages.map((img) => ({ src: img, thumb: img }))}
      />
    </div>
    </>
  );
}

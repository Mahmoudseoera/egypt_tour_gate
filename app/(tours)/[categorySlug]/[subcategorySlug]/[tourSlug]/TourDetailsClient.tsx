'use client';

import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "flatpickr/dist/flatpickr.min.css";
import lgZoom from "lightgallery/plugins/zoom";

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  tourDetailsSchema,
  validateField,
  validateChildAge,
  tomorrowISO,
  todayISO,
  type TourDetailsFormData,
} from '@/lib/validations/tour-details.schema';
import { NATIONALITIES, PHONE_CODES } from '@/lib/constants/country-data';
import Image from 'next/image';
import {
  X, ChevronLeft, ChevronRight, MapPin, Clock,
  Star, Check, Phone, Mail, MessageCircle,
  Calendar, BookOpen, ArrowRight, Baby,
} from 'lucide-react';

/* ─── Types ─── */
interface TourItem {
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
  date: string;
  readTime: string;
}

interface PriceRow {
  category: string;
  price: number;
}

/* ─── Shared class builders ─── */
const inputCls = (err?: string) =>
  `w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-[var(--second-color)] focus:border-transparent outline-none transition-all bg-white text-sm text-gray-800 placeholder-gray-400 ${
    err ? 'border-red-400 focus:ring-red-300' : 'border-gray-200'
  }`;
const labelCls = 'block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide';
const errCls   = 'mt-1 text-xs text-red-500 font-medium';

/* ─── Form initial state ─── */
type FormState = Omit<TourDetailsFormData, 'childAges' | 'message'> & {
  childAges: string[];
  message: string;
};

const INITIAL: FormState = {
  name:        '',
  email:       '',
  nationality: '',
  countryCode: '',
  phone:       '',
  checkIn:     '',
  checkOut:    '',
  adults:       1,
  children:     0,
  childAges:   [],
  message:     '',
};

export default function TourDetailsClient() {
  const [activeDay,          setActiveDay]          = useState<number | null>(1);
  const [isLightboxOpen,     setIsLightboxOpen]     = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [formData,           setFormData]           = useState<FormState>(INITIAL);
  const [fieldErrors,        setFieldErrors]        = useState<Record<string, string | undefined>>({});
  const [submitted,          setSubmitted]          = useState(false);

  /* Flatpickr refs */
  const checkInRef  = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);
  const fpCheckIn   = useRef<{ destroy(): void; setDate(d: string, t: boolean): void } | null>(null);
  const fpCheckOut  = useRef<{ destroy(): void; set(k: string, v: unknown): void } | null>(null);
  const lightGalleryRef = useRef<{ openGallery(i: number): void } | null>(null);

  /* ── Init flatpickr (dynamic import — SSR safe) ── */
  useEffect(() => {
    let cancelled = false;

    import('flatpickr').then((mod) => {
      if (cancelled) return;
      const fp = mod.default;

      /* Check-in: minDate = tomorrow so "today" is never selectable */
      fpCheckIn.current = fp(checkInRef.current!, {
        minDate:      tomorrowISO(),
        dateFormat:   'Y-m-d',
        altInput:     true,
        altFormat:    'D, M j Y',
        disableMobile: true,
        onChange([date]) {
          if (!date) return;
          const iso = date.toISOString().slice(0, 10);
          setFormData((p) => ({ ...p, checkIn: iso }));
          /* Live-validate on pick */
          const err = validateField('checkIn', iso);
          setFieldErrors((p) => ({ ...p, checkIn: err }));
          /* Push checkout minDate forward */
          (fpCheckOut.current as any)?.set('minDate', date);
        },
      }) as unknown as typeof fpCheckIn.current;

      /* Check-out: minDate starts at tomorrow, updated when check-in chosen */
      fpCheckOut.current = fp(checkOutRef.current!, {
        minDate:      tomorrowISO(),
        dateFormat:   'Y-m-d',
        altInput:     true,
        altFormat:    'D, M j Y',
        disableMobile: true,
        onChange([date]) {
          if (!date) return;
          const iso = date.toISOString().slice(0, 10);
          setFormData((p) => {
            const err = iso <= (p.checkIn || todayISO())
              ? 'Check-out date must be after check-in date'
              : undefined;
            setFieldErrors((fe) => ({ ...fe, checkOut: err }));
            return { ...p, checkOut: iso };
          });
        },
      }) as unknown as typeof fpCheckOut.current;
    });

    return () => {
      cancelled = true;
      (fpCheckIn.current  as any)?.destroy();
      (fpCheckOut.current as any)?.destroy();
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
    { day: 1, title: 'Cairo Arrival',             description: 'Arrive at Cairo International Airport. Meet and greet by our representative. Transfer to your hotel. Overnight in Cairo.' },
    { day: 2, title: 'Pyramids & Egyptian Museum', description: 'Visit the Great Pyramids of Giza, the Sphinx, and the Valley Temple. Afternoon visit to the Egyptian Museum to see the treasures of Tutankhamun.' },
    { day: 3, title: 'Fly to Luxor - Nile Cruise', description: 'Flight to Luxor. Visit Karnak Temple and Luxor Temple. Board your Nile cruise ship. Dinner and overnight on board.' },
    { day: 4, title: 'Valley of the Kings',        description: 'Visit the West Bank including Valley of the Kings, Hatshepsut Temple, and Colossi of Memnon. Sail to Edfu.' },
    { day: 5, title: 'Edfu & Kom Ombo',            description: 'Visit Edfu Temple dedicated to Horus. Sail to Kom Ombo. Visit the unique double temple. Continue sailing to Aswan.' },
  ];

  const priceTable: PriceRow[] = [
    { category: 'Solo Traveler',      price: 1450 },
    { category: '2-3 Persons',        price: 950  },
    { category: '4-6 Persons',        price: 850  },
    { category: '7-10 Persons',       price: 750  },
    { category: 'Child (6-11 years)', price: 425  },
  ];

  const included  = ['Accommodation in 5-star hotels','All transfers in private air-conditioned vehicle','Domestic flight tickets','Professional Egyptologist guide','All entrance fees to mentioned sites','Meals as mentioned in itinerary'];
  const excluded  = ['International flights','Entry visa to Egypt','Personal expenses','Tipping','Optional tours'];

  const relatedTours: TourItem[] = [
    { id: '1', title: 'Cairo & Alexandria Discovery', image: '/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp', price: 599, duration: '4 Days', rating: 4.8, reviews: 245 },
    { id: '2', title: 'Luxor & Aswan Highlights',     image: '/assets/images/tours/49-webp.webp',                                                           price: 899, duration: '5 Days', rating: 4.9, reviews: 312 },
    { id: '3', title: 'Red Sea Adventure',             image: '/assets/images/tours/106896752__MG_7633-final_Pompeys_Pillar-webp.webp',                      price: 450, duration: '3 Days', rating: 4.7, reviews: 189 },
  ];

  const relatedArticles: Article[] = [
    { id: '1', title: 'Luxury tourism boom in Egypt',                         image: '/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp', date: 'June 14, 2024',  readTime: '5 min read' },
    { id: '2', title: 'Covid-rules for traveling from USA to Egypt',           image: '/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp', date: 'May 28, 2024',   readTime: '7 min read' },
    { id: '3', title: 'Luxor Temple: A Complete Visitor Guide',                image: '/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp', date: 'April 10, 2024', readTime: '9 min read' },
  ];

  /* ── Handlers ── */

  /** Generic text/select change — clears error while typing */
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    /* Clear error immediately so the user isn't stuck on a stale message */
    setFieldErrors((p) => ({ ...p, [name]: undefined }));
  }, []);

  /** Validate a text/select field when it loses focus */
  const handleBlur = useCallback((
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const err = validateField(
      name as keyof TourDetailsFormData,
      value,
      formData as unknown as Partial<TourDetailsFormData>
    );
    setFieldErrors((p) => ({ ...p, [name]: err }));
  }, [formData]);

  /** Adults / Children counter */
  const handleCounter = useCallback((field: 'adults' | 'children', inc: boolean) => {
    setFormData((prev) => {
      const min  = field === 'adults' ? 1 : 0;
      const next = Math.min(20, Math.max(min, prev[field] + (inc ? 1 : -1)));

      if (field === 'children') {
        const ages = prev.childAges;
        const newAges = next > ages.length
          ? [...ages, ...Array(next - ages.length).fill('')]
          : ages.slice(0, next);
        return { ...prev, children: next, childAges: newAges };
      }
      return { ...prev, [field]: next };
    });
    setFieldErrors((p) => ({ ...p, [field]: undefined }));
  }, []);

  /** Individual child-age input change */
  const handleChildAgeChange = useCallback((index: number, value: string) => {
    setFormData((p) => {
      const ages = [...p.childAges];
      ages[index] = value;
      return { ...p, childAges: ages };
    });
    setFieldErrors((p) => ({ ...p, [`childAges_${index}`]: undefined, childAges: undefined }));
  }, []);

  /** Individual child-age blur */
  const handleChildAgeBlur = useCallback((index: number, value: string) => {
    const err = validateChildAge(index, value, formData.children);
    setFieldErrors((p) => ({ ...p, [`childAges_${index}`]: err }));
  }, [formData.children]);

  /** Form submit — full schema parse */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = tourDetailsSchema.safeParse(formData);

    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('_') || 'form';
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      document.querySelector('[data-err]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setFieldErrors({});
    setSubmitted(true);
    window.location.href = '/thank-you';
  };

  const openLightbox    = (i: number) => lightGalleryRef.current?.openGallery(i);
  const navigateLightbox = (dir: 'prev' | 'next') =>
    setSelectedImageIndex((p) =>
      dir === 'prev' ? (p === 0 ? tourImages.length - 1 : p - 1) : (p === tourImages.length - 1 ? 0 : p + 1)
    );

  /* ── Render ── */
  return (
    <>
      <style>{`
        /* Flatpickr theme — navy + gold */
        .flatpickr-calendar{border-radius:14px!important;box-shadow:0 20px 60px rgba(39,34,98,.18)!important;font-family:inherit!important;border:none!important;z-index:9999!important;max-width:320px!important}
        .flatpickr-months .flatpickr-month,.flatpickr-current-month{background:var(--second-color)!important;color:#fff!important;border-radius:14px 14px 0 0!important}
        .flatpickr-weekday{color:var(--second-color)!important;font-weight:700!important}
        .flatpickr-day.selected,.flatpickr-day.selected:hover{background:var(--second-color)!important;border-color:var(--second-color)!important}
        .flatpickr-day:hover{background:var(--main-color)!important;border-color:var(--main-color)!important;color:#fff!important}
        .flatpickr-day.today{border-color:var(--second-color)!important}
        /* Disabled / past days clearly greyed out */
        .flatpickr-day.flatpickr-disabled,.flatpickr-day.prevMonthDay,.flatpickr-day.nextMonthDay{opacity:.3!important;cursor:not-allowed!important}
        .flatpickr-prev-month svg,.flatpickr-next-month svg{fill:#fff!important}
        .flatpickr-prev-month:hover svg,.flatpickr-next-month:hover svg{fill:var(--main-color)!important}

        /* Sidebar headers */
        .sh-form{background:linear-gradient(135deg,var(--second-color) 0%,#3d3586 100%)}
        .sh-contact{background:linear-gradient(135deg,var(--main-color) 0%,#d19e3d 100%)}
        .sh-articles{background:linear-gradient(135deg,var(--second-color) 0%,#2d2566 100%)}

        /* Counter buttons */
        .ctr-btn{width:32px;height:32px;border-radius:50%;border:2px solid #e5e7eb;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:17px;line-height:1;color:#555;cursor:pointer;background:#fff;flex-shrink:0}
        .ctr-btn:hover{border-color:var(--second-color);color:var(--second-color);background:rgba(39,34,98,.06)}
        .ctr-btn:disabled{opacity:.35;cursor:not-allowed}

        /* Child age slide-in */
        .child-in{animation:cIn .22s ease}
        @keyframes cIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

    <div className="min-h-screen">

      {/* ── Hero Gallery ── */}
      <section className="relative w-full h-[300px] sm:h-[420px] md:h-[550px] overflow-hidden">
        <div className="grid grid-cols-4 grid-rows-2 gap-1 h-full md:gap-2">
          <div
            className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer rounded-xl group overflow-hidden bg-center bg-cover bg-no-repeat"
            onClick={() => openLightbox(0)}
            style={{ backgroundImage: `url(${tourImages[0]})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 group-hover:from-black/65 transition-all duration-300" />
            <span className="absolute bottom-4 left-4 text-white font-semibold text-sm z-20 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              View Gallery ({tourImages.length})
            </span>
          </div>
          {[1,2,3,4].map((i) => (
            <div key={i}
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

          {/* ════ LEFT — Main Content ════ */}
          <div className="lg:col-span-2 space-y-8">

            {/* Meta badges */}
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
                  const open = activeDay === day.day;
                  return (
                    <div key={day.day} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setActiveDay(open ? null : day.day)}
                        className="w-full flex items-center gap-3 p-4 bg-gray-50/70 hover:bg-gray-100 transition-colors text-left"
                      >
                        <div className="w-9 h-9 bg-[var(--second-color)] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{day.day}</div>
                        <h3 className="flex-1 text-base font-semibold text-[var(--second-color)]">{day.title}</h3>
                        <span className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
                      </button>
                      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
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
                  <span className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center"><Check className="w-4 h-4 text-green-600" /></span>
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
                  <span className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center"><X className="w-4 h-4 text-red-500" /></span>
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

          {/* ════ RIGHT SIDEBAR ════ */}
          <div className="lg:col-span-1 space-y-5">

            {/* ── Booking Form ── */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="sh-form px-6 py-4 text-center">
                <h3 className="text-lg font-bold text-white tracking-wide">Check Availability</h3>
                <p className="text-white/70 text-xs mt-0.5">Fill in your details to request this trip</p>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4" noValidate>

                {/* Name */}
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input
                    type="text" name="name" value={formData.name}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputCls(fieldErrors.name)}
                    placeholder="Mahmoud Abozeid"
                  />
                  {fieldErrors.name && <p className={errCls} data-err>{fieldErrors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputCls(fieldErrors.email)}
                    placeholder="you@email.com"
                  />
                  {fieldErrors.email && <p className={errCls} data-err>{fieldErrors.email}</p>}
                </div>

                {/* Nationality */}
                <div>
                  <label className={labelCls}>Nationality</label>
                  <select
                    name="nationality" value={formData.nationality}
                    onChange={handleChange} onBlur={handleBlur}
                    className={`${inputCls(fieldErrors.nationality)} appearance-none cursor-pointer`}
                  >
                    <option value="">Select nationality…</option>
                    {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  {fieldErrors.nationality && <p className={errCls} data-err>{fieldErrors.nationality}</p>}
                </div>

                {/* Country Code + Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Code</label>
                    <select
                      name="countryCode" value={formData.countryCode}
                      onChange={handleChange} onBlur={handleBlur}
                      className={`${inputCls(fieldErrors.countryCode)} appearance-none cursor-pointer`}
                    >
                      <option value="">Select code…</option>
                      {PHONE_CODES.map((item) => (
                        <option key={item.label} value={item.code}>{item.label}</option>
                      ))}
                    </select>
                    {fieldErrors.countryCode && <p className={errCls} data-err>{fieldErrors.countryCode}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input
                      type="tel" name="phone" value={formData.phone}
                      onChange={handleChange} onBlur={handleBlur}
                      className={inputCls(fieldErrors.phone)}
                      placeholder="1155131838"
                    />
                    {fieldErrors.phone && <p className={errCls} data-err>{fieldErrors.phone}</p>}
                  </div>
                </div>

                {/* Check In / Check Out — flatpickr (minDate = tomorrow) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Check In</label>
                    <div className="relative">
                      <input
                        ref={checkInRef}
                        name="checkIn"
                        value={formData.checkIn}
                        onBlur={handleBlur}
                        readOnly
                        placeholder="Pick date"
                        className={`${inputCls(fieldErrors.checkIn)} pr-9 cursor-pointer`}
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {fieldErrors.checkIn && <p className={errCls} data-err>{fieldErrors.checkIn}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Check Out</label>
                    <div className="relative">
                      <input
                        ref={checkOutRef}
                        name="checkOut"
                        value={formData.checkOut}
                        onBlur={handleBlur}
                        readOnly
                        placeholder="Pick date"
                        className={`${inputCls(fieldErrors.checkOut)} pr-9 cursor-pointer`}
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {fieldErrors.checkOut && <p className={errCls} data-err>{fieldErrors.checkOut}</p>}
                  </div>
                </div>

                {/* Adults + Children counters */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Adults */}
                  <div>
                    <label className={labelCls}>Adults</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-2 border border-gray-200">
                      <button type="button" className="ctr-btn" onClick={() => handleCounter('adults', false)} disabled={formData.adults <= 1}>−</button>
                      <span className="flex-1 text-center font-bold text-[var(--second-color)] text-sm">{formData.adults}</span>
                      <button type="button" className="ctr-btn" onClick={() => handleCounter('adults', true)}  disabled={formData.adults >= 20}>+</button>
                    </div>
                    {fieldErrors.adults && <p className={errCls}>{fieldErrors.adults}</p>}
                  </div>
                  {/* Children */}
                  <div>
                    <label className={labelCls}>Children</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-2 border border-gray-200">
                      <button type="button" className="ctr-btn" onClick={() => handleCounter('children', false)} disabled={formData.children <= 0}>−</button>
                      <span className="flex-1 text-center font-bold text-[var(--second-color)] text-sm">{formData.children}</span>
                      <button type="button" className="ctr-btn" onClick={() => handleCounter('children', true)}  disabled={formData.children >= 20}>+</button>
                    </div>
                    {fieldErrors.children && <p className={errCls}>{fieldErrors.children}</p>}
                  </div>
                </div>

                {/* Dynamic child-age inputs */}
                {formData.children > 0 && (
                  <div className="space-y-2.5">
                    <label className={`${labelCls} flex items-center gap-1.5`}>
                      <Baby className="w-3.5 h-3.5 text-[var(--second-color)]" />
                      Child Ages (0–17)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: formData.children }).map((_, i) => (
                        <div key={i} className="child-in">
                          <div className="relative">
                            <input
                              type="number" min={0} max={17}
                              value={formData.childAges[i] ?? ''}
                              onChange={(e) => handleChildAgeChange(i, e.target.value)}
                              onBlur={(e)  => handleChildAgeBlur(i, e.target.value)}
                              className={`${inputCls(fieldErrors[`childAges_${i}`])} pl-7`}
                              placeholder={`Child ${i + 1}`}
                            />
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold select-none">{i + 1}</span>
                          </div>
                          {fieldErrors[`childAges_${i}`] && (
                            <p className={errCls} data-err>{fieldErrors[`childAges_${i}`]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    {fieldErrors.childAges && <p className={errCls} data-err>{fieldErrors.childAges}</p>}
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className={labelCls}>Message (optional)</label>
                  <textarea
                    name="message" value={formData.message}
                    onChange={handleChange} onBlur={handleBlur}
                    rows={3}
                    className={`${inputCls(fieldErrors.message)} resize-none`}
                    placeholder="Any special requests or questions…"
                  />
                  {fieldErrors.message && <p className={errCls} data-err>{fieldErrors.message}</p>}
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

            {/* ── Contact Box ── */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="sh-contact px-6 py-4 text-center">
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
                  className="flex items-center gap-3 text-green-600 hover:text-green-700 transition-colors font-semibold text-sm">
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

            {/* ── Related Articles ── */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="sh-articles px-6 py-4 text-center">
                <h3 className="text-base font-bold text-white">Related Articles</h3>
              </div>
              <div className="p-4 space-y-3">
                {relatedArticles.map((article) => (
                  <a key={article.id} href={`/articles/${article.id}`}
                    className="group flex gap-3 rounded-xl overflow-hidden border border-gray-100 hover:border-[var(--second-color)]/30 hover:shadow-md transition-all p-2">
                    <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="text-xs font-semibold text-[var(--second-color)] group-hover:text-[var(--main-color)] transition-colors line-clamp-2 leading-tight mb-1">
                        {article.title}
                      </h4>
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
      </div>

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
          <div className="relative w-full max-w-5xl aspect-video">
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

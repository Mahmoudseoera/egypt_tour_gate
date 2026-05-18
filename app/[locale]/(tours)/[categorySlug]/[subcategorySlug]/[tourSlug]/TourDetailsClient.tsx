// egypt_tour_gate\app\[locale]\(tours)\[categorySlug]\[subcategorySlug]\[tourSlug]\TourDetailsClient.tsx//

'use client';
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "flatpickr/dist/flatpickr.min.css";
import lgZoom from "lightgallery/plugins/zoom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  buildBookingPayload,
  submitBooking,
  type BookingFormState,
} from '@/lib/api/booking-api';
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
  ChevronsDownUp, ChevronsUpDown,
} from 'lucide-react';
import type { ApiTourDetails, ApiTourListItem, RelatedArticle } from '@/lib/api/toursApi';

/** Convert a Date to YYYY-MM-DD in LOCAL timezone (not UTC).
 *  date.toISOString() shifts to UTC which causes off-by-one in UTC+ zones. */
function localISO(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}


/* ─── Types ─── */
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
  tour_id: string;
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
  tour_id:     '',
};

/* ─── Children Policy data ─── */
// const childrenPolicy = [
//   {
//     icon: '🍼',
//     label: 'Infants (Under 2)',
//     price: 'FREE',
//     color: 'bg-green-50 border-green-200 text-green-700',
//     badgeColor: 'bg-green-500',
//     note: 'No seat or meal included. Must sit on parent\'s lap.',
//   },
//   {
//     icon: '🧒',
//     label: 'Children (2–5)',
//     price: 'FREE',
//     color: 'bg-blue-50 border-blue-200 text-blue-700',
//     badgeColor: 'bg-blue-500',
//     note: 'Seat included, no meals. Entrance fees apply at child rate.',
//   },
//   {
//     icon: '👦',
//     label: 'Children (6–11)',
//     price: '50% off',
//     color: 'bg-amber-50 border-amber-200 text-amber-700',
//     badgeColor: 'bg-[var(--main-color)]',
//     note: 'Half price on all tour services and site entrance fees.',
//   },
//   {
//     icon: '🧑',
//     label: 'Youth (12–17)',
//     price: '75% of adult',
//     color: 'bg-purple-50 border-purple-200 text-purple-700',
//     badgeColor: 'bg-purple-500',
//     note: 'Discounted rate applies to tours, cruises, and most services.',
//   },
//   {
//     icon: '🧑‍💼',
//     label: 'Adults (18+)',
//     price: 'Full price',
//     color: 'bg-gray-50 border-gray-200 text-gray-700',
//     badgeColor: 'bg-[var(--second-color)]',
//     note: 'Standard pricing as listed in the pricing table above.',
//   },
// ];

const policyRules = [
  'Age is calculated at the time of travel, not at the time of booking.',
  'Children must be accompanied by at least one adult (18+) at all times.',
  'Proof of age (passport or birth certificate) may be required at check-in.',
  'Child prices apply to shared accommodation with parents only.',
  'Some activities (e.g. horse riding, quad bikes) have minimum age restrictions.',
  'Infant seats on domestic flights are subject to airline availability.',
];

type TourDetailsClientProps = {
  tour: ApiTourDetails;
};

export default function TourDetailsClient({ tour }: TourDetailsClientProps) {
  const [activeDay,          setActiveDay]          = useState<number | null>(1);
  const [allOpen,            setAllOpen]            = useState(false);
  const [isLightboxOpen,     setIsLightboxOpen]     = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [formData,           setFormData]           = useState<FormState>({
    ...INITIAL,
    tour_id: String(tour.id),
  });
  const [fieldErrors,        setFieldErrors]        = useState<Record<string, string | undefined>>({});
  const [submitStatus,       setSubmitStatus]       = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const router = useRouter();
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

      fpCheckIn.current = fp(checkInRef.current!, {
        minDate:       tomorrowISO(),
        dateFormat:    'Y-m-d',
        // altInput removed — it injects a second <input> into the DOM
        // which causes two visible inputs. We display the ISO value directly.
        disableMobile: true,
        onChange([date]) {
          if (!date) return;
          const iso = localISO(date);
          setFormData((p) => ({ ...p, checkIn: iso }));
          const err = validateField('checkIn', iso);
          setFieldErrors((p) => ({ ...p, checkIn: err }));
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);
          (fpCheckOut.current as any)?.set('minDate', nextDay);
        },
        onClose([date]) {
          if (!date) {
            const err = validateField('checkIn', '');
            setFieldErrors((p) => ({ ...p, checkIn: err }));
          }
        },
      }) as unknown as typeof fpCheckIn.current;

      fpCheckOut.current = fp(checkOutRef.current!, {
        minDate:       tomorrowISO(),
        dateFormat:    'Y-m-d',
        // altInput removed — same reason as checkIn
        disableMobile: true,
        onChange([date]) {
          if (!date) return;
          const iso = localISO(date);
          setFormData((p) => {
            const err = iso <= (p.checkIn || todayISO())
              ? 'Check-out date must be after check-in date'
              : undefined;
            setFieldErrors((fe) => ({ ...fe, checkOut: err }));
            return { ...p, checkOut: iso };
          });
        },
        onClose([date]) {
          if (!date) {
            const err = validateField('checkOut', '');
            setFieldErrors((p) => ({ ...p, checkOut: err }));
          }
        },
      }) as unknown as typeof fpCheckOut.current;
    });

    return () => {
      cancelled = true;
      (fpCheckIn.current  as any)?.destroy();
      (fpCheckOut.current as any)?.destroy();
    };
  }, []);

  /* ── Dynamic API Data ── */
  const tourImages = (tour.images?.filter(Boolean)?.length
    ? tour.images
    : [tour.image].filter(Boolean)) as string[];
  const safeTourImages = tourImages.length > 0 ? tourImages : ["/assets/images/tours/49-webp.webp"];
  const highlights = tour.highlights?.filter(Boolean) ?? [];
  const itinerary = (tour.itinerary?.length
    ? tour.itinerary.map((item, index) => ({ ...item, day: item.day ?? index + 1 }))
    : []) as Array<{ day: number; title: string; description: string }>;

  // ── Pricing: prefer rich pricingTables, fall back to flat pricing, then price_from ──
  const priceTable: PriceRow[] = (() => {
    // Use first pricing_table's rows if available
    if (tour.pricingTables?.length && tour.pricingTables[0].rows.length > 0) {
      return tour.pricingTables[0].rows.map((r) => ({
        category: r.category ? `${r.category} ${r.category === "1" ? "Person" : "Persons"}` : "Standard",
        price: r.price,
      }));
    }
    // Fall back to legacy flat pricing
    if (tour.pricing?.length) {
      return tour.pricing.map((item) => ({ category: item.category || "Standard", price: item.price }));
    }
    // Last resort — single row from price_from
    return [{ category: "Standard", price: tour.price_from || 0 }];
  })();

  // Pricing table title from API (first table)
  const pricingTableTitle = tour.pricingTables?.[0]?.title ?? "Prices Per Person";

  const included = tour.included?.filter(Boolean) ?? [];
  const excluded = tour.excluded?.filter(Boolean) ?? [];
  const shortDescription = tour.description?.trim() || tour.short_description?.trim() || "Tour details are available on request.";
  const locationText = tour.location?.trim() || "Egypt";
  const durationText = tour.duration?.trim() || "Custom duration";
  const ratingValue = Number.isFinite(tour.rating) && tour.rating > 0 ? tour.rating : 4.5;

  // ── Related Tours — from API, no static fallback ──────────────────────────
  const relatedTours = tour.relatedTours ?? [];

  // ── Related Articles — from API, no static fallback ───────────────────────
  const relatedArticles = tour.relatedArticles ?? [];

  /* ── Toggle All Itinerary ── */
  const handleToggleAll = () => {
    if (allOpen) {
      // Close all
      setAllOpen(false);
      setActiveDay(null);
    } else {
      // Open all — use a special sentinel value
      setAllOpen(true);
      setActiveDay(null);
    }
  };

  const isDayOpen = (day: number) => allOpen || activeDay === day;

  const handleDayToggle = (day: number) => {
    if (allOpen) {
      // When all are open, clicking one collapses all-open mode and keeps only that one closed
      setAllOpen(false);
      setActiveDay(null);
    } else {
      setActiveDay((prev) => (prev === day ? null : day));
    }
  };

  /* ── Handlers ── */
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setFieldErrors((p) => ({ ...p, [name]: undefined }));
  }, []);

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

  const handleChildAgeChange = useCallback((index: number, value: string) => {
    setFormData((p) => {
      const ages = [...p.childAges];
      ages[index] = value;
      return { ...p, childAges: ages };
    });
    setFieldErrors((p) => ({ ...p, [`childAges_${index}`]: undefined, childAges: undefined }));
  }, []);

  const handleChildAgeBlur = useCallback((index: number, value: string) => {
    const err = validateChildAge(index, value, formData.children);
    setFieldErrors((p) => ({ ...p, [`childAges_${index}`]: err }));
  }, [formData.children]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── Step 1: Zod client-side validation (existing schema) ────────────────
    const parsed = tourDetailsSchema.safeParse(formData);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('_') || 'form';
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setTimeout(() => {
        document.querySelector('[data-err]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }

    setFieldErrors({});
    setSubmitStatus('loading');

    // ── Step 2: Build the typed API payload ─────────────────────────────────
    // Backend expects `code` (country dial code) and `phone` (local number) separately.
    const bookingFormState: BookingFormState = {
      tour_id:         String(tour.id),
      name:            formData.name,
      email:           formData.email,
      code:            formData.countryCode,   // e.g. "+20" — sent as `code` field
      phone:           formData.phone,         // local number — leading 0 stripped in buildBookingPayload
      nationality:     formData.nationality,
      arrival_date:    formData.checkIn,
      departure_date:  formData.checkOut,
      adult_number:    formData.adults,
      children_number: formData.children,
      child_age:       formData.childAges,
      message:         formData.message,
    };

    const payload = buildBookingPayload(bookingFormState);

    // ── Console log for debugging (remove after confirming API works) ───────
    console.log('[BookingForm] payload being sent to /api/booking:', JSON.stringify(payload, null, 2));

    // ── Step 3: Submit to API ───────────────────────────────────────────────
    const result = await submitBooking(payload);

    if (result.ok) {
      setSubmitStatus('success');
      toast.success('Booking Request Sent! 🎉', {
        description: result.message || 'Our team will contact you within 24 hours.',
        duration: 6000,
      });
      router.push("/thank-you");
    } else {
      setSubmitStatus('error');

      // Hydrate server field-level errors back into the form
      if (result.fieldErrors) {
        const remapped: Record<string, string | undefined> = {};
        for (const [field, msg] of Object.entries(result.fieldErrors)) {
          const uiField = field
            .replace(/^arrival_date$/, 'checkIn')
            .replace(/^departure_date$/, 'checkOut')
            .replace(/^adult_number$/, 'adults')
            .replace(/^children_number$/, 'children')
            .replace(/^child_age\.(\d+)$/, 'childAges_$1');
          remapped[uiField] = msg;
        }
        setFieldErrors(remapped);
        setTimeout(() => {
          document.querySelector('[data-err]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
      }

      toast.error('Booking Failed', {
        description: result.message || 'Please review your details and try again.',
        duration: 8000,
      });
    }
  };

  const openLightbox    = (i: number) => lightGalleryRef.current?.openGallery(i);
  const navigateLightbox = (dir: 'prev' | 'next') =>
    setSelectedImageIndex((p) =>
      dir === 'prev'
        ? (p === 0 ? safeTourImages.length - 1 : p - 1)
        : (p === safeTourImages.length - 1 ? 0 : p + 1)
    );

  /* ── Render ── */
  return (
    <>
      <style>{`
        /* Flatpickr — hide the original hidden input; only the alt-input is visible */
        .flatpickr-input:not(.flatpickr-alt-input){display:none!important}

        /* Flatpickr theme — navy + gold */
        .flatpickr-calendar{border-radius:14px!important;box-shadow:0 20px 60px rgba(39,34,98,.18)!important;font-family:inherit!important;border:none!important;z-index:9999!important;max-width:320px!important}
        .flatpickr-months .flatpickr-month,.flatpickr-current-month{background:var(--second-color)!important;color:#fff!important;border-radius:14px 14px 0 0!important}
        .flatpickr-weekday{color:var(--second-color)!important;font-weight:700!important}
        .flatpickr-day.selected,.flatpickr-day.selected:hover{background:var(--second-color)!important;border-color:var(--second-color)!important}
        .flatpickr-day:hover{background:var(--main-color)!important;border-color:var(--main-color)!important;color:#fff!important}
        .flatpickr-day.today{border-color:var(--second-color)!important}
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

        /* Toggle-all button */
        .toggle-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid var(--second-color);
          color: var(--second-color);
          background: transparent;
        }
        .toggle-all-btn:hover {
          background: var(--second-color);
          color: #fff;
        }
        .toggle-all-btn.all-open {
          background: var(--second-color);
          color: #fff;
        }
        .toggle-all-btn.all-open:hover {
          background: transparent;
          color: var(--second-color);
        }

        /* Children Policy cards */
        .policy-card {
          border-radius: 14px;
          border: 1.5px solid;
          padding: 14px 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .policy-card:hover {
          box-shadow: 0 4px 20px rgba(39,34,98,0.10);
          transform: translateY(-2px);
        }
        .policy-badge {
          display: inline-block;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 10px;
          border-radius: 999px;
          white-space: nowrap;
          letter-spacing: 0.03em;
        }
        .policy-rule-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: #555;
          line-height: 1.5;
        }
        .policy-rule-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--main-color);
          flex-shrink: 0;
          margin-top: 7px;
        }
      `}</style>

    <div className="min-h-screen">

      {/* ── Hero Gallery ── */}
      {/* Layout adapts to image count: 1=full, 2=half+half, 3=big+2stack, 4=big+3grid, 5=big+4grid */}
      <section className="relative w-full h-[300px] sm:h-[420px] md:h-[550px] overflow-hidden">
        {(() => {
          const count = safeTourImages.length;

          // ── 1 image: full-width hero ──────────────────────────────────────
          if (count === 1) {
            return (
              <div
                className="relative w-full h-full cursor-pointer rounded-xl group overflow-hidden bg-center bg-cover bg-no-repeat"
                onClick={() => openLightbox(0)}
                style={{ backgroundImage: `url(${safeTourImages[0]})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 group-hover:from-black/65 transition-all duration-300" />
                <span className="absolute bottom-4 left-4 text-white font-semibold text-sm z-20 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  View Gallery ({count})
                </span>
              </div>
            );
          }

          // ── 2 images: side by side ────────────────────────────────────────
          if (count === 2) {
            return (
              <div className="grid grid-cols-2 gap-1 md:gap-2 h-full">
                {safeTourImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative cursor-pointer rounded-xl group overflow-hidden bg-center bg-cover bg-no-repeat h-full"
                    onClick={() => openLightbox(i)}
                    style={{ backgroundImage: `url(${img})` }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                    {i === 0 && (
                      <span className="absolute bottom-4 left-4 text-white font-semibold text-sm z-20 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        View Gallery ({count})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            );
          }

          // ── 3 images: big left + 2 stacked right ─────────────────────────
          if (count === 3) {
            return (
              <div className="grid grid-cols-2 gap-1 md:gap-2 h-full">
                {/* Main image */}
                <div
                  className="relative cursor-pointer rounded-xl group overflow-hidden bg-center bg-cover bg-no-repeat h-full"
                  onClick={() => openLightbox(0)}
                  style={{ backgroundImage: `url(${safeTourImages[0]})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 group-hover:from-black/65 transition-all duration-300" />
                  <span className="absolute bottom-4 left-4 text-white font-semibold text-sm z-20 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    View Gallery ({count})
                  </span>
                </div>
                {/* Right stack */}
                <div className="grid grid-rows-2 gap-1 md:gap-2 h-full">
                  {safeTourImages.slice(1, 3).map((img, i) => (
                    <div
                      key={i}
                      className="relative cursor-pointer rounded-xl group overflow-hidden bg-center bg-cover bg-no-repeat"
                      onClick={() => openLightbox(i + 1)}
                      style={{ backgroundImage: `url(${img})` }}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // ── 4 images: big left + 3 stacked right ─────────────────────────
          if (count === 4) {
            return (
              <div className="grid grid-cols-2 gap-1 md:gap-2 h-full">
                {/* Main image */}
                <div
                  className="relative cursor-pointer rounded-xl group overflow-hidden bg-center bg-cover bg-no-repeat h-full"
                  onClick={() => openLightbox(0)}
                  style={{ backgroundImage: `url(${safeTourImages[0]})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 group-hover:from-black/65 transition-all duration-300" />
                  <span className="absolute bottom-4 left-4 text-white font-semibold text-sm z-20 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    View Gallery ({count})
                  </span>
                </div>
                {/* Right 3-stack */}
                <div className="grid grid-rows-3 gap-1 md:gap-2 h-full">
                  {safeTourImages.slice(1, 4).map((img, i) => (
                    <div
                      key={i}
                      className="relative cursor-pointer rounded-xl group overflow-hidden bg-center bg-cover bg-no-repeat"
                      onClick={() => openLightbox(i + 1)}
                      style={{ backgroundImage: `url(${img})` }}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // ── 5+ images: original big-left + 2×2 grid right ─────────────────
          return (
            <div className="grid grid-cols-4 grid-rows-2 gap-1 h-full md:gap-2">
              {/* Main large image */}
              <div
                className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer rounded-xl group overflow-hidden bg-center bg-cover bg-no-repeat"
                onClick={() => openLightbox(0)}
                style={{ backgroundImage: `url(${safeTourImages[0]})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 group-hover:from-black/65 transition-all duration-300" />
                <span className="absolute bottom-4 left-4 text-white font-semibold text-sm z-20 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  View Gallery ({count})
                </span>
              </div>
              {/* Right 4 thumbnails — only render actual images (max 4) */}
              {safeTourImages.slice(1, 5).map((img, i) => (
                <div
                  key={i}
                  className="relative rounded-xl cursor-pointer group overflow-hidden hidden md:block w-full h-full bg-center bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${img})` }}
                  onClick={() => openLightbox(i + 1)}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                  {/* "See all" overlay on the last thumbnail when there are more than 5 */}
                  {i === 3 && count > 5 && (
                    <div className="absolute inset-0 bg-black/55 z-20 flex flex-col items-center justify-center gap-1">
                      <span className="text-white font-bold text-lg">+{count - 5}</span>
                      <span className="text-white/80 text-xs font-medium">more photos</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()}
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
                  <Star className="w-4 h-4 fill-current" /> {ratingValue.toFixed(1)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 text-[var(--second-color)]" /> {locationText}
                </span>
                <span className="inline-flex items-center gap-1.5 text-gray-500 text-sm">
                  <Clock className="w-4 h-4 text-[var(--second-color)]" /> {durationText}
                </span>
                {tour.code && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--second-color)]/8 text-[var(--second-color)] rounded-full text-xs font-bold tracking-wide border border-[var(--second-color)]/15">
                    <BookOpen className="w-3.5 h-3.5" /> {tour.code}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-base leading-relaxed">
                {shortDescription}
              </p>
            </div>

            {/* ── Itinerary ── */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              {/* Header row with Toggle All button */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-[var(--second-color)]">Itinerary</h2>
                <button
                  type="button"
                  onClick={handleToggleAll}
                  className={`toggle-all-btn ${allOpen ? 'all-open' : ''}`}
                  aria-label={allOpen ? 'Collapse all days' : 'Expand all days'}
                >
                  {allOpen ? (
                    <>
                      <ChevronsDownUp className="w-3.5 h-3.5" />
                      Collapse All
                    </>
                  ) : (
                    <>
                      <ChevronsUpDown className="w-3.5 h-3.5" />
                      Expand All
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                {itinerary.length === 0 && (
                  <p className="text-sm text-gray-500">Detailed itinerary will be shared after booking confirmation.</p>
                )}
                {itinerary.map((day) => {
                  const open = isDayOpen(day.day);
                  return (
                    <div key={day.day} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleDayToggle(day.day)}
                        className="w-full flex items-center gap-3 p-4 bg-gray-50/70 hover:bg-gray-100 transition-colors text-left"
                      >
                        <div className="w-9 h-9 bg-[var(--main-color)] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{day.day}</div>
                        <h3 className="flex-1 text-base font-semibold text-[var(--second-color)]">{day.title}</h3>
                        <span
                          className="text-gray-400 transition-transform duration-200"
                          style={{ display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          ▾
                        </span>
                      </button>
                      <div
                        className="grid transition-all duration-300"
                        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
                      >
                        <div className="overflow-hidden">
                          <div className="p-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">{day.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Included / Excluded — only render if at least one side has data */}
            {(included.length > 0 || excluded.length > 0) && (
            <div className="grid sm:grid-cols-2 gap-5">
              {included.length > 0 && (
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
              )}
              {excluded.length > 0 && (
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
              )}
            </div>
            )}

            {/* Highlights — only render if there are items */}
            {highlights.length > 0 && (
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
            )}

            {/* Pricing */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[var(--second-color)] mb-1">Pricing</h2>
              {pricingTableTitle && (
                <p className="text-sm text-gray-400 mb-5">{pricingTableTitle}</p>
              )}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--second-color)] text-white">
                      <th className="text-left py-3 px-5 text-sm font-semibold">No. of Persons</th>
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

            {/* ── Children Policy — only show when pricing data is present ── */}
            {priceTable.length > 0 && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--second-color) 0%, #3d3586 100%)' }}
                >
                  <Baby className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--second-color)] leading-tight">Children Policy</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Age-based pricing for this tour</p>
                </div>
              </div>


              {/* Divider */}
              {/* <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Important Rules</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div> */}

              {/* Policy rules */}
              <div className="space-y-2.5">
                {policyRules.map((rule, i) => (
                  <div key={i} className="policy-rule-item">
                    <div className="policy-rule-dot" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>

              {/* Footer callout */}
              <div
                className="mt-6 rounded-xl p-4 flex items-start gap-3"
                style={{ background: 'linear-gradient(135deg, rgba(39,34,98,0.06) 0%, rgba(227,183,94,0.10) 100%)', border: '1.5px solid rgba(227,183,94,0.3)' }}
              >
                <span className="text-xl flex-shrink-0">💡</span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Traveling with a family? We offer{' '}
                  <strong className="text-[var(--second-color)]">customized family packages</strong> with dedicated child-friendly guides,
                  kid-safe activities, and flexible scheduling.{' '}
                  <Link href="/contact" className="text-[var(--main-color)] font-bold underline underline-offset-2 hover:text-[var(--second-color)] transition-colors">
                    Contact us
                  </Link>{' '}
                  for a tailored quote.
                </p>
              </div>
            </div>
            )}

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

                {/* ── Success banner ── */}
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">🎉</div>
                    <h3 className="font-bold text-green-800 text-sm">Booking Request Received!</h3>
                    <p className="text-green-700 text-xs mt-1">
                      Our team will reach out within 24 hours to confirm your trip.
                    </p>
                  </div>
                )}

                {/* ── API-level error banner ── */}
                {submitStatus === 'error' && !Object.keys(fieldErrors).length && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                    <p className="text-red-700 text-xs font-medium">
                      Something went wrong. Please try again or contact us directly.
                    </p>
                  </div>
                )}

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

                {/* Check In / Check Out */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Check In</label>
                    <div className="relative">
                      <input
                        ref={checkInRef}
                        name="checkIn"
                        readOnly
                        placeholder="Pick date"
                        className={`${inputCls(fieldErrors.checkIn)} pr-9 cursor-pointer`}
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      {/* Show selected date as overlay since flatpickr owns the input value */}
                      {formData.checkIn && (
                        <span className="absolute inset-0 flex items-center px-3 text-sm text-gray-800 pointer-events-none">
                          {formData.checkIn}
                        </span>
                      )}
                    </div>
                    {fieldErrors.checkIn && <p className={errCls} data-err>{fieldErrors.checkIn}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Check Out</label>
                    <div className="relative">
                      <input
                        ref={checkOutRef}
                        name="checkOut"
                        readOnly
                        placeholder="Pick date"
                        className={`${inputCls(fieldErrors.checkOut)} pr-9 cursor-pointer`}
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      {/* Show selected date as overlay since flatpickr owns the input value */}
                      {formData.checkOut && (
                        <span className="absolute inset-0 flex items-center px-3 text-sm text-gray-800 pointer-events-none">
                          {formData.checkOut}
                        </span>
                      )}
                    </div>
                    {fieldErrors.checkOut && <p className={errCls} data-err>{fieldErrors.checkOut}</p>}
                  </div>
                </div>

                {/* Adults + Children counters */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Adults</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-2 border border-gray-200">
                      <button type="button" className="ctr-btn" onClick={() => handleCounter('adults', false)} disabled={formData.adults <= 1}>−</button>
                      <span className="flex-1 text-center font-bold text-[var(--second-color)] text-sm">{formData.adults}</span>
                      <button type="button" className="ctr-btn" onClick={() => handleCounter('adults', true)}  disabled={formData.adults >= 20}>+</button>
                    </div>
                    {fieldErrors.adults && <p className={errCls}>{fieldErrors.adults}</p>}
                  </div>
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
                  disabled={submitStatus === 'loading' || submitStatus === 'success'}
                  className="w-full bg-[var(--second-color)] hover:bg-[#1e1a5e] text-white font-bold py-3.5 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-70 flex items-center justify-center gap-2 text-sm tracking-wider"
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      SUBMITTING…
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <span>✓</span>
                      BOOKING SENT!
                    </>
                  ) : (
                    <>
                      REQUEST THIS TRIP <ArrowRight className="w-4 h-4" />
                    </>
                  )}
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

            {/* ── Related Articles — only show if articles exist ── */}
            {relatedArticles.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="sh-articles px-6 py-4 text-center">
                <h3 className="text-base font-bold text-white">Related Articles</h3>
              </div>
              <div className="p-4 space-y-3">
                {relatedArticles.map((article) => (
                  <a key={article.id} href={`/blogs/${article.blog_category?.slug ?? "travel"}/${article.slug}`}
                    className="group flex gap-3 rounded-xl overflow-hidden border border-gray-100 hover:border-[var(--second-color)]/30 hover:shadow-md transition-all p-2">
                    <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {article.media?.image ? (
                        <Image src={article.media.image} alt={article.media.alt ?? article.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-stone-200" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="text-xs font-semibold text-[var(--second-color)] group-hover:text-[var(--main-color)] transition-colors line-clamp-2 leading-tight mb-1">
                        {article.name}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        {article.date && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />{article.date}
                          </span>
                        )}
                        {article.blog_category?.name && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <BookOpen className="w-2.5 h-2.5" />{article.blog_category.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            )}

          </div>{/* end sidebar */}
        </div>{/* end grid */}

        {/* ── Related Tours ── */}
        {relatedTours.length > 0 && (
          <div className="mt-14">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--second-color)] mb-2">You May Also Like</h2>
              <p className="text-gray-500 text-sm">Discover more amazing Egypt tours</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTours.map((relTour) => (
                <a key={relTour.id} href={`/${relTour.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 group border border-gray-100">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {relTour.image ? (
                      <Image src={relTour.image} alt={relTour.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-stone-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 fill-[var(--main-color)] text-[var(--main-color)]" />
                      <span className="text-sm font-semibold text-gray-700">
                        {Number.isFinite(relTour.rating) && relTour.rating > 0 ? relTour.rating.toFixed(1) : "5.0"}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[var(--second-color)] mb-3 group-hover:text-[var(--main-color)] transition-colors leading-snug">
                      {relTour.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Clock className="w-3.5 h-3.5" />{relTour.duration}
                      </span>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">From</div>
                        <div className="text-xl font-bold text-[var(--second-color)]">${relTour.price_from}</div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
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
              {selectedImageIndex + 1} / {safeTourImages.length}
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
        dynamicEl={safeTourImages.map((img) => ({ src: img, thumb: img }))}
      />
    </div>
    </>
  );
}

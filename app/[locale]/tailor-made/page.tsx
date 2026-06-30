"use client";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useT } from "@/lib/hooks/useTranslate";
import { toast } from "sonner";
import "@/styles/tailor-made.css";
import { Check, Calendar, CalendarDays, MapPin, User, Phone, Globe, Hotel, MessageSquare, ChevronRight, ChevronLeft, DollarSign, Users, Baby, UserCheck } from "lucide-react";
// Import the required base styling and the plugin styling
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/plugins/monthSelect/style.css";
import FallbackImage from "@/components/shared/fallback-image";
import {
  tailorMadeSchema,
  type TailorMadeFormData,
} from "@/lib/validations/tailor-made.schema";
import { NATIONALITIES, PHONE_CODES } from "@/lib/constants/country-data";

// ─── API Types ──────────────────────────────────────────────────────────────
interface ApiCity {
  id: number;
  name: string;
  img: string;
}

interface StaticData {
  basic_data: {
    name: string;
    title: string;
    description: string;
    cover_img: string;
  };
  top_menu_labels: {
    city_label_trns: string;
    time_label_trns: string;
    info_title_trns: string;
    budget_title_trns: string;
    confirm_label_trns: string;
  };
  menu_1_city: {
    title: string;
    sub_title: string;
  };
  menu_2_time: {
    title: string;
    sub_title: string;
    exact_dates_trns?: string;
    approx_month_trns?: string;
    not_sure_yet_trns?: string;
    check_in_date_trns?: string;
    check_out_date_trns?: string;
    select_month_trns?: string;
    vacation_days_trns?: string;
  };
  menu_3_info: {
    title: string;
    sub_title: string;
    name_trns?: string;
    name_palasholder_trns?: string;
    email_trns?: string;
    email_placeholder_trns?: string;
    phone_trns?: string;
    phone_placeholder_trns?: string;
    nationality_trns?: string;
    message_trns?: string;
    message_placeholder_trns?: string;
  };
  menu_4_budget: {
    title: string;
    sub_title: string;
    adults_trns?: string;
    message_adults_trns?: string;
    children_trns?: string;
    message_children_trns?: string;
    infants_trns?: string;
    message_infants_trns?: string;
    label_budget_range_trns?: string;
    min_price_trns?: string;
    max_price_trns?: string;
  };
  cities: ApiCity[];
}

// ─── Fallback static data ───────────────────────────────────────────────────
const FALLBACK_STATIC_DATA: StaticData = {
  basic_data: {
    name: "Custom Experience",
    title: "Egypt Tailor Made Packages",
    description: "Design your perfect Egypt adventure in just a few steps",
    cover_img: "",
  },
  top_menu_labels: {
    city_label_trns: "Cities",
    time_label_trns: "Time",
    info_title_trns: "Info",
    budget_title_trns: "Budget",
    confirm_label_trns: "Confirm",
  },
  menu_1_city: {
    title: "Select your destinations",
    sub_title: "Choose one or more cities across Egypt",
  },
  menu_2_time: {
    title: "When do you want to travel?",
    sub_title: "Choose how you'd like to specify your travel dates",
    exact_dates_trns: "Exact Dates",
    approx_month_trns: "Approx Month",
    not_sure_yet_trns: "Not Sure Yet",
    check_in_date_trns: "Check-in Date",
    check_out_date_trns: "Check-out Date",
    select_month_trns: "Select Month",
    vacation_days_trns: "Number of Vacation Days",
  },
  menu_3_info: {
    title: "Your Personal Information",
    sub_title: "Tell us about yourself so we can personalize your trip",
    name_trns: "Full Name",
    name_palasholder_trns: "Enter your full name",
    email_trns: "Email",
    email_placeholder_trns: "Enter your email",
    phone_trns: "Phone",
    phone_placeholder_trns: "Enter phone number",
    nationality_trns: "Nationality",
    message_trns: "Additional Info",
    message_placeholder_trns: "Any special requests or notes?",
  },
  menu_4_budget: {
    title: "Customize Your Trip",
    sub_title: "Set your group size and budget range",
    adults_trns: "Adults",
    message_adults_trns: "18+ years",
    children_trns: "Children",
    message_children_trns: "2–17 years",
    infants_trns: "Infants",
    message_infants_trns: "Under 2 years",
    label_budget_range_trns: "Budget Range (USD per person)",
    min_price_trns: "Min Price",
    max_price_trns: "Max Price",
  },
  cities: [
    { id: 1, name: "Cairo", img: "/assets/images/tours/Pyramids-in-Egypt-webp.webp" },
    { id: 2, name: "Giza", img: "/assets/images/tours/great-pyramid-webp.webp" },
    { id: 3, name: "Luxor", img: "/assets/images/about-us/The-front-façade-of-Karnak-Temple-webp.webp" },
    { id: 4, name: "Aswan", img: "/assets/images/tours/106896752__MG_7633-final_Pompeys_Pillar-webp.webp" },
    { id: 5, name: "Alexandria", img: "/assets/images/tours/Cairo day tours in Egypt-webp.webp" },
    { id: 6, name: "Dahab", img: "/assets/images/tours/luxurytours-webp.webp" },
    { id: 7, name: "Sharm El-Sheikh", img: "/assets/images/tours/Egypt Budget Tours-webp.webp" },
    { id: 8, name: "Taba", img: "/assets/images/tours/egypt family tours-webp.webp" },
  ],
};

// ─── Floating Label Input ───────────────────────────────────────────────────
interface FloatingInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  autoComplete?: string;
  onBlur?: () => void;
  error?: string;
}

function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  required,
  icon,
  autoComplete,
  onBlur,
  error,
}: FloatingInputProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e9e9e] pointer-events-none z-10">
          {icon}
        </span>
      )}
      <input
        required={required}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`peer w-full border-[1.5px] border-solid ${error ? "border-red-400" : "border-[#9e9e9e]"} rounded-2xl bg-transparent py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#272262] valid:border-[#272262] outline-none ${icon ? "pl-11 pr-4" : "px-4"}`}
      />
      <label
        className={`absolute text-[#aaa] pointer-events-none translate-y-4 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
          peer-focus:-translate-y-1/2 peer-focus:scale-[0.80] peer-focus:bg-[#272262] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[#e3b75e] peer-focus:rounded-sm
          peer-valid:-translate-y-1/2 peer-valid:scale-[0.80] peer-valid:bg-[#212121] peer-valid:px-[0.2em] peer-valid:py-0 peer-valid:text-[#2196f3] peer-valid:rounded-sm
          ${icon ? "left-11" : "left-4"}`}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

// ─── Floating Label Select ──────────────────────────────────────────────────
interface FloatingSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onBlur?: () => void;
  error?: string;
}

function FloatingSelect({ label, value, onChange, children, icon, onBlur, error }: FloatingSelectProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e9e9e] pointer-events-none z-10">
          {icon}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`peer w-full border-[1.5px] border-solid ${error ? "border-red-400" : "border-[#9e9e9e]"} rounded-2xl bg-transparent py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#272262] outline-none appearance-none cursor-pointer ${icon ? "pl-11 pr-4" : "px-4"} ${value ? "border-[#272262]" : ""}`}
      >
        {children}
      </select>
      <label
        className={`absolute text-[#aaa] pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${value
            ? "-translate-y-1/2 scale-[0.80] bg-[#212121] px-[0.2em] py-0 text-[#2196f3] rounded-sm top-0"
            : "translate-y-4 top-0"
          }
          peer-focus:-translate-y-1/2 peer-focus:scale-[0.80] peer-focus:bg-[#272262] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[#e3b75e] peer-focus:rounded-sm
          ${icon ? "left-11" : "left-4"}`}
      >
        {label}
      </label>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9e9e9e]">
        <ChevronRight size={16} className="rotate-90" />
      </span>
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

// ─── Flatpickr Wrapper ──────────────────────────────────────────────────────
interface FlatpickrInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options?: Record<string, unknown>;
  icon?: React.ReactNode;
  onBlur?: () => void;
  error?: string;
}

function FlatpickrInput({ label, value, onChange, options = {}, icon, onBlur, error }: FlatpickrInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<{ destroy?: () => void; setDate?: (d: string, b: boolean) => void } | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    let cancelled = false;
    let fp: { destroy?: () => void; setDate?: (d: string, b: boolean) => void } | null = null;

    Promise.all([
      import("flatpickr"),
      options.dateFormat === "Y-m" ? import("flatpickr/dist/plugins/monthSelect") : Promise.resolve(null),
    ]).then(([mod, monthSelectMod]) => {
      if (cancelled || !inputRef.current) return;
      const flatpickr = mod.default;
      const monthSelectPlugin = monthSelectMod?.default;
      const safeOptions = { ...options };
      if (monthSelectPlugin) {
        safeOptions.plugins = [
          monthSelectPlugin({
            shorthand: true,
            dateFormat: "Y-m",
            altFormat: "F Y",
          }),
        ];
      } else {
        delete safeOptions.plugins;
      }

      fp = flatpickr(inputRef.current, {
        ...safeOptions,
      onChange: (selectedDates: Date[]) => {        
        if (selectedDates[0]) {
          const d = selectedDates[0];
            const fmt = (safeOptions.dateFormat as string) || "Y-m-d";
            const pad = (n: number) => String(n).padStart(2, "0");
              if (fmt === "Y-m") {
                // local year-month, no UTC shift
                onChange(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
              } else {
                // local YYYY-MM-DD, no UTC shift
                onChange(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
              }
            }
          },
      }) as unknown as { destroy?: () => void; setDate?: (d: string, b: boolean) => void };
      fpRef.current = fp;
      if (value && fp?.setDate) fp.setDate(value, false);
    });

    return () => {
      cancelled = true;
      if (typeof fpRef.current?.destroy === "function") {
        fpRef.current.destroy();
      }
      fpRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isValid = !!value;

  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e9e9e] pointer-events-none z-10">
          {icon}
        </span>
      )}
      <input
        ref={inputRef}
        readOnly
        value={value}
        onBlur={onBlur}
        placeholder=" "
        className={`peer w-full border-[1.5px] border-solid rounded-2xl bg-transparent py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none outline-none cursor-pointer ${icon ? "pl-11 pr-4" : "px-4"} ${error ? "border-red-400" : isValid ? "border-[#272262]" : "border-[#9e9e9e] focus:border-[#272262]"}`}
      />
      <label
        className={`absolute text-[#aaa] pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isValid
            ? "-translate-y-1/2 scale-[0.80] bg-[#212121] px-[0.2em] py-0 text-[#2196f3] rounded-sm top-0"
            : "translate-y-4 top-0 peer-focus:-translate-y-1/2 peer-focus:scale-[0.80] peer-focus:bg-[#272262] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[#e3b75e] peer-focus:rounded-sm"
          }
          ${icon ? "left-11" : "left-4"}`}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

// ─── Floating Label Textarea ────────────────────────────────────────────────
interface FloatingTextareaProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  onBlur?: () => void;
  error?: string;
}

function FloatingTextarea({ label, value, onChange, icon, onBlur, error }: FloatingTextareaProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute left-4 top-5 text-[#9e9e9e] pointer-events-none z-10">
          {icon}
        </span>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={4}
        className={`peer w-full border-[1.5px] border-solid ${error ? "border-red-400" : "border-[#9e9e9e]"} rounded-2xl bg-transparent py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#272262] valid:border-[#272262] outline-none resize-none ${icon ? "pl-11 pr-4" : "px-4"} ${value ? "border-[#272262]" : ""}`}
      />
      <label
        className={`absolute text-[#aaa] pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${value
            ? "-translate-y-1/2 scale-[0.80] bg-[#212121] px-[0.2em] py-0 text-[#2196f3] rounded-sm top-0"
            : "top-0 translate-y-5 peer-focus:-translate-y-1/2 peer-focus:scale-[0.80] peer-focus:top-0 peer-focus:bg-[#272262] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[#e3b75e] peer-focus:rounded-sm"
          }
          ${icon ? "left-11" : "left-4"}`}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

// ─── Counter Button ─────────────────────────────────────────────────────────
function CounterButton({
  label,
  subLabel,
  value,
  icon,
  onInc,
  onDec,
  min = 0,
}: {
  label: string;
  subLabel: string;
  value: number;
  icon: React.ReactNode;
  onInc: () => void;
  onDec: () => void;
  min?: number;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border-[1.5px] border-[#e8eaf0] bg-[#f8f9fc]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#272262]/8 flex items-center justify-center text-[#272262]">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-[#272262]">{label}</p>
          <p className="text-xs text-[#aaa]">{subLabel}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDec}
          disabled={value <= min}
          className="w-9 h-9 rounded-full border-2 border-[#e8eaf0] flex items-center justify-center text-[#272262] font-bold hover:border-[#272262] transition-all disabled:opacity-30 disabled:cursor-not-allowed text-lg leading-none"
        >
          −
        </button>
        <span className="w-6 text-center font-bold text-[#272262] text-base">{value}</span>
        <button
          type="button"
          onClick={onInc}
          className="w-9 h-9 rounded-full bg-[#272262] flex items-center justify-center text-white font-bold hover:bg-[#1a1848] transition-all text-lg leading-none"
        >
          +
        </button>
      </div>
    </div>
  );
}
// ─── Dual Range Slider ──────────────────────────────────────────────────────
interface DualRangeSliderProps {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChangeMin: (val: number) => void;
  onChangeMax: (val: number) => void;
  label: string;
  formatValue?: (val: number) => string;
}


// ─── Main Component ─────────────────────────────────────────────────────────
export default function TailorMadePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useT("tailormade");
  // ── API state ─────────────────────────────────────────────────────────────
  const [apiData, setApiData] = useState<StaticData | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
function DualRangeSlider({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  label,
  formatValue = (v) => `$${v.toLocaleString()}`,
}: DualRangeSliderProps) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), valueMax - step);
    onChangeMin(val);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), valueMin + step);
    onChangeMax(val);
  };

  return (
    <div className="space-y-4 pt-2">
      <p className="text-sm font-bold text-[#272262] flex items-center gap-2">
        <DollarSign size={16} className="text-[#e3b75e]" />
        {label}
      </p>

      {/* Value badges */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[10px] font-semibold text-[#bbb] uppercase tracking-wider">{t("tailormade_menu_4_budget_min_price_trns")}</span>
          <span className="text-base font-bold text-[#272262]">{formatValue(valueMin)}</span>
        </div>
        <div className="flex-1 mx-3 border-t-2 border-dashed border-[#e8eaf0]" />
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] font-semibold text-[#bbb] uppercase tracking-wider">{t("tailormade_menu_4_budget_max_price_trns")}</span>
          <span className="text-base font-bold text-[#e3b75e]">{formatValue(valueMax)}</span>
        </div>
      </div>

      {/* Dual-thumb track */}
      <div className="relative h-6 flex items-center">
        {/* Base track */}
        <div className="absolute inset-x-0 h-2 rounded-full bg-[#e8eaf0]" />
        {/* Filled range */}
        <div
          className="absolute h-2 rounded-full bg-gradient-to-r from-[#272262] to-[#e3b75e]"
          style={{
            left: `${pct(valueMin)}%`,
            right: `${100 - pct(valueMax)}%`,
          }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={handleMinChange}
          className="dual-thumb absolute inset-0 w-full appearance-none bg-transparent cursor-pointer"
          style={{ zIndex: valueMin > max - 100 ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={handleMaxChange}
          className="dual-thumb absolute inset-0 w-full appearance-none bg-transparent cursor-pointer"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-[10px] font-medium text-[#bbb]">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max / 2)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
  // Fetch tailor-made static data from API via proxy
  useEffect(() => {
    async function loadStaticData() {
      try {
        const res = await fetch(`/api/tailor-made?locale=${locale}`);
        if (!res.ok) throw new Error("API request failed");
        const json = await res.json();
        if (json?.success && json?.data?.static_data) {
          setApiData(json.data.static_data as StaticData);
        } else {
          // API responded but shape is unexpected — use fallback silently
          setApiData(FALLBACK_STATIC_DATA);
        }
      } catch {
        // Network error or proxy unavailable — use fallback silently
        setApiData(FALLBACK_STATIC_DATA);
      } finally {
        setApiLoading(false);
      }
    }
    loadStaticData();
    
  }, [locale]);

  // ── Resolved data: API data merged with fallbacks per field ──────────────
  // Each field individually falls back so partial API responses still work.
  const sd = apiData ?? FALLBACK_STATIC_DATA;

  const pageTitle      = sd.basic_data?.title        ||  t("tailormade_title");
  const pageSubtitle   = sd.basic_data?.name         || t("tailormade_name");
  const pageDesc       = sd.basic_data?.description  || t("tailormade_description");

  const label_cities   = sd.top_menu_labels?.city_label_trns    || t("tailormade_tab_city_label_trns");
  const label_time     = sd.top_menu_labels?.time_label_trns    || t("tailormade_tab_time_label_trns");
  const label_info     = sd.top_menu_labels?.info_title_trns    || t("tailormade_tab_info_title_trns");
  const label_budget   = sd.top_menu_labels?.budget_title_trns  || t("tailormade_tab_budget_title_trns");
  const label_confirm  = sd.top_menu_labels?.confirm_label_trns || t("tailormade_tab_confirm_label_trns");

const city_title    = sd.menu_1_city?.title     || t("tailormade_menu_1_city_title_trns");
const city_subtitle = sd.menu_1_city?.sub_title || t("tailormade_menu_1_city_sub_title_trns");

const time_title    = sd.menu_2_time?.title     || t("tailormade_menu_2_time_title_trns");
const time_subtitle = sd.menu_2_time?.sub_title || t("tailormade_menu_2_time_sub_title_trns");
  const time_exact         = sd.menu_2_time?.exact_dates_trns  || FALLBACK_STATIC_DATA.menu_2_time.exact_dates_trns!;
  const time_approx        = sd.menu_2_time?.approx_month_trns || FALLBACK_STATIC_DATA.menu_2_time.approx_month_trns!;
  const time_notSure       = sd.menu_2_time?.not_sure_yet_trns || FALLBACK_STATIC_DATA.menu_2_time.not_sure_yet_trns!;
  const time_checkin       = sd.menu_2_time?.check_in_date_trns  || FALLBACK_STATIC_DATA.menu_2_time.check_in_date_trns!;
  const time_checkout      = sd.menu_2_time?.check_out_date_trns || FALLBACK_STATIC_DATA.menu_2_time.check_out_date_trns!;
  const time_selectMonth   = sd.menu_2_time?.select_month_trns   || FALLBACK_STATIC_DATA.menu_2_time.select_month_trns!;
  const time_vacationDays  = sd.menu_2_time?.vacation_days_trns  || FALLBACK_STATIC_DATA.menu_2_time.vacation_days_trns!;

 const info_title    = sd.menu_3_info?.title     || t("tailormade_menu_3_info_title_trns");
const info_subtitle = sd.menu_3_info?.sub_title || t("tailormade_menu_3_info_sub_title_trns");

const info_name_label  = sd.menu_3_info?.name_trns        || t("tailormade_menu_3_info_name_trns");
const info_email_label = sd.menu_3_info?.email_trns       || t("tailormade_menu_3_info_email_trns");
const info_phone_label = sd.menu_3_info?.phone_trns       || t("tailormade_menu_3_info_phone_trns");
const info_nat_label   = sd.menu_3_info?.nationality_trns || t("tailormade_menu_3_info_nationality_trns");
const info_msg_label   = sd.menu_3_info?.message_trns     || t("tailormade_menu_3_info_message_trns");

const budget_title    = sd.menu_4_budget?.title     || t("tailormade_menu_4_budget_title_trns");
const budget_subtitle = sd.menu_4_budget?.sub_title || t("tailormade_menu_4_budget_sub_title_trns");

const budget_adults       = sd.menu_4_budget?.adults_trns           || t("tailormade_menu_4_budget_adults_trns");
const budget_adults_sub   = sd.menu_4_budget?.message_adults_trns   || t("tailormade_menu_4_budget_message_adults_trns");

const budget_children     = sd.menu_4_budget?.children_trns         || t("tailormade_menu_4_budget_children_trns");
const budget_children_sub = sd.menu_4_budget?.message_children_trns || t("tailormade_menu_4_budget_message_children_trns");

const budget_infants      = sd.menu_4_budget?.infants_trns          || t("tailormade_menu_4_budget_infants_trns");
const budget_infants_sub  = sd.menu_4_budget?.message_infants_trns  || t("tailormade_menu_4_budget_message_infants_trns");

const budget_range_label =
  sd.menu_4_budget?.label_budget_range_trns ||
  t("tailormade_menu_4_budget_label_budget_range_trns");

  // ── Cities: API cities → normalized shape, fallback if empty ────────────
  const cities = useMemo(() => {
    const apiCities = sd.cities;
    if (Array.isArray(apiCities) && apiCities.length > 0) {
      return apiCities.map((c) => ({
        id: String(c.id),          // use string id to match formData.cities[]
        name: c.name || "City",
        image: c.img || "/assets/images/tours/Pyramids-in-Egypt-webp.webp",
      }));
    }
    // Fallback: static city list
    return FALLBACK_STATIC_DATA.cities.map((c) => ({
      id: String(c.id),
      name: c.name,
      image: c.img,
    }));
  }, [sd.cities]);

  // ── Steps derived from API labels ────────────────────────────────────────
  const steps = [
    { num: 1, label: label_cities },
    { num: 2, label: label_time },
    { num: 3, label: label_info },
    { num: 4, label: label_budget },
    { num: 5, label: label_confirm },
  ];

  // ── Form state ───────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<{
    cities: string[];
    checkIn: string;
    checkOut: string;
    monthSelect: string;
    vacationDays: string;
    timeOption: string;
    fullName: string;
    email: string;
    phoneCode: string;
    phoneNumber: string;
    nationality: string;
    hotel: string;
    additionalInfo: string;
    adults: number;
    children: number;
    infants: number;
    priceMin: number;
    priceMax: number;
  }>({
    cities: [],
    checkIn: "",
    checkOut: "",
    monthSelect: "",
    vacationDays: "",
    timeOption: "exact",
    fullName: "",
    email: "",
    phoneCode: "",
    phoneNumber: "",
    nationality: "",
    hotel: "",
    additionalInfo: "",
    adults: 1,
    children: 0,
    infants: 0,
    priceMin: 250,
    priceMax: 7500,
  });

  const updateFormData = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (stepError) setStepError(null);
  };

  const toggleCity = (cityId: string) => {
    setFormData((prev) => ({
      ...prev,
      cities: prev.cities.includes(cityId)
        ? prev.cities.filter((c) => c !== cityId)
        : [...prev.cities, cityId],
    }));
    if (stepError) setStepError(null);
  };

  // ── Zod validation — unchanged ────────────────────────────────────────────
  const isStepValid = () => {
    const parsed = tailorMadeSchema.safeParse(formData);
    if (parsed.success) return true;
    switch (currentStep) {
      case 1: return !parsed.error.issues.some((i) => i.path[0] === "cities");
      case 2: return !parsed.error.issues.some((i) => ["checkIn", "checkOut", "monthSelect", "vacationDays", "timeOption"].includes(String(i.path[0])));
      case 3: return !parsed.error.issues.some((i) => ["fullName", "email", "phoneCode", "phoneNumber", "nationality", "hotel"].includes(String(i.path[0])));
      case 4: return !parsed.error.issues.some((i) => ["priceMin", "priceMax"].includes(String(i.path[0])));
      default: return false;
    }
  };

  const getCurrentStepError = () => {
    const parsed = tailorMadeSchema.safeParse(formData);
    if (parsed.success) return null;
    const issue = parsed.error.issues.find((i) => {
      const f = String(i.path[0]);
      if (currentStep === 1) return f === "cities";
      if (currentStep === 2) return ["checkIn", "checkOut", "monthSelect", "vacationDays", "timeOption"].includes(f);
      if (currentStep === 3) return ["fullName", "email", "phoneCode", "phoneNumber", "nationality", "hotel"].includes(f);
      if (currentStep === 4) return ["priceMin", "priceMax"].includes(f);
      return false;
    });
    return issue?.message ?? null;
  };

  const validationIssues = useMemo(() => {
    const parsed = tailorMadeSchema.safeParse(formData);
    if (parsed.success) return {} as Record<string, string>;
    const map: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!map[key]) map[key] = issue.message;
    }
    return map;
  }, [formData]);

  const fieldError = (name: string) => (touched[name] ? validationIssues[name] : undefined);
  const markTouched = (name: string) => setTouched((prev) => ({ ...prev, [name]: true }));

  const nextStep = () => {
    if (isStepValid() && currentStep < 5) {
      setStepError(null);
      setCurrentStep((s) => s + 1);
    } else {
      setStepError(getCurrentStepError());
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validatedData = tailorMadeSchema.safeParse(formData);
    if (!validatedData.success) {
      toast.error(validatedData.error.issues[0]?.message ?? "Please review and fix the form fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/tailor-made", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData.data),
      });
      const result = await res.json().catch(() => null);
      if (res.ok && result?.success !== false) {
        toast.success(result?.message || "Trip request submitted successfully! We'll contact you soon. ✈️");
        router.push("/thank-you");
      } else {
        toast.error(result?.message || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
    setLoading(false);
  };

  const getDaysCount = () => {
    if (formData.checkIn && formData.checkOut) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    }
    return formData.vacationDays ? parseInt(formData.vacationDays) : 0;
  };

  // Summary items — reactive to formData, updates immediately on every change
  const summaryItems: { label: string; value: string }[] = [];
  if (formData.cities.length > 0)
    summaryItems.push({ label: "Cities", value: formData.cities.map((id) => cities.find((c) => c.id === id)?.name ?? id).join(", ") });
  if (formData.checkIn && formData.checkOut)
    summaryItems.push({ label: "Dates", value: `${formData.checkIn} → ${formData.checkOut}` });
  else if (formData.monthSelect)
    summaryItems.push({ label: "Month", value: formData.monthSelect });
  else if (formData.vacationDays)
    summaryItems.push({ label: "Days", value: `${formData.vacationDays} days` });
  if (getDaysCount() > 0 && formData.checkIn)
    summaryItems.push({ label: "Duration", value: `${getDaysCount()} days` });
  if (formData.fullName) summaryItems.push({ label: "Name", value: formData.fullName });
  if (formData.email) summaryItems.push({ label: "Email", value: formData.email });
  if (formData.phoneNumber) summaryItems.push({ label: "Phone", value: `${formData.phoneCode} ${formData.phoneNumber}` });
  if (formData.nationality) summaryItems.push({ label: "Nationality", value: formData.nationality });
  if (formData.hotel) summaryItems.push({ label: "Hotel", value: formData.hotel });
  // Always show guests (adults defaults to 1)
  summaryItems.push({ label: "Guests", value: `${formData.adults} Adults · ${formData.children} Children · ${formData.infants} Infants` });
  // Always show budget (defaults are 2500–7500)
  summaryItems.push({ label: "Budget", value: `$${formData.priceMin.toLocaleString()} – $${formData.priceMax.toLocaleString()}` });

  // Fix 1: checkIn minDate = tomorrow (backend requires arrival_date after:today)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const flatpickrDateOpts = { dateFormat: "Y-m-d", minDate: tomorrow };

  // Fix 2: monthSelect minDate = first day of current month (so current month is selectable)
  const firstOfThisMonth = new Date();
  firstOfThisMonth.setDate(1);
  firstOfThisMonth.setHours(0, 0, 0, 0);
  const flatpickrMonthOpts = { dateFormat: "Y-m", minDate: firstOfThisMonth };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (apiLoading) {
    return (
      <div className="relative min-h-screen bg-[#f4f6fb] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#272262] border-t-[#e3b75e] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#272262] font-semibold text-sm">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f4f6fb] py-10 sm:py-14">
      {/* Soft gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #e3b75e, transparent)" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #272262, transparent)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#e3b75e] mb-2">
            {pageSubtitle}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#272262] mb-3 leading-tight">
            {pageTitle}
          </h1>
          <p className="text-[#666] text-base sm:text-lg max-w-xl mx-auto">
            {pageDesc}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* ─── Form Panel ──────────────────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-[#e8eaf0] overflow-hidden">
            {/* Step Progress Bar */}
            <div className="px-6 sm:px-8 pt-8 pb-6">
              <div className="relative flex items-center justify-between">
                {/* Background line */}
                <div className="absolute left-0 right-0 top-5 h-[2px] bg-[#e8eaf0] z-0" />
                {/* Progress fill */}
                <div
                  className="absolute left-0 top-5 h-[2px] bg-[#e3b75e] z-0 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
                {steps.map((step) => {
                  const done = step.num < currentStep;
                  const active = step.num === currentStep;
                  return (
                    <div key={step.num} className="relative z-10 flex flex-col items-center gap-2 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 shadow-sm
                          ${done ? "bg-[#e3b75e] border-[#e3b75e] text-white" : active ? "bg-[#272262] border-[#272262] text-white scale-110 shadow-lg" : "bg-white border-[#d0d4e0] text-[#aaa]"}`}
                      >
                        {done ? <Check size={16} /> : step.num}
                      </div>
                      <span className={`hidden sm:block text-[11px] font-semibold transition-colors capitalize ${active ? "text-[#272262]" : done ? "text-[#e3b75e]" : "text-[#bbb]"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-8">
              {/* ── Step 1: Cities ── */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#272262]">{city_title}</h3>
                    <p className="text-[#888] text-sm mt-1">{city_subtitle}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {cities.map((city) => {
                      const selected = formData.cities.includes(city.id);
                      return (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => toggleCity(city.id)}
                          className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-lg focus:outline-none ${selected ? "border-[#e3b75e] shadow-md ring-2 ring-[#e3b75e]/30" : "border-[#e8eaf0] hover:border-[#e3b75e]/60"}`}
                        >
                          <div className="relative h-24 w-full overflow-hidden">
                            <FallbackImage
                              src={city.image}
                              alt={city.name}
                              fill
                              unoptimized={city.image.startsWith("http")}
                              className={`object-cover transition-transform duration-400 ${selected ? "scale-105" : "group-hover:scale-105"}`}
                            />
                            <div className={`absolute inset-0 transition-all duration-300 ${selected ? "bg-[#272262]/40" : "bg-black/10 group-hover:bg-black/20"}`} />
                            {selected && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-[#e3b75e] rounded-full flex items-center justify-center shadow">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                          <div className={`py-2 px-1 transition-colors duration-200 ${selected ? "bg-[#fffbf0]" : "bg-white"}`}>
                            <p className={`text-xs font-bold text-center truncate ${selected ? "text-[#e3b75e]" : "text-[#272262]"}`}>
                              {city.name}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {formData.cities.length > 0 && (
                    <p className="text-xs text-[#888] flex items-center gap-1">
                      <MapPin size={12} className="text-[#e3b75e]" />
                      Selected: <span className="font-semibold text-[#272262]">{formData.cities.map((id) => cities.find((c) => c.id === id)?.name).join(", ")}</span>
                    </p>
                  )}
                </div>
              )}

              {/* ── Step 2: Time ── */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#272262]">{time_title}</h3>
                    <p className="text-[#888] text-sm mt-1">{time_subtitle}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "exact", label: time_exact, icon: "📅" },
                      { value: "month", label: time_approx, icon: "🗓️" },
                      { value: "days",  label: time_notSure, icon: "⏳" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setFormData((prev) => ({ ...prev, timeOption: opt.value, checkIn: "", checkOut: "", monthSelect: "", vacationDays: "" })); if (stepError) setStepError(null); }}
                        className={`p-4 rounded-2xl border-2 transition-all duration-200 text-center focus:outline-none ${formData.timeOption === opt.value ? "border-[#272262] bg-[#272262]/5 shadow-md" : "border-[#e8eaf0] hover:border-[#272262]/40"}`}
                      >
                        <div className="text-2xl mb-1">{opt.icon}</div>
                        <span className={`text-xs font-bold block ${formData.timeOption === opt.value ? "text-[#272262]" : "text-[#888]"}`}>{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {formData.timeOption === "exact" && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FlatpickrInput
                        label={time_checkin}
                        value={formData.checkIn}
                        onChange={(v) => updateFormData("checkIn", v)}
                        options={flatpickrDateOpts}
                        icon={<Calendar size={18} />}
                        onBlur={() => markTouched("checkIn")}
                        error={fieldError("checkIn")}
                      />
                      <FlatpickrInput
                        label={time_checkout}
                        value={formData.checkOut}
                        onChange={(v) => updateFormData("checkOut", v)}
                        options={{ ...flatpickrDateOpts, minDate: formData.checkIn || "today" }}
                        icon={<Calendar size={18} />}
                        onBlur={() => markTouched("checkOut")}
                        error={fieldError("checkOut")}
                      />
                    </div>
                  )}

                  {formData.timeOption === "month" && (
                    <FlatpickrInput
                      label={time_selectMonth}
                      value={formData.monthSelect}
                      onChange={(v) => updateFormData("monthSelect", v)}
                      options={flatpickrMonthOpts}
                      icon={<Calendar size={18} />}
                      onBlur={() => markTouched("monthSelect")}
                      error={fieldError("monthSelect")}
                    />
                  )}

                  {formData.timeOption === "days" && (
                    <FloatingInput
                      label={time_vacationDays}
                      type="number"
                      value={formData.vacationDays}
                      onChange={(v) => updateFormData("vacationDays", v)}
                      icon={<Calendar size={18} />}
                      onBlur={() => markTouched("vacationDays")}
                      error={fieldError("vacationDays")}
                    />
                  )}
                </div>
              )}

              {/* ── Step 3: Info ── */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#272262]">{info_title}</h3>
                    <p className="text-[#888] text-sm mt-1">{info_subtitle}</p>
                  </div>
                  <div className="flex gap-3">
                    <FloatingInput
                      label={info_name_label}
                      value={formData.fullName}
                      onChange={(v) => updateFormData("fullName", v)}
                      icon={<User size={18} />}
                      onBlur={() => markTouched("fullName")}
                      error={fieldError("fullName")}
                    />
                    <FloatingInput
                      label={info_email_label}
                      type="email"
                      value={formData.email}
                      onChange={(v) => updateFormData("email", v)}
                      icon={<Globe size={18} />}
                      autoComplete="email"
                      onBlur={() => markTouched("email")}
                      error={fieldError("email")}
                    />    
                  </div>
                  {/* Phone row: country code + number */}
                  <div className="grid grid-cols-[140px_1fr] gap-3">
                    <FloatingSelect
                      label="Code"
                      value={formData.phoneCode}
                      onChange={(v) => updateFormData("phoneCode", v)}
                      icon={<Phone size={18} />}
                      onBlur={() => markTouched("phoneCode")}
                      error={fieldError("phoneCode")}
                    >
                      <option value="" />
                      {PHONE_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </FloatingSelect>
                    <FloatingInput
                      label={info_phone_label}
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(v) => updateFormData("phoneNumber", v)}
                      onBlur={() => markTouched("phoneNumber")}
                      error={fieldError("phoneNumber")}
                    />
                  </div>
                  <div className="flex gap-3">
                  <FloatingSelect
                    label={info_nat_label}
                    value={formData.nationality}
                    onChange={(v) => updateFormData("nationality", v)}
                    icon={<Globe size={18} />}
                    onBlur={() => markTouched("nationality")}
                    error={fieldError("nationality")}
                  >
                    <option value="" />
                    {NATIONALITIES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </FloatingSelect>
                  <FloatingSelect
                    label="Hotel Rating"
                    value={formData.hotel}
                    onChange={(v) => updateFormData("hotel", v)}
                    icon={<Hotel size={18} />}
                    onBlur={() => markTouched("hotel")}
                    error={fieldError("hotel")}
                  >
                    <option value="" />
                    {["3 Stars", "4 Stars", "5 Stars", "Luxury"].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </FloatingSelect>
                  </div>

                  <FloatingTextarea
                    label={info_msg_label}
                    value={formData.additionalInfo}
                    onChange={(v) => updateFormData("additionalInfo", v)}
                    icon={<MessageSquare size={18} />}
                    onBlur={() => markTouched("additionalInfo")}
                    error={fieldError("additionalInfo")}
                  />
                </div>
              )}

              {/* ── Step 4: Budget ── */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#272262]">{budget_title}</h3>
                    <p className="text-[#888] text-sm mt-1">{budget_subtitle}</p>
                  </div>

                  {/* Group size counters */}
                  <div className="space-y-3">
                    <CounterButton
                      label={budget_adults}
                      subLabel={budget_adults_sub}
                      value={formData.adults}
                      icon={<UserCheck size={18} />}
                      onInc={() => updateFormData("adults", formData.adults + 1)}
                      onDec={() => updateFormData("adults", Math.max(1, formData.adults - 1))}
                      min={1}
                    />
                    <CounterButton
                      label={budget_children}
                      subLabel={budget_children_sub}
                      value={formData.children}
                      icon={<Users size={18} />}
                      onInc={() => updateFormData("children", formData.children + 1)}
                      onDec={() => updateFormData("children", Math.max(0, formData.children - 1))}
                    />
                    <CounterButton
                      label={budget_infants}
                      subLabel={budget_infants_sub}
                      value={formData.infants}
                      icon={<Baby size={18} />}
                      onInc={() => updateFormData("infants", formData.infants + 1)}
                      onDec={() => updateFormData("infants", Math.max(0, formData.infants - 1))}
                    />
                  </div>

                  {/* Budget range sliders */}
                  {/* Budget range — single dual-thumb slider */}
                  <DualRangeSlider
                    min={0}
                    max={15000}
                    step={100}
                    valueMin={formData.priceMin}
                    valueMax={formData.priceMax}
                    onChangeMin={(v) => updateFormData("priceMin", v)}
                    onChangeMax={(v) => updateFormData("priceMax", v)}
                    label={budget_range_label}
                  />
                </div>
              )}

              {/* ── Step 5: Confirm ── */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-[#f8f9fc] rounded-2xl border-[1.5px] border-[#e8eaf0] px-5 py-6 text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#272262]">Welcome{formData.fullName ? `, ${formData.fullName}` : ""}! Almost there, 👋</h3>
                    <p className="text-sm text-[#888] mt-2">Welcome to Egypt Tour Gate. We&apos;ll craft your trip and contact you shortly. Your request is almost ready. Click submit and our travel specialist will contact you.</p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#e3b75e] hover:bg-[#c9a24f] text-[#272262] font-bold py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-base"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Submitting your request...
                        </>
                      ) : "Submit Trip Request ✈️"}
                    </button>
                  </form>
                </div>
              )}

              {/* Step error */}
              {stepError && (
                <div className="mt-5 flex items-start gap-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
                  <span className="text-red-500 mt-0.5">⚠️</span>
                  {stepError}
                </div>
              )}

              {/* Nav Buttons */}
              {currentStep < 5 && (
                <div className="flex gap-3 mt-8">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center gap-1 px-6 py-3 border-2 border-[#e8eaf0] text-[#272262] font-bold rounded-2xl hover:bg-[#f4f6fb] transition-all duration-200"
                    >
                      <ChevronLeft size={18} />
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={nextStep}
                    className={`flex-1 flex items-center justify-center gap-1 py-3 font-bold rounded-2xl transition-all duration-200 shadow-md ${isStepValid() ? "bg-[#272262] hover:bg-[#1a1848] text-white hover:shadow-lg" : "bg-[#e8eaf0] text-[#aaa] cursor-not-allowed"}`}
                  >
                    Continue
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ─── Summary Sidebar ──────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-xl border border-[#e8eaf0] overflow-hidden sticky top-4">
            <div className="relative h-36 w-full">
              <FallbackImage
                src="/assets/images/tours/Pyramids-in-Egypt-webp.webp"
                alt="Egypt"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#272262]/80 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <h3 className="text-lg font-bold text-white">Trip Summary</h3>
                <p className="text-xs text-white/70">{summaryItems.length === 0 ? "Fill the form to see your summary" : `${summaryItems.length} detail${summaryItems.length > 1 ? "s" : ""} added`}</p>
              </div>
            </div>

            <div className="p-5">
              {summaryItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🗺️</div>
                  <p className="text-sm text-[#aaa] font-medium">Your trip summary will appear here as you fill in the form</p>
                </div>
              ) : (
                <div className="space-y-0 divide-y divide-[#f0f2f8]">
                  {summaryItems.map((item) => (
                    <div key={item.label} className="flex justify-between items-start gap-3 py-3">
                      <span className="text-xs font-bold text-[#bbb] uppercase tracking-wide whitespace-nowrap">{item.label}</span>
                      <span className="text-sm font-semibold text-[#272262] text-right leading-snug">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Step indicator in sidebar */}
              <div className="mt-5 pt-4 border-t border-[#f0f2f8]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-[#aaa] font-semibold">Progress</span>
                  <span className="text-xs font-bold text-[#e3b75e]">Step {currentStep} of 5</span>
                </div>
                <div className="w-full bg-[#f0f2f8] rounded-full h-1.5">
                  <div
                    className="bg-[#e3b75e] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

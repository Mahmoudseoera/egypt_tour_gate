"use client";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { Check, Calendar, MapPin, User, Phone, Globe, Hotel, MessageSquare, ChevronRight, ChevronLeft, DollarSign, Users, Baby, UserCheck } from "lucide-react";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/plugins/monthSelect/style.css";
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
    hotel_trns?: string;
    hotel_placeholder_trns?: string;
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

const DEFAULT_COPY = {
  basic_data: {
    name: "Custom Experience",
    title: "Egypt Tailor Made Packages",
    description: "Design your perfect Egypt adventure in just a few steps",
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
} as const;

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatLocalMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
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
  placeholder,
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
        placeholder={placeholder || " "}
        className={`peer w-full border-[1.5px] border-solid ${error ? "border-red-400" : "border-[#9e9e9e]"} rounded-2xl bg-transparent py-3 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#272262] valid:border-[#272262] outline-none ${icon ? "pl-11 pr-4" : "px-4"}`}
      />
      <label
        className={`absolute text-[#aaa] pointer-events-none translate-y-3 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
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
  placeholder?: string;
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
        className={`peer w-full border-[1.5px] border-solid ${error ? "border-red-400" : "border-[#9e9e9e]"} rounded-2xl bg-transparent py-3 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#272262] outline-none appearance-none cursor-pointer ${icon ? "pl-11 pr-4" : "px-4"} ${value ? "border-[#272262]" : ""}`}
      >
        {children}
      </select>
      <label
        className={`absolute text-[#aaa] pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${value
            ? "-translate-y-1/2 scale-[0.80] bg-[#212121] px-[0.2em] py-0 text-[#2196f3] rounded-sm top-0"
            : "translate-y-3 top-0"
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
  const onChangeRef = useRef(onChange);
  const fpRef = useRef<{ destroy?: () => void; setDate?: (d: string, b: boolean) => void; set?: (key: string | Record<string, unknown>, value?: unknown) => void } | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!inputRef.current) return;

    let cancelled = false;
    let fp: { destroy?: () => void; setDate?: (d: string, b: boolean) => void; set?: (key: string | Record<string, unknown>, value?: unknown) => void } | null = null;

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
        allowInput: false,
        disableMobile: true,
        onChange: (selectedDates: Date[]) => {
          if (selectedDates[0]) {
            const fmt = (safeOptions.dateFormat as string) || "Y-m-d";
            onChangeRef.current(fmt === "Y-m" ? formatLocalMonth(selectedDates[0]) : formatLocalDate(selectedDates[0]));
          }
        },
      }) as unknown as { destroy?: () => void; setDate?: (d: string, b: boolean) => void; set?: (key: string | Record<string, unknown>, value?: unknown) => void };
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
  }, [options, value]);

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
        className={`peer w-full border-[1.5px] border-solid rounded-2xl bg-transparent py-3 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none outline-none cursor-pointer ${icon ? "pl-11 pr-4" : "px-4"} ${error ? "border-red-400" : isValid ? "border-[#272262]" : "border-[#9e9e9e] focus:border-[#272262]"}`}
      />
      <label
        className={`absolute text-[#aaa] pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isValid
            ? "-translate-y-1/2 scale-[0.80] bg-[#212121] px-[0.2em] py-0 text-[#2196f3] rounded-sm top-0"
            : "translate-y-3 top-0 peer-focus:-translate-y-1/2 peer-focus:scale-[0.80] peer-focus:bg-[#272262] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[#e3b75e] peer-focus:rounded-sm"
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
  placeholder?: string;
  onBlur?: () => void;
  error?: string;
}

function FloatingTextarea({ label, value, onChange, icon, placeholder, onBlur, error }: FloatingTextareaProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute left-4 top-4 text-[#9e9e9e] pointer-events-none z-10">
          {icon}
        </span>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder || " "}
        rows={3}
        className={`peer w-full border-[1.5px] border-solid ${error ? "border-red-400" : "border-[#9e9e9e]"} rounded-2xl bg-transparent py-3 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#272262] valid:border-[#272262] outline-none resize-none ${icon ? "pl-11 pr-4" : "px-4"} ${value ? "border-[#272262]" : ""}`}
      />
      <label
        className={`absolute text-[#aaa] pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${value
            ? "-translate-y-1/2 scale-[0.80] bg-[#212121] px-[0.2em] py-0 text-[#2196f3] rounded-sm top-0"
            : "top-0 translate-y-4 peer-focus:-translate-y-1/2 peer-focus:scale-[0.80] peer-focus:top-0 peer-focus:bg-[#272262] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[#e3b75e] peer-focus:rounded-sm"
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

// ─── Main Component ─────────────────────────────────────────────────────────
export default function TailorMadePage() {
  const router = useRouter();
  const locale = useLocale();

  // ── API state ─────────────────────────────────────────────────────────────
  const [apiData, setApiData] = useState<StaticData | null>(null);
  const [apiLoading, setApiLoading] = useState(true);

  // Fetch tailor-made static data from API via proxy
  useEffect(() => {
    async function loadStaticData() {
      try {
        const res = await fetch(`/api/tailor-made-data?locale=${locale}`);
        if (!res.ok) throw new Error("API request failed");
        const json = await res.json();
        if (json?.success && json?.data?.static_data) {
          setApiData(json.data.static_data as StaticData);
        } else {
          setApiData(null);
        }
      } catch {
        setApiData(null);
      } finally {
        setApiLoading(false);
      }
    }
    loadStaticData();
  }, [locale]);

  // ── Resolved API data with minimal UI copy defaults for missing labels ───
  const sd = apiData;

  const pageTitle      = sd?.basic_data?.title        || DEFAULT_COPY.basic_data.title;
  const pageSubtitle   = sd?.basic_data?.name         || DEFAULT_COPY.basic_data.name;
  const pageDesc       = sd?.basic_data?.description  || DEFAULT_COPY.basic_data.description;

  const label_cities   = sd?.top_menu_labels?.city_label_trns    || DEFAULT_COPY.top_menu_labels.city_label_trns;
  const label_time     = sd?.top_menu_labels?.time_label_trns    || DEFAULT_COPY.top_menu_labels.time_label_trns;
  const label_info     = sd?.top_menu_labels?.info_title_trns    || DEFAULT_COPY.top_menu_labels.info_title_trns;
  const label_budget   = sd?.top_menu_labels?.budget_title_trns  || DEFAULT_COPY.top_menu_labels.budget_title_trns;
  const label_confirm  = sd?.top_menu_labels?.confirm_label_trns || DEFAULT_COPY.top_menu_labels.confirm_label_trns;

  const city_title     = sd?.menu_1_city?.title    || DEFAULT_COPY.menu_1_city.title;
  const city_subtitle  = sd?.menu_1_city?.sub_title || DEFAULT_COPY.menu_1_city.sub_title;

  const time_title         = sd?.menu_2_time?.title             || DEFAULT_COPY.menu_2_time.title;
  const time_subtitle      = sd?.menu_2_time?.sub_title         || DEFAULT_COPY.menu_2_time.sub_title;
  const time_exact         = sd?.menu_2_time?.exact_dates_trns  || DEFAULT_COPY.menu_2_time.exact_dates_trns;
  const time_approx        = sd?.menu_2_time?.approx_month_trns || DEFAULT_COPY.menu_2_time.approx_month_trns;
  const time_notSure       = sd?.menu_2_time?.not_sure_yet_trns || DEFAULT_COPY.menu_2_time.not_sure_yet_trns;
  const time_checkin       = sd?.menu_2_time?.check_in_date_trns  || DEFAULT_COPY.menu_2_time.check_in_date_trns;
  const time_checkout      = sd?.menu_2_time?.check_out_date_trns || DEFAULT_COPY.menu_2_time.check_out_date_trns;
  const time_selectMonth   = sd?.menu_2_time?.select_month_trns   || DEFAULT_COPY.menu_2_time.select_month_trns;
  const time_vacationDays  = sd?.menu_2_time?.vacation_days_trns  || DEFAULT_COPY.menu_2_time.vacation_days_trns;

  const info_title          = sd?.menu_3_info?.title                   || DEFAULT_COPY.menu_3_info.title;
  const info_subtitle       = sd?.menu_3_info?.sub_title               || DEFAULT_COPY.menu_3_info.sub_title;
  const info_name_label     = sd?.menu_3_info?.name_trns               || DEFAULT_COPY.menu_3_info.name_trns;
  const info_name_placeholder = sd?.menu_3_info?.name_palasholder_trns || DEFAULT_COPY.menu_3_info.name_palasholder_trns;
  const info_email_label    = sd?.menu_3_info?.email_trns              || DEFAULT_COPY.menu_3_info.email_trns;
  const info_email_placeholder = sd?.menu_3_info?.email_placeholder_trns || DEFAULT_COPY.menu_3_info.email_placeholder_trns;
  const info_phone_label    = sd?.menu_3_info?.phone_trns              || DEFAULT_COPY.menu_3_info.phone_trns;
  const info_phone_placeholder = sd?.menu_3_info?.phone_placeholder_trns || DEFAULT_COPY.menu_3_info.phone_placeholder_trns;
  const info_nat_label      = sd?.menu_3_info?.nationality_trns        || DEFAULT_COPY.menu_3_info.nationality_trns;
  const info_hotel_label    = sd?.menu_3_info?.hotel_trns              || "Hotel Rating";
  const info_msg_label      = sd?.menu_3_info?.message_trns            || DEFAULT_COPY.menu_3_info.message_trns;
  const info_msg_placeholder = sd?.menu_3_info?.message_placeholder_trns || DEFAULT_COPY.menu_3_info.message_placeholder_trns;

  const budget_title        = sd?.menu_4_budget?.title                 || DEFAULT_COPY.menu_4_budget.title;
  const budget_subtitle     = sd?.menu_4_budget?.sub_title             || DEFAULT_COPY.menu_4_budget.sub_title;
  const budget_adults       = sd?.menu_4_budget?.adults_trns           || DEFAULT_COPY.menu_4_budget.adults_trns;
  const budget_adults_sub   = sd?.menu_4_budget?.message_adults_trns   || DEFAULT_COPY.menu_4_budget.message_adults_trns;
  const budget_children     = sd?.menu_4_budget?.children_trns         || DEFAULT_COPY.menu_4_budget.children_trns;
  const budget_children_sub = sd?.menu_4_budget?.message_children_trns || DEFAULT_COPY.menu_4_budget.message_children_trns;
  const budget_infants      = sd?.menu_4_budget?.infants_trns          || DEFAULT_COPY.menu_4_budget.infants_trns;
  const budget_infants_sub  = sd?.menu_4_budget?.message_infants_trns  || DEFAULT_COPY.menu_4_budget.message_infants_trns;
  const budget_range_label  = sd?.menu_4_budget?.label_budget_range_trns || DEFAULT_COPY.menu_4_budget.label_budget_range_trns;
  const budget_min_label    = sd?.menu_4_budget?.min_price_trns || DEFAULT_COPY.menu_4_budget.min_price_trns;
  const budget_max_label    = sd?.menu_4_budget?.max_price_trns || DEFAULT_COPY.menu_4_budget.max_price_trns;

  // ── Cities: API cities → normalized shape ────────────────────────────────
  const cities = useMemo(() => {
    const apiCities = sd?.cities;
    if (!Array.isArray(apiCities)) return [];
    return apiCities
      .filter((c) => c?.id && c?.name)
      .map((c) => ({
        id: String(c.id),
        name: c.name,
        image: c.img,
      }));
  }, [sd?.cities]);

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
    priceMin: 2500,
    priceMax: 7500,
  });

  const updateFormData = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (stepError) setStepError(null);
  };

  const selectTimeOption = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      timeOption: value,
      checkIn: value === "exact" ? prev.checkIn : "",
      checkOut: value === "exact" ? prev.checkOut : "",
      monthSelect: value === "month" ? prev.monthSelect : "",
      vacationDays: value === "days" ? prev.vacationDays : "",
    }));
    if (stepError) setStepError(null);
  };

  const updateExactDate = (field: "checkIn" | "checkOut", value: string) => {
    setFormData((prev) => ({
      ...prev,
      timeOption: "exact",
      [field]: value,
      ...(field === "checkIn" && prev.checkOut && value && prev.checkOut <= value ? { checkOut: "" } : {}),
      monthSelect: "",
      vacationDays: "",
    }));
    if (stepError) setStepError(null);
  };

  const updateBudgetMin = (value: number) => {
    setFormData((prev) => ({ ...prev, priceMin: value, priceMax: Math.max(prev.priceMax, value) }));
  };

  const updateBudgetMax = (value: number) => {
    setFormData((prev) => ({ ...prev, priceMax: value, priceMin: Math.min(prev.priceMin, value) }));
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
      const start = parseLocalDate(formData.checkIn);
      const end = parseLocalDate(formData.checkOut);
      if (!start || !end) return 0;
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    }
    return formData.vacationDays ? parseInt(formData.vacationDays) : 0;
  };

  // Summary items — only populated when user has filled something
  const summaryItems: { label: string; value: string }[] = [];
  if (formData.cities.length > 0)
    summaryItems.push({ label: "Cities", value: formData.cities.map((id) => cities.find((c) => c.id === id)?.name ?? id).join(", ") });
  if (formData.checkIn || formData.checkOut)
    summaryItems.push({ label: "Dates", value: [formData.checkIn || "Check-in pending", formData.checkOut || "Check-out pending"].join(" → ") });
  if (formData.monthSelect)
    summaryItems.push({ label: "Month", value: formData.monthSelect });
  if (formData.vacationDays)
    summaryItems.push({ label: "Days", value: `${formData.vacationDays} days` });
  if (getDaysCount() > 0)
    summaryItems.push({ label: "Duration", value: `${getDaysCount()} days` });
  if (formData.fullName) summaryItems.push({ label: "Name", value: formData.fullName });
  if (formData.email) summaryItems.push({ label: "Email", value: formData.email });
  if (formData.phoneNumber) summaryItems.push({ label: "Phone", value: `+${formData.phoneCode} ${formData.phoneNumber}` });
  if (formData.nationality) summaryItems.push({ label: "Nationality", value: formData.nationality });
  if (formData.adults > 0 || formData.children > 0 || formData.infants > 0)
    summaryItems.push({ label: "Guests", value: `${formData.adults} Adults · ${formData.children} Children · ${formData.infants} Infants` });
  if (formData.priceMin && formData.priceMax)
    summaryItems.push({ label: "Budget", value: `$${formData.priceMin.toLocaleString()} – $${formData.priceMax.toLocaleString()}` });

  const today = useMemo(() => new Date(), []);
  const flatpickrDateOpts = useMemo(() => ({ dateFormat: "Y-m-d", minDate: today, disableMobile: true }), [today]);
  const flatpickrMonthOpts = useMemo(() => ({ dateFormat: "Y-m", minDate: new Date(today.getFullYear(), today.getMonth(), 1), disableMobile: true }), [today]);

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
                  {cities.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#d0d4e0] bg-[#f8f9fc] p-6 text-center text-sm font-semibold text-[#888]">
                      Destinations are loading from the travel API. Please refresh if they do not appear.
                    </div>
                  ) : (
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
                            {city.image ? (
                              <Image
                                src={city.image}
                                alt={city.name}
                                fill
                                unoptimized={city.image.startsWith("http")}
                                className={`object-cover transition-transform duration-400 ${selected ? "scale-105" : "group-hover:scale-105"}`}
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-[#272262] to-[#e3b75e]" />
                            )}
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
                  )}
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
                  <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-3">
                    {[
                      { value: "exact", label: time_exact, icon: "📅" },
                      { value: "month", label: time_approx, icon: "🗓️" },
                      { value: "days",  label: time_notSure, icon: "⏳" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => selectTimeOption(opt.value)}
                        className={`p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 text-center focus:outline-none ${formData.timeOption === opt.value ? "border-[#272262] bg-[#272262]/5 shadow-md" : "border-[#e8eaf0] hover:border-[#272262]/40"}`}
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
                        onChange={(v) => updateExactDate("checkIn", v)}
                        options={flatpickrDateOpts}
                        icon={<Calendar size={18} />}
                        onBlur={() => markTouched("checkIn")}
                        error={fieldError("checkIn")}
                      />
                      <FlatpickrInput
                        key={`checkout-${formData.checkIn || "today"}`}
                        label={time_checkout}
                        value={formData.checkOut}
                        onChange={(v) => updateExactDate("checkOut", v)}
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
                  <div className="grid md:grid-cols-2 gap-3">
                    <FloatingInput
                    label={info_name_label}
                    value={formData.fullName}
                    placeholder={info_name_placeholder}
                    onChange={(v) => updateFormData("fullName", v)}
                    icon={<User size={18} />}
                    onBlur={() => markTouched("fullName")}
                    error={fieldError("fullName")}
                  />
                  <FloatingInput
                    label={info_email_label}
                    type="email"
                    value={formData.email}
                    placeholder={info_email_placeholder}
                    onChange={(v) => updateFormData("email", v)}
                    icon={<Globe size={18} />}
                    autoComplete="email"
                    onBlur={() => markTouched("email")}
                    error={fieldError("email")}
                  />
                  </div>
                  {/* Phone row: country code + number */}
                  <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-3">
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
                      placeholder={info_phone_placeholder}
                      onChange={(v) => updateFormData("phoneNumber", v)}
                      onBlur={() => markTouched("phoneNumber")}
                      error={fieldError("phoneNumber")}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
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
                    label={info_hotel_label}
                    value={formData.hotel}
                    onChange={(v) => updateFormData("hotel", v)}
                    icon={<Hotel size={18} />}
                    onBlur={() => markTouched("hotel")}
                    error={fieldError("hotel")}
                  >
                    <option value="" />
                    {[3, 4, 5].map((rating) => (
                        <option key={rating} value={String(rating)}>{rating} Stars</option>
                      ))}
                  </FloatingSelect>
                  </div>
                  <FloatingTextarea
                    label={info_msg_label}
                    value={formData.additionalInfo}
                    placeholder={info_msg_placeholder}
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
                  <div className="grid md:grid-cols-3 gap-3">
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
                  <div className="space-y-3 pt-2">
                    <p className="text-sm font-bold text-[#272262] flex items-center gap-2">
                      <DollarSign size={16} className="text-[#e3b75e]" />
                      {budget_range_label}
                    </p>
                    <div className="rounded-2xl border-[1.5px] border-[#e8eaf0] bg-[#f8f9fc] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold mb-3">
                        <span className="text-[#272262]">{budget_min_label}: ${formData.priceMin.toLocaleString()}</span>
                        <span className="text-[#e3b75e]">{budget_max_label}: ${formData.priceMax.toLocaleString()}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 items-center">
                        <input
                          aria-label={budget_min_label}
                          type="range"
                          min="0"
                          max="15000"
                          step="100"
                          value={formData.priceMin}
                          onChange={(e) => updateBudgetMin(parseInt(e.target.value))}
                          className="w-full accent-[#272262] h-2 cursor-pointer"
                        />
                        <input
                          aria-label={budget_max_label}
                          type="range"
                          min="0"
                          max="15000"
                          step="100"
                          value={formData.priceMax}
                          onChange={(e) => updateBudgetMax(parseInt(e.target.value))}
                          className="w-full accent-[#e3b75e] h-2 cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#aaa] mt-2 font-medium">
                        <span>$0</span>
                        <span className="text-[#272262] font-bold">${formData.priceMin.toLocaleString()} – ${formData.priceMax.toLocaleString()}</span>
                        <span>$15,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 5: Confirm ── */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#272262]">
                      {formData.fullName ? `Almost there, ${formData.fullName.split(" ")[0]}! ✈️` : "Review & Submit"}
                    </h3>
                    <p className="text-[#888] text-sm mt-1">Welcome to Egypt Tour Gate. We&apos;ll craft your trip and contact you shortly.</p>
                  </div>
                  <div className="bg-[#f8f9fc] rounded-2xl border-[1.5px] border-[#e8eaf0] px-5 py-6 text-center">
                    <p className="text-lg font-bold text-[#272262]">Welcome{formData.fullName ? `, ${formData.fullName}` : ""}! 👋</p>
                    <p className="text-sm text-[#888] mt-2">Your request is almost ready. Click submit and our travel specialist will contact you.</p>
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
              <Image
                src="/assets/images/tours/Pyramids-in-Egypt-webp.webp"
                alt="Egypt"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#272262]/80 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <h3 className="text-lg font-bold text-white">Trip Summary</h3>
                <p className="text-xs text-white/70">{summaryItems.length === 0 ? "Fill the form to see your summary" : "Live summary updates instantly"}</p>
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

      <style jsx global>{`
        /* Flatpickr calendar theme */
        .flatpickr-calendar {
          z-index: 9999 !important;
          width: min(320px, calc(100vw - 24px)) !important;
          max-width: calc(100vw - 24px) !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12) !important;
          border: 1.5px solid #e8eaf0 !important;
          font-family: inherit !important;
        }
        .flatpickr-months .flatpickr-month {
          background: #272262 !important;
          border-radius: 14px 14px 0 0 !important;
          color: #fff !important;
        }
        .flatpickr-current-month .flatpickr-monthDropdown-months,
        .flatpickr-current-month input.cur-year {
          color: #fff !important;
          font-weight: 700;
        }
        .flatpickr-weekdays { background: #f8f9fc !important; }
        .flatpickr-weekday { color: #272262 !important; font-weight: 700; font-size: 11px; }
        .flatpickr-day.selected, .flatpickr-day.startRange, .flatpickr-day.endRange,
        .flatpickr-day.selected:hover, .flatpickr-day.startRange:hover, .flatpickr-day.endRange:hover {
          background: #e3b75e !important;
          border-color: #e3b75e !important;
          color: #272262 !important;
          font-weight: 700;
        }
        .flatpickr-day:hover { background: #fffbf0 !important; border-color: #e3b75e !important; }
        .flatpickr-day.today { border-color: #272262 !important; }
        .flatpickr-day.today:hover { background: #272262 !important; color: #fff !important; }
        .numInputWrapper:hover { background: transparent !important; }
        .flatpickr-prev-month svg, .flatpickr-next-month svg { fill: #fff !important; }
        .flatpickr-prev-month:hover svg, .flatpickr-next-month:hover svg { fill: #e3b75e !important; }
        .flatpickr-days, .dayContainer { width: 100% !important; min-width: 100% !important; max-width: 100% !important; }
        .flatpickr-day { max-width: none !important; }
        .flatpickr-monthSelect-months { display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; padding: 10px !important; }
        .flatpickr-monthSelect-month { width: auto !important; margin: 0 !important; border-radius: 10px !important; }
      `}</style>
    </div>
  );
}

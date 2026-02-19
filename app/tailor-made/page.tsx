"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Calendar, MapPin, User, Phone, Globe, Hotel, MessageSquare, ChevronRight, ChevronLeft, DollarSign, Users, Baby, UserCheck } from "lucide-react";
import {
  tailorMadeSchema,
  type TailorMadeFormData,
} from "@/lib/validations/tailor-made.schema";

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
}

function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  required,
  icon,
  autoComplete,
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
        className={`peer w-full border-[1.5px] border-solid border-[#9e9e9e] rounded-2xl bg-transparent py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#272262] valid:border-[#272262] outline-none ${icon ? "pl-11 pr-4" : "px-4"}`}
      />
      <label
        className={`absolute text-[#aaa] pointer-events-none translate-y-4 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
          peer-focus:-translate-y-1/2 peer-focus:scale-[0.80] peer-focus:bg-[#272262] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[#e3b75e] peer-focus:rounded-sm
          peer-valid:-translate-y-1/2 peer-valid:scale-[0.80] peer-valid:bg-[#212121] peer-valid:px-[0.2em] peer-valid:py-0 peer-valid:text-[#2196f3] peer-valid:rounded-sm
          ${icon ? "left-11" : "left-4"}`}
      >
        {label}
      </label>
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
}

function FloatingSelect({ label, value, onChange, children, icon }: FloatingSelectProps) {
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
        className={`peer w-full border-[1.5px] border-solid border-[#9e9e9e] rounded-2xl bg-transparent py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#272262] outline-none appearance-none cursor-pointer ${icon ? "pl-11 pr-4" : "px-4"} ${value ? "border-[#272262]" : ""}`}
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
}

function FlatpickrInput({ label, value, onChange, options = {}, icon }: FlatpickrInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    let fp: { destroy: () => void; setDate: (d: string, b: boolean) => void } | null = null;

    import("flatpickr").then((mod) => {
      const flatpickr = mod.default;
      fp = flatpickr(inputRef.current!, {
        ...options,
        onChange: (selectedDates: Date[]) => {
          if (selectedDates[0]) {
            const fmt = (options.dateFormat as string) || "Y-m-d";
            if (fmt === "Y-m") {
              onChange(selectedDates[0].toISOString().slice(0, 7));
            } else {
              onChange(selectedDates[0].toISOString().split("T")[0]);
            }
          }
        },
      }) as unknown as { destroy: () => void; setDate: (d: string, b: boolean) => void };
      fpRef.current = fp;
      if (value && fp) fp.setDate(value, false);
    });

    return () => {
      fpRef.current?.destroy();
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
        placeholder=" "
        className={`peer w-full border-[1.5px] border-solid rounded-2xl bg-transparent py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none outline-none cursor-pointer ${icon ? "pl-11 pr-4" : "px-4"} ${isValid ? "border-[#272262]" : "border-[#9e9e9e] focus:border-[#272262]"}`}
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
    </div>
  );
}

// ─── Floating Label Textarea ────────────────────────────────────────────────
interface FloatingTextareaProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}

function FloatingTextarea({ label, value, onChange, icon }: FloatingTextareaProps) {
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
        rows={4}
        className={`peer w-full border-[1.5px] border-solid border-[#9e9e9e] rounded-2xl bg-transparent py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#272262] valid:border-[#272262] outline-none resize-none ${icon ? "pl-11 pr-4" : "px-4"} ${value ? "border-[#272262]" : ""}`}
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
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function TailorMadePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

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

  const cities = [
    { id: "cairo", name: "Cairo", image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400&h=200&fit=crop" },
    { id: "giza", name: "Giza", image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400&h=200&fit=crop" },
    { id: "luxor", name: "Luxor", image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=400&h=200&fit=crop" },
    { id: "aswan", name: "Aswan", image: "https://images.unsplash.com/photo-1539650116455-2514c1a88b5f?w=400&h=200&fit=crop" },
    { id: "alexandria", name: "Alexandria", image: "https://images.unsplash.com/photo-1571189434050-646ec5fe65f7?w=400&h=200&fit=crop" },
    { id: "dahab", name: "Dahab", image: "https://images.unsplash.com/photo-1518182170546-0766ce6fec56?w=400&h=200&fit=crop" },
    { id: "sharm", name: "Sharm El-Sheikh", image: "https://images.unsplash.com/photo-1573331518732-72155500f194?w=400&h=200&fit=crop" },
    { id: "taba", name: "Taba", image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=200&fit=crop" },
  ];

  const phoneCodes = [
    { code: "20", country: "Egypt (+20)" },
    { code: "1", country: "USA (+1)" },
    { code: "44", country: "UK (+44)" },
    { code: "971", country: "UAE (+971)" },
    { code: "966", country: "Saudi Arabia (+966)" },
  ];

  const nationalities = [
    "Egyptian", "American", "British", "Canadian", "Australian",
    "German", "French", "Italian", "Spanish", "Chinese", "Japanese",
  ];

  const steps = [
    { num: 1, label: "Cities" },
    { num: 2, label: "Time" },
    { num: 3, label: "Info" },
    { num: 4, label: "Budget" },
    { num: 5, label: "Confirm" },
  ];

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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await fetch("/api/tailor-made", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData.data),
      });
      if (res.ok) {
        toast.success("Trip request submitted successfully! We'll contact you soon. ✈️");
        router.push("/thank-you");
      } else {
        toast.error("Something went wrong. Please try again.");
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

  // Summary items — only populated when user has filled something
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
  if (formData.phoneNumber) summaryItems.push({ label: "Phone", value: `+${formData.phoneCode} ${formData.phoneNumber}` });
  if (formData.nationality) summaryItems.push({ label: "Nationality", value: formData.nationality });
  if (formData.adults > 0 || formData.children > 0 || formData.infants > 0)
    summaryItems.push({ label: "Guests", value: `${formData.adults} Adults · ${formData.children} Children · ${formData.infants} Infants` });
  if (formData.priceMin && formData.priceMax)
    summaryItems.push({ label: "Budget", value: `$${formData.priceMin.toLocaleString()} – $${formData.priceMax.toLocaleString()}` });

  const flatpickrDateOpts = { dateFormat: "Y-m-d", minDate: "today" as const };
  const flatpickrMonthOpts = { plugins: [{ onReady: () => {}, onValueUpdate: () => {}, onDayCreate: () => {} }], dateFormat: "Y-m", minDate: "today" as const };

  return (
    <div className="relative min-h-screen bg-[#f4f6fb] py-10 sm:py-14">
      {/* Soft gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #e3b75e, transparent)" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #272262, transparent)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#e3b75e] mb-2">Custom Experience</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#272262] mb-3 leading-tight">
            Egypt Tailor Made Packages
          </h1>
          <p className="text-[#666] text-base sm:text-lg max-w-xl mx-auto">
            Design your perfect Egypt adventure in just a few steps
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
                      <span className={`hidden sm:block text-[11px] font-semibold transition-colors ${active ? "text-[#272262]" : done ? "text-[#e3b75e]" : "text-[#bbb]"}`}>
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
                    <h3 className="text-xl sm:text-2xl font-bold text-[#272262]">Select your destinations</h3>
                    <p className="text-[#888] text-sm mt-1">Choose one or more cities across Egypt</p>
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
                          {/* City image — fixed compact height */}
                          <div className="relative h-24 w-full overflow-hidden">
                            <Image
                              src={city.image}
                              alt={city.name}
                              fill
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
                    <h3 className="text-xl sm:text-2xl font-bold text-[#272262]">When do you want to travel?</h3>
                    <p className="text-[#888] text-sm mt-1">Choose how you&apos;d like to specify your travel dates</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "exact", label: "Exact Dates", icon: "📅" },
                      { value: "month", label: "Approx Month", icon: "🗓️" },
                      { value: "days", label: "Not Sure Yet", icon: "⏳" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateFormData("timeOption", opt.value)}
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
                        label="Check-in Date"
                        value={formData.checkIn}
                        onChange={(v) => updateFormData("checkIn", v)}
                        options={flatpickrDateOpts}
                        icon={<Calendar size={16} />}
                      />
                      <FlatpickrInput
                        label="Check-out Date"
                        value={formData.checkOut}
                        onChange={(v) => updateFormData("checkOut", v)}
                        options={{ ...flatpickrDateOpts, minDate: formData.checkIn || "today" }}
                        icon={<Calendar size={16} />}
                      />
                    </div>
                  )}

                  {formData.timeOption === "month" && (
                    <FlatpickrInput
                      label="Select Month"
                      value={formData.monthSelect}
                      onChange={(v) => updateFormData("monthSelect", v)}
                      options={{ dateFormat: "Y-m", minDate: "today" as const, plugins: [] }}
                      icon={<Calendar size={16} />}
                    />
                  )}

                  {formData.timeOption === "days" && (
                    <FloatingInput
                      label="Number of Vacation Days"
                      type="number"
                      value={formData.vacationDays}
                      onChange={(v) => updateFormData("vacationDays", v)}
                      icon={<Calendar size={16} />}
                    />
                  )}
                </div>
              )}

              {/* ── Step 3: Personal Info ── */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#272262]">Your Personal Information</h3>
                    <p className="text-[#888] text-sm mt-1">Tell us about yourself so we can personalize your trip</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FloatingInput
                      label="Full Name"
                      value={formData.fullName}
                      onChange={(v) => updateFormData("fullName", v)}
                      required
                      autoComplete="name"
                      icon={<User size={16} />}
                    />
                    <FloatingInput
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(v) => updateFormData("email", v)}
                      required
                      autoComplete="email"
                      icon={<MessageSquare size={16} />}
                    />
                    <FloatingSelect
                      label="Phone Code"
                      value={formData.phoneCode}
                      onChange={(v) => updateFormData("phoneCode", v)}
                      icon={<Phone size={16} />}
                    >
                      <option value="">Select country code</option>
                      {phoneCodes.map((pc) => (
                        <option key={pc.code} value={pc.code}>{pc.country}</option>
                      ))}
                    </FloatingSelect>
                    <FloatingInput
                      label="Phone Number"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(v) => updateFormData("phoneNumber", v)}
                      required
                      autoComplete="tel"
                      icon={<Phone size={16} />}
                    />
                    <FloatingSelect
                      label="Nationality"
                      value={formData.nationality}
                      onChange={(v) => updateFormData("nationality", v)}
                      icon={<Globe size={16} />}
                    >
                      <option value="">Select nationality</option>
                      {nationalities.map((n) => <option key={n} value={n}>{n}</option>)}
                    </FloatingSelect>
                    <FloatingInput
                      label="Hotel Preference (Optional)"
                      value={formData.hotel}
                      onChange={(v) => updateFormData("hotel", v)}
                      icon={<Hotel size={16} />}
                    />
                  </div>
                  <FloatingTextarea
                    label="Additional Notes or Requests"
                    value={formData.additionalInfo}
                    onChange={(v) => updateFormData("additionalInfo", v)}
                    icon={<MessageSquare size={16} />}
                  />
                </div>
              )}

              {/* ── Step 4: Budget & Guests ── */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#272262]">Customize Your Trip</h3>
                    <p className="text-[#888] text-sm mt-1">Set your group size and budget range</p>
                  </div>

                  {/* Guest counters */}
                  <div className="space-y-3">
                    {[
                      { key: "adults", label: "Adults", subtitle: "18+ years", icon: <UserCheck size={18} className="text-[#272262]" />, min: 1 },
                      { key: "children", label: "Children", subtitle: "2–17 years", icon: <Users size={18} className="text-[#272262]" />, min: 0 },
                      { key: "infants", label: "Infants", subtitle: "Under 2 years", icon: <Baby size={18} className="text-[#272262]" />, min: 0 },
                    ].map(({ key, label, subtitle, icon, min }) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-[#f8f9fc] rounded-2xl border-[1.5px] border-[#e8eaf0]">
                        <div className="flex items-center gap-3">
                          {icon}
                          <div>
                            <p className="font-bold text-sm text-[#272262]">{label}</p>
                            <p className="text-xs text-[#aaa]">{subtitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateFormData(key as "adults" | "children" | "infants", Math.max(min, (formData[key as "adults" | "children" | "infants"] as number) - 1))}
                            className="w-9 h-9 rounded-full bg-white border-2 border-[#e8eaf0] hover:border-[#e3b75e] hover:text-[#e3b75e] transition-all font-bold text-[#272262] text-lg leading-none flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-bold text-base text-[#272262]">
                            {formData[key as "adults" | "children" | "infants"] as number}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateFormData(key as "adults" | "children" | "infants", Math.min(20, (formData[key as "adults" | "children" | "infants"] as number) + 1))}
                            className="w-9 h-9 rounded-full bg-white border-2 border-[#e8eaf0] hover:border-[#e3b75e] hover:text-[#e3b75e] transition-all font-bold text-[#272262] text-lg leading-none flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Budget range */}
                  <div className="p-5 bg-[#f8f9fc] rounded-2xl border-[1.5px] border-[#e8eaf0] space-y-4">
                    <div className="flex items-center gap-2">
                      <DollarSign size={18} className="text-[#272262]" />
                      <h4 className="font-bold text-[#272262]">Budget Range (USD per person)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput
                        label="Minimum ($)"
                        type="number"
                        value={String(formData.priceMin)}
                        onChange={(v) => updateFormData("priceMin", parseInt(v) || 0)}
                      />
                      <FloatingInput
                        label="Maximum ($)"
                        type="number"
                        value={String(formData.priceMax)}
                        onChange={(v) => updateFormData("priceMax", parseInt(v) || 0)}
                      />
                    </div>
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="15000"
                        step="100"
                        value={formData.priceMax}
                        onChange={(e) => updateFormData("priceMax", parseInt(e.target.value))}
                        className="w-full accent-[#e3b75e] h-2 cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-[#aaa] mt-1 font-medium">
                        <span>$0</span>
                        <span className="text-[#e3b75e] font-bold">${formData.priceMin.toLocaleString()} – ${formData.priceMax.toLocaleString()}</span>
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
                    <p className="text-[#888] text-sm mt-1">Please review your trip details before submitting</p>
                  </div>
                  <div className="bg-[#f8f9fc] rounded-2xl border-[1.5px] border-[#e8eaf0] divide-y divide-[#e8eaf0] overflow-hidden">
                    {summaryItems.map((item) => (
                      <div key={item.label} className="flex justify-between items-start gap-4 px-5 py-3">
                        <span className="text-xs font-bold text-[#aaa] uppercase tracking-wide whitespace-nowrap">{item.label}</span>
                        <span className="text-sm font-semibold text-[#272262] text-right">{item.value}</span>
                      </div>
                    ))}
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
                src="https://images.unsplash.com/photo-1539768942893-daf53e448371?w=600&h=300&fit=crop"
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

      <style jsx global>{`
        /* Flatpickr calendar theme */
        .flatpickr-calendar {
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
      `}</style>
    </div>
  );
}

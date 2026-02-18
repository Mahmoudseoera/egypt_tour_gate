"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Check, Calendar, Plus } from "lucide-react";
import {
  tailorMadeSchema,
  type TailorMadeFormData,
} from "@/lib/validations/tailor-made.schema";

export default function TailorMadePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
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
    { 
      id: "cairo", 
      name: "Cairo",
      image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400&h=300&fit=crop"
    },
    { 
      id: "giza", 
      name: "Giza",
      image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400&h=300&fit=crop"
    },
    { 
      id: "luxor", 
      name: "Luxor",
      image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=400&h=300&fit=crop"
    },
    { 
      id: "aswan", 
      name: "Aswan",
      image: "https://images.unsplash.com/photo-1539650116455-2514c1a88b5f?w=400&h=300&fit=crop"
    },
    { 
      id: "alexandria", 
      name: "Alexandria",
      image: "https://images.unsplash.com/photo-1571189434050-646ec5fe65f7?w=400&h=300&fit=crop"
    },
    { 
      id: "dahab", 
      name: "Dahab",
      image: "https://images.unsplash.com/photo-1518182170546-0766ce6fec56?w=400&h=300&fit=crop"
    },
    { 
      id: "sharm", 
      name: "Sharm El-Sheikh",
      image: "https://images.unsplash.com/photo-1573331518732-72155500f194?w=400&h=300&fit=crop"
    },
    { 
      id: "taba", 
      name: "Taba",
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=300&fit=crop"
    },
  ];

  const phoneCodes = [
    { code: "20", country: "Egypt" },
    { code: "1", country: "USA" },
    { code: "44", country: "UK" },
    { code: "971", country: "UAE" },
    { code: "966", country: "Saudi Arabia" },
  ];

  const nationalities = [
    "Egyptian", "American", "British", "Canadian", "Australian",
    "German", "French", "Italian", "Spanish", "Chinese", "Japanese"
  ];

  const updateFormData = <K extends keyof TailorMadeFormData>(
    field: K,
    value: TailorMadeFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (stepError) setStepError(null);
  };

  const toggleCity = (cityId: string) => {
    setFormData(prev => ({
      ...prev,
      cities: prev.cities.includes(cityId)
        ? prev.cities.filter(c => c !== cityId)
        : [...prev.cities, cityId]
    }));
    if (stepError) setStepError(null);
  };

  const isStepValid = () => {
    const parsed = tailorMadeSchema.safeParse(formData);
    if (parsed.success) {
      return true;
    }

    switch (currentStep) {
      case 1:
        return !parsed.error.issues.some((issue) => issue.path[0] === "cities");
      case 2:
        return !parsed.error.issues.some((issue) =>
          ["checkIn", "checkOut", "monthSelect", "vacationDays", "timeOption"].includes(
            String(issue.path[0])
          )
        );
      case 3:
        return !parsed.error.issues.some((issue) =>
          ["fullName", "email", "phoneCode", "phoneNumber", "nationality", "hotel"].includes(
            String(issue.path[0])
          )
        );
      case 4:
        return !parsed.error.issues.some((issue) => ["priceMin", "priceMax"].includes(String(issue.path[0])));
      default:
        return false;
    }
  };

  const getCurrentStepError = () => {
    const parsed = tailorMadeSchema.safeParse(formData);
    if (parsed.success) {
      return null;
    }
    const issue = parsed.error.issues.find((currentIssue) => {
      const field = String(currentIssue.path[0]);

      if (currentStep === 1) {
        return field === "cities";
      }

      if (currentStep === 2) {
        return ["checkIn", "checkOut", "monthSelect", "vacationDays", "timeOption"].includes(field);
      }

      if (currentStep === 3) {
        return ["fullName", "email", "phoneCode", "phoneNumber", "nationality", "hotel"].includes(field);
      }

      if (currentStep === 4) {
        return ["priceMin", "priceMax"].includes(field);
      }

      return false;
    });

    return issue?.message ?? null;
  };

  const nextStep = () => {
    if (isStepValid() && currentStep < 5) {
      setStepError(null);
      setCurrentStep(currentStep + 1);
      return;
    }
    setStepError(getCurrentStepError());
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validatedData = tailorMadeSchema.safeParse(formData);
    if (!validatedData.success) {
      setMessage(validatedData.error.issues[0]?.message ?? "Please review and fix the form fields.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const res = await fetch("/api/tailor-made", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData.data),
      });

      if (res.ok) {
        setMessage("Trip request submitted successfully! ✅");
        router.push("/thank-you");
      } else {
        setMessage("Something went wrong. Please try again. ❌");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again. ❌");
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

  // FIX: Removed `wrap: true` from options — it requires a specific DOM wrapper
  // structure that react-flatpickr doesn't support out of the box, causing the
  // "Cannot read properties of null (reading 'className')" error.
  const flatpickrOptions = {
    dateFormat: "Y-m-d",
    minDate: "today" as const,
  };

  const monthFlatpickrOptions = {
    dateFormat: "Y-m",
    minDate: "today" as const,
  };

  return (
    <div className="relative min-h-screen bg-[var(--section-bg-light)] py-12">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--main-200)] rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--second-200)] rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--second-500)] mb-4">
            Egypt Tailor Made Packages
          </h1>
          <p className="text-[var(--grey-600)] text-lg max-w-2xl mx-auto">
            Plan your perfect Egypt adventure with our customized tour packages
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 bg-[var(--white-color)] rounded-3xl shadow-xl border border-[var(--border-light)] p-8">
            {/* Step Navigation */}
            <div className="flex justify-between mb-10 overflow-x-auto pb-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex flex-col items-center min-w-[80px] ${
                    step <= currentStep ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      step <= currentStep
                        ? "bg-[var(--main-400)] text-[var(--white-color)] shadow-lg"
                        : "bg-[var(--grey-200)] text-[var(--grey-400)]"
                    }`}
                  >
                    {step < currentStep ? <Check size={20} /> : step}
                  </div>
                  <span className="text-xs text-center font-semibold text-[var(--second-500)]">
                    {step === 1 && "Select City"}
                    {step === 2 && "Select Time"}
                    {step === 3 && "Personal Info"}
                    {step === 4 && "Price"}
                    {step === 5 && "Confirm"}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Select Cities */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[var(--second-500)]">
                  Select the cities you want to visit
                </h3>
                <p className="text-[var(--grey-600)]">
                  Choose from our amazing destinations across Egypt
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => toggleCity(city.id)}
                      className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                        formData.cities.includes(city.id)
                          ? "border-[var(--main-400)] shadow-lg"
                          : "border-[var(--border-light)] hover:border-[var(--main-300)]"
                      }`}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={city.image}
                          alt={city.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 transition-opacity duration-300 ${
                          formData.cities.includes(city.id)
                            ? "bg-[var(--main-400)]/30"
                            : "bg-black/0 group-hover:bg-black/20"
                        }`} />
                        {formData.cities.includes(city.id) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--main-400)] rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-[var(--white-color)]">
                        <h5 className="font-bold text-sm text-[var(--second-500)] text-center">
                          {city.name}
                        </h5>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Time */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[var(--second-500)]">
                  When do you want to travel?
                </h3>
                <div className="flex gap-4 mb-6">
                  {["exact", "month", "days"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateFormData("timeOption", option)}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.timeOption === option
                          ? "border-[var(--main-400)] bg-[var(--main-50)] shadow-md"
                          : "border-[var(--border-light)] hover:border-[var(--main-300)]"
                      }`}
                    >
                      <Calendar className="w-6 h-6 mx-auto mb-2 text-[var(--second-500)]" />
                      <span className="text-sm font-semibold text-[var(--second-500)]">
                        {option === "exact" && "Exact Date"}
                        {option === "month" && "Approx Month"}
                        {option === "days" && "Not Sure"}
                      </span>
                    </button>
                  ))}
                </div>

                {formData.timeOption === "exact" && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[var(--second-500)]">
                        Check In
                      </label>
                      {/* FIX: Removed wrap:true, using className prop directly on Flatpickr */}
                      <Flatpickr
                        value={formData.checkIn}
                        options={flatpickrOptions}
                        onChange={(dates: Date[]) => {
                          if (dates[0]) {
                            updateFormData("checkIn", dates[0].toISOString().split("T")[0]);
                          }
                        }}
                        className="input-field"
                        placeholder="Select check-in date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[var(--second-500)]">
                        Check Out
                      </label>
                      <Flatpickr
                        value={formData.checkOut}
                        options={flatpickrOptions}
                        onChange={(dates: Date[]) => {
                          if (dates[0]) {
                            updateFormData("checkOut", dates[0].toISOString().split("T")[0]);
                          }
                        }}
                        className="input-field"
                        placeholder="Select check-out date"
                      />
                    </div>
                  </div>
                )}

                {formData.timeOption === "month" && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--second-500)]">
                      Select Month
                    </label>
                    <Flatpickr
                      value={formData.monthSelect}
                      options={monthFlatpickrOptions}
                      onChange={(dates: Date[]) => {
                        if (dates[0]) {
                          updateFormData("monthSelect", dates[0].toISOString().slice(0, 7));
                        }
                      }}
                      className="input-field"
                      placeholder="Select month"
                    />
                  </div>
                )}

                {formData.timeOption === "days" && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--second-500)]">
                      Number of Vacation Days
                    </label>
                    <input
                      type="number"
                      value={formData.vacationDays}
                      onChange={(e) => updateFormData("vacationDays", e.target.value)}
                      className="input-field"
                      min="1"
                      max="30"
                      placeholder="Enter number of days"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Personal Info */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[var(--second-500)]">
                  Your Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--second-500)]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                      className="input-field"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--second-500)]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="input-field"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--second-500)]">
                      Phone Code
                    </label>
                    <select
                      value={formData.phoneCode}
                      onChange={(e) => updateFormData("phoneCode", e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select</option>
                      {phoneCodes.map((pc) => (
                        <option key={pc.code} value={pc.code}>
                          {pc.country} (+{pc.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--second-500)]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                      className="input-field"
                      placeholder="123456789"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--second-500)]">
                      Nationality
                    </label>
                    <select
                      value={formData.nationality}
                      onChange={(e) => updateFormData("nationality", e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select</option>
                      {nationalities.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--second-500)]">
                      Hotel Preference
                    </label>
                    <input
                      type="text"
                      value={formData.hotel}
                      onChange={(e) => updateFormData("hotel", e.target.value)}
                      className="input-field"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--second-500)]">
                    Additional Info
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                    className="input-field h-28 resize-none"
                    placeholder="Any special requests or preferences..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Price & Guests */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[var(--second-500)]">
                  Customize Your Trip
                </h3>
                <div className="space-y-4">
                  {["adults", "children", "infants"].map((type) => (
                    <div key={type} className="flex items-center justify-between p-4 bg-[var(--grey-100)] rounded-xl border border-[var(--border-light)]">
                      <span className="font-semibold text-[var(--second-500)] capitalize">
                        {type}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateFormData(type as any, Math.max(type === "adults" ? 1 : 0, formData[type as keyof typeof formData] as number - 1))}
                          className="w-10 h-10 rounded-full bg-[var(--white-color)] border-2 border-[var(--border-medium)] hover:border-[var(--main-400)] transition-all font-bold text-[var(--second-500)]"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-lg text-[var(--second-500)]">
                          {formData[type as keyof typeof formData] as number}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateFormData(type as any, Math.min(10, formData[type as keyof typeof formData] as number + 1))}
                          className="w-10 h-10 rounded-full bg-[var(--white-color)] border-2 border-[var(--border-medium)] hover:border-[var(--main-400)] transition-all font-bold text-[var(--second-500)]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-6 bg-[var(--grey-100)] rounded-xl border border-[var(--border-light)]">
                  <h4 className="font-bold mb-4 text-[var(--second-500)]">Price Range (USD)</h4>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-[var(--grey-600)] mb-2 block">Min</label>
                      <input
                        type="number"
                        value={formData.priceMin}
                        onChange={(e) => updateFormData("priceMin", parseInt(e.target.value) || 0)}
                        className="input-field"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-[var(--grey-600)] mb-2 block">Max</label>
                      <input
                        type="number"
                        value={formData.priceMax}
                        onChange={(e) => updateFormData("priceMax", parseInt(e.target.value) || 0)}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={formData.priceMin}
                    onChange={(e) => updateFormData("priceMin", parseInt(e.target.value))}
                    className="w-full accent-[var(--main-400)]"
                  />
                  <div className="flex justify-between mt-2 text-sm font-semibold text-[var(--grey-600)]">
                    <span>$0</span>
                    <span className="text-[var(--main-600)]">${formData.priceMin}</span>
                    <span>$10,000</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Confirm */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[var(--second-500)]">
                  Confirm Your Details
                </h3>
                <p className="text-[var(--grey-600)]">
                  Thank you, {formData.fullName}! Please review your trip details before submitting.
                </p>
                <form onSubmit={handleSubmit}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--main-400)] hover:bg-[var(--main-500)] text-[var(--white-color)] font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? "Submitting..." : "Submit Trip Request"}
                  </button>
                  {message && (
                    <p className="text-center mt-4 text-sm font-semibold text-[var(--second-500)]">
                      {message}
                    </p>
                  )}
                </form>
              </div>
            )}

            {stepError && (
              <p className="mt-6 text-sm font-semibold text-[var(--danger-color)] bg-[var(--danger-color)]/10 p-3 rounded-lg">
                {stepError}
              </p>
            )}

            {/* Navigation Buttons */}
            {currentStep < 5 && (
              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border-2 border-[var(--border-medium)] text-[var(--second-500)] font-bold py-3 rounded-xl hover:bg-[var(--grey-100)] transition-all duration-300"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="flex-1 bg-[var(--main-400)] hover:bg-[var(--main-500)] text-[var(--white-color)] font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="bg-[var(--white-color)] rounded-3xl shadow-xl border border-[var(--border-light)] p-6 h-fit sticky top-4">
            <div className="mb-6">
              <Image
                src="https://images.unsplash.com/photo-1539768942893-daf53e448371?w=400"
                alt="Egypt"
                width={400}
                height={300}
                className="w-full h-40 object-cover rounded-2xl mb-4"
              />
              <h3 className="text-xl font-bold text-[var(--second-500)]">Trip Summary</h3>
            </div>

            <div className="space-y-3 text-sm">
              {formData.cities.length > 0 && (
                <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                  <span className="text-[var(--grey-600)] font-medium">Cities:</span>
                  <span className="font-bold text-[var(--second-500)] text-right">
                    {formData.cities.map(id => cities.find(c => c.id === id)?.name).join(", ")}
                  </span>
                </div>
              )}

              {(formData.checkIn || formData.monthSelect) && (
                <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                  <span className="text-[var(--grey-600)] font-medium">Dates:</span>
                  <span className="font-bold text-[var(--second-500)]">
                    {formData.checkIn ? `${formData.checkIn} to ${formData.checkOut}` : formData.monthSelect}
                  </span>
                </div>
              )}

              {getDaysCount() > 0 && (
                <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                  <span className="text-[var(--grey-600)] font-medium">Days:</span>
                  <span className="font-bold text-[var(--main-600)]">{getDaysCount()} days</span>
                </div>
              )}

              {formData.fullName && (
                <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                  <span className="text-[var(--grey-600)] font-medium">Name:</span>
                  <span className="font-bold text-[var(--second-500)]">{formData.fullName}</span>
                </div>
              )}

              {formData.email && (
                <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                  <span className="text-[var(--grey-600)] font-medium">Email:</span>
                  <span className="font-bold text-[var(--second-500)] text-xs">{formData.email}</span>
                </div>
              )}

              {formData.phoneNumber && (
                <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                  <span className="text-[var(--grey-600)] font-medium">Phone:</span>
                  <span className="font-bold text-[var(--second-500)]">+{formData.phoneCode} {formData.phoneNumber}</span>
                </div>
              )}

              {(formData.adults > 0 || formData.children > 0 || formData.infants > 0) && (
                <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                  <span className="text-[var(--grey-600)] font-medium">Guests:</span>
                  <span className="font-bold text-[var(--second-500)]">
                    {formData.adults}A {formData.children}C {formData.infants}I
                  </span>
                </div>
              )}

              {formData.priceMin && formData.priceMax && (
                <div className="flex justify-between py-2">
                  <span className="text-[var(--grey-600)] font-medium">Budget:</span>
                  <span className="font-bold text-[var(--main-600)]">${formData.priceMin} - ${formData.priceMax}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input-field {
          @apply w-full rounded-xl border-2 border-[var(--border-medium)] px-4 py-3 text-sm
          bg-[var(--white-color)] text-[var(--foreground)]
          placeholder:text-[var(--grey-400)]
          focus:outline-none focus:ring-2 focus:ring-[var(--main-400)] focus:border-[var(--main-400)]
          transition-all duration-300 font-medium;
        }

        .input-field:hover {
          border-color: var(--main-300);
        }

        /* Flatpickr Customization */
        .flatpickr-calendar {
          border-radius: 12px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
          border: 2px solid var(--border-light) !important;
        }

        .flatpickr-day.selected,
        .flatpickr-day.startRange,
        .flatpickr-day.endRange,
        .flatpickr-day.selected.inRange,
        .flatpickr-day.startRange.inRange,
        .flatpickr-day.endRange.inRange,
        .flatpickr-day.selected:focus,
        .flatpickr-day.startRange:focus,
        .flatpickr-day.endRange:focus,
        .flatpickr-day.selected:hover,
        .flatpickr-day.startRange:hover,
        .flatpickr-day.endRange:hover,
        .flatpickr-day.selected.prevMonthDay,
        .flatpickr-day.startRange.prevMonthDay,
        .flatpickr-day.endRange.prevMonthDay,
        .flatpickr-day.selected.nextMonthDay,
        .flatpickr-day.startRange.nextMonthDay,
        .flatpickr-day.endRange.nextMonthDay {
          background: var(--main-400) !important;
          border-color: var(--main-400) !important;
        }

        .flatpickr-day:hover {
          background: var(--main-100) !important;
          border-color: var(--main-300) !important;
        }

        .flatpickr-months .flatpickr-month {
          background: var(--second-500) !important;
          color: var(--white-color) !important;
        }

        .flatpickr-current-month .flatpickr-monthDropdown-months,
        .flatpickr-current-month input.cur-year {
          color: var(--white-color) !important;
          font-weight: 600;
        }

        .flatpickr-weekdays {
          background: var(--grey-100) !important;
        }

        .flatpickr-weekday {
          color: var(--second-500) !important;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

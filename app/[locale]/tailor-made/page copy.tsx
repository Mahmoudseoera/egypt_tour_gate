"use client";
// import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Check, Calendar, MapPin, Plane, Ship, Plus } from "lucide-react";

type TimeOption = "exact" | "month" | "days";

type TailorMadeFormData = {
  cities: string[];
  checkIn: string;
  checkOut: string;
  monthSelect: string;
  vacationDays: string;
  timeOption: TimeOption;
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
};

export default function TailorMadePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<TailorMadeFormData>({
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
    { id: "cairo", name: "Cairo" },
    { id: "giza", name: "Giza" },
    { id: "luxor", name: "Luxor" },
    { id: "aswan", name: "Aswan" },
    { id: "alexandria", name: "Alexandria" },
    { id: "dahab", name: "Dahab" },
    { id: "sharm", name: "Sharm El-Sheikh" },
    { id: "taba", name: "Taba" },
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
  };

  const toggleCity = (cityId: string) => {
    setFormData(prev => ({
      ...prev,
      cities: prev.cities.includes(cityId)
        ? prev.cities.filter(c => c !== cityId)
        : [...prev.cities, cityId]
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.cities.length > 0;
      case 2:
        if (formData.timeOption === "exact") {
          return formData.checkIn && formData.checkOut;
        } else if (formData.timeOption === "month") {
          return formData.monthSelect;
        } else {
          return formData.vacationDays;
        }
      case 3:
        return formData.fullName && formData.email && formData.phoneNumber;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const res = await fetch("/api/tailor-made", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-purple-400 to-purple-300 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <Plane className="absolute top-20 left-1/3 text-teal-500 w-16 h-16" />
        <Ship className="absolute bottom-32 left-32 text-teal-600 w-12 h-12" />
        <div className="absolute top-12 right-1/4 w-6 h-6 bg-teal-400 rounded-full" />
        <div className="absolute bottom-1/3 left-1/4 w-5 h-5 bg-blue-300 rounded-full" />
        <Plus className="absolute bottom-1/4 left-20 text-teal-400 text-4xl" />
        <Plus className="absolute top-1/2 right-20 text-teal-400 text-4xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
            Egypt Tailor Made Packages
          </h1>
          <p className="text-white text-lg max-w-2xl mx-auto">
            Plan your perfect Egypt adventure with our customized tour packages
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-8">
            {/* Step Navigation */}
            <div className="flex justify-between mb-8 overflow-x-auto pb-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex flex-col items-center min-w-[80px] ${
                    step <= currentStep ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition ${
                      step <= currentStep
                        ? "bg-[#e3b75e] text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step < currentStep ? <Check size={20} /> : step}
                  </div>
                  <span className="text-xs text-center font-medium">
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
                <h3 className="text-2xl font-bold text-gray-800">
                  Select the cities you want to visit
                </h3>
                <p className="text-gray-600">
                  Choose from our amazing destinations across Egypt
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => toggleCity(city.id)}
                      className={`p-4 rounded-xl border-2 transition hover:scale-105 ${
                        formData.cities.includes(city.id)
                          ? "border-[#e3b75e] bg-amber-50"
                          : "border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-[#272262]" />
                      <h5 className="font-semibold text-sm">{city.name}</h5>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Time */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  When do you want to travel?
                </h3>
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => updateFormData("timeOption", "exact")}
                    className={`flex-1 p-4 rounded-xl border-2 transition ${
                      formData.timeOption === "exact"
                        ? "border-[#e3b75e] bg-amber-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Calendar className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Exact Date</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFormData("timeOption", "month")}
                    className={`flex-1 p-4 rounded-xl border-2 transition ${
                      formData.timeOption === "month"
                        ? "border-[#e3b75e] bg-amber-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Calendar className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Approx Month</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFormData("timeOption", "days")}
                    className={`flex-1 p-4 rounded-xl border-2 transition ${
                      formData.timeOption === "days"
                        ? "border-[#e3b75e] bg-amber-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Calendar className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Not Sure</span>
                  </button>
                </div>

                {formData.timeOption === "exact" && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Check In</label>
                      <Flatpickr
                        value={formData.checkIn}
                        options={{
                          dateFormat: "Y-m-d",
                          minDate: "today",
                        }}
                        onChange={(dates: Date[]) => {
                          if (dates[0]) {
                            updateFormData("checkIn", dates[0].toISOString().split('T')[0]);
                          }
                        }}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Check Out</label>
                      <Flatpickr
                        value={formData.checkOut}
                        options={{
                          dateFormat: "Y-m-d",
                          minDate: "today",
                        }}
                        onChange={(dates: Date[]) => {
                          if (dates[0]) {
                            updateFormData("checkOut", dates[0].toISOString().split('T')[0]);
                          }
                        }}
                        className="input"
                      />
                    </div>
                  </div>
                )}

                {formData.timeOption === "month" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Month</label>
                    <input
                      type="month"
                      value={formData.monthSelect}
                      onChange={(e) => updateFormData("monthSelect", e.target.value)}
                      className="input"
                      min={new Date().toISOString().slice(0, 7)}
                    />
                  </div>
                )}

                {formData.timeOption === "days" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Vacation Days
                    </label>
                    <input
                      type="number"
                      value={formData.vacationDays}
                      onChange={(e) => updateFormData("vacationDays", e.target.value)}
                      className="input"
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
                <h3 className="text-2xl font-bold text-gray-800">
                  Your Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                      className="input"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="input"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Code</label>
                    <select
                      value={formData.phoneCode}
                      onChange={(e) => updateFormData("phoneCode", e.target.value)}
                      className="input"
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
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                      className="input"
                      placeholder="123456789"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nationality</label>
                    <select
                      value={formData.nationality}
                      onChange={(e) => updateFormData("nationality", e.target.value)}
                      className="input"
                    >
                      <option value="">Select</option>
                      {nationalities.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hotel Preference</label>
                    <input
                      type="text"
                      value={formData.hotel}
                      onChange={(e) => updateFormData("hotel", e.target.value)}
                      className="input"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Info</label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                    className="input h-24 resize-none"
                    placeholder="Any special requests or preferences..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Price & Guests */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Customize Your Trip
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium">Adults</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateFormData("adults", Math.max(1, formData.adults - 1))}
                        className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 hover:border-[#e3b75e] transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{formData.adults}</span>
                      <button
                        type="button"
                        onClick={() => updateFormData("adults", Math.min(10, formData.adults + 1))}
                        className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 hover:border-[#e3b75e] transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium">Children</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateFormData("children", Math.max(0, formData.children - 1))}
                        className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 hover:border-[#e3b75e] transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{formData.children}</span>
                      <button
                        type="button"
                        onClick={() => updateFormData("children", Math.min(10, formData.children + 1))}
                        className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 hover:border-[#e3b75e] transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium">Infants</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateFormData("infants", Math.max(0, formData.infants - 1))}
                        className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 hover:border-[#e3b75e] transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{formData.infants}</span>
                      <button
                        type="button"
                        onClick={() => updateFormData("infants", Math.min(10, formData.infants + 1))}
                        className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 hover:border-[#e3b75e] transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-4">Price Range (USD)</h4>
                  <div className="flex gap-4 mb-4">
                    <div>
                      <label className="text-sm text-gray-600">Min</label>
                      <input
                        type="number"
                        value={formData.priceMin}
                        onChange={(e) => updateFormData("priceMin", parseInt(e.target.value) || 0)}
                        className="input w-32"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Max</label>
                      <input
                        type="number"
                        value={formData.priceMax}
                        onChange={(e) => updateFormData("priceMax", parseInt(e.target.value) || 0)}
                        className="input w-32"
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
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Confirm */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Confirm Your Details
                </h3>
                <p className="text-gray-600">
                  Thank you, {formData.fullName}! Please review your trip details before submitting.
                </p>
                <form onSubmit={handleSubmit}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#e3b75e] hover:bg-[#d4a856] text-white font-semibold py-4 rounded-xl transition disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Trip Request"}
                  </button>
                  {message && (
                    <p className="text-center mt-4 text-sm">{message}</p>
                  )}
                </form>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 5 && (
              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="flex-1 bg-[#e3b75e] hover:bg-[#d4a856] text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 h-fit sticky top-4">
            <div className="mb-4">
                 <Image
                  src="https://images.unsplash.com/photo-1539768942893-daf53e448371?w=400"
                  alt="Egypt"
                  width={400}
                  height={300}
                  className="w-full h-32 object-cover rounded-xl mb-4"
                />
              <h3 className="text-xl font-bold text-[#272262] mb-2">Trip Summary</h3>
            </div>

            <div className="space-y-3 text-sm">
              {formData.cities.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cities:</span>
                  <span className="font-medium">
                    {formData.cities.map(id => cities.find(c => c.id === id)?.name).join(", ")}
                  </span>
                </div>
              )}

              {(formData.checkIn || formData.monthSelect) && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dates:</span>
                  <span className="font-medium">
                    {formData.checkIn ? `${formData.checkIn} to ${formData.checkOut}` : formData.monthSelect}
                  </span>
                </div>
              )}

              {getDaysCount() > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Days:</span>
                  <span className="font-medium">{getDaysCount()} days</span>
                </div>
              )}

              {formData.fullName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{formData.fullName}</span>
                </div>
              )}

              {formData.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-xs">{formData.email}</span>
                </div>
              )}

              {formData.phoneNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">+{formData.phoneCode} {formData.phoneNumber}</span>
                </div>
              )}

              {(formData.adults > 0 || formData.children > 0 || formData.infants > 0) && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-medium">
                    {formData.adults}A {formData.children}C {formData.infants}I
                  </span>
                </div>
              )}

              {formData.priceMin && formData.priceMax && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium">${formData.priceMin} - ${formData.priceMax}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input {
          @apply w-full rounded-xl border border-gray-200 px-4 py-3 text-sm
          focus:outline-none focus:ring-2 focus:ring-[#e3b75e] transition;
        }
      `}</style>
    </div>
  );
}

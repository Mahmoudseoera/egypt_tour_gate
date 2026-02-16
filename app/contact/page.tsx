"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { contactSchema, type ContactFormData } from "@/lib/validations/contact.schema";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      country: "",
      message: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(values: ContactFormData) {
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Message sent successfully");
        router.push("/thank-you");
        return;
      }

      toast.error(data.message || "Something went wrong ❌");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputBaseClass =
    "w-full border-[1.5px] border-solid border-[#9e9e9e] rounded-2xl bg-transparent px-4 py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[var(--second-color)]";

  return (
    <section className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              noValidate
            >
              <div className="md:col-span-1">
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Full Name"
                  className={`${inputBaseClass} ${errors.name ? "border-red-500" : ""}`}
                  {...register("name")}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>

              <div className="md:col-span-1">
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Email Address"
                  className={`${inputBaseClass} ${errors.email ? "border-red-500" : ""}`}
                  {...register("email")}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div className="md:col-span-1">
                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder="Phone Number"
                  className={`${inputBaseClass} ${errors.phone ? "border-red-500" : ""}`}
                  {...register("phone")}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
              </div>

              <div className="md:col-span-1">
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Subject"
                  className={`${inputBaseClass} ${errors.subject ? "border-red-500" : ""}`}
                  {...register("subject")}
                />
                {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>}
              </div>

              <div className="md:col-span-2">
                <select
                  className={`${inputBaseClass} ${errors.country ? "border-red-500" : ""}`}
                  {...register("country")}
                >
                  <option value="">Select Country</option>
                  <option value="Egypt">Egypt</option>
                  <option value="Portugal">Portugal</option>
                </select>
                {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>}
              </div>

              <div className="md:col-span-2">
                <textarea
                  placeholder="Write Message"
                  className={`${inputBaseClass} h-48 resize-none ${errors.message ? "border-red-500" : ""}`}
                  {...register("message")}
                />
                {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
              </div>

              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white px-8 py-3 rounded-full transition disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Map */}
          <div className="rounded-3xl overflow-hidden shadow-xl h-[520px]">
            <iframe
              title="map"
              src="https://www.google.com/maps?q=30.0444,31.2357&z=14&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

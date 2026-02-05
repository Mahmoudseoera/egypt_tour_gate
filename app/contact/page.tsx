"use client";

import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  console.log(
    "API BASE:",
    process.env.NEXT_PUBLIC_API_BASE_URL
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        subject: formData.get("subject"),
        country: formData.get("country"),
        message: formData.get("message"),
      }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Message sent successfully ✅");
      // e.currentTarget.reset();
      router.push("/thank-you");
    } else {
      setMessage("Something went wrong ❌");
    }

    setLoading(false);
  }

  return (
    <section className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="relative">
            <input
              required
              type="text" 
              name="text"
              autoComplete="off"
              className="input peer w-full border-[1.5px] border-solid border-[#9e9e9e] rounded-2xl bg-transparent px-4 py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[var(--second-color)] valid:border-[var(--second-color)] valid:outline-none outline-none"
            />
          <label className="absolute left-[15px] text-[#aaa] pointer-events-none translate-y-4 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] peer-focus:-translate-y-1/2 peer-focus:scale-80 peer-focus:bg-[var(--second-color)] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[var(--main-color)] peer-valid:-translate-y-1/2 peer-valid:scale-80 peer-valid:bg-[#212121] peer-valid:px-[0.2em] peer-valid:py-0 peer-valid:text-[#2196f3]">
            Full Name
          </label>
          </div>  
          <div className="relative">
            <input
              required
              type="email" 
              name="text"
              autoComplete="off"
              className="input peer w-full border-[1.5px] border-solid border-[#9e9e9e] rounded-2xl bg-transparent px-4 py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[var(--second-color)] valid:border-[var(--second-color)] valid:outline-none outline-none"
            />
          <label className="absolute left-[15px] text-[#aaa] pointer-events-none translate-y-4 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] peer-focus:-translate-y-1/2 peer-focus:scale-80 peer-focus:bg-[var(--second-color)] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[var(--main-color)] peer-valid:-translate-y-1/2 peer-valid:scale-80 peer-valid:bg-[#212121] peer-valid:px-[0.2em] peer-valid:py-0 peer-valid:text-[#2196f3]">
            Email Address
          </label>
          </div>  
          <div className="relative">
            <input
              required
              type="number" 
              name="phone"
              autoComplete="off"
              className="input peer w-full border-[1.5px] border-solid border-[#9e9e9e] rounded-2xl bg-transparent px-4 py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[var(--second-color)] valid:border-[var(--second-color)] valid:outline-none outline-none"
            />
          <label className="absolute left-[15px] text-[#aaa] pointer-events-none translate-y-4 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] peer-focus:-translate-y-1/2 peer-focus:scale-80 peer-focus:bg-[var(--second-color)] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[var(--main-color)] peer-valid:-translate-y-1/2 peer-valid:scale-80 peer-valid:bg-[#212121] peer-valid:px-[0.2em] peer-valid:py-0 peer-valid:text-[#2196f3]">
          Phone Number
          </label>
          </div>
          <div className="relative">
            <input
              required
              type="text" 
              name="subject" 
              autoComplete="off"
              className="input peer w-full border-[1.5px] border-solid border-[#9e9e9e] rounded-2xl bg-transparent px-4 py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[var(--second-color)] valid:border-[var(--second-color)] valid:outline-none outline-none"
            />
          <label className="absolute left-[15px] text-[#aaa] pointer-events-none translate-y-4 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] peer-focus:-translate-y-1/2 peer-focus:scale-80 peer-focus:bg-[var(--second-color)] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[var(--main-color)] peer-valid:-translate-y-1/2 peer-valid:scale-80 peer-valid:bg-[#212121] peer-valid:px-[0.2em] peer-valid:py-0 peer-valid:text-[#2196f3]">
          Subject
          </label>
          </div>
              
          <div className="relative relative md:col-span-2 input">
          <select name="country" className="w-full py-4 px-4 rounded-2xl border-[1.5px] border-solid border-[#9e9e9e]">
                <option value="">Select Country</option>
                <option value="Egypt">Egypt</option>
                <option value="Portugal">Portugal</option>
              </select>
          <label className="absolute left-[15px] text-[#aaa] pointer-events-none translate-y-4 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] peer-focus:-translate-y-1/2 peer-focus:scale-80 peer-focus:bg-[var(--second-color)] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[var(--main-color)] peer-valid:-translate-y-1/2 peer-valid:scale-80 peer-valid:bg-[#212121] peer-valid:px-[0.2em] peer-valid:py-0 peer-valid:text-[#2196f3]">
          Select Country
          </label>
          </div>

          <div className="relative md:col-span-2 input h-48">
            <textarea
              required
              name="message"
              className="h-48 input peer w-full border-[1.5px] border-solid border-[#9e9e9e] rounded-2xl bg-transparent px-4 py-4 text-base text-[#333] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[var(--second-color)] valid:border-[var(--second-color)] valid:outline-none outline-none resize-none"
            />
          <label className="absolute left-[15px] text-[#aaa] pointer-events-none translate-y-4 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] peer-focus:-translate-y-1/2 peer-focus:scale-80 peer-focus:bg-[var(--second-color)] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[var(--main-color)] peer-valid:-translate-y-1/2 peer-valid:scale-80 peer-valid:bg-[#212121] peer-valid:px-[0.2em] peer-valid:py-0 peer-valid:text-[#2196f3]">
          Write Message
          </label>
          </div>


              <div className="md:col-span-2 mt-4">
                <button
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white px-8 py-3 rounded-full transition disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                  <Send size={16} />
                </button>
              </div>

              {message && (
                <p className="md:col-span-2 text-sm mt-2">{message}</p>
              )}
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

      <style jsx global>{`
        .input {
          @apply w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 transition;
        }
      `}</style>
    </section>
  );
}

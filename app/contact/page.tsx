"use client";

import { Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
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
      e.currentTarget.reset();
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
              <input name="name" className="input" placeholder="Name" required />
              <input name="email" type="email" className="input" placeholder="Email" required />

              <input name="phone" className="input" placeholder="Phone" />
              <input name="subject" className="input" placeholder="Subject" />

              <select name="country" className="input md:col-span-2">
                <option value="">Select Country</option>
                <option value="Egypt">Egypt</option>
                <option value="Portugal">Portugal</option>
              </select>

              <textarea
                name="message"
                className="md:col-span-2 input h-32 resize-none"
                placeholder="Write Message"
                required
              />

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

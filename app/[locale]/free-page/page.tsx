// free page //
import Link from "next/link";
import Image from "next/image";

export default function FreePage() {
  return (
<section className="bg-grey pt-6 pb-10">
    <div className="container mx-auto px-4">

      {/* ===== Hero Header ===== */}
      <div className="relative mb-16 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src="/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp"
          alt="Terms and Conditions"
          height={360}
          width={1440}
          className="w-full h-[360px] object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-second/90 to-second/40"></div>

        <div className="absolute inset-0 flex items-center">
          <div className="px-8">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">
              Terms & Conditions
            </h1>
            <p className="text-white/90 max-w-xl">
              Everything you need to know before traveling with Egypt Tour Gate
            </p>
          </div>
        </div>
      </div>

      {/* ===== Content Card ===== */}
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-7xl mx-auto">

        <div className="prose prose-lg max-w-none
          prose-p:text-black
          prose-li:text-black
          prose-strong:text-second
          prose-ul:pl-6">

          <p>
            Welcome to <strong>Egypt Tour Gate</strong>. These Terms & Conditions govern your use
            of our website, services, and travel-related products. By accessing or
            using our services, you agree to be bound by these terms.
          </p>

          <h3 className="text-second font-semibold mt-10">Definitions</h3>
          <ul>
            <li><strong>Egypt Tour Gate / We / Us</strong> refers to Egypt Tour Gate and its affiliates.</li>
            <li><strong>User / You</strong> refers to any individual using our services.</li>
            <li><strong>Services</strong> include travel planning, bookings, tours, and support.</li>
          </ul>

          <h3 className="text-second font-semibold mt-10">Use of the Website</h3>
          <ul>
            <li>You must be at least 18 years old to use our services.</li>
            <li>You agree to provide accurate and current information.</li>
            <li>You are responsible for your account security.</li>
          </ul>

          <h3 className="text-second font-semibold mt-10">Bookings & Payments</h3>
          <ul>
            <li>All bookings are subject to availability.</li>
            <li>Prices may change before confirmation.</li>
            <li>Partial or full payment may be required.</li>
          </ul>

          <h3 className="text-second font-semibold mt-10">Cancellations & Refunds</h3>
          <ul>
            <li>Policies vary depending on service providers.</li>
            <li>All cancellation requests must be in writing.</li>
            <li>Refunds follow provider terms and admin fees may apply.</li>
          </ul>

          <h3 className="text-second font-semibold mt-10">Travel Documents</h3>
          <ul>
            <li>You are responsible for valid passports and visas.</li>
            <li>Egypt Tour Gate is not liable for denied boarding or entry.</li>
          </ul>

          <h3 className="text-second font-semibold mt-10">Limitation of Liability</h3>
          <ul>
            <li>Egypt Tour Gate acts as an intermediary with third parties.</li>
            <li>Liability is limited to the amount paid.</li>
          </ul>

          <h3 className="text-second font-semibold mt-10">Privacy Policy</h3>
          <ul>
            <li>Your data is protected according to applicable laws.</li>
          </ul>

          <h3 className="text-second font-semibold mt-10">Governing Law</h3>
          <ul>
            <li>Terms are governed by applicable jurisdiction laws.</li>
          </ul>

          <div className="mt-12 border-t pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-black/70">
              <strong>Last Updated:</strong> <span>20/1/2026</span>
            </p>

            <span className="inline-flex items-center gap-2 text-main font-semibold">
              ✈️ Travel with confidence
            </span>
          </div>

        </div>
      </div>
    </div>
</section>

  )
}

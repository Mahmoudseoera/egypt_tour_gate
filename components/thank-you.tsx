'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Home, Mail, Phone } from 'lucide-react';

export default function ThankYouPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-amber-50 flex items-center justify-center p-4">
      <div className={`max-w-2xl w-full transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Success Icon */}
          <div className="bg-gradient-to-r from-gold to-amber-400 pt-12 pb-8 px-6 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Thank You!
            </h1>
            <p className="text-white/90 text-lg">
              Your booking request has been received
            </p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                We'll Be in Touch Soon
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our travel experts are reviewing your request and will contact you within 24 hours 
                to confirm your booking and answer any questions you may have.
              </p>
            </div>

            {/* What's Next */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-navy mb-4">What happens next?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Email Confirmation:</strong> Check your inbox for a confirmation email with your booking details.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Personal Contact:</strong> Our team will reach out via phone or email to discuss your itinerary.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Customization:</strong> We'll work together to perfect your dream Egypt experience.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="border-t border-gray-200 pt-8 mb-8">
              <p className="text-center text-gray-600 mb-6">
                Need immediate assistance? Contact us directly:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <a 
                  href="tel:+201110008407"
                  className="flex items-center justify-center gap-3 bg-navy hover:bg-navy/90 text-white px-6 py-4 rounded-lg transition-all transform hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-semibold">+201110008407</span>
                </a>
                <a 
                  href="mailto:info@egypttoursgate.com"
                  className="flex items-center justify-center gap-3 bg-gold hover:bg-gold/90 text-white px-6 py-4 rounded-lg transition-all transform hover:scale-105"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">Email Us</span>
                </a>
              </div>
            </div>

            {/* WhatsApp Button */}
            <div className="text-center mb-8">
              <a
                href="https://wa.me/201110008407"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="font-semibold">Chat on WhatsApp</span>
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/"
                className="flex-1 flex items-center justify-center gap-2 border-2 border-navy text-navy hover:bg-navy hover:text-white px-6 py-3 rounded-lg transition-all font-semibold"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </a>
              <a
                href="/tours"
                className="flex-1 text-center bg-gold hover:bg-gold/90 text-white px-6 py-3 rounded-lg transition-all font-semibold"
              >
                Explore More Tours
              </a>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <p className="text-center text-gray-600 mt-8">
          Follow us on social media for travel tips and exclusive offers! 🌍
        </p>
      </div>
    </div>
  );
}

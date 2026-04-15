"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Phone, MapPin, Mail, ChevronRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { useLocale } from "next-intl";

import {
  contactSchema,
  type ContactFormData,
} from "@/lib/validations/contact.schema";

/* ─── Breadcrumb items ─────────────────────────────────────── */
const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
];

/* ─── Info Cards Data ─────────────────────────────────────── */
type ContactCard = {
  icon: typeof Phone;
  label: string;
  lines: string[];
  href: string;
  ariaLabel: string;
  target: "_blank" | "_self";
};

const fallbackContactCards: ContactCard[] = [
  {
    icon: Phone,
    label: "Phone",
    lines: ["+201110008407", "+201110008407"],
    href: "tel:+201110008407",
    ariaLabel: "Call us",
    target: "_self",
  },
  {
    icon: MapPin,
    label: "Address",
    lines: ["43 N Area, Ahmed Allam St,", "Pyramids Garden, Giza, Egypt"],
    href: "https://www.google.com/maps?q=43+Ahmed+Allam+St+Pyramids+Garden+Giza+Egypt",
    ariaLabel: "Open location in Google Maps",
    target: "_blank",
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["info@egypttoursgate.com"],
    href: "mailto:info@egypttoursgate.com",
    ariaLabel: "Send us an email",
    target: "_self",
  },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [contactCards, setContactCards] = useState<ContactCard[]>(fallbackContactCards);
  const locale = useLocale();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      code: "",
      country: "",
      message: "",
    },
    mode: "onBlur",
  });

  const watchedValues = watch();

  // ── GET: جيب بيانات الكروت من الـ API ───────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadContactInfo() {
      try {
        const res = await fetch(`/api/contact?locale=${locale}`);
        if (!res.ok) return;
        const payload = await res.json();

        // حاول تجيب الـ contact data من أي شكل للـ response
        const data    = payload?.data ?? payload ?? {};
        const contact = data?.contact ?? data?.form ?? data;

        const phones = [
          contact?.phone,
          contact?.phone_1,
          contact?.phone_2,
        ].filter((v: unknown): v is string => typeof v === "string" && v.trim().length > 0);

        const email   = typeof contact?.email   === "string" ? contact.email   : "";
        const address = typeof contact?.address === "string" ? contact.address : "";

        const dynamicCards: ContactCard[] = [
          {
            icon: Phone,
            label: "Phone",
            lines: phones.length ? phones : fallbackContactCards[0].lines,
            href: `tel:${(phones[0] ?? fallbackContactCards[0].lines[0]).replace(/\s+/g, "")}`,
            ariaLabel: "Call us",
            target: "_self",
          },
          {
            icon: MapPin,
            label: "Address",
            lines: address ? [address] : fallbackContactCards[1].lines,
            href: address
              ? `https://www.google.com/maps?q=${encodeURIComponent(address)}`
              : fallbackContactCards[1].href,
            ariaLabel: "Open location in Google Maps",
            target: "_blank",
          },
          {
            icon: Mail,
            label: "Email",
            lines: email ? [email] : fallbackContactCards[2].lines,
            href: `mailto:${email || fallbackContactCards[2].lines[0]}`,
            ariaLabel: "Send us an email",
            target: "_self",
          },
        ];

        if (!cancelled) setContactCards(dynamicCards);
      } catch {
        // keep fallback cards silently
      }
    }

    loadContactInfo();
    return () => { cancelled = true; };
  }, [locale]);

  // ── POST: إرسال الفورم ───────────────────────────────────────────────────
  // ✅ الـ validation كلها بتحصل هنا في الـ frontend بواسطة zod + react-hook-form
  // ✅ لو الـ validation فشلت، الـ onSubmit مش بيتنفذ أصلاً
  // ✅ لو الـ validation نجحت، بنبعت للـ proxy route /api/contact
  async function onSubmit(values: ContactFormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // بنبعت code و phone منفصلين ← الـ route.ts بيجمّعهم في "+20xxxxxxxxx"
        body: JSON.stringify({
          name:    values.name,
          email:   values.email,
          code:    values.code,
          phone:   values.phone,
          subject: values.subject,
          country: values.country,
          message: values.message,
        }),
      });

      const data = await res.json();

      // الـ API رجع error (4xx / 5xx أو success: false)
      if (!res.ok || !data.success) {
        toast.error(data.message || "Something went wrong. Please try again.");
        return;
      }

      // ✅ نجاح
      toast.success("Message sent! We'll be in touch within 24 hours.");
      reset();
      router.push("/thank-you");

    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ─── Floating label CSS strings ─── */
  const floatBase =
    "absolute left-[15px] text-[#aaa] pointer-events-none translate-y-4 text-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]";
  const floatFocus =
    "peer-focus:-translate-y-[22px] peer-focus:scale-[0.80] peer-focus:bg-[var(--second-color)] peer-focus:px-[0.35em] peer-focus:py-[1px] peer-focus:text-[var(--main-color)] peer-focus:rounded-sm";
  const floatFilled =
    "peer-[.filled]:-translate-y-[22px] peer-[.filled]:scale-[0.80] peer-[.filled]:bg-[var(--second-color)] peer-[.filled]:px-[0.35em] peer-[.filled]:py-[1px] peer-[.filled]:text-[var(--main-color)] peer-[.filled]:rounded-sm";
  const floatError =
    "peer-[.has-error]:-translate-y-[22px] peer-[.has-error]:scale-[0.80] peer-[.has-error]:bg-red-600 peer-[.has-error]:px-[0.35em] peer-[.has-error]:py-[1px] peer-[.has-error]:text-white peer-[.has-error]:rounded-sm";

  const labelClass = `${floatBase} ${floatFocus} ${floatFilled} ${floatError}`;

  const inputBase =
    "peer w-full border-[1.5px] border-[#9e9e9e] rounded-2xl bg-transparent px-4 py-4 text-base text-[#333] transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[var(--second-color)] outline-none";

  function inputClass(fieldName: keyof ContactFormData) {
    const val      = watchedValues[fieldName];
    const hasError = !!errors[fieldName];
    const isFilled = typeof val === "string" ? val.trim().length > 0 : !!val;
    return [
      inputBase,
      hasError ? "border-red-500 has-error" : "",
      isFilled && !hasError ? "filled" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <>
      <style>{`
        .contact-hero {
          background-image:
            linear-gradient(
              135deg,
              rgba(39,34,98,0.90) 0%,
              rgba(61,53,134,0.84) 50%,
              rgba(39,34,98,0.92) 100%
            ),
            url('https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=1600&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .bc-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          color: rgba(255,255,255,0.70);
          font-size: 0.82rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.22s ease;
          white-space: nowrap;
        }
        .bc-link:hover { color: var(--main-color); }
        .bc-link.bc-active {
          color: var(--main-color);
          font-weight: 600;
          pointer-events: none;
        }
        .bc-sep {
          display: inline-flex;
          align-items: center;
          color: var(--main-color);
          opacity: 0.55;
          flex-shrink: 0;
        }
        .contact-card .card-icon {
          transition: transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;
        }
        .contact-card:hover .card-icon {
          transform: scale(1.18) rotate(14deg);
        }
      `}</style>

      <section className="min-h-screen bg-[var(--main-grey)]">

        {/* ── PAGE HEADER ── */}
        <div className="contact-hero relative py-14 sm:py-20 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
            <div className="absolute -top-10 -left-10 w-48 h-48 border-[3px] border-[var(--main-color)] rounded-full opacity-[0.12]" />
            <div className="absolute top-6 left-6 w-24 h-24 border-[2px] border-[var(--main-color)] rounded-full opacity-[0.10]" />
            <div className="absolute -bottom-12 -right-12 w-56 h-56 border-[3px] border-[var(--main-color)] rounded-full opacity-[0.12]" />
            <div className="absolute bottom-8 right-10 w-20 h-20 border-[2px] border-[var(--main-color)] rotate-45 opacity-[0.14]" />
          </div>

          <nav aria-label="Breadcrumb" className="relative z-10 flex items-center justify-center gap-1.5 flex-wrap mb-7 px-4">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              return (
                <span key={item.href} className="flex items-center gap-1.5">
                  {index === 0 && (
                    <Home size={13} className="text-white/50 flex-shrink-0 -mr-0.5" aria-hidden />
                  )}
                  {isLast ? (
                    <span className="bc-link bc-active" aria-current="page">{item.label}</span>
                  ) : (
                    <Link href={item.href} className="bc-link">{item.label}</Link>
                  )}
                  {!isLast && (
                    <span className="bc-sep" aria-hidden>
                      <ChevronRight size={14} strokeWidth={2.5} />
                    </span>
                  )}
                </span>
              );
            })}
          </nav>

          <div className="relative z-10 px-4">
            <p className="text-[var(--main-color)] font-semibold tracking-[0.22em] uppercase text-[11px] sm:text-xs mb-2">
              Get In Touch
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
              Contact Us
            </h1>
            <p className="text-white/72 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Have questions about your dream Egypt tour? Our team is ready to
              help you plan the perfect adventure.
            </p>
          </div>
        </div>

        {/* ── INFO CARDS ── */}
        <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {contactCards.map(({ icon: Icon, label, lines, href, ariaLabel, target }) => (
              <Link
                key={label}
                href={href}
                target={target}
                rel={target === "_blank" ? "noopener noreferrer" : undefined}
                aria-label={ariaLabel}
                className="contact-card group flex flex-col items-center text-center bg-white rounded-2xl shadow-lg p-6 sm:p-7 border border-transparent hover:border-[var(--main-color)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="card-icon w-14 h-14 rounded-full bg-gradient-to-br from-[var(--second-color)] to-[#4a43a0] flex items-center justify-center mb-4 shadow-md">
                  <Icon size={24} className="text-[var(--main-color)]" />
                </div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--main-color)] mb-2">
                  {label}
                </p>
                {lines.map((line, i) => (
                  <span key={i} className="text-xs sm:text-sm text-[var(--black-color)] leading-relaxed font-medium">
                    {line}
                  </span>
                ))}
                <div className="mt-4 w-10 h-0.5 bg-gradient-to-r from-[var(--second-color)] to-[var(--main-color)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── FORM + MAP ── */}
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">

            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col">
              <div className="mb-7">
                <div className="w-12 h-1 bg-[var(--main-color)] rounded-full mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--second-color)]">
                  Send Us a Message
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the form and we&apos;ll get back to you within 24 hours.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-7"
                noValidate
              >
                {/* Full Name */}
                <div className="relative sm:col-span-1">
                  <input type="text" autoComplete="name" className={inputClass("name")} {...register("name")} />
                  <label className={labelClass}>Full Name</label>
                  {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="relative sm:col-span-1">
                  <input type="email" autoComplete="email" className={inputClass("email")} {...register("email")} />
                  <label className={labelClass}>Email Address</label>
                  {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>}
                </div>

                {/* Phone Code + Phone */}
                <div className="sm:col-span-2 flex gap-3">
                  <div className="relative w-[130px] sm:w-[155px] shrink-0">
                    <select
                      className={`${inputClass("code")} appearance-none cursor-pointer`}
                      defaultValue=""
                      {...register("code")}
                    >
                      <option value="" disabled hidden>Code</option>
                      <option value="213">Algeria (+213)</option>
                      <option value="54">Argentina (+54)</option>
                      <option value="374">Armenia (+374)</option>
                      <option value="61">Australia (+61)</option>
                      <option value="43">Austria (+43)</option>
                      <option value="973">Bahrain (+973)</option>
                      <option value="880">Bangladesh (+880)</option>
                      <option value="32">Belgium (+32)</option>
                      <option value="55">Brazil (+55)</option>
                      <option value="1">Canada (+1)</option>
                      <option value="56">Chile (+56)</option>
                      <option value="86">China (+86)</option>
                      <option value="57">Colombia (+57)</option>
                      <option value="20">Egypt (+20)</option>
                      <option value="33">France (+33)</option>
                      <option value="49">Germany (+49)</option>
                      <option value="30">Greece (+30)</option>
                      <option value="852">Hong Kong (+852)</option>
                      <option value="91">India (+91)</option>
                      <option value="62">Indonesia (+62)</option>
                      <option value="98">Iran (+98)</option>
                      <option value="964">Iraq (+964)</option>
                      <option value="353">Ireland (+353)</option>
                      <option value="972">Israel (+972)</option>
                      <option value="39">Italy (+39)</option>
                      <option value="81">Japan (+81)</option>
                      <option value="962">Jordan (+962)</option>
                      <option value="965">Kuwait (+965)</option>
                      <option value="961">Lebanon (+961)</option>
                      <option value="60">Malaysia (+60)</option>
                      <option value="52">Mexico (+52)</option>
                      <option value="212">Morocco (+212)</option>
                      <option value="31">Netherlands (+31)</option>
                      <option value="64">New Zealand (+64)</option>
                      <option value="234">Nigeria (+234)</option>
                      <option value="47">Norway (+47)</option>
                      <option value="968">Oman (+968)</option>
                      <option value="92">Pakistan (+92)</option>
                      <option value="970">Palestine (+970)</option>
                      <option value="63">Philippines (+63)</option>
                      <option value="48">Poland (+48)</option>
                      <option value="351">Portugal (+351)</option>
                      <option value="974">Qatar (+974)</option>
                      <option value="40">Romania (+40)</option>
                      <option value="7">Russia (+7)</option>
                      <option value="966">Saudi Arabia (+966)</option>
                      <option value="65">Singapore (+65)</option>
                      <option value="27">South Africa (+27)</option>
                      <option value="82">South Korea (+82)</option>
                      <option value="34">Spain (+34)</option>
                      <option value="94">Sri Lanka (+94)</option>
                      <option value="46">Sweden (+46)</option>
                      <option value="41">Switzerland (+41)</option>
                      <option value="963">Syria (+963)</option>
                      <option value="886">Taiwan (+886)</option>
                      <option value="66">Thailand (+66)</option>
                      <option value="216">Tunisia (+216)</option>
                      <option value="90">Turkey (+90)</option>
                      <option value="971">UAE (+971)</option>
                      <option value="44">UK (+44)</option>
                      <option value="380">Ukraine (+380)</option>
                      <option value="1">USA (+1)</option>
                      <option value="998">Uzbekistan (+998)</option>
                      <option value="84">Vietnam (+84)</option>
                      <option value="967">Yemen (+967)</option>
                    </select>
                    <label className={labelClass}>Code</label>
                    {errors.code && <p className="mt-1.5 text-xs text-red-600">{errors.code.message}</p>}
                  </div>

                  <div className="relative flex-1">
                    <input type="tel" autoComplete="tel" className={inputClass("phone")} {...register("phone")} />
                    <label className={labelClass}>Phone Number</label>
                    {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone.message}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div className="relative sm:col-span-1">
                  <input type="text" autoComplete="off" className={inputClass("subject")} {...register("subject")} />
                  <label className={labelClass}>Subject</label>
                  {errors.subject && <p className="mt-1.5 text-xs text-red-600">{errors.subject.message}</p>}
                </div>

                {/* Country */}
                <div className="relative sm:col-span-1">
                  <select
                    className={`${inputClass("country")} appearance-none cursor-pointer`}
                    defaultValue=""
                    {...register("country")}
                  >
                    <option value="" disabled hidden>Country</option>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Canada">Canada</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Greece">Greece</option>
                    <option value="Hungary">Hungary</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran">Iran</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Japan">Japan</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Libya">Libya</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palestine">Palestine</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Romania">Romania</option>
                    <option value="Russia">Russia</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan">Sudan</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syria">Syria</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="UAE">UAE</option>
                    <option value="Uganda">Uganda</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="USA">United States</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                  </select>
                  <label className={labelClass}>Country</label>
                  {errors.country && <p className="mt-1.5 text-xs text-red-600">{errors.country.message}</p>}
                </div>

                {/* Message */}
                <div className="relative sm:col-span-2">
                  <textarea
                    autoComplete="off"
                    rows={6}
                    className={`${inputClass("message")} resize-none`}
                    {...register("message")}
                  />
                  <label className={labelClass}>Your Message</label>
                  {errors.message && <p className="mt-1.5 text-xs text-red-600">{errors.message.message}</p>}
                </div>

                {/* Submit */}
                <div className="sm:col-span-2 mt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[var(--main-color)] hover:bg-[var(--second-color)] text-[var(--second-color)] hover:text-[var(--main-color)] font-bold px-8 py-3.5 rounded-full transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {loading ? "Sending…" : "Send Message"}
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* Map */}
            <div className="rounded-3xl overflow-hidden shadow-xl w-full" style={{ minHeight: "360px" }}>
              <iframe
                title="Egypt Tours Gate Location"
                src="https://www.google.com/maps?q=43+Ahmed+Allam+St+Pyramids+Garden+Giza+Egypt&z=15&output=embed"
                className="w-full h-full border-0"
                style={{ minHeight: "360px", display: "block" }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

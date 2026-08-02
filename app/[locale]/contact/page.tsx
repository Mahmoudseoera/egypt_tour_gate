"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Phone, MapPin, Mail, ChevronRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { useT } from "@/lib/hooks/useTranslate";
import { useLocale } from "next-intl";
import "@/styles/contact.css";
import {
  contactSchema,
  type ContactFormData,
} from "@/lib/validations/contact.schema";



/* ─── Info Cards Data ─────────────────────────────────────── */
type ContactCard = {
  icon: typeof Phone;
  label: string;
  lines: string[];
  href: string;
  ariaLabel: string;
  target: "_blank" | "_self";
};

// ✅ FIX 3: fallbackContactCards removed — data comes purely from the API.
// We keep a static skeleton used only while the API call is in-flight.
const SKELETON_CARDS: ContactCard[] = [
  {
    icon: Phone,
    label: "Phone",
    lines: ["Loading…"],
    href: "#",
    ariaLabel: "Call us",
    target: "_self",
  },
  {
    icon: MapPin,
    label: "Address",
    lines: ["Loading…"],
    href: "#",
    ariaLabel: "Open location in Google Maps",
    target: "_blank",
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["Loading…"],
    href: "#",
    ariaLabel: "Send us an email",
    target: "_self",
  },
];

// ✅ FIX 2: Memoize the Map component so it never re-renders when the form changes.
const ContactMap = memo(function ContactMap({ html }: { html: string }) {
  return (
    <div
      className="rounded-3xl overflow-hidden shadow-xl w-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:min-h-[360px] [&_iframe]:border-0 [&_iframe]:block"
      style={{ minHeight: "360px" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [contactCards, setContactCards] = useState<ContactCard[]>(SKELETON_CARDS);
  const [bgImage, setBgImage] = useState<string>("");
  // ✅ Store the iframe html in a ref-stable state — only set once from the API.
  const [mapIframe, setMapIframe] = useState<string>("");
  const locale = useLocale();
  const router = useRouter();
  const t = useT("contact");
  const commonT = useT("common");
/* ─── Breadcrumb items ─────────────────────────────────────── */
const breadcrumbItems = [
  { label: commonT("home"), href: "/" },
  { label: commonT("contact"), href: "/contact" },
];
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

  // ─── Load contact info from GET endpoint ─────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadContactInfo() {
      try {
        const res = await fetch(`/api/contact?locale=${locale}`, {
        next: { revalidate: 3600, tags: ["contact"] } });
        if (!res.ok) return;

        const payload = await res.json();
            // Real API shape: { success: true, data: { phone, mobile, email, address, iframe, ... } }
        if (!payload?.success || !payload?.data) return;

        const d = payload.data;

        // Phone: prefer `phone`, fallback to `mobile`
        const phones = [d.phone, d.mobile]
          .filter((v: unknown): v is string => typeof v === "string" && v.trim().length > 0)
          .filter((v: string, i: number, arr: string[]) => arr.indexOf(v) === i);

        const email   = typeof d.email   === "string" ? d.email.trim()   : "";
        const address = typeof d.address === "string" ? d.address.trim() : "";
        const iframe  = typeof d.iframe  === "string" ? d.iframe.trim()  : "";

        // ✅ FIX 3: Cards are built exclusively from API data. No fallback strings.
        const dynamicCards: ContactCard[] = [
          {
            icon: Phone,
            label: commonT("phone"),
            lines: phones.length ? phones : ["—"],
            href: phones[0] ? `tel:${phones[0].replace(/\s+/g, "")}` : "#",
            ariaLabel: "Call us",
            target: "_self",
          },
          {
            icon: MapPin,
            label: commonT("address"),
            lines: address ? [address] : ["—"],
            href: address
              ? `https://www.google.com/maps?q=${encodeURIComponent(address)}`
              : "#",
            ariaLabel: "Open location in Google Maps",
            target: "_blank",
          },
          {
            icon: Mail,
            label: commonT("email"),
            lines: email ? [email] : ["—"],
            href: email ? `mailto:${email}` : "#",
            ariaLabel: "Send us an email",
            target: "_self",
          },
        ];

        if (!cancelled) {
          setContactCards(dynamicCards);
          if (iframe) setMapIframe(iframe);
          if (d.image) setBgImage(d.image);          
        }
      } catch {
        // keep skeleton cards silently — or you could set real fallback values here
      }
    }

    loadContactInfo();
    return () => { cancelled = true; };
  }, [locale, commonT]);

  // ─── Submit ───────────────────────────────────────────────────────────────
  const onSubmit = useCallback(async (values: ContactFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    values.name,
          email:   values.email,
          code:    values.code,   // route.ts strips the leading + and builds fullPhone
          phone:   values.phone,
          subject: values.subject,
          country: values.country,
          message: values.message,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Something went wrong. Please try again.");
        return;
      }

      toast.success("Message sent! We'll be in touch within 24 hours.");
      reset();
      router.push("/thank-you");
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [reset, router]);

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
      <section className="min-h-screen bg-[var(--main-grey)]">
        {/* ── PAGE HEADER ── */}
          <div 
            className="contact-hero relative py-14 sm:py-20 text-center overflow-hidden"   
            style={{
              backgroundImage: bgImage 
                ? `linear-gradient(135deg, rgba(39,34,98,0.90) 0%, rgba(61,53,134,0.84) 50%, rgba(39,34,98,0.92) 100%), url(${bgImage})` 
                : `linear-gradient(135deg, rgba(39,34,98,0.90) 0%, rgba(61,53,134,0.84) 50%, rgba(39,34,98,0.92) 100%)`,
            }}
          >
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
            <div className="absolute -top-10 -left-10 w-48 h-48 border-[3px] border-[var(--main-color)] rounded-full opacity-[0.12]" />
            <div className="absolute top-6 left-6 w-24 h-24 border-[2px] border-[var(--main-color)] rounded-full opacity-[0.10]" />
            <div className="absolute -bottom-12 -right-12 w-56 h-56 border-[3px] border-[var(--main-color)] rounded-full opacity-[0.12]" />
            <div className="absolute bottom-8 right-10 w-20 h-20 border-[2px] border-[var(--main-color)] rotate-45 opacity-[0.14]" />
          </div>

          <nav aria-label={t("breadcrumb")} className="relative z-10 flex items-center justify-center gap-1.5 flex-wrap mb-7 px-4">
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
              {t("contact_sub_title")}  
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
              {t("contact_title")}
            </h1>
            <p className="text-white/72 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              {t("contact_content")}
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
                  {t("send_us_a_message_title")}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t("send_us_a_message_title")}
                 
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-7"
                noValidate
              >
                {/* Full Name */}
                <div className="relative sm:col-span-1">
                  <input
                    type="text"
                    autoComplete="name"
                    className={inputClass("name")}
                    onInput={(event) => {
                      event.currentTarget.value = event.currentTarget.value.replace(
                        /[^\p{L}\p{M}'\-\s.]/gu,
                        "",
                      );
                    }}
                    {...register("name")}
                  />
                  <label className={labelClass}>{t("full_name")}</label>
                  {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="relative sm:col-span-1">
                  <input type="email" autoComplete="email" className={inputClass("email")} {...register("email")} />
                  <label className={labelClass}>{t("email_address")}</label>
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
                      <option value="" disabled hidden></option>
                      <option value="213">{t("algeria_213")}</option>
                      <option value="54">{t("argentina_54")}</option>
                      <option value="374">{t("armenia_374")}</option>
                      <option value="61">{t("australia_61")}</option>
                      <option value="43">{t("austria_43")}</option>
                      <option value="973">{t("bahrain_973")}</option>
                      <option value="880">{t("bangladesh_880")}</option>
                      <option value="32">{t("belgium_32")}</option>
                      <option value="55">{t("brazil_55")}</option>
                      <option value="1">{t("canada_1")}</option>
                      <option value="56">{t("chile_56")}</option>
                      <option value="86">{t("china_86")}</option>
                      <option value="57">{t("colombia_57")}</option>
                      <option value="20">{t("egypt_20")}</option>
                      <option value="33">{t("france_33")}</option>
                      <option value="49">{t("germany_49")}</option>
                      <option value="30">{t("greece_30")}</option>
                      <option value="852">{t("hong_kong_852")}</option>
                      <option value="91">{t("india_91")}</option>
                      <option value="62">{t("indonesia_62")}</option>
                      <option value="98">{t("iran_98")}</option>
                      <option value="964">{t("iraq_964")}</option>
                      <option value="353">{t("ireland_353")}</option>
                      <option value="972">{t("israel_972")}</option>
                      <option value="39">{t("italy_39")}</option>
                      <option value="81">{t("japan_81")}</option>
                      <option value="962">{t("jordan_962")}</option>
                      <option value="965">{t("kuwait_965")}</option>
                      <option value="961">{t("lebanon_961")}</option>
                      <option value="60">{t("malaysia_60")}</option>
                      <option value="52">{t("mexico_52")}</option>
                      <option value="212">{t("morocco_212")}</option>
                      <option value="31">{t("netherlands_31")}</option>
                      <option value="64">{t("new_zealand_64")}</option>
                      <option value="234">{t("nigeria_234")}</option>
                      <option value="47">{t("norway_47")}</option>
                      <option value="968">{t("oman_968")}</option>
                      <option value="92">{t("pakistan_92")}</option>
                      <option value="970">{t("palestine_970")}</option>
                      <option value="63">{t("philippines_63")}</option>
                      <option value="48">{t("poland_48")}</option>
                      <option value="351">{t("portugal_351")}</option>
                      <option value="974">{t("qatar_974")}</option>
                      <option value="40">{t("romania_40")}</option>
                      <option value="7">{t("russia_7")}</option>
                      <option value="966">{t("saudi_arabia_966")}</option>
                      <option value="65">{t("singapore_65")}</option>
                      <option value="27">{t("south_africa_27")}</option>
                      <option value="82">{t("south_korea_82")}</option>
                      <option value="34">{t("spain_34")}</option>
                      <option value="94">{t("sri_lanka_94")}</option>
                      <option value="46">{t("sweden_46")}</option>
                      <option value="41">{t("switzerland_41")}</option>
                      <option value="963">{t("syria_963")}</option>
                      <option value="886">{t("taiwan_886")}</option>
                      <option value="66">{t("thailand_66")}</option>
                      <option value="216">{t("tunisia_216")}</option>
                      <option value="90">{t("turkey_90")}</option>
                      <option value="971">{t("uae_971")}</option>
                      <option value="44">{t("uk_44")}</option>
                      <option value="380">{t("ukraine_380")}</option>
                      <option value="1">{t("usa_1")}</option>
                      <option value="998">{t("uzbekistan_998")}</option>
                      <option value="84">{t("vietnam_84")}</option>
                      <option value="967">{t("yemen_967")}</option>
                    </select>
                    <label className={labelClass}>{t("code")}</label>
                    {errors.code && <p className="mt-1.5 text-xs text-red-600">{errors.code.message}</p>}
                  </div>

                  <div className="relative flex-1">
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="tel-national"
                      className={inputClass("phone")}
                      onInput={(event) => {
                        event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
                      }}
                      {...register("phone")}
                    />
                    <label className={labelClass}>{t("phone_number")}</label>
                    {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone.message}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div className="relative sm:col-span-1">
                  <input type="text" autoComplete="off" className={inputClass("subject")} {...register("subject")} />
                  <label className={labelClass}>{t("subject")}</label>
                  {errors.subject && <p className="mt-1.5 text-xs text-red-600">{errors.subject.message}</p>}
                </div>

                {/* Country */}
                <div className="relative sm:col-span-1">
                  <select
                    className={`${inputClass("country")} appearance-none cursor-pointer`}
                    defaultValue=""
                    {...register("country")}
                  >
                    <option value="" disabled hidden></option>
                    <option value="Afghanistan">{t("afghanistan")}</option>
                    <option value="Albania">{t("albania")}</option>
                    <option value="Algeria">{t("algeria")}</option>
                    <option value="Argentina">{t("argentina")}</option>
                    <option value="Armenia">{t("armenia")}</option>
                    <option value="Australia">{t("australia")}</option>
                    <option value="Austria">{t("austria")}</option>
                    <option value="Azerbaijan">{t("azerbaijan")}</option>
                    <option value="Bahrain">{t("bahrain")}</option>
                    <option value="Bangladesh">{t("bangladesh")}</option>
                    <option value="Belarus">{t("belarus")}</option>
                    <option value="Belgium">{t("belgium")}</option>
                    <option value="Bolivia">{t("bolivia")}</option>
                    <option value="Brazil">{t("brazil")}</option>
                    <option value="Bulgaria">{t("bulgaria")}</option>
                    <option value="Cambodia">{t("cambodia")}</option>
                    <option value="Canada">{t("canada")}</option>
                    <option value="Chile">{t("chile")}</option>
                    <option value="China">{t("china")}</option>
                    <option value="Colombia">{t("colombia")}</option>
                    <option value="Croatia">{t("croatia")}</option>
                    <option value="Cuba">{t("cuba")}</option>
                    <option value="Czech Republic">{t("czech_republic")}</option>
                    <option value="Denmark">{t("denmark")}</option>
                    <option value="Ecuador">{t("ecuador")}</option>
                    <option value="Egypt">{t("egypt")}</option>
                    <option value="Ethiopia">{t("ethiopia")}</option>
                    <option value="Finland">{t("finland")}</option>
                    <option value="France">{t("france")}</option>
                    <option value="Germany">{t("germany")}</option>
                    <option value="Ghana">{t("ghana")}</option>
                    <option value="Greece">{t("greece")}</option>
                    <option value="Hungary">{t("hungary")}</option>
                    <option value="India">{t("india")}</option>
                    <option value="Indonesia">{t("indonesia")}</option>
                    <option value="Iran">{t("iran")}</option>
                    <option value="Iraq">{t("iraq")}</option>
                    <option value="Ireland">{t("ireland")}</option>
                    <option value="Israel">{t("israel")}</option>
                    <option value="Italy">{t("italy")}</option>
                    <option value="Japan">{t("japan")}</option>
                    <option value="Jordan">{t("jordan")}</option>
                    <option value="Kazakhstan">{t("kazakhstan")}</option>
                    <option value="Kenya">{t("kenya")}</option>
                    <option value="Kuwait">{t("kuwait")}</option>
                    <option value="Lebanon">{t("lebanon")}</option>
                    <option value="Libya">{t("libya")}</option>
                    <option value="Malaysia">{t("malaysia")}</option>
                    <option value="Mexico">{t("mexico")}</option>
                    <option value="Morocco">{t("morocco")}</option>
                    <option value="Netherlands">{t("netherlands")}</option>
                    <option value="New Zealand">{t("new_zealand")}</option>
                    <option value="Nigeria">{t("nigeria")}</option>
                    <option value="Norway">{t("norway")}</option>
                    <option value="Oman">{t("oman")}</option>
                    <option value="Pakistan">{t("pakistan")}</option>
                    <option value="Palestine">{t("palestine")}</option>
                    <option value="Peru">{t("peru")}</option>
                    <option value="Philippines">{t("philippines")}</option>
                    <option value="Poland">{t("poland")}</option>
                    <option value="Portugal">{t("portugal")}</option>
                    <option value="Qatar">{t("qatar")}</option>
                    <option value="Romania">{t("romania")}</option>
                    <option value="Russia">{t("russia")}</option>
                    <option value="Saudi Arabia">{t("saudi_arabia")}</option>
                    <option value="Singapore">{t("singapore")}</option>
                    <option value="South Africa">{t("south_africa")}</option>
                    <option value="South Korea">{t("south_korea")}</option>
                    <option value="Spain">{t("spain")}</option>
                    <option value="Sri Lanka">{t("sri_lanka")}</option>
                    <option value="Sudan">{t("sudan")}</option>
                    <option value="Sweden">{t("sweden")}</option>
                    <option value="Switzerland">{t("switzerland")}</option>
                    <option value="Syria">{t("syria")}</option>
                    <option value="Taiwan">{t("taiwan")}</option>
                    <option value="Thailand">{t("thailand")}</option>
                    <option value="Tunisia">{t("tunisia")}</option>
                    <option value="Turkey">{t("turkey")}</option>
                    <option value="UAE">{t("uae")}</option>
                    <option value="Uganda">{t("uganda")}</option>
                    <option value="UK">{t("united_kingdom")}</option>
                    <option value="Ukraine">{t("ukraine")}</option>
                    <option value="USA">{t("united_states")}</option>
                    <option value="Uzbekistan">{t("uzbekistan")}</option>
                    <option value="Venezuela">{t("venezuela")}</option>
                    <option value="Vietnam">{t("vietnam")}</option>
                    <option value="Yemen">{t("yemen")}</option>
                    <option value="Zambia">{t("zambia")}</option>
                    <option value="Zimbabwe">{t("zimbabwe")}</option>
                  </select>
                  <label className={labelClass}>{t("country")}</label>
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
                  <label className={labelClass}>{t("your_message")}</label>
                  {errors.message && <p className="mt-1.5 text-xs text-red-600">{errors.message.message}</p>}
                </div>

                {/* Submit */}
                <div className="sm:col-span-2 mt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[var(--main-color)] hover:bg-[var(--second-color)] text-[var(--second-color)] hover:text-[var(--main-color)] font-bold px-8 py-3.5 rounded-full transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {loading ? "Sending…" : t("send_us_a_message_button")}
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* ✅ FIX 2: Map wrapped in memo component — won't re-render on form changes */}
            {mapIframe && <ContactMap html={mapIframe} />}
          </div>
        </div>
      </section>
    </>
  );
}

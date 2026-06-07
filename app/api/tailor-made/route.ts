// app/api/tailor-made/route.ts
// GET  → proxies static form data  (was: app/api/tailor-made-data/route.ts)
// POST → submits tailor-made form  (unchanged)

import { NextRequest, NextResponse } from "next/server";
import { tailorMadeSchema, type TailorMadeFormData } from "@/lib/validations/tailor-made.schema";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
).replace(/\/+$/, "");

// ── GET: fetch static tailor-made form data ──────────────────────────────────
export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") ?? "en";
  const externalUrl = `https://www.egypttoursgate.com/api/v1/forms/get/tailor-made?locale=${locale}`;

  try {
    const res = await fetch(externalUrl, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: `Upstream error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[tailor-made GET proxy] fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Proxy fetch failed" },
      { status: 502 }
    );
  }
}

// ── POST payload types ────────────────────────────────────────────────────────
type TailorMadePayload = {
  name: string;
  email: string;
  phone: string;
  code: string;
  nationality: string;
  arrival_date:   string | null;  // nullable
  departure_date: string | null;  // nullable
  month:          string | null;  // nullable
  days:           string | null;  // nullable
  adults_number: number;
  children_number: number;
  hotel_category?: number;
  message?: string;
  cities?: string[];
  infants?:    string;
  max_price?:  string;
  min_price?:  string;
};
function buildPayload(data: TailorMadeFormData): TailorMadePayload {
  const phoneCode = data.phoneCode.replace(/^\+/, "");
  const phoneNumber = data.phoneNumber.replace(/^\+/, "").trim();

  return {
    ...data,
    name: data.fullName,
    phone: phoneNumber,
    code: phoneCode,
    nationality: data.nationality,
    arrival_date:   data.timeOption === "exact" && data.checkIn   ? data.checkIn   : null,
    departure_date: data.timeOption === "exact" && data.checkOut  ? data.checkOut  : null,
    month:          data.timeOption === "month" && data.monthSelect ? data.monthSelect : null,
    days:           data.timeOption === "days"  && data.vacationDays ? data.vacationDays : null,
    adults_number: data.adults,
    children_number: data.children,
    hotel_category: Number.parseInt(data.hotel, 10) || undefined,
    message: data.additionalInfo || undefined,
    cities: data.cities,
    infants:   String(data.infants),
    max_price: String(data.priceMax),
    min_price: String(data.priceMin),
  };
}

// ── POST: submit tailor-made form ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let json: unknown;

  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsed = tailorMadeSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Please review the form fields.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const UPSTREAM = `${API_BASE}/forms/tailor-made`;

  try {
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(buildPayload(parsed.data)),
    });

    const text = await upstream.text();
    console.log("[tailor-made POST proxy] upstream response:", { status: upstream.status, text });
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : { success: upstream.ok };
    } catch {
      body = {
        success: false,
        message: "Invalid response from tailor-made service.",
      };
    }

    return NextResponse.json(body, { status: upstream.status });
  } catch (error) {
    console.error("[tailor-made POST proxy] upstream error:", error);
    return NextResponse.json(
      { success: false, message: "Could not reach tailor-made service. Please try again." },
      { status: 502 }
    );
  }
}
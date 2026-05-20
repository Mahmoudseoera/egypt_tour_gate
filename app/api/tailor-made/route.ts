import { NextRequest, NextResponse } from "next/server";
import { tailorMadeSchema, type TailorMadeFormData } from "@/lib/validations/tailor-made.schema";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
).replace(/\/+$/, "");

const UPSTREAM = `${API_BASE}/forms/tailor-made`;

type TailorMadePayload = {
  name: string;
  email: string;
  phone: string;
  code: string;
  nationality: string;
  arrival_date?: string;
  departure_date?: string;
  adults_number: number;
  children_number: number;
  hotel_category?: number;
  message?: string;
  cities?: string[];
  month?: string;
  days?: string;
  infants?: string;
  max_price?: string;
  min_price?: string;
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
    arrival_date: data.timeOption === "exact" ? data.checkIn : undefined,
    departure_date: data.timeOption === "exact" ? data.checkOut : undefined,
    adults_number: data.adults,
    children_number: data.children,
    hotel_category: Number.parseInt(data.hotel, 10) || undefined,
    message: data.additionalInfo || undefined,
    cities: data.cities,
    month: data.timeOption === "month" ? data.monthSelect : undefined,
    days: data.timeOption === "days" ? data.vacationDays : undefined,
    infants: String(data.infants),
    max_price: String(data.priceMax),
    min_price: String(data.priceMin),
  };
}

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
    console.error("[tailor-made-proxy] upstream error:", error);
    return NextResponse.json(
      { success: false, message: "Could not reach tailor-made service. Please try again." },
      { status: 502 }
    );
  }
}

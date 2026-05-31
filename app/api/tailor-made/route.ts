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
  selected_month?: string;
  days?: string;
  days_count?: string;
  infants?: string;
  max_price?: string;
  min_price?: string;
};

function getExactDaysCount(checkIn: string, checkOut: string) {
  const [startYear, startMonth, startDay] = checkIn.split("-").map(Number);
  const [endYear, endMonth, endDay] = checkOut.split("-").map(Number);
  if (!startYear || !startMonth || !startDay || !endYear || !endMonth || !endDay) return undefined;

  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return days > 0 ? String(days) : undefined;
}

function buildPayload(data: TailorMadeFormData): TailorMadePayload {
  const phoneCode = data.phoneCode.replace(/^\+/, "");
  const phoneNumber = data.phoneNumber.replace(/^\+/, "").trim();
  const daysCount = data.timeOption === "exact"
    ? getExactDaysCount(data.checkIn, data.checkOut)
    : data.vacationDays || undefined;

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
    month: data.monthSelect || undefined,
    selected_month: data.monthSelect || undefined,
    days: daysCount,
    days_count: daysCount,
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

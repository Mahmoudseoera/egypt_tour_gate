import { NextRequest, NextResponse } from "next/server";
import { tailorMadeSchema, type TailorMadeFormData } from "@/lib/validations/tailor-made.schema";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
).replace(/\/+$/, "");

const UPSTREAM = `${API_BASE}/forms/tailor-made`;

type TailorMadePayload = TailorMadeFormData & {
  name: string;
  phone: string;
  code: string;
  country: string;
  cities_ids: string[];
  cities_names: string[];
  arrival_date?: string;
  departure_date?: string;
  approx_month?: string;
  vacation_days?: number;
  adult_number: number;
  children_number: number;
  infants_number: number;
  budget_from: number;
  budget_to: number;
  msg_body: string;
};

function buildPayload(data: TailorMadeFormData): TailorMadePayload {
  const phoneCode = data.phoneCode.replace(/^\+/, "");
  const phoneNumber = data.phoneNumber.replace(/^\+/, "").trim();

  return {
    ...data,
    name: data.fullName,
    phone: phoneNumber,
    code: phoneCode,
    country: data.nationality,
    cities_ids: data.cities,
    cities_names: data.cities,
    arrival_date: data.timeOption === "exact" ? data.checkIn : undefined,
    departure_date: data.timeOption === "exact" ? data.checkOut : undefined,
    approx_month: data.timeOption === "month" ? data.monthSelect : undefined,
    vacation_days: data.timeOption === "days" ? Number(data.vacationDays) : undefined,
    adult_number: data.adults,
    children_number: data.children,
    infants_number: data.infants,
    budget_from: data.priceMin,
    budget_to: data.priceMax,
    msg_body: data.additionalInfo,
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

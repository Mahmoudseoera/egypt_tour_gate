// app/api/contact/route.ts
// ✅ لازم يكون هنا: app/api/contact/route.ts  (برّا [locale])

import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact.schema";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
).replace(/\/+$/, "");

const CONTACT_ENDPOINT = `${API_BASE}/forms/contact`;
const CONTACT_GET_ENDPOINT = `${API_BASE}/forms/get/contact`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale");
  const url = locale ? `${CONTACT_GET_ENDPOINT}?locale=${locale}` : CONTACT_GET_ENDPOINT;

  try {
    const externalRes = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300, tags: ["contact-form-info"] },
    });

    const contentType = externalRes.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, message: `External API error (${externalRes.status})` },
        { status: 502 }
      );
    }

    const data = await externalRes.json();
    return NextResponse.json(data, { status: externalRes.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the server" },
      { status: 502 }
    );
  }
}

export async function POST(req: NextRequest) {
  // ── STEP 1: استقبل الـ body ──────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // ── STEP 2: Validate بنفس الـ schema ────────────────────────────────────
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: fieldErrors },
      { status: 400 }
    );
  }

  // ── STEP 3: جمّع code + phone قبل الإرسال ───────────────────────────────
  // الـ frontend بيبعت code و phone منفصلين
  // الـ API الخارجي بيتوقع phone كـ string واحد زي "+201110008407"
  const { code, phone, ...rest } = result.data;
  const payload = {
    ...rest,
    phone: code ? `+${code}${phone}` : phone,
  };

  // ── STEP 4: ابعت للـ API الخارجي ────────────────────────────────────────
  let externalRes: Response;
  try {
    externalRes = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (networkErr) {
    console.error("Network error reaching external API:", networkErr);
    return NextResponse.json(
      { success: false, message: "Could not reach the server. Please try again." },
      { status: 502 }
    );
  }

  // ── STEP 5: اقرأ الـ response ────────────────────────────────────────────
  const rawText = await externalRes.text();

  // لو الـ response مش JSON (HTML error page مثلاً)
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(rawText);
  } catch {
    console.error("External API returned non-JSON:", rawText.slice(0, 300));
    return NextResponse.json(
      {
        success: false,
        message: `External API error (${externalRes.status}). Please try again.`,
      },
      { status: 502 }
    );
  }

  // ── STEP 6: رجّع نفس الـ response للـ client ─────────────────────────────
  return NextResponse.json(data, { status: externalRes.status });
}

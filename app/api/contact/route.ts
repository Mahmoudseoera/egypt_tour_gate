// app/api/contact/route.ts
// ✅ لازم يكون هنا: app/api/contact/route.ts  (برّا [locale])

import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact.schema";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
).replace(/\/+$/, "");

const CONTACT_ENDPOINT = `${API_BASE}/forms/contact`;

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

  console.log("📥 Body received from frontend:", JSON.stringify(body, null, 2));

  // ── STEP 2: Validate بنفس الـ schema ────────────────────────────────────
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    // ده هيظهر في terminal بتاعك بالظبط أي field فشل
    console.error("❌ Validation failed:", JSON.stringify(fieldErrors, null, 2));
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

  console.log("📤 Payload being sent to external API:", JSON.stringify(payload, null, 2));
  console.log("🌐 External endpoint:", CONTACT_ENDPOINT);

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
    // مشكلة network — الـ API الخارجي مش متاح أصلاً
    console.error("🔴 Network error reaching external API:", networkErr);
    return NextResponse.json(
      { success: false, message: "Could not reach the server. Please try again." },
      { status: 502 }
    );
  }

  // ── STEP 5: اقرأ الـ response ────────────────────────────────────────────
  const rawText = await externalRes.text(); // نقرأ كـ text الأول عشان نشوف أي حاجة
  console.log(`📨 External API status: ${externalRes.status}`);
  console.log("📨 External API raw response:", rawText);

  // لو الـ response مش JSON (HTML error page مثلاً)
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(rawText);
  } catch {
    console.error("🔴 External API returned non-JSON:", rawText.slice(0, 300));
    return NextResponse.json(
      {
        success: false,
        message: `External API error (${externalRes.status}). Please try again.`,
      },
      { status: 502 }
    );
  }

  console.log("✅ External API parsed response:", JSON.stringify(data, null, 2));

  // ── STEP 6: رجّع نفس الـ response للـ client ─────────────────────────────
  return NextResponse.json(data, { status: externalRes.status });
}

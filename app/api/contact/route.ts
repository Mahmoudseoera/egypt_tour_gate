// app/api/contact/route.ts
// ✅ المكان الصح: app/api/contact/route.ts  (برّا [locale] تماماً)
//
// التصميم:
//   - الـ validation كلها بتحصل على الـ frontend (react-hook-form + zod)
//   - الـ server مش بيعمل validation تانية — بيثق في الـ frontend
//   - الـ server بس بيجمّع code + phone ويبعت للـ external API
//
// GET  → proxy لـ /forms/get/contact  (بيانات الكروت)
// POST → proxy لـ /forms/contact      (إرسال الفورم)

import { NextRequest, NextResponse } from "next/server";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
).replace(/\/+$/, "");

const CONTACT_POST_ENDPOINT = `${API_BASE}/forms/contact`;
const CONTACT_GET_ENDPOINT  = `${API_BASE}/forms/get/contact`;

// ─────────────────────────────────────────────────────────────────────────────
// GET — جيب بيانات الكروت (phone / email / address)
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") ?? "en";
  const url    = `${CONTACT_GET_ENDPOINT}?locale=${locale}`;

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

  } catch (err) {
    console.error("[GET /api/contact] network error:", err);
    return NextResponse.json(
      { success: false, message: "Could not reach the server" },
      { status: 502 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST — إرسال الفورم
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // ── 1. اقرأ الـ body ───────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  // ── 2. جمّع code + phone في field واحد ────────────────────────────────────
  // الـ frontend بيبعت { code: "20", phone: "1110008407" }
  // الـ external API بيتوقع { phone: "+201110008407" }
  const code  = typeof body.code  === "string" ? body.code.trim()  : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  // ابني الـ payload النهائي اللي هيتبعت للـ API
  const payload: Record<string, unknown> = {
    name:    body.name,
    email:   body.email,
    subject: body.subject,
    country: body.country,
    message: body.message,
    // phone مدموج: "+201110008407"
    phone: code ? `+${code}${phone}` : phone,
  };

  // ── 3. ابعت للـ external API (server-to-server → مفيش CORS) ───────────────
  let externalRes: Response;
  try {
    externalRes = await fetch(CONTACT_POST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[POST /api/contact] network error:", err);
    return NextResponse.json(
      { success: false, message: "Could not reach the server. Please try again." },
      { status: 502 }
    );
  }

  // ── 4. اقرأ الـ response كـ text الأول (لو مش JSON ميقعش في crash) ────────
  const rawText = await externalRes.text();

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(rawText);
  } catch {
    console.error("[POST /api/contact] non-JSON response:", rawText.slice(0, 300));
    return NextResponse.json(
      { success: false, message: `Server error (${externalRes.status}). Please try again.` },
      { status: 502 }
    );
  }

  // ── 5. رجّع نفس الـ response للـ client ───────────────────────────────────
  return NextResponse.json(data, { status: externalRes.status });
}

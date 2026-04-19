// app/api/contact/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
).replace(/\/+$/, "");

const CONTACT_GET_ENDPOINT = `${API_BASE}/forms/get/contact`;
const CONTACT_POST_ENDPOINT = `${API_BASE}/forms/contact`;

// ─────────────────────────────────────────────
// ✅ GET → fetch contact page data
// Response shape: { success, data: { phone, mobile, email, address, iframe, ... } }
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale");

  const url = locale
    ? `${CONTACT_GET_ENDPOINT}?locale=${locale}`
    : CONTACT_GET_ENDPOINT;

  try {
    const externalRes = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
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
    console.error("[GET /api/contact] error:", err);
    return NextResponse.json(
      { success: false, message: "Could not reach the server" },
      { status: 502 }
    );
  }
}

// ─────────────────────────────────────────────
// ✅ POST → send contact form
//
// Backend expects these exact fields:
//   name, email, phone, code, country, msg_title, msg_body
//
// The phone is sent separately as `code` + `phone` (the backend handles combining).
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Strip leading "+" from code if user included it
  const rawCode = typeof body.code === "string" ? body.code.replace(/^\+/, "").trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  // Build payload matching backend field names exactly (from API screenshot)
  const payload = {
    name:      body.name,
    email:     body.email,
    phone:     phone,
    code:      rawCode,
    country:   body.country,
    msg_title: body.subject,   // ← backend field name from API screenshot
    msg_body:  body.message,   // ← backend field name from API screenshot
  };

  try {
    const externalRes = await fetch(CONTACT_POST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await externalRes.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("[POST /api/contact] Non-JSON response:", text);
      return NextResponse.json(
        { success: false, message: "Invalid response from server" },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { status: externalRes.status });
  } catch (err) {
    console.error("[POST /api/contact] error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 502 }
    );
  }
}

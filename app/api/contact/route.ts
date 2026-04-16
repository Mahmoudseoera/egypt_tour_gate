// app/api/contact/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
).replace(/\/+$/, "");

const CONTACT_GET_ENDPOINT = `${API_BASE}/forms/get/contact`;
const CONTACT_POST_ENDPOINT = `${API_BASE}/forms/contact`;

// ─────────────────────────────────────────────
// ✅ GET → fetch contact info
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

  const code = typeof body.code === "string" ? body.code.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  const payload = {
    name: body.name,
    email: body.email,
    subject: body.subject,
    country: body.country,
    message: body.message,
    phone: code ? `+${code}${phone}` : phone,
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
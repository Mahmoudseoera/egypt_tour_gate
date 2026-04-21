// app/api/contact/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
).replace(/\/+$/, "");

const CONTACT_GET_ENDPOINT = `${API_BASE}/forms/get/contact`;
const CONTACT_POST_ENDPOINT = `${API_BASE}/forms/contact`;

// ─────────────────────────────────────────────
// ✅ GET → fetch contact page data
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
// ✅ FIX: Validate all required fields before sending to the external API.
//    Missing/empty fields were causing the backend to return 500.
//    The backend expects: name, email, phone, country, msg_title, msg_body
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: any;

  try {
    body = await req.json();
    console.log("📥 Incoming body:", body);
  } catch {
    console.error("❌ Invalid JSON");
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // ✅ FIX: Safely extract and validate each field before building the payload.
  const name    = typeof body.name    === "string" ? body.name.trim()    : "";
  const email   = typeof body.email   === "string" ? body.email.trim()   : "";
  const country = typeof body.country === "string" ? body.country.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  // ✅ FIX: Build the full phone number correctly.
  // `code` comes in as a plain number string e.g. "20", never has a leading "+".
  const rawCode = typeof body.code  === "string" ? body.code.replace(/^\+/, "").trim()  : "";
  const phone   = typeof body.phone === "string" ? body.phone.replace(/^\+/, "").trim() : "";

  // ✅ FIX: Guard — if any required field is missing, return 400 immediately
  //    instead of forwarding an incomplete payload that makes the backend crash.
  const missing: string[] = [];
  if (!name)    missing.push("name");
  if (!email)   missing.push("email");
  if (!rawCode) missing.push("code");
  if (!phone)   missing.push("phone");
  if (!country) missing.push("country");
  if (!subject) missing.push("subject (msg_title)");
  if (!message) missing.push("message (msg_body)");

  if (missing.length > 0) {
    console.error("❌ Missing fields:", missing);
    return NextResponse.json(
      { success: false, message: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  // const fullPhone = `+${rawCode}${phone}`;

  const payload = {
    name,
    email,
    code: rawCode,
    phone:  phone,
    country,
    msg_title: subject,
    msg_body:  message,
  };

  console.log("📤 Payload sent to API:", payload);
  console.log("🌍 Endpoint:", CONTACT_POST_ENDPOINT);

  try {
    const externalRes = await fetch(CONTACT_POST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("📡 Status:", externalRes.status);

    const text = await externalRes.text();
    console.log("📡 Raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Not JSON response");
      return NextResponse.json(
        { success: false, message: "Invalid response from server" },
        { status: 502 }
      );
    }

    console.log("✅ Parsed response:", data);

    return NextResponse.json(data, { status: externalRes.status });

  } catch (err) {
    console.error("🔥 Fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 502 }
    );
  }
}

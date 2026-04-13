// app/api/general/route.ts
//
// ✅ لازم يكون برّا [locale] — مش جوّاه
//    app/
//    ├── api/
//    │   └── general/
//    │       └── route.ts   ← هنا
//    └── [locale]/
//        └── ...
//
// السبب: GeneralApi.ts هو "use client" يعني الـ fetch بيحصل من البراوزر.
// لو بعت للـ external API مباشرة → CORS error.
// الحل: البراوزر يبعت لـ /api/general (same origin ✅)
// والـ route ده يعمل fetch للـ external API من الـ server (مفيش CORS).

import { NextRequest, NextResponse } from "next/server";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
).replace(/\/+$/, ""); // ← مهم: يشيل الـ trailing slash عشان ميحصلش double slash

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") ?? "en";

  const url = `${API_BASE}/general-data?locale=${locale}`;

  try {
    const externalRes = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600, tags: ["general"] },
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
    console.error("[/api/general] proxy error:", err);
    return NextResponse.json(
      { success: false, message: "Could not reach the server" },
      { status: 502 }
    );
  }
}

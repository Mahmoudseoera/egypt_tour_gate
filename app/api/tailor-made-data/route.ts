// app/api/tailor-made-data/route.ts
// Server-side proxy → forwards to external API, avoiding browser CORS.
// GET /api/tailor-made-data?locale=en

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") ?? "en";

  const externalUrl = `https://www.egypttoursgate.com/api/v1/forms/get/tailor-made?locale=${locale}`;

  try {
    const res = await fetch(externalUrl, {
      // ISR: revalidate every hour — static data changes infrequently
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: `Upstream error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[tailor-made-data proxy] fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Proxy fetch failed" },
      { status: 502 }
    );
  }
}

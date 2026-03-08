// app/api/general/route.ts
// Server-side proxy – forwards to the real backend so the browser never
// hits a CORS wall, and keeps the backend URL out of client bundles.
//
// Usage from client:
//   fetch("/api/general?locale=en")
//   fetch("/api/general?locale=de")

import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") ?? "en";

  try {
    const upstream = await fetch(`${API_BASE_URL}/general-data?locale=${locale}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Backend responded with ${upstream.status} ${upstream.statusText}`,
        },
        { status: upstream.status }
      );
    }

    const json = await upstream.json();
    return NextResponse.json(json);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

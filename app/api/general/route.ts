import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isSupportedLocale } from "@/lib/i18n/config";

export async function GET(request: NextRequest) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "API_BASE_URL is not configured" },
      { status: 500 }
    );
  }

  const queryLocale = request.nextUrl.searchParams.get("locale");
  const headerLocale = request.headers.get("x-locale");
  const locale =
    (queryLocale && isSupportedLocale(queryLocale) && queryLocale) ||
    (headerLocale && isSupportedLocale(headerLocale) && headerLocale) ||
    DEFAULT_LOCALE;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/general-data?locale=${locale}`, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch data" },
      { status: 500 }
    );
  }
}

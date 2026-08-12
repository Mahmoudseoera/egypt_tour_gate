import { NextRequest, NextResponse } from 'next/server';
import { fetchSiteSettings } from "@/lib/api/settingsApi";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") ?? "en";
  const settings = await fetchSiteSettings(locale);
  return NextResponse.json({ success: true, data: settings });
}

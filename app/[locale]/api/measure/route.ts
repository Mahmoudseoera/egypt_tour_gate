// app/api/measure/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format roughly
    try {
      new URL(url);
    } catch (_) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const startTime = performance.now();

    // We fetch the URL from the server to avoid CORS issues
    const response = await fetch(url, { 
      method: 'GET',
      // Important: Don't follow redirects automatically if you want to test the endpoint specifically,
      // but usually 'follow' is safer for general testing.
      redirect: 'follow', 
      cache: 'no-store' // Ensure we get a fresh response time, not a cached one
    });

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    return NextResponse.json({
      url,
      status: response.status,
      durationMs: duration,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch API. Check if the URL allows server-side requests.' }, { status: 500 });
  }
}
/**
 * app/api/booking/route.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Optional server-side proxy.
 *
 * USE THIS if the external API:
 *   a) doesn't have CORS headers allowing your browser origin, OR
 *   b) requires a secret API key you don't want in the browser bundle.
 *
 * When active, change the fetch URL in booking-api.ts to:
 *   const BOOKING_ENDPOINT = '/api/booking';
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from 'next/server';
import type { BookingApiPayload } from '@/lib/api/booking-api';

const UPSTREAM = 'https://www.egypttoursgate.com/api/v1/forms/booking-store';

export async function POST(req: NextRequest): Promise<NextResponse> {
  let payload: BookingApiPayload;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body.' },
      { status: 400 }
    );
  }

  // Basic server-side guard
  if (!payload.tour_id || !payload.email || !payload.name) {
    return NextResponse.json(
      { success: false, message: 'Missing required booking fields.' },
      { status: 422 }
    );
  }

  try {
    const upstream = await fetch(UPSTREAM, {
      method:  'POST',
      headers: {
        'Content-Type':     'application/json',
        'Accept':           'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        // Inject secret server-side — never exposed to the browser:
        // 'Authorization': `Bearer ${process.env.BOOKING_API_SECRET}`,
      },
      body: JSON.stringify(payload),
    });

    const body = await upstream.json();
    return NextResponse.json(body, { status: upstream.status });
  } catch (err) {
    console.error('[booking-proxy] upstream error:', err);
    return NextResponse.json(
      { success: false, message: 'Could not reach booking service. Please try again.' },
      { status: 502 }
    );
  }
}

/**
 * app/api/booking/route.ts
 * Server-side proxy → https://www.egypttoursgate.com/api/v1/forms/booking-store
 *
 * IMPORTANT: the upstream API expects ALL numeric fields as strings:
 *   tour_id, adult_number, children_number → sent as "553", "2", "4"
 *   child_age                              → sent as ["7","8"]
 *
 * The guard below checks for string presence (not numeric type) to match.
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

  // Guard: all three required fields must be non-empty strings
  // (tour_id is a string like "553", not a number)
  if (
    !payload.tour_id  ||
    !payload.email    ||
    !payload.name     ||
    typeof payload.tour_id !== 'string' ||
    typeof payload.email   !== 'string' ||
    typeof payload.name    !== 'string'
  ) {
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

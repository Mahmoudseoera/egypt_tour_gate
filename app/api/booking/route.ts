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

function normalizeBookingPayload(payload: BookingApiPayload): BookingApiPayload {
  const childrenNumber = Number(payload.children_number ?? 0);
  const childAge = Array.isArray(payload.child_age) ? payload.child_age : [];

  return {
    tour_id: String(payload.tour_id ?? '').trim(),
    name: String(payload.name ?? '').trim(),
    email: String(payload.email ?? '').trim().toLowerCase(),
    phone: String(payload.phone ?? '').trim(),
    nationality: String(payload.nationality ?? '').trim(),
    arrival_date: String(payload.arrival_date ?? '').trim(),
    departure_date: String(payload.departure_date ?? '').trim(),
    adult_number: String(payload.adult_number ?? '').trim(),
    children_number: String(payload.children_number ?? '0').trim(),
    child_age: Number.isFinite(childrenNumber) && childrenNumber > 0
      ? childAge.slice(0, childrenNumber).map((age) => String(age).trim())
      : [],
    message: String(payload.message ?? '').trim(),
  };
}

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

  payload = normalizeBookingPayload(payload);

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

  // Log the payload being sent (visible in Next.js server terminal)
  console.log('[booking-proxy] sending payload:', JSON.stringify(payload, null, 2));

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

    const text = await upstream.text();
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = { success: false, message: text || 'Unexpected booking service response.' };
    }

    // Log upstream response so validation errors are visible in terminal
    if (!upstream.ok) {
      console.error('[booking-proxy] upstream rejected payload — status:', upstream.status);
      console.error('[booking-proxy] upstream error body:', JSON.stringify(body, null, 2));
    }

    return NextResponse.json(body, { status: upstream.status });
  } catch (err) {
    console.error('[booking-proxy] upstream fetch error:', err);
    return NextResponse.json(
      { success: false, message: 'Could not reach booking service. Please try again.' },
      { status: 502 }
    );
  }
}

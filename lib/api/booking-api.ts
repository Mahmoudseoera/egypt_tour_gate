/**
 * lib/api/booking-api.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Confirmed from API Dog response: the backend accepts AND returns ALL numeric
 * fields as STRINGS ("adult_number": "2", "tour_id": "553", etc.) and
 * child_age as string[] (["7","8"]).
 *
 * Previously buildBookingPayload() was calling parseInt() on these fields,
 * converting them to numbers — which caused validation errors on the server.
 * This version sends everything as strings, matching the confirmed API contract.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── 1. API Contract ──────────────────────────────────────────────────────────

/**
 * Exact JSON body the endpoint expects.
 * All "numeric" fields are sent as strings — confirmed by API Dog response.
 */
export interface BookingApiPayload {
  tour_id:         string;     // "553"
  name:            string;     // "test"
  email:           string;     // "test@gmail.com"
  phone:           string;     // "+201125544878"
  nationality:     string;     // "Belarus"
  arrival_date:    string;     // "2026-05-15"
  departure_date:  string;     // "2026-05-27"
  adult_number:    string;     // "2"
  children_number: string;     // "4"
  child_age:       string[];   // ["7","8"] or []
  message:         string;     // "message" or ""
}

/** Success response envelope */
export interface BookingApiSuccess {
  success: true;
  message: string;
  data?: {
    booking_id?: number | string;
    reference?:  string;
    id?:         number;
    [key: string]: unknown;
  };
}

/** Error response envelope (Laravel-style) */
export interface BookingApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type BookingApiResponse = BookingApiSuccess | BookingApiError;

// ─── 2. Internal Form State ───────────────────────────────────────────────────

export interface BookingFormState {
  tour_id:         string;
  name:            string;
  email:           string;
  phone:           string;    // already combined: countryCode + local number
  nationality:     string;
  arrival_date:    string;    // YYYY-MM-DD
  departure_date:  string;    // YYYY-MM-DD
  adult_number:    number;    // counter value from UI (will be stringified)
  children_number: number;    // counter value from UI (will be stringified)
  child_age:       string[];  // one entry per child, sent as-is
  message:         string;
}

// ─── 3. Phone Sanitiser ───────────────────────────────────────────────────────

/**
 * Normalises phone strings:
 *   "++201125544878" → "+201125544878"
 */
export function sanitisePhone(raw: string): string {
  return raw.replace(/^\++/, '+').replace(/[^\d+\s\-()]/g, '');
}

// ─── 4. Payload Builder ───────────────────────────────────────────────────────

/**
 * Transforms the React form state into the exact API payload.
 *
 * KEY CHANGE: all numeric fields are now sent as strings to match the
 * confirmed API contract ("adult_number": "2", not 2).
 */
export function buildBookingPayload(form: BookingFormState): BookingApiPayload {
  const payload: BookingApiPayload = {
    tour_id:         form.tour_id,                         // already a string
    name:            form.name.trim(),
    email:           form.email.trim().toLowerCase(),
    phone:           sanitisePhone(form.phone.trim()),
    nationality:     form.nationality.trim(),
    arrival_date:    form.arrival_date,
    departure_date:  form.departure_date,
    adult_number:    String(form.adult_number),            // number → string
    children_number: String(form.children_number),         // number → string
    child_age:       form.child_age
      .slice(0, form.children_number)
      .map((a) => a.trim()),                               // keep as strings
    message:         form.message.trim(),
  };

  return payload;
}

// ─── 5. Submission ────────────────────────────────────────────────────────────

export interface SubmitBookingResult {
  ok:           boolean;
  message:      string;
  data?:        BookingApiSuccess['data'];
  fieldErrors?: Record<string, string>;
}

const BOOKING_ENDPOINT = '/api/booking';

export async function submitBooking(
  payload: BookingApiPayload
): Promise<SubmitBookingResult> {
  let res: Response;

  try {
    res = await fetch(BOOKING_ENDPOINT, {
      method:  'POST',
      headers: {
        'Content-Type':     'application/json',
        'Accept':           'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      ok:      false,
      message: 'Network error — please check your connection and try again.',
    };
  }

  let body: BookingApiResponse;
  try {
    body = await res.json();
  } catch {
    return {
      ok:      false,
      message: `Server error (${res.status}). Please try again later.`,
    };
  }

  if (res.ok && body.success) {
    return {
      ok:      true,
      message: body.message || 'Booking submitted successfully!',
      data:    (body as BookingApiSuccess).data,
    };
  }

  // Error path — normalise API field names → UI field names
  const errBody   = body as BookingApiError;
  const uiErrors: Record<string, string> = {};

  if (errBody.errors) {
    const fieldMap: Record<string, string> = {
      arrival_date:    'checkIn',
      departure_date:  'checkOut',
      adult_number:    'adults',
      children_number: 'children',
    };

    for (const [apiField, messages] of Object.entries(errBody.errors)) {
      const dotIndex = apiField.match(/^child_age\.(\d+)$/);
      if (dotIndex) {
        uiErrors[`childAges_${dotIndex[1]}`] = messages[0];
      } else {
        uiErrors[fieldMap[apiField] ?? apiField] = messages[0];
      }
    }
  }

  return {
    ok:          false,
    message:     errBody.message || 'Booking failed — please review your details.',
    fieldErrors: Object.keys(uiErrors).length ? uiErrors : undefined,
  };
}

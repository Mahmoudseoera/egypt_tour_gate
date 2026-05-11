/**
 * lib/api/booking-api.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Type definitions, payload transformer, and submission logic for:
 *   POST /api/booking (server proxy to https://www.egypttoursgate.com/api/v1/forms/booking-store)
 *
 * Mapping of sample data → API payload:
 *   tour_id:          "553"            → 553         (string → number)
 *   name:             "test"           → "test"
 *   email:            "test@gmail.com" → "test@gmail.com"
 *   phone:            "++201125544878" → "+201125544878" (double-+ stripped)
 *   nationality:      "Belarus"        → "Belarus"
 *   arrival_date:     "2026-04-27"     → "2026-04-27"
 *   departure_date:   "2026-05-27"     → "2026-05-27"
 *   adult_number:     "2"              → 2           (string → number)
 *   children_number:  "4"             → 4           (string → number)
 *   child_age:        ["7","8"]        → [7, 8]     (string[] → number[])
 *
 * ⚠️  NOTE on sample data: children_number=4 but only 2 ages supplied.
 *     The form enforces child_age.length === children_number before submit.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── 1. API Contract ──────────────────────────────────────────────────────────

/** Exact JSON body the endpoint expects */
export interface BookingApiPayload {
  tour_id:         number;      // required — numeric tour ID
  name:            string;      // required — guest full name
  email:           string;      // required — valid email
  phone:           string;      // required — international format, single leading "+"
  nationality:     string;      // required — country name
  arrival_date:    string;      // required — YYYY-MM-DD
  departure_date:  string;      // required — YYYY-MM-DD, must be > arrival_date
  adult_number:    number;      // required — integer ≥ 1
  children_number: number;      // required — integer ≥ 0
  child_age?:      number[];    // conditional — required when children_number > 0
  message?:        string;      // optional — free-text note
}

/** Success response envelope */
export interface BookingApiSuccess {
  success: true;
  message: string;
  data?: {
    booking_id?: number | string;
    reference?:  string;
    [key: string]: unknown;
  };
}

/** Error response envelope (Laravel-style) */
export interface BookingApiError {
  success: false;
  message: string;
  /** Field-level validation errors: { "arrival_date": ["The arrival date must be a future date."] } */
  errors?: Record<string, string[]>;
}

export type BookingApiResponse = BookingApiSuccess | BookingApiError;

// ─── 2. Internal Form State ───────────────────────────────────────────────────

/**
 * React form state — all user inputs are strings; counters are numbers.
 * Maps directly from TourDetailsClient's FormState fields.
 */
export interface BookingFormState {
  tour_id:         string;    // from tour.id prop (not user-editable)
  name:            string;
  email:           string;
  phone:           string;    // local number (without country code prefix)
  nationality:     string;
  arrival_date:    string;    // YYYY-MM-DD — from flatpickr checkIn
  departure_date:  string;    // YYYY-MM-DD — from flatpickr checkOut
  adult_number:    number;
  children_number: number;
  child_age:       string[];  // one entry per child, cast to number on submit
  message:         string;
}

// ─── 3. Phone Sanitiser ───────────────────────────────────────────────────────

/**
 * Normalises phone strings:
 *   "++201125544878" → "+201125544878"
 *   "+20 11 2554 4878" → "+20 11 2554 4878" (spaces preserved, valid)
 *
 * Call this BEFORE combining countryCode + localPhone:
 *   sanitisePhone(`${countryCode}${localPhone.replace(/^0+/, '')}`)
 */
export function sanitisePhone(raw: string): string {
  // Collapse multiple leading "+" into one
  return raw.replace(/^\++/, '+').replace(/[^\d+\s\-()]/g, '');
}

// ─── 4. Payload Builder ───────────────────────────────────────────────────────

/**
 * Transforms the React form state into the exact API payload.
 * Handles all type coercions: string → number, string[] → number[].
 */
export function buildBookingPayload(form: BookingFormState): BookingApiPayload {
  const payload: BookingApiPayload = {
    tour_id:         parseInt(form.tour_id, 10),
    name:            form.name.trim(),
    email:           form.email.trim().toLowerCase(),
    phone:           sanitisePhone(form.phone.trim()),
    nationality:     form.nationality.trim(),
    arrival_date:    form.arrival_date,
    departure_date:  form.departure_date,
    adult_number:    form.adult_number,
    children_number: form.children_number,
  };

  // Only include child_age when there are children
  if (form.children_number > 0 && form.child_age.length > 0) {
    payload.child_age = form.child_age
      .slice(0, form.children_number)
      .map((a) => parseInt(a, 10));
  }

  if (form.message.trim()) {
    payload.message = form.message.trim();
  }

  return payload;
}

// ─── 5. Submission ────────────────────────────────────────────────────────────

/**
 * POST result returned to the component.
 * fieldErrors keys are normalised to UI field names (checkIn, checkOut, etc.)
 * so the component can display them directly without any extra mapping.
 */
export interface SubmitBookingResult {
  ok:           boolean;
  message:      string;
  data?:        BookingApiSuccess['data'];
  /** UI-field-keyed errors hydrated from the API response */
  fieldErrors?: Record<string, string>;
}

const BOOKING_ENDPOINT = '/api/booking';

/**
 * Submits the booking payload to the API.
 *
 * Headers:
 *   Content-Type:      application/json
 *   Accept:            application/json
 *   X-Requested-With:  XMLHttpRequest    (required by some Laravel installs)
 *
 * Outstanding questions for the API owner:
 *   □ Does this endpoint require Authorization: Bearer <token>?
 *   □ Is there a CSRF token requirement (X-XSRF-TOKEN / _token field)?
 *   □ What HTTP status code does a successful creation return? (200 or 201?)
 *   □ Is there a rate limit per IP? If yes, what is it?
 *   □ Are there CORS headers set to allow browser requests from this domain?
 *     Browser submissions always use the Next.js proxy at app/api/booking/route.ts
 */
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
        // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BOOKING_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      ok:      false,
      message: 'Network error — please check your connection and try again.',
    };
  }

  // Parse body regardless of status (the API sends errors as JSON too)
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
  const errBody    = body as BookingApiError;
  const uiErrors: Record<string, string> = {};

  if (errBody.errors) {
    const fieldMap: Record<string, string> = {
      arrival_date:    'checkIn',
      departure_date:  'checkOut',
      adult_number:    'adults',
      children_number: 'children',
    };

    for (const [apiField, messages] of Object.entries(errBody.errors)) {
      // child_age.0, child_age.1, … → childAges_0, childAges_1, …
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

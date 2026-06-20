// lib/api/freepage.ts
import { unstable_cache } from "next/cache";
export interface TermsAndConditionsResponse {
  success: boolean;
  data: {
    sections: {
      terms_and_conditions_section: {
        title: string;
        description: string;
        terms_and_conditions: TermsAndConditionItem[];
      };
    };
  };
  message: string;
}

export interface TermsAndConditionItem {
  image?: string;
  id?: number;
  title: string;
  description: string;
}

// Safe empty shape returned when the API is unreachable or rate-limited, so a
// single throttled request can never crash the build — the page already
// handles a missing `section` by showing a fallback message.
const EMPTY_TERMS_RESPONSE: TermsAndConditionsResponse = {
  success: false,
  data: {
    sections: {
      terms_and_conditions_section: {
        title: "",
        description: "",
        terms_and_conditions: [],
      },
    },
  },
  message: "unavailable",
};

export const getTermsAndConditions = unstable_cache(async (): Promise<TermsAndConditionsResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const url = `${baseUrl}terms-conditions`;

  // Same capped-backoff retry as the rest of the API layer (see client.ts):
  // honor `retry-after` but never sleep long enough to blow past Next.js's
  // per-page build timeout. On exhausted retries, degrade gracefully instead
  // of throwing — a 429 on this one endpoint should not fail the whole build.
  const maxAttempts = 3;
  const MAX_WAIT_MS = 8000;
  let lastStatus: number | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    console.log("Fetching:", url);

    let response: Response;
    try {
      response = await fetch(url, {
        next: { revalidate: 3600, tags: ["free-page"] },
      });
    } catch (error) {
      // Network-level failure (not an HTTP status) — back off and retry,
      // otherwise fall through to the empty fallback below.
      if (attempt === maxAttempts) {
        console.log("Network error fetching terms and conditions:", String(error));
        return EMPTY_TERMS_RESPONSE;
      }
      await new Promise((resolve) => setTimeout(resolve, Math.min(attempt * 600, MAX_WAIT_MS)));
      continue;
    }

    console.log("Status:", response.status);

    if (response.ok) {
      return response.json();
    }

    lastStatus = response.status;

    if (response.status === 429 && attempt < maxAttempts) {
      const retryAfter = Number(response.headers.get("retry-after") ?? "0");
      const waitMs =
        Number.isFinite(retryAfter) && retryAfter > 0
          ? Math.min(retryAfter * 1000, MAX_WAIT_MS)
          : Math.min(attempt * 900, MAX_WAIT_MS);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      continue;
    }

    // Non-429 error, or 429 with retries exhausted: log and fall back.
    const errorText = await response.text().catch(() => "");
    console.log("API Error:", errorText.slice(0, 500));
    break;
  }

  console.log(
    `Terms and conditions unavailable after ${maxAttempts} attempt(s), last status: ${lastStatus}. Falling back to empty content.`
  );
  return EMPTY_TERMS_RESPONSE;
})

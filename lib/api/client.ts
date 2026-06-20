// Centralized API base URL and simple helpers (expoerted in tours dynamics routes)
// Uses the same NEXT_PUBLIC_API_BASE_URL everywhere, with a safe local fallback.

const RAW_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1";

export const API_BASE_URL = RAW_BASE.replace(/\/$/, "");

export async function apiGet<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const maxAttempts = 5;
  let res: Response | null = null;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      res = await fetch(url, {
        ...init,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(init.headers || {}),
        },
      });

      if (res.status !== 429 || attempt === maxAttempts) {
        break;
      }

      const retryAfter = Number(res.headers.get("retry-after") ?? "0");
      // Cap the wait regardless of what `retry-after` says. During `next build`
      // every page has a hard per-page generation timeout (commonly ~60s), and
      // `generateStaticParams` can fan out enough parallel requests to exhaust
      // the backend's rate-limit window almost instantly. Honoring a long
      // `retry-after` (we've seen 45-60s from Laravel's throttle) literally
      // would mean sleeping past that build timeout on a single attempt —
      // which is exactly what was happening. Capping keeps us responsive to
      // the build's clock while still backing off.
      const MAX_WAIT_MS = 8000;
      const waitMs =
        Number.isFinite(retryAfter) && retryAfter > 0
          ? Math.min(retryAfter * 1000, MAX_WAIT_MS)
          : Math.min(attempt * 900, MAX_WAIT_MS);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, Math.min(attempt * 600, 8000)));
    }
  }

  if (!res) {
    throw new Error(`API GET ${url} failed before receiving a response: ${String(lastError)}`);
  }

  if (!res.ok) {
    throw new Error(`API GET ${url} failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

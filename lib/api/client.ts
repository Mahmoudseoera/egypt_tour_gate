// Centralized API base URL and simple helpers (expoerted in tours dynamics routes)
// Uses the same NEXT_PUBLIC_API_BASE_URL everywhere, with a safe local fallback.

const RAW_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1/";

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
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : attempt * 900;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 600));
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

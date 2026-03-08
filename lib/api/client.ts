// Centralized API base URL and simple helpers
// Uses the same NEXT_PUBLIC_API_BASE_URL everywhere, with a safe local fallback.

const RAW_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

export const API_BASE_URL = RAW_BASE.replace(/\/$/, "");

export async function apiGet<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API GET ${url} failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}


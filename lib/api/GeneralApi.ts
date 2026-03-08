import React from "react";

// lib/services/api.ts
export interface HeaderData {
  logo?: string;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    children: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  }>;
  languages: Array<{
    name: string;
    slug: string;
  }>;
  info?: {
    email?: string;
    phone?: string;
  };
  social?: Array<{
    title?: string;
    url: string;
    icon?: string;
  }>;
}
export interface FooterData {
  site_address?: string;
  site_address_2?: string | null;
  copy_rights?: string;
  footerCategories: Array<{
    id: number | string;
    name: { en: string };
    slug: string;
    children: Array<{
      id: number | string;
      name: { en: string };
      slug: string;
    }>;
  }>;
  [key: string]: unknown;
}

export interface ApiResponse {
  data: {
    header: HeaderData;
    footer: FooterData;
  };
}


// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Generic fetch function with error handling
export async function fetchApi<T>(endpoint: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your .env.local file');
  }

  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;
  console.log('🌐 Fetching:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Add mode and credentials for CORS handling
      mode: 'cors',
      credentials: 'omit',
    });

    console.log('📡 Response status:', response.status, response.statusText);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
      } catch (e) {
        console.error('❌ Could not read error response');
      }
      throw new Error(`API Error: ${response.status} - ${response.statusText}${errorText ? `. ${errorText.substring(0, 100)}` : ''}`);
    }

    const jsonData = await response.json();
    console.log('📦 Response data:', jsonData);
    return jsonData;
  } catch (err) {
    console.error('❌ Fetch Error Details:', {
      error: err,
      message: err instanceof Error ? err.message : String(err),
      name: err instanceof Error ? err.name : undefined,
      stack: err instanceof Error ? err.stack : undefined,
    });
    
    if (err instanceof TypeError) {
      if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
        throw new Error(`Failed to connect to API at ${url}. This might be a CORS issue or network problem. Please check: 1) CORS settings on the API server, 2) Network connection, 3) API URL is correct.`);
      }
    }
    throw err;
  }
}


// Specific API functions
export const apiService = {
  // Fetch general data - using Next.js API route as proxy to avoid CORS issues
  async getGeneralData(locale?: string): Promise<ApiResponse> {
    const localeQuery = locale ? `?locale=${locale}` : "";
    const response = await fetch(`/api/general${localeQuery}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return response.json();
  },
  
  // You can add more API methods here
  async getTours(): Promise<any> {
    return fetchApi('/tours');
  },
  
  async getCategories(): Promise<any> {
    return fetchApi('/categories');
  },
  
  // Add more methods as needed
};
type GeneralData = {
  header: HeaderData;
  footer: FooterData;
};

const normalizeResponse = (result: ApiResponse | unknown): GeneralData => {
  const candidate =
    result && typeof result === "object" && "data" in (result as Record<string, unknown>)
      ? (result as { data: unknown }).data
      : result;

  if (!candidate || typeof candidate !== "object") {
    throw new Error("Unexpected API response structure");
  }

  const record = candidate as Record<string, unknown>;
  const headerRaw = (record.header ?? {}) as Record<string, unknown>;
  const footerCandidate = (record.footer ?? {}) as FooterData;
  const footerRaw: FooterData = {
    ...footerCandidate,
    footerCategories: Array.isArray(footerCandidate.footerCategories) ? footerCandidate.footerCategories : [],
  };

  const languages = Array.isArray(headerRaw.languages)
    ? (headerRaw.languages as Array<Record<string, unknown>>)
        .filter((item) => typeof item?.slug === "string" && typeof item?.name === "string")
        .map((item) => ({ name: String(item.name), slug: String(item.slug) }))
    : [];

  const categoriesSource = Array.isArray(headerRaw.categories)
    ? (headerRaw.categories as Array<Record<string, unknown>>)
    : Array.isArray(headerRaw.headerCategories)
      ? (headerRaw.headerCategories as Array<Record<string, unknown>>)
      : [];

  const categories = categoriesSource.map((item) => ({
    id: String(item.id ?? item.slug ?? Math.random()),
    name: typeof item.name === "string" ? item.name : String((item.name as { en?: string })?.en ?? item.slug ?? ""),
    slug: String(item.slug ?? ""),
    children: Array.isArray(item.children)
      ? (item.children as Array<Record<string, unknown>>).map((child) => ({
          id: String(child.id ?? child.slug ?? Math.random()),
          name: typeof child.name === "string" ? child.name : String((child.name as { en?: string })?.en ?? child.slug ?? ""),
          slug: String(child.slug ?? ""),
        }))
      : [],
  }));

  return {
    header: {
      logo: typeof headerRaw.logo === "string" ? headerRaw.logo : undefined,
      categories,
      languages,
      info: (headerRaw.info as HeaderData["info"]) ?? undefined,
      social: (headerRaw.social as HeaderData["social"]) ?? [],
    },
    footer: footerRaw,
  };
};

export const useGeneralData = (locale?: string) => {
  const [data, setData] = React.useState<GeneralData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        console.log('🔍 API URL:', API_URL);
        console.log('🔍 Fetching from:', `${API_URL}/general`);
        
        const result = await apiService.getGeneralData(locale);
        console.log('✅ API Response:', result);
        
        const extractedData = normalizeResponse(result);
        setData(extractedData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        console.error('❌ API Error:', err);
        console.error('❌ Error details:', {
          message: errorMessage,
          stack: err instanceof Error ? err.stack : undefined
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [locale]);

  return { data, loading, error };
};

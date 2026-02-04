import React from "react";

// lib/services/api.ts
export interface HeaderData {
  logo: string;
  email: string;
  phone: string;
  headerCategories: Array<{
    id: string;
    name: {
      en: string;
    };
    slug: string;
    children: Array<{
      id: string;
      name: {
        en: string;
      };
      slug: string;
    }>;
  }>;
}
export interface FooterData {
  site_address: string;
  site_address_2: string | null;
  copy_rights: string;
  footerCategories: Array<{
    id: number;
    name: {
      en: string;
    };
    slug: string;
    children: Array<{
      id: number;
      name: {
        en: string;
      };
      slug: string;
    }>;
  }>;
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
  async getGeneralData(): Promise<ApiResponse> {
    // Use Next.js API route instead of direct external API call
    // This avoids CORS issues since the server makes the request
    const response = await fetch('/api/general', {
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

export const useGeneralData = () => {
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
        
        const result = await apiService.getGeneralData();
        console.log('✅ API Response:', result);
        
        // Handle different response structures
        let extractedData: GeneralData;
        
        // Check if response has nested data structure
        if (result && result.data && result.data.header && result.data.footer) {
          // Standard structure: { data: { header, footer } }
          extractedData = result.data;
        } else if (result && 'header' in result && 'footer' in result) {
          // Direct structure: { header, footer } - need to cast through unknown first
          extractedData = (result as unknown as { header: HeaderData; footer: FooterData }) as GeneralData;
        } else {
          console.error('❌ Unexpected API response structure:', result);
          throw new Error('Unexpected API response structure. Expected { data: { header, footer } } or { header, footer }');
        }
        
        console.log('✅ Extracted Data:', extractedData);
        
        // Validate data structure
        if (!extractedData.header || !extractedData.footer) {
          throw new Error('API response missing header or footer data');
        }
        
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
  }, []);

  return { data, loading, error };
};

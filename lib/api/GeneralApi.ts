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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Generic fetch function with error handling
export async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}


// Specific API functions
export const apiService = {
  // Fetch general data
  async getGeneralData(): Promise<ApiResponse> {
    return fetchApi<ApiResponse>('/general');
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
        const result = await apiService.getGeneralData();
        setData(result.data); // ⬅️ header + footer
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { data, loading, error };
};

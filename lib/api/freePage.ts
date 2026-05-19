// lib/api/freepage.ts
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

export async function getTermsAndConditions(): Promise<TermsAndConditionsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const url = `${baseUrl}terms-conditions`;

  console.log("Fetching:", url);

  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  console.log("Status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();

    console.log("API Error:", errorText);

    throw new Error(
      `Failed to fetch terms and conditions - Status: ${response.status}`
    );
  }

  return response.json();
}
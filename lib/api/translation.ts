export interface TranslationEditorResponse {
  success: boolean;
  data: {
    home_first_section_sub_title: string;
  };
  message: string;
  status: number;
}
export async function fetchTranslation(locale = "en"): Promise<TranslationEditorResponse | null> {
  const base = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
  ).replace(/\/+$/, "");

  try {
    const res = await fetch(`${base}/get-translation-editor?locale=${locale}`, {
      next: { revalidate: 300, tags: ["translation"] },
    });
    if (!res.ok) return null;
    const json: TranslationEditorResponse = await res.json();
    console.log("Translation API Response:", json);
    return json;
  } catch {
    return null;
    }
    }
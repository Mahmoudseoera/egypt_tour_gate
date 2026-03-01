import { i18nMockData, type I18nPayload } from "@/lib/mock/i18n-data";

export async function getI18nData(): Promise<I18nPayload> {
  // Simulates API latency and keeps call shape ready for real backend integration.
  await new Promise((resolve) => setTimeout(resolve, 50));
  return i18nMockData;
}

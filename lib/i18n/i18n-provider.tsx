"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getI18nData } from "@/lib/api/i18n";
import { fallbackLanguage, isSupportedLanguage } from "./config";
import type {
  I18nPayload,
  LanguageOption,
  SupportedLanguage,
  TranslationMessages,
} from "@/lib/mock/i18n-data";

type I18nContextValue = {
  language: SupportedLanguage;
  languages: LanguageOption[];
  isReady: boolean;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
};

const defaultContext: I18nContextValue = {
  language: fallbackLanguage,
  languages: [],
  isReady: false,
  setLanguage: () => undefined,
  t: (key) => key,
};

const I18nContext = createContext<I18nContextValue>(defaultContext);

function getSavedLanguage(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("app-language");
}

function resolveCurrentMessages(payload: I18nPayload, language: SupportedLanguage): TranslationMessages {
  return payload.messages[language] ?? payload.messages[payload.defaultLanguage] ?? {};
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<I18nPayload | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>(fallbackLanguage);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const response = await getI18nData();
      if (!mounted) {
        return;
      }

      setPayload(response);
      const savedLanguage = getSavedLanguage();
      const nextLanguage = isSupportedLanguage(savedLanguage, response.languages)
        ? savedLanguage
        : response.defaultLanguage;

      setLanguage(nextLanguage);
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!payload) {
      return;
    }

    const activeLanguage = payload.languages.find((item) => item.code === language);
    const direction = activeLanguage?.dir ?? "ltr";

    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    localStorage.setItem("app-language", language);
  }, [language, payload]);

  const value = useMemo<I18nContextValue>(() => {
    if (!payload) {
      return defaultContext;
    }

    const messages = resolveCurrentMessages(payload, language);
    const fallbackMessages = payload.messages[payload.defaultLanguage] ?? {};

    return {
      language,
      languages: payload.languages,
      isReady: true,
      setLanguage,
      t: (key: string) => messages[key] ?? fallbackMessages[key] ?? key,
    };
  }, [language, payload]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

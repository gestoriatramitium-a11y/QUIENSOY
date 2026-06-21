import { createContext, createElement, useContext, useMemo, useState } from "react";
import { LANGUAGE_STORAGE_KEY } from "../config/languages.js";
import { translations } from "./translations.js";

const I18nContext = createContext(null);

function isSupported(language) {
  return language === "es" || language === "en";
}

function detectLanguage() {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupported(saved)) return saved;

  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
}

export function getCurrentLanguage() {
  try {
    return detectLanguage();
  } catch {
    return "en";
  }
}

export function translate(key, language = getCurrentLanguage()) {
  return translations[language]?.[key] || translations.en[key] || key;
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(getCurrentLanguage);

  function saveLanguage(nextLanguage) {
    const safeLanguage = isSupported(nextLanguage) ? nextLanguage : "en";
    localStorage.setItem(LANGUAGE_STORAGE_KEY, safeLanguage);
    setLanguageState(safeLanguage);
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage: setLanguageState,
      saveLanguage,
      t: (key) => translate(key, language)
    }),
    [language]
  );

  return createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context) return context;

  const language = getCurrentLanguage();
  return {
    language,
    setLanguage: () => {},
    saveLanguage: () => {},
    t: (key) => translate(key, language)
  };
}

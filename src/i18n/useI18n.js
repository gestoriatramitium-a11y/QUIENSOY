import { useEffect, useState } from "react";
import { LANGUAGE_STORAGE_KEY } from "../config/languages.js";
import { PLATFORM_CONFIG } from "../config/platform.js";
import { translations } from "./translations.js";

function detectLanguage() {
  if (PLATFORM_CONFIG.platform === "crazygames" && PLATFORM_CONFIG.forceEnglishForCrazyGames) return "en";
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "es" || stored === "en") return stored;
  if (PLATFORM_CONFIG.defaultLanguage === "es" || PLATFORM_CONFIG.defaultLanguage === "en") return PLATFORM_CONFIG.defaultLanguage;
  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
}

export function getCurrentLanguage() {
  try {
    return detectLanguage();
  } catch {
    return "en";
  }
}

export function setCurrentLanguage(language) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  window.dispatchEvent(new CustomEvent("languagechange", { detail: language }));
}

export function translate(key, language = getCurrentLanguage()) {
  return translations[language]?.[key] || translations.en[key] || key;
}

export function useI18n() {
  const [language, setLanguage] = useState(getCurrentLanguage);

  useEffect(() => {
    const handler = (event) => setLanguage(event.detail || getCurrentLanguage());
    window.addEventListener("languagechange", handler);
    return () => window.removeEventListener("languagechange", handler);
  }, []);

  return {
    language,
    setLanguage: (nextLanguage) => {
      setCurrentLanguage(nextLanguage);
      setLanguage(nextLanguage);
    },
    t: (key) => translate(key, language)
  };
}

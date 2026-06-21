import { useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import { SUPPORTED_LANGUAGES } from "../config/languages.js";
import { PLATFORM_CONFIG } from "../config/platform.js";
import { useI18n } from "../i18n/useI18n.js";
import { getSettings, saveSettings } from "../utils/settings.js";
import { getStats, resetStats } from "../utils/storage.js";

const COPY = {
  es: {
    description: "Idioma, sonido, vibracion y datos locales.",
    spanish: "Espa\u00f1ol",
    english: "English"
  },
  en: {
    description: "Language, sound, vibration and local data controls.",
    spanish: "Espa\u00f1ol",
    english: "English"
  }
};

export default function Settings() {
  const { language, saveLanguage, t } = useI18n();
  const copy = COPY[language] || COPY.en;
  const [draftLanguage, setDraftLanguage] = useState(language);
  const [savedMessage, setSavedMessage] = useState("");
  const [settings, setSettings] = useState(getSettings);
  const stats = getStats();

  function updateSettings(next) {
    const merged = { ...settings, ...next };
    setSettings(merged);
    saveSettings(merged);
  }

  function handleSaveLanguage() {
    saveLanguage(draftLanguage);
    setSavedMessage(draftLanguage === "es" ? "Idioma guardado correctamente" : "Language saved successfully");
  }

  function handleReset() {
    resetStats();
    window.location.reload();
  }

  return (
    <div className="page narrow-page">
      <AdBanner placement="top" />
      <section className="page-heading">
        <p className="eyebrow">{t("settings")}</p>
        <h1>{t("settings")}</h1>
        <p>{copy.description}</p>
      </section>
      <section className="settings-panel">
        <label>
          {t("language")}
          <select value={draftLanguage} onChange={(event) => setDraftLanguage(event.target.value)}>
            {SUPPORTED_LANGUAGES.map((item) => (
              <option value={item.code} key={item.code}>
                {item.code === "es" ? copy.spanish : copy.english}
              </option>
            ))}
          </select>
        </label>
        <button className="primary-button" type="button" onClick={handleSaveLanguage}>
          {draftLanguage === "es" ? "Guardar" : "Save"}
        </button>
        {savedMessage && <p className="status-text">{savedMessage}</p>}
        <div className="local-score">
          <span>{t("currentSavedLanguage")}</span>
          <strong>{language === "es" ? copy.spanish : copy.english}</strong>
        </div>
        <label className="toggle-row">
          {t("sound")}
          <input type="checkbox" checked={settings.soundEnabled} onChange={(event) => updateSettings({ soundEnabled: event.target.checked })} />
        </label>
        <label className="toggle-row">
          {t("vibration")}
          <input
            type="checkbox"
            checked={settings.vibrationEnabled}
            onChange={(event) => updateSettings({ vibrationEnabled: event.target.checked })}
          />
        </label>
        <div className="local-score">
          <span>{t("platform")}</span>
          <strong>{PLATFORM_CONFIG.platform}</strong>
        </div>
        <div className="local-score">
          <span>{t("version")}</span>
          <strong>1.0.0</strong>
        </div>
        <div className="local-score">
          <span>{t("localGames")}</span>
          <strong>{stats.gamesPlayed}</strong>
        </div>
        <button className="danger-button" type="button" onClick={handleReset}>
          {t("resetStats")}
        </button>
      </section>
      <AdBanner placement="bottom" />
    </div>
  );
}

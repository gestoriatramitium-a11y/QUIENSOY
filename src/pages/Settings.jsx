import { useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import { SUPPORTED_LANGUAGES } from "../config/languages.js";
import { PLATFORM_CONFIG } from "../config/platform.js";
import { useI18n } from "../i18n/useI18n.js";
import { getSettings, saveSettings } from "../utils/settings.js";
import { getStats, resetStats } from "../utils/storage.js";

export default function Settings() {
  const { language, setLanguage, t } = useI18n();
  const [settings, setSettings] = useState(getSettings);
  const stats = getStats();

  function updateSettings(next) {
    const merged = { ...settings, ...next };
    setSettings(merged);
    saveSettings(merged);
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
        <p>Language, sound, vibration, platform and local data controls.</p>
      </section>
      <section className="settings-panel">
        <label>
          {t("language")}
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            {SUPPORTED_LANGUAGES.map((item) => (
              <option value={item.code} key={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
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
          <span>Local games</span>
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

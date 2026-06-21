const SETTINGS_KEY = "quienSoyFutbolSettings";

export const defaultSettings = {
  soundEnabled: true,
  vibrationEnabled: true
};

export function getSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...getSettings(), ...settings }));
  window.dispatchEvent(new CustomEvent("settingschange"));
}

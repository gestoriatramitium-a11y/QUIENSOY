import { getSettings } from "./settings.js";

export function vibrate(pattern = 35) {
  if (!getSettings().vibrationEnabled) return;
  if (navigator.vibrate) navigator.vibrate(pattern);
}

import { PLATFORM_CONFIG } from "../config/platform.js";
import { internalAds } from "../config/internalAds.js";

export default function InternalAdBanner() {
  if (PLATFORM_CONFIG.platform === "crazygames" || !PLATFORM_CONFIG.enableInternalAds || internalAds.length === 0) {
    return null;
  }

  return null;
}

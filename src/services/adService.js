import { PLATFORM_CONFIG } from "../config/platform.js";
import { requestMidgameAd, requestRewardedAd } from "./crazyGamesSdk.js";

export async function showMidgameAd() {
  if (PLATFORM_CONFIG.platform === "crazygames") return requestMidgameAd();
  return { completed: false, demo: true };
}

export async function showRewardedAd() {
  if (PLATFORM_CONFIG.platform === "crazygames") return requestRewardedAd();
  return { completed: false, demo: true };
}

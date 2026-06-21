export const PLATFORM_CONFIG = {
  platform: "crazygames", // "web" | "crazygames"
  enableExternalBanners: false,
  enableInternalAds: false,
  enableCrazyGamesSdk: false,
  defaultLanguage: "en",
  forceEnglishForCrazyGames: true,
  showSeoPages: false,
  showShareButtons: true
};

export function isCrazyGamesPlatform() {
  return PLATFORM_CONFIG.platform === "crazygames";
}

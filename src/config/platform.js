export const PLATFORM_CONFIG = {
  platform: "web", // "web" | "crazygames"
  enableExternalBanners: true,
  enableInternalAds: true,
  enableCrazyGamesSdk: false,
  defaultLanguage: "auto",
  forceEnglishForCrazyGames: true,
  showSeoPages: true,
  showShareButtons: true
};

export function isCrazyGamesPlatform() {
  return PLATFORM_CONFIG.platform === "crazygames";
}

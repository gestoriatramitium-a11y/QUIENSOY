export async function initCrazyGamesSdk() {
  if (!isCrazyGamesAvailable()) return false;
  // Connect the official CrazyGames SDK init call here when the platform script is loaded.
  return true;
}

export function isCrazyGamesAvailable() {
  return Boolean(window.CrazyGames);
}

export async function gameplayStart() {
  window.CrazyGames?.SDK?.game?.gameplayStart?.();
}

export async function gameplayStop() {
  window.CrazyGames?.SDK?.game?.gameplayStop?.();
}

export async function happyTime() {
  window.CrazyGames?.SDK?.game?.happytime?.();
}

export async function requestMidgameAd() {
  if (!isCrazyGamesAvailable()) return { completed: false, fallback: true };
  return window.CrazyGames?.SDK?.ad?.requestAd?.("midgame") || { completed: true };
}

export async function requestRewardedAd() {
  if (!isCrazyGamesAvailable()) return { completed: false, fallback: true };
  return window.CrazyGames?.SDK?.ad?.requestAd?.("rewarded") || { completed: true };
}

export function getCrazyGamesLocale() {
  return window.CrazyGames?.SDK?.user?.getSystemInfo?.()?.countryCode || "";
}

export function getCrazyGamesSystemInfo() {
  return window.CrazyGames?.SDK?.user?.getSystemInfo?.() || null;
}

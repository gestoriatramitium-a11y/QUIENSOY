const PROGRESSION_KEY = "quienSoyFutbolProgression";

export const levelThresholds = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];

export const cosmetics = {
  themes: [
    { id: "classic-pitch", label: "Classic Pitch", unlock: "Inicio" },
    { id: "night-stadium", label: "Night Stadium", unlockLevel: 4 },
    { id: "golden-arena", label: "Golden Arena", unlockLevel: 10 },
    { id: "world-stage", label: "World Stage", unlockAchievement: "racha-7" },
    { id: "retro-football", label: "Retro Football", unlockAchievement: "survival-25" }
  ],
  cardStyles: [
    { id: "classic", label: "Classic", unlock: "Inicio" },
    { id: "gold", label: "Gold", unlockLevel: 6 },
    { id: "neon", label: "Neon", unlockLevel: 12 },
    { id: "retro", label: "Retro", unlockLevel: 8 },
    { id: "legend", label: "Legend", unlockLevel: 15 }
  ],
  balls: [
    { id: "classic-ball", label: "Classic Ball", unlockLevel: 2 },
    { id: "retro-ball", label: "Retro Ball", unlockLevel: 8 },
    { id: "golden-ball", label: "Golden Ball", unlockAchievement: "time-legend" }
  ]
};

const defaultProgression = {
  xpTotal: 0,
  level: 1,
  title: "Rookie",
  unlockedThemes: ["classic-pitch"],
  unlockedCosmetics: ["classic", "classic-ball"],
  selectedTheme: "classic-pitch",
  selectedCardStyle: "classic",
  selectedBall: "classic-ball"
};

export function getProgression() {
  try {
    return { ...defaultProgression, ...JSON.parse(localStorage.getItem(PROGRESSION_KEY) || "{}") };
  } catch {
    return defaultProgression;
  }
}

export function saveProgression(progression) {
  localStorage.setItem(PROGRESSION_KEY, JSON.stringify(progression));
}

export function addXP(amount) {
  const current = getProgression();
  const xpTotal = Math.max(0, current.xpTotal + amount);
  const level = getLevelFromXP(xpTotal);
  const next = {
    ...current,
    xpTotal,
    level,
    title: getTitle(level)
  };
  const unlocked = getUnlockedCosmetics(level);
  next.unlockedThemes = [...new Set([...next.unlockedThemes, ...unlocked.themes])];
  next.unlockedCosmetics = [...new Set([...next.unlockedCosmetics, ...unlocked.cardStyles, ...unlocked.balls])];
  saveProgression(next);
  window.dispatchEvent(new CustomEvent("progressionchange", { detail: next }));
  return next;
}

export function getXPForResult({ modeId, won, attempts = 6, score = 0, correct = 0 }) {
  let xp = Math.max(10, Math.round(score / 4));
  if (won) xp += 20;
  if (attempts <= 2 && won) xp += 20;
  if (modeId === "diario") xp += 30;
  if (modeId === "rapido") xp += 15 + correct * 8;
  if (modeId === "supervivencia" || modeId === "contrarreloj") xp += Math.round(score / 10);
  return xp;
}

export function getLevelFromXP(xp) {
  for (let index = levelThresholds.length - 1; index >= 0; index -= 1) {
    if (xp >= levelThresholds[index]) {
      if (index < levelThresholds.length - 1) return index + 1;
      return 10 + Math.floor((xp - levelThresholds.at(-1)) / 800);
    }
  }
  return 1;
}

export function getXPProgress(progression = getProgression()) {
  const currentLevelXP = getXPForLevel(progression.level);
  const nextLevelXP = getXPForLevel(progression.level + 1);
  return {
    currentLevelXP,
    nextLevelXP,
    remaining: Math.max(0, nextLevelXP - progression.xpTotal),
    percent: Math.min(100, ((progression.xpTotal - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)
  };
}

function getXPForLevel(level) {
  if (level <= 10) return levelThresholds[level - 1] || 0;
  return levelThresholds.at(-1) + (level - 10) * 800;
}

function getTitle(level) {
  if (level >= 20) return "Hall of Fame";
  if (level >= 15) return "Legend";
  if (level >= 10) return "Football Expert";
  if (level >= 8) return "Star Player";
  if (level >= 5) return "Pro Guesser";
  if (level >= 3) return "Football Fan";
  return "Rookie";
}

function getUnlockedCosmetics(level) {
  return {
    themes: cosmetics.themes.filter((item) => item.unlockLevel && level >= item.unlockLevel).map((item) => item.id),
    cardStyles: cosmetics.cardStyles.filter((item) => item.unlockLevel && level >= item.unlockLevel).map((item) => item.id),
    balls: cosmetics.balls.filter((item) => item.unlockLevel && level >= item.unlockLevel).map((item) => item.id)
  };
}

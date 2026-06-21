import { DEFAULT_AGE_GROUP_ID, getAgeGroup } from "../config/ageGroups.js";
import { getMode } from "./gameModes.js";
import { addXP, getProgression, getXPForResult } from "./progression.js";
import { getScore } from "./scoring.js";

const STATS_KEY = "quienSoyFutbolStatsV2";
const LEGACY_STATS_KEY = "quienSoyFutbolStats";
const AGE_GROUP_KEY = "quienSoyFutbolAgeGroup";
const DAILY_PREFIX = "quienSoyFutbolDaily:";

const modes = [
  "diario",
  "liga-espanola",
  "mundiales",
  "clubes-europeos",
  "entrenamiento",
  "rapido",
  "supervivencia",
  "contrarreloj",
  "especial-semana"
];

export const ACHIEVEMENTS = [
  { id: "primer-gol", title: "Primer Gol", description: "Gana tu primera partida." },
  { id: "racha-3", title: "Racha 3", description: "Gana 3 retos diarios seguidos." },
  { id: "racha-7", title: "Racha 7", description: "Gana 7 retos diarios seguidos." },
  { id: "leyenda", title: "Leyenda", description: "Gana una partida al primer intento." },
  { id: "rey-laliga", title: "Rey de LaLiga", description: "Gana 10 partidas en Liga Española." },
  { id: "heroe-mundial", title: "Héroe Mundial", description: "Gana 10 partidas en Mundiales." },
  { id: "experto-europeo", title: "Experto Europeo", description: "Gana 10 partidas en Clubes Europeos." },
  { id: "viciado", title: "Viciado", description: "Juega 25 partidas de entrenamiento." },
  { id: "perfecto-rapido", title: "Perfecto Rápido", description: "Acierta 5/5 en Modo Rápido." },
  { id: "compartidor", title: "Compartidor", description: "Comparte 5 resultados." }
  ,
  { id: "first-match", title: "Primera partida", description: "Juega tu primera partida." },
  { id: "survival-10", title: "Supervivencia 10", description: "Supera 10 rondas en supervivencia." },
  { id: "survival-25", title: "Supervivencia 25", description: "Supera 25 rondas en supervivencia." },
  { id: "time-pro", title: "Contrarreloj Pro", description: "Alcanza rango Pro en contrarreloj." },
  { id: "time-legend", title: "Contrarreloj Legend", description: "Alcanza rango Legend en contrarreloj." },
  { id: "level-10", title: "Nivel 10", description: "Llega al nivel 10." },
  { id: "level-20", title: "Nivel 20", description: "Llega al nivel 20." }
];

export const defaultModeStats = {
  played: 0,
  wins: 0,
  losses: 0,
  points: 0,
  currentStreak: 0,
  bestStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  lastResult: null
};

export const defaultStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: "",
  lastResult: null,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  totalScore: 0,
  sharedResults: 0,
  bestQuickResult: null,
  bestSurvivalResult: null,
  bestTimeAttackResult: null,
  favoriteMode: "",
  achievements: [],
  modes: Object.fromEntries(modes.map((mode) => [mode, { ...defaultModeStats, guessDistribution: { ...defaultModeStats.guessDistribution } }])),
  ageGroups: {}
};

export function getStats() {
  try {
    const stored = JSON.parse(localStorage.getItem(STATS_KEY) || localStorage.getItem(LEGACY_STATS_KEY) || "{}");
    return mergeStats(stored);
  } catch {
    return mergeStats({});
  }
}

export function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(mergeStats(stats)));
}

export function getPreferredAgeGroup() {
  try {
    return localStorage.getItem(AGE_GROUP_KEY) || DEFAULT_AGE_GROUP_ID;
  } catch {
    return DEFAULT_AGE_GROUP_ID;
  }
}

export function savePreferredAgeGroup(ageGroupId) {
  localStorage.setItem(AGE_GROUP_KEY, getAgeGroup(ageGroupId).id);
}

export function resetStats() {
  localStorage.removeItem(STATS_KEY);
  localStorage.removeItem(LEGACY_STATS_KEY);
  Object.keys(localStorage)
    .filter((key) => key.startsWith(DAILY_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
}

function getDailyKey(dateKey, ageGroupId = DEFAULT_AGE_GROUP_ID) {
  return `${DAILY_PREFIX}${dateKey}:${getAgeGroup(ageGroupId).id}`;
}

export function getDailyResult(dateKey, ageGroupId = DEFAULT_AGE_GROUP_ID) {
  try {
    return JSON.parse(localStorage.getItem(getDailyKey(dateKey, ageGroupId)) || "null");
  } catch {
    return null;
  }
}

export function saveDailyResult(dateKey, ageGroupId, result) {
  localStorage.setItem(getDailyKey(dateKey, ageGroupId), JSON.stringify(result));
}

export function recordFinishedGame({ dateKey, modeId = "diario", ageGroupId = DEFAULT_AGE_GROUP_ID, item, player, attempts, won, points }) {
  const target = item || player;
  const mode = getMode(modeId);
  const ageGroup = getAgeGroup(ageGroupId);
  const score = typeof points === "number" ? points : getScore(attempts, won);
  const statsDateKey = mode.daily ? `${dateKey}:${ageGroup.id}` : "";
  const result = {
    dateKey,
    modeId: mode.id,
    modeLabel: mode.label,
    ageGroupId: ageGroup.id,
    ageGroupLabel: ageGroup.shortTitle,
    itemType: target.tipo || "player",
    playerId: target.id,
    playerName: target.nombre,
    attempts,
    won,
    score,
    completedAt: new Date().toISOString()
  };

  if (mode.daily) saveDailyResult(dateKey, ageGroup.id, result);

  const stats = getStats();
  if (mode.daily && stats.lastPlayedDate === statsDateKey) return result;

  const modeStats = { ...defaultModeStats, ...stats.modes[mode.id] };
  const nextModeStats = updateModeStats(modeStats, result);
  const nextStats = {
    ...stats,
    gamesPlayed: stats.gamesPlayed + 1,
    wins: stats.wins + (won ? 1 : 0),
    losses: stats.losses + (won ? 0 : 1),
    currentStreak: mode.daily && won ? stats.currentStreak + 1 : mode.daily ? 0 : stats.currentStreak,
    lastPlayedDate: mode.daily ? statsDateKey : stats.lastPlayedDate,
    lastResult: result,
    guessDistribution: won ? incrementDistribution(stats.guessDistribution, attempts) : stats.guessDistribution,
    totalScore: stats.totalScore + score,
    modes: {
      ...stats.modes,
      [mode.id]: nextModeStats
    },
    ageGroups: {
      ...stats.ageGroups,
      [ageGroup.id]: updateAgeGroupStats(stats.ageGroups[ageGroup.id], result)
    }
  };

  nextStats.bestStreak = Math.max(stats.bestStreak, nextStats.currentStreak);
  nextStats.favoriteMode = findFavoriteMode(nextStats.modes);
  addXP(getXPForResult(result));
  nextStats.achievements = unlockAchievements(nextStats);
  saveStats(nextStats);
  return result;
}

export function recordQuickGame({ dateKey, correct, points, rounds }) {
  const result = {
    dateKey,
    modeId: "rapido",
    modeLabel: "Modo Rápido",
    itemType: "mixed",
    attempts: 5 - correct || 1,
    correct,
    won: correct > 0,
    score: points,
    rounds,
    completedAt: new Date().toISOString()
  };
  const stats = getStats();
  const nextStats = {
    ...stats,
    gamesPlayed: stats.gamesPlayed + 1,
    wins: stats.wins + (correct > 0 ? 1 : 0),
    losses: stats.losses + (correct > 0 ? 0 : 1),
    totalScore: stats.totalScore + points,
    lastResult: result,
    bestQuickResult: !stats.bestQuickResult || correct > stats.bestQuickResult.correct ? result : stats.bestQuickResult,
    modes: {
      ...stats.modes,
      rapido: updateModeStats(stats.modes.rapido, result)
    }
  };
  addXP(getXPForResult(result));
  nextStats.favoriteMode = findFavoriteMode(nextStats.modes);
  nextStats.achievements = unlockAchievements(nextStats);
  saveStats(nextStats);
  return result;
}

export function recordArcadeGame({ dateKey, modeId, points, won = true, rounds = 0, correct = 0, rank = "" }) {
  const result = {
    dateKey,
    modeId,
    modeLabel: getMode(modeId).label,
    itemType: "mixed",
    attempts: 1,
    correct,
    rounds,
    rank,
    won,
    score: points,
    completedAt: new Date().toISOString()
  };
  const stats = getStats();
  const modeStats = updateModeStats(stats.modes[modeId], result);
  const nextStats = {
    ...stats,
    gamesPlayed: stats.gamesPlayed + 1,
    wins: stats.wins + (won ? 1 : 0),
    losses: stats.losses + (won ? 0 : 1),
    totalScore: stats.totalScore + points,
    lastResult: result,
    bestSurvivalResult:
      modeId === "supervivencia" && (!stats.bestSurvivalResult || rounds > stats.bestSurvivalResult.rounds)
        ? result
        : stats.bestSurvivalResult,
    bestTimeAttackResult:
      modeId === "contrarreloj" && (!stats.bestTimeAttackResult || points > stats.bestTimeAttackResult.score)
        ? result
        : stats.bestTimeAttackResult,
    modes: {
      ...stats.modes,
      [modeId]: modeStats
    }
  };
  addXP(getXPForResult(result));
  nextStats.favoriteMode = findFavoriteMode(nextStats.modes);
  nextStats.achievements = unlockAchievements(nextStats);
  saveStats(nextStats);
  return result;
}

export function recordShare() {
  const stats = getStats();
  const nextStats = { ...stats, sharedResults: stats.sharedResults + 1 };
  nextStats.achievements = unlockAchievements(nextStats);
  saveStats(nextStats);
}

function updateModeStats(modeStats = defaultModeStats, result) {
  return {
    ...modeStats,
    played: modeStats.played + 1,
    wins: modeStats.wins + (result.won ? 1 : 0),
    losses: modeStats.losses + (result.won ? 0 : 1),
    points: modeStats.points + result.score,
    currentStreak: result.won ? modeStats.currentStreak + 1 : 0,
    bestStreak: Math.max(modeStats.bestStreak, result.won ? modeStats.currentStreak + 1 : 0),
    guessDistribution: result.won ? incrementDistribution(modeStats.guessDistribution, result.attempts) : modeStats.guessDistribution,
    lastResult: result
  };
}

function updateAgeGroupStats(stats = { played: 0, wins: 0, points: 0 }, result) {
  return {
    played: stats.played + 1,
    wins: stats.wins + (result.won ? 1 : 0),
    points: stats.points + result.score
  };
}

function incrementDistribution(distribution = defaultStats.guessDistribution, attempts) {
  return {
    ...defaultStats.guessDistribution,
    ...distribution,
    [attempts]: (distribution?.[attempts] || 0) + 1
  };
}

function unlockAchievements(stats) {
  const unlocked = new Set(stats.achievements || []);
  if (stats.wins >= 1) unlocked.add("primer-gol");
  if (stats.gamesPlayed >= 1) unlocked.add("first-match");
  if (stats.currentStreak >= 3) unlocked.add("racha-3");
  if (stats.currentStreak >= 7) unlocked.add("racha-7");
  if (Object.values(stats.modes).some((mode) => mode.guessDistribution?.[1] > 0)) unlocked.add("leyenda");
  if (stats.modes["liga-espanola"]?.wins >= 10) unlocked.add("rey-laliga");
  if (stats.modes.mundiales?.wins >= 10) unlocked.add("heroe-mundial");
  if (stats.modes["clubes-europeos"]?.wins >= 10) unlocked.add("experto-europeo");
  if (stats.modes.entrenamiento?.played >= 25) unlocked.add("viciado");
  if (stats.bestQuickResult?.correct >= 5) unlocked.add("perfecto-rapido");
  if (stats.bestSurvivalResult?.rounds >= 10) unlocked.add("survival-10");
  if (stats.bestSurvivalResult?.rounds >= 25) unlocked.add("survival-25");
  if (["Pro", "Star", "Legend"].includes(stats.bestTimeAttackResult?.rank)) unlocked.add("time-pro");
  if (stats.bestTimeAttackResult?.rank === "Legend") unlocked.add("time-legend");
  if (stats.sharedResults >= 5) unlocked.add("compartidor");
  const progression = getProgression();
  if (progression.level >= 10) unlocked.add("level-10");
  if (progression.level >= 20) unlocked.add("level-20");
  return [...unlocked];
}

function findFavoriteMode(modeStats) {
  return Object.entries(modeStats).sort((a, b) => b[1].played - a[1].played)[0]?.[0] || "";
}

function mergeStats(stored) {
  const mergedModes = Object.fromEntries(
    modes.map((mode) => [
      mode,
      {
        ...defaultModeStats,
        guessDistribution: { ...defaultModeStats.guessDistribution },
        ...(stored.modes?.[mode] || {})
      }
    ])
  );
  return {
    ...defaultStats,
    ...stored,
    modes: mergedModes,
    guessDistribution: { ...defaultStats.guessDistribution, ...(stored.guessDistribution || {}) },
    achievements: stored.achievements || []
  };
}

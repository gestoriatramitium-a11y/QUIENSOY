import { DEFAULT_AGE_GROUP_ID, getAgeGroup } from "../config/ageGroups.js";
import { getScore } from "./scoring.js";

const STATS_KEY = "quienSoyFutbolStats";
const AGE_GROUP_KEY = "quienSoyFutbolAgeGroup";
const DAILY_PREFIX = "quienSoyFutbolDaily:";

export const defaultStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: "",
  lastResult: null,
  guessDistribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  },
  totalScore: 0
};

export function getStats() {
  try {
    return { ...defaultStats, ...JSON.parse(localStorage.getItem(STATS_KEY) || "{}") };
  } catch {
    return defaultStats;
  }
}

export function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
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

export function recordFinishedGame({ dateKey, ageGroupId = DEFAULT_AGE_GROUP_ID, player, attempts, won }) {
  const ageGroup = getAgeGroup(ageGroupId);
  const score = getScore(attempts, won);
  const statsDateKey = `${dateKey}:${ageGroup.id}`;
  const result = {
    dateKey,
    ageGroupId: ageGroup.id,
    ageGroupLabel: ageGroup.shortTitle,
    playerId: player.id,
    playerName: player.nombre,
    attempts,
    won,
    score,
    completedAt: new Date().toISOString()
  };

  saveDailyResult(dateKey, ageGroup.id, result);

  const stats = getStats();
  if (stats.lastPlayedDate === statsDateKey) return result;

  const nextStats = {
    ...stats,
    gamesPlayed: stats.gamesPlayed + 1,
    wins: stats.wins + (won ? 1 : 0),
    losses: stats.losses + (won ? 0 : 1),
    currentStreak: won ? stats.currentStreak + 1 : 0,
    lastPlayedDate: statsDateKey,
    lastResult: result,
    guessDistribution: {
      ...defaultStats.guessDistribution,
      ...stats.guessDistribution,
      ...(won ? { [attempts]: (stats.guessDistribution?.[attempts] || 0) + 1 } : {})
    },
    totalScore: stats.totalScore + score
  };

  nextStats.bestStreak = Math.max(stats.bestStreak, nextStats.currentStreak);
  saveStats(nextStats);
  return result;
}

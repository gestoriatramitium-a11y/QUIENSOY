import { getScore } from "./scoring.js";

const STATS_KEY = "quienSoyFutbolStats";
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

export function resetStats() {
  localStorage.removeItem(STATS_KEY);
  Object.keys(localStorage)
    .filter((key) => key.startsWith(DAILY_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
}

export function getDailyResult(dateKey) {
  try {
    return JSON.parse(localStorage.getItem(`${DAILY_PREFIX}${dateKey}`) || "null");
  } catch {
    return null;
  }
}

export function saveDailyResult(dateKey, result) {
  localStorage.setItem(`${DAILY_PREFIX}${dateKey}`, JSON.stringify(result));
}

export function recordFinishedGame({ dateKey, player, attempts, won }) {
  const score = getScore(attempts, won);
  const result = {
    dateKey,
    playerId: player.id,
    playerName: player.nombre,
    attempts,
    won,
    score,
    completedAt: new Date().toISOString()
  };

  saveDailyResult(dateKey, result);

  const stats = getStats();
  if (stats.lastPlayedDate === dateKey) return result;

  const nextStats = {
    ...stats,
    gamesPlayed: stats.gamesPlayed + 1,
    wins: stats.wins + (won ? 1 : 0),
    losses: stats.losses + (won ? 0 : 1),
    currentStreak: won ? stats.currentStreak + 1 : 0,
    lastPlayedDate: dateKey,
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

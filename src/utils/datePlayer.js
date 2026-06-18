import { players } from "../data/players.js";

export function getTodayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getDailyPlayer(date = new Date()) {
  const dayIndex = Math.floor(new Date(date).setHours(0, 0, 0, 0) / 86400000) % players.length;
  return players[dayIndex];
}

export function getTimeToNextChallenge(now = new Date()) {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const diff = Math.max(0, next.getTime() - now.getTime());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours} h ${minutes} min`;
}

import { DEFAULT_AGE_GROUP_ID } from "../config/ageGroups.js";
import { getDailyItem, getDailyPool } from "./gameModes.js";

export function getTodayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getPlayersForAgeGroup(ageGroupId = DEFAULT_AGE_GROUP_ID) {
  return getDailyPool(ageGroupId);
}

export function getDailyPlayer(date = new Date(), ageGroupId = DEFAULT_AGE_GROUP_ID) {
  return getDailyItem(date, ageGroupId);
}

export function getTimeToNextChallenge(now = new Date()) {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const diff = Math.max(0, next.getTime() - now.getTime());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours} h ${minutes} min`;
}

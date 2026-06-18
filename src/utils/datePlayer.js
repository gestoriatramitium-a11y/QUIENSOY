import { players } from "../data/players.js";
import { DEFAULT_AGE_GROUP_ID, getAgeGroup } from "../config/ageGroups.js";

export function getTodayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getPlayersForAgeGroup(ageGroupId = DEFAULT_AGE_GROUP_ID) {
  const group = getAgeGroup(ageGroupId);
  const selectedPlayers = group.playerIds
    .map((playerId) => players.find((player) => player.id === playerId))
    .filter(Boolean);

  return selectedPlayers.length ? selectedPlayers : players;
}

export function getDailyPlayer(date = new Date(), ageGroupId = DEFAULT_AGE_GROUP_ID) {
  const groupPlayers = getPlayersForAgeGroup(ageGroupId);
  const groupSalt = Array.from(ageGroupId).reduce((total, letter) => total + letter.charCodeAt(0), 0);
  const dayIndex = (Math.floor(new Date(date).setHours(0, 0, 0, 0) / 86400000) + groupSalt) % groupPlayers.length;
  return groupPlayers[dayIndex];
}

export function getTimeToNextChallenge(now = new Date()) {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const diff = Math.max(0, next.getTime() - now.getTime());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours} h ${minutes} min`;
}

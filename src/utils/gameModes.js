import { AGE_GROUPS, DEFAULT_AGE_GROUP_ID, getAgeGroup } from "../config/ageGroups.js";
import { GAME_CONFIG } from "../config/game.js";
import { clubs } from "../data/clubs.js";
import { players } from "../data/players.js";
import { spanishLeaguePlayers } from "../data/spanishLeaguePlayers.js";
import { weeklyThemes, getWeeklyTheme } from "../data/weeklyThemes.js";
import { worldCupPlayers } from "../data/worldCupPlayers.js";
import { buildPlayer } from "../data/dataHelpers.js";
import { normalizeText } from "./normalizeText.js";

const basePlayers = players.map((player, index) =>
  buildPlayer(
    {
      ...player,
      aliases: player.aliases,
      epoca: player.tags?.includes("leyenda") ? "Leyenda" : "Actual",
      edadPublico: AGE_GROUPS.filter((group) => group.playerIds.includes(player.id)).map((group) => group.id)
    },
    index,
    "general"
  )
);

const allPlayers = dedupeByName([...basePlayers, ...spanishLeaguePlayers, ...worldCupPlayers]);
const allItems = [...allPlayers, ...clubs];

export const GAME_MODES = {
  diario: {
    id: "diario",
    label: "Reto diario",
    shortLabel: "Diario",
    description: "El futbolista diario por tramo de edad. Se bloquea al terminar.",
    itemType: "player",
    daily: true
  },
  "liga-espanola": {
    id: "liga-espanola",
    label: "Liga Española",
    shortLabel: "LaLiga",
    description: "Adivina futbolistas actuales e históricos relacionados con la liga española.",
    itemType: "player",
    pool: spanishLeaguePlayers
  },
  mundiales: {
    id: "mundiales",
    label: "Mundiales",
    shortLabel: "Mundiales",
    description: "Adivina leyendas y estrellas que marcaron la historia de los Mundiales.",
    itemType: "player",
    pool: worldCupPlayers
  },
  "clubes-europeos": {
    id: "clubes-europeos",
    label: "Clubes Europeos",
    shortLabel: "Clubes",
    description: "Adivina equipos europeos por pistas sobre país, colores, historia y competiciones.",
    itemType: "club",
    pool: clubs
  },
  entrenamiento: {
    id: "entrenamiento",
    label: "Entrenamiento",
    shortLabel: "Entreno",
    description: "Partidas libres con filtros para seguir jugando sin esperar al reto diario.",
    itemType: "mixed",
    pool: allItems
  },
  rapido: {
    id: "rapido",
    label: "Modo Rápido",
    shortLabel: "Rápido",
    description: "Cinco rondas cortas para móvil, WhatsApp y partidas rápidas.",
    itemType: "mixed",
    quick: true,
    pool: allItems.filter((item) => item.dificultad !== "dificil")
  },
  supervivencia: {
    id: "supervivencia",
    label: "Supervivencia",
    shortLabel: "Survival",
    description: "Empieza con 3 vidas y supera tantas rondas como puedas.",
    itemType: "mixed",
    survival: true,
    pool: allItems
  },
  contrarreloj: {
    id: "contrarreloj",
    label: "Contrarreloj",
    shortLabel: "Time Attack",
    description: "Tienes 60 segundos para acertar tantos jugadores o clubes como puedas.",
    itemType: "mixed",
    timeAttack: true,
    pool: allItems.filter((item) => item.dificultad !== "dificil")
  },
  "especial-semana": {
    id: "especial-semana",
    label: "Especial de la Semana",
    shortLabel: "Especial",
    description: "Un tema semanal elegido automáticamente sin backend.",
    itemType: "mixed",
    weekly: true
  }
};

export function getMode(modeId = "diario") {
  return GAME_MODES[modeId] || GAME_MODES.diario;
}

export function getModeCards() {
  return Object.values(GAME_MODES);
}

export function getDailyPool(ageGroupId = DEFAULT_AGE_GROUP_ID) {
  const group = getAgeGroup(ageGroupId);
  const groupPlayers = group.playerIds
    .map((playerId) => allPlayers.find((player) => player.id === playerId || player.sourceId === playerId))
    .filter(Boolean);
  return groupPlayers.length ? groupPlayers : allPlayers.slice(0, 25);
}

export function getWeeklyPool(date = new Date()) {
  const theme = getWeeklyTheme(date);
  const tagged = allItems.filter((item) => item.tags?.some((tag) => theme.tags.includes(normalizeText(tag))));
  return tagged.length >= 8 ? tagged : allPlayers.slice(0, 30);
}

export function getPoolForMode(modeId, options = {}) {
  const mode = getMode(modeId);
  if (mode.daily) return getDailyPool(options.ageGroupId);
  if (mode.weekly) return getWeeklyPool(options.date);
  if (mode.id === "entrenamiento") return filterPracticePool(options);
  return mode.pool || allItems;
}

export function pickItem(pool, seed = Date.now()) {
  const safePool = pool.length ? pool : allItems;
  const index = Math.abs(Math.floor(seed)) % safePool.length;
  return safePool[index];
}

export function getDailyItem(date = new Date(), ageGroupId = DEFAULT_AGE_GROUP_ID) {
  const pool = getDailyPool(ageGroupId);
  const salt = Array.from(ageGroupId).reduce((total, letter) => total + letter.charCodeAt(0), 0);
  const seed = Math.floor(new Date(date).setHours(0, 0, 0, 0) / 86400000) + salt;
  return pickItem(pool, seed);
}

export function getRandomItemForMode(modeId, options = {}) {
  const pool = getPoolForMode(modeId, options);
  return pickItem(pool, Date.now() + Math.random() * 100000);
}

export function getQuickRounds(options = {}) {
  const pool = getPoolForMode("rapido", options);
  const start = Math.floor(Date.now() % pool.length);
  return Array.from({ length: GAME_CONFIG.QUICK_MODE_ROUNDS }, (_, index) => pickItem(pool, start + index * 7));
}

export function getQuickLevel(correct) {
  if (correct <= 1) return "Aficionado";
  if (correct === 2) return "Promesa";
  if (correct === 3) return "Titular";
  if (correct === 4) return "Crack";
  return "Leyenda";
}

export function getTimeAttackRank(points) {
  if (points <= 200) return "Rookie";
  if (points <= 500) return "Amateur";
  if (points <= 900) return "Pro";
  if (points <= 1300) return "Star";
  return "Legend";
}

function filterPracticePool(options = {}) {
  let pool = allItems;
  if (options.category === "liga-espanola") pool = spanishLeaguePlayers;
  if (options.category === "mundiales") pool = worldCupPlayers;
  if (options.category === "clubes-europeos") pool = clubs;
  if (options.type === "jugadores") pool = pool.filter((item) => item.tipo === "player");
  if (options.type === "clubes") pool = pool.filter((item) => item.tipo === "club");
  if (options.difficulty && options.difficulty !== "todos") pool = pool.filter((item) => item.dificultad === options.difficulty);
  if (options.ageGroupId && options.ageGroupId !== "todos") {
    const groupPoolIds = new Set(getDailyPool(options.ageGroupId).map((item) => item.nombre));
    const filteredByAge = pool.filter((item) => item.tipo === "club" || groupPoolIds.has(item.nombre) || item.edadPublico?.includes(options.ageGroupId));
    if (filteredByAge.length) pool = filteredByAge;
  }
  return pool.length ? pool : allItems;
}

function dedupeByName(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = normalizeText(item.nombre);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export { allPlayers, clubs, allItems, weeklyThemes, getWeeklyTheme };

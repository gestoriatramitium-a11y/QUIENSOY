import { normalizeText } from "../utils/normalizeText.js";

const modeLabels = {
  es: {
    diario: "Reto diario",
    rapido: "Modo Rapido",
    supervivencia: "Supervivencia",
    contrarreloj: "Contrarreloj",
    "liga-espanola": "Liga Espanola",
    mundiales: "Mundiales",
    "clubes-europeos": "Clubes Europeos",
    entrenamiento: "Entrenamiento",
    "especial-semana": "Especial de la semana"
  },
  en: {
    diario: "Daily Challenge",
    rapido: "Quick Match",
    supervivencia: "Survival",
    contrarreloj: "Time Attack",
    "liga-espanola": "Spanish League",
    mundiales: "World Cup Legends",
    "clubes-europeos": "European Clubs",
    entrenamiento: "Practice",
    "especial-semana": "Weekly Special"
  }
};

const shortModeLabels = {
  es: {
    diario: "Diario",
    rapido: "Rapido",
    supervivencia: "Supervivencia",
    contrarreloj: "Contrarreloj",
    "liga-espanola": "LaLiga",
    mundiales: "Mundiales",
    "clubes-europeos": "Clubes",
    entrenamiento: "Entreno",
    "especial-semana": "Especial"
  },
  en: {
    diario: "Daily",
    rapido: "Quick",
    supervivencia: "Survival",
    contrarreloj: "Time Attack",
    "liga-espanola": "LaLiga",
    mundiales: "World Cup",
    "clubes-europeos": "Clubs",
    entrenamiento: "Practice",
    "especial-semana": "Special"
  }
};

const difficulties = {
  es: { facil: "facil", media: "media", dificil: "dificil" },
  en: { facil: "easy", media: "medium", dificil: "hard" }
};

const feet = {
  es: { derecho: "Derecho", izquierda: "Izquierdo", izquierdo: "Izquierdo" },
  en: { derecho: "Right", derecha: "Right", izquierdo: "Left", izquierda: "Left" }
};

const positions = {
  delantero: "forward",
  "delantero centro": "striker",
  extremo: "winger",
  centrocampista: "midfielder",
  "centrocampista creativo": "creative midfielder",
  "centrocampista ofensivo": "attacking midfielder",
  mediocentro: "central midfielder",
  mediapunta: "attacking midfielder",
  defensa: "defender",
  "defensa central": "centre-back",
  lateral: "full-back",
  "lateral derecho": "right-back",
  "lateral izquierdo": "left-back",
  portero: "goalkeeper",
  futbolista: "footballer"
};

const nationalities = {
  argentino: "Argentinian",
  argentina: "Argentinian",
  belga: "Belgian",
  brasileno: "Brazilian",
  brasileño: "Brazilian",
  canadiense: "Canadian",
  croata: "Croatian",
  egipcio: "Egyptian",
  espanol: "Spanish",
  española: "Spanish",
  español: "Spanish",
  frances: "French",
  francés: "French",
  ingles: "English",
  inglés: "English",
  italiano: "Italian",
  marroqui: "Moroccan",
  marroquí: "Moroccan",
  neerlandes: "Dutch",
  neerlandés: "Dutch",
  nigeriano: "Nigerian",
  noruego: "Norwegian",
  polaco: "Polish",
  portugues: "Portuguese",
  portugués: "Portuguese",
  uruguayo: "Uruguayan",
  aleman: "German",
  alemán: "German"
};

const places = {
  alemania: "Germany",
  argentina: "Argentina",
  brasil: "Brazil",
  espana: "Spain",
  españa: "Spain",
  francia: "France",
  inglaterra: "England",
  italia: "Italy",
  madrid: "Madrid",
  paris: "Paris",
  "paris.": "Paris",
  portugal: "Portugal",
  turquia: "Turkey",
  turquía: "Turkey",
  londres: "London",
  munich: "Munich",
  múnich: "Munich",
  amsterdam: "Amsterdam",
  amsterdam: "Amsterdam",
  canada: "Canada",
  canadá: "Canada",
  marruecos: "Morocco",
  "estados unidos": "United States"
};

const quickLevels = {
  es: {
    Aficionado: "Aficionado",
    Promesa: "Promesa",
    Titular: "Titular",
    Crack: "Crack",
    Leyenda: "Leyenda"
  },
  en: {
    Aficionado: "Fan",
    Promesa: "Prospect",
    Titular: "Starter",
    Crack: "Star",
    Leyenda: "Legend"
  }
};

export function translateModeLabel(modeId, language = "en", fallback = "") {
  return modeLabels[language]?.[modeId] || fallback;
}

export function translateShortModeLabel(modeId, language = "en", fallback = "") {
  return shortModeLabels[language]?.[modeId] || translateModeLabel(modeId, language, fallback);
}

export function translateDifficulty(value, language = "en") {
  const key = normalizeText(value || "").toLowerCase();
  return difficulties[language]?.[key] || value || "";
}

export function translateFoot(value, language = "en") {
  const key = normalizeText(value || "").toLowerCase();
  return feet[language]?.[key] || value || "";
}

export function translatePosition(value, language = "en") {
  if (language === "es") return value || "";
  const key = normalizeText(value || "").toLowerCase();
  return positions[key] || value || "";
}

export function translateType(value, language = "en") {
  const key = normalizeText(value || "").toLowerCase();
  if (language === "es") return key === "club" ? "club europeo" : "jugador";
  return key === "club" ? "European club" : "player";
}

export function translateQuickLevel(level, language = "en") {
  return quickLevels[language]?.[level] || level;
}

export function translateExtraLabel(label, language = "en") {
  if (language === "es") return label;
  const key = normalizeText(label || "").toLowerCase();
  const labels = {
    pais: "Country",
    ciudad: "City",
    "color generico": "Generic color",
    "color generico": "Generic color",
    competicion: "Competition",
    inicial: "Initial",
    posicion: "Position",
    nacionalidad: "Nationality",
    liga: "League",
    epoca: "Era",
    "inicial apellido": "Surname initial"
  };
  return labels[key] || label;
}

export function translateExtraValue(label, value, language = "en") {
  if (language === "es") return value;
  const key = normalizeText(label || "").toLowerCase();
  if (key === "posicion") return translatePosition(value, language);
  if (key === "nacionalidad") return translateNationality(value);
  if (key === "epoca") return normalizeText(value).toLowerCase() === "actual" ? "Current" : "Legend";
  if (key === "pais" || key === "liga" || key === "ciudad") return translatePlace(value);
  return translateCommonValue(value);
}

export function getLocalizedClues(item, language = "en") {
  const clues = item?.pistas;
  if (!clues) return [];
  if (Array.isArray(clues)) {
    return language === "en" ? clues.map((clue, index) => translateClue(clue, item, index)) : clues;
  }
  if (Array.isArray(clues[language])) return clues[language];
  if (language === "en" && Array.isArray(clues.es)) return clues.es.map((clue, index) => translateClue(clue, item, index));
  return clues.es || clues.en || [];
}

export function translateClue(clue, item, index = 0) {
  const text = String(clue || "").trim();
  const normalized = normalizeText(text).toLowerCase();
  const initial = text.match(/empieza por\s+([A-ZÁÉÍÓÚÑ])/i)?.[1] || item?.nombre?.charAt(0)?.toUpperCase() || "";

  if (!text) return getGeneratedEnglishClue(item, index);
  if (normalized.includes("centrocampista creativo")) return "He is a creative midfielder.";
  if (normalized.includes("centrocampista ofensivo")) return "He is an attacking midfielder.";
  if (normalized.includes("delantero centro")) return "He is a striker.";
  if (normalized.includes("defensa central")) return "He is a centre-back.";
  if (normalized.includes("lateral derecho")) return "He is a right-back.";
  if (normalized.includes("lateral izquierdo")) return "He is a left-back.";
  if (normalized.includes("extremo zurdo")) return "He is a left-footed winger.";
  if (normalized.includes("atacante zurdo") || normalized === "es zurdo.") return "He is left-footed.";

  const positionMatch = normalized.match(/^es\s+(?:un\s+|una\s+)?(.+?)\.$/);
  if (positionMatch) {
    const subject = positionMatch[1];
    if (positions[subject]) return `He is a ${positions[subject]}.`;
    if (nationalities[subject]) return `He is ${nationalities[subject]}.`;
  }

  const nationalityMatch = normalized.match(/^representa a\s+(.+?)\.$/);
  if (nationalityMatch) return `He represents ${translatePlace(nationalityMatch[1])}.`;

  const hasPlayed = normalized.match(/^ha jugado en\s+(.+?)\.$/);
  if (hasPlayed) return `He has played in ${translatePlaces(hasPlayed[1])}.`;

  const playsIn = normalized.match(/^(juega|compite) en\s+(.+?)\.$/);
  if (playsIn) return `He plays in ${translatePlace(playsIn[2])}.`;

  if (normalized.includes("ha ganado un mundial")) return "He has won a World Cup.";
  if (normalized.includes("ha sido campeon del mundo")) return "He has been a world champion.";
  if (normalized.includes("gano un mundial")) return "He won a World Cup.";
  if (normalized.includes("gano un balon de oro")) return "He won a Ballon d'Or.";
  if (normalized.includes("debut")) return "He made his top-level debut very young.";
  if (normalized.includes("penaltis")) return "He is a penalty specialist.";
  if (normalized.includes("pases filtrados")) return "He is famous for through balls.";
  if (normalized.includes("pase corto")) return "He was a master of short passing.";
  if (normalized.includes("disparo lejano")) return "He has a great long-range shot.";
  if (normalized.includes("juego aereo")) return "He is strong in the air.";
  if (normalized.includes("muy rapido") || normalized.includes("muy veloz")) return "He is very fast.";
  if (normalized.includes("vision")) return "He stands out for his vision.";
  if (normalized.includes("regate")) return "He is known for his dribbling.";
  if (normalized.includes("control")) return "He stands out for his control.";
  if (normalized.includes("liderazgo defensivo")) return "He is known for defensive leadership.";
  if (normalized.includes("especialista en faltas")) return "He was a free-kick specialist.";
  if (normalized.includes("apellido empieza")) return `His surname starts with ${initial}.`;
  if (normalized.includes("nombre empieza") || normalized.includes("nombre corto empieza")) return `His first name starts with ${initial}.`;
  if (normalized.includes("inicial")) return `The initial is ${initial}.`;

  if (item?.tipo === "club") return getGeneratedEnglishClubClue(item, index);
  return getGeneratedEnglishClue(item, index);
}

function getGeneratedEnglishClue(item, index = 0) {
  if (!item) return "This is a clue about the answer.";
  const lastInitial = item.nombre?.split(" ").at(-1)?.charAt(0)?.toUpperCase() || item.nombre?.charAt(0)?.toUpperCase() || "";
  const clues = [
    `He is a ${translatePosition(item.posicion, "en") || "footballer"}.`,
    `He is ${translateNationality(item.nacionalidad)}.`,
    `His main league or context is ${translateCommonValue(item.liga || item.clubGenerico || "international football")}.`,
    `He is linked with ${translateCommonValue(item.clubGenerico || item.liga || "a well-known club")}.`,
    `He is a recognizable name for football fans.`,
    `His surname starts with ${lastInitial}.`
  ];
  return clues[index] || clues.at(-1);
}

function getGeneratedEnglishClubClue(item, index = 0) {
  const initial = item?.nombre?.charAt(0)?.toUpperCase() || "";
  const clues = [
    `It is a club from ${translatePlace(item.pais)}.`,
    `It plays in the city of ${translatePlace(item.ciudad)}.`,
    `Its generic colors are linked to ${translateCommonValue(item.coloresGenericos)}.`,
    `It has history in ${translateCommonValue(item.competicionFamosa || "European competition")}.`,
    "It is one of the most recognizable teams in its league.",
    `Its name starts with ${initial}.`
  ];
  return clues[index] || clues.at(-1);
}

function translateNationality(value = "") {
  const key = normalizeText(value).toLowerCase();
  return nationalities[key] || translatePlace(value);
}

function translatePlaces(value = "") {
  return value
    .split(/,\s*|\s+y\s+|\s+e\s+/)
    .map((part) => translatePlace(part))
    .join(", ");
}

function translatePlace(value = "") {
  const clean = String(value).trim();
  const key = normalizeText(clean).toLowerCase();
  return places[key] || translateCommonValue(clean);
}

function translateCommonValue(value = "") {
  const text = String(value || "");
  const key = normalizeText(text).toLowerCase();
  const common = {
    actual: "Current",
    leyenda: "Legend",
    "futbol internacional": "international football",
    "club generico": "a generic club",
    "competicion europea": "European competition",
    "liga espanola": "Spanish league",
    mundiales: "World Cups",
    "club europeo": "European club",
    "rojo y blanco": "red and white",
    "azul y rojo": "blue and red",
    "blanco": "white",
    "azul": "blue",
    "rojo": "red",
    "negro y azul": "black and blue",
    "negro y blanco": "black and white",
    "amarillo": "yellow"
  };
  return common[key] || text;
}

import { normalizeText } from "../utils/normalizeText.js";

const surnameParticles = new Set(["de", "del", "da", "di", "van", "von", "ter", "jr", "junior", "júnior"]);

export function makeAliases(name, extra = []) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0] || name;
  const last = [...parts].reverse().find((part) => !surnameParticles.has(normalizeText(part))) || parts.at(-1) || name;
  const initials = parts.map((part) => part[0]).join("");
  const compact = name.replace(/\s+/g, "");
  const normalizedName = normalizeText(name);
  const smartAliases = {
    "cristiano ronaldo": ["CR7", "C Ronaldo", "Cristiano", "Ronaldo"],
    "ronaldo nazario": ["R9", "Ronaldo Nazario", "El Fenómeno"],
    "kylian mbappe": ["Mbappe", "Kylian"],
    "vinicius junior": ["Vinicius", "Vini", "Vini Jr"],
    "jude bellingham": ["Belingham", "Jude"],
    "robert lewandowski": ["Lewandoski", "Lewa"],
    "antoine griezmann": ["Griezman", "Grizi"],
    "kevin de bruyne": ["De Bruyne", "De Bruine", "KDB"],
    "lionel messi": ["Messi", "Leo Messi"]
  };
  return [...new Set([name, first, last, initials, compact, ...(smartAliases[normalizedName] || []), ...extra].filter((item) => item && item.length > 1))];
}

export function buildPlayer(seed, index, prefix) {
  const lastInitial = seed.nombre.split(" ").at(-1)?.charAt(0).toUpperCase() || seed.nombre.charAt(0).toUpperCase();
  return {
    id: seed.id || `${prefix}-${String(index + 1).padStart(3, "0")}`,
    tipo: "player",
    aliases: makeAliases(seed.nombre, seed.aliases),
    nacionalidad: seed.nacionalidad || "Internacional",
    posicion: seed.posicion || "Futbolista",
    liga: seed.liga || "Fútbol internacional",
    clubGenerico: seed.clubGenerico || seed.club || "Club genérico",
    epoca: seed.epoca || "Actual",
    edadPublico: seed.edadPublico || ["young", "adults"],
    edad: seed.edad || 30,
    pieDominante: seed.pieDominante || "Derecho",
    dificultad: seed.dificultad || "media",
    tags: [...new Set([...(seed.tags || []), normalizeText(seed.nacionalidad || ""), normalizeText(seed.posicion || "")].filter(Boolean))],
    pistas: seed.pistas || [
      seed.pista1 || `Es un futbolista de época ${seed.epoca || "reciente"}.`,
      seed.pista2 || `Representa a ${seed.nacionalidad || "una selección conocida"}.`,
      seed.pista3 || `Su posición principal es ${seed.posicion || "futbolista"}.`,
      seed.pista4 || `Se le relaciona con ${seed.clubGenerico || seed.club || "un club importante"}.`,
      seed.pista5 || seed.logro || "Es un nombre reconocido por aficionados al fútbol.",
      `Su apellido empieza por ${lastInitial}.`
    ],
    nombre: seed.nombre
  };
}

export function buildClub(seed, index) {
  const initial = seed.nombre.charAt(0).toUpperCase();
  return {
    id: seed.id || `club-${String(index + 1).padStart(3, "0")}`,
    tipo: "club",
    aliases: makeAliases(seed.nombre, seed.aliases),
    pais: seed.pais,
    liga: seed.liga || seed.pais,
    ciudad: seed.ciudad,
    coloresGenericos: seed.coloresGenericos,
    competicionFamosa: seed.competicionFamosa || "competición europea",
    dificultad: seed.dificultad || "media",
    tags: [...new Set([...(seed.tags || []), normalizeText(seed.pais), normalizeText(seed.ciudad)].filter(Boolean))],
    pistas: seed.pistas || [
      `Es un club de ${seed.pais}.`,
      `Juega en la ciudad de ${seed.ciudad}.`,
      `Sus colores genéricos se asocian con ${seed.coloresGenericos}.`,
      `Tiene historia en ${seed.competicionFamosa || "Europa"}.`,
      seed.pista5 || "Es uno de los equipos más reconocibles de su liga.",
      `Su nombre empieza por ${initial}.`
    ],
    nombre: seed.nombre
  };
}

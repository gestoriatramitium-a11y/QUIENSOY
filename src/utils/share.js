import { SITE_URL, MAX_ATTEMPTS } from "../config/game.js";
import { getQuickLevel } from "./gameModes.js";

export function buildShareText(result) {
  if (result?.modeId === "rapido") {
    return `¿Quién Soy? Fútbol ⚽
Modo Rápido
Aciertos: ${result.correct}/5
Nivel: ${getQuickLevel(result.correct)} 🔥
Puntos: ${result.score}

¿Tú llegas a Leyenda?
${SITE_URL}`;
  }

  if (result?.modeId === "supervivencia" || result?.modeId === "contrarreloj") {
    return `¿Quién Soy? Fútbol ⚽
Modo: ${result.modeLabel}
Puntos: ${result.score}
Rondas: ${result.rounds}
Nivel: ${result.rank}

¿Puedes superarme?
${SITE_URL}`;
  }

  const mode = result?.modeLabel || "Reto diario";
  const category = result?.modeId === "diario" && result?.ageGroupLabel ? `Edad: ${result.ageGroupLabel}\n` : "";
  const status = result?.won ? `${result.attempts}/${MAX_ATTEMPTS} ✅` : `${MAX_ATTEMPTS}/${MAX_ATTEMPTS} ❌`;
  const squares = result?.won
    ? `${"🟩".repeat(result.attempts)}${"⬜".repeat(MAX_ATTEMPTS - result.attempts)}`
    : "🟥".repeat(MAX_ATTEMPTS);
  const outro = result?.modeId === "liga-espanola" ? "A ver si tú lo sacas antes 😏" : "¿Puedes superarme?";

  return `¿Quién Soy? Fútbol ⚽
Modo: ${mode}
${category}Resultado: ${status}
Puntos: ${result?.score || 0}

${squares}

${outro}
${SITE_URL}`;
}

export async function shareResult(result) {
  const text = buildShareText(result);
  if (navigator.share) {
    await navigator.share({ title: "¿Quién Soy? Fútbol", text, url: SITE_URL });
    return "shared";
  }

  await navigator.clipboard.writeText(text);
  return "copied";
}

import { SITE_URL, MAX_ATTEMPTS } from "../config/game.js";

export function buildShareText(result) {
  const category = result?.ageGroupLabel ? `Categoría: ${result.ageGroupLabel}\n` : "";

  if (result?.won) {
    return `¿Quién Soy? Fútbol ⚽
${category}Jugador de hoy: ✅ en ${result.attempts}/${MAX_ATTEMPTS}
${"🟩".repeat(result.attempts)}${"⬜".repeat(MAX_ATTEMPTS - result.attempts)}
¿Puedes superarme?

${SITE_URL}`;
  }

  return `¿Quién Soy? Fútbol ⚽
${category}Jugador de hoy: ❌ ${MAX_ATTEMPTS}/${MAX_ATTEMPTS}
${"🟥".repeat(MAX_ATTEMPTS)}
Mañana lo intento otra vez.

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

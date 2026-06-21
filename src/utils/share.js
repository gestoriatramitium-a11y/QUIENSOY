import { SITE_URL, MAX_ATTEMPTS } from "../config/game.js";
import { getQuickLevel } from "./gameModes.js";
import { translateModeLabel, translateQuickLevel } from "../i18n/gameText.js";

const COPY = {
  es: {
    title: "Quien Soy? Futbol",
    quick: "Modo Rapido",
    correct: "Aciertos",
    level: "Nivel",
    points: "Puntos",
    legendQuestion: "Tu llegas a Leyenda?",
    mode: "Modo",
    rounds: "Rondas",
    canBeat: "Puedes superarme?",
    daily: "Reto diario",
    age: "Edad",
    result: "Resultado",
    laligaOutro: "A ver si tu lo sacas antes"
  },
  en: {
    title: "Who Am I? Football",
    quick: "Quick Match",
    correct: "Correct",
    level: "Level",
    points: "Points",
    legendQuestion: "Can you reach Legend?",
    mode: "Mode",
    rounds: "Rounds",
    canBeat: "Can you beat me?",
    daily: "Daily Challenge",
    age: "Age",
    result: "Result",
    laligaOutro: "Let's see if you get it sooner"
  }
};

export function buildShareText(result, language = "en") {
  const copy = COPY[language] || COPY.en;

  if (result?.modeId === "rapido") {
    return `${copy.title}
${copy.quick}
${copy.correct}: ${result.correct}/5
${copy.level}: ${translateQuickLevel(getQuickLevel(result.correct), language)}
${copy.points}: ${result.score}

${copy.legendQuestion}
${SITE_URL}`;
  }

  if (result?.modeId === "supervivencia" || result?.modeId === "contrarreloj") {
    return `${copy.title}
${copy.mode}: ${translateModeLabel(result.modeId, language, result.modeLabel)}
${copy.points}: ${result.score}
${copy.rounds}: ${result.rounds}
${copy.level}: ${result.rank}

${copy.canBeat}
${SITE_URL}`;
  }

  const mode = translateModeLabel(result?.modeId, language, result?.modeLabel || copy.daily);
  const category = result?.modeId === "diario" && result?.ageGroupLabel ? `${copy.age}: ${result.ageGroupLabel}\n` : "";
  const status = result?.won ? `${result.attempts}/${MAX_ATTEMPTS} OK` : `${MAX_ATTEMPTS}/${MAX_ATTEMPTS} X`;
  const squares = result?.won ? `${"■".repeat(result.attempts)}${"□".repeat(MAX_ATTEMPTS - result.attempts)}` : "■".repeat(MAX_ATTEMPTS);
  const outro = result?.modeId === "liga-espanola" ? copy.laligaOutro : copy.canBeat;

  return `${copy.title}
${copy.mode}: ${mode}
${category}${copy.result}: ${status}
${copy.points}: ${result?.score || 0}

${squares}

${outro}
${SITE_URL}`;
}

export async function shareResult(result, language = "en") {
  const text = buildShareText(result, language);
  if (navigator.share) {
    await navigator.share({ title: COPY[language]?.title || COPY.en.title, text, url: SITE_URL });
    return "shared";
  }

  await navigator.clipboard.writeText(text);
  return "copied";
}

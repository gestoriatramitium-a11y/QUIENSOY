import InternalAdBanner from "./InternalAdBanner.jsx";
import ShareButton from "./ShareButton.jsx";
import { MAX_ATTEMPTS } from "../config/game.js";
import { getQuickLevel } from "../utils/gameModes.js";
import { getTimeToNextChallenge } from "../utils/datePlayer.js";
import { useI18n } from "../i18n/useI18n.js";
import { translateModeLabel, translateQuickLevel } from "../i18n/gameText.js";

const COPY = {
  es: {
    finalResult: "Resultado final",
    age: "Edad",
    rounds: "Rondas",
    level: "Nivel",
    visualResult: "Resultado visual",
    score: "Puntuacion",
    points: "puntos",
    tomorrow: "Volver manana. Nuevo reto en",
    quickFinished: "Modo rapido terminado",
    survivalFinished: "Supervivencia terminada",
    timeFinished: "Contrarreloj terminado",
    correct: "Correcto! Lo has adivinado en",
    attempts: "intentos",
    notEasy: "No era facil. La respuesta era"
  },
  en: {
    finalResult: "Final result",
    age: "Age",
    rounds: "Rounds",
    level: "Level",
    visualResult: "Visual result",
    score: "Score",
    points: "points",
    tomorrow: "Come back tomorrow. New challenge in",
    quickFinished: "Quick Match finished",
    survivalFinished: "Survival finished",
    timeFinished: "Time Attack finished",
    correct: "Correct! You guessed it in",
    attempts: "attempts",
    notEasy: "Not easy. The answer was"
  }
};

export default function ResultCard({ result, onShared }) {
  const { language } = useI18n();
  const copy = COPY[language] || COPY.en;
  if (!result) return null;
  const isQuick = result.modeId === "rapido";
  const isArcade = result.modeId === "supervivencia" || result.modeId === "contrarreloj";

  return (
    <section className={`result-card ${result.won ? "result-card--win" : "result-card--loss"}`}>
      <p className="eyebrow">{copy.finalResult}</p>
      {result.modeLabel && <p className="result-category">{translateModeLabel(result.modeId, language, result.modeLabel)}</p>}
      {result.ageGroupLabel && result.modeId === "diario" && (
        <p className="result-category">
          {copy.age}: {result.ageGroupLabel}
        </p>
      )}
      <h2>{getResultTitle(result, language, copy)}</h2>
      {isQuick || isArcade ? (
        <div className="quick-summary">
          <strong>{isArcade ? result.score : `${result.correct}/5`}</strong>
          <span>
            {isArcade
              ? `${copy.rounds}: ${result.rounds} - ${result.rank}`
              : `${copy.level}: ${translateQuickLevel(getQuickLevel(result.correct), language)}`}
          </span>
        </div>
      ) : (
        <div className="attempt-grid" aria-label={copy.visualResult}>
          {Array.from({ length: MAX_ATTEMPTS }, (_, index) => (
            <span
              className={
                result.won && index < result.attempts
                  ? "attempt-box attempt-box--win"
                  : result.won
                    ? "attempt-box"
                    : "attempt-box attempt-box--loss"
              }
              key={index}
            />
          ))}
        </div>
      )}
      <p className="score-line">
        {copy.score}: {result.score} {copy.points}
      </p>
      <ShareButton result={result} onShared={onShared} />
      <InternalAdBanner placement="result" />
      {result.modeId === "diario" && (
        <a className="secondary-link" href="/">
          {copy.tomorrow} {getTimeToNextChallenge()}.
        </a>
      )}
    </section>
  );
}

function getResultTitle(result, language, copy) {
  if (result.modeId === "rapido") return `${copy.quickFinished}: ${translateQuickLevel(getQuickLevel(result.correct), language)}.`;
  if (result.modeId === "supervivencia") return `${copy.survivalFinished}: ${result.rounds} ${copy.rounds.toLowerCase()}.`;
  if (result.modeId === "contrarreloj") return `${copy.timeFinished}: ${result.rank}.`;
  if (result.won) return `${copy.correct} ${result.attempts} ${copy.attempts}.`;
  return `${copy.notEasy}: ${result.playerName}.`;
}

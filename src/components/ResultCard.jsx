import InternalAdBanner from "./InternalAdBanner.jsx";
import ShareButton from "./ShareButton.jsx";
import { MAX_ATTEMPTS } from "../config/game.js";
import { getQuickLevel } from "../utils/gameModes.js";
import { getTimeToNextChallenge } from "../utils/datePlayer.js";

export default function ResultCard({ result, onShared }) {
  if (!result) return null;
  const isQuick = result.modeId === "rapido";
  const isArcade = result.modeId === "supervivencia" || result.modeId === "contrarreloj";

  return (
    <section className={`result-card ${result.won ? "result-card--win" : "result-card--loss"}`}>
      <p className="eyebrow">Resultado final</p>
      {result.modeLabel && <p className="result-category">{result.modeLabel}</p>}
      {result.ageGroupLabel && result.modeId === "diario" && <p className="result-category">Edad: {result.ageGroupLabel}</p>}
      <h2>{getResultTitle(result)}</h2>
      {isQuick || isArcade ? (
        <div className="quick-summary">
          <strong>{isArcade ? result.score : `${result.correct}/5`}</strong>
          <span>{isArcade ? `Rondas: ${result.rounds} · ${result.rank}` : `Nivel: ${getQuickLevel(result.correct)}`}</span>
        </div>
      ) : (
        <div className="attempt-grid" aria-label="Resultado visual">
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
      <p className="score-line">Puntuación: {result.score} puntos</p>
      <ShareButton result={result} onShared={onShared} />
      <InternalAdBanner placement="result" />
      {result.modeId === "diario" && (
        <a className="secondary-link" href="/">
          Volver mañana. Nuevo reto en {getTimeToNextChallenge()}.
        </a>
      )}
    </section>
  );
}

function getResultTitle(result) {
  if (result.modeId === "rapido") return `Modo rápido terminado: ${getQuickLevel(result.correct)}.`;
  if (result.modeId === "supervivencia") return `Supervivencia terminada: ${result.rounds} rondas.`;
  if (result.modeId === "contrarreloj") return `Contrarreloj terminado: ${result.rank}.`;
  if (result.won) return `¡Correcto! Lo has adivinado en ${result.attempts} intentos.`;
  return `No era fácil. La respuesta era: ${result.playerName}.`;
}

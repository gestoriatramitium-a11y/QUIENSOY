import InternalAdBanner from "./InternalAdBanner.jsx";
import ShareButton from "./ShareButton.jsx";
import { MAX_ATTEMPTS } from "../config/game.js";
import { getTimeToNextChallenge } from "../utils/datePlayer.js";

export default function ResultCard({ result, onShared }) {
  if (!result) return null;

  return (
    <section className={`result-card ${result.won ? "result-card--win" : "result-card--loss"}`}>
      <p className="eyebrow">Resultado final</p>
      {result.ageGroupLabel && <p className="result-category">Categoría: {result.ageGroupLabel}</p>}
      <h2>
        {result.won
          ? `¡Correcto! Lo has adivinado en ${result.attempts} intentos.`
          : `No era fácil. El jugador era: ${result.playerName}.`}
      </h2>
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
      <p className="score-line">Puntuación: {result.score} puntos</p>
      <ShareButton result={result} onShared={onShared} />
      <InternalAdBanner placement="result" />
      <a className="secondary-link" href="/">
        Volver mañana. Nuevo reto en {getTimeToNextChallenge()}.
      </a>
    </section>
  );
}

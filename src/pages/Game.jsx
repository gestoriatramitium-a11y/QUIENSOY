import { useMemo, useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import GameCard from "../components/GameCard.jsx";
import GuessInput from "../components/GuessInput.jsx";
import HintList from "../components/HintList.jsx";
import ResultCard from "../components/ResultCard.jsx";
import InterstitialAd from "../components/InterstitialAd.jsx";
import RewardedAdModal from "../components/RewardedAdModal.jsx";
import { DEV_ALLOW_REPLAY, MAX_ATTEMPTS } from "../config/game.js";
import { getDailyPlayer, getTimeToNextChallenge, getTodayKey } from "../utils/datePlayer.js";
import { isCloseGuess } from "../utils/normalizeText.js";
import { getDailyResult, recordFinishedGame } from "../utils/storage.js";

const extraHelpers = [
  { label: "Liga", getValue: (player) => player.liga },
  { label: "Posición", getValue: (player) => player.posicion },
  { label: "Club genérico", getValue: (player) => player.clubGenerico },
  {
    label: "Inicial apellido",
    getValue: (player) => player.nombre.split(" ").slice(-1)[0]?.charAt(0).toUpperCase()
  }
];

export default function Game() {
  const player = useMemo(() => getDailyPlayer(), []);
  const dateKey = useMemo(() => getTodayKey(), []);
  const savedResult = !DEV_ALLOW_REPLAY ? getDailyResult(dateKey) : null;
  const [result, setResult] = useState(savedResult);
  const [attempts, setAttempts] = useState(savedResult?.attempts || 0);
  const [visibleHints, setVisibleHints] = useState(savedResult ? MAX_ATTEMPTS : 1);
  const [message, setMessage] = useState(savedResult ? "Ya completaste el reto de hoy." : "Primera pista desbloqueada.");
  const [revealedExtra, setRevealedExtra] = useState([]);
  const [interstitialOpen, setInterstitialOpen] = useState(false);
  const [rewardedOpen, setRewardedOpen] = useState(false);

  const completed = Boolean(result);
  const progress = Math.min(100, (attempts / MAX_ATTEMPTS) * 100);

  function finishGame(nextAttempts, won) {
    const finalResult = recordFinishedGame({ dateKey, player, attempts: nextAttempts, won });
    setResult(finalResult);
    setVisibleHints(MAX_ATTEMPTS);
    setMessage(won ? `¡Correcto! Lo has adivinado en ${nextAttempts} intentos.` : `No era fácil. El jugador era: ${player.nombre}.`);
    setInterstitialOpen(true);
  }

  function handleGuess(value) {
    if (completed) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (isCloseGuess(value, player.nombre)) {
      finishGame(nextAttempts, true);
      return;
    }

    if (nextAttempts >= MAX_ATTEMPTS) {
      finishGame(nextAttempts, false);
      return;
    }

    setVisibleHints(Math.min(MAX_ATTEMPTS, nextAttempts + 1));
    setMessage("No es. Se ha desbloqueado una pista nueva.");
  }

  function unlockReward() {
    const nextHelper = extraHelpers.find((helper) => !revealedExtra.some((item) => item.label === helper.label));
    if (nextHelper) {
      setRevealedExtra([...revealedExtra, { label: nextHelper.label, value: nextHelper.getValue(player) }]);
      setMessage(`Pista extra desbloqueada: ${nextHelper.label}.`);
    }
    setRewardedOpen(false);
  }

  return (
    <div className="page game-page">
      <AdBanner placement="top" />
      <section className="game-layout">
        <div className="game-main">
          <div className="game-topline">
            <div>
              <p className="eyebrow">Reto diario</p>
              <h1>Jugador oculto</h1>
            </div>
            <div className="attempt-counter">
              {attempts}/{MAX_ATTEMPTS} intentos
            </div>
          </div>
          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>

          {result?.won && <div className="confetti" aria-hidden="true" />}

          <GameCard player={player} revealedExtra={revealedExtra} />
          <p className={`game-message ${message.startsWith("No") ? "game-message--error" : ""}`}>{message}</p>

          {!completed && (
            <>
              <HintList hints={player.pistas} visibleCount={visibleHints} />
              <GuessInput disabled={completed} onGuess={handleGuess} />
              <button className="reward-button" type="button" onClick={() => setRewardedOpen(true)}>
                Ver anuncio para desbloquear una pista extra
              </button>
            </>
          )}

          {completed && (
            <ResultCard
              result={result}
              onShared={() => {
                setInterstitialOpen(true);
              }}
            />
          )}

          {completed && <p className="tomorrow-note">Volver mañana · Nuevo reto en {getTimeToNextChallenge()}</p>}
        </div>
      </section>
      <AdBanner placement="bottom" />
      <InterstitialAd open={interstitialOpen} onClose={() => setInterstitialOpen(false)} />
      <RewardedAdModal open={rewardedOpen} onReward={unlockReward} onCancel={() => setRewardedOpen(false)} />
    </div>
  );
}

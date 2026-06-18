import { useEffect, useMemo, useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import AgeGroupSelector from "../components/AgeGroupSelector.jsx";
import GameCard from "../components/GameCard.jsx";
import GuessInput from "../components/GuessInput.jsx";
import HintList from "../components/HintList.jsx";
import ResultCard from "../components/ResultCard.jsx";
import InterstitialAd from "../components/InterstitialAd.jsx";
import RewardedAdModal from "../components/RewardedAdModal.jsx";
import { getAgeGroup } from "../config/ageGroups.js";
import { DEV_ALLOW_REPLAY, MAX_ATTEMPTS } from "../config/game.js";
import { getDailyPlayer, getTimeToNextChallenge, getTodayKey } from "../utils/datePlayer.js";
import { isCloseGuess } from "../utils/normalizeText.js";
import {
  getDailyResult,
  getPreferredAgeGroup,
  recordFinishedGame,
  savePreferredAgeGroup
} from "../utils/storage.js";

const extraHelpers = [
  { label: "Liga", getValue: (player) => player.liga },
  { label: "Posición", getValue: (player) => player.posicion },
  { label: "Club genérico", getValue: (player) => player.clubGenerico },
  {
    label: "Inicial apellido",
    getValue: (player) => player.nombre.split(" ").slice(-1)[0]?.charAt(0).toUpperCase()
  }
];

function getInitialState(dateKey, ageGroupId) {
  const player = getDailyPlayer(new Date(), ageGroupId);
  const savedResult = !DEV_ALLOW_REPLAY ? getDailyResult(dateKey, ageGroupId) : null;

  return {
    player,
    result: savedResult,
    attempts: savedResult?.attempts || 0,
    visibleHints: savedResult ? MAX_ATTEMPTS : 1,
    message: savedResult ? "Ya completaste el reto de hoy en esta categoría." : "Primera pista desbloqueada.",
    revealedExtra: []
  };
}

export default function Game() {
  const dateKey = useMemo(() => getTodayKey(), []);
  const [ageGroupId, setAgeGroupId] = useState(() => getPreferredAgeGroup());
  const [state, setState] = useState(() => getInitialState(dateKey, getPreferredAgeGroup()));
  const [interstitialOpen, setInterstitialOpen] = useState(false);
  const [rewardedOpen, setRewardedOpen] = useState(false);

  const ageGroup = getAgeGroup(ageGroupId);
  const completed = Boolean(state.result);
  const progress = Math.min(100, (state.attempts / MAX_ATTEMPTS) * 100);

  useEffect(() => {
    savePreferredAgeGroup(ageGroupId);
    setState(getInitialState(dateKey, ageGroupId));
    setRewardedOpen(false);
    setInterstitialOpen(false);
  }, [ageGroupId, dateKey]);

  function finishGame(nextAttempts, won) {
    const finalResult = recordFinishedGame({
      dateKey,
      ageGroupId,
      player: state.player,
      attempts: nextAttempts,
      won
    });

    setState((current) => ({
      ...current,
      result: finalResult,
      visibleHints: MAX_ATTEMPTS,
      message: won
        ? `¡Correcto! Lo has adivinado en ${nextAttempts} intentos.`
        : `No era fácil. El jugador era: ${current.player.nombre}.`
    }));
    setInterstitialOpen(true);
  }

  function handleGuess(value) {
    if (completed) return;
    const nextAttempts = state.attempts + 1;

    setState((current) => ({
      ...current,
      attempts: nextAttempts
    }));

    if (isCloseGuess(value, state.player.nombre)) {
      finishGame(nextAttempts, true);
      return;
    }

    if (nextAttempts >= MAX_ATTEMPTS) {
      finishGame(nextAttempts, false);
      return;
    }

    setState((current) => ({
      ...current,
      visibleHints: Math.min(MAX_ATTEMPTS, nextAttempts + 1),
      message: "No es. Se ha desbloqueado una pista nueva."
    }));
  }

  function unlockReward() {
    const nextHelper = extraHelpers.find((helper) => !state.revealedExtra.some((item) => item.label === helper.label));
    if (nextHelper) {
      setState((current) => ({
        ...current,
        revealedExtra: [...current.revealedExtra, { label: nextHelper.label, value: nextHelper.getValue(current.player) }],
        message: `Pista extra desbloqueada: ${nextHelper.label}.`
      }));
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
              <p className="eyebrow">Reto diario · {ageGroup.shortTitle}</p>
              <h1>Jugador oculto</h1>
            </div>
            <div className="attempt-counter">
              {state.attempts}/{MAX_ATTEMPTS} intentos
            </div>
          </div>

          <AgeGroupSelector selectedAgeGroupId={ageGroupId} onChange={setAgeGroupId} compact />

          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>

          {state.result?.won && <div className="confetti" aria-hidden="true" />}

          <GameCard player={state.player} revealedExtra={state.revealedExtra} />
          <p className={`game-message ${state.message.startsWith("No") ? "game-message--error" : ""}`}>
            {state.message}
          </p>

          {!completed && (
            <>
              <HintList hints={state.player.pistas} visibleCount={state.visibleHints} />
              <GuessInput disabled={completed} onGuess={handleGuess} />
              <button className="reward-button" type="button" onClick={() => setRewardedOpen(true)}>
                Ver anuncio para desbloquear una pista extra
              </button>
            </>
          )}

          {completed && (
            <ResultCard
              result={state.result}
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

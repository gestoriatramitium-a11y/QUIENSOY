import { useEffect, useMemo, useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import AgeGroupSelector from "../components/AgeGroupSelector.jsx";
import GameCard from "../components/GameCard.jsx";
import GuessInput from "../components/GuessInput.jsx";
import HintList from "../components/HintList.jsx";
import ResultCard from "../components/ResultCard.jsx";
import SuggestionBox from "../components/SuggestionBox.jsx";
import InterstitialAd from "../components/InterstitialAd.jsx";
import RewardedAdModal from "../components/RewardedAdModal.jsx";
import { getAgeGroup } from "../config/ageGroups.js";
import { DEV_ALLOW_REPLAY, GAME_CONFIG, MAX_ATTEMPTS } from "../config/game.js";
import { getTimeToNextChallenge, getTodayKey } from "../utils/datePlayer.js";
import { findBestMatch } from "../utils/fuzzyMatch.js";
import { getScore } from "../utils/scoring.js";
import { playSound } from "../utils/sound.js";
import { vibrate } from "../utils/haptics.js";
import {
  getDailyItem,
  getMode,
  getQuickLevel,
  getQuickRounds,
  getRandomItemForMode,
  getTimeAttackRank,
  getWeeklyTheme
} from "../utils/gameModes.js";
import {
  getDailyResult,
  getPreferredAgeGroup,
  recordArcadeGame,
  recordFinishedGame,
  recordQuickGame,
  savePreferredAgeGroup
} from "../utils/storage.js";

function getQueryMode() {
  const rawMode = new URLSearchParams(window.location.search).get("modo") || "diario";
  if (rawMode === "quick") return "rapido";
  if (rawMode === "survival") return "supervivencia";
  if (rawMode === "time-attack") return "contrarreloj";
  return rawMode;
}

function getPracticeOptions() {
  const params = new URLSearchParams(window.location.search);
  return {
    type: params.get("tipo") || "mixto",
    category: params.get("categoria") || "todos",
    difficulty: params.get("dificultad") || "todos",
    ageGroupId: params.get("edad") || getPreferredAgeGroup()
  };
}

function getInitialSingleState({ modeId, dateKey, ageGroupId }) {
  const mode = getMode(modeId);
  const item = mode.daily ? getDailyItem(new Date(), ageGroupId) : getRandomItemForMode(mode.id, getPracticeOptions());
  const savedResult = mode.daily && !DEV_ALLOW_REPLAY ? getDailyResult(dateKey, ageGroupId) : null;

  return {
    item,
    result: savedResult,
    attempts: savedResult?.attempts || 0,
    visibleHints: savedResult ? MAX_ATTEMPTS : 1,
    message: savedResult ? "Ya completaste el reto de hoy en esta categoría." : "Primera pista desbloqueada.",
    revealedExtra: [],
    guesses: [],
    suggestion: null
  };
}

export default function Game() {
  const dateKey = useMemo(() => getTodayKey(), []);
  const [modeId] = useState(() => getQueryMode());
  const mode = getMode(modeId);
  const [ageGroupId, setAgeGroupId] = useState(() => getPreferredAgeGroup());
  const [single, setSingle] = useState(() => getInitialSingleState({ modeId: mode.id, dateKey, ageGroupId: getPreferredAgeGroup() }));
  const [quick, setQuick] = useState(() => buildQuickState(mode.id));
  const [arcade, setArcade] = useState(() => buildArcadeState(mode.id));
  const [interstitialOpen, setInterstitialOpen] = useState(false);
  const [rewardedOpen, setRewardedOpen] = useState(false);

  const ageGroup = getAgeGroup(ageGroupId);
  const isQuick = mode.quick;
  const isArcade = mode.survival || mode.timeAttack;
  const currentItem = isArcade ? arcade.item : isQuick ? quick.rounds[quick.index] : single.item;
  const maxAttempts = isQuick || mode.timeAttack ? GAME_CONFIG.QUICK_MODE_MAX_ATTEMPTS : MAX_ATTEMPTS;
  const maxHints = isQuick || mode.timeAttack ? GAME_CONFIG.QUICK_MODE_MAX_HINTS : MAX_ATTEMPTS;
  const attempts = isArcade ? arcade.attempts : isQuick ? quick.attempts : single.attempts;
  const visibleHints = isArcade ? arcade.visibleHints : isQuick ? quick.visibleHints : single.visibleHints;
  const completed = isArcade ? arcade.completed : isQuick ? quick.completed : Boolean(single.result);
  const result = isArcade ? arcade.result : isQuick ? quick.result : single.result;
  const suggestion = isArcade ? arcade.suggestion : isQuick ? quick.suggestion : single.suggestion;
  const revealedExtra = isArcade ? arcade.revealedExtra : isQuick ? quick.revealedExtra : single.revealedExtra;
  const message = isArcade ? arcade.message : isQuick ? quick.message : single.message;
  const guesses = isArcade ? arcade.guesses : isQuick ? quick.guesses : single.guesses;
  const progress = Math.min(100, (attempts / maxAttempts) * 100);
  const weeklyTheme = mode.weekly ? getWeeklyTheme() : null;

  useEffect(() => {
    savePreferredAgeGroup(ageGroupId);
    if (mode.daily) setSingle(getInitialSingleState({ modeId: mode.id, dateKey, ageGroupId }));
  }, [ageGroupId, dateKey, mode.daily, mode.id]);

  useEffect(() => {
    if (!mode.timeAttack || arcade.completed) return undefined;
    const timer = window.setInterval(() => {
      setArcade((current) => {
        if (current.completed) return current;
        const timeLeft = Math.max(0, current.timeLeft - 1);
        if (timeLeft <= 0) {
          const result = recordArcadeGame({
            dateKey,
            modeId: "contrarreloj",
            points: current.points,
            rounds: current.roundsCleared,
            correct: current.correct,
            rank: getTimeAttackRank(current.points)
          });
          setInterstitialOpen(true);
          playSound("finish");
          return { ...current, timeLeft: 0, completed: true, result, message: `Tiempo terminado. Rango: ${result.rank}.` };
        }
        return { ...current, timeLeft };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [arcade.completed, dateKey, mode.timeAttack]);

  function handleGuess(value) {
    if (completed) return;
    const match = findBestMatch(value, [currentItem]);

    if (match.type === "exact" || match.type === "accepted_fuzzy") {
      playSound("success");
      vibrate(45);
      if (isArcade) finishArcadeRound(true, match.type === "accepted_fuzzy" ? "Lo damos por bueno ✅" : "¡Correcto!");
      else if (isQuick) finishQuickRound(true, match.type === "accepted_fuzzy" ? "Lo damos por bueno ✅" : "¡Correcto!");
      else finishSingle(single.attempts + 1, true, match.type === "accepted_fuzzy" ? "Lo damos por bueno ✅" : "");
      return;
    }

    if (match.type === "suggestion") {
      if (isArcade) setArcade((current) => ({ ...current, suggestion: match }));
      else if (isQuick) setQuick((current) => ({ ...current, suggestion: match }));
      else setSingle((current) => ({ ...current, suggestion: match }));
      return;
    }

    playSound("fail");
    vibrate([20, 20, 20]);
    if (isArcade) handleArcadeWrong(value);
    else if (isQuick) handleQuickWrong(value);
    else handleSingleWrong(value);
  }

  function finishSingle(nextAttempts, won, customMessage = "") {
    const result = recordFinishedGame({ dateKey, modeId: mode.id, ageGroupId, item: single.item, attempts: nextAttempts, won });
    setSingle((current) => ({
      ...current,
      result,
      visibleHints: MAX_ATTEMPTS,
      suggestion: null,
      message: customMessage || (won ? `¡Correcto! Lo has adivinado en ${nextAttempts} intentos.` : `No era fácil. La respuesta era: ${current.item.nombre}.`)
    }));
    setInterstitialOpen(true);
  }

  function handleSingleWrong(value) {
    const nextAttempts = single.attempts + 1;
    if (nextAttempts >= MAX_ATTEMPTS) {
      setSingle((current) => ({ ...current, guesses: [...current.guesses, value] }));
      finishSingle(nextAttempts, false);
      return;
    }
    setSingle((current) => ({
      ...current,
      attempts: nextAttempts,
      visibleHints: Math.min(MAX_ATTEMPTS, nextAttempts + 1),
      guesses: [...current.guesses, value],
      message: "No parece ser ese jugador. Se desbloquea otra pista."
    }));
  }

  function finishQuickRound(won, customMessage) {
    const nextCorrect = quick.correct + (won ? 1 : 0);
    const nextPoints = quick.points + (won ? 100 - quick.attempts * 20 : 0);
    const nextRounds = [...quick.finishedRounds, { nombre: currentItem.nombre, won }];
    const nextIndex = quick.index + 1;

    if (nextIndex >= quick.rounds.length) {
      const result = recordQuickGame({ dateKey, correct: nextCorrect, points: nextPoints, rounds: nextRounds });
      setQuick((current) => ({
        ...current,
        completed: true,
        correct: nextCorrect,
        points: nextPoints,
        finishedRounds: nextRounds,
        result,
        message: `Modo rápido terminado. Nivel: ${getQuickLevel(nextCorrect)}.`
      }));
      setInterstitialOpen(true);
      playSound("finish");
      return;
    }

    setQuick((current) => ({
      ...current,
      index: nextIndex,
      attempts: 0,
      visibleHints: 1,
      correct: nextCorrect,
      points: nextPoints,
      finishedRounds: nextRounds,
      guesses: [],
      suggestion: null,
      revealedExtra: [],
      message: customMessage
    }));
  }

  function handleQuickWrong(value) {
    const nextAttempts = quick.attempts + 1;
    if (nextAttempts >= GAME_CONFIG.QUICK_MODE_MAX_ATTEMPTS) {
      finishQuickRound(false, `Era ${currentItem.nombre}.`);
      return;
    }
    setQuick((current) => ({
      ...current,
      attempts: nextAttempts,
      visibleHints: Math.min(GAME_CONFIG.QUICK_MODE_MAX_HINTS, nextAttempts + 1),
      guesses: [...current.guesses, value],
      message: "Fallaste. Nueva pista y seguimos rápido."
    }));
  }

  function finishArcadeRound(won, customMessage) {
    const attemptNumber = Math.max(1, arcade.attempts + 1);
    const pointsWon = won
      ? mode.timeAttack
        ? [100, 70, 40][Math.min(arcade.visibleHints, 3) - 1] || 40
        : getScore(attemptNumber, true) + (arcade.roundsCleared > 0 && (arcade.roundsCleared + 1) % 5 === 0 ? 100 : 0)
      : 0;
    const nextLives = mode.survival && !won ? arcade.lives - 1 : arcade.lives;
    const nextState = {
      ...arcade,
      item: getRandomItemForMode(mode.id),
      attempts: 0,
      visibleHints: 1,
      guesses: [],
      suggestion: null,
      revealedExtra: [],
      timeLeft: mode.timeAttack && !won ? Math.max(0, arcade.timeLeft - 5) : arcade.timeLeft,
      points: arcade.points + pointsWon,
      correct: arcade.correct + (won ? 1 : 0),
      roundsCleared: arcade.roundsCleared + (won ? 1 : 0),
      lives: nextLives,
      message: customMessage
    };

    if (mode.survival && nextLives <= 0) {
      finishArcadeGame(nextState);
      return;
    }
    setArcade(nextState);
  }

  function handleArcadeWrong(value) {
    const nextAttempts = arcade.attempts + 1;
    if (nextAttempts >= maxAttempts) {
      finishArcadeRound(false, `Era ${currentItem.nombre}.`);
      return;
    }
    setArcade((current) => ({
      ...current,
      attempts: nextAttempts,
      visibleHints: Math.min(maxHints, nextAttempts + 1),
      guesses: [...current.guesses, value],
      timeLeft: mode.timeAttack ? Math.max(0, current.timeLeft - 2) : current.timeLeft,
      message: mode.timeAttack ? "No es. Pierdes 2 segundos." : "No es. Se desbloquea otra pista."
    }));
  }

  function finishArcadeGame(finalState = arcade) {
    const rank = mode.timeAttack ? getTimeAttackRank(finalState.points) : `Nivel ${Math.max(1, Math.floor(finalState.roundsCleared / 5) + 1)}`;
    const result = recordArcadeGame({
      dateKey,
      modeId: mode.id,
      points: finalState.points,
      rounds: finalState.roundsCleared,
      correct: finalState.correct,
      rank
    });
    setArcade((current) => ({ ...current, ...finalState, completed: true, result, message: `Partida terminada. ${rank}.` }));
    setInterstitialOpen(true);
    playSound("finish");
  }

  function acceptSuggestion() {
    if (isArcade) finishArcadeRound(true, "Lo damos por bueno ✅");
    else if (isQuick) finishQuickRound(true, "Lo damos por bueno ✅");
    else finishSingle(single.attempts + 1, true, "Lo damos por bueno ✅");
  }

  function rejectSuggestion() {
    if (isArcade) setArcade((current) => ({ ...current, suggestion: null }));
    else if (isQuick) setQuick((current) => ({ ...current, suggestion: null }));
    else setSingle((current) => ({ ...current, suggestion: null }));
  }

  function skipRound() {
    if (isQuick) {
      finishQuickRound(false, `Saltaste: ${currentItem.nombre}.`);
      return;
    }
    if (isArcade) {
      if (mode.timeAttack) setArcade((current) => ({ ...current, timeLeft: Math.max(0, current.timeLeft - 5) }));
      finishArcadeRound(false, `Saltaste: ${currentItem.nombre}.`);
    }
  }

  function nextSingleGame() {
    setSingle(getInitialSingleState({ modeId: mode.id, dateKey, ageGroupId }));
  }

  function unlockReward() {
    const helper = getRewardHelper(currentItem, revealedExtra);
    if (!helper) {
      setRewardedOpen(false);
      return;
    }
    if (isArcade) {
      setArcade((current) => ({
        ...current,
        timeLeft: mode.timeAttack ? Math.max(0, current.timeLeft - 3) : current.timeLeft,
        revealedExtra: [...current.revealedExtra, helper],
        message: `Ayuda extra: ${helper.label}.`
      }));
    } else if (isQuick) {
      setQuick((current) => ({ ...current, revealedExtra: [...current.revealedExtra, helper], message: `Ayuda extra: ${helper.label}.` }));
    } else {
      setSingle((current) => ({ ...current, revealedExtra: [...current.revealedExtra, helper], message: `Ayuda extra: ${helper.label}.` }));
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
              <p className="eyebrow">
                {weeklyTheme ? `Especial de la semana: ${weeklyTheme.title}` : mode.label}
                {mode.daily ? ` · ${ageGroup.shortTitle}` : ""}
              </p>
              <h1>{getGameHeading({ isQuick, isArcade, quick, arcade, mode, currentItem })}</h1>
            </div>
            <div className="attempt-counter">
              {attempts}/{maxAttempts} intentos
            </div>
          </div>

          {isArcade && (
            <div className="arcade-hud">
              {mode.survival && <span>Vidas: {"♥".repeat(Math.max(0, arcade.lives))}</span>}
              {mode.timeAttack && <span>Tiempo: {arcade.timeLeft}s</span>}
              <span>Puntos: {arcade.points}</span>
              <span>Aciertos: {arcade.correct}</span>
            </div>
          )}

          {mode.daily && <AgeGroupSelector selectedAgeGroupId={ageGroupId} onChange={setAgeGroupId} compact />}

          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>

          <GameCard player={currentItem} revealedExtra={revealedExtra} modeLabel={mode.shortLabel} />
          <p className={`game-message ${message?.startsWith("No") || message?.startsWith("Fallaste") ? "game-message--error" : ""}`}>
            {message}
          </p>

          {guesses.length > 0 && (
            <div className="guess-history">
              {guesses.map((guess, index) => (
                <span key={`${guess}-${index}`}>{guess}</span>
              ))}
            </div>
          )}

          <SuggestionBox suggestion={suggestion} onAccept={acceptSuggestion} onReject={rejectSuggestion} />

          {!completed && (
            <>
              <HintList hints={currentItem.pistas.slice(0, maxHints)} visibleCount={visibleHints} />
              <GuessInput disabled={completed || Boolean(suggestion)} onGuess={handleGuess} />
              <button className="reward-button" type="button" onClick={() => setRewardedOpen(true)}>
                Ver anuncio para conseguir ayuda extra
              </button>
              {(isQuick || isArcade) && (
                <button className="ghost-button full-width-button" type="button" onClick={skipRound}>
                  Saltar
                </button>
              )}
            </>
          )}

          {completed && <ResultCard result={result} onShared={() => setInterstitialOpen(true)} />}

          {completed && !mode.daily && !isQuick && !isArcade && (
            <button className="primary-button full-width-button" type="button" onClick={nextSingleGame}>
              Siguiente jugador
            </button>
          )}

          {completed && (isQuick || isArcade) && (
            <a className="primary-button full-width-button" href={`/jugar?modo=${mode.id}`}>
              Jugar otra vez
            </a>
          )}

          {completed && mode.daily && <p className="tomorrow-note">Volver mañana · Nuevo reto en {getTimeToNextChallenge()}</p>}
          <div className="mode-jump">
            <a href="/">Ir a otros modos</a>
            <a href="/practica">Entrenamiento</a>
          </div>
        </div>
      </section>
      <AdBanner placement="bottom" />
      <InterstitialAd open={interstitialOpen} onClose={() => setInterstitialOpen(false)} />
      <RewardedAdModal open={rewardedOpen} onReward={unlockReward} onCancel={() => setRewardedOpen(false)} />
    </div>
  );
}

function buildQuickState(modeId) {
  if (getMode(modeId).id !== "rapido") {
    return { rounds: [], index: 0, attempts: 0, visibleHints: 1, correct: 0, points: 0, finishedRounds: [], guesses: [], revealedExtra: [] };
  }
  return {
    rounds: getQuickRounds(),
    index: 0,
    attempts: 0,
    visibleHints: 1,
    correct: 0,
    points: 0,
    finishedRounds: [],
    guesses: [],
    revealedExtra: [],
    suggestion: null,
    message: "Ronda rápida. Tienes pocas pistas: piensa y responde.",
    completed: false,
    result: null
  };
}

function buildArcadeState(modeId) {
  const mode = getMode(modeId);
  if (!mode.survival && !mode.timeAttack) {
    return {
      item: null,
      lives: 3,
      timeLeft: 60,
      attempts: 0,
      visibleHints: 1,
      points: 0,
      correct: 0,
      roundsCleared: 0,
      guesses: [],
      revealedExtra: [],
      suggestion: null,
      completed: false,
      result: null,
      message: ""
    };
  }
  return {
    item: getRandomItemForMode(mode.id),
    lives: 3,
    timeLeft: 60,
    attempts: 0,
    visibleHints: 1,
    points: 0,
    correct: 0,
    roundsCleared: 0,
    guesses: [],
    revealedExtra: [],
    suggestion: null,
    completed: false,
    result: null,
    message: mode.timeAttack ? "60 segundos. Acierta rápido o salta." : "Empiezas con 3 vidas. ¿Cuántas rondas aguantas?"
  };
}

function getGameHeading({ isQuick, isArcade, quick, arcade, mode, currentItem }) {
  if (isQuick) return `Ronda ${quick.index + 1}/5`;
  if (isArcade && mode.survival) return `Ronda ${arcade.roundsCleared + 1}`;
  if (isArcade && mode.timeAttack) return "Contrarreloj";
  return currentItem?.tipo === "club" ? "Club oculto" : "Jugador oculto";
}

function getRewardHelper(item, revealedExtra = []) {
  const helpers =
    item?.tipo === "club"
      ? [
          { label: "País", value: item.pais },
          { label: "Ciudad", value: item.ciudad },
          { label: "Color genérico", value: item.coloresGenericos },
          { label: "Competición", value: item.competicionFamosa },
          { label: "Inicial", value: item.nombre.charAt(0).toUpperCase() }
        ]
      : [
          { label: "Posición", value: item.posicion },
          { label: "Nacionalidad", value: item.nacionalidad },
          { label: "Liga", value: item.liga },
          { label: "Época", value: item.epoca },
          { label: "Inicial apellido", value: item.nombre.split(" ").slice(-1)[0]?.charAt(0).toUpperCase() }
        ];
  return helpers.find((helper) => !revealedExtra.some((item) => item.label === helper.label));
}

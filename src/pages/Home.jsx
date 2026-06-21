import { useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import AgeGroupSelector from "../components/AgeGroupSelector.jsx";
import InternalAdBanner from "../components/InternalAdBanner.jsx";
import Disclaimer from "../components/Disclaimer.jsx";
import { getAgeGroup } from "../config/ageGroups.js";
import { PLATFORM_CONFIG } from "../config/platform.js";
import { useI18n } from "../i18n/useI18n.js";
import { getDailyPlayer, getTimeToNextChallenge } from "../utils/datePlayer.js";
import { getModeCards, getWeeklyTheme } from "../utils/gameModes.js";
import { getProgression, getXPProgress } from "../utils/progression.js";
import { getPreferredAgeGroup, getStats, savePreferredAgeGroup } from "../utils/storage.js";

const TUTORIAL_KEY = "quienSoyFutbolTutorialSeen";

export default function Home() {
  const { t } = useI18n();
  const [ageGroupId, setAgeGroupId] = useState(() => getPreferredAgeGroup());
  const [showTutorial, setShowTutorial] = useState(() => localStorage.getItem(TUTORIAL_KEY) !== "true");
  const ageGroup = getAgeGroup(ageGroupId);
  const player = getDailyPlayer(new Date(), ageGroupId);
  const stats = getStats();
  const weekly = getWeeklyTheme();
  const progression = getProgression();
  const xp = getXPProgress(progression);

  function handleAgeGroupChange(nextAgeGroupId) {
    setAgeGroupId(nextAgeGroupId);
    savePreferredAgeGroup(nextAgeGroupId);
  }

  function closeTutorial(play = false) {
    localStorage.setItem(TUTORIAL_KEY, "true");
    setShowTutorial(false);
    if (play) window.location.href = "/jugar?modo=rapido";
  }

  return (
    <div className={`page game-menu theme-${progression.selectedTheme}`}>
      {PLATFORM_CONFIG.platform === "web" && <AdBanner placement="top" />}
      {showTutorial && <Tutorial t={t} onClose={closeTutorial} />}
      <section className="hero menu-hero">
        <div className="hero-content">
          <p className="eyebrow">{t("gameSubtitle")}</p>
          <h1>{t("gameTitle")}</h1>
          <p className="hero-lead">Fast football clue game with daily challenges, survival, time attack, XP and local achievements.</p>
          <div className="hero-actions">
            <a className="primary-button play-now-button" href="/jugar?modo=rapido">
              {t("playNow")}
            </a>
            <a className="ghost-button" href="/jugar?modo=supervivencia">
              {t("survival")}
            </a>
            <a className="ghost-button" href="/jugar?modo=contrarreloj">
              {t("timeAttack")}
            </a>
          </div>
        </div>
        <div className="pitch-preview" aria-hidden="true">
          <div className="pitch-lines" />
          <div className="hero-player">
            <span>?</span>
          </div>
        </div>
      </section>

      <section className="progress-card">
        <div>
          <p className="eyebrow">{t("level")} {progression.level}</p>
          <h2>{progression.title}</h2>
        </div>
        <div className="xp-track" aria-label="XP progress">
          <span style={{ width: `${xp.percent}%` }} />
        </div>
        <p>{progression.xpTotal} XP · {xp.remaining} XP para el siguiente nivel</p>
      </section>

      <section className="home-stats">
        <article>
          <span>Daily streak</span>
          <strong>{stats.currentStreak}</strong>
        </article>
        <article>
          <span>Total score</span>
          <strong>{stats.totalScore}</strong>
        </article>
        <article>
          <span>Weekly special</span>
          <strong>{weekly.title}</strong>
        </article>
      </section>

      <section className="mode-grid">
        {getModeCards().map((mode) => (
          <a className="mode-card" href={`/jugar?modo=${mode.id}`} key={mode.id}>
            <span>{mode.shortLabel}</span>
            <h2>{translateModeLabel(mode.id, t, mode.label)}</h2>
            <p>{mode.weekly ? `Special: ${weekly.title}` : mode.description}</p>
          </a>
        ))}
      </section>

      <AgeGroupSelector selectedAgeGroupId={ageGroupId} onChange={handleAgeGroupChange} />

      <section className="daily-strip">
        <div>
          <p className="eyebrow">Daily player</p>
          <h2>{t("dailyChallenge")} · {ageGroup.shortTitle}</h2>
        </div>
        <p>
          Next in {getTimeToNextChallenge()} · {player.dificultad} · {ageGroup.difficultyLabel}
        </p>
      </section>

      {PLATFORM_CONFIG.platform === "web" && <InternalAdBanner placement="home" />}

      <div className="quick-links">
        <a href="/estadisticas">{t("stats")}</a>
        <a href="/ranking">{t("ranking")}</a>
        <a href="/ajustes">{t("settings")}</a>
        <a href="/personalizar">{t("customize")}</a>
      </div>
      <Disclaimer />
      {PLATFORM_CONFIG.platform === "web" && <AdBanner placement="bottom" />}
    </div>
  );
}

function Tutorial({ t, onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="modal-card tutorial-card">
        <p className="eyebrow">Quick tutorial</p>
        <ol>
          <li>{t("readClues")}</li>
          <li>{t("typeAnswer")}</li>
          <li>{t("useExtra")}</li>
          <li>{t("scoreEarly")}</li>
        </ol>
        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={() => onClose(false)}>
            Skip
          </button>
          <button className="primary-button" type="button" onClick={() => onClose(true)}>
            {t("gotItPlay")}
          </button>
        </div>
      </section>
    </div>
  );
}

function translateModeLabel(modeId, t, fallback) {
  const map = {
    diario: "dailyChallenge",
    rapido: "quickMatch",
    supervivencia: "survival",
    contrarreloj: "timeAttack",
    "liga-espanola": "spanishLeague",
    mundiales: "worldCup",
    "clubes-europeos": "europeanClubs",
    entrenamiento: "practice"
  };
  return map[modeId] ? t(map[modeId]) : fallback;
}
